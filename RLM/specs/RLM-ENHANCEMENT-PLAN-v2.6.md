# RLM Enhancement Plan v2.6

## Executive Summary

This plan addresses 8 enhancement areas to improve the RLM system's consistency, automation, and reliability across all interfaces (Claude Code, IDE agents, GitHub Copilot).

**Key Goals:**
1. Feature parity across Claude Code, IDE agents, and Copilot (design, review, verify, token tracking)
2. Auto-detected design agent integration for UI projects
3. Real-time + logged token/progress reporting
4. Intelligent context window management with checkpointing
5. Automated modes for standard RLM prompts
6. Integrated review/verify during implementation
7. Incremental feature detection (checkpoint + generation system)
8. Global debug/reconciliation command

---

## Enhancement #1: IDE/Copilot Feature Parity

### Current State
- Claude Code (CC) has 9-phase pipeline with 7 sub-agents
- Copilot templates only cover ~25% (basic implementation)
- IDE agents (Cursor, Windsurf, etc.) have no RLM integration
- Missing: design workflow, review phase, verify phase, token tracking

### Target State
Core workflow parity with token tracking:
- Design agent integration (system + feature design + QA)
- Review phase before commits
- Verify phase after feature completion
- Token usage tracking and reporting

### Implementation

#### 1.1 Enhanced Copilot Prompts

**New prompt files to create in `RLM/templates/copilot/prompts/`:**

| File | Purpose |
|------|---------|
| `rlm-design-system.prompt.md` | Generate design system from PRD |
| `rlm-design-feature.prompt.md` | Create feature-level design specs |
| `rlm-design-qa.prompt.md` | Run 117-point design QA checklist |
| `rlm-review.prompt.md` | Code review with design compliance |
| `rlm-verify.prompt.md` | Feature verification with E2E tests |
| `rlm-full-auto.prompt.md` | Full automated pipeline |
| `rlm-tokens.prompt.md` | Token usage reporting |

**New agent files to create in `RLM/templates/copilot/agents/`:**

| File | Purpose |
|------|---------|
| `rlm-designer.agent.md` | Design system and UI/UX specialist |
| `rlm-verifier.agent.md` | E2E testing and verification |

#### 1.2 Enhanced GitHub Actions Workflows

**New/updated workflow files in `RLM/templates/copilot/workflows/`:**

```yaml
# rlm-full-pipeline.yml
# Orchestrates complete RLM workflow via GitHub Actions
name: RLM Full Pipeline

on:
  workflow_dispatch:
    inputs:
      start_phase:
        description: 'Starting phase (1-9)'
        default: '1'
      automation_level:
        description: 'auto|supervised'
        default: 'supervised'
      skip_design:
        description: 'Skip design phases'
        type: boolean
        default: false

jobs:
  discover:
    if: inputs.start_phase <= 1
    # ... discovery job

  design-system:
    if: inputs.start_phase <= 2 && !inputs.skip_design
    needs: discover
    # ... design system job

  # ... remaining phases
```

```yaml
# rlm-token-tracker.yml
# Track token usage across Copilot sessions
name: RLM Token Tracker

on:
  workflow_run:
    workflows: ["*"]
    types: [completed]

jobs:
  track-tokens:
    runs-on: ubuntu-latest
    steps:
      - name: Extract token usage from logs
        # Parse Copilot API responses for token counts
      - name: Update token log
        # Append to RLM/progress/token-usage/
      - name: Check thresholds
        # Warn if approaching limits
```

#### 1.3 IDE Agent Templates

**New directory: `RLM/templates/ide-agents/`**

```
RLM/templates/ide-agents/
├── cursor/
│   ├── .cursorrules.template      # Cursor-specific rules
│   └── prompts/                   # Cursor prompt library
├── windsurf/
│   ├── .windsurfrules.template    # Windsurf-specific rules
│   └── prompts/
├── continue/
│   ├── config.json.template       # Continue.dev config
│   └── prompts/
└── shared/
    ├── rlm-core-instructions.md   # Shared RLM instructions
    ├── design-integration.md      # Design workflow for IDEs
    ├── review-verify.md           # Review/verify integration
    └── token-tracking.md          # Token tracking approach
```

**Shared core instructions include:**
- Full 9-phase workflow reference
- Design system integration
- TDD methodology
- Review/verify requirements
- Token awareness instructions

#### 1.4 Token Tracking for Non-CC Methods

**Approach:** Since IDE agents and Copilot don't expose token counts directly, we use:

1. **Estimation model** based on character/word counts:
   ```json
   {
     "estimation": {
       "chars_per_token": 4,
       "overhead_multiplier": 1.15
     }
   }
   ```

2. **Session logging** in `RLM/progress/token-usage/`:
   ```json
   {
     "session": "IDE-2024-12-09",
     "method": "cursor",
     "estimated_tokens": {
       "input": 15000,
       "output": 8000,
       "total": 23000
     },
     "confidence": "estimated"
   }
   ```

