# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RLM (Research-Lead-Manage) is an AI agent development system that transforms high-level product management into production-ready code through automated workflows. It consists of:

1. **RLM Framework** (`RLM/`) - Spec-driven development workflow with prompts, agents, and templates
2. **RLM Web App** (`rlm-app/`) - Next.js 16 frontend for project management with React 19

## Commands

### RLM App (Next.js)

```bash
cd rlm-app
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm test             # Run Jest unit tests
npm run test:e2e     # Run Playwright E2E tests
```

### RLM Slash Commands (IDE-Agnostic)

Use these Claude Code slash commands for the standard RLM workflow:

| Command | Purpose |
|---------|---------|
| `/discover [idea]` | Transform idea into PRD via research and questions |
| `/create-specs` | Generate technical specs from PRD |
| `/create-tasks` | Break features into fine-grained tasks |
| `/implement TASK-XXX` | Implement single task with TDD |
| `/implement all` | Implement all active tasks |
| `/implement resume` | Resume interrupted session |

### Claude Code Enhanced Commands (v2.7)

Complete 9-phase pipeline with full automation:

| Command | Phase | Purpose | Sub-Agent |
|---------|-------|---------|-----------|
| `/cc-full [idea]` | All | **Complete 9-phase automation**: idea -> verified code | All |
| `/cc-full --from-prd` | 2-9 | Start from existing PRD (skip discover) | All |
| `/cc-discover [idea]` | 1 | Discovery with research (Path 1: from zero) | Research |
| `/cc-design system` | 2 | Generate design system from PRD | Designer |
| `/cc-create-specs` | 3 | Generate specs from PRD (Path 2) | Architect |
| `/cc-design feature FTR-XXX` | 4 | Create feature design specification | Designer |
| `/cc-create-tasks` | 5 | Break features into tasks | - |
| `/cc-implement [task\|all\|resume]` | 6 | TDD implementation (parallel for `all`) | Coder |
| `/cc-design qa [scope]` | 7 | Run 117-point design QA checklist | Designer |
| `/cc-review [scope]` | 7 | Code review before commit | Reviewer |
| `/cc-test [scope]` | 7 | Testing with dedicated tester agent | Tester |
| `/cc-verify FTR-XXX` | 8 | **Feature verification**: E2E tests | Verifier |
| `/cc-architect` | - | Architecture design with isolated context | Architect |
| `/cc-background [task]` | - | Spawn autonomous background agent | Background |
| `/cc-tokens` | - | Display token usage (auto in v2.7) | - |
| `/cc-config [setting] [value]` | - | Configure workflow settings | - |
| `/cc-debug [quick\|--auto-fix]` | - | **Diagnose and fix state issues** | - |
| `/cc-test-run [name]` | - | **Run isolated test project** (v2.7) | - |
| `/rlm-full [idea\|resume]` | All | **Standard prompt pipeline** (non-CC) | - |

### v2.7 Features (December 2025)

- **Prompt Pattern Library** - 4 reusable reasoning patterns for structured problem-solving
- **API Hook Pattern** - Sub-agents proactively activate on relevant user requests
- **3-Tier Context Management** - Reduce -> Delegate -> Manage with smart truncation
- **Behavioral Economics Integration** - 7 principles integrated into Designer workflow
- **Cognitive Psychology Principles** - 6 laws (Fitts, Hick, Miller, etc.) in UX research
- **Enhanced PRD Template v2** - 15-section comprehensive structure
- **Test Mode** - `/cc-test-run` for isolated methodology testing
- **Context Audit** - Token usage analysis in `/cc-debug context-audit`

### Previous Version Features

**v2.6 Features**:
- Real-Time Progress Reporting with 5-step model
- Configurable Reporting modes (realtime, silent, both)
- Token Efficiency Tracking with per-task metrics
- Checkpoint System for incremental task tracking
- Global Debug Command (`/cc-debug`) for state reconciliation
- Auto Project Research detection
- Auto Design Detection (UI vs Non-UI)
- Context Window Management with auto-checkpoint
- IDE/Copilot Parity with shared instructions

