# RLM User Guide (v2.7)

## Introduction

RLM (Research, Lead, Manage) is an AI-powered software development methodology that transforms ideas into production-ready code. It works with **any AI coding agent** in **any IDE**.

### Key Features

- **Structured Discovery**: Transforms ideas into comprehensive requirements through guided questions
- **9-Phase Pipeline**: Complete automation from idea to verified code
- **Universal Compatibility**: Works with Claude Code, Cursor, Windsurf, VS Code, Aider, and any AI assistant
- **TDD by Default**: All implementation follows Test-Driven Development
- **Design System Integration**: Full UI/UX engineering with design tokens and accessibility
- **Behavioral Economics**: Research-backed product design principles
- **Cognitive Psychology**: UX patterns based on cognitive science
- **Flexible Automation**: Choose your control level (AUTO, SUPERVISED, MANUAL)
- **Incremental Development**: Checkpoint system prevents overwriting existing work
- **Resume Capability**: Stop and continue anytime without losing progress
- **Debug & Reconciliation**: Built-in state validation and repair tools
- **Prompt Pattern Library**: Reusable reasoning patterns for complex tasks
- **Test Mode**: Isolated project execution for methodology validation

---

## Quick Start (5 Minutes)

### Step 1: Locate RLM
Ensure you have the `RLM/` folder in your project with:
- `RLM/prompts/` - Workflow prompts
- `RLM/templates/` - Document templates
- `RLM/specs/` - Your specifications (generated)
- `RLM/tasks/` - Your tasks (generated)
- `RLM/progress/` - Progress tracking

### Step 2: Start Discovery
Tell your AI:
```
Read RLM/prompts/01-DISCOVER.md and help me discover specs for:
[Your project idea here]
```

Or in Claude Code:
```
/discover [Your project idea]
```

### Step 3: Answer Questions
The AI will ask ~12-18 questions in 3-4 rounds, including design preferences for UI projects.

### Step 4: Review & Implement
- Review generated PRD at `RLM/specs/PRD.md`
- Generate specs: `/create-specs` or read `02-CREATE-SPECS.md`
- Create tasks: `/create-tasks` or read `03-CREATE-TASKS.md`
- Implement: `/implement all` or read `05-IMPLEMENT-ALL.md`

---

## Complete 9-Phase Pipeline

RLM follows a structured 9-phase workflow:

```
+----------------------------------------------------------------------------+
|                        RLM 9-PHASE PIPELINE (v2.7)                          |
+----------------------------------------------------------------------------+
|                                                                            |
|  PHASE 1: DISCOVER        → PRD.md, constitution.md                        |
|      │    Auto-detects project research in RLM/research/project/           |
|      ▼                                                                     |
|  PHASE 2: DESIGN SYSTEM   → Design tokens, component library (if UI)       |
|      │    Auto-detected: UI projects include design, CLI/API skip it       |
|      ▼                                                                     |
|  PHASE 3: SPECIFICATIONS  → Feature specs, architecture                    |
|      │                                                                     |
|      ▼                                                                     |
|  PHASE 4: FEATURE DESIGN  → UI/UX specs for each feature (if UI)           |
|      │                                                                     |
|      ▼                                                                     |
|  PHASE 5: TASKS           → Fine-grained tasks with checkpoint tracking    |
|      │    Incremental: only creates tasks for NEW features                 |
|      ▼                                                                     |
|  PHASE 6: IMPLEMENTATION  → TDD with integrated review per task            |
|      │    Real-time progress reporting with token tracking                 |
|      ▼                                                                     |
|  PHASE 7: QUALITY         → Design QA + Code Review + Test Coverage        |
|      │                                                                     |
|      ▼                                                                     |
|  PHASE 8: VERIFICATION    → E2E tests per feature (Playwright + axe)       |
|      │    Auto-triggered when all feature tasks complete                   |
|      ▼                                                                     |
|  PHASE 9: REPORT          → Complete project summary                       |
|                                                                            |
+----------------------------------------------------------------------------+
```

### Two Entry Points

**Path 1: Starting from Zero**
You have an idea but no documentation.
```
/cc-full [idea]           # Complete 9-phase automation
OR
/discover [idea]          # Step-by-step approach
```

