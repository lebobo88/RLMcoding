# verify-tasks.ps1 - Verify that completed tasks actually have their files
# This script audits task completion and catches sub-agent reliability issues

param(
    [string]$WorkspaceRoot = ".",
    [string]$Scope = "completed",  # completed, active, all, or TASK-XXX
    [switch]$Fix = $false,         # Move unverified tasks back to active
    [switch]$Verbose = $false
)

$TasksActive = Join-Path $WorkspaceRoot "RLM/tasks/active"
$TasksCompleted = Join-Path $WorkspaceRoot "RLM/tasks/completed"
$TasksBlocked = Join-Path $WorkspaceRoot "RLM/tasks/blocked"
$ManifestDir = Join-Path $WorkspaceRoot "RLM/progress/manifests"
$ProcessedDir = Join-Path $ManifestDir "processed"

# Results tracking
$Results = @{
    Verified = @()
    MissingFiles = @()
    NoManifest = @()
    Errors = @()
}

function Get-TaskFiles {
    param([string]$Scope)

    $Files = @()

    if ($Scope -match "^TASK-\d+$") {
        # Specific task
        $Paths = @(
            (Join-Path $TasksActive "$Scope.md"),
            (Join-Path $TasksCompleted "$Scope.md"),
            (Join-Path $TasksBlocked "$Scope.md")
        )
        foreach ($P in $Paths) {
            if (Test-Path $P) { $Files += Get-Item $P }
        }
    } else {
        switch ($Scope) {
            "completed" {
                if (Test-Path $TasksCompleted) {
                    $Files += Get-ChildItem -Path $TasksCompleted -Filter "*.md" -ErrorAction SilentlyContinue
                }
            }
            "active" {
                if (Test-Path $TasksActive) {
                    $Files += Get-ChildItem -Path $TasksActive -Filter "*.md" -ErrorAction SilentlyContinue
                }
            }
            "all" {
                if (Test-Path $TasksActive) {
                    $Files += Get-ChildItem -Path $TasksActive -Filter "*.md" -ErrorAction SilentlyContinue
                }
                if (Test-Path $TasksCompleted) {
                    $Files += Get-ChildItem -Path $TasksCompleted -Filter "*.md" -ErrorAction SilentlyContinue
                }
                if (Test-Path $TasksBlocked) {
                    $Files += Get-ChildItem -Path $TasksBlocked -Filter "*.md" -ErrorAction SilentlyContinue
                }
            }
        }
    }

    return $Files
}

function Find-Manifest {
    param([string]$TaskId)

    # Check current manifests
    $Current = Get-ChildItem -Path $ManifestDir -Filter "$TaskId-*.json" -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if ($Current) { return $Current }

    # Check processed manifests
    if (Test-Path $ProcessedDir) {
        $Processed = Get-ChildItem -Path $ProcessedDir -Filter "$TaskId-*.json" -ErrorAction SilentlyContinue |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1

        if ($Processed) { return $Processed }
    }

    return $null
}

function Verify-TaskFiles {
    param(
        [string]$TaskId,
        [object]$Manifest
    )

    $Result = @{
        TaskId = $TaskId
        Status = "unknown"
        FilesExpected = @()
        FilesVerified = @()
        FilesMissing = @()
        HasManifest = $false
    }

    if (-not $Manifest) {
        $Result.Status = "no_manifest"
        return $Result
    }

    $Result.HasManifest = $true
    $FilesToCheck = @()

    if ($Manifest.files_created) {
        $FilesToCheck += @($Manifest.files_created)
    }
    if ($Manifest.files_modified) {
        $FilesToCheck += @($Manifest.files_modified)
    }

    $Result.FilesExpected = $FilesToCheck

    foreach ($File in $FilesToCheck) {
        if (-not $File) { continue }

        $FullPath = if ([System.IO.Path]::IsPathRooted($File)) {
            $File
        } else {
            Join-Path $WorkspaceRoot $File
        }

        if (Test-Path $FullPath) {
            $Result.FilesVerified += $File
        } else {
            $Result.FilesMissing += $File
        }
    }

    if ($Result.FilesMissing.Count -eq 0 -and $Result.FilesVerified.Count -gt 0) {
        $Result.Status = "verified"
    } elseif ($Result.FilesMissing.Count -gt 0) {
        $Result.Status = "missing_files"
    } else {
        $Result.Status = "no_files_listed"
    }

    return $Result
}

# Main execution
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 TASK VERIFICATION" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Scope: $Scope"
Write-Host "Workspace: $WorkspaceRoot"
Write-Host ""

$TaskFiles = Get-TaskFiles -Scope $Scope

