# Claude Code Enhanced Workflow Guide

This guide covers the Claude Code-specific RLM workflow (v2.4) that leverages sub-agent architecture for context efficiency and task specialization.

## Overview

The Claude Code enhanced workflow adds specialized sub-agents and context management on top of the standard RLM method. It provides:

- **40-60% context reduction** through sub-agent delegation
- **Specialized agents** for research, architecture, coding, testing, review, and **design**
- **Automatic token reporting** with threshold-based warnings (50%, 75%, 90%)
- **Parallel sub-agent spawning** for concurrent task implementation
- **Background agents** for long-running autonomous tasks
- **Automatic context priming** built into all `/cc-*` commands
- **Full automation pipeline** via `/cc-full [idea]`
- **Comprehensive UI/UX engineering** with design systems, tokens, and accessibility (v2.4)

### What's New in v2.4

| Feature | Description |
|---------|-------------|
| **Designer Agent** | Full UI/UX engineering with design systems, tokens, accessibility |
| **Design Philosophy** | CREATIVE (bold, unique) vs CONSISTENT (accessible, enterprise) |
| **Animation Tiers** | MINIMAL (CSS), MODERATE (Framer Motion), RICH (GSAP) |
| **117-Point Design QA** | Comprehensive checklist with ≥90% pass requirement |
| **Framework Exports** | Tailwind, Material UI, Chakra, Bootstrap, Ant Design, CSS Variables |
| **8 Component States** | Default, Hover, Focus, Active, Disabled, Loading, Error, Empty |
| **UX Research** | Web-based research → personas, journey maps |
| **Design Commands** | `/cc-design system`, `/cc-design component`, `/cc-design qa` |

### What's New in v2.2

| Feature | Description |
|---------|-------------|
| **Two Entry Points** | `/cc-discover` (from zero) or `/cc-create-specs` (from PRD) |
| **Full Automation** | `/cc-full [idea]` chains all phases automatically |
| **Parallel Spawning** | Up to 10 concurrent sub-agents (configurable) |
| **Auto Context Priming** | No manual `/prime-*` needed - built into commands |
| **Auto Token Reporting** | Threshold warnings at 50%, 75%, 90% without manual checks |
| **Configuration System** | `/cc-config` for runtime customization |

## Quick Start

### Choose Your Command Style

| Scenario | Standard RLM | Claude Code Enhanced |
|----------|--------------|----------------------|
| Start new project | `/discover [idea]` | `/cc-discover [idea]` |
| Start from PRD | `/create-specs` | `/cc-create-specs` |
| Full automation | N/A | `/cc-full [idea]` |
| Design architecture | Read architect agent manually | `/cc-architect` |
| **Design system** | N/A | `/cc-design system` |
| **UX research** | N/A | `/cc-design research` |
| **Component specs** | N/A | `/cc-design component [name]` |
| **Design QA** | N/A | `/cc-design qa [scope]` |
| Create tasks | `/create-tasks` | `/cc-create-tasks` |
| Implement task | `/implement TASK-XXX` | `/cc-implement TASK-XXX` |
| Implement all (parallel) | `/implement all` | `/cc-implement all` |
| Run tests | Manual test commands | `/cc-test [scope]` |
| Code review | Manual review | `/cc-review [scope]` |
| Configure workflow | N/A | `/cc-config [setting] [value]` |

**Rule of Thumb**: Use `/cc-*` commands for complex work where context efficiency matters. Use standard commands for simple tasks.

### Full Automation Quickstart

```bash
# One command: idea → code
/cc-full Build a habit tracking app with social features

# Or step by step with entry points
/cc-discover [idea]        # Path 1: From zero
/cc-create-specs           # Path 2: From PRD
/cc-create-tasks           # Break into tasks
/cc-implement all          # Parallel implementation
```

---

## Architecture

### Primary Agent vs Sub-Agents

