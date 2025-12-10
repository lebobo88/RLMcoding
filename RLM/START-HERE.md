# RLM - Research, Lead, Manage (v2.6)

## AI-Powered Software Development Method

RLM transforms raw ideas into production-ready code through a structured 9-phase pipeline that works with **any AI coding agent** in **any IDE**.

---

## Key Features

- **9-Phase Pipeline** - Complete automation from idea to verified code
- **Real-Time Progress** - Visual progress bars, step-by-step updates, token tracking
- **7 Specialized Agents** - Research, Architect, Designer, Coder, Tester, Reviewer, Verifier
- **Two Entry Points** - Start from zero (`/cc-full [idea]`) or from PRD (`/cc-full --from-prd`)
- **TDD by Default** - Test-Driven Development with integrated review
- **Design System Integration** - Full UI/UX engineering with tokens and accessibility
- **Context Management** - Automatic checkpointing at 50%, 75%, 90% thresholds
- **Debug & Reconciliation** - Built-in state validation and repair (`/cc-debug`)
- **Resume Capability** - Stop and continue anytime without losing progress
- **IDE Parity** - Works with Claude Code, Cursor, Windsurf, VS Code, Aider, and more

---

## Quick Start: Choose Your Path

### Path 1: Starting from Zero (No PRD)
**You have:** A project idea
**You need:** Complete specifications and implementation

```
Tell your AI: "Read RLM/prompts/01-DISCOVER.md and help me discover specs for: [your idea]"
```

Or in Claude Code: `/discover [your idea]` or `/cc-full [your idea]`

### Path 2: Starting from PRD
**You have:** An existing PRD (Product Requirements Document)
**You need:** Technical specs, tasks, and implementation

```
Tell your AI: "Read RLM/prompts/02-CREATE-SPECS.md and generate specs from my PRD"
```

Or in Claude Code: `/create-specs` or `/cc-full --from-prd`

---

## Complete 9-Phase Pipeline

```
+------------------------------------------------------------------------------+
|                         RLM 9-PHASE PIPELINE (v2.6)                          |
+------------------------------------------------------------------------------+
|                                                                              |
|  PATH 1: FROM ZERO                    PATH 2: FROM PRD                       |
|  /cc-full [idea]                      /cc-full --from-prd                    |
|       |                                    |                                 |
|       v                                    |                                 |
|  Phase 1: DISCOVER <-----------------------+                                 |
|  [PRD.md + constitution.md with design requirements]                         |
|  (Auto-detects research in RLM/research/project/)                            |
|       |                                                                      |
|       v                                                                      |
|  Phase 2: DESIGN SYSTEM (UI projects only)                                   |
|  [/cc-design system -> tokens, component library]                            |
|  (Auto-detected: UI score >= 3)                                              |
|       |                                                                      |
|       v                                                                      |
|  Phase 3: SPECIFICATIONS                                                     |
|  [/cc-create-specs -> features, architecture]                                |
|       |                                                                      |
|       v                                                                      |
|  Phase 4: FEATURE DESIGN (UI projects only)                                  |
|  [/cc-design feature FTR-XXX -> UI/UX specs]                                 |
|       |                                                                      |
|       v                                                                      |
|  Phase 5: TASKS                                                              |
|  [/cc-create-tasks -> fine-grained tasks with checkpoint tracking]           |
|  (Incremental: only creates tasks for NEW features)                          |
|       |                                                                      |
|       v                                                                      |
|  Phase 6: IMPLEMENTATION                                                     |
|  [/cc-implement all -> parallel TDD with 5-step progress]                    |
|  (Real-time progress + integrated review per task)                           |
|       |                                                                      |
|       v                                                                      |
|  Phase 7: QUALITY                                                            |
|  [/cc-design qa + /cc-review + /cc-test]                                     |
|       |                                                                      |
|       v                                                                      |
|  Phase 8: VERIFICATION                                                       |
|  [/cc-verify FTR-XXX -> E2E tests per feature (auto-triggered)]              |
|       |                                                                      |
|       v                                                                      |
|  Phase 9: REPORT                                                             |
|  [Complete project summary with token efficiency metrics]                    |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## Using RLM with Your AI Coding Agent

### Claude Code (Recommended)

**Standard Commands** (IDE-agnostic):
| Command | Purpose |
|---------|---------|
| `/discover [idea]` | Transform idea into PRD |
| `/create-specs` | Generate specs from PRD |
| `/create-tasks` | Break features into tasks |
| `/implement TASK-XXX` | Implement single task |
| `/implement all` | Implement all tasks |
| `/implement resume` | Resume interrupted session |

**Enhanced Commands** (Complete 9-phase pipeline):
| Command | Phase | Purpose |
|---------|-------|---------|
| `/cc-full [idea]` | 1-9 | **Complete automation**: idea -> verified code |
| `/cc-full --from-prd` | 2-9 | Start from existing PRD |
| `/cc-discover [idea]` | 1 | Discovery with research agent |
| `/cc-design system` | 2 | Generate design system |
| `/cc-create-specs` | 3 | Generate specs from PRD |
| `/cc-design feature FTR-XXX` | 4 | Feature UI/UX specs |
| `/cc-create-tasks` | 5 | Break features into tasks |
| `/cc-implement [task\|all]` | 6 | TDD with parallel agents |
| `/cc-design qa` | 7 | 117-point design QA |
| `/cc-review` | 7 | Code review |
| `/cc-test` | 7 | Testing with coverage |
| `/cc-verify FTR-XXX` | 8 | E2E feature verification |
| `/cc-debug` | - | Diagnose and fix state issues |
| `/cc-tokens` | - | View token usage summary |
| `/cc-config` | - | Configure workflow settings |

**New Commands**:
| Command | Purpose |
|---------|---------|
| `/cc-debug` | Full diagnostic scan and reconciliation |
| `/cc-debug quick` | Fast scan for common issues |
| `/cc-debug --auto-fix` | Auto-fix safe issues |
| `/rlm-full [idea]` | Standard prompt pipeline (non-Claude Code) |
| `/rlm-full --from-prd` | Start standard pipeline from PRD |

### Cursor, Windsurf, VS Code + Copilot, Aider, or Any Other AI

Copy the prompt content from `RLM/prompts/` into your AI chat:

1. **Discovery**: Copy `RLM/prompts/01-DISCOVER.md`
2. **Specs from PRD**: Copy `RLM/prompts/02-CREATE-SPECS.md`
3. **Task Creation**: Copy `RLM/prompts/03-CREATE-TASKS.md`
4. **Implementation**: Copy `RLM/prompts/04-IMPLEMENT-TASK.md`

Or simply tell your AI:
```
Read and follow RLM/prompts/[prompt-name].md
```

---

## Real-Time Progress (v2.6)

During implementation, you'll see live progress updates:

```
+------------------------------------------------------------------+
| TASK-003: Implement user authentication                  [3/8]   |
+------------------------------------------------------------------+

