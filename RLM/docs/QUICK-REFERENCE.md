# RLM Quick Reference

## Workflow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        RLM WORKFLOW                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   START                                                          │
│     │                                                            │
│     ├── Have idea? ──────► /discover ─────┐                      │
│     │                                     │                      │
│     └── Have PRD? ────────────────────────┴──► /create-specs     │
│                                                      │           │
│                                                      ▼           │
│                                               /create-tasks      │
│                                                      │           │
│                    ┌─────────────────────────────────┤           │
│                    │              │                  │           │
│                    ▼              ▼                  ▼           │
│              /implement     /implement all    /implement resume  │
│              TASK-XXX       (all tasks)       (continue)         │
│                    │              │                  │           │
│                    └──────────────┴──────────────────┘           │
│                                   │                              │
│                                   ▼                              │
│                              /test | /report                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Commands (Claude Code)

| Command | Purpose | Prompt File |
|---------|---------|-------------|
| `/discover [idea]` | Create PRD from idea | `01-DISCOVER.md` |
| `/create-specs` | Generate specs from PRD | `02-CREATE-SPECS.md` |
| `/create-tasks` | Break specs into tasks | `03-CREATE-TASKS.md` |
| `/implement TASK-XXX` | Implement single task | `04-IMPLEMENT-TASK.md` |
| `/implement all` | Implement all tasks | `05-IMPLEMENT-ALL.md` |
| `/implement resume` | Resume previous session | `06-RESUME.md` |

## For Other IDEs

Copy prompt or tell AI:
```
Read RLM/prompts/[prompt-name].md and follow it
```

## Automation Levels

| Level | AI Autonomy | Pauses At |
|-------|-------------|-----------|
| **AUTO** | Full | Blockers only |
| **SUPERVISED** | Guided | Key decisions |
| **MANUAL** | Step-by-step | Every action |

## Key Directories

| Directory | Contents |
|-----------|----------|
| `RLM/prompts/` | Workflow prompts (copy to AI) |
| `RLM/specs/` | PRD, constitution, feature specs |
| `RLM/tasks/active/` | Pending tasks |
| `RLM/tasks/completed/` | Done tasks |
| `RLM/progress/` | Status, logs |

## Key Files

| File | Purpose |
|------|---------|
| `RLM/START-HERE.md` | Entry point |
| `RLM/specs/PRD.md` | Product requirements |
| `RLM/specs/constitution.md` | Project standards |
| `RLM/tasks/INDEX.md` | Task overview |
| `RLM/progress/status.json` | Current state |

## Task Lifecycle

```
pending → in_progress → completed
                    ↘ blocked
```

## TDD Cycle

```
1. Write Test (Red)
2. Run Test (Fails)
3. Write Code (Green)
4. Run Test (Passes)
5. Refactor
6. Repeat
```

## Output by Phase

| Phase | Command | Creates |
|-------|---------|---------|
| Discovery | `/discover` | PRD.md, constitution.md |
| Specs | `/create-specs` | features/, architecture/ |
| Tasks | `/create-tasks` | tasks/active/*.md, INDEX.md |
| Implement | `/implement` | Source code, tests, logs |

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| AI doesn't know RLM | "Read RLM/START-HERE.md" |
| Missing PRD | Run `/discover` first |
| Can't resume | Check status.json |
| Tasks too big | Request finer granularity |

## Document Locations

```
Specifications:
  RLM/specs/PRD.md
  RLM/specs/constitution.md
  RLM/specs/features/FTR-XXX/spec.md
  RLM/specs/architecture/overview.md
  RLM/specs/epics/breakdown.md

Tasks:
  RLM/tasks/active/TASK-XXX.md
  RLM/tasks/completed/TASK-XXX.md
  RLM/tasks/INDEX.md

Progress:
  RLM/progress/status.json
  RLM/progress/logs/TASK-XXX.md
  RLM/progress/logs/SESSION-XXX.md
```
