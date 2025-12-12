# Capture Session Cost Script
# Captures cost data from Claude Code /cost command output
# Run this at session end or call from SessionEnd hook

param(
    [string]$WorkspaceRoot = ".",
    [string]$CostOutput = "",
    [string]$SessionId = ""
)

$ProgressPath = Join-Path $WorkspaceRoot "RLM/progress"
$TokenUsagePath = Join-Path $ProgressPath "token-usage"

# Ensure directory exists
New-Item -ItemType Directory -Force -Path $TokenUsagePath | Out-Null

$Timestamp = (Get-Date).ToUniversalTime().ToString("o")
$DateStr = Get-Date -Format "yyyy-MM-dd"

if (-not $SessionId) {
    $SessionId = "SESSION-" + (Get-Date -Format "yyyy-MM-dd-HHmmss")
}

# Parse /cost output if provided
# Format: "Total cost: $0.55\nTotal duration (API): 6m 19.7s\nTotal duration (wall): 6h 33m 10.2s\nTotal code changes: 0 lines added, 0 lines removed"

$CostData = @{
    session_id = $SessionId
    captured_at = $Timestamp
    source = "claude_code_cost_command"
    raw_output = $CostOutput
    parsed = @{
        total_cost_usd = $null
        api_duration_seconds = $null
        wall_duration_seconds = $null
        lines_added = $null
        lines_removed = $null
    }
    estimation = @{
        # Rough estimation: $0.01 per ~1000 tokens (varies by model)
        estimated_tokens = $null
    }
}

if ($CostOutput) {
    # Parse total cost
    if ($CostOutput -match 'Total cost:\s*\$?([\d.]+)') {
        $CostData.parsed.total_cost_usd = [double]$Matches[1]
        # Estimate tokens: ~$0.003 per 1K input, ~$0.015 per 1K output (Claude Sonnet)
        # Average ~$0.009 per 1K tokens blended
        $CostData.estimation.estimated_tokens = [math]::Round($CostData.parsed.total_cost_usd / 0.000009)
    }

    # Parse API duration
    if ($CostOutput -match 'Total duration \(API\):\s*([\d.]+)([hms])') {
        $Value = [double]$Matches[1]
        $Unit = $Matches[2]
        switch ($Unit) {
            'h' { $CostData.parsed.api_duration_seconds = $Value * 3600 }
            'm' { $CostData.parsed.api_duration_seconds = $Value * 60 }
            's' { $CostData.parsed.api_duration_seconds = $Value }
        }
    }

    # Parse wall duration
    if ($CostOutput -match 'Total duration \(wall\):\s*([\d.]+)([hms])') {
        $Value = [double]$Matches[1]
        $Unit = $Matches[2]
        switch ($Unit) {
            'h' { $CostData.parsed.wall_duration_seconds = $Value * 3600 }
            'm' { $CostData.parsed.wall_duration_seconds = $Value * 60 }
            's' { $CostData.parsed.wall_duration_seconds = $Value }
        }
    }

    # Parse code changes
    if ($CostOutput -match '(\d+)\s*lines?\s*added') {
        $CostData.parsed.lines_added = [int]$Matches[1]
    }
    if ($CostOutput -match '(\d+)\s*lines?\s*removed') {
        $CostData.parsed.lines_removed = [int]$Matches[1]
    }
}

# Try to read current session file and merge data
$CurrentSessionFile = Join-Path $TokenUsagePath "current-session.json"
if (Test-Path $CurrentSessionFile) {
    try {
        $CurrentSession = Get-Content $CurrentSessionFile -Raw | ConvertFrom-Json
        $CostData | Add-Member -NotePropertyName "session_data" -NotePropertyValue $CurrentSession -Force
    } catch {
        Write-Host "Warning: Could not read current session file"
    }
}

# Write cost capture file
$CostFile = Join-Path $TokenUsagePath "cost-$SessionId.json"
$CostData | ConvertTo-Json -Depth 10 | Set-Content -Path $CostFile -Encoding UTF8

# Also append to daily summary
$DailySummaryFile = Join-Path $TokenUsagePath "daily-$DateStr.json"
if (Test-Path $DailySummaryFile) {
    $DailySummary = Get-Content $DailySummaryFile -Raw | ConvertFrom-Json
} else {
    $DailySummary = @{
        date = $DateStr
        sessions = @()
        totals = @{
            total_cost_usd = 0
            estimated_tokens = 0
            sessions_count = 0
        }
    }
}

# Add this session
$SessionSummary = @{
    session_id = $SessionId
    cost_usd = $CostData.parsed.total_cost_usd
    estimated_tokens = $CostData.estimation.estimated_tokens
    captured_at = $Timestamp
}

$DailySummary.sessions += $SessionSummary
if ($CostData.parsed.total_cost_usd) {
    $DailySummary.totals.total_cost_usd += $CostData.parsed.total_cost_usd
}
if ($CostData.estimation.estimated_tokens) {
    $DailySummary.totals.estimated_tokens += $CostData.estimation.estimated_tokens
}
$DailySummary.totals.sessions_count++

$DailySummary | ConvertTo-Json -Depth 10 | Set-Content -Path $DailySummaryFile -Encoding UTF8

Write-Host "Session cost captured: $CostFile"
if ($CostData.parsed.total_cost_usd) {
    Write-Host "Cost: `$$($CostData.parsed.total_cost_usd) (~$($CostData.estimation.estimated_tokens) tokens estimated)"
}