if ($TaskFiles.Count -eq 0) {
    Write-Host "No tasks found for scope: $Scope" -ForegroundColor Yellow
    exit 0
}

Write-Host "Tasks to verify: $($TaskFiles.Count)"
Write-Host ""

foreach ($TaskFile in $TaskFiles) {
    $TaskId = $TaskFile.BaseName

    if ($Verbose) {
        Write-Host "Checking $TaskId..." -ForegroundColor Gray
    }

    # Find manifest
    $ManifestFile = Find-Manifest -TaskId $TaskId
    $Manifest = $null

    if ($ManifestFile) {
        try {
            $Manifest = Get-Content $ManifestFile.FullName -Raw | ConvertFrom-Json
        } catch {
            $Results.Errors += @{ TaskId = $TaskId; Error = "Failed to parse manifest" }
            continue
        }
    }

    # Verify files
    $VerifyResult = Verify-TaskFiles -TaskId $TaskId -Manifest $Manifest

    switch ($VerifyResult.Status) {
        "verified" {
            $Results.Verified += $VerifyResult
        }
        "missing_files" {
            $Results.MissingFiles += $VerifyResult
        }
        "no_manifest" {
            $Results.NoManifest += $VerifyResult
        }
        default {
            $Results.Errors += $VerifyResult
        }
    }
}

# Output results
Write-Host ""
Write-Host "VERIFIED ✅" -ForegroundColor Green
if ($Results.Verified.Count -gt 0) {
    foreach ($V in $Results.Verified) {
        Write-Host "  $($V.TaskId): $($V.FilesVerified.Count) files" -ForegroundColor Green
    }
} else {
    Write-Host "  (none)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "MISSING FILES ⚠️" -ForegroundColor Yellow
if ($Results.MissingFiles.Count -gt 0) {
    foreach ($M in $Results.MissingFiles) {
        Write-Host "  $($M.TaskId): Missing $($M.FilesMissing.Count) of $($M.FilesExpected.Count)" -ForegroundColor Yellow
        foreach ($File in $M.FilesMissing) {
            Write-Host "    └─ $File" -ForegroundColor Red
        }

        # Fix if requested
        if ($Fix) {
            $CurrentPath = Get-ChildItem -Path @($TasksActive, $TasksCompleted, $TasksBlocked) -Filter "$($M.TaskId).md" -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($CurrentPath -and $CurrentPath.Directory.Name -eq "completed") {
                $NewPath = Join-Path $TasksActive "$($M.TaskId).md"
                Move-Item -Path $CurrentPath.FullName -Destination $NewPath -Force
                Write-Host "    → Moved back to active/" -ForegroundColor Cyan
            }
        }
    }
} else {
    Write-Host "  (none)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "NO MANIFEST ❓" -ForegroundColor Magenta
if ($Results.NoManifest.Count -gt 0) {
    foreach ($N in $Results.NoManifest) {
        Write-Host "  $($N.TaskId): No completion manifest found" -ForegroundColor Magenta
    }
} else {
    Write-Host "  (none)" -ForegroundColor Gray
}

# Summary
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  Total Checked:  $($TaskFiles.Count)"
Write-Host "  Verified:       $($Results.Verified.Count)" -ForegroundColor Green
Write-Host "  Missing Files:  $($Results.MissingFiles.Count)" -ForegroundColor $(if ($Results.MissingFiles.Count -gt 0) { "Yellow" } else { "Gray" })
Write-Host "  No Manifest:    $($Results.NoManifest.Count)" -ForegroundColor $(if ($Results.NoManifest.Count -gt 0) { "Magenta" } else { "Gray" })
Write-Host ""

# Output JSON for programmatic use
$OutputJson = @{
    scope = $Scope
    timestamp = (Get-Date).ToUniversalTime().ToString("o")
    total = $TaskFiles.Count
    verified = $Results.Verified.Count
    missing_files = $Results.MissingFiles.Count
    no_manifest = $Results.NoManifest.Count
    details = @{
        verified = $Results.Verified | ForEach-Object { $_.TaskId }
        missing_files = $Results.MissingFiles | ForEach-Object {
            @{ task_id = $_.TaskId; missing = $_.FilesMissing }
        }
        no_manifest = $Results.NoManifest | ForEach-Object { $_.TaskId }
    }
} | ConvertTo-Json -Depth 5

# Save report
$ReportDir = Join-Path $WorkspaceRoot "RLM/progress/reports"
New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null
$ReportFile = Join-Path $ReportDir "verification-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$OutputJson | Set-Content -Path $ReportFile -Encoding UTF8

Write-Host "Report saved: $ReportFile"
Write-Host ""

# Exit with error code if issues found
if ($Results.MissingFiles.Count -gt 0) {
    exit 1
}
exit 0