3. **Manual token entry** prompt at session end for IDE agents

---

## Enhancement #2: Auto-Detected Design Agent Integration

### Current State
- Design agent only used with CC enhanced commands
- Standard RLM prompts skip design entirely
- No automatic detection of project type

### Target State
- Auto-detect if project needs design (UI vs backend)
- Integrate design into all methods when applicable
- Skip design for CLI tools, pure APIs, libraries

### Implementation

#### 2.1 Project Type Detection

**Add to constitution.md template:**
```markdown
## Project Classification

### UI Classification: [AUTO-DETECTED]
- **HAS_UI**: true/false
- **UI_TYPE**: web|mobile|desktop|cli|api|library
- **DESIGN_REQUIRED**: true/false (derived)

### Detection Criteria:
- HAS_UI = true if:
  - PRD mentions "user interface", "screens", "pages", "components"
  - Tech stack includes: React, Vue, Angular, Svelte, Next.js, mobile frameworks
  - Features reference visual elements, forms, dashboards
- DESIGN_REQUIRED = HAS_UI && UI_TYPE in [web, mobile, desktop]
```

**Detection logic in `RLM/prompts/00-DETECT-PROJECT-TYPE.md`:**
```markdown
# Project Type Detection

## Scan PRD for indicators:

### UI Indicators (score +1 each):
- [ ] "user interface" or "UI" mentioned
- [ ] "screen", "page", "view" mentioned
- [ ] "button", "form", "input" mentioned
- [ ] "dashboard", "layout", "navigation" mentioned
- [ ] React/Vue/Angular/Next.js in tech stack
- [ ] "responsive", "mobile", "tablet" mentioned
- [ ] "design", "styling", "theme" mentioned

### Non-UI Indicators (score -1 each):
- [ ] "CLI", "command line" mentioned
- [ ] "API only", "headless" mentioned
- [ ] "library", "package", "SDK" mentioned
- [ ] "backend", "server-side only" mentioned
- [ ] No frontend framework in tech stack

### Classification:
- Score >= 3: DESIGN_REQUIRED = true
- Score <= -2: DESIGN_REQUIRED = false
- Otherwise: ASK user
```

#### 2.2 Conditional Design Phases

**Update all standard prompts (01-08) with conditional design:**

```markdown
## Design Integration (Conditional)

{{IF DESIGN_REQUIRED}}
### Before Implementation:
1. Ensure design system exists: `RLM/specs/design/design-system.md`
2. Ensure feature design exists: `RLM/specs/features/FTR-XXX/design-spec.md`
3. Load design tokens before coding

### During Implementation:
- Use design tokens (never hardcode colors, spacing, typography)
- Implement all 8 component states
- Ensure WCAG 2.1 AA compliance
- Respect animation tier settings

### After Implementation:
- Run design QA checklist (117-point)
- Verify accessibility with automated tools
{{ENDIF}}
```

#### 2.3 Design Skip Flag

**Add to cc-config.json:**
```json
{
  "design": {
    "auto_detect": true,
    "force_enabled": false,
    "force_disabled": false
  }
}
```

**Override via command:**
```bash
/cc-config design.force_disabled true  # Skip design even if detected
/cc-config design.force_enabled true   # Force design even for CLI
```

---

## Enhancement #3: Implementation Agent Token/Progress Reporting

### Current State
- Token logging infrastructure exists but not active
- Progress updates only at task completion
- No real-time visibility during implementation

### Target State
- Configurable: real-time output OR silent logging
- Progress updates during task execution
- Summary at session end

### Implementation

#### 3.1 Configurable Reporting Mode

**Add to cc-config.json:**
```json
{
  "reporting": {
    "mode": "both",  // "realtime" | "silent" | "both"
    "realtime": {
      "show_token_count": true,
      "show_progress_bar": true,
      "update_frequency": "per_step"  // "per_step" | "per_task" | "per_batch"
    },
    "logging": {
      "enabled": true,
      "granularity": "detailed"  // "summary" | "detailed"
    }
  }
}
```

#### 3.2 Real-Time Progress Format

**During implementation, output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TASK-003: Implement user authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: [████████░░░░░░░░░░░░] 40% (Step 2/5: Writing tests)

Token Usage This Task:
  Input:  2,450 tokens
  Output: 1,230 tokens
  Total:  3,680 tokens

Session Total: 15,420 / 100,000 tokens (15.4%)

⏱️  Elapsed: 3m 24s | Est. Remaining: 5m 10s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 3.3 Progress Steps Definition

**Standard 5-step progress per task:**
1. **Loading context** (0-10%)
2. **Writing tests** (10-40%)
3. **Implementing code** (40-70%)
4. **Running tests** (70-85%)
5. **Quality checks** (85-100%)

#### 3.4 Silent Logging Format

