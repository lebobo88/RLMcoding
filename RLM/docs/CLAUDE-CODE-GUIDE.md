# Claude Code Enhanced Workflow Guide (v2.6)

This guide covers the Claude Code-specific RLM workflow that leverages sub-agent architecture for context efficiency and task specialization.

## Overview

The Claude Code enhanced workflow adds specialized sub-agents and context management on top of the standard RLM method. It provides:

- **Complete 9-phase pipeline** via `/cc-full [idea]` - from idea to verified code
- **Real-time progress reporting** with 5-step model and token tracking
- **40-60% context reduction** through sub-agent delegation
- **7 specialized agents** - Research, Architect, Designer, Coder, Tester, Reviewer, Verifier
- **Automatic token reporting** with threshold-based warnings (50%, 75%, 90%)
- **Parallel sub-agent spawning** for concurrent task implementation
- **Checkpoint system** for incremental task tracking
- **Debug & reconciliation** for state validation and repair
- **Quality phase** combining Design QA + Code Review + Tests
- **E2E verification** with Playwright, accessibility tests, visual regression
- **Comprehensive UI/UX engineering** with design systems, tokens, and accessibility
- **Auto-detection** of UI vs Non-UI projects

---

## Quick Start

### Choose Your Command Style

| Scenario | Standard RLM | Claude Code Enhanced | Phase |
|----------|--------------|----------------------|-------|
| Full automation (from zero) | N/A | `/cc-full [idea]` | 1-9 |
| Full automation (from PRD) | N/A | `/cc-full --from-prd` | 2-9 |
| Start new project | `/discover [idea]` | `/cc-discover [idea]` | 1 |
| **Design system** | N/A | `/cc-design system` | 2 |
| Start from PRD | `/create-specs` | `/cc-create-specs` | 3 |
| **Feature design** | N/A | `/cc-design feature FTR-XXX` | 4 |
| Create tasks | `/create-tasks` | `/cc-create-tasks` | 5 |
| Implement task | `/implement TASK-XXX` | `/cc-implement TASK-XXX` | 6 |
| Implement all (parallel) | `/implement all` | `/cc-implement all` | 6 |
| **Design QA** | N/A | `/cc-design qa [scope]` | 7 |
| Code review | Manual review | `/cc-review [scope]` | 7 |
| Run tests | Manual test commands | `/cc-test [scope]` | 7 |
| **Verify feature** | N/A | `/cc-verify FTR-XXX` | 8 |
| **Debug state** | N/A | `/cc-debug` | - |
| Design architecture | Read architect agent | `/cc-architect` | - |
| **UX research** | N/A | `/cc-design research` | 2 |
| **Component specs** | N/A | `/cc-design component [name]` | - |
| Configure workflow | N/A | `/cc-config [setting] [value]` | - |

**Rule of Thumb**: Use `/cc-full` for complete projects. Use individual `/cc-*` commands when you need control over specific phases.

### Full Automation Quickstart

```bash
# One command: idea -> verified code (9 phases)
/cc-full Build a habit tracking app with social features

# Start from existing PRD
/cc-full --from-prd

# Or step by step (each phase)
/cc-discover [idea]           # Phase 1: Discovery
/cc-design system             # Phase 2: Design System (auto-skipped if Non-UI)
/cc-create-specs              # Phase 3: Specs
/cc-design feature FTR-001    # Phase 4: Feature Design (each feature)
/cc-create-tasks              # Phase 5: Tasks (with checkpoint tracking)
/cc-implement all             # Phase 6: Parallel implementation
/cc-design qa all             # Phase 7: Quality (Design QA)
/cc-review                    # Phase 7: Quality (Code Review)
/cc-test                      # Phase 7: Quality (Tests)
/cc-verify FTR-001            # Phase 8: Verification (each feature)
```

---

## Architecture

### Primary Agent vs Sub-Agents

