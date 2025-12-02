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

### Claude Code Enhanced Commands (v2.5)

Complete 9-phase pipeline with full automation:

| Command | Phase | Purpose | Sub-Agent |
|---------|-------|---------|-----------|
| `/cc-full [idea]` | All | **Complete 9-phase automation**: idea → verified code | All |
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
| `/cc-tokens` | - | Display token usage (auto in v2.5) | - |
| `/cc-config [setting] [value]` | - | Configure workflow settings | - |

**v2.5 Features**:
- **9-Phase Pipeline** - Discover → Design System → Specs → Feature Design → Tasks → Implement → Quality → Verify → Report
- **Two Entry Points** - `/cc-full [idea]` (from zero) or `/cc-full --from-prd` (from PRD)
- **Quality Phase** - Combined Design QA + Code Review + Test Coverage
- **Verifier Agent** - E2E tests with Playwright, accessibility (axe-core), visual regression
- **Skip Options** - `--skip-design-research`, `--skip-feature-design`, `--skip-design-qa`, `--skip-verification`

### Context Priming Commands

Load minimal context for specific workflows (manual use - auto-priming built into `/cc-*`):

| Command | Purpose |
|---------|---------|
| `/prime-feature [FTR-XXX]` | Load feature context for development |
| `/prime-bug` | Load bug investigation frameworks |
| `/prime-task [TASK-XXX]` | Load single task context for TDD |
| `/prime-review` | Load review checklists and anti-patterns |
| `/prime-design [scope]` | Load design system context for UI development |

### Design Workflow Commands (v2.4)

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
├── prompts/        # Workflow prompts (01-DISCOVER through 08-REPORT)
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
│   └── design-agent.md          # UI/UX design system (v2.4)
├── progress/       # Progress tracking and logs
│   └── token-usage/    # Token usage logs (v2.1)
└── templates/      # Document templates

.claude/              # Claude Code enhanced workflow (v2.2)
├── agents/           # Sub-agent configurations
│   ├── research.md       # Web research, competitor analysis
│   ├── architect.md      # Architecture design, ADRs
│   ├── coder.md          # TDD implementation
│   ├── tester.md         # Test writing, coverage
│   ├── reviewer.md       # Code review, security
│   └── designer.md       # UI/UX design, tokens, accessibility (v2.4)
├── commands/         # Slash commands
│   ├── cc-full.md        # Full automation pipeline (v2.2)
│   ├── cc-create-specs.md # Specs from PRD (v2.2)
│   ├── cc-create-tasks.md # Task breakdown (v2.2)
│   ├── cc-config.md      # Configuration management (v2.2)
│   ├── cc-*.md           # Other enhanced workflow commands
│   └── prime-*.md        # Context priming commands (manual)
└── hooks/            # Lifecycle event handlers
    └── hooks.json        # Hook configuration

RLM/progress/
├── cc-config.json    # Workflow configuration (v2.2)
├── token-usage/      # Token usage logs
├── bundles/          # Context bundles for resume
└── background/       # Background agent results
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

## RLM Workflow (v2.5)

The complete 9-phase workflow:

1. **Discovery** (`/cc-discover`) → PRD.md, constitution.md with design requirements
2. **Design System** (`/cc-design system`) → Design tokens, component library
3. **Specs** (`/cc-create-specs`) → Feature specs and architecture
4. **Feature Design** (`/cc-design feature`) → UI/UX specs for each feature
5. **Tasks** (`/cc-create-tasks`) → Fine-grained tasks with UI requirements
6. **Implementation** (`/cc-implement all`) → Parallel TDD with design tokens
7. **Quality** (`/cc-design qa` + `/cc-review` + `/cc-test`) → Design QA, code review, tests
8. **Verification** (`/cc-verify FTR-XXX`) → E2E tests per feature
9. **Report** → Complete project summary

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

## Agent Definitions

