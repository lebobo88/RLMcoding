# Write Manifest Script
# Called by sub-agents to report their completion status
# This is the KEY script that ensures sub-agent work is tracked

param(
    [string]$WorkspaceRoot = ".",
    [string]$TaskId = "",
    [string]$Status = "completed",
    [string]$FilesCreated = "",
    [string]$FilesModified = "",
    [int]$TestsAdded = 0,
    [string]$Notes = ""
)

$ProgressPath = Join-Path $WorkspaceRoot "RLM/progress"
$ManifestDir = Join-Path $ProgressPath "manifests"

# Ensure directory exists
New-Item -ItemType Directory -Force -Path $ManifestDir | Out-Null

$Timestamp = (Get-Date).ToUniversalTime().ToString("o")
$ManifestId = "$TaskId-$(Get-Date -Format 'HHmmss')"

$Manifest = @{
    manifest_id = $ManifestId
    task_id = $TaskId
    status = $Status
    timestamp = $Timestamp
    files_created = if ($FilesCreated) { $FilesCreated -split "," | ForEach-Object { $_.Trim() } } else { @() }
    files_modified = if ($FilesModified) { $FilesModified -split "," | ForEach-Object { $_.Trim() } } else { @() }
    tests_added = $TestsAdded
    notes = $Notes
}

$ManifestFile = Join-Path $ManifestDir "$ManifestId.json"
$Manifest | ConvertTo-Json -Depth 5 | Set-Content -Path $ManifestFile -Encoding UTF8

Write-Host "Manifest written: $ManifestFile"
Write-Host "Task: $TaskId | Status: $Status | Files: $($Manifest.files_created.Count) created, $($Manifest.files_modified.Count) modified"