**Path 2: Starting from PRD**
You already have a Product Requirements Document.
```
/cc-full --from-prd       # Start from Phase 2
OR
/create-specs             # Step-by-step approach
```

---

## Phase Details

### Phase 1: Discovery (`01-DISCOVER.md`)

**Purpose**: Transform idea into PRD

**Process**:
1. Checks for existing research in `RLM/research/project/`
2. AI researches competitors and best practices
3. Answer 3-4 rounds of clarifying questions:
   - Round 1: Business goals, users, MVP scope, success metrics
   - Round 2: Scale, integrations, tech constraints, data requirements
   - Round 3: Authentication, platforms, compliance, UX
   - Round 4 (UI): Design philosophy, animation tier, framework
4. AI generates comprehensive PRD (v2.7: Enhanced 15-section structure)

**Auto-Detection Features**:
- Project research folder is automatically detected
- UI vs Non-UI classification determines if design phases run
- Previous outputs are prioritized to avoid redundant questions

**Output**: `RLM/specs/PRD.md`, `RLM/specs/constitution.md`

### Phase 2: Design System (UI Projects)

**Purpose**: Create design foundation

**Process**:
1. AI reads PRD for brand personality
2. Generates design tokens (colors, typography, spacing)
3. Creates component library specification
4. Defines animation guidelines
5. (v2.7) Applies behavioral economics principles

**Output**: `RLM/specs/design/design-system.md`, `RLM/specs/design/tokens/`

### Phase 3: Specifications (`02-CREATE-SPECS.md`)

**Purpose**: Create technical specifications

**Process**:
1. AI reads your PRD
2. Auto-detects if UI project (DESIGN_REQUIRED flag)
3. Creates detailed feature specifications
4. Designs system architecture
5. Creates epic breakdown with sprint planning

**Output**:
- `RLM/specs/features/FTR-XXX/spec.md` - Feature specs
- `RLM/specs/architecture/overview.md` - Architecture
- `RLM/specs/epics/breakdown.md` - Sprint plan

### Phase 4: Feature Design (UI Projects)

**Purpose**: Create UI/UX specifications per feature

**Process**:
1. AI reads feature spec
2. Designs user flows and screen layouts
3. Specifies component usage
4. Defines responsive behavior
5. (v2.7) Applies cognitive psychology principles

**Output**: `RLM/specs/features/FTR-XXX/design-spec.md`

### Phase 5: Task Creation (`03-CREATE-TASKS.md`)

**Purpose**: Break features into implementable tasks

**Process**:
1. Loads checkpoint to detect existing tasks
2. AI reads all feature specs
3. Creates fine-grained tasks (1-4 hours each) for NEW features only
4. Determines dependencies and order
5. Updates checkpoint with new generation

**Checkpoint System**:
- Tasks include `generation` field
- Never overwrites existing tasks
- Run `/create-tasks` multiple times safely

**Output**: `RLM/tasks/active/TASK-XXX.md`, `RLM/tasks/INDEX.md`, `RLM/progress/checkpoint.json`

### Phase 6: Implementation (`04-IMPLEMENT-TASK.md`)

**Purpose**: Implement tasks using TDD

**Process**:
1. Select automation level (AUTO/SUPERVISED/MANUAL)
2. AI loads task and context
3. 5-Step TDD cycle with progress reporting:
   - Step 1: Load specs and context (0-20%)
   - Step 2: Write tests - TDD Red (20-40%)
   - Step 3: Implement code - TDD Green (40-70%)
   - Step 4: Run tests and fix (70-85%)
   - Step 5: Quality checks and review (85-100%)
4. Integrated review checklist per task
5. Mark task complete

**Real-Time Progress**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TASK-003: Implement user authentication         [3/8 tasks]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: [████████░░░░░░░░░░░░] 40% (Step 2/5: Writing tests)

Token Usage This Task:
  Input:  2,450 tokens | Output: 1,230 tokens | Total: 3,680

