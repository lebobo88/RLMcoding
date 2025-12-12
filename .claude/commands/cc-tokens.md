# Token Usage Reporting

Display and analyze token usage estimates for the current Claude Code session.

**Important**: Real-time token counts are NOT available to the AI during sessions. This command uses estimation based on file operations and tool activity.

## Arguments

`$ARGUMENTS` can be:
- Empty - Show current session estimates
- `detailed` - Show with operation breakdown
- `history` - Show historical usage (last 7 days)
- `capture [cost-output]` - Capture post-session /cost data

## Workflow

### Default: Session Estimates

Run the token usage display script:

```bash
powershell -ExecutionPolicy Bypass -File ".claude/scripts/show-token-usage.ps1" -WorkspaceRoot "."
```

This displays:
- Estimated input/output tokens
- Estimated cost
- Operation counts (files read/written, subagents, tool calls)

### `detailed` - With Operation Breakdown

```bash
powershell -ExecutionPolicy Bypass -File ".claude/scripts/show-token-usage.ps1" -WorkspaceRoot "." -Detailed
```

Shows recent operations (last 10) with their token contributions.

### `history` - Historical Usage

```bash
powershell -ExecutionPolicy Bypass -File ".claude/scripts/show-token-usage.ps1" -WorkspaceRoot "." -History
```

Shows last 7 days of captured usage data from daily summary files.

### `capture` - Post-Session Capture

After your session ends, run `/cost` in Claude Code, then capture the data:

```bash
powershell -ExecutionPolicy Bypass -File ".claude/scripts/capture-session-cost.ps1" -WorkspaceRoot "." -CostOutput "[paste /cost output here]"
```

This captures accurate data from the /cost command, including:
- Actual cost in USD
- API duration
- Wall duration
- Lines added/removed

## How Estimation Works

Tokens are estimated based on:

| Operation | Estimation |
|-----------|------------|
| File Read | ~0.25 tokens per character |
| File Write | ~0.25 tokens per character |
| File Edit | 0.5x read + 0.3x write of file size |
| Subagent | 2,000-12,000 tokens (varies by type) |
| Tool Call | ~50 tokens base |

**Limitations**:
- Estimates don't include system prompts or conversation history
- Model-specific tokenization varies
- Only operations tracked by hooks are counted

## Accurate Usage Data

For accurate token counts:

1. **During Session**: Run `/cost` command in Claude Code CLI
2. **After Session**: Capture the output with the capture script
3. **Enterprise**: Use OpenTelemetry integration

## File Locations

```
RLM/progress/token-usage/
├── token-estimates.json      # Current session estimates
├── current-session.json      # Session metadata
├── daily-YYYY-MM-DD.json     # Daily summaries (captured)
├── cost-SESSION-XXX.json     # Per-session cost captures
└── compact-events.json       # Context compaction events
```

## Data Flow

```
Tool Use (Read/Write/Edit/Task)
    ↓
PostToolUse Hook
    ↓
estimate-tokens.ps1
    ↓
token-estimates.json
    ↓
show-token-usage.ps1 → Display

---

Session End → /cost command
    ↓
capture-session-cost.ps1
    ↓
daily-YYYY-MM-DD.json (accurate)
```

See `RLM/docs/TOKEN-TRACKING.md` for complete documentation.
