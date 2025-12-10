# Claude Code Enhanced Workflow Guide (v2.7)

This guide covers the Claude Code-specific RLM workflow that leverages sub-agent architecture, prompt patterns, and intelligent context management for efficient software development.

## Overview

The Claude Code enhanced workflow provides:

- **Complete 9-phase pipeline** via `/cc-full [idea]` - from idea to verified code
- **7 specialized sub-agents** - Research, Architect, Designer, Coder, Tester, Reviewer, Verifier
- **Prompt pattern library** - 4 reusable reasoning patterns for structured problem-solving
- **Proactive agent triggers** - Agents activate automatically on relevant requests
- **3-tier context management** - Reduce, Delegate, Manage with smart truncation
- **Real-time progress reporting** with 5-step model and token tracking
- **40-60% context reduction** through sub-agent delegation
- **Behavioral economics integration** - 7 principles for ethical product design
- **Cognitive psychology principles** - 6 laws for UX research
- **Test mode** - Isolated methodology testing via `/cc-test-run`
- **Checkpoint system** for incremental task tracking
- **Debug & reconciliation** for state validation and repair

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
| **Test methodology** | N/A | `/cc-test-run [name]` | - |
| **Debug state** | N/A | `/cc-debug` | - |

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

**Proactive Triggers**: Use when user mentions competitors, market research, "what do others do?", evaluating unfamiliar technologies, or validating business assumptions.

**Capabilities**:
- Web research and documentation fetching
- Competitive analysis with comparison matrices
- Technology trend analysis
- TAM/SAM/SOM estimation

**Output**: Writes to `RLM/specs/research/`, returns 200-word summary to Primary

### Architect Agent (`.claude/agents/architect.md`)

**Proactive Triggers**: Use when user asks "which technology?", designing system integration, evaluating trade-offs, or creating feature specifications that impact architecture.

**Capabilities**:
- Technology stack selection with confidence levels
- Architecture design with diagrams
- ADR (Architecture Decision Record) generation
- Anti-pattern detection
- Applies `decision-matrix` pattern for technology evaluations

**Output**: Writes to `RLM/specs/architecture/`, returns recommendations to Primary

### Designer Agent (`.claude/agents/designer.md`)

**Proactive Triggers**: Use when starting any UI feature implementation, user asks about colors/typography/spacing, creating new components or screens, before implementing user-facing features, or after implementation for design QA.

**Capabilities**:
- **Design System Generation**: Complete design systems with colors, typography, spacing, components
- **UX Research**: Web-based research -> personas, journey maps, competitive analysis
- **Component Specifications**: Detailed specs with all 8 states, accessibility, code snippets
- **Feature Design Specs**: User flows, screen layouts, responsive behavior
- **Design Tokens**: Framework-agnostic tokens with exports (Tailwind, MUI, Chakra, Bootstrap, etc.)
- **Design QA**: 117-point checklist with scoring across 7 categories
- **Behavioral Economics**: 7 principles for ethical product design (v2.7)
- **Animation Design**: MINIMAL (CSS), MODERATE (Framer Motion), RICH (GSAP ScrollTrigger)
- **Accessibility Compliance**: WCAG 2.1 AA/AAA, color contrast, keyboard navigation

**Output**: Writes to `RLM/specs/design/`, returns summary to Primary

### Coder Agent (`.claude/agents/coder.md`)

**Proactive Triggers**: Use when implementing tasks from `RLM/tasks/active/`, user asks to "build/implement/create/code", fixing bugs with known root cause, or refactoring existing code.

**Capabilities**:
- TDD implementation (Red-Green-Refactor)
- Code generation following specs
- Problem-solving when stuck
- Bug investigation with `root-cause-analysis` pattern
- Complex task breakdown with `problem-decomposition` pattern
- **5-Step Progress Reporting**
- **Integrated Review Checklist** per task

**Output**: Writes code to project, returns completion status to Primary

### Tester Agent (`.claude/agents/tester.md`)

**Proactive Triggers**: Use when coverage is below 80%, user reports flaky/failing tests, before merging significant changes, investigating bugs that need reproduction, or after implementation to verify quality.

**Capabilities**:
- Unit, integration, and E2E test writing
- Coverage analysis and gap identification
- Test failure investigation with `root-cause-analysis` pattern
- Mocking strategies

**Output**: Writes tests to project, returns coverage report to Primary

### Reviewer Agent (`.claude/agents/reviewer.md`)

**Proactive Triggers**: Use before any git commit of significant code, when user asks to "review/check/validate", after coder agent completes implementation, when security-sensitive code is modified, or before merging PRs.

