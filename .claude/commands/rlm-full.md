# /rlm-full - Complete RLM Pipeline (Standard Prompts)

Execute the full RLM workflow using standard prompts with configurable automation.

## Usage

```
/rlm-full [idea]              # Start from scratch with idea
/rlm-full --from-prd          # Start from existing PRD
/rlm-full --from-specs        # Start from existing specs
/rlm-full resume              # Resume from checkpoint
/rlm-full --auto              # Force AUTO mode
/rlm-full --supervised        # Force SUPERVISED mode
/rlm-full --manual            # Force MANUAL mode
```

## Flags

| Flag | Description |
|------|-------------|
| `--auto` | Full autonomy, minimal pauses |
| `--supervised` | Pause between phases for review |
| `--manual` | Step-by-step with approvals |
| `--from-prd` | Skip discovery, start from existing PRD |
| `--from-specs` | Skip discovery and specs, start from tasks |
| `--skip-design` | Skip design system and feature design phases |
| `--skip-verification` | Skip E2E verification phase |

## Workflow

### Step 1: Parse Arguments

```
If $ARGUMENTS contains idea:
  → Start from Phase 1 (Discovery)

If $ARGUMENTS contains --from-prd:
  → Verify RLM/specs/PRD.md exists
  → Start from Phase 2 (Design System or Specs)

If $ARGUMENTS contains --from-specs:
  → Verify RLM/specs/features/ has content
  → Start from Phase 6 (Tasks)

If $ARGUMENTS is "resume":
  → Load RLM/progress/pipeline-state.json
  → Continue from saved phase
```

### Step 2: Select Automation Level

If not specified via flag, ask:

```
┌─────────────────────────────────────────────────────────────────┐
│ RLM Full Pipeline - Select Automation Level                     │
├─────────────────────────────────────────────────────────────────┤
│ [1] AUTO       - Full autonomy, report at end                   │
│ [2] SUPERVISED - Pause between phases for review                │
│ [3] MANUAL     - Step-by-step with approvals                    │
│                                                                 │
│ Enter choice (1/2/3):                                           │
└─────────────────────────────────────────────────────────────────┘
```

### Step 3: Execute Pipeline

Read and execute `RLM/prompts/00-FULL-PIPELINE.md` with:
- Selected automation level
- Starting phase based on arguments
- Skip flags if provided

### Step 4: Phase-by-Phase Execution

**Phase 1: Project Detection**
```
Execute: RLM/prompts/00-DETECT-PROJECT-TYPE.md
Output: DESIGN_REQUIRED flag
```

**Phase 2: Discovery** (if starting from scratch)
```
Execute: RLM/prompts/01-DISCOVER.md
Output: PRD.md, constitution.md
```

**Phase 3: Design System** (if DESIGN_REQUIRED)
```
Execute: Design system generation
Output: RLM/specs/design/design-system.md
```

**Phase 4: Specifications**
```
Execute: RLM/prompts/02-CREATE-SPECS.md
Output: Feature specs, architecture
```

**Phase 5: Feature Design** (if DESIGN_REQUIRED)
```
Execute: Feature design for each FTR-XXX
Output: Feature design specs
```

**Phase 6: Tasks**
```
Execute: RLM/prompts/03-CREATE-TASKS.md
Output: Task files with checkpoint
```

**Phase 7: Implementation**
```
Execute: RLM/prompts/05-IMPLEMENT-ALL.md
Output: Implemented code with tests
```

**Phase 8: Quality**
```
Execute: Combined quality checks
Output: Quality report
```

**Phase 9: Verification**
```
Execute: E2E verification for each feature
Output: Verification results, bug tasks if needed
```

**Phase 10: Report**
```
Generate: Final pipeline report
Output: RLM/progress/reports/PIPELINE-[id].md
```

### Step 5: State Management

Throughout execution, maintain:

**Pipeline state** (`RLM/progress/pipeline-state.json`):
```json
{
  "pipeline_id": "PIPELINE-2024-12-09-001",
  "automation_level": "supervised",
  "current_phase": 4,
  "design_required": true,
  "phases": { /* phase status */ },
  "token_usage": 34500
}
```

**Checkpoints** at each phase completion for resume.

### Step 6: Handle Interrupts

If user interrupts or context threshold reached:
1. Save current state
2. Save context checkpoint
3. Report resume command

```
Pipeline paused at Phase 7.

To resume: /rlm-full resume

State saved to: RLM/progress/pipeline-state.json
```

## Examples

### Start New Project

```
User: /rlm-full "Build a habit tracking app with reminders"

Pipeline: Starting RLM Full Pipeline...
Phase 1: Detecting project type...
  → UI Project detected (DESIGN_REQUIRED = true)
Phase 2: Running discovery...
  → [Question rounds based on automation level]
  → PRD.md created
...
```

### Resume Interrupted Pipeline

```
User: /rlm-full resume

Pipeline: Loading saved state...
Found: PIPELINE-2024-12-09-001
Current phase: 7 (Implementation)
Progress: TASK-012/TASK-023
Token usage: 65,400 (65.4%)

Resuming implementation...
```

### Skip Design Phases

```
User: /rlm-full "CLI tool for parsing logs" --skip-design

Pipeline: Design phases will be skipped (CLI project).
Phase 1: ✓ Project classified as Non-UI
Phase 2: Running discovery...
Phase 3: Skipped (Non-UI project)
Phase 4: Creating specifications...
Phase 5: Skipped (Non-UI project)
...
```

## Progress Indicators

### AUTO Mode
- Minimal output, progress bar only
- Full report at end

### SUPERVISED Mode
- Phase summaries
- Approval prompts between phases
- Real-time progress during implementation

### MANUAL Mode
- Detailed explanation at each step
- Approval before each action
- Learning-friendly output

## Error Recovery

If a phase fails:
1. Log error details
2. Save state for recovery
3. Offer options:
   - Retry phase
   - Skip phase (if safe)
   - Fix manually and continue
   - Abort pipeline

## Integration with CC Commands

`/rlm-full` uses standard prompts but can integrate with CC commands:

| Phase | Standard Prompt | CC Equivalent |
|-------|-----------------|---------------|
| Discovery | 01-DISCOVER.md | /cc-discover |
| Specs | 02-CREATE-SPECS.md | /cc-create-specs |
| Tasks | 03-CREATE-TASKS.md | /cc-create-tasks |
| Implement | 05-IMPLEMENT-ALL.md | /cc-implement all |
| Verify | Feature verification | /cc-verify |

Use `/cc-full` for Claude Code enhanced workflow with sub-agents.
Use `/rlm-full` for standard prompt-based workflow.
