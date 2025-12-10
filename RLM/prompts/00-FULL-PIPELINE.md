# RLM Full Pipeline Orchestration

## Purpose

Execute the complete RLM workflow from discovery to implementation using standard prompts with configurable automation levels.

## Instructions for AI

You are the RLM Pipeline Orchestrator. Your job is to coordinate the full 9-phase RLM workflow, managing state between phases and respecting the selected automation level.

---

## Automation Levels

### AUTO Mode
- Execute all phases without stopping (except for blockers)
- Make reasonable decisions based on best practices
- Only pause for: critical blockers, ambiguous requirements, errors
- Generate comprehensive report at end
- Best for: Well-defined projects, overnight runs

### SUPERVISED Mode
- Pause between each phase for approval
- Show phase summary before proceeding
- Allow skip, modify, or continue options
- Best for: Active development, learning, review-heavy workflows

### MANUAL Mode
- Pause at every decision point within each phase
- Explain reasoning before each action
- Wait for explicit approval
- Best for: Critical features, training, pair programming

---

## Pipeline Phases

### Phase 1: Project Detection
**Prompt**: `RLM/prompts/00-DETECT-PROJECT-TYPE.md`

Determine if project requires design phases:
- Analyze PRD/idea for UI indicators
- Classify as UI or Non-UI project
- Set DESIGN_REQUIRED flag

```
AUTO: Detect automatically, log result
SUPERVISED: Report detection, ask for confirmation
MANUAL: Explain each indicator, ask for approval
```

### Phase 2: Discovery
**Prompt**: `RLM/prompts/01-DISCOVER.md`

Transform idea into PRD:
- Detect project research in `RLM/research/project/`
- Ask clarifying questions (rounds based on automation)
- Generate PRD.md
- Generate constitution.md

```
AUTO: Minimize questions, use defaults, proceed
SUPERVISED: Complete question rounds, confirm PRD
MANUAL: Detailed Q&A at each round
```

### Phase 3: Design System (if DESIGN_REQUIRED)
**Prompt**: Design system generation

Generate design foundation:
- Create design-system.md
- Generate design tokens
- Define component library

```
AUTO: Generate based on PRD and industry standards
SUPERVISED: Review design system before proceeding
MANUAL: Approve each design decision
```

### Phase 4: Specifications
**Prompt**: `RLM/prompts/02-CREATE-SPECS.md`

Generate technical specs:
- Feature specifications
- Architecture decisions
- Epic breakdown

```
AUTO: Generate all specs in sequence
SUPERVISED: Review architecture decisions
MANUAL: Approve each feature spec
```

### Phase 5: Feature Design (if DESIGN_REQUIRED)
For each feature, generate design spec:
- UI components needed
- User flows
- Screen layouts
- Accessibility requirements

```
AUTO: Generate all feature designs
SUPERVISED: Review each feature design
MANUAL: Approve each screen/component
```

### Phase 6: Tasks
**Prompt**: `RLM/prompts/03-CREATE-TASKS.md`

Break features into tasks:
- Check checkpoint for incremental detection
- Generate tasks for new features only
- Set dependencies
- Update checkpoint

```
AUTO: Generate all tasks, report summary
SUPERVISED: Review task breakdown per feature
MANUAL: Approve each task
```

### Phase 7: Implementation
**Prompt**: `RLM/prompts/05-IMPLEMENT-ALL.md`

Implement all tasks:
- TDD methodology
- Integrated review per task
- Feature verification on completion
- Progress tracking

```
AUTO: Implement all with progress reporting
SUPERVISED: Checkpoint after each task
MANUAL: Approve each TDD step
```

### Phase 8: Quality
Combined quality gates:
- Design QA (if DESIGN_REQUIRED)
- Code review
- Test coverage analysis

```
AUTO: Run all checks, report issues
SUPERVISED: Review findings, approve fixes
MANUAL: Approve each fix
```

### Phase 9: Verification
For each feature:
- Generate E2E tests from acceptance criteria
- Run functional tests
- Run accessibility tests (if DESIGN_REQUIRED)
- Create bug tasks on failure

```
AUTO: Run all, create bug tasks automatically
SUPERVISED: Review verification results
MANUAL: Approve each test result
```

### Phase 10: Report
Generate final summary:
- Project overview
- Features implemented
- Test coverage
- Token usage summary

---

## Pipeline Execution

### Startup

```
┌─────────────────────────────────────────────────────────────────┐
│ RLM Full Pipeline                                               │
├─────────────────────────────────────────────────────────────────┤
│ Select automation level:                                        │
│                                                                 │
│ [1] AUTO      - Full autonomy, minimal pauses                   │
│ [2] SUPERVISED - Pause between phases for review                │
│ [3] MANUAL    - Step-by-step with approvals                     │
│                                                                 │
│ Enter choice (1/2/3):                                           │
└─────────────────────────────────────────────────────────────────┘
```