```
┌───────────────────────────────────────────────────────────────┐
│                            USER                                │
│                              │                                 │
│                              ▼                                 │
│                    ┌──────────────────┐                       │
│                    │  PRIMARY AGENT   │                       │
│                    │  (You interact   │                       │
│                    │   with this)     │                       │
│                    └────────┬─────────┘                       │
│                             │                                  │
│    ┌────────┬───────┬───────┼───────┬────────┬────────┐      │
│    ▼        ▼       ▼       ▼       ▼        ▼        ▼      │
│ ┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐ │
│ │Research││Architect││Designer││ Coder ││ Tester ││Reviewer│ │
│ │  Agent ││  Agent  ││ Agent  ││ Agent ││ Agent  ││ Agent  │ │
│ └───┬────┘└───┬────┘└───┬────┘└───┬────┘└───┬────┘└───┬────┘ │
│     └─────────┴─────────┴─────────┴─────────┴─────────┘      │
│                             │                                  │
│                             ▼                                  │
│                      [File System]                             │
│                 Results written to files                       │
└───────────────────────────────────────────────────────────────┘
```

**Key Principle**: Sub-agents report to the Primary Agent, NOT to you. You only interact with the Primary Agent, which orchestrates everything.

### Context Isolation

Each sub-agent runs in its own context window:
- **0% token pollution** to primary context
- Receives only the context it needs
- Returns summarized results
- Detailed output written to files

---

## Sub-Agents Reference

### Research Agent (`.claude/agents/research.md`)

**Trigger**: `/cc-discover`, market research, competitor analysis

**Capabilities**:
- Web research and documentation fetching
- Competitive analysis with comparison matrices
- Technology trend analysis
- TAM/SAM/SOM estimation

**Output**: Writes to `RLM/specs/research/`, returns summary to Primary

### Architect Agent (`.claude/agents/architect.md`)

**Trigger**: `/cc-architect`, technology decisions, system design

**Capabilities**:
- Technology stack selection with confidence levels
- Architecture design with diagrams
- ADR (Architecture Decision Record) generation
- Anti-pattern detection

**Output**: Writes to `RLM/specs/architecture/`, returns recommendations to Primary

### Coder Agent (`.claude/agents/coder.md`)

**Trigger**: `/cc-implement`, feature development

**Capabilities**:
- TDD implementation (Red-Green-Refactor)
- Code generation following specs
- Problem-solving when stuck
- Bug investigation

**Output**: Writes code to project, returns completion status to Primary

### Tester Agent (`.claude/agents/tester.md`)

**Trigger**: `/cc-test`, coverage analysis

**Capabilities**:
- Unit, integration, and E2E test writing
- Coverage analysis and gap identification
- Test failure investigation
- Mocking strategies

**Output**: Writes tests to project, returns coverage report to Primary

### Reviewer Agent (`.claude/agents/reviewer.md`)

**Trigger**: `/cc-review`, pre-commit checks

**Capabilities**:
- Security vulnerability scanning (OWASP Top 10)
- Performance issue detection
- Code quality analysis
- Anti-pattern flagging
- **Design compliance review** (v2.4)

**Output**: Writes to `RLM/progress/reviews/`, returns severity summary to Primary

### Designer Agent (`.claude/agents/designer.md`) - v2.4

**Trigger**: `/cc-design system`, `/cc-design research`, `/cc-design component`, `/cc-design qa`

**Capabilities**:
- **Design System Generation**: Complete design systems with colors, typography, spacing, components
- **UX Research**: Web-based research → personas, journey maps, competitive analysis
- **Component Specifications**: Detailed specs with all 8 states, accessibility, code snippets
- **Feature Design Specs**: User flows, screen layouts, responsive behavior
- **Design Tokens**: Framework-agnostic tokens with exports (Tailwind, MUI, Chakra, Bootstrap, etc.)
- **Design QA**: 117-point checklist with scoring across 7 categories
- **Animation Design**: MINIMAL (CSS), MODERATE (Framer Motion), RICH (GSAP ScrollTrigger)
- **Accessibility Compliance**: WCAG 2.1 AA/AAA, color contrast, keyboard navigation

**Output**: Writes to `RLM/specs/design/`, returns summary to Primary

