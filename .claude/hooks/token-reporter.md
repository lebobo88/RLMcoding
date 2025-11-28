# Token Reporter Hook

This hook tracks token usage across all sub-agent calls for reporting and optimization. **In v2.2, token reporting is automatic with threshold-based warnings.**

## Trigger

Activated automatically when:
- After every Task tool (sub-agent) invocation
- At threshold crossings (50%, 75%, 90%)
- On session stop
- Manual `/cc-tokens` command (still available)

## Automatic Threshold Behavior

Token thresholds are configured in `RLM/progress/cc-config.json`:

| Threshold | Default | Behavior |
|-----------|---------|----------|
| `warning_threshold` | 0.5 (50%) | Display warning, continue normally |
| `critical_threshold` | 0.75 (75%) | Display critical warning, suggest wrapping up |
| `auto_bundle_threshold` | 0.9 (90%) | Auto-save context bundle, complete current batch only |

### Automatic Warning Messages

**At 50% (Warning)**:
```
⚠️ Token Budget: 50% consumed
   • Session tokens: 50,000 / 100,000
   • Sub-agent calls: 8
   • Status: Normal operation, monitoring
```

**At 75% (Critical)**:
```
⚠️⚠️ Token Budget: 75% consumed - Consider wrapping up
   • Session tokens: 75,000 / 100,000
   • Sub-agent calls: 12
   • Recommendation: Complete current task batch, then pause or bundle context
   • Use /cc-implement resume later to continue
```

**At 90% (Auto-Bundle)**:
```
🛑 Token Budget: 90% consumed - Auto-saving context
   • Session tokens: 90,000 / 100,000
   • Action: Creating context bundle for session resume
   • Bundle: RLM/progress/bundles/[timestamp]-bundle.json
   • Completing: Current batch only (no new sub-agent spawns)
   • Resume with: /cc-implement resume
```

## Purpose

Continuous token tracking enables:
- Real-time visibility into context usage
- Per-agent efficiency analysis
- Cost estimation
- Workflow optimization insights
- Historical trending
- **Automatic graceful degradation at budget limits**

## Actions

### Step 1: Capture Token Metrics
After each sub-agent call, capture:
```json
{
  "timestamp": "[ISO-8601]",
  "agent_type": "[research|architect|coder|tester|reviewer]",
  "task_context": "[TASK-XXX or description]",
  "input_tokens": 1500,
  "output_tokens": 800,
  "total_tokens": 2300,
  "duration_ms": 5000
}
```

### Step 2: Update Session Log
Append to `RLM/progress/token-usage/session-[date].json`:
```json
{
  "session_id": "[uuid]",
  "started_at": "[ISO-8601]",
  "calls": [
    {
      "timestamp": "2024-11-27T10:05:00Z",
      "agent": "research",
      "task": "Market research for FTR-001",
      "input_tokens": 1500,
      "output_tokens": 800,
      "total": 2300,
      "cumulative": 2300
    },
    {
      "timestamp": "2024-11-27T10:10:00Z",
      "agent": "coder",
      "task": "TASK-001 implementation",
      "input_tokens": 2000,
      "output_tokens": 3500,
      "total": 5500,
      "cumulative": 7800
    }
  ],
  "running_totals": {
    "total_calls": 2,
    "total_tokens": 7800,
    "by_agent": {
      "research": 2300,
      "coder": 5500
    }
  }
}
```

### Step 3: Calculate Efficiency Metrics
```json
{
  "efficiency_metrics": {
    "tokens_per_task": 3900,
    "avg_call_duration_ms": 5000,
    "context_utilization": 0.15,
    "delegation_ratio": 0.75
  }
}
```

**Metrics Explained:**
- `tokens_per_task`: Average tokens to complete one task
- `context_utilization`: Percentage of context window used
- `delegation_ratio`: Sub-agent tokens / total tokens (higher = more efficient)

### Step 4: Generate Summary on Request
When `/cc-tokens` is called:
```markdown
## Token Usage Summary

**Session**: [session_id]
**Duration**: [X hours, Y minutes]

### Current Totals
| Metric | Value |
|--------|-------|
| Total Tokens | 45,000 |
| Sub-Agent Calls | 12 |
| Avg per Call | 3,750 |

### By Agent Type
| Agent | Tokens | % of Total | Calls |
|-------|--------|------------|-------|
| Coder | 20,000 | 44% | 5 |
| Tester | 12,000 | 27% | 4 |
| Research | 8,000 | 18% | 2 |
| Reviewer | 5,000 | 11% | 1 |

### Efficiency
- Context Utilization: 15%
- Delegation Ratio: 75%
- Est. Cost: $0.45

### Recommendations
- [Optimization suggestions based on patterns]
```

### Step 5: Write Detailed Report
On `/cc-tokens report`, write to `RLM/progress/token-usage/report-[date].md`:
```markdown
# Token Usage Report: [Date]

## Executive Summary
[High-level overview]

## Detailed Call Log
[Table of all sub-agent calls]

## Analysis
[Patterns and insights]

## Optimization Recommendations
[Specific suggestions]

## Historical Comparison
[If previous data available]
```

## Storage Structure

```
RLM/progress/token-usage/
├── session-2024-11-27.json   # Daily session logs
├── session-2024-11-28.json
├── report-2024-11-27.md      # Generated reports
└── summary.json              # Aggregated historical data
```

## Integration with Workflow

- Primary Agent receives token budget warnings at 50%, 75%, 90%
- Sub-agents can be throttled if approaching limits
- Background agents report usage on completion
- End-of-session reports inform next session planning

## Historical Tracking

Aggregate data for trending:
```json
{
  "historical": {
    "daily_averages": {
      "2024-11-26": 35000,
      "2024-11-27": 45000
    },
    "by_workflow": {
      "discovery": 15000,
      "implementation": 40000,
      "testing": 20000
    }
  }
}
```
