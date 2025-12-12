# TDD Implementation with Coder Sub-Agent

You are initiating Claude Code implementation mode. This command delegates code generation to the Coder Sub-Agent for focused, context-efficient development.

## CRITICAL: Verification Protocol

**After EVERY sub-agent call, you MUST verify the work was done:**

1. Check for completion manifest in `RLM/progress/manifests/`
2. Verify files mentioned in manifest actually exist
3. Only mark task complete if verification passes

**DO NOT trust sub-agent summaries alone. VERIFY with file system checks.**

## Automatic Context Priming

This command automatically loads:
- Task file(s) from `RLM/tasks/active/`
- Parent feature specification
- `RLM/specs/constitution.md` - Project standards
- Configuration from `RLM/progress/cc-config.json`

## Arguments

`$ARGUMENTS` can be:
- `TASK-XXX` - Implement specific task
- `all` - Implement all active tasks **IN PARALLEL**
- `resume` - Resume interrupted session

## Workflow

### Step 1: Initialize Session
Before any implementation, ensure session tracking is active:

```bash
powershell -ExecutionPolicy Bypass -File ".claude/scripts/session-start.ps1" -WorkspaceRoot "."
```

### Step 2: Determine Implementation Scope

If `$ARGUMENTS` is a task ID (e.g., TASK-001):
- Read `RLM/tasks/active/TASK-XXX.md`
- Read parent feature spec from task metadata
- Execute single-task workflow (Step 4)

If `$ARGUMENTS` is `all`:
- List all files in `RLM/tasks/active/`
- Sort by priority/dependencies
- **Execute parallel-task workflow (Step 4-PARALLEL)**

If `$ARGUMENTS` is `resume`:
- Read `RLM/progress/status.json` for last state
- Read context bundle from `RLM/progress/bundles/`
- Continue from interrupted task

### Step 3: Pre-Implementation Check
For each task, verify:
- [ ] Task file exists and is complete
- [ ] Dependencies are satisfied
- [ ] No blockers documented
- [ ] Test file location identified

### Step 4: Delegate to Coder Sub-Agent (Single Task)

Use the Task tool to spawn the Coder Sub-Agent with this EXACT prompt format:

```markdown
## Implementation Task: [TASK-ID]

### Task Details
- **Task ID**: TASK-XXX
- **Title**: [Title from task file]
- **Task File**: RLM/tasks/active/TASK-XXX.md
- **Feature**: FTR-XXX
- **Feature Spec**: RLM/specs/features/FTR-XXX/spec.md

### Context Files to Read
1. RLM/tasks/active/TASK-XXX.md - Task requirements
2. RLM/specs/features/FTR-XXX/spec.md - Parent feature
3. RLM/specs/constitution.md - Coding standards
4. RLM/specs/design/tokens/tokens.json - Design tokens (if UI task)

### Requirements
1. Follow TDD - write tests FIRST using Write tool
2. Implement code to pass tests using Write/Edit tools
3. Run tests to verify passing
4. **CRITICAL**: Write completion manifest:
   ```bash
   powershell -ExecutionPolicy Bypass -File ".claude/scripts/write-manifest.ps1" -WorkspaceRoot "." -TaskId "TASK-XXX" -Status "completed" -FilesCreated "[list]" -FilesModified "[list]" -TestsAdded [N] -Notes "[summary]"
   ```
5. Report back with files created/modified

### Output Format
Return a summary including:
- Status: completed/blocked
- Files created (full paths)
- Files modified (full paths)
- Tests added (count)
- Manifest location
```

### Step 4-PARALLEL: Spawn Multiple Coder Sub-Agents (All Tasks)

When `$ARGUMENTS` is `all`, spawn multiple sub-agents **in a single message**:

```
Load config: parallel_limit = 5 (from cc-config.json)

Tasks available: [TASK-001, TASK-002, ..., TASK-010]
Tasks respecting dependencies: [TASK-001, TASK-003, TASK-005, TASK-007, TASK-009] (batch 1)

SPAWN IN SINGLE MESSAGE (multiple Task tool calls):
├─► Task tool call 1: Coder Sub-Agent → TASK-001
├─► Task tool call 2: Coder Sub-Agent → TASK-003
├─► Task tool call 3: Coder Sub-Agent → TASK-005
├─► Task tool call 4: Coder Sub-Agent → TASK-007
└─► Task tool call 5: Coder Sub-Agent → TASK-009
```

**Parallel Spawning Rules**:
1. **Use single message**: All Task tool calls in one response
2. **Respect dependencies**: Only spawn tasks whose dependencies are complete
3. **Respect parallel_limit**: Never exceed configured limit (default: 5)
4. **Token awareness**: Reduce batch size if approaching budget threshold
5. **Handle failures**: Continue with other tasks, log blockers

### Step 5: VERIFY Sub-Agent Work (CRITICAL)

**After sub-agents complete, you MUST verify their work:**

#### 5a. Check for Completion Manifests
```bash
dir RLM\progress\manifests\*.json
```

