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

        # Process task completion
        if ($Manifest.task_id) {
            $TaskId = $Manifest.task_id

            # Update session
            if ($Manifest.status -eq "completed") {
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

            # Move task file if completed
            if ($Manifest.status -eq "completed") {
                $ActiveTask = Join-Path $WorkspaceRoot "RLM/tasks/active/$TaskId.md"
                $CompletedTask = Join-Path $WorkspaceRoot "RLM/tasks/completed/$TaskId.md"

                if (Test-Path $ActiveTask) {
                    # Ensure completed directory exists
                    New-Item -ItemType Directory -Force -Path (Join-Path $WorkspaceRoot "RLM/tasks/completed") | Out-Null
                    Move-Item -Path $ActiveTask -Destination $CompletedTask -Force
                    Write-Host "Task $TaskId moved to completed/"
                }
            }

            # Log completion
            $LogFile = Join-Path $ProgressPath "logs/$(Get-Date -Format 'yyyy-MM-dd').md"
            $LogEntry = @"

## $(Get-Date -Format 'HH:mm') Task $($Manifest.status): $TaskId

**Files Created**: $($Manifest.files_created -join ', ')
**Files Modified**: $($Manifest.files_modified -join ', ')
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