**Capabilities**:
- Security vulnerability scanning (OWASP Top 10)
- Performance issue detection
- Code quality analysis
- Anti-pattern flagging
- Design compliance review

**Output**: Writes to `RLM/progress/reviews/`, returns severity summary (Critical > High > Medium > Low) to Primary

### Verifier Agent (`.claude/agents/verifier.md`)

**Proactive Triggers**: Auto-triggered when all tasks for a feature complete, or explicitly via `/cc-verify FTR-XXX`.

**Capabilities**:
- **E2E Test Generation**: Creates Playwright tests from acceptance criteria
- **Functional Testing**: User flows, forms, navigation, data operations
- **Accessibility Testing**: axe-core integration, WCAG 2.1 AA compliance
- **Visual Regression**: Screenshot comparison for UI states and responsive layouts
- **Bug Task Creation**: Auto-creates bug tasks when verification fails

**Output**: Writes to `RLM/progress/verification/`, creates E2E tests in `rlm-app/tests/e2e/features/`

---

## Prompt Pattern Library (v2.7)

Reusable reasoning patterns in `RLM/prompts/patterns/`:

### Root Cause Analysis (`root-cause-analysis.md`)

**Use For**: Bug investigation, test failures, unexpected behavior

**Applied By**: Coder, Tester agents

**Process**:
1. Observe the symptoms
2. Ask "Why?" 5 times
3. Identify root cause
4. Validate with evidence
5. Propose fix with rationale

### Decision Matrix (`decision-matrix.md`)

**Use For**: Technology selection, framework comparison, architectural choices

**Applied By**: Architect agent

**Process**:
1. Define evaluation criteria with weights
2. Score each option (1-5)
3. Calculate weighted scores
4. Document trade-offs
5. Recommend with confidence level

### Comparative Analysis (`comparative-analysis.md`)

**Use For**: Feature comparison, alternative evaluation, competitive analysis

**Applied By**: Architect, Research agents

**Process**:
1. Define comparison dimensions
2. Gather evidence for each option
3. Analyze strengths/weaknesses
4. Synthesize findings
5. Provide recommendation

### Problem Decomposition (`problem-decomposition.md`)

**Use For**: Complex task breakdown, multi-step implementations

**Applied By**: Coder agent

**Process** (7 steps):
1. Clarify the core issue
2. Identify relevant factors
3. Decompose into sub-problems
4. Analyze dependencies
5. Prioritize and sequence
6. Identify risks and mitigations
7. Define checkpoints

---

## Commands Reference

### Full Pipeline Commands

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

#### `/cc-test-run [name]` (v2.7)

Run isolated test projects to validate the RLM methodology.

```bash
/cc-test-run my-test-project                    # Interactive mode
/cc-test-run my-test-project --from-prd path/   # Start from existing PRD
/cc-test-run my-test-project --idea "description" # Provide idea inline
```

What happens:
1. Creates isolated directory: `test_projects/[name]-[timestamp]/`
2. Copies RLM structure (prompts, agents, templates)
3. Runs `/cc-full` in the isolated directory
4. Collects metrics: tokens, time, LOC, test coverage
5. Generates comparison report if multiple instances exist

### Discovery & Specification Commands

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

### Implementation Commands

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

### Quality Commands

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

### Design Commands

#### `/cc-design system`

Generate complete design system from PRD.

```bash
/cc-design system
```

Creates:
- Design tokens (colors, typography, spacing, shadows, etc.)
- Component library specification
- Framework exports (Tailwind, MUI, Chakra, CSS Variables)

#### `/cc-design research`

UX research with web-based discovery.

```bash
/cc-design research
```

Creates:
- User personas with Jobs-to-Be-Done
- Journey maps for key user flows
- Competitive design analysis
- Cognitive psychology principles (v2.7)

#### `/cc-design component [name]`

Create detailed component specification.

```bash
/cc-design component Button
/cc-design component Modal
/cc-design component DataTable
```

Creates spec with:
- All 8 states (Default, Hover, Focus, Active, Disabled, Loading, Error, Empty)
- Accessibility requirements
- Code snippets for selected framework

#### `/cc-design feature [FTR-XXX]`

Create feature-level design specification.

```bash
/cc-design feature FTR-001
```

Creates:
- User flows and screen layouts
- Component usage per screen
- Responsive behavior and states

#### `/cc-design qa [scope]`

Run 117-point design QA checklist.

```bash
/cc-design qa                     # QA entire project
/cc-design qa src/components/     # QA specific path
/cc-design qa feature FTR-001     # QA specific feature
```

