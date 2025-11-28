# On-Error Hook

This hook activates when implementation errors occur, invoking the problem-solving framework.

## Trigger

Activated when:
- Test failures during implementation
- Build errors
- Runtime exceptions during testing
- Sub-agent reports blocker

## Actions

### Step 1: Capture Error Context
Extract:
- Error message
- Stack trace (if available)
- File and line number
- Task context

### Step 2: Invoke Problem-Solving Framework
```markdown
## Error Investigation Initiated

### Step 1: Clarify the Core Issue
**Error**: [error message]
**Location**: [file:line]
**Context**: [task being worked on]

**Questions**:
- Is this a code error or environment issue?
- Is this reproducible?
- What was the last working state?

### Step 2: Identify Relevant Factors
**Recent Changes**:
- [List recent edits]

**Related Components**:
- [Dependencies that might be involved]

### Step 3: Analysis
[Systematic analysis of potential causes]

### Step 4: Synthesis
[Most likely root cause based on evidence]

### Step 5: Recommended Action
[Specific fix with risk assessment]
```

### Step 3: Attempt Auto-Recovery
If error is common type:

**Test Failure:**
1. Read test file and implementation
2. Identify assertion that failed
3. Analyze mismatch
4. Suggest fix

**Import Error:**
1. Check file paths
2. Verify exports
3. Check for circular dependencies

**Type Error:**
1. Check type definitions
2. Verify function signatures
3. Check for null/undefined

### Step 4: Log Error
Write to `RLM/progress/logs/errors/[timestamp]-error.md`:
```markdown
# Error Log: [timestamp]

## Error Details
- **Type**: [error type]
- **Message**: [message]
- **Task**: [TASK-XXX]
- **File**: [path]

## Investigation
[Problem-solving framework output]

## Resolution
- **Status**: [resolved|pending|escalated]
- **Fix**: [description]
- **Prevention**: [how to avoid in future]
```

### Step 5: Update Task Status
If error persists:
```json
{
  "status": "blocked",
  "blockedReason": "[error summary]",
  "blockedAt": "[ISO-8601]",
  "errorLog": "RLM/progress/logs/errors/[file].md"
}
```

### Step 6: Escalate if Needed
If auto-recovery fails:
```markdown
## Error Requires Human Input

I encountered an error I couldn't automatically resolve:

**Error**: [summary]
**Attempted**: [what was tried]
**Blocked on**: [specific question/decision needed]

Please review the error log at:
`RLM/progress/logs/errors/[file].md`
```

## Error Categories

| Category | Auto-Recovery | Action |
|----------|---------------|--------|
| Syntax Error | Yes | Parse and fix |
| Type Error | Usually | Check types |
| Test Failure | Usually | Analyze mismatch |
| Import Error | Usually | Fix paths |
| Build Error | Sometimes | Check config |
| Runtime Error | Sometimes | Debug |
| Environment | No | Escalate |
| External API | No | Escalate |
