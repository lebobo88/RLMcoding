---
description: Break features into fine-grained implementation tasks
---

Read and follow the RLM Create Tasks workflow at `RLM/prompts/03-CREATE-TASKS.md`.

## Quick Overview

This command breaks your feature specifications into fine-grained, implementable tasks:

1. **Load Specs** - Read all feature specifications
2. **Analyze Dependencies** - Determine task order
3. **Create Tasks** - Fine-grained tasks (1-4 hours each)
4. **Build Index** - Task overview with dependencies

## Task Granularity

Tasks are broken down to be small and focused. For example, "User Authentication" becomes:

- TASK-001: Create User data model
- TASK-002: Implement password hashing
- TASK-003: Create registration endpoint
- TASK-004: Add registration validation
- TASK-005: Create login endpoint
- TASK-006: Implement JWT generation
- ... and more

## Prerequisites

- Feature specs must exist in `RLM/specs/features/`
- Run `/create-specs` first if specs don't exist

## Output Files

- `RLM/tasks/active/TASK-XXX.md` - Individual task files
- `RLM/tasks/INDEX.md` - Task overview and dependencies

## Next Steps

1. Review tasks in `RLM/tasks/active/`
2. Review task order in `RLM/tasks/INDEX.md`
3. Start implementing: `/implement TASK-001` or `/implement all`

## Examples

```
/create-tasks
```

## For Other IDEs

Copy `RLM/prompts/03-CREATE-TASKS.md` into your AI chat, or tell your AI:
"Read RLM/prompts/03-CREATE-TASKS.md and break down features into tasks"
