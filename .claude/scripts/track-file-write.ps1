# Track File Write Script
# Logs when files are written during a session

param(
    [string]$WorkspaceRoot = ".",
    [string]$FilePath = ""
)

$ProgressPath = Join-Path $WorkspaceRoot "RLM/progress"
$SessionFile = Join-Path $ProgressPath "token-usage/current-session.json"

if (-not (Test-Path $SessionFile)) {
    exit 0
}

$Session = Get-Content $SessionFile -Raw | ConvertFrom-Json
$Timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Track the file write
$FileRecord = @{
    path = $FilePath
    timestamp = $Timestamp
    type = if (Test-Path $FilePath) { "modified" } else { "created" }
}

if (-not $Session.files_written) {
    $Session.files_written = @()
}
$Session.files_written += $FileRecord

# Update metrics
if ($FileRecord.type -eq "created") {
    $Session.metrics.files_created++
} else {
    $Session.metrics.files_modified++
}

$Session | ConvertTo-Json -Depth 10 | Set-Content -Path $SessionFile -Encoding UTF8
