# Token Tracking for IDE Agents

Since IDE agents (Cursor, Windsurf, etc.) don't expose token counts directly, use estimation-based tracking.

## Estimation Model

### Characters to Tokens

```json
{
  "estimation": {
    "chars_per_token": 4,
    "overhead_multiplier": 1.15,
    "context_overhead": 2000
  }
}
```

### Calculation

```
estimated_tokens = (character_count / 4) * 1.15 + context_overhead
```

## Session Logging

After each task, log to `RLM/progress/token-usage/session-YYYY-MM-DD.json`:

```json
{
  "session_id": "IDE-2024-12-09",
  "method": "cursor",
  "tasks": [
    {
      "task": "TASK-001",
      "estimated_tokens": {
        "input": 12000,
        "output": 5000,
        "total": 17000
      },
      "files_touched": 3,
      "tests_written": 4,
      "completed_at": "2024-12-09T14:30:00Z"
    }
  ],
  "summary": {
    "total_estimated_tokens": 45000,
    "tasks_completed": 3,
    "avg_tokens_per_task": 15000,
    "confidence": "estimated"
  }
}
```

## Manual Entry Option

At session end, optionally record actual usage if available:

```json
{
  "manual_entry": {
    "actual_tokens": 42500,
    "source": "user_reported",
    "variance_from_estimate": "-5.5%"
  }
}
```

## Budget Awareness

### Warning Thresholds

| Threshold | Action |
|-----------|--------|
| 50% | Log warning, continue |
| 75% | Alert user, suggest wrapping up |
| 90% | Complete current task only, pause |

### Per-Task Budget

Target: < 20,000 tokens per task

| Rating | Tokens | Interpretation |
|--------|--------|----------------|
| Excellent | < 10,000 | Simple task, well-defined |
| Good | 10-20,000 | Normal complexity |
| Fair | 20-35,000 | Complex or some rework |
| Poor | > 35,000 | Consider splitting task |

## IDE-Specific Notes

### Cursor
- Token usage visible in sidebar (if available)
- Use Cursor's built-in metrics when possible
- Fall back to estimation otherwise

### Windsurf
- Check Windsurf dashboard for usage
- Log from dashboard if accessible
- Use estimation for detailed task tracking

### Continue.dev
- Check model provider dashboard
- Estimation most reliable method
- Log provider and model used

### Generic IDE
- Use estimation model
- Offer manual entry at session end
- Track character counts when possible