**Design Philosophy Options**:
| Philosophy | When To Use |
|------------|-------------|
| **CREATIVE** | Consumer apps, marketing sites, brand differentiation |
| **CONSISTENT** | B2B SaaS, enterprise, healthcare, finance, compliance-heavy |

---

## Commands Reference

### Enhanced Workflow Commands (`/cc-*`)

#### `/cc-discover [idea]`

Enhanced discovery with delegated research.

```
/cc-discover Build a habit tracking app with social features
```

What happens:
1. Research sub-agent gathers competitor info, market data
2. Primary agent analyzes and asks you 12 questions (3 rounds)
3. PRD generated with technology recommendations
4. Token usage logged

#### `/cc-architect`

Architecture design with isolated context.

```
/cc-architect
```

What happens:
1. Reads PRD and feature specs
2. Architect sub-agent evaluates technology options
3. Creates architecture overview, tech stack, ADRs
4. Returns recommendations with confidence levels

#### `/cc-create-specs`

Generate technical specs from existing PRD (Path 2 entry point).

```
/cc-create-specs
```

What happens:
1. Reads PRD from `RLM/specs/PRD.md`
2. Architect sub-agent generates architecture decisions
3. Creates feature specs, ADRs, constitution
4. Option to auto-continue to task creation

#### `/cc-create-tasks`

Break feature specs into fine-grained implementation tasks.

```
/cc-create-tasks
```

What happens:
1. Reads all feature specs from `RLM/specs/features/`
2. Analyzes dependencies and sizing
3. Creates task files in `RLM/tasks/active/`
4. Option to auto-continue to implementation

#### `/cc-full [idea]`

Complete automation pipeline: idea → code.

```
/cc-full Build a SaaS dashboard with analytics
```

What happens (automated):
1. **DISCOVER**: Research + PRD generation
2. **SPECS**: Architecture + feature specs
3. **TASKS**: Task breakdown with dependencies
4. **IMPLEMENT**: Parallel sub-agents implement all tasks
5. **REPORT**: Final summary

Three automation levels:
- **AUTO**: Full autonomy, minimal prompts
- **SUPERVISED**: Checkpoints between phases
- **MANUAL**: Approval at every step

#### `/cc-implement [task]`

TDD implementation with code sub-agent.

```
/cc-implement TASK-001    # Single task
/cc-implement all         # All tasks in PARALLEL
/cc-implement resume      # Resume from context bundle
/cc-implement blocked     # Retry blocked tasks
```

What happens:
1. Loads task and feature context (auto-primed)
2. Coder sub-agent implements with TDD
3. Tests written first, then implementation
4. Progress tracked, task moved to completed

**Parallel mode (`all`)**: Spawns up to 5 (configurable) coder sub-agents simultaneously, respecting task dependencies.

#### `/cc-test [scope]`

Testing with dedicated tester agent.

```
/cc-test                     # Run all tests
/cc-test src/components/     # Test specific path
/cc-test coverage            # Analyze coverage
/cc-test fix                 # Fix failing tests
```

#### `/cc-review [scope]`

Code review with reviewer agent.

```
/cc-review                   # Review recent changes
/cc-review staged            # Review staged files
/cc-review branch feature    # Review branch
/cc-review src/api/          # Review specific path
```

#### `/cc-background [task]`

Spawn autonomous background agent.

```
/cc-background implement TASK-001
/cc-background test coverage
/cc-background research authentication
```

Background agent runs independently, writes results to `RLM/progress/background/`.

#### `/cc-tokens`

Display token usage summary (also runs automatically with threshold warnings).

```
/cc-tokens                   # Current session summary
/cc-tokens report            # Generate detailed report
/cc-tokens history           # Show historical trends
/cc-tokens reset             # Reset session counters
```

**Note**: In v2.2, token reporting is automatic. Warnings appear at 50%, 75%, and 90% budget without needing to run this command.

#### `/cc-config [setting] [value]`

Configure workflow settings.

```
/cc-config                        # Show current config
/cc-config parallel_limit 8       # Set concurrent sub-agents (1-10)
/cc-config automation_level auto  # Full autonomy
/cc-config warning_threshold 0.6  # Warn at 60% budget
/cc-config reset                  # Reset to defaults
/cc-config export                 # Export config as JSON
```