**Log to `RLM/progress/token-usage/session-YYYY-MM-DD.json`:**
```json
{
  "session_id": "SESSION-2024-12-09-001",
  "started_at": "2024-12-09T10:00:00Z",
  "entries": [
    {
      "timestamp": "2024-12-09T10:05:00Z",
      "task": "TASK-003",
      "step": "writing_tests",
      "tokens": { "input": 1200, "output": 450 },
      "cumulative": { "input": 5000, "output": 2100 }
    }
  ],
  "summary": {
    "total_tokens": 45000,
    "tasks_completed": 5,
    "avg_tokens_per_task": 9000
  }
}
```

#### 3.5 Update Implementation Agent Prompts

**Add to `04-IMPLEMENT-TASK.md` and `.claude/agents/coder.md`:**

```markdown
## Progress Reporting Protocol

### Real-Time Updates (if enabled):
After each step, output progress indicator:
- Step name and percentage
- Token count for this step
- Cumulative session tokens
- Time elapsed/remaining estimate

### Logging (always):
After each step, append to session log:
- Timestamp
- Task ID and step name
- Token counts (input/output)
- Any errors or warnings

### At Task Completion:
1. Log final task summary
2. Update RLM/progress/status.json
3. Output completion message with metrics
```

---

## Enhancement #4: Intelligent Context Window Management

### Current State
- Basic threshold warnings at 50%, 75%, 90%
- Context bundle save at 90%
- No smart compression or checkpointing

### Target State
- Automatic checkpointing at 50%, 75%, 90%
- Smart prompt truncation for less-relevant context
- Phase-based context reset with file-based state
- All of the above working together

### Implementation

#### 4.1 Automatic Checkpointing

**Checkpoint structure in `RLM/progress/bundles/`:**
```json
{
  "checkpoint_id": "CHK-50-2024-12-09-001",
  "threshold": 0.5,
  "timestamp": "2024-12-09T12:30:00Z",
  "context_snapshot": {
    "current_phase": "implementation",
    "current_task": "TASK-005",
    "completed_tasks": ["TASK-001", "TASK-002", "TASK-003", "TASK-004"],
    "pending_tasks": ["TASK-005", "TASK-006", "TASK-007"],
    "files_modified": ["src/auth.ts", "src/api/users.ts"],
    "key_decisions": [
      {"topic": "Auth strategy", "decision": "JWT with refresh tokens"}
    ]
  },
  "resume_instructions": "Continue from TASK-005, step 2 (implementing code)"
}
```

**Checkpoint triggers:**
| Threshold | Action |
|-----------|--------|
| 50% | Save checkpoint, log warning, continue |
| 75% | Save checkpoint, alert user, suggest wrapping current task |
| 90% | Save checkpoint, complete current task only, pause for resume |

#### 4.2 Smart Prompt Truncation

**Context priority tiers:**
```
TIER 1 (Never truncate):
- Current task specification
- Constitution (coding standards)
- Active feature spec
- Recent errors/decisions

TIER 2 (Summarize if needed):
- Completed task summaries
- Previous session context
- Design tokens (keep references, truncate details)

TIER 3 (Truncate first):
- Historical logs
- Verbose tool outputs
- Exploration context from earlier phases
```

**Truncation algorithm:**
```
1. Calculate current context size
2. If > 75% capacity:
   a. Summarize TIER 3 content (replace with 1-2 line summaries)
   b. Store full content in RLM/progress/context-archive/
3. If still > 85% capacity:
   a. Summarize TIER 2 content
   b. Keep only references to design tokens
4. If still > 95% capacity:
   a. Force checkpoint save
   b. Reset context with essential TIER 1 only
   c. Prompt for resume
```

#### 4.3 Phase-Based Context Reset

**Between major phases, optionally reset context:**

```markdown
## Phase Transition Protocol

When transitioning between phases (e.g., Specs → Tasks → Implement):

1. **Save Phase Summary**
   - Write phase output to files
   - Log key decisions
   - Update progress/status.json

2. **Context Reset Option**
   At >60% context usage, offer:
   > "Context is at 65%. Would you like to:
   > 1. Continue with current context
   > 2. Reset context for next phase (recommended)
   > 3. Save checkpoint and pause"

3. **Clean Phase Start**
   If reset chosen:
   - Save full context to bundle
   - Start fresh with:
     - Constitution
     - Current phase prompt
     - Phase-specific inputs (from files)
   - Reference previous phase outputs via file reads
```

#### 4.4 Context Management Configuration

**Add to cc-config.json:**
```json
{
  "context_management": {
    "auto_checkpoint": {
      "enabled": true,
      "thresholds": [0.5, 0.75, 0.9]
    },
    "smart_truncation": {
      "enabled": true,
      "start_at": 0.75,
      "preserve_tiers": [1]
    },
    "phase_reset": {
      "enabled": true,
      "suggest_at": 0.6,
      "force_at": 0.85
    }
  }
}
```

---

## Enhancement #5: Automated Modes for Non-CC Methods