Agent prompts in `RLM/agents/` define behavior:
- **Master Architect**: System design, tech decisions, spec validation
  - Chain-of-Thought decision process
  - Opinionated technology selection matrix
  - Anti-pattern documentation
- **Implementation Agent**: TDD code generation, error handling, documentation
  - 5-step problem-solving framework
  - Bug investigation framework
  - Debugging techniques reference
- **Research Agent**: Discovery and PRD generation
  - Industry detection (SaaS, E-commerce, FinTech, etc.)
  - Competitive analysis matrix
  - TAM/SAM/SOM estimation
  - Jobs-to-Be-Done framework
- **Testing Agent**: Test automation, coverage validation
- **DevOps Agent**: CI/CD, deployment automation

## New Templates (v2.0)

| Template | Purpose |
|----------|---------|
| `decision-record-template.md` | Architecture Decision Records (ADRs) |
| `assumption-log-template.md` | Track and validate project assumptions |
| `tech-comparison-template.md` | Weighted technology evaluation matrix |

## Design Templates (v2.4)

| Template | Purpose |
|----------|---------|
| `design-system-template.md` | Complete design system (colors, typography, spacing, components) |
| `ux-research-template.md` | UX research with personas, journey maps, competitive analysis |
| `design-qa-checklist.md` | 117-point design QA scoring system |
| `design-tokens-template.md` | Framework-agnostic tokens with exports (Tailwind, MUI, Chakra, etc.) |
| `component-spec-template.md` | Component spec with all 8 states, accessibility, code snippets |
| `feature-design-spec-template.md` | Feature-level design with user flows and screen layouts |

## Claude Code Sub-Agents (v2.5)

Sub-agents in `.claude/agents/` operate in isolated context windows for efficiency:

| Agent | Purpose | Phase | Tools |
|-------|---------|-------|-------|
| **Research** | Web research, competitor analysis | 1 | WebSearch, WebFetch, Read, Write |
| **Architect** | Technology decisions, architecture design | 1, 3 | Read, Write, Glob, Grep |
| **Designer** | Design systems, UI/UX specs, component specs | 2, 4, 7 | Read, Write, Glob, Grep, WebSearch, WebFetch |
| **Coder** | TDD implementation with design tokens | 6 | Read, Write, Edit, Bash |
| **Tester** | Test writing, coverage analysis | 7 | Read, Write, Bash |
| **Reviewer** | Code review, security, design compliance | 7 | Read, Grep, Glob |
| **Verifier** | E2E testing, accessibility, visual regression | 8 | Read, Write, Edit, Bash, Glob, Grep |

### Key Concepts (v2.5)

- **9-Phase Pipeline**: Complete automation from idea to verified code
- **Context Isolation**: Sub-agents have 0% token pollution to primary context
- **Parallel Spawning**: Up to 10 concurrent sub-agents implementing tasks
- **Quality Phase**: Combined Design QA + Code Review + Test Coverage
- **Verifier Agent**: E2E tests from acceptance criteria, accessibility (axe-core), visual regression
- **Two Entry Points**: `/cc-full [idea]` (from zero) or `/cc-full --from-prd` (from PRD)
- **Skip Options**: `--skip-design-research`, `--skip-feature-design`, `--skip-design-qa`, `--skip-verification`
- **Configuration**: `/cc-config` for runtime customization

See `RLM/prompts/CC-ORCHESTRATION.md` for full orchestration protocol.
See `RLM/docs/CLAUDE-CODE-GUIDE.md` for complete Claude Code workflow guide.

## Design System Integration (v2.4)

### Design Workflow

Design is integrated into the main RLM workflow:

1. **Discovery** (`/discover`) → Asks design questions (philosophy, animation tier, framework)
2. **Design System** (`/cc-design system`) → Generates design system from PRD
3. **UX Research** (`/cc-design research`) → Web-based research → personas & journeys
4. **Component Specs** (`/cc-design component`) → Detailed component specifications
5. **Implementation** (`/implement`) → Uses design tokens, implements all states
6. **Design QA** (`/cc-design qa`) → 117-point checklist, ≥90% pass required

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

