---
description: Implement RLM tasks with TDD
---

Implement tasks using the RLM Implementation workflow.

**Arguments**: $ARGUMENTS

## Usage

| Command | Action | Prompt |
|---------|--------|--------|
| `/implement TASK-001` | Implement single task | `RLM/prompts/04-IMPLEMENT-TASK.md` |
| `/implement all` | Implement all active tasks | `RLM/prompts/05-IMPLEMENT-ALL.md` |
| `/implement resume` | Resume interrupted session | `RLM/prompts/06-RESUME.md` |

## Determine Action

Based on arguments:
- If argument is `all` → Read `RLM/prompts/05-IMPLEMENT-ALL.md`
- If argument is `resume` → Read `RLM/prompts/06-RESUME.md`
- If argument is `TASK-XXX` → Read `RLM/prompts/04-IMPLEMENT-TASK.md`
- If no argument → Show task status and ask which to implement

## Automation Levels

You will be asked to choose an automation level:

| Level | Description | When AI Asks You |
|-------|-------------|------------------|
| **AUTO** | Full autonomy | Only when blocked |
| **SUPERVISED** | Checkpoints | Before key decisions |
| **MANUAL** | Step-by-step | Before each step |

## TDD Process

All implementation follows Test-Driven Development:
1. Write tests first (they should fail)
2. Implement code (tests should pass)
3. Refactor (tests still pass)

## Prerequisites

- Tasks must exist in `RLM/tasks/active/`
- Run `/create-tasks` first if no tasks exist

## Progress Tracking

Progress is automatically saved to:
- `RLM/progress/status.json` - Current state
- `RLM/progress/logs/TASK-XXX.md` - Task logs
- `RLM/progress/logs/SESSION-XXX.md` - Session logs (for `/implement all`)

## Examples

```
/implement TASK-001
/implement all
/implement resume
```

## For Other IDEs

Tell your AI:
- Single task: "Read RLM/prompts/04-IMPLEMENT-TASK.md and implement TASK-001"
- All tasks: "Read RLM/prompts/05-IMPLEMENT-ALL.md"
- Resume: "Read RLM/prompts/06-RESUME.md"