```
+-------------------------------------------------------------------------+
|                                 USER                                     |
|                                   |                                      |
|                                   v                                      |
|                         +------------------+                             |
|                         |  PRIMARY AGENT   |                             |
|                         |  (You interact   |                             |
|                         |   with this)     |                             |
|                         +--------+---------+                             |
|                                  |                                       |
|  +--------+--------+--------+----+----+--------+--------+--------+       |
|  v        v        v        v         v        v        v        v       |
| +------+ +------+ +------+ +------+ +------+ +------+ +------+           |
| |Resrch| |Archt | |Designr| |Coder | |Tester| |Review| |Verify|          |
| |Agent | |Agent | |Agent | |Agent | |Agent | |Agent | |Agent |          |
| +--+---+ +--+---+ +--+---+ +--+---+ +--+---+ +--+---+ +--+---+           |
|    | Ph1    | Ph1,3  | Ph2,4,7| Ph6    | Ph7    | Ph7    | Ph8            |
|    +--------+--------+--------+--------+--------+--------+               |
|                                  |                                       |
|                                  v                                       |
|                           [File System]                                  |
|                      Results written to files                            |
+-------------------------------------------------------------------------+
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

### Designer Agent (`.claude/agents/designer.md`)

**Trigger**: `/cc-design system`, `/cc-design research`, `/cc-design component`, `/cc-design qa`

**Capabilities**:
- **Design System Generation**: Complete design systems with colors, typography, spacing, components
- **UX Research**: Web-based research -> personas, journey maps, competitive analysis
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

### Coder Agent (`.claude/agents/coder.md`)

**Trigger**: `/cc-implement`, feature development

**Capabilities**:
- TDD implementation (Red-Green-Refactor)
- Code generation following specs
- Problem-solving when stuck
- Bug investigation
- **5-Step Progress Reporting** (new in v2.6)
- **Integrated Review Checklist** per task

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
- Design compliance review

**Output**: Writes to `RLM/progress/reviews/`, returns severity summary to Primary

### Verifier Agent (`.claude/agents/verifier.md`)

**Trigger**: `/cc-verify FTR-XXX`, auto-triggered when all feature tasks complete

**Capabilities**:
- **E2E Test Generation**: Creates Playwright tests from acceptance criteria
- **Functional Testing**: User flows, forms, navigation, data operations
- **Accessibility Testing**: axe-core integration, WCAG 2.1 AA compliance
- **Visual Regression**: Screenshot comparison for UI states and responsive layouts
- **Bug Task Creation**: Auto-creates bug tasks when verification fails

**Output**: Writes to `RLM/progress/verification/`, creates E2E tests in `rlm-app/tests/e2e/features/`

**Test Types**:
| Type | Tool | Checks |
|------|------|--------|
| Functional | Playwright | User flows, forms, navigation, data |
| Accessibility | axe-core | WCAG 2.1 AA compliance |
| Visual | Screenshots | UI states, responsive layouts |

---

## Commands Reference

### Enhanced Workflow Commands (`/cc-*`)

#### `/cc-full [idea]`

Complete 9-phase automation pipeline: idea -> verified code.

```bash
/cc-full Build a SaaS dashboard with analytics
/cc-full --from-prd                    # Start from Phase 2
```

What happens (automated):
1. **DISCOVER**: Research + PRD generation
2. **DESIGN SYSTEM**: Tokens + component library (if UI)
3. **SPECS**: Architecture + feature specs
4. **FEATURE DESIGN**: UI/UX per feature (if UI)
5. **TASKS**: Task breakdown with checkpoint tracking
6. **IMPLEMENT**: Parallel sub-agents implement all tasks
7. **QUALITY**: Design QA + Code Review + Tests
8. **VERIFY**: E2E tests per feature
9. **REPORT**: Final summary with metrics

Three automation levels:
- **AUTO**: Full autonomy, minimal prompts
- **SUPERVISED**: Checkpoints between phases
- **MANUAL**: Approval at every step

#### `/cc-discover [idea]`

Enhanced discovery with delegated research and auto-detection.

```bash
/cc-discover Build a habit tracking app with social features
```

What happens:
1. Checks for existing research in `RLM/research/project/`
2. Research sub-agent gathers competitor info, market data
3. Primary agent analyzes and asks you 12-18 questions (3-4 rounds)
4. Auto-detects UI vs Non-UI project type
5. PRD generated with technology recommendations
6. Token usage logged

#### `/cc-create-specs`

Generate technical specs from existing PRD (Path 2 entry point).

```bash
/cc-create-specs
```

What happens:
1. Reads PRD from `RLM/specs/PRD.md`
2. Architect sub-agent generates architecture decisions
3. Creates feature specs, ADRs, constitution
4. Option to auto-continue to task creation

#### `/cc-create-tasks`

Break feature specs into fine-grained implementation tasks with checkpoint tracking.

```bash
/cc-create-tasks
```

What happens:
1. Loads checkpoint to detect existing tasks
2. Reads all feature specs from `RLM/specs/features/`
3. Creates tasks for NEW features only (incremental)
4. Determines dependencies and order
5. Updates `checkpoint.json` with new generation
6. Option to auto-continue to implementation

#### `/cc-implement [task]`

TDD implementation with coder sub-agent and real-time progress.

```bash
/cc-implement TASK-001    # Single task
/cc-implement all         # All tasks in PARALLEL
/cc-implement resume      # Resume from checkpoint
/cc-implement blocked     # Retry blocked tasks
```

What happens:
1. Loads task and feature context (auto-primed)
2. Coder sub-agent implements with TDD
3. **5-Step Progress Reporting**:
   - Step 1: Load specs and context (0-20%)
   - Step 2: Write tests - TDD Red (20-40%)
   - Step 3: Implement code - TDD Green (40-70%)
   - Step 4: Run tests and fix (70-85%)
   - Step 5: Quality checks and review (85-100%)
4. **Integrated Review Checklist** at completion
5. Mark task complete, update checkpoint
6. Auto-trigger verification if all feature tasks complete

**Parallel mode (`all`)**: Spawns up to 10 (configurable) coder sub-agents simultaneously, respecting task dependencies.

#### `/cc-test [scope]`

Testing with dedicated tester agent.

```bash
/cc-test                     # Run all tests
/cc-test src/components/     # Test specific path
/cc-test coverage            # Analyze coverage
/cc-test fix                 # Fix failing tests
```

#### `/cc-review [scope]`

Code review with reviewer agent.

```bash
/cc-review                   # Review recent changes
/cc-review staged            # Review staged files
/cc-review branch feature    # Review branch
/cc-review src/api/          # Review specific path
```

#### `/cc-verify FTR-XXX`

E2E verification with verifier agent.

```bash
/cc-verify FTR-001           # Verify specific feature
/cc-verify all               # Verify all pending features
/cc-verify FTR-001 --retry   # Re-verify after bug fixes
```

What happens:
1. Reads feature spec and acceptance criteria
2. Generates Playwright tests from acceptance criteria
3. Runs functional tests
4. Runs accessibility tests (axe-core, WCAG 2.1 AA)
5. Captures screenshots for visual comparison
6. **PASS**: Feature marked as `verified`
7. **FAIL**: Bug tasks created, feature blocked until fixed

**Feature Lifecycle**:
```
in_progress -> verification-pending -> verified
                      |
              verification-failed
                      |
              (fix bugs, retry)
