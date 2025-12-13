# Post-Subagent Script
# Runs after a Task tool completes to track results

param(
    [string]$WorkspaceRoot = ".",
    [string]$ToolResult = ""
)

$ProgressPath = Join-Path $WorkspaceRoot "RLM/progress"
$SessionFile = Join-Path $ProgressPath "token-usage/current-session.json"
$StatusFile = Join-Path $ProgressPath "status.json"
$ManifestDir = Join-Path $ProgressPath "manifests"

# Ensure manifest directory exists
New-Item -ItemType Directory -Force -Path $ManifestDir | Out-Null

if (-not (Test-Path $SessionFile)) {
    Write-Host "Warning: No active session found"
    exit 0
}

$Session = Get-Content $SessionFile -Raw | ConvertFrom-Json
$Timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Find the most recent in_progress call and mark complete
$CallsArray = @($Session.subagent_calls)
for ($i = $CallsArray.Count - 1; $i -ge 0; $i--) {
    if ($CallsArray[$i].status -eq "in_progress") {
        $CallsArray[$i].status = "completed"
        $CallsArray[$i].completed_at = $Timestamp
        break
    }
}
$Session.subagent_calls = $CallsArray

# Check for completion manifest files
$ManifestFiles = Get-ChildItem -Path $ManifestDir -Filter "*.json" -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-5) }