Session Total: 15,420 / 100,000 tokens (15.4%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Output**: Source code, tests, progress logs

### Phase 7: Quality

**Purpose**: Combined quality checks

**Components**:
- Design QA: 117-point checklist (if UI)
- Code Review: Security, patterns, compliance
- Test Coverage: Unit, integration, component tests

**Pass Criteria**: Design QA ≥90%, all tests pass, no security issues

### Phase 8: Verification

**Purpose**: E2E testing per feature

**Process**:
1. Auto-triggered when all feature tasks complete
2. Generates Playwright tests from acceptance criteria
3. Runs functional tests
4. Runs accessibility tests (axe-core, WCAG 2.1 AA)
5. Creates bug tasks if failures
6. Marks feature as verified when passing

**Feature Lifecycle**:
```
in_progress → verification-pending → verified
                      ↓
              verification-failed
                      ↓
              (fix bugs, re-verify)
```

### Phase 9: Report

**Purpose**: Generate project summary

**Includes**: Features implemented, test coverage, token usage, quality metrics

---

## Automation Levels

Choose your level of AI autonomy during implementation:

| Level | AI Behavior | Pauses At | Best For |
|-------|-------------|-----------|----------|
| **AUTO** | Full autonomy | Blockers only | Simple tasks, overnight runs |
| **SUPERVISED** | Guided with checkpoints | Key decisions, after each task | Most development work |
| **MANUAL** | Step-by-step approval | Every action | Complex decisions, learning |

---

## Sub-Agents (v2.7)

RLM uses specialized sub-agents that operate in isolated context windows:

| Agent | Purpose | Proactive Triggers | Phase |
|-------|---------|-------------------|-------|
| **Research** | Web research, competitor analysis | "what do others do?", market research | 1 |
| **Architect** | Technology decisions, ADRs | "which technology?", trade-offs | 1, 3 |
| **Designer** | Design systems, UI/UX specs | UI feature start, colors/typography | 2, 4, 7 |
| **Coder** | TDD implementation | "build/implement/create", tasks | 6 |
| **Tester** | Test coverage, bug investigation | Coverage < 80%, flaky tests | 7 |
| **Reviewer** | Code review, security | Before commits, security code | 7 |
| **Verifier** | E2E tests, accessibility | Feature completion | 8 |

---

## Prompt Pattern Library (v2.7)

Reusable reasoning patterns for complex tasks:

| Pattern | Use Case | Applied By |
|---------|----------|------------|
| `root-cause-analysis.md` | Bug investigation, 5-Whys | Coder, Tester |
| `decision-matrix.md` | Technology selection | Architect |
| `comparative-analysis.md` | Alternative evaluation | Architect, Research |
| `problem-decomposition.md` | Complex task breakdown | Coder |

**Location**: `RLM/prompts/patterns/`

---

## 3-Tier Context Management (v2.7)

Intelligent context window management:

| Tier | Goal | Strategy |
|------|------|----------|
| **Tier 1: REDUCE** | Minimize loaded | Selective file reading, summaries |
| **Tier 2: DELEGATE** | Offload high-token work | Sub-agent delegation |
| **Tier 3: MANAGE** | Handle overflow | Checkpoints, smart truncation |

### Context Thresholds

| Threshold | Action |
|-----------|--------|
| 50% | Save checkpoint, log warning, continue |
| 75% | Save checkpoint, activate truncation, suggest wrap-up |
| 90% | Save checkpoint, complete current task only, pause |
| 95% | Emergency bundle save, stop all work |

---

## IDE-Specific Instructions

### Claude Code (Recommended)

Use slash commands directly:
```bash
# Standard Commands
/discover Build a habit tracking app
/create-specs
/create-tasks
/implement TASK-001
/implement all
/implement resume

# Enhanced Commands (v2.7)
/cc-full Build a habit tracking app    # Complete 9-phase automation
/cc-full --from-prd                    # Start from existing PRD
/cc-debug                              # Diagnose and fix state issues
/cc-debug quick                        # Fast scan for common issues
/cc-test-run my-project                # Run isolated test project
/rlm-full [idea]                       # Standard prompt pipeline
```

### Cursor

Copy prompts into chat or tell the AI:
```
Read RLM/prompts/01-DISCOVER.md and help me discover specs for:
Build a habit tracking app with social features
```

### VS Code with Copilot

Use @workspace to give context:
```
@workspace Read RLM/prompts/01-DISCOVER.md and help me discover specs for:
Build a task management API
```

### Windsurf

Use Cascade or copy prompts:
```
Read RLM/prompts/01-DISCOVER.md and follow the workflow for:
Build an e-commerce backend
```

### Any Other AI

Simply tell your AI:
```
Read the file RLM/prompts/01-DISCOVER.md and follow the instructions.
My project idea is: [describe your idea]
```

---

## Progress Tracking

### Automatic Tracking

RLM automatically tracks:
- Task status in `RLM/progress/status.json`
- Checkpoint state in `RLM/progress/checkpoint.json`
- Token usage in `RLM/progress/token-usage/`
- Session logs in `RLM/progress/logs/`

### Resuming Work

If you stop mid-implementation:
```
/implement resume
```
Or read `RLM/prompts/06-RESUME.md`

---

## Debug & Reconciliation

Use the debug command to diagnose and fix state issues:

```bash
/cc-debug              # Full diagnostic scan
/cc-debug quick        # Fast scan (common issues)
/cc-debug --auto-fix   # Auto-fix safe issues
```

**Issues Detected**:
- Orphan tasks (no parent feature)
- Missing tasks (incomplete feature coverage)
- Status mismatches (file vs status.json)
- Checkpoint drift
- Broken dependencies
- Duplicate IDs
- Missing specs
- Stale progress files
- Blocked loops
- Incomplete metadata

---

## Test Mode (v2.7)

Run isolated test projects for methodology validation:

```bash
/cc-test-run my-test-project                    # Interactive
/cc-test-run my-test-project --from-prd path/   # From existing PRD
/cc-test-run my-test-project --idea "desc"      # With idea description
```

**Creates**: `test_projects/[name]-[timestamp]/`

**Collects**: tokens, time, lines of code, test coverage

---

## Project Research

Place research documents in `RLM/research/project/` to auto-populate PRD sections:

```
RLM/research/project/
├── competitor-analysis.md
├── market-research.md
├── user-interviews.md
├── technical-research.md
└── requirements-notes.md
```

The discovery phase automatically detects and uses this research.

---

## Directory Structure

```
RLM/
├── START-HERE.md              # Start here!
├── prompts/                   # Workflow prompts
│   ├── 00-DETECT-PROJECT-TYPE.md  # Auto UI/Non-UI detection
│   ├── 00-FULL-PIPELINE.md    # Pipeline orchestration
│   ├── 01-DISCOVER.md         # Idea → PRD
│   ├── 02-CREATE-SPECS.md     # PRD → Specs
│   ├── 03-CREATE-TASKS.md     # Specs → Tasks (with checkpoint)
│   ├── 04-IMPLEMENT-TASK.md   # Single task (with review)
│   ├── 05-IMPLEMENT-ALL.md    # All tasks (with context mgmt)
│   ├── 06-RESUME.md           # Resume session
│   ├── 07-TEST.md             # Testing
│   ├── 08-REPORT.md           # Reporting
│   └── patterns/              # Prompt patterns (v2.7)
│       ├── root-cause-analysis.md
│       ├── decision-matrix.md
│       ├── comparative-analysis.md
│       └── problem-decomposition.md
├── templates/                 # Document templates
│   ├── PRD-template-v2.md     # Enhanced PRD (v2.7)
│   └── behavioral-economics-checklist.md  # (v2.7)
├── specs/                     # Generated specifications
│   ├── PRD.md                 # Product requirements
│   ├── constitution.md        # Project standards
│   ├── features/              # Feature specs
│   ├── architecture/          # Architecture docs
│   ├── design/                # Design system (UI projects)
│   └── epics/                 # Sprint planning
├── tasks/                     # Task management
│   ├── active/                # Pending tasks
│   ├── completed/             # Done tasks
│   └── blocked/               # Blocked tasks
├── progress/                  # Progress tracking
│   ├── status.json            # Current state
│   ├── checkpoint.json        # Incremental tracking
│   ├── cc-config.json         # Configuration
│   └── token-usage/           # Token logs
├── research/                  # Project research
│   └── project/               # Auto-detected research
├── agents/                    # AI agent definitions
└── docs/                      # Documentation
```

---

## Configuration

Configure RLM via `RLM/progress/cc-config.json` or `/cc-config`:

```bash
/cc-config parallel_limit 8                      # Concurrent sub-agents (1-10)
/cc-config automation_level auto                 # Full autonomy
/cc-config reporting.mode both                   # realtime + silent logging
/cc-config enhancements.prompt_patterns.enabled true    # v2.7
/cc-config enhancements.behavioral_economics.enabled true  # v2.7
```

Key settings:
- `reporting.mode`: "realtime", "silent", or "both"
- `design.auto_detect`: Auto-detect UI vs Non-UI
- `context_management.auto_checkpoint.enabled`: Auto-save at thresholds
- `debug.auto_fix_safe`: Allow safe auto-fixes
- `enhancements.prompt_patterns.enabled`: Use prompt pattern library
- `enhancements.behavioral_economics.enabled`: Apply behavioral economics

---

## Design Workflow (UI Projects)

### Design System Generation

```bash
/cc-design system
```

Generates design tokens, component library, animation guidelines.

### Component Specifications

```bash
/cc-design component Button
/cc-design component Modal
```

**8 Required States**: Default, Hover, Focus, Active, Disabled, Loading, Error, Empty

### Design QA

```bash
/cc-design qa
```

**117-point checklist** across 7 categories:
- Visual Consistency (20 points)
- Accessibility (25 points)
- Component States (18 points)
- Responsive Design (18 points)
- Animation/Motion (12 points)
- Error Handling (12 points)
- Performance (12 points)

**Pass Threshold**: ≥90% (105/117 points)

### Animation Tiers

| Tier | Technology | Use Case |
|------|------------|----------|
| MINIMAL | CSS Transitions | Simple apps, accessibility-focused |
| MODERATE | Framer Motion | Most apps, balance of polish |
| RICH | GSAP | Marketing sites, high-polish |

### Accessibility Standards

- WCAG 2.1 AA minimum (AAA recommended)
- 4.5:1 contrast for normal text
- Visible focus indicators
- Keyboard navigation
- Screen reader support
- Respect `prefers-reduced-motion`

---

## Behavioral Economics Principles (v2.7)

Applied during design phases for ethical product decisions:

| Principle | Application |
|-----------|-------------|
| **Choice Architecture** | Design defaults to guide optimal choices |
| **Prospect Theory** | Frame messaging as loss/gain appropriately |
| **Anchoring** | Strategic pricing and value presentation |
| **Social Proof** | Display genuine user activity and testimonials |
| **Endowment Effect** | Create ownership through personalization |
| **Scarcity/Urgency** | Use only for genuine constraints |
| **Cognitive Load** | Progressive disclosure to reduce overwhelm |

---

## Cognitive Psychology Laws (v2.7)

Applied during UX research and design QA:

| Law | UX Application |
|-----|----------------|
| **Fitts's Law** | Minimum 44x44px touch targets |
| **Hick's Law** | Maximum 7±2 choices per screen |
| **Miller's Law** | Chunk information into groups |
| **Jakob's Law** | Use familiar design patterns |
| **Peak-End Rule** | Polish first and last impressions |
| **Von Restorff Effect** | Visual hierarchy for important elements |

---

## Best Practices

### During Discovery
- Be specific about your idea - more detail = better PRD
- Place existing research in `RLM/research/project/`
- Answer questions thoughtfully - they shape the architecture

### During Implementation
- Start with SUPERVISED mode until familiar
- Review generated code before moving on
- Use the integrated review checklist
- Don't skip the TDD process

### General Tips
- Keep tasks small (1-4 hours)
- Complete one task before starting another
- Run `/cc-debug quick` periodically
- Review the constitution when unsure about standards

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| AI doesn't know RLM | Tell it: "Read RLM/START-HERE.md first" |
| PRD missing sections | Run `/discover` to generate complete PRD |
| Tasks too large | Request finer granularity |
| Can't resume | Check `RLM/progress/status.json` |
| State inconsistent | Run `/cc-debug` to diagnose and fix |
| Context overflow | Session auto-saved; use `/implement resume` |
| High token usage | Run `/cc-debug context-audit` |

---

## Getting Help

1. Read `RLM/START-HERE.md` for quick orientation
2. Check `RLM/docs/QUICK-REFERENCE.md` for command reference
3. Run `/cc-debug quick` for state issues
4. Read the prompts in `RLM/prompts/` for detailed instructions
5. See `RLM/docs/WHATS-NEW.md` for version history