```

#### `/cc-architect`

Architecture design with isolated context.

```bash
/cc-architect
```

What happens:
1. Reads PRD and feature specs
2. Architect sub-agent evaluates technology options
3. Creates architecture overview, tech stack, ADRs
4. Returns recommendations with confidence levels

#### `/cc-background [task]`

Spawn autonomous background agent.

```bash
/cc-background implement TASK-001
/cc-background test coverage
/cc-background research authentication
```

Background agent runs independently, writes results to `RLM/progress/background/`.

#### `/cc-tokens`

Display token usage summary (also runs automatically with threshold warnings).

```bash
/cc-tokens                   # Current session summary
/cc-tokens report            # Generate detailed report
/cc-tokens history           # Show historical trends
/cc-tokens reset             # Reset session counters
```

**Note**: Token reporting is automatic. Warnings appear at 50%, 75%, and 90% budget without needing to run this command.

#### `/cc-config [setting] [value]`

Configure workflow settings.

```bash
/cc-config                        # Show current config
/cc-config parallel_limit 8       # Set concurrent sub-agents (1-10)
/cc-config automation_level auto  # Full autonomy
/cc-config reporting.mode both    # realtime + silent logging
/cc-config reset                  # Reset to defaults
/cc-config export                 # Export config as JSON
```

#### `/cc-debug`

Diagnose and fix state inconsistencies.

```bash
/cc-debug                    # Full diagnostic scan
/cc-debug quick              # Fast scan (common issues)
/cc-debug --auto-fix         # Auto-fix safe issues
```

**Issues Detected**:
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

### Design Commands (`/cc-design`)

#### `/cc-design system`

Generate complete design system from PRD.

```bash
/cc-design system
```

What happens:
1. Reads PRD for brand personality, target users
2. Designer sub-agent creates design system
3. Generates tokens with framework exports
4. Creates component library specification

#### `/cc-design research`

UX research with web-based discovery.

```bash
/cc-design research
```

What happens:
1. Performs web research on target users, competitors
2. Creates user personas with Jobs-to-Be-Done
3. Generates journey maps for key user flows
4. Provides competitive design analysis

#### `/cc-design component [name]`

Create detailed component specification.

```bash
/cc-design component Button
/cc-design component Modal
/cc-design component DataTable
```

What happens:
1. Analyzes component requirements
2. Creates spec with all 8 states
3. Defines accessibility requirements
4. Provides code snippets for selected framework

**8 Required States**: Default, Hover, Focus, Active, Disabled, Loading, Error, Empty

#### `/cc-design feature [FTR-XXX]`

Create feature-level design specification.

```bash
/cc-design feature FTR-001
```

What happens:
1. Reads feature spec for requirements
2. Designs user flows and screen layouts
3. Specifies component usage per screen
4. Defines responsive behavior and states

#### `/cc-design qa [scope]`

Run 117-point design QA checklist.

```bash
/cc-design qa                     # QA entire project
/cc-design qa src/components/     # QA specific path
/cc-design qa feature FTR-001     # QA specific feature
```

What happens:
1. Analyzes UI code against design system
2. Checks 7 categories:
   - Visual Consistency (20 points)
   - Accessibility (25 points)
   - Component States (18 points)
   - Responsive Design (18 points)
   - Animation/Motion (12 points)
   - Error Handling (12 points)
   - Performance (12 points)
3. Calculates compliance score (>=90% required to pass)
4. Provides specific fix recommendations

#### `/cc-design tokens export [framework]`

Export design tokens for specific framework.

```bash
/cc-design tokens export tailwind   # Export to tailwind.config.js
/cc-design tokens export mui        # Export to mui-theme.ts
/cc-design tokens export chakra     # Export to chakra-theme.ts
/cc-design tokens export bootstrap  # Export to _variables.scss
/cc-design tokens export antd       # Export to antd-theme.ts
/cc-design tokens export css        # Export to css-variables.css
```

### Context Priming Commands (`/prime-*`)

These commands load minimal context for focused work.

**Note**: Context priming is automatic in all `/cc-*` commands. Use `/prime-*` commands only for manual/advanced scenarios.

#### `/prime-feature [FTR-XXX]`

Load context for feature development.

```bash
/prime-feature FTR-001
```

Loads: Feature spec, constitution, related tasks

#### `/prime-task [TASK-XXX]`

Load context for single task TDD.

```bash
/prime-task TASK-001
```

Loads: Task file, parent feature, TDD workflow

#### `/prime-bug`

Load bug investigation frameworks.

```bash
/prime-bug
```

Loads: Problem-solving framework, debugging techniques

#### `/prime-review`

Load review checklists and anti-patterns.

```bash
/prime-review security
/prime-review performance
/prime-review quality
```

#### `/prime-design [scope]`

Load design system context for UI development.

```bash
/prime-design                          # Load core design system
/prime-design component [name]         # Load specific component spec
/prime-design feature [FTR-XXX]        # Load feature design spec
/prime-design tokens                   # Load design tokens only
/prime-design accessibility            # Load accessibility requirements
```

Loads: Design system, tokens, component states, accessibility standards

---

## Real-Time Progress Reporting

### Progress Display

During implementation, you'll see live progress updates:

```
+------------------------------------------------------------------+
| TASK-003: Implement user authentication                  [3/8]   |
+------------------------------------------------------------------+

