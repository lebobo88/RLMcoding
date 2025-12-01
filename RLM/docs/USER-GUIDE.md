# RLM User Guide

## Introduction

RLM (Research, Lead, Manage) is an AI-powered software development method that transforms your ideas into production-ready code. It works with **any AI coding agent** in **any IDE**.

### What Makes RLM Different

- **Structured Discovery**: Transforms vague ideas into comprehensive requirements through guided questions
- **Universal Compatibility**: Works with Claude Code, Cursor, Windsurf, VS Code, Aider, and any AI assistant
- **TDD by Default**: All implementation follows Test-Driven Development
- **Flexible Automation**: Choose your level of control (AUTO, SUPERVISED, MANUAL)
- **Resume Capability**: Stop and continue anytime without losing progress

---

## Quick Start (5 Minutes)

### Step 1: Locate RLM
Ensure you have the `RLM/` folder in your project with:
- `RLM/prompts/` - Workflow prompts
- `RLM/templates/` - Document templates
- `RLM/specs/` - Your specifications (will be generated)
- `RLM/tasks/` - Your tasks (will be generated)

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
The AI will ask ~12 questions in 3 rounds. Answer them to shape your project.

### Step 4: Review & Implement
- Review generated PRD at `RLM/specs/PRD.md`
- Generate specs: `/create-specs` or read `02-CREATE-SPECS.md`
- Create tasks: `/create-tasks` or read `03-CREATE-TASKS.md`
- Implement: `/implement TASK-001` or read `04-IMPLEMENT-TASK.md`

---

## Two Entry Points

### Path 1: Starting from Zero

You have an idea but no documentation.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  /discover  │───▶│   Answer    │───▶│ Review PRD  │───▶│/create-specs│
│  [idea]     │    │  Questions  │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

**Output**: `RLM/specs/PRD.md`, `RLM/specs/constitution.md`

### Path 2: Starting from PRD

You already have a Product Requirements Document.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│/create-specs│───▶│/create-tasks│───▶│ /implement  │
│  [prd-path] │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

Place your PRD at `RLM/specs/PRD.md` or specify the path.

---

## Complete Workflow

### Phase 1: Discovery (`01-DISCOVER.md`)

**Purpose**: Transform idea into PRD

**Process**:
1. Describe your project idea
2. AI researches competitors and best practices (if web search available)
3. Answer 3 rounds of clarifying questions:
   - Round 1: Business goals, users, MVP scope, success metrics
   - Round 2: Scale, integrations, tech constraints, data requirements
   - Round 3: Authentication, platforms, compliance, UX
4. AI generates comprehensive PRD

**Output**: `RLM/specs/PRD.md`, `RLM/specs/constitution.md`

### Phase 2: Specifications (`02-CREATE-SPECS.md`)

**Purpose**: Create technical specifications from PRD

**Process**:
1. AI reads your PRD
2. Creates detailed feature specifications
3. Designs system architecture
4. Creates epic breakdown with sprint planning

**Output**:
- `RLM/specs/features/FTR-XXX/spec.md` - Feature specs
- `RLM/specs/architecture/overview.md` - Architecture
- `RLM/specs/epics/breakdown.md` - Sprint plan

### Phase 3: Task Creation (`03-CREATE-TASKS.md`)

**Purpose**: Break features into implementable tasks

**Process**:
1. AI reads all feature specs
2. Creates fine-grained tasks (1-4 hours each)
3. Determines dependencies and order
4. Creates task index

**Task Granularity Example**:
"User Authentication" becomes:
- TASK-001: Create User data model
- TASK-002: Implement password hashing
- TASK-003: Create registration endpoint
- TASK-004: Add validation
- ... (typically 10-15 tasks per feature)

**Output**: `RLM/tasks/active/TASK-XXX.md`, `RLM/tasks/INDEX.md`

### Phase 4: Implementation (`04-IMPLEMENT-TASK.md`)

**Purpose**: Implement tasks using TDD

**Process**:
1. Select automation level (AUTO/SUPERVISED/MANUAL)
2. AI loads task and context
3. TDD cycle:
   - Write test (fails)
   - Implement code (passes)
   - Refactor
4. Run quality checks
5. Mark task complete

**Output**: Source code, tests, progress logs

