# Session End Script
# Finalizes session and generates summary

param(
    [string]$WorkspaceRoot = "."
)

$ProgressPath = Join-Path $WorkspaceRoot "RLM/progress"
$TokenUsagePath = Join-Path $ProgressPath "token-usage"
$SessionFile = Join-Path $TokenUsagePath "current-session.json"

if (-not (Test-Path $SessionFile)) {
    Write-Host "No active session to end"
    exit 0
}

$Session = Get-Content $SessionFile -Raw | ConvertFrom-Json
$Timestamp = (Get-Date).ToUniversalTime().ToString("o")

# Calculate session duration
$StartTime = [DateTime]::Parse($Session.started_at)
$EndTime = Get-Date
$Duration = $EndTime - $StartTime

$Session | Add-Member -NotePropertyName "ended_at" -NotePropertyValue $Timestamp -Force
$Session | Add-Member -NotePropertyName "duration_minutes" -NotePropertyValue [math]::Round($Duration.TotalMinutes, 2) -Force

# Archive session file
$ArchiveFile = Join-Path $TokenUsagePath "$($Session.session_id).json"
$Session | ConvertTo-Json -Depth 10 | Set-Content -Path $ArchiveFile -Encoding UTF8

# Generate summary
$Summary = @"

## $(Get-Date -Format 'HH:mm') Session Ended: $($Session.session_id)

**Duration**: $([math]::Round($Duration.TotalMinutes, 1)) minutes
**Sub-agent Calls**: $($Session.metrics.total_subagent_calls)
**Files Created**: $($Session.metrics.files_created)
**Files Modified**: $($Session.metrics.files_modified)
**Tasks Completed**: $($Session.tasks_completed.Count)

---
"@

$LogFile = Join-Path $ProgressPath "logs/$(Get-Date -Format 'yyyy-MM-dd').md"
Add-Content -Path $LogFile -Value $Summary -Encoding UTF8

# Clear current session file
Remove-Item -Path $SessionFile -Force

Write-Host "Session ended: $($Session.session_id)"
Write-Host "Duration: $([math]::Round($Duration.TotalMinutes, 1)) minutes"
Write-Host "Sub-agent calls: $($Session.metrics.total_subagent_calls)"
Write-Host "Tasks completed: $($Session.tasks_completed.Count)"