**v2.5 Features**:
- 9-Phase Pipeline (Discover -> Design System -> Specs -> Feature Design -> Tasks -> Implement -> Quality -> Verify -> Report)
- Two Entry Points (`/cc-full [idea]` or `/cc-full --from-prd`)
- Quality Phase (Design QA + Code Review + Test Coverage)
- Verifier Agent (E2E tests with Playwright, accessibility, visual regression)
- Skip Options (`--skip-design-research`, `--skip-feature-design`, `--skip-design-qa`, `--skip-verification`)

### Context Priming Commands

Load minimal context for specific workflows (manual use - auto-priming built into `/cc-*`):

| Command | Purpose |
|---------|---------|
| `/prime-feature [FTR-XXX]` | Load feature context for development |
| `/prime-bug` | Load bug investigation frameworks |
| `/prime-task [TASK-XXX]` | Load single task context for TDD |
| `/prime-review` | Load review checklists and anti-patterns |
| `/prime-design [scope]` | Load design system context for UI development |

### Design Workflow Commands

Comprehensive UI/UX engineering with design system management:

| Command | Purpose | Sub-Agent |
|---------|---------|-----------|
| `/cc-design system` | Generate complete design system from PRD | Designer |
| `/cc-design research` | UX research with personas & journey maps | Designer |
| `/cc-design component [name]` | Create component specification | Designer |
| `/cc-design feature [FTR-XXX]` | Create feature design specification | Designer |
| `/cc-design qa [scope]` | Run 117-point design QA checklist | Designer |
| `/cc-design tokens export [framework]` | Export tokens for specific framework | Designer |

**Design Philosophy Options** (chosen during `/discover`):
- **CREATIVE**: Bold, unique, brand-differentiating designs
- **CONSISTENT**: Accessible, familiar patterns, enterprise-ready

**Animation Tiers**:
- **MINIMAL**: CSS transitions only (150-200ms)
- **MODERATE**: Framer Motion micro-interactions (200-400ms)
- **RICH**: GSAP scroll/loading animations (custom vision)

## Architecture

### RLM Framework Structure

```
RLM/
├── prompts/        # Workflow prompts (00-* detection, 01-08 workflow)
│   └── patterns/   # Prompt pattern library (v2.7)
│       ├── root-cause-analysis.md
│       ├── decision-matrix.md
│       ├── comparative-analysis.md
│       └── problem-decomposition.md
├── specs/          # Generated specifications
│   ├── PRD.md              # Product Requirements Document
│   ├── constitution.md     # Project standards
│   ├── features/FTR-XXX/   # Feature specifications
│   ├── architecture/       # Technical architecture
│   └── epics/              # Sprint planning
├── tasks/          # Task management
│   ├── active/     # Tasks to implement
│   ├── completed/  # Finished tasks
│   └── blocked/    # Blocked tasks with issues
├── agents/         # Agent prompt definitions
│   ├── master-architect.md      # Architecture design
│   ├── implementation-agent.md  # TDD code generation
│   ├── testing-agent.md         # Test automation
│   ├── devops-agent.md          # CI/CD and deployment
│   └── design-agent.md          # UI/UX design system
├── progress/       # Progress tracking and logs
│   ├── cc-config.json    # Workflow configuration
│   ├── checkpoint.json   # Incremental task tracking
│   ├── token-usage/      # Token usage logs
│   ├── bundles/          # Context bundles for resume
│   └── background/       # Background agent results
├── research/
│   └── project/          # Project research for auto-detection
└── templates/      # Document templates
    ├── PRD-template-v2.md           # Enhanced PRD (v2.7)
    ├── behavioral-economics-checklist.md  # Design checklist (v2.7)
    ├── design-system-template.md
    ├── ux-research-template.md      # With cognitive psychology (v2.7)
    ├── design-qa-checklist.md
    ├── design-tokens-template.md
    ├── component-spec-template.md
    └── feature-design-spec-template.md

.claude/              # Claude Code enhanced workflow
├── agents/           # Sub-agent configurations
│   ├── research.md       # Web research, competitor analysis
│   ├── architect.md      # Architecture design, ADRs
│   ├── coder.md          # TDD implementation
│   ├── tester.md         # Test writing, coverage
│   ├── reviewer.md       # Code review, security
│   ├── designer.md       # UI/UX design, tokens, accessibility
│   └── verifier.md       # E2E testing, accessibility, visual regression
├── commands/         # Slash commands
│   ├── cc-full.md        # Full automation pipeline
│   ├── cc-test-run.md    # Test mode command (v2.7)
│   ├── cc-debug.md       # Debug/reconciliation
│   ├── rlm-full.md       # Standard pipeline command
│   └── [other commands]
└── hooks/            # Lifecycle event handlers
    └── hooks.json        # Hook configuration

RLM/templates/ide-agents/shared/  # IDE parity
├── rlm-core-instructions.md      # Core workflow instructions
└── token-tracking.md             # Token estimation for IDEs
```

