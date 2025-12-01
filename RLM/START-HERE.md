# RLM - Research, Lead, Manage

## AI-Powered Software Development Method

RLM transforms raw ideas into production-ready code through a structured workflow that works with **any AI coding agent** in **any IDE**.

### What's New in v2.4 (Design Engineering)

- **Designer Sub-Agent** - Specialized agent for UI/UX specifications and design system generation
- **Design Commands** - `/cc-design [system|component|audit|tokens|spec|qa]` for all design workflows
- **Design Templates** - Feature design specs, component specs, design QA checklists, design tokens
- **8 Component States** - Default, Hover, Focus, Active, Disabled, Loading, Error, Empty
- **117-Point Design QA** - Automated design quality checklist across 7 categories
- **Framework-Agnostic Tokens** - Design tokens export for Tailwind, MUI, Chakra, Bootstrap, Ant Design
- **Animation Tiers** - MINIMAL (CSS), MODERATE (Framer Motion), RICH (GSAP)
- **WCAG 2.1 AA/AAA** - Built-in accessibility standards and validation

### What's New in v2.3 (GitHub Copilot)

- **Copilot Integration** - Templates for `.github/copilot-instructions.md` and AGENTS.md
- **Custom Agents** - Specialized Copilot agents matching RLM workflow
- **Prompt Files** - Reusable `.github/prompts/*.prompt.md` for Copilot
- **Task→Issue Workflow** - Auto-convert RLM tasks to GitHub issues for Copilot

### What's New in v2.2 (Full Automation)

- **Full Automation Pipeline** - `/cc-full [idea]` chains all phases: discover → specs → tasks → parallel implement
- **Parallel Sub-Agent Spawning** - Up to 10 concurrent coder agents implementing tasks simultaneously
- **Automatic Context Priming** - Built into all `/cc-*` commands, no manual `/prime-*` needed
- **Automatic Token Reporting** - Threshold warnings at 50%, 75%, 90% without manual checks
- **Configuration System** - `/cc-config` for runtime customization (parallel limits, thresholds)
- **Two Entry Points** - `/cc-discover` (from zero) or `/cc-create-specs` (from PRD)

### What's New in v2.1 (Claude Code Enhanced)

- **Sub-Agent Architecture** - Specialized agents (Research, Architect, Coder, Tester, Reviewer) in isolated context
- **Context Efficiency** - 0% token pollution via delegation, ~40-60% context reduction
- **Token Reporting** - Continuous usage tracking with `/cc-tokens` command
- **Background Agents** - Long-running autonomous tasks via `/cc-background`
- **Context Priming** - Lightweight `/prime-*` commands load minimal context
- **Hooks System** - Lifecycle event handlers (pre-commit, post-task, on-error)

### What's New in v2.0

- **Industry Detection** - Automatic SaaS, E-commerce, FinTech, HealthTech, EdTech detection with specialized questions
- **Opinionated Tech Recommendations** - Specific technology guidance (e.g., "Choose Next.js for SEO-critical apps")
- **Chain-of-Thought Reasoning** - Structured decision-making with confidence levels
- **New Templates** - ADR (Architecture Decision Records), Assumption Logs, Tech Comparison Matrix
- **Enhanced Agents** - Problem-solving frameworks, bug investigation, competitive analysis

---

## Quick Start: Choose Your Path

### Path 1: Starting from Zero (No PRD)
**You have:** A project idea
**You need:** Complete specifications and implementation

```
Tell your AI: "Read RLM/prompts/01-DISCOVER.md and help me discover specs for: [your idea]"
```

Or in Claude Code: `/discover [your idea]`

### Path 2: Starting from PRD
**You have:** An existing PRD (Product Requirements Document)
**You need:** Technical specs, tasks, and implementation

```
Tell your AI: "Read RLM/prompts/02-CREATE-SPECS.md and generate specs from my PRD"
```

Or in Claude Code: `/create-specs`

---

## Complete Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  PATH 1: FROM ZERO                PATH 2: FROM PRD          │
│  ──────────────────                ───────────────          │
│  /discover [idea]                  /create-specs            │
│       │                                 │                   │
│       ▼                                 │                   │
│  [Generate PRD] ◄───────────────────────┘                   │
│       │                                                     │
│       ▼                                                     │
│  [Generate Specs: Features, Architecture, Epics]            │
│       │                                                     │
│       ▼                                                     │
│  /create-tasks                                              │
│  [Break into fine-grained tasks]                            │
│       │                                                     │
│       ▼                                                     │
│  /implement [task|all|resume]                               │
│  [TDD Implementation with 3 automation levels]              │
│       │                                                     │
│       ▼                                                     │
│  [Complete Project]                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Using RLM with Your AI Coding Agent

### Claude Code (Recommended)

**Standard Commands** (IDE-agnostic):
- `/discover [idea]` - Start from zero
- `/create-specs` - Generate specs from PRD
- `/create-tasks` - Break features into tasks
- `/implement TASK-001` - Implement single task
- `/implement all` - Implement all tasks
- `/implement resume` - Resume interrupted session

