# RLM Quick Reference (v2.7)

## Complete Workflow Diagram

```
+----------------------------------------------------------------------------+
|                        RLM 9-PHASE PIPELINE (v2.7)                          |
+----------------------------------------------------------------------------+
|                                                                            |
|  PATH 1: FROM ZERO              PATH 2: FROM PRD                           |
|  /cc-full [idea]                /cc-full --from-prd                        |
|  /rlm-full [idea]               /rlm-full --from-prd                       |
|       |                              |                                     |
|       v                              |                                     |
|  Phase 1: DISCOVER <-----------------+                                     |
|       |   (Auto-detects research in RLM/research/project/)                 |
|       v                                                                    |
|  Phase 2: DESIGN SYSTEM -------> /cc-design system (if UI)                 |
|       |   (Auto-detected: UI vs Non-UI classification)                     |
|       v                                                                    |
|  Phase 3: SPECS ---------------> /cc-create-specs                          |
|       |                                                                    |
|       v                                                                    |
|  Phase 4: FEATURE DESIGN ------> /cc-design feature FTR-XXX (if UI)        |
|       |                                                                    |
|       v                                                                    |
|  Phase 5: TASKS ---------------> /cc-create-tasks (checkpoint system)      |
|       |                                                                    |
|       v                                                                    |
|  Phase 6: IMPLEMENT -----------> /cc-implement all (parallel + progress)   |
|       |   (Integrated review per task, 5-step progress reporting)          |
|       v                                                                    |
|  Phase 7: QUALITY -------------> /cc-design qa + /cc-review + /cc-test     |
|       |                                                                    |
|       v                                                                    |
|  Phase 8: VERIFY --------------> /cc-verify FTR-XXX (auto-triggered)       |
|       |                                                                    |
|       v                                                                    |
|  Phase 9: REPORT                                                           |
|                                                                            |
+----------------------------------------------------------------------------+
```

## Commands

### Standard Commands (Any IDE)

| Command | Purpose | Prompt File |
|---------|---------|-------------|
| `/discover [idea]` | Create PRD from idea | `01-DISCOVER.md` |
| `/create-specs` | Generate specs from PRD | `02-CREATE-SPECS.md` |
| `/create-tasks` | Break specs into tasks | `03-CREATE-TASKS.md` |
| `/implement TASK-XXX` | Implement single task | `04-IMPLEMENT-TASK.md` |
| `/implement all` | Implement all tasks | `05-IMPLEMENT-ALL.md` |
| `/implement resume` | Resume previous session | `06-RESUME.md` |

### Enhanced Commands (Claude Code v2.7)

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

### New Commands (v2.7)

| Command | Purpose |
|---------|---------|
| `/cc-test-run [name]` | Run isolated test project for methodology validation |
| `/cc-debug context-audit` | Analyze context usage and optimization |
| `/cc-debug` | Full diagnostic scan and reconciliation |
| `/cc-debug quick` | Fast scan for common issues |
| `/cc-debug --auto-fix` | Auto-fix safe issues |
| `/rlm-full [idea]` | Standard prompt pipeline (non-CC) |

## Prompt Pattern Library (v2.7)

| Pattern | Use Case | Applied By |
|---------|----------|------------|
| `root-cause-analysis.md` | Bug investigation, 5-Whys | Coder, Tester |
| `decision-matrix.md` | Technology selection | Architect |
| `comparative-analysis.md` | Alternative evaluation | Architect, Research |
| `problem-decomposition.md` | Complex task breakdown | Coder |

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

## Sub-Agents

| Agent | Purpose | Phase | Proactive Triggers |
|-------|---------|-------|-------------------|
| Research | Web research, competitors | 1 | "what do others do?", market research |
| Architect | Tech decisions, ADRs | 1, 3 | "which technology?", trade-offs |
| Designer | Design system, UI/UX specs | 2, 4, 7 | UI feature start, colors/typography |
| Coder | TDD implementation | 6 | "build/implement/create", tasks |
| Tester | Test coverage | 7 | Coverage < 80%, flaky tests |
| Reviewer | Code review, security | 7 | Before commits, security code |
| Verifier | E2E tests, accessibility | 8 | Feature completion |

