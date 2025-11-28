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

### Step 6: Report Token Usage
Log implementation session metrics.

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
