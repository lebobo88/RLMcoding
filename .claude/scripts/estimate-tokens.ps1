# Token Estimation Script
# Estimates token usage based on file operations and tool activity
# Run during session to get approximate token counts

param(
    [string]$WorkspaceRoot = ".",
    [string]$Operation = "",      # read, write, edit, subagent
    [string]$FilePath = "",       # Path of file involved
    [int]$FileSize = 0,           # Size in bytes (if known)
    [string]$SubagentType = "",   # Type of subagent if Operation=subagent
    [string]$ToolName = ""        # Tool name for general tracking
)

$ProgressPath = Join-Path $WorkspaceRoot "RLM/progress"
$TokenUsagePath = Join-Path $ProgressPath "token-usage"

# Ensure directory exists
New-Item -ItemType Directory -Force -Path $TokenUsagePath | Out-Null

$CurrentSessionFile = Join-Path $TokenUsagePath "current-session.json"
$EstimatesFile = Join-Path $TokenUsagePath "token-estimates.json"

# Token estimation constants (approximate)
# Based on typical token-to-character ratios for code
$TOKENS_PER_CHAR = 0.25              # ~4 chars per token for code
$BASE_PROMPT_TOKENS = 500            # Base system prompt overhead
$SUBAGENT_OVERHEAD_TOKENS = 2000     # Overhead for spawning subagent
$TOOL_CALL_TOKENS = 50               # Base tokens per tool call

# Subagent token estimates (based on typical context they load)
$SubagentEstimates = @{
    "research" = 5000       # Web search, fetch, context
    "architect" = 8000      # Architecture docs, ADRs
    "designer" = 10000      # Design tokens, templates
    "coder" = 12000         # Task files, specs, implementation
    "tester" = 8000         # Test files, coverage
    "reviewer" = 6000       # Code review context
    "verifier" = 10000      # E2E test generation
    "Explore" = 4000        # Codebase exploration
    "general-purpose" = 8000 # General tasks
}

# Load or initialize estimates
$Estimates = @{
    session_id = ""
    started_at = (Get-Date).ToUniversalTime().ToString("o")
    last_updated = (Get-Date).ToUniversalTime().ToString("o")
    tokens = @{
        input_estimated = 0
        output_estimated = 0
        total_estimated = 0
    }
    operations = @{
        files_read = 0
        files_written = 0
        files_edited = 0
        subagents_spawned = 0
        tool_calls = 0
    }
    by_operation = @()
}

if (Test-Path $EstimatesFile) {
    try {
        $Estimates = Get-Content $EstimatesFile -Raw | ConvertFrom-Json
        # Convert to hashtable for manipulation
        $Estimates = @{
            session_id = $Estimates.session_id
            started_at = $Estimates.started_at
            last_updated = (Get-Date).ToUniversalTime().ToString("o")
            tokens = @{
                input_estimated = $Estimates.tokens.input_estimated
                output_estimated = $Estimates.tokens.output_estimated
                total_estimated = $Estimates.tokens.total_estimated
            }
            operations = @{
                files_read = $Estimates.operations.files_read
                files_written = $Estimates.operations.files_written
                files_edited = $Estimates.operations.files_edited
                subagents_spawned = $Estimates.operations.subagents_spawned
                tool_calls = $Estimates.operations.tool_calls
            }
            by_operation = @($Estimates.by_operation)
        }
    } catch {
        Write-Host "Warning: Could not read estimates file, starting fresh"
    }
}

# Try to get session ID from current session
if (Test-Path $CurrentSessionFile) {
    try {
        $Session = Get-Content $CurrentSessionFile -Raw | ConvertFrom-Json
        $Estimates.session_id = $Session.session_id
    } catch {}
}

# Calculate tokens for this operation
$TokensAdded = 0
$OperationType = ""