### Current State
- Standard RLM prompts (01-08) require manual invocation
- No orchestration layer for standard prompts
- Only CC enhanced commands have `/cc-full` automation

### Target State
- Add `/rlm-full` command for standard prompts
- Automated mode option in all standard prompts
- Same AUTO/SUPERVISED/MANUAL levels as CC

### Implementation

#### 5.1 New Orchestration Prompt

**Create `RLM/prompts/00-FULL-PIPELINE.md`:**
```markdown
# RLM Full Pipeline Orchestration

## Purpose
Execute complete RLM workflow from discovery to implementation using standard prompts.

## Automation Levels

### AUTO Mode
- Execute all phases without stopping
- Only pause for: blockers, ambiguous requirements, errors
- Generate comprehensive report at end

### SUPERVISED Mode
- Pause between each phase for approval
- Show phase summary before proceeding
- Allow skip, modify, or continue options

### MANUAL Mode
- Pause at every decision point
- Explain reasoning before each action
- Wait for explicit approval

## Pipeline Execution

### Phase 1: Project Detection
Execute: `00-DETECT-PROJECT-TYPE.md`
- Determine DESIGN_REQUIRED
- Classify project type

### Phase 2: Discovery
Execute: `01-DISCOVER.md`
- Gather requirements
- Generate PRD.md
- Generate constitution.md

### Phase 3: Design System (if DESIGN_REQUIRED)
Execute: Design system generation
- Create design-system.md
- Generate design tokens

### Phase 4: Specifications
Execute: `02-CREATE-SPECS.md`
- Feature specifications
- Architecture decisions

### Phase 5: Feature Design (if DESIGN_REQUIRED)
For each feature:
- Create feature design spec
- Define component specifications

### Phase 6: Tasks
Execute: `03-CREATE-TASKS.md`
- Break features into tasks
- Set dependencies

### Phase 7: Implementation
Execute: `05-IMPLEMENT-ALL.md`
- Implement all tasks with TDD
- Integrate review/verify per task

### Phase 8: Quality
- Design QA (if DESIGN_REQUIRED)
- Code review
- Test coverage

### Phase 9: Verification
For each feature:
- Run E2E tests
- Verify acceptance criteria

### Phase 10: Report
Generate final summary report
```

#### 5.2 Update Standard Prompts

**Add automation header to each prompt (01-08):**

```markdown
## Automation Mode

This prompt supports three automation levels:

- **AUTO**: Execute without stopping (log all decisions)
- **SUPERVISED**: Pause at checkpoints for approval
- **MANUAL**: Pause before every action

If running as part of `/rlm-full`, inherit the pipeline's automation level.
If running standalone, ask user for preferred level.

### Checkpoint Behavior

| Prompt | AUTO Checkpoints | SUPERVISED Checkpoints |
|--------|------------------|------------------------|
| 01-DISCOVER | End of each round | After each question |
| 02-CREATE-SPECS | Per feature spec | Per spec section |
| 03-CREATE-TASKS | Per feature | Per task created |
| 04-IMPLEMENT | Per TDD cycle | Per step |
| 05-IMPLEMENT-ALL | Per task | Per task |
```

#### 5.3 Slash Command for Standard Pipeline

**Create `.claude/commands/rlm-full.md`:**
```markdown
# /rlm-full - Complete RLM Pipeline (Standard Prompts)

Execute the full RLM workflow using standard prompts.

## Usage
```
/rlm-full [idea]              # Start from scratch
/rlm-full --from-prd          # Start from existing PRD
/rlm-full resume              # Resume from checkpoint
/rlm-full --auto              # Force AUTO mode
/rlm-full --supervised        # Force SUPERVISED mode
```

## Execution
Read and execute `RLM/prompts/00-FULL-PIPELINE.md`
```

---

## Enhancement #6: Integrated Review/Verify in Implementation

### Current State
- Review and verify are separate phases (Phase 7-8)
- Only triggered manually or after ALL tasks complete
- Not integrated into task-level workflow

### Target State
- Review after each task completion
- Verify after each feature completion (all its tasks done)
- Automatic triggering, no manual intervention needed

### Implementation

#### 6.1 Post-Task Review Integration

**Update `04-IMPLEMENT-TASK.md` Phase 5 (Quality Checks):**

```markdown
## Phase 5: Quality Checks (Enhanced)

After implementation complete:

### 5.1 Automated Checks
- [ ] All tests pass
- [ ] Linting clean
- [ ] Type checking passes
- [ ] No security vulnerabilities

### 5.2 Design Compliance (if DESIGN_REQUIRED)
- [ ] Design tokens used (no hardcoded values)
- [ ] All 8 component states implemented
- [ ] ARIA attributes present
- [ ] Keyboard navigation works
- [ ] Responsive at all breakpoints

### 5.3 Quick Review Checklist
Before marking task complete, verify:
- [ ] Code follows constitution patterns
- [ ] Error handling is appropriate
- [ ] No obvious security issues
- [ ] Tests cover happy path + edge cases

### 5.4 Review Gate
**AUTO mode**: Log checklist results, continue if all pass
**SUPERVISED mode**: Show checklist, ask for approval
**MANUAL mode**: Walk through each item

If any critical issues found:
- Fix before completing task
- Log issues that were fixed
```