## Key Directories

| Directory | Contents |
|-----------|----------|
| `RLM/prompts/` | Workflow prompts |
| `RLM/prompts/patterns/` | Prompt patterns (v2.7) |
| `RLM/specs/` | PRD, constitution, feature specs |
| `RLM/specs/design/` | Design system, tokens, components |
| `RLM/tasks/active/` | Pending tasks |
| `RLM/tasks/completed/` | Done tasks |
| `RLM/progress/` | Status, checkpoint, logs, config |
| `RLM/research/project/` | Auto-detected project research |

## Key Files

| File | Purpose |
|------|---------|
| `RLM/START-HERE.md` | Entry point |
| `RLM/specs/PRD.md` | Product requirements |
| `RLM/specs/constitution.md` | Project standards |
| `RLM/specs/design/design-system.md` | Design system |
| `RLM/tasks/INDEX.md` | Task overview |
| `RLM/progress/status.json` | Current state |
| `RLM/progress/checkpoint.json` | Incremental tracking |
| `RLM/progress/cc-config.json` | Configuration |
| `RLM/templates/PRD-template-v2.md` | Enhanced PRD template (v2.7) |
| `RLM/templates/behavioral-economics-checklist.md` | Design checklist (v2.7) |

## Task Lifecycle

```
pending -> in_progress -> completed
                     \-> blocked
```

## Feature Lifecycle

```
in_progress -> verification-pending -> verified
                      |
              verification-failed
                      |
              (fix bugs, retry)
```

## 5-Step Progress Model

```
Step 1: Load specs and context      (0-20%)
Step 2: Write tests (TDD Red)       (20-40%)
Step 3: Implement code (TDD Green)  (40-70%)
Step 4: Run tests and fix           (70-85%)
Step 5: Quality checks and review   (85-100%)
```

## 3-Tier Context Management (v2.7)

| Tier | Goal | Strategy |
|------|------|----------|
| **Tier 1: REDUCE** | Minimize loaded | Selective file reading, summaries |
| **Tier 2: DELEGATE** | Offload high-token work | Sub-agent delegation |
| **Tier 3: MANAGE** | Handle overflow | Checkpoints, smart truncation |

## Context Thresholds

| Threshold | Action |
|-----------|--------|
| 50% | Save checkpoint, log warning, continue |
| 75% | Save checkpoint, activate truncation, suggest wrap-up |
| 90% | Save checkpoint, complete current task only, pause |
| 95% | Emergency bundle save, stop all work |

## Token Efficiency Ratings

| Rating | Tokens/Task | Interpretation |
|--------|-------------|----------------|
| Excellent | < 10,000 | Simple task |
| Good | 10-20,000 | Normal complexity |
| Fair | 20-35,000 | Complex or rework |
| Poor | > 35,000 | Consider splitting |

## Behavioral Economics Principles (v2.7)

| Principle | Application |
|-----------|-------------|
| Choice Architecture | Design defaults to guide choices |
| Prospect Theory | Frame as loss/gain appropriately |
| Anchoring | Strategic pricing presentation |
| Social Proof | Display genuine user activity |
| Endowment Effect | Create ownership through personalization |
| Scarcity/Urgency | Use only for genuine constraints |
| Cognitive Load | Progressive disclosure |

## Cognitive Psychology Laws (v2.7)

| Law | UX Application |
|-----|----------------|
| Fitts's Law | Min 44x44px targets |
| Hick's Law | Max 7+/-2 choices |
| Miller's Law | Chunk information |
| Jakob's Law | Use familiar patterns |
| Peak-End Rule | Polish endings |
| Von Restorff Effect | Visual hierarchy for CTAs |

## Output by Phase

