# TDD Implementation with Coder Sub-Agent

You are initiating Claude Code implementation mode. This command delegates code generation to the Coder Sub-Agent for focused, context-efficient development.

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

### Step 1: Determine Implementation Scope

If `$ARGUMENTS` is a task ID (e.g., TASK-001):
- Read `RLM/tasks/active/TASK-XXX.md`
- Read parent feature spec from task metadata
- Execute single-task workflow (Step 3)

If `$ARGUMENTS` is `all`:
- List all files in `RLM/tasks/active/`
- Sort by priority/dependencies
- **Execute parallel-task workflow (Step 3-PARALLEL)**

If `$ARGUMENTS` is `resume`:
- Read `RLM/progress/status.json` for last state
- Read context bundle from `RLM/progress/bundles/`
- Continue from interrupted task

### Step 2: Pre-Implementation Check
For each task, verify:
- [ ] Task file exists and is complete
- [ ] Dependencies are satisfied
- [ ] No blockers documented
- [ ] Test file location identified

### Step 3: Delegate to Coder Sub-Agent (Single Task)
Use the Task tool to spawn the Coder Sub-Agent:
- **subagent_type**: Use Task tool with `coder` prompt referencing `.claude/agents/coder.md`
- **prompt**: Include:
  ```
  Task: [Task ID and title]
  Task File: [Path to task file]
  Feature Spec: [Path to parent feature]
  Constitution: [Path to constitution.md]

  Requirements:
  1. Follow TDD - write tests first
  2. Implement to pass tests
  3. Refactor while green
  4. Report completion status
  ```

### Step 3-PARALLEL: Spawn Multiple Coder Sub-Agents (All Tasks)

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

Wait for all 5 to complete...

Results:
├─► TASK-001: SUCCESS (tests passing)
├─► TASK-003: SUCCESS
├─► TASK-005: BLOCKED (dependency issue)
├─► TASK-007: SUCCESS
└─► TASK-009: SUCCESS

Move completed to RLM/tasks/completed/
Log blocker for TASK-005

SPAWN NEXT BATCH:
├─► Task tool call 1: Coder Sub-Agent → TASK-002 (was waiting on TASK-001)
├─► Task tool call 2: Coder Sub-Agent → TASK-004
└─► ... continue until all tasks complete
```

**Parallel Spawning Rules**:
1. **Use single message**: All Task tool calls in one response
2. **Respect dependencies**: Only spawn tasks whose dependencies are complete
3. **Respect parallel_limit**: Never exceed configured limit (default: 5)
4. **Token awareness**: Reduce batch size if approaching budget threshold
5. **Handle failures**: Continue with other tasks, log blockers

### Step 4: Monitor and Validate
After sub-agent completes:
1. Verify tests pass: `npm test` or equivalent
2. Check for any reported blockers
3. Update task status

### Step 4.5: Integrated Review (Per Task)

After implementation, run review checklist automatically:

```
┌─────────────────────────────────────────────────────────────────┐
│ 📋 Quick Review: TASK-XXX                                       │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Tests passing:     12/12                                      │
│ ✓ Linting:           Clean                                      │
│ ✓ Type checking:     No errors                                  │
│ ✓ Security:          No issues                                  │
│ ✓ Constitution:      Compliant                                  │
│ ✓ Design tokens:     Used correctly (if DESIGN_REQUIRED)        │
└─────────────────────────────────────────────────────────────────┘
```

**If any issues found:**
1. Sub-agent fixes issues automatically (AUTO mode)
2. Report to user for approval (SUPERVISED mode)
3. Log fixes made to progress log

**Review Checklist:**
- [ ] No hardcoded values (use design tokens)
- [ ] All 8 component states (if UI component)
- [ ] Error handling present
- [ ] Functions < 50 lines
- [ ] Tests cover edge cases

### Step 5: Update Progress
Move completed task:
```
RLM/tasks/active/TASK-XXX.md → RLM/tasks/completed/TASK-XXX.md
```

Update `RLM/progress/status.json`:
```json
{
  "lastTask": "TASK-XXX",
  "status": "completed",
  "timestamp": "ISO-8601"
}
```

Log to `RLM/progress/logs/YYYY-MM-DD.md`

### Step 5.5: Feature Verification (Automatic)

After updating progress, check if the completed task was the LAST task for its feature:

```
Check Feature Completion:
├─► Get parent feature ID (FTR-XXX) from task metadata
├─► Count tasks for FTR-XXX: active=0, blocked=0, completed=5
├─► If all tasks completed → Trigger automatic verification
└─► If tasks remaining → Continue to next task
```

**When Feature Completes:**

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎉 Feature FTR-XXX Complete - Triggering Verification           │
├─────────────────────────────────────────────────────────────────┤
│ All 5 tasks implemented. Running verification suite...          │
└─────────────────────────────────────────────────────────────────┘
```

**Verification Steps:**
1. Update feature status: `verification-pending`
2. Generate E2E tests from acceptance criteria
3. Run functional tests (Playwright)
4. Run accessibility tests (axe-core, if DESIGN_REQUIRED)
5. Run visual regression (if configured)

