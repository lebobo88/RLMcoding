# Pre-Commit Hook

This hook runs before git commits to ensure code quality.

## Trigger

Activated when:
- User runs `/cc-review staged`
- Before `git commit` command is executed
- Manually via `/prime-review` followed by commit

## Actions

### Step 1: Identify Changed Files
```bash
git diff --cached --name-only
```

### Step 2: Delegate Review
Spawn Reviewer Sub-Agent with staged files:
- Focus: Security, Code Quality
- Severity threshold: Block on Critical issues

### Step 3: Report Findings

**If Critical Issues Found:**
```markdown
## Pre-Commit Review: BLOCKED

Critical issues must be resolved before commit:

### Critical Issues
[List of critical issues]

---
Resolve issues and re-run commit.
Use `/cc-review staged` for detailed review.
```

**If No Critical Issues:**
```markdown
## Pre-Commit Review: PASSED

No critical issues found.

### Warnings (Optional to Fix)
[Any high/medium issues]

---
Proceeding with commit.
```

### Step 4: Log Review
Write review summary to:
```
RLM/progress/reviews/[date]-pre-commit.md
```

## Configuration Options

In `hooks.json`, configure:
```json
{
  "pre-commit": {
    "enabled": true,
    "blockOnSeverity": "critical",
    "skipPatterns": ["*.md", "*.json"],
    "timeout": 30000
  }
}
```

## Bypass

To bypass pre-commit review (not recommended):
```bash
git commit --no-verify -m "message"
```

## Integration with Git

To enable as actual git hook, add to `.git/hooks/pre-commit`:
```bash
#!/bin/sh
claude -p "Run /cc-review staged and block if critical issues"
```
