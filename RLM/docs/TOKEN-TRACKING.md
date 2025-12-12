# Token Usage Tracking (v2.7.1)

This document describes how token usage is tracked in the RLM system across different AI coding agents.

## Reality Check: What's Actually Possible

**Important**: Real-time token counts are **NOT** available to the AI during Claude Code sessions. The token tracking in RLM uses a combination of:

1. **Estimation** - Approximate tokens based on file operations
2. **Post-Session Capture** - Accurate data from `/cost` command
3. **Context Limit Detection** - PreCompact hook when context is full

## Token Tracking Methods

### 1. Real-Time Estimation (During Session)

The `estimate-tokens.ps1` script approximates token usage based on:

| Operation | Estimation Method |
|-----------|-------------------|
| File Read | ~0.25 tokens per character |
| File Write | ~0.25 tokens per character |
| File Edit | 0.5x read + 0.3x write |
| Subagent Spawn | 2,000-12,000 tokens (by type) |
| Tool Call | ~50 tokens base |

**Subagent Token Estimates**:
| Agent | Estimated Tokens |
|-------|------------------|
| Explore | 4,000 |
| Research | 5,000 |
| Reviewer | 6,000 |
| Architect | 8,000 |
| Tester | 8,000 |
| Designer | 10,000 |
| Verifier | 10,000 |
| Coder | 12,000 |

These are **approximations** based on typical context loading patterns.

### 2. Post-Session Capture (Accurate)

At session end, run `/cost` in Claude Code to get actual usage, then capture:

```powershell
# Parse /cost output and save to tracking files
.\.claude\scripts\capture-session-cost.ps1 -WorkspaceRoot "." -CostOutput "[paste /cost output]" -SessionId "SESSION-XXX"
```

This captures:
- Actual cost in USD
- API duration
- Wall duration
- Lines added/removed
- Estimated tokens (from cost)

### 3. Context Limit Detection

The `PreCompact` hook fires when Claude Code is about to summarize context:

```json
{
  "PreCompact": [{
    "matcher": "auto",
    "hooks": [{
      "type": "command",
      "command": "powershell ... pre-compact.ps1 ..."
    }]
  }]
}
```

This logs when context windows fill up, helping track heavy sessions.

## Viewing Token Usage

### During Session
```powershell
.\.claude\scripts\show-token-usage.ps1 -WorkspaceRoot "."
```

### With Details
```powershell
.\.claude\scripts\show-token-usage.ps1 -WorkspaceRoot "." -Detailed
```

### With History
```powershell
.\.claude\scripts\show-token-usage.ps1 -WorkspaceRoot "." -History
```

## File Locations

| File | Purpose |
|------|---------|
| `RLM/progress/token-usage/token-estimates.json` | Current session estimates |
| `RLM/progress/token-usage/current-session.json` | Session metadata |
| `RLM/progress/token-usage/daily-YYYY-MM-DD.json` | Daily summaries |
| `RLM/progress/token-usage/cost-SESSION-XXX.json` | Per-session cost captures |
| `RLM/progress/token-usage/compact-events.json` | Context compact events |

## Cross-Agent Tracking

Different AI coding agents have different tracking capabilities:

### Claude Code
- **Real-time**: Not available to AI
- **Post-session**: `/cost` command
- **Enterprise**: OpenTelemetry integration
- **RLM Integration**: Full hooks + estimation

### GitHub Copilot
- **Real-time**: Not exposed
- **Billing**: Monthly dashboard
- **RLM Integration**: Manual logging only

### Cursor
- **Real-time**: Shows in sidebar
- **Billing**: Usage dashboard
- **RLM Integration**: Manual logging only

### Generic Integration

For agents without direct integration, use manual logging:

```powershell
# Log a manual estimate
.\.claude\scripts\estimate-tokens.ps1 -WorkspaceRoot "." -Operation "tool" -ToolName "external-agent"
```

## Hooks Configuration

The following hooks track token usage automatically:

| Event | Action |
|-------|--------|
| `PostToolUse` (Read) | Estimate read tokens |
| `PostToolUse` (Write) | Estimate write tokens |
| `PostToolUse` (Edit) | Estimate edit tokens |
| `PostToolUse` (Task) | Estimate subagent tokens |
| `PreCompact` (auto) | Log context limit reached |
| `Stop` | Finalize session metrics |

## Limitations

1. **Estimates are approximate**: File-based estimation doesn't account for:
   - System prompts
   - Conversation history
   - Tool result formatting
   - Model-specific tokenization

2. **No cross-session aggregation**: Each session is tracked independently

3. **Manual capture required**: Post-session `/cost` data requires manual capture

4. **Agent-specific**: Only Claude Code has hook integration; other agents need manual logging

## Best Practices

1. **Run `/cost` at session end** and capture the output
2. **Check estimates periodically** during long sessions
3. **Monitor compact events** to understand context pressure
4. **Review daily summaries** to track project costs

## Cost Estimation Formula

Based on Claude Sonnet 3.5 pricing (adjust for actual model):
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens
- Blended estimate: ~$0.009 per 1K tokens

```
Estimated Cost = (input_tokens × $0.000003) + (output_tokens × $0.000015)
```

## Troubleshooting

### Estimates not updating
- Verify hooks are configured in `.claude/hooks/hooks.json`
- Check PowerShell execution policy allows scripts
- Verify `$CLAUDE_PROJECT_DIR` is set correctly

### Post-session capture fails
- Ensure `/cost` output is correctly formatted
- Check write permissions to `RLM/progress/token-usage/`

### Context compacts not logged
- Verify `PreCompact` hook is configured with `"matcher": "auto"`
- Check `compact-events.json` for logged events
