# Session Start Script
# Initializes a new RLM session with tracking

param(
    [string]$WorkspaceRoot = "."
)

$ProgressPath = Join-Path $WorkspaceRoot "RLM/progress"
$TokenUsagePath = Join-Path $ProgressPath "token-usage"
$StatusFile = Join-Path $ProgressPath "status.json"
$SessionFile = Join-Path $TokenUsagePath "current-session.json"

# Ensure directories exist
New-Item -ItemType Directory -Force -Path $TokenUsagePath | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $ProgressPath "logs") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $ProgressPath "bundles") | Out-Null

# Generate session ID
$SessionId = "SESSION-" + (Get-Date -Format "yyyy-MM-dd-HHmmss")
$Timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Create session tracking file
$Session = @{
    session_id = $SessionId
    started_at = $Timestamp
    workspace = $WorkspaceRoot
    subagent_calls = @()
    files_written = @()
    tasks_started = @()
    tasks_completed = @()
    metrics = @{
        total_subagent_calls = 0
        files_created = 0
        files_modified = 0
    }
}

$Session | ConvertTo-Json -Depth 10 | Set-Content -Path $SessionFile -Encoding UTF8

# Update status.json with session info
if (Test-Path $StatusFile) {
    $Status = Get-Content $StatusFile -Raw | ConvertFrom-Json
} else {
    $Status = @{
        lastUpdate = ""
        tasks = @{}
        features = @{}
        metrics = @{
            totalTasks = 0
            completed = 0
            inProgress = 0
            blocked = 0
            pending = 0
            velocity = 0
        }
        featureMetrics = @{
            totalFeatures = 0
            verified = 0
            verificationPending = 0
            verificationFailed = 0
            inProgress = 0
        }
        sprint = @{
            current = ""
            startDate = ""
            endDate = ""
            daysRemaining = 0
        }
    }
}

$Status.lastUpdate = $Timestamp
$Status | Add-Member -NotePropertyName "currentSession" -NotePropertyValue $SessionId -Force

$Status | ConvertTo-Json -Depth 10 | Set-Content -Path $StatusFile -Encoding UTF8

# Log session start
$LogFile = Join-Path $ProgressPath "logs/$(Get-Date -Format 'yyyy-MM-dd').md"
$LogEntry = @"

## $(Get-Date -Format 'HH:mm') Session Started: $SessionId

---
"@
Add-Content -Path $LogFile -Value $LogEntry -Encoding UTF8

Write-Host "RLM Session initialized: $SessionId"