Progress: [========--------] 40% (Step 2/5: Writing tests)

Token Usage This Task:
  Input:  2,450 tokens | Output: 1,230 tokens | Total: 3,680

Session Total: 35,420 / 100,000 tokens (35.4%)

Time: Task: 3m 24s | Session: 18m 45s
+------------------------------------------------------------------+
```

### Task Completion Display

```
+------------------------------------------------------------------+
| TASK-003 COMPLETE                                        [3/8]   |
+------------------------------------------------------------------+

Duration: 8m 32s
Files Created: 2 | Modified: 1
Tests Added: 4 (12 assertions)

Token Usage:
  This Task:  8,450 tokens
  Session:   43,870 tokens (43.9%)

Next: TASK-004 - [Title]
+------------------------------------------------------------------+
```

### 5-Step Progress Model

| Step | Phase | Progress | Description |
|------|-------|----------|-------------|
| 1 | Load specs and context | 0-20% | Reading task, feature, constitution |
| 2 | Write tests (TDD Red) | 20-40% | Writing failing tests |
| 3 | Implement code (TDD Green) | 40-70% | Making tests pass |
| 4 | Run tests and fix | 70-85% | Running full suite, fixing issues |
| 5 | Quality checks and review | 85-100% | Lint, type check, review checklist |

---

## Token Usage Tracking

### Automatic Threshold Warnings

Token reporting is automatic. You'll see warnings at configured thresholds:

| Threshold | Default | Action |
|-----------|---------|--------|
| Warning | 50% | Display warning, save checkpoint, continue |
| Critical | 75% | Save checkpoint, suggest wrapping up |
| Auto-Bundle | 90% | Save checkpoint, complete current task only, pause |

**Example warnings**:
```
Warning: Token Budget: 50% consumed
  - Session tokens: 50,000 / 100,000
  - Sub-agent calls: 8
  - Status: Normal operation