Progress: [========--------] 40% (Step 2/5: Writing tests)

Token Usage This Task:
  Input:  2,450 tokens | Output: 1,230 tokens | Total: 3,680

Session Total: 15,420 / 100,000 tokens (15.4%)
+------------------------------------------------------------------+
```

### 5-Step Progress Model

| Step | Phase | Progress |
|------|-------|----------|
| 1 | Load specs and context | 0-20% |
| 2 | Write tests (TDD Red) | 20-40% |
| 3 | Implement code (TDD Green) | 40-70% |
| 4 | Run tests and fix | 70-85% |
| 5 | Quality checks and review | 85-100% |

---

## Automation Levels

When implementing tasks, choose your level of control:

| Level | Description | When AI Asks You |
|-------|-------------|------------------|
| **AUTO** | Full autonomy - AI makes all decisions | Only when blocked |
| **SUPERVISED** | Checkpoints at key decisions | Before major decisions, after each task |
| **MANUAL** | Step-by-step approval | Before every step |

---

## Context Management

RLM automatically manages context at these thresholds:

| Threshold | Action |
|-----------|--------|
| **50%** | Save checkpoint, log warning, continue |
| **75%** | Save checkpoint, suggest wrapping up |
| **90%** | Save checkpoint, complete current task only, pause |

Use `/implement resume` or read `RLM/prompts/06-RESUME.md` to continue.

---

## Debug & Reconciliation

Run diagnostics to detect and fix state issues:

```bash
/cc-debug              # Full diagnostic scan
/cc-debug quick        # Fast scan (common issues only)
/cc-debug --auto-fix   # Auto-fix safe issues
```

**Issues Detected**:
- Orphan tasks (no parent feature)
- Missing tasks (incomplete feature coverage)
- Status mismatches (file vs status.json)
- Checkpoint drift
- Broken dependencies
- Duplicate IDs

---

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `RLM/prompts/` | Copy-paste prompt templates for any AI |
| `RLM/templates/` | Document templates (PRD, specs, tasks, design) |
| `RLM/specs/` | Generated specifications |
| `RLM/specs/design/` | Design system, tokens, components |
| `RLM/tasks/active/` | Tasks ready for implementation |
| `RLM/tasks/completed/` | Finished tasks |
| `RLM/progress/` | Progress tracking, checkpoints, logs |
| `RLM/research/project/` | Auto-detected project research |
| `RLM/agents/` | AI agent role definitions |
| `RLM/docs/` | Full documentation |

---

## Key Files

| File | Purpose |
|------|---------|
| `RLM/START-HERE.md` | This file - entry point |
| `RLM/specs/PRD.md` | Product Requirements Document |
| `RLM/specs/constitution.md` | Project standards |
| `RLM/specs/design/design-system.md` | Design system |
| `RLM/tasks/INDEX.md` | Task overview |
| `RLM/progress/status.json` | Current state |
| `RLM/progress/checkpoint.json` | Incremental tracking |
| `RLM/progress/cc-config.json` | Configuration |

---

## Project Research

Place research documents in `RLM/research/project/` to auto-populate PRD sections:

```
RLM/research/project/
+-- competitor-analysis.md
+-- market-research.md
+-- user-interviews.md
+-- technical-research.md
+-- requirements-notes.md
```

The discovery phase automatically detects and uses this research.

---

## Prompts Reference

| Prompt | Purpose | Use When |
|--------|---------|----------|
| `01-DISCOVER.md` | Transform idea into PRD | Starting a new project |
| `02-CREATE-SPECS.md` | Generate specs from PRD | Have PRD, need specs |
| `03-CREATE-TASKS.md` | Break features into tasks | Specs ready, need tasks |
| `04-IMPLEMENT-TASK.md` | Implement single task (TDD) | Ready to code one task |
| `05-IMPLEMENT-ALL.md` | Implement all active tasks | Ready to code everything |
| `06-RESUME.md` | Resume interrupted work | Continuing previous session |
| `07-TEST.md` | Run and fix tests | Validating implementation |
| `08-REPORT.md` | Generate progress report | Check project status |

---

## Templates

### Design Templates

| Template | Purpose |
|----------|---------|
| `design-system-template.md` | Complete design system specification |
| `component-spec-template.md` | Individual component design specs |
| `feature-design-spec-template.md` | Feature UI/UX specifications |
| `design-tokens-template.md` | Framework-agnostic design tokens |
| `design-qa-checklist.md` | 117-point design QA checklist |
| `ux-research-template.md` | UX research and user testing |

### ADR Templates

| Template | Purpose |
|----------|---------|
| `decision-record-template.md` | Architecture Decision Records (ADRs) |
| `assumption-log-template.md` | Track and validate assumptions |
| `tech-comparison-template.md` | Weighted technology evaluation |

---

## Token Efficiency

Track token usage with efficiency ratings:

| Rating | Tokens/Task | Description |
|--------|-------------|-------------|
| Excellent | < 10,000 | Simple, well-defined tasks |
| Good | 10,000-20,000 | Normal complexity |
| Fair | 20,000-35,000 | Complex or some rework |
| Poor | > 35,000 | Consider splitting task |

---

## Documentation

- [User Guide](docs/USER-GUIDE.md) - Complete step-by-step guide
- [Quick Reference](docs/QUICK-REFERENCE.md) - One-page cheat sheet
- [Claude Code Guide](docs/CLAUDE-CODE-GUIDE.md) - Sub-agent workflow guide
- [Template Reference](docs/TEMPLATE-REFERENCE.md) - How to use templates
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions
- [UI Framework Reference](docs/UI-FRAMEWORK-REFERENCE.md) - Design token implementation
- [Design Patterns Library](docs/DESIGN-PATTERNS-LIBRARY.md) - UI/UX pattern reference
- [Accessibility Guide](docs/ACCESSIBILITY-GUIDE.md) - WCAG compliance guide
- [What's New](docs/WHATS-NEW.md) - Version changelog

---

## Example: Starting a New Project

**Step 1:** Tell your AI about your idea
```
Read RLM/prompts/01-DISCOVER.md and help me discover specs for:
"Build a habit tracking app with social accountability features"
```

**Step 2:** Answer the clarifying questions (the AI will ask ~12-18 questions in 3-4 rounds)

**Step 3:** Review the generated PRD at `RLM/specs/PRD.md`

**Step 4:** Generate specs (if not auto-generated)
```
Read RLM/prompts/02-CREATE-SPECS.md and generate all specs
```

**Step 5:** Create tasks
```
Read RLM/prompts/03-CREATE-TASKS.md and break down features into tasks
```

**Step 6:** Implement
```
Read RLM/prompts/04-IMPLEMENT-TASK.md
Implement TASK-001 in SUPERVISED mode
```

---

## Need Help?

1. Read `RLM/docs/USER-GUIDE.md` for detailed instructions
2. Run `/cc-debug quick` to check for state issues
3. Check `RLM/docs/TROUBLESHOOTING.md` for common issues
4. Review the prompts in `RLM/prompts/` - they contain detailed instructions