| Phase | Command | Creates |
|-------|---------|---------|
| 1. Discovery | `/cc-discover` | PRD.md, constitution.md |
| 2. Design | `/cc-design system` | design-system.md, tokens/ |
| 3. Specs | `/cc-create-specs` | features/, architecture/ |
| 4. Feature Design | `/cc-design feature` | FTR-XXX/design-spec.md |
| 5. Tasks | `/cc-create-tasks` | tasks/active/*.md, checkpoint.json |
| 6. Implement | `/cc-implement` | Source code, tests |
| 7. Quality | `/cc-design qa` | design-qa/, reviews/ |
| 8. Verify | `/cc-verify` | verification/, e2e tests |
| 9. Report | auto | progress/reports/ |

## Debug Issues Detected

| Issue Type | Description |
|------------|-------------|
| `orphan-tasks` | Tasks with no parent feature |
| `missing-tasks` | Features with incomplete coverage |
| `status-mismatch` | File status vs status.json |
| `checkpoint-drift` | Checkpoint out of sync |
| `broken-deps` | Non-existent dependencies |
| `duplicate-ids` | Same ID used twice |
| `missing-specs` | Tasks referencing missing specs |
| `stale-progress` | Progress files > 24h old |
| `blocked-loop` | Circular blocking dependencies |
| `incomplete-metadata` | Missing required fields |

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| AI doesn't know RLM | "Read RLM/START-HERE.md" |
| Missing PRD | Run `/cc-discover` first |
| Missing design system | Run `/cc-design system` |
| Can't resume | Check status.json or checkpoint.json |
| State inconsistent | Run `/cc-debug quick` |
| Context overflow | Session auto-saved, use `/implement resume` |
| Tasks overwritten | Use checkpoint system (auto) |
| High token usage | Run `/cc-debug context-audit` |

## Document Locations

```
Specifications:
  RLM/specs/PRD.md
  RLM/specs/constitution.md
  RLM/specs/features/FTR-XXX/spec.md
  RLM/specs/features/FTR-XXX/design-spec.md
  RLM/specs/architecture/overview.md

Design:
  RLM/specs/design/design-system.md
  RLM/specs/design/tokens/tokens.json
  RLM/specs/design/components/[name].md

Tasks:
  RLM/tasks/active/TASK-XXX.md
  RLM/tasks/completed/TASK-XXX.md
  RLM/tasks/INDEX.md

Progress:
  RLM/progress/status.json
  RLM/progress/checkpoint.json
  RLM/progress/cc-config.json
  RLM/progress/token-usage/
  RLM/progress/bundles/
  RLM/progress/verification/

Research:
  RLM/research/project/

Patterns (v2.7):
  RLM/prompts/patterns/root-cause-analysis.md
  RLM/prompts/patterns/decision-matrix.md
  RLM/prompts/patterns/comparative-analysis.md
  RLM/prompts/patterns/problem-decomposition.md

Templates (v2.7):
  RLM/templates/PRD-template-v2.md
  RLM/templates/behavioral-economics-checklist.md
```

## Design Quick Reference

### 8 Component States
```
Default -> Hover -> Focus -> Active
                     |
Disabled <- Loading <- Error <- Empty
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
| **Total** | **117** | **>=105** |

## Verification Tests

| Type | Tool | Checks |
|------|------|--------|
| Functional | Playwright | User flows, forms, navigation |
| Accessibility | axe-core | WCAG 2.1 AA compliance |
| Visual | Screenshots | UI states, responsive layouts |

## Skip Options for /cc-full

```bash
--skip-design-research    # Skip UX research phase
--skip-feature-design     # Skip feature design specs
--skip-design-qa          # Skip design QA checks
--skip-verification       # Skip E2E verification
```

## Configuration Options

```bash
/cc-config parallel_limit 8              # Concurrent sub-agents
/cc-config automation_level auto         # Full autonomy
/cc-config reporting.mode both           # realtime + silent
/cc-config design.auto_detect true       # Auto UI/Non-UI
/cc-config enhancements.prompt_patterns.enabled true  # v2.7
/cc-config enhancements.behavioral_economics.enabled true  # v2.7
```

## Test Mode (v2.7)

```bash
/cc-test-run my-test-project                    # Interactive
/cc-test-run my-test-project --from-prd path/   # From PRD
/cc-test-run my-test-project --idea "desc"      # With idea
```

Creates: `test_projects/[name]-[timestamp]/`
Collects: tokens, time, LOC, coverage