Warning: Token Budget: 75% consumed - Consider wrapping up
  - Recommendation: Complete current task batch

STOP: Token Budget: 90% - Auto-saving context
  - Checkpoint: RLM/progress/bundles/CHK-90-2025-12-09.json
  - Resume with: /cc-implement resume
```

### Token Efficiency Ratings

| Rating | Tokens/Task | Description |
|--------|-------------|-------------|
| Excellent | < 10,000 | Well-defined tasks, minimal iteration |
| Good | 10,000-20,000 | Normal implementation complexity |
| Fair | 20,000-35,000 | Complex tasks or some rework needed |
| Poor | > 35,000 | Consider breaking task into smaller pieces |

### Configure Thresholds

```bash
/cc-config context_management.thresholds.warning 0.4      # Warn at 40%
/cc-config context_management.thresholds.critical 0.7     # Critical at 70%
/cc-config context_management.thresholds.auto_pause 0.85  # Pause at 85%
```

---

## Checkpoint System

### How Checkpoints Work

The checkpoint system tracks task state incrementally:

```json
{
  "version": 2,
  "last_updated": "2025-12-09T14:30:00Z",
  "current_generation": 3,
  "features_processed": ["FTR-001", "FTR-002", "FTR-003"],
  "tasks": {
    "TASK-001": {"generation": 1, "status": "completed"},
    "TASK-002": {"generation": 1, "status": "completed"},
    "TASK-003": {"generation": 2, "status": "in_progress"},
    "TASK-004": {"generation": 2, "status": "pending"},
    "TASK-005": {"generation": 3, "status": "pending"}
  }
}
```

### Key Benefits

- **Incremental**: Only creates tasks for NEW features
- **Safe**: Never overwrites existing tasks
- **Resumable**: Run `/create-tasks` multiple times safely
- **Trackable**: Each generation is numbered

### Resume from Checkpoint

```bash
/cc-implement resume
```

What happens:
1. Reads `RLM/progress/checkpoint.json`
2. Identifies in-progress and pending tasks
3. Resumes from last known state
4. Continues implementation

---

## Context Management

### Context Window Management

RLM automatically manages context at configured thresholds:

| Threshold | Action |
|-----------|--------|
| **50%** | Save checkpoint, log warning, continue |
| **75%** | Save checkpoint, suggest wrapping up current batch |
| **90%** | Save checkpoint, complete current task ONLY, force pause |

### Checkpoint Protocol

At configured thresholds, context is automatically checkpointed:

```json
{
  "checkpoint_id": "CHK-75-2025-12-09-001",
  "threshold": 0.75,
  "timestamp": "2025-12-09T14:30:00Z",
  "context_snapshot": {
    "current_phase": "implementation",
    "current_task": "TASK-005",
    "task_step": 3,
    "completed_tasks": ["TASK-001", "TASK-002", "TASK-003", "TASK-004"],
    "pending_tasks": ["TASK-005", "TASK-006", "TASK-007"],
    "blocked_tasks": [],
    "files_modified": ["src/auth.ts", "src/api/users.ts"],
    "key_decisions": [
      {"topic": "Auth strategy", "decision": "JWT with refresh tokens"}
    ]
  },
  "resume_instructions": "Continue from TASK-005, step 3 (implementing code)"
}
```

### Smart Truncation Protocol

When context exceeds 75%, tiered truncation is applied:

**TIER 1 (Never truncate)**:
- Current task specification
- Constitution (coding standards)
- Active feature spec
- Recent errors/decisions
- Key decisions log

**TIER 2 (Summarize if needed)**:
- Completed task summaries -> "5 tasks completed, all passing"
- Previous session context -> 1-2 sentence summary
- Design tokens -> Keep references, truncate details

**TIER 3 (Truncate first)**:
- Historical logs -> Remove, reference file path
- Verbose tool outputs -> Keep summary only
- Exploration context -> Remove entirely

---

## Parallel Sub-Agent Spawning

### How It Works

When running `/cc-implement all`, the orchestrator spawns multiple coder sub-agents in parallel:

```
/cc-implement all
|
+-> Analyze dependencies
|   +-> Group tasks into batches
|
+-> BATCH 1 (parallel): 5 coder sub-agents
|   +-> TASK-001 -> SUCCESS
|   +-> TASK-003 -> SUCCESS
|   +-> TASK-005 -> BLOCKED
|   +-> TASK-007 -> SUCCESS
|   +-> TASK-009 -> SUCCESS
|
+-> BATCH 2 (parallel): Next wave
|   +-> Tasks whose dependencies are now satisfied
|
+-> Complete when all tasks done
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

