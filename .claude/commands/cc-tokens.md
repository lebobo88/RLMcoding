# Token Usage Reporting

Display and analyze token usage for the current Claude Code session.

## Arguments

`$ARGUMENTS` can be:
- Empty - Show current session summary
- `report` - Generate detailed report to file
- `history` - Show historical usage trends
- `reset` - Reset session counters

## Workflow

### Default: Session Summary

Display inline summary:

```markdown
## Token Usage Summary

**Session**: [session_id]
**Started**: [timestamp]
**Duration**: [X hours, Y minutes]

### Current Totals
| Metric | Value |
|--------|-------|
| Total Tokens | [X] |
| Sub-Agent Calls | [Y] |
| Avg per Call | [Z] |

### By Agent Type
| Agent | Tokens | % | Calls |
|-------|--------|---|-------|
| Coder | X | X% | X |
| Tester | X | X% | X |
| Research | X | X% | X |
| Architect | X | X% | X |
| Reviewer | X | X% | X |

### Efficiency Metrics
- **Delegation Ratio**: X% (sub-agent vs primary)
- **Context Utilization**: X% of window
- **Tokens per Task**: X average

### Estimated Cost
~$X.XX (based on current Opus pricing)
```

### `report` - Detailed Report

Read session data from `RLM/progress/token-usage/session-[date].json`

Generate and write detailed report to `RLM/progress/token-usage/report-[date].md`:

```markdown
# Token Usage Report

**Generated**: [timestamp]
**Session**: [session_id]
**Period**: [start] to [end]

## Executive Summary

This session used **X tokens** across **Y sub-agent calls**.
The most token-intensive agent was **[agent]** at X%.
Efficiency rating: **[Good/Fair/Needs Optimization]**

## Detailed Call Log

| Time | Agent | Task | Input | Output | Total | Cumulative |
|------|-------|------|-------|--------|-------|------------|
| 10:00 | research | Market analysis | 1500 | 800 | 2300 | 2300 |
| 10:15 | coder | TASK-001 | 2000 | 3500 | 5500 | 7800 |
| ... | ... | ... | ... | ... | ... | ... |

## Agent Analysis

### Research Agent
- Calls: X
- Total Tokens: X
- Avg per Call: X
- Typical Use: [pattern observed]

### Coder Agent
[similar breakdown]

### Tester Agent
[similar breakdown]

### Architect Agent
[similar breakdown]

### Reviewer Agent
[similar breakdown]

## Efficiency Analysis

### Context Efficiency Score: X/100

**Factors:**
- Sub-agent delegation: X% (target: >60%)
- Context reuse: X% (target: >40%)
- Wasted tokens: X% (target: <10%)

### Recommendations

1. **[Recommendation 1]**: [action]
2. **[Recommendation 2]**: [action]
3. **[Recommendation 3]**: [action]

## Cost Breakdown

| Agent | Tokens | Est. Cost |
|-------|--------|-----------|
| Primary | X | $X.XX |
| Research | X | $X.XX |
| Coder | X | $X.XX |
| ... | ... | ... |
| **Total** | **X** | **$X.XX** |

## Comparison to Previous Sessions

[If historical data available]

| Metric | This Session | Avg (7 days) | Trend |
|--------|--------------|--------------|-------|
| Total Tokens | X | X | +/-X% |
| Per Task | X | X | +/-X% |
| Efficiency | X% | X% | +/-X% |
```

### `history` - Historical Trends

Read from `RLM/progress/token-usage/` directory:

```markdown
## Token Usage History

### Daily Totals (Last 7 Days)

| Date | Tokens | Tasks | Efficiency |
|------|--------|-------|------------|
| Nov 27 | 45,000 | 8 | 72% |
| Nov 26 | 35,000 | 6 | 68% |
| Nov 25 | 52,000 | 10 | 75% |
| ... | ... | ... | ... |

### Weekly Trend
- Average Daily: X tokens
- Trend: [increasing/decreasing/stable]
- Most Efficient Day: [day] at X%

### By Workflow Phase
| Phase | Avg Tokens | Sessions |
|-------|------------|----------|
| Discovery | 15,000 | 3 |
| Architecture | 12,000 | 2 |
| Implementation | 45,000 | 8 |
| Testing | 20,000 | 5 |
| Review | 8,000 | 10 |
```

### `reset` - Reset Counters

Reset current session tracking:
```markdown
Session token counters reset.
Previous session data saved to:
`RLM/progress/token-usage/session-[previous-id].json`

New session started: [new-session-id]
```

## Data Sources

Token data is collected by:
1. `token-reporter.md` hook on PostToolUse
2. Manual logging in sub-agent commands
3. Session bundle snapshots

## File Locations

```
RLM/progress/token-usage/
├── session-YYYY-MM-DD.json   # Daily session logs
├── report-YYYY-MM-DD.md      # Generated reports
├── summary.json              # Aggregated data
└── archive/                  # Historical data
```