### RLM Web App Structure

```
rlm-app/
├── app/                    # Next.js App Router pages
│   └── projects/[id]/      # Project-specific pages
│       ├── discovery/      # Discovery workflow
│       ├── features/       # Feature management
│       ├── tasks/          # Task tracking
│       ├── agents/         # Agent orchestration
│       └── progress/       # Progress dashboard
├── components/
│   ├── ui/                 # Radix UI primitives (button, card, input, etc.)
│   ├── shared/             # Shared components (Sidebar, Header, etc.)
│   ├── agents/             # Agent visualization components
│   └── pm/                 # Product management components
└── lib/                    # Utilities and providers
```

### Key Technologies

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI
- **State**: Zustand, TanStack Query
- **Database**: better-sqlite3, mssql
- **Real-time**: WebSockets (ws)
- **GitHub**: Octokit REST API
- **Testing**: Jest, Playwright

## RLM Workflow (9-Phase Pipeline)

The complete workflow from idea to verified code:

1. **Discovery** (`/cc-discover`) -> PRD.md, constitution.md with design requirements
2. **Design System** (`/cc-design system`) -> Design tokens, component library
3. **Specs** (`/cc-create-specs`) -> Feature specs and architecture
4. **Feature Design** (`/cc-design feature`) -> UI/UX specs for each feature
5. **Tasks** (`/cc-create-tasks`) -> Fine-grained tasks with UI requirements
6. **Implementation** (`/cc-implement all`) -> Parallel TDD with design tokens
7. **Quality** (`/cc-design qa` + `/cc-review` + `/cc-test`) -> Design QA, code review, tests
8. **Verification** (`/cc-verify FTR-XXX`) -> E2E tests per feature
9. **Report** -> Complete project summary

### Two Entry Points

- **Path 1: From Zero** - `/cc-full [idea]` starts at Phase 1
- **Path 2: From PRD** - `/cc-full --from-prd` starts at Phase 2

### Automation Levels

When implementing, choose autonomy level:
- **AUTO** - Full autonomy, AI makes all decisions
- **SUPERVISED** - AI pauses at key checkpoints for approval
- **MANUAL** - Step-by-step with full human control

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

## Claude Code Sub-Agents (v2.7)

Sub-agents in `.claude/agents/` operate in isolated context windows for efficiency. Each agent has proactive trigger descriptions (API hook pattern) that specify when to use them automatically:

| Agent | Purpose | Proactive Triggers | Tools |
|-------|---------|-------------------|-------|
| **Research** | Web research, competitor analysis | Mentions of competitors, market research, "what do others do?" | WebSearch, WebFetch, Read, Write |
| **Architect** | Technology decisions, architecture design | "which technology?", system integration, trade-off evaluation | Read, Write, Glob, Grep |
| **Designer** | Design systems, UI/UX specs, component specs | UI feature start, colors/typography questions, new screens | Read, Write, Glob, Grep, WebSearch, WebFetch |
| **Coder** | TDD implementation with design tokens | Tasks in active/, "build/implement/create", bug fixes | Read, Write, Edit, Bash |
| **Tester** | Test writing, coverage analysis | Coverage < 80%, flaky tests, before merges, bug reproduction | Read, Write, Bash |
| **Reviewer** | Code review, security, design compliance | Before commits, security-sensitive code, after implementation | Read, Grep, Glob |
| **Verifier** | E2E testing, accessibility, visual regression | Feature task completion, verification requests | Read, Write, Edit, Bash, Glob, Grep |