**Verification Results:**

```
┌─────────────────────────────────────────────────────────────────┐
│ ✅ Feature FTR-XXX VERIFIED                                     │
├─────────────────────────────────────────────────────────────────┤
│ Functional:     12/12 passed                                    │
│ Accessibility:  8/8 passed                                      │
│ Visual:         No changes detected                             │
└─────────────────────────────────────────────────────────────────┘
```

OR

```
┌─────────────────────────────────────────────────────────────────┐
│ ❌ Feature FTR-XXX VERIFICATION FAILED                          │
├─────────────────────────────────────────────────────────────────┤
│ Functional:     10/12 passed (2 failures)                       │
│ Bug tasks created: TASK-XXX-BUG-001, TASK-XXX-BUG-002          │
│ Feature blocked until bugs fixed.                               │
└─────────────────────────────────────────────────────────────────┘
```

**On Failure:**
- Create bug tasks in `RLM/tasks/active/`
- Set feature status to `verification-failed`
- Continue with other features
- Re-verify automatically when bug tasks complete

### Step 6: Report Progress & Token Usage

#### Real-Time Progress (if reporting.mode is "realtime" or "both")

During each task, output progress updates at each step:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TASK-XXX: [Task Title]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: [████████░░░░░░░░░░░░] 40% (Step 2/5: Writing tests)

Token Usage This Task:
  Input:  2,450 tokens
  Output: 1,230 tokens
  Total:  3,680 tokens

Session Total: 15,420 / 100,000 tokens (15.4%)

⏱️  Elapsed: 3m 24s | Est. Remaining: 5m 10s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 5-Step Progress Model

| Step | Name | Range | Description |
|------|------|-------|-------------|
| 1 | Loading context | 0-10% | Read task, feature spec, constitution |
| 2 | Writing tests | 10-40% | Create test file, write test cases |
| 3 | Implementing code | 40-70% | Write implementation to pass tests |
| 4 | Running tests | 70-85% | Execute tests, verify all pass |
| 5 | Quality checks | 85-100% | Lint, type-check, security review |

#### Silent Logging (Always Active)

After each step, append to session log file:

File: `RLM/progress/token-usage/session-YYYY-MM-DD.json`

```json
{
  "session_id": "SESSION-2024-12-09-001",
  "started_at": "2024-12-09T10:00:00Z",
  "entries": [
    {
      "timestamp": "2024-12-09T10:05:00Z",
      "task": "TASK-XXX",
      "step": "writing_tests",
      "step_number": 2,
      "percentage": 40,
      "tokens": { "input": 1200, "output": 450 },
      "cumulative": { "input": 5000, "output": 2100 },
      "elapsed_ms": 45000,
      "notes": "4 tests written"
    }
  ],
  "summary": {
    "total_tokens": 0,
    "tasks_completed": 0,
    "avg_tokens_per_task": 0
  }
}
```

#### Task Completion Report

After each task completes:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TASK-XXX COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Duration: 8m 32s
Files Created: 2 | Modified: 1
Tests Added: 4 (12 assertions)

Token Usage:
  This Task:  8,450 tokens
  Session:   23,890 tokens (23.9%)

Next: TASK-YYY - [Title]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Session Summary (at end of all tasks or pause)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 SESSION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tasks Completed: 5 of 8
Tasks Blocked: 1
Duration: 42m 15s

Token Usage:
  Total:      87,450 tokens (87.5%)
  Per Task:   17,490 avg
  Efficiency: Good (under 20k/task)

Files Changed:
  Created:  12 files
  Modified: 8 files
  Tests:    28 test cases

Progress Log: RLM/progress/token-usage/session-2024-12-09.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Automation Levels

Ask user preference if not specified:

| Level | Description | When AI Asks |
|-------|-------------|--------------|
| **AUTO** | Full autonomy | Only when blocked |
| **SUPERVISED** | Checkpoints | Before major decisions, after each task |
| **MANUAL** | Step-by-step | Before every step |

## Context Efficiency Notes

- Coder sub-agent receives only: task spec, feature spec, constitution
- Implementation happens in isolated context
- Primary agent only tracks progress, not implementation details
- Reduces context by ~60% for multi-task sessions
- Parallel spawning multiplies efficiency for large task sets

## Automatic Token Reporting

Token usage is tracked automatically:
- Each sub-agent call logged silently
- **50% budget**: Warning displayed, continue
- **75% budget**: "Consider completing current batch and resuming"
- **90% budget**: Auto-save context bundle, complete current batch only
- **Batch complete**: Show batch summary (tasks completed, tokens used)
- **All complete**: Show full summary

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
3. Task moved to `RLM/tasks/blocked/` with blocker details
4. On-error hook invoked for problem-solving
5. Continue with remaining tasks

To retry blocked tasks:
```
/cc-implement TASK-005  # Retry specific task
/cc-implement blocked   # Retry all blocked tasks
```
