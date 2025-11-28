# Post-Task Hook

This hook runs after task completion to update progress tracking.

## Trigger

Activated when:
- A task implementation completes via `/cc-implement`
- Coder sub-agent reports completion
- Manual task status update

## Actions

### Step 1: Capture Task Completion
Extract from completed task:
- Task ID
- Task title
- Completion timestamp
- Test results (pass/fail count)

### Step 2: Update Status File
Update `RLM/progress/status.json`:
```json
{
  "lastUpdated": "[ISO-8601]",
  "currentTask": null,
  "lastCompletedTask": {
    "id": "TASK-XXX",
    "title": "[title]",
    "completedAt": "[ISO-8601]",
    "testsRun": 10,
    "testsPassed": 10
  },
  "sessionStats": {
    "tasksCompleted": 5,
    "totalTokensUsed": 45000,
    "startedAt": "[ISO-8601]"
  }
}
```

### Step 3: Move Task File
```bash
mv RLM/tasks/active/TASK-XXX.md RLM/tasks/completed/TASK-XXX.md
```

### Step 4: Update Task File
Add completion metadata to task file:
```markdown
---
status: completed
completedAt: [ISO-8601]
completedBy: claude-code
testsAdded: [count]
filesModified: [list]
---
```

### Step 5: Log Progress
Append to `RLM/progress/logs/[YYYY-MM-DD].md`:
```markdown
## [HH:MM] Task Completed: TASK-XXX

**Title**: [title]
**Duration**: [estimated]
**Tests**: [X passed, Y total]
**Files Modified**:
- [file1]
- [file2]

---
```

### Step 6: Check Next Task
If automation level is AUTO:
- Check for next available task
- Proceed automatically if no blockers

If SUPERVISED:
- Report completion
- Ask user to proceed with next task

## Notifications

Optional: If background notification configured:
```
Task TASK-XXX completed successfully.
X tests passing.
Next: TASK-YYY or [no more tasks]
```

## Error Handling

If task fails:
- Keep in `active/` directory
- Add `blocked: true` to metadata
- Trigger `on-error` hook
- Log failure reason