### Prompt Pattern Library (v2.7)

Reusable reasoning patterns in `RLM/prompts/patterns/`:

| Pattern | Use Case | Applied By |
|---------|----------|------------|
| `root-cause-analysis.md` | Bug investigation with 5-Whys | Coder, Tester |
| `decision-matrix.md` | Technology selection with weighted scoring | Architect |
| `comparative-analysis.md` | Feature comparison, alternative evaluation | Architect, Research |
| `problem-decomposition.md` | Complex task breakdown | Coder |

### Key Concepts

- **9-Phase Pipeline**: Complete automation from idea to verified code
- **Context Isolation**: Sub-agents have 0% token pollution to primary context
- **Parallel Spawning**: Up to 10 concurrent sub-agents implementing tasks
- **3-Tier Context Management**: Reduce -> Delegate -> Manage with smart truncation
- **Proactive Agent Triggers**: Agents activate automatically on relevant requests
- **Quality Phase**: Combined Design QA + Code Review + Test Coverage
- **Verifier Agent**: E2E tests from acceptance criteria, accessibility (axe-core), visual regression

See `RLM/prompts/CC-ORCHESTRATION.md` for full orchestration protocol.
See `RLM/docs/CLAUDE-CODE-GUIDE.md` for complete Claude Code workflow guide.
See `RLM/docs/WHATS-NEW.md` for version history and release notes.

## Design System Integration

### Design Workflow

Design is integrated into the main RLM workflow:

1. **Discovery** (`/discover`) -> Asks design questions (philosophy, animation tier, framework)
2. **Design System** (`/cc-design system`) -> Generates design system from PRD
3. **UX Research** (`/cc-design research`) -> Web-based research -> personas & journeys
4. **Component Specs** (`/cc-design component`) -> Detailed component specifications
5. **Implementation** (`/implement`) -> Uses design tokens, implements all states
6. **Design QA** (`/cc-design qa`) -> 117-point checklist, >=90% pass required

### Behavioral Economics Integration (v2.7)

Designer agent applies 7 behavioral economics principles:

| Principle | Application |
|-----------|-------------|
| **Choice Architecture** | Design defaults to guide optimal choices |
| **Prospect Theory** | Frame messaging as loss/gain appropriately |
| **Anchoring** | Strategic pricing and value presentation |
| **Social Proof** | Display genuine user activity |
| **Endowment Effect** | Create ownership through personalization |
| **Scarcity/Urgency** | Use only for genuine constraints |
| **Cognitive Load** | Progressive disclosure, minimize complexity |

See `RLM/templates/behavioral-economics-checklist.md` for the full checklist.

### Cognitive Psychology Principles (v2.7)

UX research template includes cognitive psychology principles:

| Law | UX Application |
|-----|----------------|
| **Fitts's Law** | Larger targets (min 44x44px), closer placement |
| **Hick's Law** | Fewer options (max 7+/-2), smart defaults |
| **Miller's Law** | Chunk information, visible state |
| **Jakob's Law** | Use established conventions |
| **Peak-End Rule** | Design memorable peaks and endings |
| **Von Restorff Effect** | Make important elements stand out |

### Design File Structure

```
RLM/specs/design/
├── design-system.md           # Core design system
├── ux-research.md             # Personas, journey maps
├── tokens/
│   ├── tokens.json            # Source tokens
│   ├── tailwind.config.js     # Tailwind export
│   ├── mui-theme.ts           # Material UI export
│   ├── chakra-theme.ts        # Chakra UI export
│   └── css-variables.css      # CSS Variables export
└── components/
    ├── button.md              # Component specifications
    ├── input.md
    └── [component].md
```

### Component State Requirements

