# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RLM (Research-Lead-Manage) is an AI agent development system that transforms high-level product management into production-ready code through automated workflows.

**RLM Framework** (`RLM/`) - Spec-driven development workflow with prompts, agents, and templates

## Slash Commands

### Standard RLM Commands (IDE-Agnostic)

| Command | Purpose |
|---------|---------|
| `/discover [idea]` | Transform idea into PRD via research and questions |
| `/create-specs` | Generate technical specs from PRD |
| `/create-tasks` | Break features into fine-grained tasks |
| `/implement TASK-XXX` | Implement single task with TDD |
| `/implement all` | Implement all active tasks |
| `/implement resume` | Resume interrupted session |

### Claude Code Enhanced Commands

Complete 9-phase pipeline with full automation:

| Command | Phase | Purpose | Sub-Agent |
|---------|-------|---------|-----------|
| `/cc-full [idea]` | All | **Complete 9-phase automation**: idea -> verified code | All |
| `/cc-full --from-prd` | 2-9 | Start from existing PRD (skip discover) | All |
| `/cc-discover [idea]` | 1 | Discovery with research | Research |
| `/cc-design system` | 2 | Generate design system from PRD | Designer |
| `/cc-create-specs` | 3 | Generate specs from PRD | Architect |
| `/cc-design feature FTR-XXX` | 4 | Create feature design specification | Designer |
| `/cc-create-tasks` | 5 | Break features into tasks | - |
| `/cc-implement [task\|all\|resume]` | 6 | TDD implementation (parallel for `all`) | Coder |
| `/cc-design qa [scope]` | 7 | Run 117-point design QA checklist | Designer |
| `/cc-review [scope]` | 7 | Code review before commit | Reviewer |
| `/cc-test [scope]` | 7 | Testing with dedicated tester agent | Tester |
| `/cc-verify FTR-XXX` | 8 | Feature verification with E2E tests | Verifier |
| `/cc-architect` | - | Architecture design with isolated context | Architect |
| `/cc-background [task]` | - | Spawn autonomous background agent | Background |
| `/cc-tokens` | - | Display token usage estimates | - |
| `/cc-config [setting] [value]` | - | Configure workflow settings | - |
| `/cc-debug [quick\|--auto-fix]` | - | Diagnose and fix state issues | - |
| `/cc-test-run [name]` | - | Run isolated test project | - |
| `/rlm-full [idea\|resume]` | All | Standard prompt pipeline (non-CC) | - |

### Context Priming Commands

Load minimal context for specific workflows (auto-priming built into `/cc-*`):

| Command | Purpose |
|---------|---------|
| `/prime-feature [FTR-XXX]` | Load feature context for development |
| `/prime-bug` | Load bug investigation frameworks |
| `/prime-task [TASK-XXX]` | Load single task context for TDD |
| `/prime-review` | Load review checklists and anti-patterns |
| `/prime-design [scope]` | Load design system context for UI development |

### Design Workflow Commands

| Command | Purpose | Sub-Agent |
|---------|---------|-----------|
| `/cc-design system` | Generate complete design system from PRD | Designer |
| `/cc-design research` | UX research with personas & journey maps | Designer |
| `/cc-design component [name]` | Create component specification | Designer |
| `/cc-design feature [FTR-XXX]` | Create feature design specification | Designer |
| `/cc-design qa [scope]` | Run 117-point design QA checklist | Designer |
| `/cc-design tokens export [framework]` | Export tokens for specific framework | Designer |

## Architecture

### RLM Framework Structure

```
RLM/
├── prompts/           # Workflow prompts and patterns
│   └── patterns/      # Reusable reasoning patterns
├── specs/             # Generated specifications
│   ├── PRD.md         # Product Requirements Document
│   ├── constitution.md # Project standards
│   ├── features/      # Feature specifications
│   ├── architecture/  # Technical architecture
│   ├── design/        # Design system and tokens
│   └── epics/         # Sprint planning
├── tasks/             # Task management
│   ├── active/        # Tasks to implement
│   ├── completed/     # Finished tasks
│   └── blocked/       # Blocked tasks
├── progress/          # Progress tracking
│   ├── manifests/     # Sub-agent completion manifests
│   ├── token-usage/   # Token usage tracking
│   ├── logs/          # Session logs
│   └── bundles/       # Context bundles for resume
├── research/          # Research artifacts
│   ├── project/       # Project research
│   └── sessions/      # Discovery sessions
├── templates/         # Document templates
└── docs/              # Documentation

.claude/               # Claude Code configuration
├── agents/            # Sub-agent definitions
├── commands/          # Slash commands
├── scripts/           # PowerShell automation scripts
└── hooks/             # Lifecycle event handlers
```