### Phase 5: Testing (`07-TEST.md`)

**Purpose**: Run and fix tests

**Options**:
- Run all tests
- Run tests for specific feature
- Run with coverage
- Fix failing tests

### Phase 6: Reporting (`08-REPORT.md`)

**Purpose**: Track progress

**Report Types**:
- Summary: Quick status overview
- Detailed: Full task breakdown
- Metrics: Token usage, velocity
- Blockers: Focus on blocked tasks

---

## Automation Levels

Choose your level of AI autonomy during implementation:

### AUTO Mode
- AI makes all decisions independently
- Only pauses when blocked or confused
- Best for: Simple tasks, overnight runs, experienced developers

### SUPERVISED Mode (Recommended)
- AI pauses at key decision points
- Shows progress after each major step
- Best for: Most development work, learning, code review

### MANUAL Mode
- AI explains and waits before each action
- Maximum visibility and control
- Best for: Complex decisions, debugging, training

---

## IDE-Specific Instructions

### Claude Code

Use slash commands directly:
```
/discover Build a habit tracking app
/create-specs
/create-tasks
/implement TASK-001
/implement all
/implement resume
```

### Cursor

Copy prompts into chat or tell the AI:
```
Read RLM/prompts/01-DISCOVER.md and help me discover specs for:
Build a habit tracking app with social features
```

Alternatively, create custom commands in `.cursorrules`.

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

### Aider

```bash
aider --read RLM/prompts/01-DISCOVER.md
```

Then describe your idea.

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
- Implementation logs in `RLM/progress/logs/`
- Session state for resume capability

### Viewing Progress

Use the report prompt:
```
Read RLM/prompts/08-REPORT.md and generate a summary report
```

Or in Claude Code: `/report summary`

### Resuming Work

If you stop mid-implementation:
```
Read RLM/prompts/06-RESUME.md
```

Or in Claude Code: `/implement resume`

---

## Directory Structure

```
RLM/
├── START-HERE.md              # Start here!
├── prompts/                   # Workflow prompts
│   ├── 01-DISCOVER.md         # Idea → PRD
│   ├── 02-CREATE-SPECS.md     # PRD → Specs
│   ├── 03-CREATE-TASKS.md     # Specs → Tasks
│   ├── 04-IMPLEMENT-TASK.md   # Single task
│   ├── 05-IMPLEMENT-ALL.md    # All tasks
│   ├── 06-RESUME.md           # Resume
│   ├── 07-TEST.md             # Testing
│   └── 08-REPORT.md           # Reporting
├── templates/                 # Document templates
│   ├── PRD-TEMPLATE.md        # PRD format
│   ├── CONSTITUTION-TEMPLATE.md
│   ├── spec-template.md
│   └── task-template.md
├── specs/                     # Generated specifications
│   ├── PRD.md                 # Your PRD
│   ├── constitution.md        # Project standards
│   ├── features/              # Feature specs
│   ├── architecture/          # Architecture docs
│   └── epics/                 # Sprint planning
├── tasks/                     # Task management
│   ├── active/                # Pending tasks
│   ├── completed/             # Done tasks
│   └── blocked/               # Blocked tasks
├── progress/                  # Progress tracking
│   ├── status.json            # Current state
│   └── logs/                  # Implementation logs
├── agents/                    # AI agent definitions
└── docs/                      # Documentation
```

---

## Best Practices

### During Discovery
- Be specific about your idea - more detail = better PRD
- Answer questions thoughtfully - they shape the architecture
- Ask for clarification if questions are confusing

### During Implementation
- Start with SUPERVISED mode until familiar
- Review generated code before moving on
- Run tests frequently
- Don't skip the TDD process

### General Tips
- Keep tasks small (1-4 hours)
- Complete one task before starting another
- Use the progress tracking to stay organized
- Review the constitution when unsure about standards

---

## Troubleshooting

### AI doesn't know about RLM
Tell it: "Read RLM/START-HERE.md first"

### PRD is missing sections
Run `/discover` to generate a complete PRD

### Tasks are too large
Request finer granularity in task creation

### Can't resume session
Check `RLM/progress/status.json` for current state

### Tests not being written first
Emphasize TDD in your instructions

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more help.

---

## Getting Help