### UI Framework Support

Design tokens can be exported for:
- Tailwind CSS (default)
- Material UI
- Chakra UI
- Bootstrap
- Ant Design
- CSS Variables (framework-agnostic)

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
- Touch targets: 44×44px minimum
- Keyboard navigation: all interactive elements
- Screen reader: semantic HTML, ARIA labels
- Reduced motion: always respect `prefers-reduced-motion`

## Feature Verification System (v2.5)

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

### Feature Status Flow

```
in_progress → verification-pending → verified
                      ↓
              verification-failed
                      ↓
              (fix bugs, retry)
```

### Verification File Structure

```
rlm-app/tests/e2e/
├── page-objects/           # Reusable Page Objects
│   └── base.page.ts
├── fixtures/               # Test utilities
│   └── test-utils.ts
└── features/               # Per-feature tests (generated)
    └── FTR-XXX/
        ├── FTR-XXX.functional.test.ts
        ├── FTR-XXX.a11y.test.ts
        └── FTR-XXX.visual.test.ts

RLM/progress/verification/  # Verification reports
└── FTR-XXX-[timestamp].md
```

### Bug Task Creation

When verification fails:
- Bug tasks created in `RLM/tasks/active/TASK-XXX-BUG-NNN.md`
- Include error details, screenshots, reproduction steps
- Linked to the acceptance criterion that failed
- Re-verification auto-triggered when all bugs fixed

## GitHub Copilot Integration (v2.3)

RLM includes templates for GitHub Copilot integration in generated projects. When a project is generated, these templates enable Copilot's autonomous coding capabilities.

### Copilot Templates Location

```
RLM/templates/copilot/
├── copilot-instructions.md.template     # → .github/copilot-instructions.md
├── AGENTS.md.template                    # → AGENTS.md (project root)
├── agents/                               # → .github/agents/
│   ├── rlm-architect.agent.md
│   ├── rlm-coder.agent.md
│   ├── rlm-tester.agent.md
│   ├── rlm-reviewer.agent.md
│   └── rlm-research.agent.md
├── prompts/                              # → .github/prompts/
│   ├── rlm-discover.prompt.md
│   ├── rlm-create-specs.prompt.md
│   ├── rlm-create-tasks.prompt.md
│   ├── rlm-implement.prompt.md
│   ├── rlm-implement-all.prompt.md
│   ├── rlm-test.prompt.md
│   ├── rlm-review.prompt.md
│   ├── rlm-fix-bug.prompt.md
│   ├── rlm-prime-feature.prompt.md
│   └── rlm-prime-task.prompt.md
└── workflows/                            # → .github/workflows/
    └── rlm-task-to-issue.yml
```

### Copilot Features Supported

| Feature | Purpose | Files |
|---------|---------|-------|
| **Custom Instructions** | Repository-wide RLM guidance | `.github/copilot-instructions.md` |
| **AGENTS.md** | Coding agent guidance | `AGENTS.md` |
| **Custom Agents** | Specialized RLM agents | `.github/agents/*.agent.md` |
| **Prompt Files** | Reusable RLM prompts | `.github/prompts/*.prompt.md` |
| **Task→Issue Workflow** | Convert tasks to GitHub issues | `.github/workflows/rlm-task-to-issue.yml` |

### Using Copilot Coding Agent

1. Enable Copilot coding agent on your GitHub repository
2. Push RLM task files to `RLM/tasks/active/`
3. The workflow creates GitHub issues automatically
4. Open an issue and click "Assign to Copilot"
5. Copilot autonomously implements and creates a PR

### Template Variables

| Variable | Source | Example |
|----------|--------|---------|
| `{{PROJECT_NAME}}` | PRD.md | "MyApp" |
| `{{PROJECT_DESCRIPTION}}` | PRD.md | "A habit tracking application" |
| `{{TECH_STACK_SUMMARY}}` | constitution.md | "Next.js, TypeScript, PostgreSQL" |