### Design Commands (`/cc-design`) - v2.4

#### `/cc-design system`

Generate complete design system from PRD.

```
/cc-design system
```

What happens:
1. Reads PRD for brand personality, target users
2. Designer sub-agent creates design system
3. Generates tokens with framework exports
4. Creates component library specification

#### `/cc-design research`

UX research with web-based discovery.

```
/cc-design research
```

What happens:
1. Performs web research on target users, competitors
2. Creates user personas with Jobs-to-Be-Done
3. Generates journey maps for key user flows
4. Provides competitive design analysis

#### `/cc-design component [name]`

Create detailed component specification.

```
/cc-design component Button
/cc-design component Modal
/cc-design component DataTable
```

What happens:
1. Analyzes component requirements
2. Creates spec with all 8 states
3. Defines accessibility requirements
4. Provides code snippets for selected framework

#### `/cc-design feature [FTR-XXX]`

Create feature-level design specification.

```
/cc-design feature FTR-001
```

What happens:
1. Reads feature spec for requirements
2. Designs user flows and screen layouts
3. Specifies component usage per screen
4. Defines responsive behavior and states

#### `/cc-design qa [scope]`

Run 117-point design QA checklist.

```
/cc-design qa                     # QA entire project
/cc-design qa src/components/     # QA specific path
/cc-design qa feature FTR-001     # QA specific feature
```

What happens:
1. Analyzes UI code against design system
2. Checks 7 categories (Visual, Accessibility, Responsive, Interaction, Performance, Cross-Browser, Design System)
3. Calculates compliance score (≥90% required to pass)
4. Provides specific fix recommendations

#### `/cc-design tokens export [framework]`

Export design tokens for specific framework.

```
/cc-design tokens export tailwind   # Export to tailwind.config.js
/cc-design tokens export mui        # Export to mui-theme.ts
/cc-design tokens export chakra     # Export to chakra-theme.ts
/cc-design tokens export bootstrap  # Export to _variables.scss
/cc-design tokens export antd       # Export to antd-theme.ts
/cc-design tokens export css        # Export to css-variables.css
```

### Context Priming Commands (`/prime-*`)

These commands load minimal context for focused work.

**Note**: In v2.2, context priming is automatic in all `/cc-*` commands. Use `/prime-*` commands only for manual/advanced scenarios.

#### `/prime-feature [FTR-XXX]`

Load context for feature development.

```
/prime-feature FTR-001
```

Loads: Feature spec, constitution, related tasks

#### `/prime-task [TASK-XXX]`

Load context for single task TDD.

```
/prime-task TASK-001
```

Loads: Task file, parent feature, TDD workflow

#### `/prime-bug`

Load bug investigation frameworks.

```
/prime-bug
```

Loads: Problem-solving framework, debugging techniques

#### `/prime-review`

Load review checklists and anti-patterns.

```
/prime-review security
/prime-review performance
/prime-review quality
```

#### `/prime-design [scope]` - v2.4

Load design system context for UI development.

```
/prime-design                          # Load core design system
/prime-design component [name]         # Load specific component spec
/prime-design feature [FTR-XXX]        # Load feature design spec
/prime-design tokens                   # Load design tokens only
/prime-design accessibility            # Load accessibility requirements
```

Loads: Design system, tokens, component states, accessibility standards

---

## Token Usage Tracking (Automatic in v2.2)

### Automatic Threshold Warnings

Token reporting is now automatic. You'll see warnings at configured thresholds:

| Threshold | Default | Action |
|-----------|---------|--------|
| Warning | 50% | Display warning, continue |
| Critical | 75% | Suggest wrapping up current batch |
| Auto-Bundle | 90% | Auto-save context, stop spawning |

**Example warnings**:
```
⚠️ Token Budget: 50% consumed
   • Session tokens: 50,000 / 100,000
   • Sub-agent calls: 8
   • Status: Normal operation

⚠️⚠️ Token Budget: 75% consumed - Consider wrapping up
   • Recommendation: Complete current task batch

🛑 Token Budget: 90% - Auto-saving context bundle
   • Bundle: RLM/progress/bundles/[timestamp]-bundle.json
   • Resume with: /cc-implement resume
```