foreach ($ManifestFile in $ManifestFiles) {
    try {
        $Manifest = Get-Content $ManifestFile.FullName -Raw | ConvertFrom-Json

        # VERIFY FILES ACTUALLY EXIST
        $FilesCreated = @($Manifest.files_created)
        $FilesModified = @($Manifest.files_modified)
        $MissingFiles = @()
        $VerifiedFiles = @()

        foreach ($File in ($FilesCreated + $FilesModified)) {
            if ($File) {
                $FullPath = if ([System.IO.Path]::IsPathRooted($File)) { $File } else { Join-Path $WorkspaceRoot $File }
                if (Test-Path $FullPath) {
                    $VerifiedFiles += $File
                } else {
                    $MissingFiles += $File
                    Write-Host "WARNING: File claimed but NOT FOUND: $File" -ForegroundColor Yellow
                }
            }
        }

        # Update manifest with verification results
        $Manifest | Add-Member -NotePropertyName "verified_files" -NotePropertyValue $VerifiedFiles -Force
        $Manifest | Add-Member -NotePropertyName "missing_files" -NotePropertyValue $MissingFiles -Force
        $Manifest | Add-Member -NotePropertyName "verification_passed" -NotePropertyValue ($MissingFiles.Count -eq 0) -Force

        # If files are missing, mark as PARTIAL not completed
        if ($MissingFiles.Count -gt 0 -and $Manifest.status -eq "completed") {
            Write-Host "RELIABILITY ISSUE: Sub-agent claimed completion but $($MissingFiles.Count) files missing!" -ForegroundColor Red
            Write-Host "Missing: $($MissingFiles -join ', ')" -ForegroundColor Red
            $Manifest.status = "partial"

            # Send alert event
            $AlertDetails = @{
                task_id = $Manifest.task_id
                missing_files = $MissingFiles
                verified_files = $VerifiedFiles
            } | ConvertTo-Json -Compress

            & powershell -ExecutionPolicy Bypass -File "$WorkspaceRoot/.claude/scripts/send-event.ps1" `
                -EventType "subagent_incomplete" `
                -ToolName "verification" `
                -DetailsJson $AlertDetails `
                -WorkspaceRoot $WorkspaceRoot 2>$null
        }

        # Process task completion
        if ($Manifest.task_id) {
            $TaskId = $Manifest.task_id

            # Update session - only if fully verified
            if ($Manifest.status -eq "completed" -and $Manifest.verification_passed) {
                if (-not $Session.tasks_completed) { $Session.tasks_completed = @() }
                $Session.tasks_completed += $TaskId
            }

            # Update status.json
            if (Test-Path $StatusFile) {
                $Status = Get-Content $StatusFile -Raw | ConvertFrom-Json

                if (-not $Status.tasks) { $Status.tasks = @{} }

                # Convert to hashtable for modification
                $TasksHash = @{}
                $Status.tasks.PSObject.Properties | ForEach-Object { $TasksHash[$_.Name] = $_.Value }

                $TasksHash[$TaskId] = @{
                    status = $Manifest.status
                    completedAt = $Timestamp
                    filesCreated = $Manifest.files_created
                    filesModified = $Manifest.files_modified
                    testsAdded = $Manifest.tests_added
                }

                $Status.tasks = $TasksHash
                $Status.lastUpdate = $Timestamp

                # Update metrics
                $CompletedCount = ($TasksHash.Values | Where-Object { $_.status -eq "completed" }).Count
                $Status.metrics.completed = $CompletedCount

                $Status | ConvertTo-Json -Depth 10 | Set-Content -Path $StatusFile -Encoding UTF8
            }

            # Move task file if completed AND verified
            if ($Manifest.status -eq "completed" -and $Manifest.verification_passed) {
                $ActiveTask = Join-Path $WorkspaceRoot "RLM/tasks/active/$TaskId.md"
                $CompletedTask = Join-Path $WorkspaceRoot "RLM/tasks/completed/$TaskId.md"

                if (Test-Path $ActiveTask) {
                    # Ensure completed directory exists
                    New-Item -ItemType Directory -Force -Path (Join-Path $WorkspaceRoot "RLM/tasks/completed") | Out-Null
                    Move-Item -Path $ActiveTask -Destination $CompletedTask -Force
                    Write-Host "Task $TaskId VERIFIED and moved to completed/"
                }
            } elseif ($Manifest.status -eq "partial") {
                # Move to blocked if verification failed
                $ActiveTask = Join-Path $WorkspaceRoot "RLM/tasks/active/$TaskId.md"
                $BlockedTask = Join-Path $WorkspaceRoot "RLM/tasks/blocked/$TaskId.md"

                if (Test-Path $ActiveTask) {
                    New-Item -ItemType Directory -Force -Path (Join-Path $WorkspaceRoot "RLM/tasks/blocked") | Out-Null
                    Move-Item -Path $ActiveTask -Destination $BlockedTask -Force
                    Write-Host "Task $TaskId moved to BLOCKED (verification failed)" -ForegroundColor Yellow
                }
            }

            # Log completion with verification status
            $LogFile = Join-Path $ProgressPath "logs/$(Get-Date -Format 'yyyy-MM-dd').md"
            $VerifyIcon = if ($Manifest.verification_passed) { "✅" } else { "⚠️" }
            $LogEntry = @"

## $(Get-Date -Format 'HH:mm') Task $($Manifest.status): $TaskId $VerifyIcon

**Verification**: $(if ($Manifest.verification_passed) { "PASSED" } else { "FAILED - $($MissingFiles.Count) files missing" })
**Files Verified**: $($VerifiedFiles -join ', ')
**Files Missing**: $(if ($MissingFiles.Count -gt 0) { $MissingFiles -join ', ' } else { "None" })
**Tests Added**: $($Manifest.tests_added)

---
"@
            Add-Content -Path $LogFile -Value $LogEntry -Encoding UTF8
        }

        # Archive processed manifest
        $ArchiveDir = Join-Path $ManifestDir "processed"
        New-Item -ItemType Directory -Force -Path $ArchiveDir | Out-Null
        Move-Item -Path $ManifestFile.FullName -Destination (Join-Path $ArchiveDir $ManifestFile.Name) -Force

    } catch {
        Write-Host "Warning: Could not process manifest $($ManifestFile.Name): $_"
    }
}

# Save session
$Session | ConvertTo-Json -Depth 10 | Set-Content -Path $SessionFile -Encoding UTF8

Write-Host "Sub-agent call completed. Total calls: $($Session.metrics.total_subagent_calls)"
