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

### Standard Commands

| Command | Purpose | Prompt File |
|---------|---------|-------------|
| `/discover [idea]` | Create PRD from idea | `01-DISCOVER.md` |
| `/create-specs` | Generate specs from PRD | `02-CREATE-SPECS.md` |
| `/create-tasks` | Break specs into tasks | `03-CREATE-TASKS.md` |
| `/implement TASK-XXX` | Implement single task | `04-IMPLEMENT-TASK.md` |
| `/implement all` | Implement all tasks | `05-IMPLEMENT-ALL.md` |
| `/implement resume` | Resume previous session | `06-RESUME.md` |

### Enhanced Commands (v2.4)

| Command | Purpose |
|---------|---------|
| `/cc-full [idea]` | Full automation: idea → code |
| `/cc-discover [idea]` | Discovery with research agent |
| `/cc-create-specs` | Specs from PRD |
| `/cc-implement [task\|all]` | TDD with parallel agents |
| `/cc-design system` | Generate design system |
| `/cc-design component [name]` | Component specification |
| `/cc-design qa` | 117-point design QA |
| `/cc-design tokens` | Framework-specific tokens |
| `/cc-review` | Code review |
| `/cc-test` | Testing with coverage |

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
| `RLM/specs/design/` | Design system, component specs (v2.4) |
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

Design (v2.4):
  RLM/specs/design/design-system.md
  RLM/specs/design/tokens.json
  RLM/specs/design/components/[name].md
  RLM/specs/design/features/FTR-XXX-design.md

Tasks:
  RLM/tasks/active/TASK-XXX.md
  RLM/tasks/completed/TASK-XXX.md
  RLM/tasks/INDEX.md

Progress:
  RLM/progress/status.json
  RLM/progress/logs/TASK-XXX.md
  RLM/progress/logs/SESSION-XXX.md
```

## Design Quick Reference (v2.4)

### 8 Component States
```
Default → Hover → Focus → Active
                     ↓
Disabled ← Loading ← Error ← Empty
```

### Animation Tiers
| Tier | Technology | Duration |
|------|------------|----------|
| MINIMAL | CSS | 150-200ms |
| MODERATE | Framer Motion | 200-400ms |
| RICH | GSAP | 300-600ms |

### Design QA Categories
| Category | Points | Pass |
|----------|--------|------|
| Visual | 20 | 18+ |
| Accessibility | 25 | 23+ |
| States | 18 | 16+ |
| Responsive | 18 | 16+ |
| Animation | 12 | 11+ |
| Error | 12 | 11+ |
| Performance | 12 | 11+ |
| **Total** | **117** | **≥105** |