Checks 7 categories:
- Visual Consistency (20 points)
- Accessibility (25 points)
- Component States (18 points)
- Responsive Design (18 points)
- Animation/Motion (12 points)
- Error Handling (12 points)
- Performance (12 points)

**Pass criteria**: >=90% overall, no category below 80%, accessibility >=90%

### Utility Commands

#### `/cc-architect`

Architecture design with isolated context.

```bash
/cc-architect
```

Architect sub-agent evaluates technology options and creates:
- Architecture overview
- Tech stack recommendations
- ADRs (Architecture Decision Records)

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

#### `/cc-config [setting] [value]`

Configure workflow settings.

```bash
/cc-config                        # Show current config
/cc-config parallel_limit 8       # Set concurrent sub-agents (1-10)
/cc-config automation_level auto  # Full autonomy
/cc-config reporting.mode both    # realtime + silent logging
/cc-config reset                  # Reset to defaults
```

#### `/cc-debug`

Diagnose and fix state inconsistencies.

```bash
/cc-debug                    # Full diagnostic scan
/cc-debug quick              # Fast scan (common issues)
/cc-debug --auto-fix         # Auto-fix safe issues
/cc-debug context-audit      # Analyze context usage (v2.7)
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

---

## 3-Tier Context Management (v2.7)

### Tier 1: REDUCE (Minimize Context Loaded)

**Goal**: Load only what's needed, avoid context bloat from the start.

| Strategy | Implementation | Token Savings |
|----------|----------------|---------------|
| Selective File Reading | Read specific sections, not entire files | ~30% |
| Minimal MCP Loading | Don't autoload all MCP servers | ~12% |
| Config Files per Task | Use task-specific configs | ~8% |
| Summary Files | Read summaries, not full docs | ~25% |

**File Reading Priority**:
```
ALWAYS LOAD (< 500 tokens):
+-- Current task file (TASK-XXX.md)
+-- Constitution (coding standards)
+-- Active feature spec summary

LOAD IF UI TASK (< 300 tokens):
+-- Design tokens (tokens.json)
+-- Component spec (if exists)