### Manual Token Checks

Still available via `/cc-tokens`:

```
/cc-tokens
```

Output:
```
## Token Usage Summary

**Session**: abc123
**Duration**: 2 hours, 15 minutes

### Current Totals
| Metric | Value |
|--------|-------|
| Total Tokens | 45,000 |
| Sub-Agent Calls | 12 |
| Avg per Call | 3,750 |

### By Agent Type
| Agent | Tokens | % | Calls |
|-------|--------|---|-------|
| Coder | 20,000 | 44% | 5 |
| Tester | 12,000 | 27% | 4 |
| Research | 8,000 | 18% | 2 |

### Efficiency Metrics
- Delegation Ratio: 75%
- Context Utilization: 15%
- Est. Cost: $0.45
```

### Detailed Reports

```
/cc-tokens report
```

Generates full report at `RLM/progress/token-usage/report-YYYY-MM-DD.md`.

### Configure Thresholds

```
/cc-config warning_threshold 0.4      # Warn earlier at 40%
/cc-config critical_threshold 0.7     # Critical at 70%
/cc-config auto_bundle_threshold 0.85 # Auto-save at 85%
```

---

## Hooks System

### Available Hooks

| Hook | When It Runs | What It Does |
|------|--------------|--------------|
| Pre-commit | Before `git commit` | Runs reviewer agent |
| Post-task | After task completes | Updates progress, moves task |
| On-error | When errors occur | Invokes problem-solving |
| Context-bundle | At checkpoints | Saves session state |
| Token-reporter | After sub-agent calls | Logs token usage |

### Hook Configuration

Hooks are configured in `.claude/hooks.json`:

```json
{
  "hooks": {
    "PreToolUse": ["context-bundle"],
    "PostToolUse": ["post-task", "token-reporter"],
    "Stop": ["context-bundle", "token-reporter"]
  }
}
```

---

## Context Bundles

### What Are Context Bundles?

Context bundles save session state for:
- Session resumption without re-reading everything
- Handoff between sessions
- Recovery from context overflow
- Debugging by reviewing history

### Saving a Bundle

Bundles are auto-saved at checkpoints. Manual save:

```
The context-bundle hook fires automatically.
```

### Resuming from Bundle

```
/cc-implement resume
```

Or use `/prime-*` commands to load specific context.

---

## Best Practices

### When to Use `/cc-*` Commands

**DO use `/cc-*` for**:
- Research-heavy tasks (discovery, competitor analysis)
- Multi-step implementations
- Complex testing scenarios
- Pre-commit reviews
- Long-running background work

**DON'T use `/cc-*` for**:
- Simple file edits
- Quick questions
- Single-line changes
- Tasks under 500 tokens

### Efficient Workflows

1. **Start sessions with priming**: Load only needed context
2. **Batch similar tasks**: Group related sub-agent calls
3. **Check tokens regularly**: Use `/cc-tokens` throughout
4. **Use background agents**: For long-running tasks that don't need interaction
5. **Review before commits**: `/cc-review staged` catches issues early

### Troubleshooting

**Sub-agent not responding?**
- Check if it's still running (background)
- Review error logs at `RLM/progress/logs/errors/`
- Ensure task file exists and is complete

**High token usage?**
- Use `/cc-tokens` to identify heavy agents
- Consider breaking tasks into smaller pieces
- Use priming commands for focused work

**Context overflow?**
- Session bundle auto-saved
- Use `/cc-implement resume` to continue
- Consider spawning background agent

---

## Files Reference

### Directory Structure

