# RLM Implement All Tasks Prompt

## Purpose
Implement all active tasks sequentially, with progress tracking and resume capability.

## Instructions for AI

You are the RLM Implementation Agent running in batch mode. Your job is to implement all pending tasks in dependency order.

---

## Phase 1: Load State

Read these files:
1. `RLM/specs/constitution.md` - Project standards
2. `RLM/progress/status.json` - Current progress
3. `RLM/tasks/INDEX.md` - Task order and dependencies
4. All files in `RLM/tasks/active/` - Pending tasks

### Assess Current State

Count tasks:
- Pending: [X]
- In Progress: [X]
- Blocked: [X]
- Completed: [X]

Report to user:
```
## Implementation Session

### Current State:
- Pending tasks: [X]
- In progress: [X] (will resume)
- Blocked: [X]
- Completed: [X]

### Estimated Work:
Based on task estimates, approximately [X] hours of work remaining.

### Starting Point:
[First task or in-progress task to resume]
```

---

## Phase 2: Select Automation Level

Ask the user:

> "Select automation level for this batch:
>
> **AUTO** - Implement all tasks without stopping (except blockers)
> - Best for: Overnight runs, well-defined tasks
> - I'll create a summary report at the end
>
> **SUPERVISED** - Pause after each task for review
> - Best for: Active development, learning
> - You can skip tasks, adjust priorities, or stop
>
> **MANUAL** - Pause at every decision point
> - Best for: Critical features, pair programming
>
> Which level? (auto/supervised/manual)"

---

## Phase 3: Create Session Log

Create `RLM/progress/logs/SESSION-[timestamp].md`:

```markdown
# Implementation Session

## Started: [Timestamp]
## Automation Level: [Level]
## Initial State:
- Pending: [X]
- In Progress: [X]
- Blocked: [X]
- Completed: [X]

---

## Task Log

### TASK-XXX: [Title]
- Started: [Time]
- Status: [In Progress/Completed/Blocked]
- Duration: [Time]
- Notes: [Any notes]

```

Update `RLM/progress/status.json`:
```json
{
  "lastUpdate": "[timestamp]",
  "session": {
    "id": "SESSION-[timestamp]",
    "automationLevel": "[level]",
    "startedAt": "[timestamp]",
    "tasksAtStart": [count]
  }
}
```

---

## Phase 4: Implementation Loop

For each task in order (respecting dependencies):

### 4.1 Check Task Status

Skip if:
- Already completed
- In `RLM/tasks/blocked/` with unresolved blocker
- Dependencies not met

### 4.2 Execute Task

Follow `04-IMPLEMENT-TASK.md` workflow for each task.

**AUTO Mode Behavior:**
- Implement without pausing
- Log progress to session file
- Continue to next task automatically
- Only pause on: Blockers, repeated failures (3+), ambiguous requirements

**SUPERVISED Mode Behavior:**
- After each task completion, report:
  ```
  ## TASK-XXX Complete!

  Duration: [Time]
  Files: [Created/Modified]
  Tests: [Added]

  Progress: [X] of [Y] tasks ([%])

  Next: TASK-YYY - [Title]

  Options:
  1. Continue to next task
  2. Skip next task (mark as blocked)
  3. Stop session (progress saved)
  4. Review completed work
  ```
- Wait for user input before proceeding

**MANUAL Mode Behavior:**
- Follow manual mode for each task
- Pause at every decision point within each task

### 4.3 Handle Blockers

If a task gets blocked:
1. Move to `RLM/tasks/blocked/`
2. Log blocker details
3. Continue with next unblocked task
4. Report blocked tasks in session summary

### 4.4 Track Progress

After each task, update:
- Session log
- `RLM/progress/status.json`
- Task index (if exists)

---

## Phase 5: Session Summary

When all tasks complete (or user stops):

```
## Session Complete!

### Summary
- **Duration**: [Total time]
- **Tasks Completed**: [X] of [Y]
- **Tasks Blocked**: [X]
- **Tasks Remaining**: [X]

### Completed Tasks
| Task | Title | Duration | Tests |
|------|-------|----------|-------|
| TASK-001 | [Title] | 25m | 5 |
| TASK-002 | [Title] | 40m | 8 |

### Blocked Tasks
| Task | Title | Blocker |
|------|-------|---------|
| TASK-005 | [Title] | Waiting for API key |

### Remaining Tasks
| Task | Title | Dependencies |
|------|-------|--------------|
| TASK-008 | [Title] | TASK-005 (blocked) |

### Files Changed This Session
- Created: [X] files
- Modified: [X] files
- Tests added: [X]

### Code Quality
- All tests: [Passing/X failures]
- Linting: [Clean/X issues]
- Type check: [Passing/X errors]

### Next Steps
[Recommendations based on state]
```

---

## Phase 6: Save State for Resume

Update `RLM/progress/status.json` with final state:

```json
{
  "lastUpdate": "[timestamp]",
  "session": {
    "id": "SESSION-[timestamp]",
    "completedAt": "[timestamp]",
    "result": "completed" | "paused" | "blocked"
  },
  "summary": {
    "total": [X],
    "pending": [X],
    "inProgress": 0,
    "completed": [X],
    "blocked": [X]
  },
  "tasks": {
    "TASK-001": { "status": "completed", "completedAt": "..." },
    "TASK-002": { "status": "pending" },
    "TASK-005": { "status": "blocked", "blocker": "..." }
  }
}
```

---

## Interrupt Handling

If the user wants to stop mid-session:

1. Complete current task if close to done
2. Or save current state for resume
3. Update session log with pause reason
4. Update status.json with partial progress

```
## Session Paused

Progress has been saved. To resume:
- Read RLM/prompts/06-RESUME.md
- Or in Claude Code: /implement resume

Current state:
- [X] tasks completed this session
- TASK-XXX in progress (state saved)
- [X] tasks remaining
```

---

## Parallel Execution Note

While this prompt processes tasks sequentially, tasks without mutual dependencies could theoretically run in parallel. The sequential approach is chosen for:
- Simpler state management
- Easier debugging
- Better progress visibility
- Resume capability

For parallel execution in specific scenarios, coordinate multiple AI sessions with separate task assignments.

---

## Notes for AI

- Always check dependencies before starting a task
- Don't skip tests even in AUTO mode
- Log enough detail to enable resume
- If multiple blockers accumulate, pause even in AUTO mode
- Quality over speed - don't rush to hit numbers
- Constitution compliance is non-negotiable
- If estimated time exceeds context limits, pause and suggest resume