#### 6.2 Post-Feature Verification

**Update `04-IMPLEMENT-TASK.md` Phase 6 (Complete Task):**

```markdown
## Phase 6: Complete Task (Enhanced)

### 6.1 Standard Completion
- Move task to completed/
- Update progress/status.json
- Log completion metrics

### 6.2 Feature Completion Check
After moving task, check:
- List all tasks for parent feature (FTR-XXX)
- Count completed vs total
- If all tasks complete → trigger verification

### 6.3 Automatic Feature Verification
When last task of a feature completes:

1. **Update feature status**
   ```json
   { "FTR-XXX": { "status": "verification-pending" } }
   ```

2. **Run verification suite**
   - Generate E2E tests from acceptance criteria
   - Run functional tests (Playwright)
   - Run accessibility tests (axe-core)
   - Run visual regression (if configured)

3. **Handle results**
   - **PASS**: Mark feature as "verified"
   - **FAIL**:
     - Create bug tasks (TASK-XXX-BUG-001)
     - Mark feature as "verification-failed"
     - Continue with other features

4. **Report**
   ```
   ✅ Feature FTR-001 VERIFIED
      - Functional tests: 12/12 passed
      - Accessibility: 100% compliant
      - Visual regression: No changes detected
   ```
   OR
   ```
   ❌ Feature FTR-001 VERIFICATION FAILED
      - Functional tests: 10/12 passed (2 failures)
      - Created bug tasks: TASK-003-BUG-001, TASK-003-BUG-002
      - Feature blocked until bugs resolved
   ```
```

#### 6.3 Integrate into All Methods

**Add verification to Copilot prompts:**

Update `RLM/templates/copilot/prompts/rlm-implement.prompt.md`:
```markdown
## Post-Implementation Verification

After implementing a task:

1. Run quick review checklist
2. Check if this completes the parent feature
3. If feature complete, run verification:
   - Execute E2E tests
   - Check accessibility
   - Report results

Include verification results in PR description.
```

**Add to IDE agent instructions:**

Update `RLM/templates/ide-agents/shared/review-verify.md`:
```markdown
## Integrated Review & Verify

### After Every Task:
1. Self-review against checklist
2. Run automated tests
3. Fix any issues before committing

### After Feature Completion:
1. Run full E2E test suite for feature
2. Verify all acceptance criteria
3. Report verification status

This is NOT optional - every task gets reviewed, every feature gets verified.
```

---

## Enhancement #7: Incremental Feature Detection

### Current State
- `/create-tasks` regenerates all tasks
- No way to detect new vs existing features
- Risk of overwriting completed work

### Target State
- Checkpoint system tracks what exists
- Generation field marks task batches
- New features detected by comparing PRD to checkpoint
- Old task files never overwritten

### Implementation

#### 7.1 Checkpoint File Structure

**Create `RLM/progress/checkpoint.json`:**
```json
{
  "version": "1.0",
  "project_id": "my-app",
  "checkpoints": [
    {
      "id": "CHK-001",
      "timestamp": "2024-11-27T10:00:00Z",
      "phase": "initial",
      "trigger": "create-tasks",
      "prd_hash": "abc123...",
      "features": {
        "FTR-001": { "status": "created", "task_count": 3 },
        "FTR-002": { "status": "created", "task_count": 4 }
      },
      "tasks": {
        "TASK-001": { "feature": "FTR-001", "generation": 1 },
        "TASK-002": { "feature": "FTR-001", "generation": 1 },
        "TASK-003": { "feature": "FTR-001", "generation": 1 },
        "TASK-004": { "feature": "FTR-002", "generation": 1 },
        "TASK-005": { "feature": "FTR-002", "generation": 1 },
        "TASK-006": { "feature": "FTR-002", "generation": 1 },
        "TASK-007": { "feature": "FTR-002", "generation": 1 }
      }
    },
    {
      "id": "CHK-002",
      "timestamp": "2024-12-09T15:00:00Z",
      "phase": "increment",
      "trigger": "create-tasks",
      "prd_hash": "def456...",
      "features": {
        "FTR-003": { "status": "created", "task_count": 2 }
      },
      "tasks": {
        "TASK-008": { "feature": "FTR-003", "generation": 2 },
        "TASK-009": { "feature": "FTR-003", "generation": 2 }
      },
      "note": "Added FTR-003 (user settings feature)"
    }
  ],
  "current_generation": 2,
  "all_features": ["FTR-001", "FTR-002", "FTR-003"],
  "all_tasks": ["TASK-001", "TASK-002", "TASK-003", "TASK-004", "TASK-005", "TASK-006", "TASK-007", "TASK-008", "TASK-009"]
}
```