```
.claude/
├── agents/              # Sub-agent configurations
│   ├── research.md
│   ├── architect.md
│   ├── designer.md      # v2.4: UI/UX design agent
│   ├── coder.md
│   ├── tester.md
│   └── reviewer.md
├── commands/            # Slash commands
│   ├── cc-discover.md
│   ├── cc-architect.md
│   ├── cc-design.md     # v2.4: Design workflow
│   ├── cc-implement.md
│   ├── cc-test.md
│   ├── cc-review.md
│   ├── cc-background.md
│   ├── cc-tokens.md
│   ├── prime-feature.md
│   ├── prime-bug.md
│   ├── prime-task.md
│   ├── prime-review.md
│   └── prime-design.md  # v2.4: Design context primer
├── hooks/               # Hook handlers
│   ├── pre-commit.md
│   ├── post-task.md
│   ├── on-error.md
│   ├── context-bundle.md
│   └── token-reporter.md
└── hooks.json           # Hook configuration

RLM/
├── prompts/
│   └── CC-ORCHESTRATION.md  # Orchestration protocol
├── specs/
│   └── design/              # v2.4: Design specifications
│       ├── design-system.md # Core design system
│       ├── ux-research.md   # Personas, journey maps
│       ├── tokens/          # Design tokens
│       │   ├── tokens.json  # Source tokens
│       │   └── [exports]    # Framework-specific exports
│       └── components/      # Component specifications
├── templates/               # v2.4: Design templates
│   ├── design-system-template.md
│   ├── ux-research-template.md
│   ├── design-qa-checklist.md
│   ├── design-tokens-template.md
│   ├── component-spec-template.md
│   └── feature-design-spec-template.md
├── progress/
│   ├── token-usage/         # Token logs and reports
│   ├── bundles/             # Context bundles
│   ├── reviews/             # Review results
│   └── background/          # Background agent results
├── agents/
│   └── design-agent.md      # v2.4: Full design agent prompt
└── docs/
    ├── CLAUDE-CODE-GUIDE.md # This guide
    ├── UI-FRAMEWORK-REFERENCE.md  # v2.4: Framework guide
    ├── DESIGN-PATTERNS-LIBRARY.md # v2.4: UI patterns
    └── ACCESSIBILITY-GUIDE.md     # v2.4: WCAG guide
```

---

## Parallel Sub-Agent Spawning (v2.2)

### How It Works

When running `/cc-implement all`, the orchestrator spawns multiple coder sub-agents in parallel:

```
/cc-implement all
│
├─► Analyze dependencies
│   └─► Group tasks into batches
│
├─► BATCH 1 (parallel): 5 coder sub-agents
│   ├─► TASK-001 → SUCCESS
│   ├─► TASK-003 → SUCCESS
│   ├─► TASK-005 → BLOCKED
│   ├─► TASK-007 → SUCCESS
│   └─► TASK-009 → SUCCESS
│
├─► BATCH 2 (parallel): Next wave
│   └─► Tasks whose dependencies are now satisfied
│
└─► Complete when all tasks done
```

### Configuration

```bash
/cc-config parallel_limit 8     # Up to 8 concurrent (max 10)
/cc-config parallel_limit 3     # Conservative setting
```

### Rules

1. **Single message**: All batch spawns in one response
2. **Dependency respect**: Tasks wait for dependencies
3. **Token awareness**: Batch size reduces at 75% budget
4. **Failure isolation**: One failure doesn't stop others

---

## Comparison: Standard vs Enhanced

| Aspect | Standard RLM | Claude Code Enhanced (v2.2) |
|--------|--------------|----------------------|
| Context Usage | Full context per task | Isolated sub-agent contexts |
| Token Efficiency | Baseline | 40-60% reduction |
| Specialization | General prompts | Domain-specific agents |
| Parallel Implementation | Sequential | Up to 10 concurrent |
| Context Priming | Manual | Automatic in commands |
| Token Tracking | Manual | Automatic with warnings |
| Background Work | Not supported | `/cc-background` |
| Session Resume | Read files again | Context bundles |
| Pre-commit Review | Manual | Automated hook |
| Full Automation | N/A | `/cc-full [idea]` |
| Configuration | N/A | `/cc-config` |

---

## Further Reading

- [CC-ORCHESTRATION.md](../prompts/CC-ORCHESTRATION.md) - Full orchestration protocol
- [WHATS-NEW.md](WHATS-NEW.md) - Version changelog
- [START-HERE.md](../START-HERE.md) - RLM overview
