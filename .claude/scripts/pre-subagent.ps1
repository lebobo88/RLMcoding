# Pre-Subagent Script
# Runs before a Task tool call to track sub-agent spawning

param(
    [string]$WorkspaceRoot = "."
)

$ProgressPath = Join-Path $WorkspaceRoot "RLM/progress"
$SessionFile = Join-Path $ProgressPath "token-usage/current-session.json"

if (-not (Test-Path $SessionFile)) {
    # No active session, initialize one
    & (Join-Path $WorkspaceRoot ".claude/scripts/session-start.ps1") -WorkspaceRoot $WorkspaceRoot
}

$Session = Get-Content $SessionFile -Raw | ConvertFrom-Json
$Timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Increment call counter
$CallNumber = $Session.metrics.total_subagent_calls + 1
$Session.metrics.total_subagent_calls = $CallNumber

# Add pending call record
$PendingCall = @{
    call_number = $CallNumber
    started_at = $Timestamp
    status = "in_progress"
}

if (-not $Session.subagent_calls) {
    $Session.subagent_calls = @()
}
$Session.subagent_calls += $PendingCall

$Session | ConvertTo-Json -Depth 10 | Set-Content -Path $SessionFile -Encoding UTF8

Write-Host "Sub-agent call #$CallNumber starting..."