#### 7.2 Generation Field in Task Files

**Task file header update:**
```markdown
# TASK-008: Implement user settings page

## Metadata
- **ID**: TASK-008
- **Feature**: FTR-003
- **Generation**: 2
- **Created**: 2024-12-09
- **Checkpoint**: CHK-002
- **Priority**: P1
- **Estimate**: 2h

## Description
...
```

#### 7.3 Smart Create-Tasks Logic

**Update `03-CREATE-TASKS.md`:**

```markdown
## Pre-Creation Analysis

### Step 1: Load Checkpoint
Read `RLM/progress/checkpoint.json`
- Get list of existing features
- Get list of existing tasks
- Note current generation number

### Step 2: Compare PRD to Checkpoint
Scan PRD for features:
- Parse all FTR-XXX references
- Compare to checkpoint.all_features
- Identify NEW features (in PRD but not checkpoint)
- Identify REMOVED features (in checkpoint but not PRD) - flag for review

### Step 3: Handle Detection Results

**If no new features:**
```
No new features detected in PRD.

Current features: FTR-001, FTR-002, FTR-003
Current tasks: 9 (7 completed, 2 pending)

Options:
1. Re-run task creation for a specific feature (will create new tasks)
2. Add tasks to an existing feature
3. Exit without changes
```

**If new features found:**
```
New features detected:

NEW:
- FTR-004: Payment integration
- FTR-005: Email notifications

EXISTING (will not be modified):
- FTR-001: User authentication (3 tasks, 3 completed)
- FTR-002: Dashboard (4 tasks, 2 completed)
- FTR-003: Settings (2 tasks, 0 completed)

Proceed with task creation for FTR-004 and FTR-005? (yes/no)
```

### Step 4: Create Tasks for New Features Only
- Increment generation: current_generation + 1
- Create tasks with new generation number
- Use next available TASK-XXX numbers
- Update checkpoint.json with new checkpoint entry

### Step 5: Never Overwrite
- NEVER modify files in tasks/active/ or tasks/completed/
- NEVER re-create tasks that already exist
- Only ADD new tasks
- Log what was added vs skipped
```

#### 7.4 Generation-Based Commands

**Add commands for generation filtering:**

```markdown
## Generation Commands

/implement --generation=2         # Only implement generation 2 tasks
/implement --since=CHK-001        # Implement tasks since checkpoint
/tasks --generation=2             # List only generation 2 tasks
/tasks --new                      # List tasks from latest generation
```

#### 7.5 Rollback Capability

**Add rollback for mistaken task creation:**
```markdown
## Rollback a Checkpoint

/rlm-rollback CHK-002

This will:
1. Move tasks from generation 2 to RLM/tasks/archive/
2. Remove CHK-002 from checkpoint.json
3. Update generation counter
4. Log the rollback

Note: Only rolls back task FILES, not any implementation done.
```

---

## Enhancement #8: Global Debug/Reconciliation Command

### Current State
- No way to detect inconsistencies
- Manual inspection required
- Easy for state to drift

### Target State
- Single command scans entire RLM state
- Detects all inconsistencies
- Interactive reconciliation with user approval
- Auto-fix safe issues with confirmation

### Implementation

#### 8.1 Command Definition

**Create `.claude/commands/cc-debug.md`:**
```markdown
# /cc-debug - RLM State Reconciliation

Scan RLM project state and reconcile inconsistencies.

## Usage
```
/cc-debug                  # Full scan with interactive reconciliation
/cc-debug --report-only    # Just report issues, no fixes
/cc-debug --auto-fix       # Fix safe issues without prompting
/cc-debug --scope=tasks    # Only check tasks
/cc-debug --scope=progress # Only check progress files
```

## Execution
Read and execute the debug protocol below.
```

#### 8.2 Debug Protocol

**Create `RLM/prompts/99-DEBUG-RECONCILE.md`:**

```markdown
# RLM Debug & Reconciliation Protocol

## Phase 1: Scan All State

### 1.1 File System Scan
```
Scan directories:
- RLM/specs/
- RLM/specs/features/
- RLM/specs/design/
- RLM/tasks/active/
- RLM/tasks/completed/
- RLM/tasks/blocked/
- RLM/progress/
```

Collect:
- All feature IDs (FTR-XXX)
- All task IDs (TASK-XXX)
- All checkpoint data
- All progress files

### 1.2 Cross-Reference Analysis

| Check | Source A | Source B | Issue Type |
|-------|----------|----------|------------|
| Task in status.json | status.json | tasks/*/TASK-XXX.md | ORPHAN_STATUS |
| Task file exists | tasks/*/TASK-XXX.md | status.json | ORPHAN_FILE |
| Task in checkpoint | checkpoint.json | tasks/*/TASK-XXX.md | CHECKPOINT_MISMATCH |
| Feature in PRD | PRD.md | specs/features/FTR-XXX/ | MISSING_SPEC |
| Task references feature | TASK-XXX.md | specs/features/FTR-XXX/ | INVALID_REFERENCE |
| Completed task in active | tasks/active/ | status.json shows completed | WRONG_FOLDER |
| Status.json valid JSON | - | - | CORRUPT_FILE |

## Phase 2: Generate Report

```markdown
# RLM State Report
Generated: [timestamp]

