# Token Tracking and Cost Management

## Overview

The RLM system includes comprehensive token tracking to monitor AI API usage, control costs, and optimize performance across all agent operations.

---

## Features

### ✅ Automatic Tracking
- **Per-Agent Tracking** - Monitor which agents use the most tokens
- **Per-Task Tracking** - Track token usage for individual tasks
- **Per-Session Tracking** - Track usage for each build session
- **Time-Series Data** - Daily, weekly, and monthly trends

### ✅ Cost Calculation
- **Real-Time Cost Estimation** - Calculate costs as tokens are used
- **Multi-Model Support** - Different rates for Claude, GPT-4, Gemini
- **Budget Alerts** - Warnings when approaching limits
- **Cost Reports** - Detailed breakdowns by agent and task

### ✅ Optimization
- **Usage Patterns** - Identify high-cost operations
- **Efficiency Metrics** - Tokens per task completion
- **Suggestions** - AI-powered optimization recommendations
- **Export Capabilities** - CSV export for analysis

---

## Configuration

### Token Tracking Settings

Located in `RLM/config/project-config.json`:

```json
{
  "tokenTracking": {
    "enabled": true,
    "trackPerAgent": true,
    "trackPerTask": true,
    "trackPerSession": true,
    "alertThreshold": 1000000,
    "budgetDaily": 5000000,
    "budgetMonthly": 100000000,
    "costPerToken": {
      "claude-sonnet-4-input": 0.000003,
      "claude-sonnet-4-output": 0.000015,
      "gpt-4-input": 0.00003,
      "gpt-4-output": 0.00006,
      "gemini-pro-input": 0.00000125,
      "gemini-pro-output": 0.00000375
    },
    "logFile": "RLM/progress/token-usage.log",
    "reportingEnabled": true,
    "optimizationHints": true
  }
}
```

### Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| `enabled` | Enable/disable token tracking | `true` |
| `trackPerAgent` | Track usage by agent | `true` |
| `trackPerTask` | Track usage by task | `true` |
| `alertThreshold` | Tokens before warning | `1,000,000` |
| `budgetDaily` | Daily token budget | `5,000,000` |
| `budgetMonthly` | Monthly token budget | `100,000,000` |
| `costPerToken` | Cost per 1000 tokens | Model-specific |

---

## Usage

### View Token Report

```bash
# Summary report
./RLM/commands/utils/token-tracker.sh report

# Detailed report with time periods
./RLM/commands/utils/token-tracker.sh report week
```

**Output:**
```
=== Token Usage Report ===

Overall Usage:
  Total Tokens: 1,234,567
  Input Tokens: 800,000
  Output Tokens: 434,567
  Total Cost: $23.45

Usage by Agent:
  master-architect: 300,000 tokens
  implementation-agent: 700,000 tokens
  testing-agent: 234,567 tokens

Daily Usage (Last 7 Days):
  2025-01-15: 234,567 tokens
  2025-01-14: 189,234 tokens
  ...

Budget Status:
  Daily Used: 234,567 / 5,000,000 (4%)
  Daily Remaining: 4,765,433
```

### Check Budget Status

```bash
./RLM/commands/utils/token-tracker.sh check
```

Displays current usage against daily budget and warns if approaching limits.

### Optimization Suggestions

```bash
./RLM/commands/utils/token-tracker.sh optimize
```

**Output:**
```
=== Token Optimization Suggestions ===

Average tokens per task: 123,456

Agent Efficiency:
  master-architect: 95,000 tokens/task
  implementation-agent: 150,000 tokens/task
  testing-agent: 45,000 tokens/task

Optimization Tips:
  1. Use 'auto' mode for simple, repetitive tasks
  2. Provide clear, concise specifications
  3. Reuse successful patterns and templates
  4. Consider using smaller models for testing
  5. Review and refine agent prompts regularly
```

### Export Token Data

```bash
# Export to CSV
./RLM/commands/utils/token-tracker.sh export token-usage.csv

# Open in Excel or analysis tool
```

---

## Monitoring During Build

### Automatic Tracking

Token usage is automatically tracked during `rlm-build.sh` operations:

```bash
./RLM/commands/rlm-build.sh --mode supervised
```

**Output includes:**
```
✓ Task TASK-001 completed

### Token Usage
- Input Tokens: 12,345
- Output Tokens: 6,789
- Total Tokens: 19,134
- Estimated Cost: $0.35

⚠ Token usage at 45% of daily budget (2,250,000 / 5,000,000)
```

### Real-Time Monitoring

Watch token usage in real-time:

```bash
# In one terminal
./RLM/commands/rlm-build.sh --mode auto

# In another terminal
watch -n 5 "./RLM/commands/utils/token-tracker.sh report"
```

---

## Cost Management

### Understanding Costs

Token costs vary by model and type (input vs output):

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| Claude Sonnet 4 | $3.00 | $15.00 |
| GPT-4 | $30.00 | $60.00 |
| Gemini Pro | $1.25 | $3.75 |

### Budget Alerts

The system warns you when:
- **Alert Threshold** (default 1M tokens): Approaching significant usage
- **Daily Budget** (default 5M tokens): Reaching daily limit
- **Monthly Budget** (default 100M tokens): Approaching monthly limit

### Setting Budgets

Edit `RLM/config/project-config.json`:

```json
{
  "tokenTracking": {
    "alertThreshold": 500000,     // Alert at 500k tokens
    "budgetDaily": 2000000,        // 2M tokens per day
    "budgetMonthly": 50000000      // 50M tokens per month
  }
}
```