1. Read `RLM/START-HERE.md` for quick orientation
2. Check `RLM/docs/QUICK-REFERENCE.md` for command reference
3. Review `RLM/docs/TROUBLESHOOTING.md` for common issues
4. Read the prompts in `RLM/prompts/` - they contain detailed instructions

---

## Design Workflow (v2.4)

RLM includes comprehensive UI/UX engineering capabilities through the Designer sub-agent.

### Design System Generation

Create or update your design system:
```
/cc-design system
```

This generates:
- Design tokens (colors, typography, spacing, shadows)
- Component library specifications
- Animation system guidelines
- Accessibility standards

### Component Specifications

Generate detailed component specs with all 8 states:
```
/cc-design component Button
/cc-design component Modal
```

**8 Required States**:
- Default - Normal appearance
- Hover - Mouse over
- Focus - Keyboard focus (visible outline)
- Active - Being clicked/activated
- Disabled - Non-interactive
- Loading - Async operation in progress
- Error - Error state
- Empty - No data/content

### Feature Design Specs

Generate UI/UX specifications for features:
```
/cc-design spec FTR-001
```

### Design QA

Run 117-point design quality checklist:
```
/cc-design qa
```

**Categories (7)**:
- Visual Consistency (20 points)
- Accessibility (25 points)
- Component States (18 points)
- Responsive Design (18 points)
- Animation/Motion (12 points)
- Error Handling (12 points)
- Performance (12 points)

**Pass Threshold**: ≥90% (105/117 points)

### Design Tokens Export

Generate framework-specific token files:
```
/cc-design tokens
```

Supported frameworks: Tailwind, MUI, Chakra, Bootstrap, Ant Design, CSS Variables

### Animation Tiers

Choose your animation complexity:

| Tier | Technology | Use Case |
|------|------------|----------|
| MINIMAL | CSS Transitions | Simple apps, accessibility-focused |
| MODERATE | Framer Motion | Most apps, balance of polish and performance |
| RICH | GSAP | Marketing sites, high-polish experiences |

### Accessibility Standards

RLM enforces WCAG 2.1 AA (AAA recommended):
- 4.5:1 contrast for normal text
- 3:1 contrast for large text
- Visible focus indicators
- Keyboard navigation
- Screen reader support

---

## GitHub Copilot Integration

RLM includes templates for GitHub Copilot integration. When your project is on GitHub, you can leverage Copilot's autonomous coding features.

### Setup

1. Ensure your project has the Copilot templates in `.github/`:
   - `.github/copilot-instructions.md` - Repository instructions
   - `.github/agents/*.agent.md` - Custom agent definitions
   - `.github/prompts/*.prompt.md` - Reusable prompts
   - `AGENTS.md` - Coding agent instructions

2. Enable Copilot coding agent on your repository (requires Copilot Pro+/Enterprise)

### Using Copilot Prompts

In VS Code with Copilot, use the prompt files:
```
@workspace /rlm-implement TASK-001
@workspace /rlm-review
@workspace /rlm-fix-bug
```

### Using Copilot Coding Agent

1. Push task files to `RLM/tasks/active/`
2. GitHub Actions creates issues automatically
3. Open an issue and click "Assign to Copilot"
4. Copilot implements and creates a PR
5. Review and merge

### Available Copilot Prompts

| Prompt | Purpose |
|--------|---------|
| `/rlm-discover` | Transform idea into PRD |
| `/rlm-create-specs` | Generate feature specs |
| `/rlm-create-tasks` | Break specs into tasks |
| `/rlm-implement` | Implement single task (TDD) |
| `/rlm-implement-all` | Implement all tasks |
| `/rlm-test` | Run and analyze tests |
| `/rlm-review` | Code review |
| `/rlm-fix-bug` | Debug and fix issues |
| `/rlm-prime-feature` | Load feature context |
| `/rlm-prime-task` | Load task context |

### Custom Agents

RLM provides specialized agents for Copilot:
- **rlm-coder** - TDD implementation
- **rlm-tester** - Test writing and coverage
- **rlm-reviewer** - Code review and security
- **rlm-architect** - Architecture decisions
- **rlm-research** - Research and documentation

See `RLM/templates/copilot/README.md` for full documentation.
