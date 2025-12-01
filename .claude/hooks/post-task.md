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

### Step 7: Check Feature Completion

After task completion, check if the feature is now complete:

1. **Extract Feature ID** from completed task metadata:
   ```markdown
   ## Feature: FTR-XXX
   ```

2. **Scan Task Directories**:
   - `RLM/tasks/active/` - Count tasks with matching Feature ID
   - `RLM/tasks/completed/` - Count tasks with matching Feature ID

3. **Calculate Completion**:
   ```
   Total Tasks = active + completed
   Completion % = (completed / total) * 100
   ```

4. **If 100% Complete** (no remaining active tasks for this feature):
   ```
   ✅ Feature FTR-XXX has all tasks completed.
   Triggering automatic verification...
   ```

   Update `RLM/progress/status.json`:
   ```json
   {
     "features": {
       "FTR-XXX": {
         "status": "verification-pending",
         "totalTasks": 10,
         "completedTasks": 10,
         "lastTaskCompleted": "[ISO-8601]"
       }
     }
   }
   ```

   **Automatically trigger**: `/cc-verify FTR-XXX`

5. **If Not Complete** (remaining active tasks):
   ```
   Feature FTR-XXX: X/Y tasks completed (Z remaining)
   ```

### Step 8: Check Verification Bug Resolution

If the completed task is a bug task (ID matches `TASK-XXX-BUG-*`):

1. **Extract Parent Feature** from bug task metadata
2. **Scan for Remaining Bug Tasks**:
   - Check `RLM/tasks/active/TASK-XXX-BUG-*.md` for same feature
3. **If All Bug Tasks Resolved**:
   ```
   ✅ All verification bugs for FTR-XXX have been resolved.
   Triggering re-verification...
   ```
   **Automatically trigger**: `/cc-verify FTR-XXX --retry`

4. **If Bug Tasks Remain**:
   ```
   Bug tasks remaining for FTR-XXX: Y of Z resolved
   Remaining: TASK-XXX-BUG-002, TASK-XXX-BUG-003
   ```

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
