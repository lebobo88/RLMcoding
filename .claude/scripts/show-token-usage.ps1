# Show Token Usage Script
# Displays current session token estimates and history

param(
    [string]$WorkspaceRoot = ".",
    [switch]$Detailed,
    [switch]$History
)

$ProgressPath = Join-Path $WorkspaceRoot "RLM/progress"
$TokenUsagePath = Join-Path $ProgressPath "token-usage"

$EstimatesFile = Join-Path $TokenUsagePath "token-estimates.json"
$CurrentSessionFile = Join-Path $TokenUsagePath "current-session.json"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 TOKEN USAGE SUMMARY" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Current Session Estimates
if (Test-Path $EstimatesFile) {
    try {
        $Estimates = Get-Content $EstimatesFile -Raw | ConvertFrom-Json

        Write-Host "Current Session Estimates" -ForegroundColor Yellow
        Write-Host "─────────────────────────" -ForegroundColor DarkGray

        $InputTokens = if ($Estimates.tokens.input_estimated) { $Estimates.tokens.input_estimated } else { 0 }
        $OutputTokens = if ($Estimates.tokens.output_estimated) { $Estimates.tokens.output_estimated } else { 0 }
        $TotalTokens = if ($Estimates.tokens.total_estimated) { $Estimates.tokens.total_estimated } else { 0 }
        $EstCost = if ($Estimates.estimated_cost_usd) { $Estimates.estimated_cost_usd } else { 0 }

        Write-Host "  Input Tokens:  ~$($InputTokens.ToString('N0'))"
        Write-Host "  Output Tokens: ~$($OutputTokens.ToString('N0'))"
        Write-Host "  Total Tokens:  ~$($TotalTokens.ToString('N0'))" -ForegroundColor White
        Write-Host "  Est. Cost:     ~`$$($EstCost.ToString('N4'))" -ForegroundColor Green
        Write-Host ""

        if ($Estimates.operations) {
            Write-Host "Operations" -ForegroundColor Yellow
            Write-Host "──────────" -ForegroundColor DarkGray
            Write-Host "  Files Read:      $($Estimates.operations.files_read)"
            Write-Host "  Files Written:   $($Estimates.operations.files_written)"
            Write-Host "  Files Edited:    $($Estimates.operations.files_edited)"
            Write-Host "  Subagents:       $($Estimates.operations.subagents_spawned)"
            Write-Host "  Tool Calls:      $($Estimates.operations.tool_calls)"
            Write-Host ""
        }

        if ($Detailed -and $Estimates.by_operation) {
            Write-Host "Recent Operations (last 10)" -ForegroundColor Yellow
            Write-Host "───────────────────────────" -ForegroundColor DarkGray
            $RecentOps = $Estimates.by_operation | Select-Object -Last 10
            foreach ($op in $RecentOps) {
                $time = if ($op.timestamp) {
                    ([datetime]$op.timestamp).ToString("HH:mm:ss")
                } else { "??:??:??" }
                $type = if ($op.type) { $op.type } else { "unknown" }
                $tokens = if ($op.tokens_added) { $op.tokens_added } else { 0 }
                $file = if ($op.file) {
                    $op.file -replace "^.*/", "" -replace "^.*\\", ""
                } else { "" }
                Write-Host "  [$time] $type +$tokens tokens" -NoNewline
                if ($file) { Write-Host " ($file)" -ForegroundColor DarkGray } else { Write-Host "" }
            }
            Write-Host ""
        }
    } catch {
        Write-Host "  No current session estimates available" -ForegroundColor DarkGray
        Write-Host ""
    }
} else {
    Write-Host "  No current session estimates available" -ForegroundColor DarkGray
    Write-Host ""
}

# Session tracking info
if (Test-Path $CurrentSessionFile) {
    try {
        $Session = Get-Content $CurrentSessionFile -Raw | ConvertFrom-Json
        Write-Host "Session Info" -ForegroundColor Yellow
        Write-Host "────────────" -ForegroundColor DarkGray
        Write-Host "  Session ID: $($Session.session_id)"
        Write-Host "  Started:    $($Session.started_at)"
        if ($Session.context_compacts -and $Session.context_compacts.Count -gt 0) {
            Write-Host "  Compacts:   $($Session.context_compacts.Count) (context was summarized)" -ForegroundColor Yellow
        }
        Write-Host ""
    } catch {}
}

# Historical data
if ($History) {
    Write-Host "Historical Usage" -ForegroundColor Yellow
    Write-Host "────────────────" -ForegroundColor DarkGray

    $DailyFiles = Get-ChildItem -Path $TokenUsagePath -Filter "daily-*.json" 2>$null | Sort-Object Name -Descending | Select-Object -First 7

    if ($DailyFiles) {
        $TotalHistoricalCost = 0
        $TotalHistoricalTokens = 0

        foreach ($file in $DailyFiles) {
            try {
                $DailyData = Get-Content $file.FullName -Raw | ConvertFrom-Json
                $Date = $file.Name -replace "daily-", "" -replace ".json", ""
                $Cost = if ($DailyData.totals.total_cost_usd) { $DailyData.totals.total_cost_usd } else { 0 }
                $Tokens = if ($DailyData.totals.estimated_tokens) { $DailyData.totals.estimated_tokens } else { 0 }
                $Sessions = if ($DailyData.totals.sessions_count) { $DailyData.totals.sessions_count } else { 0 }

                Write-Host "  $Date : $Sessions sessions, ~$($Tokens.ToString('N0')) tokens, `$$($Cost.ToString('N2'))"
                $TotalHistoricalCost += $Cost
                $TotalHistoricalTokens += $Tokens
            } catch {}
        }

        Write-Host ""
        Write-Host "  7-Day Total: ~$($TotalHistoricalTokens.ToString('N0')) tokens, `$$($TotalHistoricalCost.ToString('N2'))" -ForegroundColor White
    } else {
        Write-Host "  No historical data available" -ForegroundColor DarkGray
    }
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Estimates are approximate. For actual usage, use /cost command" -ForegroundColor DarkGray
Write-Host "      at session end, then run capture-session-cost.ps1" -ForegroundColor DarkGray
Write-Host ""