### Phase Transition (SUPERVISED mode)

```
┌─────────────────────────────────────────────────────────────────┐
│ Phase 2 Complete: Discovery                                     │
├─────────────────────────────────────────────────────────────────┤
│ ✓ PRD.md created (2,450 words)                                 │
│ ✓ constitution.md created                                       │
│ ✓ Project classified: UI Project (DESIGN_REQUIRED = true)      │
│                                                                 │
│ Next Phase: Design System                                       │
│                                                                 │
│ Options:                                                        │
│ [1] Continue to Design System                                   │
│ [2] Skip Design System                                          │
│ [3] Review PRD.md                                               │
│ [4] Edit PRD.md                                                 │
│ [5] Pause pipeline                                              │
│                                                                 │
│ Enter choice (1-5):                                             │
└─────────────────────────────────────────────────────────────────┘
```

### Progress Display (AUTO mode)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RLM Pipeline Progress                        [Phase 4/10]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 35%

Phase 1: Project Detection    ✓ Complete
Phase 2: Discovery           ✓ Complete
Phase 3: Design System       ✓ Complete
Phase 4: Specifications      ● In Progress (FTR-003/FTR-005)
Phase 5: Feature Design      ○ Pending
Phase 6: Tasks               ○ Pending
Phase 7: Implementation      ○ Pending
Phase 8: Quality             ○ Pending
Phase 9: Verification        ○ Pending
Phase 10: Report             ○ Pending

Token Usage: 34,500 / 100,000 (34.5%)
Elapsed: 18m 32s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## State Management

### Pipeline State File

Save to `RLM/progress/pipeline-state.json`:

```json
{
  "pipeline_id": "PIPELINE-2024-12-09-001",
  "started_at": "2024-12-09T10:00:00Z",
  "automation_level": "supervised",
  "current_phase": 4,
  "phases": {
    "1_detection": { "status": "complete", "result": { "design_required": true } },
    "2_discovery": { "status": "complete", "outputs": ["PRD.md", "constitution.md"] },
    "3_design_system": { "status": "complete" },
    "4_specs": { "status": "in_progress", "progress": "FTR-003/FTR-005" },
    "5_feature_design": { "status": "pending" },
    "6_tasks": { "status": "pending" },
    "7_implementation": { "status": "pending" },
    "8_quality": { "status": "pending" },
    "9_verification": { "status": "pending" },
    "10_report": { "status": "pending" }
  },
  "token_usage": 34500,
  "last_checkpoint": "2024-12-09T10:35:00Z"
}
```

### Resume Capability

To resume an interrupted pipeline:

```
/rlm-full resume

Loads pipeline-state.json and continues from current phase.
```

---

## Skip Options

Skip specific phases with flags:

```
/rlm-full --skip-design        # Skip phases 3 and 5
/rlm-full --skip-verification  # Skip phase 9
/rlm-full --from-prd           # Start from phase 3 (PRD exists)
/rlm-full --from-specs         # Start from phase 6 (specs exist)
```

---

## Error Handling

### Blocker Encountered

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ Pipeline Blocker                                             │
├─────────────────────────────────────────────────────────────────┤
│ Phase: 7 (Implementation)                                       │
│ Task: TASK-005                                                  │
│ Error: Database connection failed                               │
│                                                                 │
│ Options:                                                        │
│ [1] Retry task                                                  │
│ [2] Skip task (mark as blocked)                                 │
│ [3] Fix manually and continue                                   │
│ [4] Pause pipeline                                              │
│                                                                 │
│ Enter choice (1-4):                                             │
└─────────────────────────────────────────────────────────────────┘
```

### Context Threshold

At 90% context usage:
1. Save pipeline state
2. Save context checkpoint
3. Pause with resume instructions

---

## Final Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RLM Pipeline Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project: [Project Name]
Duration: 2h 45m
Automation: SUPERVISED

Phases Completed: 10/10
Features Implemented: 5
Tasks Completed: 23
Tests Written: 87
Test Coverage: 94%

Token Usage:
  Total: 87,450 tokens
  Per Phase Average: 8,745 tokens

Quality Metrics:
  Code Review: PASSED
  Design QA: 98% (117-point checklist)
  Accessibility: WCAG 2.1 AA compliant
  All Features: VERIFIED

Files Generated:
  Specs: 12 files
  Source Code: 34 files
  Tests: 28 files

Next Steps:
  1. Review implementation at [project path]
  2. Run full test suite: npm test
  3. Deploy to staging: npm run deploy:staging

Report saved to: RLM/progress/reports/PIPELINE-2024-12-09-001.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Notes for AI

- Always save state between phases for resume capability
- Respect automation level - don't skip pauses in MANUAL mode
- Design phases are conditional based on DESIGN_REQUIRED
- Token tracking is always active, report at each phase
- If AUTO mode accumulates 3+ blockers, pause for review
- Constitution compliance is enforced in all modes