All interactive components MUST implement 8 states:
1. Default - Resting appearance
2. Hover - Mouse over (desktop)
3. Focus - Keyboard focus (visible ring)
4. Active - Being clicked/pressed
5. Disabled - Non-interactive
6. Loading - Async operation in progress
7. Error - Validation/operation failure
8. Empty - No content/data

### Accessibility Standards

- WCAG 2.1 AA minimum (AAA optional)
- Color contrast: 4.5:1 text, 3:1 UI elements
- Touch targets: 44x44px minimum
- Keyboard navigation: all interactive elements
- Screen reader: semantic HTML, ARIA labels
- Reduced motion: always respect `prefers-reduced-motion`

## Feature Verification System

Automatic E2E testing when all tasks for a feature complete.

### Verification Workflow

When the last task for a feature is completed:
1. **Detection**: Post-task hook detects feature completion
2. **Test Generation**: Verifier agent generates Playwright tests from acceptance criteria
3. **Execution**: Full test suite runs (Functional + Accessibility + Visual)
4. **Result Handling**:
   - **PASS**: Feature marked as `verified`
   - **FAIL**: Bug tasks created, feature blocked until fixed

### Verification Commands

| Command | Purpose |
|---------|---------|
| `/cc-verify FTR-XXX` | Verify specific feature |
| `/cc-verify all` | Verify all pending features |
| `/cc-verify FTR-XXX --retry` | Re-verify after bug fixes |

### Test Types

| Type | Tool | Coverage |
|------|------|----------|
| **Functional** | Playwright | User flows, forms, navigation, data |
| **Accessibility** | axe-core | WCAG 2.1 AA compliance |
| **Visual** | Screenshots | UI states, responsive layouts |

## Test Mode (v2.7)

Run isolated test projects to validate the RLM methodology:

```bash
/cc-test-run my-test-project                    # New test from idea prompt
/cc-test-run my-test-project --from-prd path/   # Start from existing PRD
/cc-test-run my-test-project --idea "desc"      # Provide idea inline
```

**What it does**:
1. Creates isolated directory: `test_projects/[name]-[timestamp]/`
2. Copies RLM structure
3. Runs `/cc-full` in isolation
4. Collects metrics (tokens, time, LOC, coverage)
5. Generates comparison report if multiple instances exist

Configure in `cc-config.json`:
```json
{
  "test_mode": {
    "enabled": false,
    "output_directory": "test_projects/",
    "collect_metrics": true,
    "metrics_to_collect": ["tokens_used", "execution_time", "lines_of_code", "test_coverage"]
  }
}
```

## GitHub Copilot Integration

RLM includes templates for GitHub Copilot integration in generated projects. When a project is generated, these templates enable Copilot's autonomous coding capabilities.

### Copilot Templates Location

```
RLM/templates/copilot/
├── copilot-instructions.md.template     # -> .github/copilot-instructions.md
├── AGENTS.md.template                    # -> AGENTS.md (project root)
├── agents/                               # -> .github/agents/
├── prompts/                              # -> .github/prompts/
└── workflows/                            # -> .github/workflows/
```

### Using Copilot Coding Agent

1. Enable Copilot coding agent on your GitHub repository
2. Push RLM task files to `RLM/tasks/active/`
3. The workflow creates GitHub issues automatically
4. Open an issue and click "Assign to Copilot"
5. Copilot autonomously implements and creates a PR

## Configuration

### cc-config.json Structure

```json
{
  "version": "2.7",
  "parallel": { "limit": 10 },
  "automation": { "level": "auto" },
  "reporting": { "mode": "both" },
  "enhancements": {
    "prompt_patterns": { "enabled": true, "auto_select": true },
    "behavioral_economics": { "enabled": true, "checklist_in_design": true },
    "cognitive_psychology": { "enabled": true, "validate_in_qa": true }
  },
  "test_mode": { "enabled": false, "output_directory": "test_projects/" },
  "context_management": {
    "auto_checkpoint": { "enabled": true, "thresholds": [0.5, 0.75, 0.9] },
    "smart_truncation": { "enabled": true, "start_at": 0.75 }
  }
}
```

See `RLM/progress/cc-config.json` for full configuration options.