**Enhanced Commands** (v2.4 - Full automation with parallel sub-agents):
- `/cc-full [idea]` - **Complete automation**: idea → code
- `/cc-discover [idea]` - Discovery with delegated research (Path 1)
- `/cc-create-specs` - Specs from PRD (Path 2)
- `/cc-create-tasks` - Break features into tasks
- `/cc-architect` - Architecture with isolated context
- `/cc-implement [task|all|resume]` - TDD with parallel coder sub-agents
- `/cc-test [scope]` - Testing with tester sub-agent
- `/cc-review [scope]` - Code review with reviewer sub-agent
- `/cc-design [subcommand]` - Design system and UI/UX specifications (v2.4)
- `/cc-background [task]` - Spawn autonomous background agent
- `/cc-tokens` - View token usage summary
- `/cc-config [setting] [value]` - Configure workflow settings

**Context Primers** (manual use - auto-priming built into `/cc-*` commands):
- `/prime-feature [FTR-XXX]` - Feature development context
- `/prime-task [TASK-XXX]` - Single task TDD context
- `/prime-bug` - Bug investigation frameworks
- `/prime-review` - Code review checklists
- `/prime-design` - Design system and UI/UX context (v2.4)

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

## Automation Levels

When implementing tasks, choose your level of control:

| Level | Description | When AI Asks You |
|-------|-------------|------------------|
| **AUTO** | Full autonomy - AI makes all decisions | Only when blocked |
| **SUPERVISED** | Checkpoints at key decisions | Before major decisions, after each task |
| **MANUAL** | Step-by-step approval | Before every step |

---

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `RLM/prompts/` | Copy-paste prompt templates for any AI |
| `RLM/templates/` | Document templates (PRD, specs, tasks, ADRs) |
| `RLM/specs/` | Generated specifications |
| `RLM/tasks/active/` | Tasks ready for implementation |
| `RLM/tasks/completed/` | Finished tasks |
| `RLM/progress/` | Progress tracking and reports |
| `RLM/agents/` | AI agent role definitions |
| `RLM/docs/` | Full documentation |

---

## Design Templates (v2.4)

| Template | Purpose |
|----------|---------|
| `design-system-template.md` | Complete design system specification |
| `component-spec-template.md` | Individual component design specs |
| `feature-design-spec-template.md` | Feature UI/UX specifications |
| `design-tokens-template.md` | Framework-agnostic design tokens |
| `design-qa-checklist.md` | 117-point design QA checklist |
| `ux-research-template.md` | UX research and user testing |

## ADR Templates (v2.0)

| Template | Purpose |
|----------|---------|
| `decision-record-template.md` | Architecture Decision Records (ADRs) |
| `assumption-log-template.md` | Track and validate assumptions |
| `tech-comparison-template.md` | Weighted technology evaluation |

---

## Prompts Reference

| Prompt | Purpose | Use When |
|--------|---------|----------|
| `01-DISCOVER.md` | Transform idea into PRD with tech recommendations | Starting a new project |
| `02-CREATE-SPECS.md` | Generate specs from PRD | Have PRD, need specs |
| `03-CREATE-TASKS.md` | Break features into tasks | Specs ready, need tasks |
| `04-IMPLEMENT-TASK.md` | Implement single task (TDD) | Ready to code one task |
| `05-IMPLEMENT-ALL.md` | Implement all active tasks | Ready to code everything |
| `06-RESUME.md` | Resume interrupted work | Continuing previous session |
| `07-TEST.md` | Run and fix tests | Validating implementation |
| `08-REPORT.md` | Generate progress report | Check project status |

### Discovery Phase Enhancements (v2.0)

The discovery process now includes:
- **Industry Detection**: Automatically identifies SaaS B2B/B2C, E-commerce, FinTech, HealthTech, EdTech, Marketplace
- **Industry-Specific Questions**: Asks relevant questions based on detected industry
- **Technology Recommendations**: Provides opinionated stack recommendations with confidence levels
- **5 Whys Analysis**: Root cause validation for complex problems
- **SWOT Analysis**: Competitive positioning template

---

## Documentation

- [User Guide](docs/USER-GUIDE.md) - Complete step-by-step guide
- [Quick Reference](docs/QUICK-REFERENCE.md) - One-page cheat sheet
- [Template Reference](docs/TEMPLATE-REFERENCE.md) - How to use templates
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions
- [Claude Code Guide](docs/CLAUDE-CODE-GUIDE.md) - v2.4 Sub-agent workflow guide
- [UI Framework Reference](docs/UI-FRAMEWORK-REFERENCE.md) - Design token implementation (v2.4)
- [Design Patterns Library](docs/DESIGN-PATTERNS-LIBRARY.md) - UI/UX pattern reference (v2.4)
- [Accessibility Guide](docs/ACCESSIBILITY-GUIDE.md) - WCAG compliance guide (v2.4)
- [What's New](docs/WHATS-NEW.md) - Version changelog

---

## Example: Starting a New Project

**Step 1:** Tell your AI about your idea
```
Read RLM/prompts/01-DISCOVER.md and help me discover specs for:
"Build a habit tracking app with social accountability features"
```

**Step 2:** Answer the clarifying questions (the AI will ask ~12 questions in 3 rounds)

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
2. Check `RLM/docs/TROUBLESHOOTING.md` for common issues
3. Review the prompts in `RLM/prompts/` - they contain detailed instructions