switch ($Operation.ToLower()) {
    "read" {
        $OperationType = "file_read"
        if ($FileSize -eq 0 -and $FilePath -and (Test-Path $FilePath)) {
            $FileSize = (Get-Item $FilePath).Length
        }
        $TokensAdded = [math]::Round($FileSize * $TOKENS_PER_CHAR)
        $Estimates.operations.files_read++
        $Estimates.tokens.input_estimated += $TokensAdded
    }
    "write" {
        $OperationType = "file_write"
        if ($FileSize -eq 0 -and $FilePath -and (Test-Path $FilePath)) {
            $FileSize = (Get-Item $FilePath).Length
        }
        $TokensAdded = [math]::Round($FileSize * $TOKENS_PER_CHAR)
        $Estimates.operations.files_written++
        $Estimates.tokens.output_estimated += $TokensAdded
    }
    "edit" {
        $OperationType = "file_edit"
        # Edits typically involve reading context + writing changes
        if ($FileSize -eq 0 -and $FilePath -and (Test-Path $FilePath)) {
            $FileSize = (Get-Item $FilePath).Length
        }
        $InputTokens = [math]::Round($FileSize * $TOKENS_PER_CHAR * 0.5)  # Context
        $OutputTokens = [math]::Round($FileSize * $TOKENS_PER_CHAR * 0.3)  # Changes
        $TokensAdded = $InputTokens + $OutputTokens
        $Estimates.operations.files_edited++
        $Estimates.tokens.input_estimated += $InputTokens
        $Estimates.tokens.output_estimated += $OutputTokens
    }
    "subagent" {
        $OperationType = "subagent_spawn"
        $SubagentTokens = $SUBAGENT_OVERHEAD_TOKENS
        if ($SubagentType -and $SubagentEstimates.ContainsKey($SubagentType)) {
            $SubagentTokens = $SubagentEstimates[$SubagentType]
        }
        $TokensAdded = $SubagentTokens
        $Estimates.operations.subagents_spawned++
        # Subagent tokens split roughly 60/40 input/output
        $Estimates.tokens.input_estimated += [math]::Round($SubagentTokens * 0.6)
        $Estimates.tokens.output_estimated += [math]::Round($SubagentTokens * 0.4)
    }
    "tool" {
        $OperationType = "tool_call"
        $TokensAdded = $TOOL_CALL_TOKENS
        $Estimates.operations.tool_calls++
        $Estimates.tokens.input_estimated += $TOOL_CALL_TOKENS
    }
    default {
        # Unknown operation, add minimal overhead
        $TokensAdded = $TOOL_CALL_TOKENS
        $OperationType = "unknown"
    }
}

# Update total
$Estimates.tokens.total_estimated = $Estimates.tokens.input_estimated + $Estimates.tokens.output_estimated

# Log operation (keep last 100)
$OperationLog = @{
    timestamp = (Get-Date).ToUniversalTime().ToString("o")
    type = $OperationType
    file = $FilePath
    tokens_added = $TokensAdded
    subagent_type = $SubagentType
    tool_name = $ToolName
}

$Estimates.by_operation += $OperationLog
if ($Estimates.by_operation.Count -gt 100) {
    $Estimates.by_operation = $Estimates.by_operation | Select-Object -Last 100
}

# Estimate cost (using Claude Sonnet 3.5 pricing as baseline)
# Input: $3 per 1M tokens, Output: $15 per 1M tokens
$InputCost = ($Estimates.tokens.input_estimated / 1000000) * 3
$OutputCost = ($Estimates.tokens.output_estimated / 1000000) * 15
$TotalCost = $InputCost + $OutputCost

$Estimates | Add-Member -NotePropertyName "estimated_cost_usd" -NotePropertyValue ([math]::Round($TotalCost, 4)) -Force

# Write estimates
$Estimates | ConvertTo-Json -Depth 10 | Set-Content -Path $EstimatesFile -Encoding UTF8

# Output summary
Write-Host "Token Estimate Updated:"
Write-Host "  Input:  ~$($Estimates.tokens.input_estimated) tokens"
Write-Host "  Output: ~$($Estimates.tokens.output_estimated) tokens"
Write-Host "  Total:  ~$($Estimates.tokens.total_estimated) tokens"
Write-Host "  Cost:   ~`$$([math]::Round($TotalCost, 4))"
