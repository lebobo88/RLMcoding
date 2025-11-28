# RLM Prompts

These prompts work with **any AI coding agent** in **any IDE**. Simply copy the prompt content into your AI chat, or tell your AI to read the file.

## Quick Reference

| Prompt | Purpose | Command (Claude Code) |
|--------|---------|----------------------|
| [01-DISCOVER.md](01-DISCOVER.md) | Transform idea into PRD | `/discover [idea]` |
| [02-CREATE-SPECS.md](02-CREATE-SPECS.md) | Generate specs from PRD | `/create-specs` |
| [03-CREATE-TASKS.md](03-CREATE-TASKS.md) | Break features into tasks | `/create-tasks` |
| [04-IMPLEMENT-TASK.md](04-IMPLEMENT-TASK.md) | Implement single task (TDD) | `/implement TASK-XXX` |
| [05-IMPLEMENT-ALL.md](05-IMPLEMENT-ALL.md) | Implement all active tasks | `/implement all` |
| [06-RESUME.md](06-RESUME.md) | Resume interrupted session | `/implement resume` |
| [07-TEST.md](07-TEST.md) | Run and fix tests | `/test` |
| [08-REPORT.md](08-REPORT.md) | Generate progress report | `/report` |

## How to Use

### Claude Code
Use slash commands directly:
```
/discover Build a task management app
```

### Cursor, Windsurf, VS Code, Aider, etc.
Tell your AI to read and follow the prompt:
```
Read RLM/prompts/01-DISCOVER.md and help me discover specs for:
Build a task management app with AI prioritization
```

Or copy the entire prompt content into your chat.

## Workflow

```
Start Here
    │
    ├─── Have an idea? ───────► 01-DISCOVER.md
    │                                  │
    │                                  ▼
    │                           [PRD Generated]
    │                                  │
    └─── Have a PRD? ─────────────────┘
                                       │
                                       ▼
                              02-CREATE-SPECS.md
                                       │
                                       ▼
                              03-CREATE-TASKS.md
                                       │
                                       ▼
                        ┌──────────────┼──────────────┐
                        │              │              │
                        ▼              ▼              ▼
              04-IMPLEMENT      05-IMPLEMENT     06-RESUME
              (one task)        (all tasks)      (continue)
                        │              │              │
                        └──────────────┴──────────────┘
                                       │
                                       ▼
                                 07-TEST.md
                                       │
                                       ▼
                                 08-REPORT.md
```

## Automation Levels

When implementing, you choose the level of AI autonomy:

| Level | Description | Best For |
|-------|-------------|----------|
| **AUTO** | AI makes all decisions | Simple tasks, overnight runs |
| **SUPERVISED** | AI pauses at checkpoints | Most development work |
| **MANUAL** | AI explains each step | Learning, complex decisions |

## File Dependencies

```
01-DISCOVER.md
├── Reads: (nothing required)
└── Creates: RLM/specs/PRD.md, RLM/specs/constitution.md

02-CREATE-SPECS.md
├── Reads: RLM/specs/PRD.md, RLM/templates/
└── Creates: RLM/specs/features/*, RLM/specs/architecture/*

03-CREATE-TASKS.md
├── Reads: RLM/specs/features/*, RLM/specs/epics/*
└── Creates: RLM/tasks/active/*.md, RLM/tasks/INDEX.md

04-IMPLEMENT-TASK.md
├── Reads: RLM/tasks/active/TASK-XXX.md, RLM/specs/constitution.md
└── Creates: Source code, tests, RLM/progress/logs/*

05-IMPLEMENT-ALL.md
├── Reads: RLM/tasks/active/*.md, RLM/progress/status.json
└── Creates: Source code, tests, session logs

06-RESUME.md
├── Reads: RLM/progress/status.json, session logs
└── Continues: Previous implementation session

07-TEST.md
├── Reads: Test files, source code
└── Creates: Test results, fixes

08-REPORT.md
├── Reads: RLM/progress/*, RLM/tasks/*
└── Creates: Progress reports
```

## Tips

1. **Start simple** - Use SUPERVISED mode until comfortable with the workflow
2. **Review PRD carefully** - It shapes everything downstream
3. **Keep tasks small** - 1-4 hours per task is ideal
4. **Run tests often** - Don't wait until the end
5. **Save progress** - The system tracks state for resume capability