## Summary
- Total Issues: X
- Critical: X
- Warning: X
- Info: X

## Critical Issues (Must Fix)

### 1. [WRONG_FOLDER] Task in wrong directory
- **Task**: TASK-003
- **Issue**: Status shows "completed" but file is in tasks/active/
- **Fix**: Move to tasks/completed/
- **Safe to auto-fix**: YES

### 2. [ORPHAN_STATUS] Status entry without file
- **Task**: TASK-007
- **Issue**: Referenced in status.json but no file exists
- **Fix**: Remove from status.json OR create task file
- **Safe to auto-fix**: NO (need user decision)

## Warnings

### 1. [CHECKPOINT_MISMATCH] Task not in checkpoint
- **Task**: TASK-010
- **Issue**: File exists but not recorded in checkpoint.json
- **Fix**: Add to checkpoint with generation=unknown
- **Safe to auto-fix**: YES (with user confirmation)

## Info

### 1. [STALE_LOG] Old session log
- **File**: RLM/progress/logs/SESSION-2024-01-01.md
- **Issue**: Log file older than 30 days
- **Suggestion**: Archive or delete
```

## Phase 3: Interactive Reconciliation

For each issue, prompt user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Issue 1 of 5: [WRONG_FOLDER] Task in wrong directory
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: TASK-003 - Implement login form
Current location: RLM/tasks/active/TASK-003.md
Status in status.json: completed

This task is marked complete but still in the active folder.

Recommended action: Move to tasks/completed/

Options:
  [1] Apply fix (move to completed/)
  [2] Skip (leave as-is)
  [3] Mark as pending (update status.json instead)
  [4] View task file
  [5] Skip all similar issues

Choice:
```

## Phase 4: Apply Fixes

For approved fixes:
1. Create backup of affected files
2. Apply fix
3. Log fix to `RLM/progress/logs/reconciliation-[timestamp].md`
4. Update affected JSON files
5. Verify fix was successful

## Phase 5: Final Report