## RLM Workflow (9-Phase Pipeline)

The complete workflow from idea to verified code:

1. **Discovery** (`/cc-discover`) -> PRD.md, constitution.md
2. **Design System** (`/cc-design system`) -> Design tokens, component library
3. **Specs** (`/cc-create-specs`) -> Feature specs and architecture
4. **Feature Design** (`/cc-design feature`) -> UI/UX specs for each feature
5. **Tasks** (`/cc-create-tasks`) -> Fine-grained tasks with requirements
6. **Implementation** (`/cc-implement all`) -> Parallel TDD with design tokens
7. **Quality** (`/cc-design qa` + `/cc-review` + `/cc-test`) -> QA, review, tests
8. **Verification** (`/cc-verify FTR-XXX`) -> E2E tests per feature
9. **Report** -> Complete project summary

### Entry Points

- **From Zero**: `/cc-full [idea]` - Starts at Phase 1 (Discovery)
- **From PRD**: `/cc-full --from-prd` - Starts at Phase 2 (Design System)

### Automation Levels

- **AUTO** - Full autonomy, AI makes all decisions
- **SUPERVISED** - AI pauses at key checkpoints for approval
- **MANUAL** - Step-by-step with full human control

## Sub-Agent System

Sub-agents operate in isolated context windows for efficiency. Each agent activates automatically on relevant requests:

| Agent | Purpose | Proactive Triggers |
|-------|---------|-------------------|
| **Research** | Web research, competitor analysis | Competitors, market research, "what do others do?" |
| **Architect** | Technology decisions, architecture | "which technology?", system integration, trade-offs |
| **Designer** | Design systems, UI/UX specs | UI features, colors/typography, new screens |
| **Coder** | TDD implementation | Tasks in active/, "build/implement/create", bugs |
| **Tester** | Test writing, coverage | Coverage < 80%, flaky tests, bug reproduction |
| **Reviewer** | Code review, security | Before commits, security code, after implementation |
| **Verifier** | E2E testing, accessibility | Feature completion, verification requests |

### Sub-Agent Reliability

Every sub-agent call is tracked through:
- **Completion Manifests**: Sub-agents write manifests to `RLM/progress/manifests/`
- **File Verification**: Primary agent verifies files actually exist
- **Automatic Hooks**: PowerShell scripts track all sub-agent activity

See `RLM/docs/SUB-AGENT-RELIABILITY.md` for the complete protocol.

### Prompt Patterns

Reusable reasoning patterns in `RLM/prompts/patterns/`:

| Pattern | Use Case |
|---------|----------|
| `root-cause-analysis.md` | Bug investigation with 5-Whys |
| `decision-matrix.md` | Technology selection with weighted scoring |
| `comparative-analysis.md` | Feature comparison, alternatives |
| `problem-decomposition.md` | Complex task breakdown |

## Token Usage Tracking

Token tracking uses estimation during sessions with accurate post-session capture:

- **Real-Time Estimates**: Hooks track file operations and estimate tokens
- **Post-Session Capture**: Parse `/cost` output for accurate data
- **Context Detection**: PreCompact hook detects when context is summarizing

```bash
# View current estimates
powershell -ExecutionPolicy Bypass -File ".claude/scripts/show-token-usage.ps1" -WorkspaceRoot "." -Detailed
```

See `RLM/docs/TOKEN-TRACKING.md` for complete documentation.

## Development Standards

- Follow TDD: write tests before implementation
- Read specs from `RLM/specs/` before implementing features
- Check `RLM/specs/constitution.md` for project standards
- Log progress to `RLM/progress/logs/`
- Update task status in `RLM/progress/status.json`