## Auto-Detection

### UI vs Non-UI Detection

During discovery, projects are automatically classified:

| Indicator | Points |
|-----------|--------|
| Web app/mobile app/dashboard | +2 |
| User interface/UI/UX mentioned | +1 |
| Visual/design/styling mentioned | +1 |
| API/CLI/backend/service | -2 |
| No frontend mentioned | -1 |

**Classification**:
- Score >= 3: UI project (design phases included)
- Score <= -2: Non-UI project (design phases skipped)
- Score -1 to 2: Ask user for clarification

### Skip Options

Override auto-detection with skip flags:

```bash
/cc-full [idea] --skip-design-research    # Skip UX research phase
/cc-full [idea] --skip-feature-design     # Skip feature design specs
/cc-full [idea] --skip-design-qa          # Skip design QA checks
/cc-full [idea] --skip-verification       # Skip E2E verification
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

## Configuration Reference

### Full Configuration Schema

```json
{
  "version": "2.6",
  "automation_level": "supervised",
  "parallel_limit": 5,
  "reporting": {
    "mode": "both",
    "realtime": {
      "show_token_count": true,
      "show_progress_bar": true,
      "update_frequency": "per_step"
    },
    "logging": {
      "enabled": true,
      "granularity": "detailed"
    }
  },
  "context_management": {
    "thresholds": {
      "warning": 0.50,
      "critical": 0.75,
      "auto_pause": 0.90
    },
    "auto_checkpoint": {
      "enabled": true,
      "on_task_complete": true,
      "on_threshold": true
    }
  },
  "design": {
    "auto_detect": true,
    "philosophy": "CONSISTENT",
    "animation_tier": "MODERATE"
  },
  "verification": {
    "auto_trigger": true,
    "create_bug_tasks": true
  },
  "debug": {
    "auto_fix_safe": false
  }
}
```

### Key Settings

| Setting | Values | Description |
|---------|--------|-------------|
| `automation_level` | auto, supervised, manual | AI autonomy level |
| `parallel_limit` | 1-10 | Concurrent sub-agents |
| `reporting.mode` | realtime, silent, both | Progress display mode |
| `design.auto_detect` | true, false | Auto UI/Non-UI detection |
| `design.philosophy` | CREATIVE, CONSISTENT | Design approach |
| `design.animation_tier` | MINIMAL, MODERATE, RICH | Animation level |
| `verification.auto_trigger` | true, false | Auto-verify on feature complete |
| `debug.auto_fix_safe` | true, false | Allow safe auto-fixes |

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

1. **Let auto-priming work**: Don't manually prime before `/cc-*` commands
2. **Batch similar tasks**: Group related sub-agent calls
3. **Monitor tokens**: Watch automatic warnings
4. **Use background agents**: For long-running tasks that don't need interaction
5. **Review before commits**: `/cc-review staged` catches issues early
6. **Run debug periodically**: `/cc-debug quick` keeps state clean

### Troubleshooting

**Sub-agent not responding?**
- Check if it's still running (background)
- Review error logs at `RLM/progress/logs/errors/`
- Ensure task file exists and is complete

**High token usage?**
- Use `/cc-tokens` to identify heavy agents
- Consider breaking tasks into smaller pieces
- Check token efficiency ratings

**Context overflow?**
- Session bundle auto-saved at 90%
- Use `/cc-implement resume` to continue
- Consider spawning background agent

**State inconsistent?**
- Run `/cc-debug` to diagnose
- Use `/cc-debug --auto-fix` for safe fixes
- Check `checkpoint.json` and `status.json`

---

## Files Reference

### Directory Structure

```
.claude/
+-- agents/              # Sub-agent configurations
|   +-- research.md
|   +-- architect.md
|   +-- designer.md
|   +-- coder.md
|   +-- tester.md
|   +-- reviewer.md
|   +-- verifier.md
+-- commands/            # Slash commands
|   +-- cc-full.md
|   +-- cc-discover.md
|   +-- cc-create-specs.md
|   +-- cc-create-tasks.md
|   +-- cc-implement.md
|   +-- cc-design.md
|   +-- cc-test.md
|   +-- cc-review.md
|   +-- cc-verify.md
|   +-- cc-debug.md
|   +-- cc-tokens.md
|   +-- cc-config.md
|   +-- cc-architect.md
|   +-- cc-background.md
|   +-- prime-*.md
+-- hooks/               # Hook handlers
+-- hooks.json           # Hook configuration