LOAD ON DEMAND (only when needed):
+-- Full PRD (read specific sections)
+-- Architecture docs
+-- Previous session context
```

### Tier 2: DELEGATE (Offload High-Token Work)

**Goal**: Sub-agents handle token-heavy operations without polluting primary context.

| Task Type | Token Cost | Delegate? | Sub-Agent |
|-----------|------------|-----------|-----------|
| Web scraping | 5,000-20,000 | YES | Research |
| Documentation fetching | 3,000-15,000 | YES | Research |
| Full codebase analysis | 10,000-50,000 | YES | Architect |
| Design system creation | 5,000-15,000 | YES | Designer |
| Code implementation | 3,000-10,000 | YES | Coder |
| Test suite generation | 3,000-8,000 | YES | Tester |
| Security scanning | 2,000-5,000 | YES | Reviewer |

**Delegation Protocol**:
1. Primary prepares minimal context payload
2. Sub-agent operates in isolated context
3. Sub-agent writes detailed output to files
4. Sub-agent returns summary (< 300 words) to Primary
5. Primary reads files only if needed for next step

### Tier 3: MANAGE (Persistent State & Recovery)

**Goal**: Handle context overflow gracefully with checkpoints and bundles.

**Token Usage Thresholds**:
| Threshold | Action |
|-----------|--------|
| **50%** | Warning logged, save checkpoint, continue normally |
| **75%** | Save checkpoint, activate smart truncation, suggest wrap-up |
| **90%** | Save full context bundle, complete current task only, force pause |
| **95%** | Emergency bundle save, stop all work, report with resume instructions |

**Smart Truncation Tiers**:

- **Tier 1 (Never truncate)**: Current task spec, constitution, active feature spec, recent errors, key decisions
- **Tier 2 (Summarize if needed)**: Completed task summaries, previous session context, design token details
- **Tier 3 (Truncate first)**: Historical logs, verbose tool outputs, exploration context

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

### 5-Step Progress Model

| Step | Phase | Progress | Description |
|------|-------|----------|-------------|
| 1 | Load specs and context | 0-20% | Reading task, feature, constitution |
| 2 | Write tests (TDD Red) | 20-40% | Writing failing tests |
| 3 | Implement code (TDD Green) | 40-70% | Making tests pass |
| 4 | Run tests and fix | 70-85% | Running full suite, fixing issues |
| 5 | Quality checks and review | 85-100% | Lint, type check, review checklist |

### Token Efficiency Ratings

| Rating | Tokens/Task | Description |
|--------|-------------|-------------|
| Excellent | < 10,000 | Well-defined tasks, minimal iteration |
| Good | 10,000-20,000 | Normal implementation complexity |
| Fair | 20,000-35,000 | Complex tasks or some rework needed |
| Poor | > 35,000 | Consider breaking task into smaller pieces |

---

## Behavioral Economics Integration (v2.7)

Designer agent applies 7 principles from `RLM/templates/behavioral-economics-checklist.md`:

| Principle | Application | Example |
|-----------|-------------|---------|
| **Choice Architecture** | Design defaults to guide optimal choices | Default to recommended plan |
| **Prospect Theory** | Frame messaging as loss/gain | "Don't lose your saved data" |
| **Anchoring** | Strategic pricing presentation | Show crossed-out original price |
| **Social Proof** | Display genuine user activity | "Join 50,000+ teams" |
| **Endowment Effect** | Create ownership through personalization | Name workspace on signup |
| **Scarcity/Urgency** | Use only for genuine constraints | Real countdown timers only |
| **Cognitive Load** | Progressive disclosure | Hide advanced options initially |

**Dark Patterns to Avoid**:
- Fake countdown timers that reset
- False scarcity for digital goods
- Hidden costs revealed at checkout
- Difficult unsubscribe flows
- Confirmshaming ("No, I don't want to save money")
- Misdirection in UI (larger "accept" than "decline")

---

## Cognitive Psychology Principles (v2.7)

UX research template includes these cognitive laws:

| Law | Definition | UX Application |
|-----|------------|----------------|
| **Fitts's Law** | Time to target = f(distance x size) | Min 44x44px targets, near thumb zones |
| **Hick's Law** | Decision time = log2(n+1) choices | Max 7+/-2 choices per screen |
| **Miller's Law** | Working memory holds 7+/-2 items | Group into sections, breadcrumbs |
| **Jakob's Law** | Users prefer familiar patterns | Follow platform conventions |
| **Peak-End Rule** | Judge experience by peaks and endings | Polish onboarding completion |
| **Von Restorff Effect** | Different items are remembered | Visual hierarchy for CTAs |

---

## Configuration Reference

### Full Configuration Schema

```json
{
  "version": "2.7",
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
  "enhancements": {
    "prompt_patterns": {
      "enabled": true,
      "auto_select": true,
      "patterns_path": "RLM/prompts/patterns/"
    },
    "behavioral_economics": {
      "enabled": true,
      "checklist_in_design": true
    },
    "cognitive_psychology": {
      "enabled": true,
      "validate_in_qa": true
    }
  },
  "test_mode": {
    "enabled": false,
    "output_directory": "test_projects/",
    "collect_metrics": true
  },
  "context_management": {
    "auto_checkpoint": {
      "enabled": true,
      "thresholds": [0.5, 0.75, 0.9]
    },
    "smart_truncation": {
      "enabled": true,
      "start_at": 0.75
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
7. **Use prompt patterns**: Reference patterns for structured problem-solving

### Troubleshooting

**Sub-agent not responding?**
- Check if it's still running (background)
- Review error logs at `RLM/progress/logs/errors/`
- Ensure task file exists and is complete

**High token usage?**
- Use `/cc-tokens` to identify heavy agents
- Consider breaking tasks into smaller pieces
- Check token efficiency ratings
- Run `/cc-debug context-audit` for analysis

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
|   +-- cc-test-run.md   # v2.7
|   +-- cc-debug.md
|   +-- [other commands]
+-- hooks/               # Hook handlers
+-- hooks.json           # Hook configuration

RLM/
+-- prompts/
|   +-- CC-ORCHESTRATION.md  # Orchestration protocol
|   +-- patterns/            # v2.7 prompt patterns
|       +-- root-cause-analysis.md
|       +-- decision-matrix.md
|       +-- comparative-analysis.md
|       +-- problem-decomposition.md
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
+-- templates/
|   +-- PRD-template-v2.md              # v2.7 enhanced PRD
|   +-- behavioral-economics-checklist.md # v2.7
|   +-- ux-research-template.md         # With cognitive psychology
+-- docs/
    +-- CLAUDE-CODE-GUIDE.md   # This guide
    +-- WHATS-NEW.md           # Version history
```

---

## Further Reading

- [CC-ORCHESTRATION.md](../prompts/CC-ORCHESTRATION.md) - Full orchestration protocol
- [WHATS-NEW.md](WHATS-NEW.md) - Version changelog
- [START-HERE.md](../START-HERE.md) - RLM overview
- [Behavioral Economics Checklist](../templates/behavioral-economics-checklist.md) - Design principles
- [Prompt Patterns](../prompts/patterns/) - Reasoning patterns library