---

## Reports in rlm-report.sh

Token usage is included in standard reports:

```bash
# Summary report (includes token usage)
./RLM/commands/rlm-report.sh summary
```

**Output includes:**
```
💰 Token Usage
  Total Tokens Used: 1,234,567
  Total Cost: $23.45
  Today's Usage: 234,567 tokens
  Daily Budget: 234,567 / 5,000,000 (4%)
  Remaining Today: 4,765,433 tokens
```

### Detailed Metrics

```bash
./RLM/commands/rlm-report.sh metrics
```

Shows comprehensive token metrics including:
- Usage by agent
- Usage by task
- Time-series trends
- Cost breakdowns
- Optimization suggestions

### JSON Export

```bash
./RLM/commands/rlm-report.sh json
```

**Output includes:**
```json
{
  "tokens": {
    "total": 1234567,
    "daily": 234567,
    "cost": 23.45
  }
}
```

---

## Optimization Strategies

### 1. Task Complexity

Break down complex tasks into smaller subtasks:

```bash
# Instead of one 500k token task
# Create 5 tasks of 100k tokens each
```

**Benefits:**
- Better granularity
- Easier debugging
- Lower per-task cost
- Better progress tracking

### 2. Spec Quality

Provide clear, concise specifications:

✅ **Good Spec:**
```markdown
## Requirement
Create login endpoint with email/password validation.

## Acceptance Criteria
- POST /api/auth/login
- Validate email format
- Return JWT token
```

❌ **Bad Spec:**
```markdown
## Requirement
We need some kind of login system that users can use 
to access the application...
[Long, vague description]
```

### 3. Mode Selection

Choose appropriate automation mode:

| Task Type | Recommended Mode | Token Usage |
|-----------|------------------|-------------|
| Simple CRUD | Auto | Low |
| Standard feature | Supervised | Medium |
| Complex architecture | Manual | High (but controlled) |

### 4. Model Selection

For development/testing, consider:

```json
{
  "agents": {
    "defaultModel": "gemini-pro"  // Lower cost for development
  }
}
```

Switch to Claude Sonnet 4 or GPT-4 for production.

### 5. Prompt Optimization

Refine agent prompts in `RLM/agents/*.md`:

- Remove unnecessary examples
- Focus on specific instructions
- Use templates effectively
- Avoid redundant context

---

## Troubleshooting

### Issue: Token counts seem incorrect

**Solution:**
```bash
# Verify tracking is enabled
cat RLM/config/project-config.json | jq '.tokenTracking.enabled'

# Check log file
cat RLM/progress/token-usage.log

# Regenerate metrics
./RLM/commands/utils/token-tracker.sh init
```

### Issue: Costs don't match API bills

**Solution:**

Update cost rates in config:

```json
{
  "tokenTracking": {
    "costPerToken": {
      "claude-sonnet-4-input": 0.000003,
      "claude-sonnet-4-output": 0.000015
    }
  }
}
```

Check API provider's pricing page for current rates.

### Issue: Budget alerts too frequent

**Solution:**

Adjust thresholds:

```json
{
  "tokenTracking": {
    "alertThreshold": 2000000,    // Increase threshold
    "budgetDaily": 10000000        // Increase budget
  }
}
```

---

## Best Practices

### ✅ Do's

1. **Monitor regularly** - Check reports daily
2. **Set realistic budgets** - Based on project needs
3. **Track trends** - Identify patterns over time
4. **Optimize prompts** - Refine for efficiency
5. **Use appropriate modes** - Auto for simple, supervised for complex

### ❌ Don'ts

1. **Don't ignore warnings** - Budget alerts exist for a reason
2. **Don't use auto mode blindly** - Supervise complex tasks
3. **Don't skip optimization** - Review suggestions regularly
4. **Don't forget to export** - Backup data periodically
5. **Don't use oversized models** - Choose appropriate model for task

---

## Integration with CI/CD

### GitHub Actions

Token usage is tracked in CI/CD pipelines:

```yaml
- name: Run RLM Build
  run: ./RLM/commands/rlm-build.sh --mode auto
  
- name: Report Token Usage
  run: ./RLM/commands/utils/token-tracker.sh report
  
- name: Check Budget
  run: ./RLM/commands/utils/token-tracker.sh check
```

### Monthly Reports

Set up automated monthly reports:

```bash
# Add to crontab (run on 1st of month)
0 0 1 * * /path/to/project/RLM/commands/utils/token-tracker.sh export monthly-report-$(date +\%Y-\%m).csv
```

---

## Advanced Features

### Custom Cost Models

Define custom pricing for internal API:

```json
{
  "tokenTracking": {
    "costPerToken": {
      "custom-model-input": 0.000001,
      "custom-model-output": 0.000005
    }
  }
}
```

### Webhook Notifications

Get notified when budgets are exceeded:

```bash
# Add to token-tracker.sh check_budget function
curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d "{\"alert\": \"Budget exceeded\", \"usage\": $daily_tokens}"
```

---

## Summary

Token tracking in RLM provides:

✅ **Complete Visibility** - Know exactly what's being used  
✅ **Cost Control** - Stay within budget  
✅ **Optimization** - Identify inefficiencies  
✅ **Reporting** - Share metrics with stakeholders  
✅ **Automation** - Built into all commands  

**Start tracking now:**

```bash
./RLM/commands/utils/token-tracker.sh init
./RLM/commands/rlm-build.sh --mode supervised
./RLM/commands/utils/token-tracker.sh report
```

Happy cost-optimized development! 💰