RLM/
+-- prompts/
|   +-- CC-ORCHESTRATION.md  # Orchestration protocol
+-- specs/
|   +-- design/              # Design specifications
|       +-- design-system.md
|       +-- ux-research.md
|       +-- tokens/
|       +-- components/
+-- progress/
|   +-- status.json          # Current state
|   +-- checkpoint.json      # Incremental tracking
|   +-- cc-config.json       # Configuration
|   +-- token-usage/         # Token logs
|   +-- bundles/             # Context bundles
|   +-- reviews/             # Review results
|   +-- verification/        # Verification reports
|   +-- background/          # Background agent results
+-- research/
|   +-- project/             # Auto-detected project research
+-- agents/
|   +-- design-agent.md
+-- docs/
    +-- CLAUDE-CODE-GUIDE.md   # This guide
    +-- UI-FRAMEWORK-REFERENCE.md
    +-- DESIGN-PATTERNS-LIBRARY.md
    +-- ACCESSIBILITY-GUIDE.md
```

---

## Comparison: Standard vs Enhanced

| Aspect | Standard RLM | Claude Code Enhanced |
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
| Debug | N/A | `/cc-debug` |
| Checkpoint | Manual | Automatic |
| Verification | Manual | Auto-trigger on feature complete |

---

## Further Reading

- [CC-ORCHESTRATION.md](../prompts/CC-ORCHESTRATION.md) - Full orchestration protocol
- [WHATS-NEW.md](WHATS-NEW.md) - Version changelog
- [START-HERE.md](../START-HERE.md) - RLM overview
- [USER-GUIDE.md](USER-GUIDE.md) - Complete user guide
- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Command cheat sheet
