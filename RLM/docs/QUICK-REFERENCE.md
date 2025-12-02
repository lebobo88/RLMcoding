# RLM Quick Reference (v2.5)

## Complete Workflow Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        RLM PIPELINE (v2.5)                                  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  PATH 1: FROM ZERO              PATH 2: FROM PRD                           │
│  /cc-full [idea]                /cc-full --from-prd                        │
│       │                              │                                     │
│       ▼                              │                                     │
│  Phase 1: DISCOVER ◄─────────────────┘                                     │
│       │                                                                    │
│       ▼                                                                    │
│  Phase 2: DESIGN SYSTEM ─────► /cc-design system                           │
│       │                                                                    │
│       ▼                                                                    │
│  Phase 3: SPECS ─────────────► /cc-create-specs                            │
│       │                                                                    │
│       ▼                                                                    │
│  Phase 4: FEATURE DESIGN ────► /cc-design feature FTR-XXX                  │
│       │                                                                    │
│       ▼                                                                    │
│  Phase 5: TASKS ─────────────► /cc-create-tasks                            │
│       │                                                                    │
│       ▼                                                                    │
│  Phase 6: IMPLEMENT ─────────► /cc-implement all (parallel)                │
│       │                                                                    │
│       ▼                                                                    │
│  Phase 7: QUALITY ───────────► /cc-design qa + /cc-review + /cc-test       │
│       │                                                                    │
│       ▼                                                                    │
│  Phase 8: VERIFY ────────────► /cc-verify FTR-XXX                          │
│       │                                                                    │
│       ▼                                                                    │
│  Phase 9: REPORT                                                           │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
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

### Enhanced Commands (v2.5)

| Command | Phase | Purpose |
|---------|-------|---------|
| `/cc-full [idea]` | All | Complete 9-phase automation |
| `/cc-full --from-prd` | 2-9 | Start from existing PRD |
| `/cc-discover [idea]` | 1 | Discovery with research agent |
| `/cc-design system` | 2 | Generate design system |
| `/cc-create-specs` | 3 | Specs from PRD |
| `/cc-design feature FTR-XXX` | 4 | Feature UI/UX specs |
| `/cc-create-tasks` | 5 | Break features into tasks |
| `/cc-implement [task\|all]` | 6 | TDD with parallel agents |
| `/cc-design qa` | 7 | 117-point design QA |
| `/cc-review` | 7 | Code review |
| `/cc-test` | 7 | Testing with coverage |
| `/cc-verify FTR-XXX` | 8 | E2E feature verification |

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

## Sub-Agents (v2.5)

| Agent | Purpose | Used In |
|-------|---------|---------|
| Research | Web research, competitors | Phase 1 |
| Architect | Tech decisions, ADRs | Phase 1, 3 |
| Designer | Design system, UI/UX specs | Phase 2, 4, 7 |
| Coder | TDD implementation | Phase 6 |
| Tester | Test coverage | Phase 7 |
| Reviewer | Code review, security | Phase 7 |
| Verifier | E2E tests, accessibility | Phase 8 |

## Key Directories

| Directory | Contents |
|-----------|----------|
| `RLM/prompts/` | Workflow prompts (copy to AI) |
| `RLM/specs/` | PRD, constitution, feature specs |
| `RLM/specs/design/` | Design system, tokens, components |
| `RLM/tasks/active/` | Pending tasks |
| `RLM/tasks/completed/` | Done tasks |
| `RLM/progress/` | Status, logs, QA reports, verification |

## Key Files

| File | Purpose |
|------|---------|
| `RLM/START-HERE.md` | Entry point |
| `RLM/specs/PRD.md` | Product requirements |
| `RLM/specs/constitution.md` | Project standards |
| `RLM/specs/design/design-system.md` | Design system |
| `RLM/tasks/INDEX.md` | Task overview |
| `RLM/progress/status.json` | Current state |

## Task Lifecycle

```
pending → in_progress → completed
                    ↘ blocked
```

## Feature Lifecycle (v2.5)

```
in_progress → verification-pending → verified
                      ↓
              verification-failed
                      ↓
              (fix bugs, retry)
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

## Output by Phase (v2.5)

| Phase | Command | Creates |
|-------|---------|---------|
| 1. Discovery | `/cc-discover` | PRD.md, constitution.md |
| 2. Design | `/cc-design system` | design-system.md, tokens/ |
| 3. Specs | `/cc-create-specs` | features/, architecture/ |
| 4. Feature Design | `/cc-design feature` | FTR-XXX/design-spec.md |
| 5. Tasks | `/cc-create-tasks` | tasks/active/*.md, INDEX.md |
| 6. Implement | `/cc-implement` | Source code, tests |
| 7. Quality | `/cc-design qa` | design-qa/, reviews/ |
| 8. Verify | `/cc-verify` | verification/, e2e tests |
| 9. Report | auto | progress/reports/ |

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| AI doesn't know RLM | "Read RLM/START-HERE.md" |
| Missing PRD | Run `/cc-discover` first |
| Missing design system | Run `/cc-design system` first |
| Can't resume | Check status.json |
| Tasks too big | Request finer granularity |
| Design QA failing | Fix issues, run `/cc-design qa` again |

## Document Locations

```
Specifications:
  RLM/specs/PRD.md
  RLM/specs/constitution.md
  RLM/specs/features/FTR-XXX/spec.md
  RLM/specs/features/FTR-XXX/design-spec.md
  RLM/specs/architecture/overview.md
  RLM/specs/epics/breakdown.md

Design (v2.5):
  RLM/specs/design/design-system.md
  RLM/specs/design/tokens/tokens.json
  RLM/specs/design/tokens/[framework exports]
  RLM/specs/design/components/[name].md
  RLM/specs/design/research/

Tasks:
  RLM/tasks/active/TASK-XXX.md
  RLM/tasks/completed/TASK-XXX.md
  RLM/tasks/INDEX.md

Progress:
  RLM/progress/status.json
  RLM/progress/logs/TASK-XXX.md
  RLM/progress/design-qa/
  RLM/progress/verification/
  RLM/progress/reviews/
```

## Design Quick Reference

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

## Verification Tests (v2.5)

| Type | Tool | Checks |
|------|------|--------|
| Functional | Playwright | User flows, forms, navigation |
| Accessibility | axe-core | WCAG 2.1 AA compliance |
| Visual | Screenshots | UI states, responsive layouts |

## Skip Options for /cc-full

```
--skip-design-research    # Skip UX research phase
--skip-feature-design     # Skip feature design specs
--skip-design-qa          # Skip design QA checks
--skip-verification       # Skip E2E verification
```
