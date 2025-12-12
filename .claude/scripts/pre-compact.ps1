# Pre-Compact Hook Script
# Triggered when Claude Code is about to compact/summarize context
# This indicates the context window is reaching limits

param(
    [string]$WorkspaceRoot = "."
)

$ProgressPath = Join-Path $WorkspaceRoot "RLM/progress"
$TokenUsagePath = Join-Path $ProgressPath "token-usage"
$LogsPath = Join-Path $ProgressPath "logs"

# Ensure directories exist
New-Item -ItemType Directory -Force -Path $TokenUsagePath | Out-Null
New-Item -ItemType Directory -Force -Path $LogsPath | Out-Null

$Timestamp = (Get-Date).ToUniversalTime().ToString("o")
$DateStr = Get-Date -Format "yyyy-MM-dd"
$TimeStr = Get-Date -Format "HH:mm:ss"

# Read current session file
$CurrentSessionFile = Join-Path $TokenUsagePath "current-session.json"
$SessionData = $null

if (Test-Path $CurrentSessionFile) {
    try {
        $SessionData = Get-Content $CurrentSessionFile -Raw | ConvertFrom-Json
    } catch {
        Write-Host "Warning: Could not read current session file"
    }
}

# Create compact event record
$CompactEvent = @{
    event = "context_compact"
    timestamp = $Timestamp
    reason = "context_limit_approaching"
    session_id = if ($SessionData) { $SessionData.session_id } else { "UNKNOWN" }
    metrics_at_compact = @{
        subagent_calls = if ($SessionData -and $SessionData.metrics) { $SessionData.metrics.total_subagent_calls } else { 0 }
        files_created = if ($SessionData -and $SessionData.metrics) { $SessionData.metrics.files_created } else { 0 }
        files_modified = if ($SessionData -and $SessionData.metrics) { $SessionData.metrics.files_modified } else { 0 }
    }
}

# Write compact event to log
$CompactLogFile = Join-Path $TokenUsagePath "compact-events.json"
$CompactEvents = @()

if (Test-Path $CompactLogFile) {
    try {
        $ExistingEvents = Get-Content $CompactLogFile -Raw | ConvertFrom-Json
        if ($ExistingEvents -is [array]) {
            $CompactEvents = $ExistingEvents
        } else {
            $CompactEvents = @($ExistingEvents)
        }
    } catch {
        $CompactEvents = @()
    }
}

$CompactEvents += $CompactEvent
$CompactEvents | ConvertTo-Json -Depth 10 | Set-Content -Path $CompactLogFile -Encoding UTF8

# Update current session with compact warning
if ($SessionData) {
    if (-not $SessionData.PSObject.Properties['context_compacts']) {
        $SessionData | Add-Member -NotePropertyName "context_compacts" -NotePropertyValue @() -Force
    }
    $SessionData.context_compacts += @{
        timestamp = $Timestamp
        subagent_calls_at_compact = $CompactEvent.metrics_at_compact.subagent_calls
    }
    $SessionData | ConvertTo-Json -Depth 10 | Set-Content -Path $CurrentSessionFile -Encoding UTF8
}

# Append to daily log
$DailyLogFile = Join-Path $LogsPath "$DateStr.md"
$LogEntry = @"

## [$TimeStr] Context Compact Triggered

**Warning**: Context window limit approaching. Session will be summarized.
**Subagent Calls**: $($CompactEvent.metrics_at_compact.subagent_calls)
**Files Created**: $($CompactEvent.metrics_at_compact.files_created)
**Files Modified**: $($CompactEvent.metrics_at_compact.files_modified)

---
"@

Add-Content -Path $DailyLogFile -Value $LogEntry -Encoding UTF8

Write-Host "Context compact event logged at $Timestamp"