Look for recent manifests matching the task IDs.

#### 5b. Read and Validate Each Manifest
```bash
type RLM\progress\manifests\TASK-XXX-*.json
```

Extract:
- `status`: Should be "completed" or "blocked"
- `files_created`: List of new files
- `files_modified`: List of changed files
- `tests_added`: Number of tests

#### 5c. Verify Files Actually Exist
For each file in `files_created`:
```bash
dir [file_path]
```

**If file doesn't exist, the task is NOT complete.**

#### 5d. Verify Tests Pass
```bash
npm test -- --watchAll=false
```

**If tests fail, the task is NOT complete.**

### Step 6: Update Progress (Only After Verification)

**Only if verification passes:**

#### 6a. Move Completed Task Files
```bash
move RLM\tasks\active\TASK-XXX.md RLM\tasks\completed\TASK-XXX.md
```

#### 6b. Update status.json
Read current `RLM/progress/status.json`, update with:
```json
{
  "tasks": {
    "TASK-XXX": {
      "status": "completed",
      "completedAt": "[timestamp]",
      "filesCreated": ["..."],
      "filesModified": ["..."],
      "testsAdded": N
    }
  },
  "metrics": {
    "completed": [increment]
  }
}
```

Write updated status back.

#### 6c. Log Progress
Append to `RLM/progress/logs/[date].md`:
```markdown
## [HH:MM] Task Completed: TASK-XXX

**Files Created**: [list]
**Files Modified**: [list]
**Tests Added**: N
**Verification**: PASSED

---
```

### Step 7: Handle Verification Failures

If verification fails:

1. **Task stays in active/**: Do NOT move to completed/
2. **Mark as blocked**:
   ```json
   {
     "tasks": {
       "TASK-XXX": {
         "status": "blocked",
         "blockedReason": "Verification failed: [reason]"
       }
     }
   }
   ```
3. **Log the failure**
4. **Continue with other tasks**
5. **Report to user**: "TASK-XXX verification failed: [reason]"

### Step 8: Batch Summary

After each batch completes verification:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 BATCH COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tasks in Batch: 5
├─► TASK-001: ✅ VERIFIED (3 files, 8 tests)
├─► TASK-003: ✅ VERIFIED (2 files, 5 tests)
├─► TASK-005: ❌ BLOCKED (files not created)
├─► TASK-007: ✅ VERIFIED (4 files, 12 tests)
└─► TASK-009: ✅ VERIFIED (2 files, 6 tests)

Verified: 4/5
Blocked: 1

Files Created: 11
Tests Added: 31

Proceeding to next batch...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 9: Feature Completion Check

After updating progress, check if the completed task was the LAST task for its feature:

1. **Extract Feature ID** from task metadata
2. **Count remaining active tasks** for that feature:
   ```bash
   dir RLM\tasks\active\*FTR-XXX*.md 2>nul | find /c ".md"
   ```
3. **If 0 remaining**: Feature is complete, trigger verification

### Step 10: Session Summary

At end of all tasks:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 SESSION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tasks Completed: X of Y
Tasks Blocked: Z

Files Changed:
  Created:  N files
  Modified: M files
  Tests:    P test cases

Manifests: RLM/progress/manifests/
Logs: RLM/progress/logs/[date].md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Automation Levels

| Level | Description | When AI Asks |
|-------|-------------|--------------|
| **AUTO** | Full autonomy | Only when blocked |
| **SUPERVISED** | Checkpoints | Before major decisions, after each task |
| **MANUAL** | Step-by-step | Before every step |

## Verification Checklist (Per Task)

Before marking ANY task complete, verify:

- [ ] Manifest exists in `RLM/progress/manifests/`
- [ ] Manifest status is "completed"
- [ ] All files in `files_created` exist on disk
- [ ] All files in `files_modified` exist on disk
- [ ] Tests pass (`npm test` or equivalent)
- [ ] Task file moved to `completed/`
- [ ] status.json updated

**If ANY check fails, task is NOT complete.**

## Configuration

Parallel behavior controlled by `RLM/progress/cc-config.json`:

```json
{
  "parallel_limit": 5,
  "token_warning_threshold": 0.5,
  "token_critical_threshold": 0.75,
  "auto_bundle_threshold": 0.9
}
```

Modify with `/cc-config parallel_limit 8` (up to 10 max).

## Error Recovery

If a task fails mid-implementation:
1. Other parallel tasks continue (not affected)
2. Failed task logged to `RLM/progress/logs/errors/`
3. Task stays in `RLM/tasks/active/` with blocker documented
4. Continue with remaining tasks

To retry blocked tasks:
```
/cc-implement TASK-005  # Retry specific task
/cc-implement blocked   # Retry all blocked tasks
```

## Key Principles

1. **Trust but Verify**: Sub-agents work in isolation. Always verify their output.
2. **Manifests are Truth**: The manifest file is the source of truth for task completion.
3. **Files are Proof**: If the files don't exist, the work wasn't done.
4. **Progress is Incremental**: Update status after EACH verified task, not in batches.