### Code Quality

- TypeScript strict mode
- 80%+ test coverage target
- Functions < 50 lines
- Document public APIs
- Reference specs in commits (e.g., "Implements FTR-001")

## Design System

### Design Philosophy Options

- **CREATIVE**: Bold, unique, brand-differentiating designs
- **CONSISTENT**: Accessible, familiar patterns, enterprise-ready

### Animation Tiers

- **MINIMAL**: CSS transitions only (150-200ms)
- **MODERATE**: Framer Motion micro-interactions (200-400ms)
- **RICH**: GSAP scroll/loading animations

### Component State Requirements

All interactive components implement 8 states:
1. Default - Resting appearance
2. Hover - Mouse over (desktop)
3. Focus - Keyboard focus (visible ring)
4. Active - Being clicked/pressed
5. Disabled - Non-interactive
6. Loading - Async operation in progress
7. Error - Validation/operation failure
8. Empty - No content/data

### Accessibility Standards

- WCAG 2.1 AA minimum
- Color contrast: 4.5:1 text, 3:1 UI elements
- Touch targets: 44x44px minimum
- Keyboard navigation: all interactive elements
- Screen reader: semantic HTML, ARIA labels
- Reduced motion: respect `prefers-reduced-motion`

### Behavioral Economics Principles

Designer agent applies these principles:
- **Choice Architecture**: Design defaults to guide optimal choices
- **Prospect Theory**: Frame messaging as loss/gain appropriately
- **Anchoring**: Strategic pricing and value presentation
- **Social Proof**: Display genuine user activity
- **Endowment Effect**: Create ownership through personalization
- **Scarcity/Urgency**: Use only for genuine constraints
- **Cognitive Load**: Progressive disclosure, minimize complexity

### Cognitive Psychology Laws

- **Fitts's Law**: Larger targets (min 44x44px), closer placement
- **Hick's Law**: Fewer options (max 7+/-2), smart defaults
- **Miller's Law**: Chunk information, visible state
- **Jakob's Law**: Use established conventions
- **Peak-End Rule**: Design memorable peaks and endings
- **Von Restorff Effect**: Make important elements stand out

## Feature Verification

Automatic E2E testing when all tasks for a feature complete:

1. **Detection**: Post-task hook detects feature completion
2. **Test Generation**: Verifier generates Playwright tests from acceptance criteria
3. **Execution**: Full test suite (Functional + Accessibility + Visual)
4. **Result Handling**: PASS marks verified, FAIL creates bug tasks

| Test Type | Tool | Coverage |
|-----------|------|----------|
| Functional | Playwright | User flows, forms, navigation |
| Accessibility | axe-core | WCAG 2.1 AA compliance |
| Visual | Screenshots | UI states, responsive layouts |

## Test Mode

Run isolated test projects to validate the RLM methodology:

```bash
/cc-test-run my-test-project                    # New test from idea
/cc-test-run my-test-project --from-prd path/   # From existing PRD
/cc-test-run my-test-project --idea "desc"      # Idea inline
```

## GitHub Copilot Integration

RLM includes templates for Copilot integration:

```
RLM/templates/copilot/
├── copilot-instructions.md.template
├── AGENTS.md.template
├── agents/
├── prompts/
└── workflows/
```

## Configuration

See `RLM/progress/cc-config.json` for configuration options:

```json
{
  "parallel": { "limit": 10 },
  "automation": { "level": "auto" },
  "reporting": { "mode": "both" },
  "context_management": {
    "auto_checkpoint": { "enabled": true },
    "smart_truncation": { "enabled": true }
  }
}
```

## Documentation

| Document | Purpose |
|----------|---------|
| `RLM/docs/CLAUDE-CODE-GUIDE.md` | Complete Claude Code workflow guide |
| `RLM/docs/SUB-AGENT-RELIABILITY.md` | Sub-agent tracking and verification |
| `RLM/docs/TOKEN-TRACKING.md` | Token usage estimation and tracking |
| `RLM/docs/WHATS-NEW.md` | Version history and release notes |
| `RLM/prompts/CC-ORCHESTRATION.md` | Full orchestration protocol |