```markdown
# Reconciliation Complete

## Actions Taken
- Moved 2 tasks to correct folders
- Updated status.json (3 entries)
- Added 1 task to checkpoint.json
- Removed 1 orphan status entry

## Skipped (User Choice)
- TASK-007: User chose to create task file manually

## Backup Location
RLM/progress/backups/reconcile-2024-12-09/

## Verification
- status.json: Valid ✓
- checkpoint.json: Valid ✓
- Task files: All accounted for ✓
- Feature specs: All valid references ✓

State is now consistent.
```
```

#### 8.3 Issue Categories

| Category | Severity | Auto-Fix Safe? | Description |
|----------|----------|----------------|-------------|
| WRONG_FOLDER | Critical | Yes | Task file in wrong directory vs status |
| ORPHAN_STATUS | Critical | No | Status entry with no file |
| ORPHAN_FILE | Warning | No | File with no status entry |
| CORRUPT_JSON | Critical | No | Invalid JSON in config files |
| CHECKPOINT_MISMATCH | Warning | Ask | Task not in checkpoint |
| INVALID_REFERENCE | Critical | No | Task references non-existent feature |
| MISSING_SPEC | Warning | No | Feature in PRD but no spec file |
| STALE_LOG | Info | Yes | Old log files |
| DUPLICATE_ID | Critical | No | Same ID used twice |
| MISSING_GENERATION | Warning | Ask | Task without generation field |

#### 8.4 Auto-Fix Rules

**Safe to auto-fix (with confirmation):**
- Move completed task to completed/
- Move active task to active/
- Remove clearly orphaned status entries (no file, no checkpoint)
- Add missing generation field (use "unknown")
- Archive stale logs

**Never auto-fix:**
- Create task files
- Delete task files
- Modify task content
- Change task dependencies
- Modify feature specs

---

## Implementation Priority & Phases

### Phase 1: Core Infrastructure (Implement First)
1. **Enhancement #3**: Token/progress reporting - foundation for visibility
2. **Enhancement #7**: Checkpoint system - foundation for incremental work
3. **Enhancement #8**: Debug command - essential for maintenance

### Phase 2: Integration Improvements
4. **Enhancement #6**: Integrated review/verify - improves quality
5. **Enhancement #2**: Auto-detected design - smart defaults
6. **Enhancement #4**: Context management - improves reliability

### Phase 3: Parity & Automation
7. **Enhancement #5**: Automated modes for standard prompts
8. **Enhancement #1**: IDE/Copilot feature parity

---

## File Changes Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `RLM/prompts/00-DETECT-PROJECT-TYPE.md` | Project type detection |
| `RLM/prompts/00-FULL-PIPELINE.md` | Standard prompt orchestration |
| `RLM/prompts/99-DEBUG-RECONCILE.md` | Debug/reconciliation protocol |
| `.claude/commands/rlm-full.md` | Standard pipeline command |
| `.claude/commands/cc-debug.md` | Debug command |
| `RLM/progress/checkpoint.json` | Checkpoint storage |
| `RLM/templates/copilot/prompts/rlm-design-*.prompt.md` | Design prompts (5 files) |
| `RLM/templates/copilot/prompts/rlm-verify.prompt.md` | Verify prompt |
| `RLM/templates/copilot/prompts/rlm-full-auto.prompt.md` | Full pipeline prompt |
| `RLM/templates/copilot/agents/rlm-designer.agent.md` | Designer agent |
| `RLM/templates/copilot/agents/rlm-verifier.agent.md` | Verifier agent |
| `RLM/templates/copilot/workflows/rlm-full-pipeline.yml` | Pipeline workflow |
| `RLM/templates/copilot/workflows/rlm-token-tracker.yml` | Token tracking |
| `RLM/templates/ide-agents/` | IDE agent templates (directory) |

### Files to Update

| File | Changes |
|------|---------|
| `RLM/prompts/01-DISCOVER.md` | Add automation mode, project detection |
| `RLM/prompts/02-CREATE-SPECS.md` | Add automation mode, conditional design |
| `RLM/prompts/03-CREATE-TASKS.md` | Add checkpoint logic, generation field |
| `RLM/prompts/04-IMPLEMENT-TASK.md` | Add progress reporting, integrated review/verify |
| `RLM/prompts/05-IMPLEMENT-ALL.md` | Add progress reporting, automation mode |
| `RLM/progress/cc-config.json` | Add new configuration options |
| `RLM/templates/copilot/prompts/rlm-implement.prompt.md` | Add review/verify |
| `.claude/agents/coder.md` | Add progress reporting |
| `.claude/commands/cc-implement.md` | Add progress output |

---

## Success Metrics

| Enhancement | Success Criteria |
|-------------|------------------|
| #1 IDE/Copilot Parity | Copilot can complete design+verify workflow |
| #2 Design Auto-Detection | CLI projects skip design, UI projects include it |
| #3 Token Reporting | Real-time progress visible during implementation |
| #4 Context Management | No context exhaustion mid-task |
| #5 Automated Modes | `/rlm-full` completes entire pipeline |
| #6 Integrated Review/Verify | Every task reviewed, every feature verified |
| #7 Incremental Features | `/create-tasks` never overwrites existing tasks |
| #8 Debug Command | `/cc-debug` detects and fixes all common issues |

---

## Version

**Plan Version**: 2.6.0
**Created**: 2024-12-09
**Completed**: 2025-12-09
**Status**: COMPLETE

## Implementation Status

| # | Enhancement | Status | Notes |
|---|-------------|--------|-------|
| 3 | Token/Progress Reporting | **COMPLETE** | Config, coder.md, cc-implement.md, prompts updated |
| 7 | Checkpoint System | **COMPLETE** | checkpoint.json, 03-CREATE-TASKS.md, cc-create-tasks.md updated |
| 8 | Global Debug Command | **COMPLETE** | cc-debug.md created, cc-config.json updated |
| 9 | Auto Project Research | **COMPLETE** | research/project/ folder, 01-DISCOVER.md updated, cc-config.json updated |
| 6 | Integrated Review/Verify | **COMPLETE** | 04-IMPLEMENT-TASK.md, cc-implement.md updated |
| 2 | Auto-Detected Design | **COMPLETE** | 00-DETECT-PROJECT-TYPE.md, 02-CREATE-SPECS.md, cc-config.json |
| 4 | Context Management | **COMPLETE** | cc-config.json, 05-IMPLEMENT-ALL.md updated |
| 5 | Automated Modes | **COMPLETE** | 00-FULL-PIPELINE.md, rlm-full.md created |
| 1 | IDE/Copilot Parity | **COMPLETE** | ide-agents/shared/ templates created |

### Phase 1 Complete (Core Infrastructure)
- **Enhancement #3**: Real-time + silent token/progress reporting with 5-step model
- **Enhancement #7**: Checkpoint system for incremental feature detection with generations
- **Enhancement #8**: Global debug/reconciliation command with interactive fixes
- **Enhancement #9**: Auto project research detection from RLM/research/project/

### Phase 2 Complete (Integration Improvements)
- **Enhancement #6**: Integrated review/verify after each task and feature completion
- **Enhancement #2**: Auto-detected design agent with UI/Non-UI classification
- **Enhancement #4**: Context window management with checkpointing, truncation, and phase reset

### Phase 3 Complete (Parity & Automation)
- **Enhancement #5**: Full pipeline orchestration with `/rlm-full` command and automation levels
- **Enhancement #1**: IDE/Copilot foundation with shared instructions and token tracking templates
