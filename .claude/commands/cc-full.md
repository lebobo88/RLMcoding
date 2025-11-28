# Full Automation Pipeline: Idea to Code

You are initiating Claude Code **full automation mode**. This command runs the complete RLM pipeline from idea to working code with minimal user intervention.

## Arguments

`$ARGUMENTS` should be the project idea/description.

If empty, prompt: "Describe your project idea to begin full automation."

## Automatic Context Priming

This command initializes with:
- Elite Context Engineering protocols
- Industry detection framework
- All RLM templates and agents

## Pipeline Overview

```
/cc-full [idea]
│
├─► Phase 1: DISCOVER
│   ├─► Spawn Research Sub-Agent (competitor analysis)
│   ├─► Primary Agent asks clarifying questions (3 rounds)
│   └─► Generate PRD → RLM/specs/PRD.md
│
├─► Phase 2: SPECS
│   ├─► Spawn Architect Sub-Agent (tech decisions)
│   ├─► Generate feature specifications
│   └─► Generate architecture → RLM/specs/architecture/
│
├─► Phase 3: TASKS
│   ├─► Analyze features and dependencies
│   ├─► Create fine-grained tasks
│   └─► Generate task files → RLM/tasks/active/
│
├─► Phase 4: IMPLEMENT
│   ├─► Spawn N Coder Sub-Agents IN PARALLEL
│   ├─► TDD implementation for all tasks
│   ├─► Spawn Tester Sub-Agents for coverage
│   └─► Spawn Reviewer Sub-Agent before completion
│
└─► Phase 5: REPORT
    ├─► Generate progress report
    ├─► Display token usage summary
    └─► List any incomplete items
```

## Execution Flow

### Phase 1: Discovery
```
Execute /cc-discover [idea]
├─► Research sub-agent gathers market/competitor info
├─► Ask user 12 questions (3 rounds of 4)
├─► Generate PRD with tech recommendations
└─► Checkpoint: "PRD generated. Continue to specs?"
    ├─► AUTO mode: Continue automatically
    └─► SUPERVISED mode: Wait for user approval
```

### Phase 2: Spec Generation
```
Execute /cc-create-specs
├─► Architect sub-agent designs system
├─► Generate feature specifications
├─► Generate architecture documentation
└─► Checkpoint: "Specs generated. Continue to tasks?"
```

### Phase 3: Task Creation
```
Execute /cc-create-tasks
├─► Analyze all feature specs
├─► Create dependency graph
├─► Generate task files
└─► Checkpoint: "XX tasks created. Start implementation?"
```

### Phase 4: Implementation (Parallel)
```
Execute /cc-implement all
│
├─► Load configuration: parallel_limit (default: 5)
├─► Sort tasks by dependency order
│
├─► Batch 1 (parallel):
│   ├─► Task tool → Coder Sub-Agent → TASK-001
│   ├─► Task tool → Coder Sub-Agent → TASK-002
│   ├─► Task tool → Coder Sub-Agent → TASK-003
│   ├─► Task tool → Coder Sub-Agent → TASK-004
│   └─► Task tool → Coder Sub-Agent → TASK-005
│
├─► Wait for batch completion
├─► Run tests for completed tasks
│
├─► Batch 2 (parallel):
│   └─► ... remaining tasks
│
├─► Final review:
│   └─► Spawn Reviewer Sub-Agent for full codebase
│
└─► Checkpoint: "Implementation complete. Review results?"
```

### Phase 5: Report
```
Generate final report:
├─► Tasks completed: XX/XX
├─► Test coverage: XX%
├─► Token usage: XXX,XXX total
├─► Time elapsed: X hours
└─► Any blockers or manual items needed
```

## Automation Levels

| Level | Behavior | Checkpoints |
|-------|----------|-------------|
| **AUTO** | Runs entire pipeline | Only stops on errors |
| **SUPERVISED** | Pauses at each phase | User approves each phase |
| **MANUAL** | Step-by-step | User controls each action |

Default: **SUPERVISED** (safest for new projects)

To set level:
```
/cc-full [idea] --auto
/cc-full [idea] --supervised
/cc-full [idea] --manual
```

## Automatic Token Reporting

Throughout the pipeline:
- Silent logging after each sub-agent call
- **50%**: "Token usage at 50%. Proceeding..."
- **75%**: "Token usage at 75%. Consider consolidating remaining work."
- **90%**: "Token usage at 90%. Saving context bundle. May need to resume in new session."
- **Session end**: Full token usage breakdown by phase and agent

## Error Handling

If any phase fails:
1. Save context bundle immediately
2. Log error details to `RLM/progress/logs/errors/`
3. Invoke problem-solving framework
4. Attempt recovery or escalate to user

```
Error in Phase 3 (Tasks):
├─► Context bundle saved: RLM/progress/bundles/[session-id].json
├─► Error logged: RLM/progress/logs/errors/[timestamp].md
├─► Recovery attempt...
│   ├─► SUCCESS: Continue pipeline
│   └─► FAILED: "Pipeline paused at task creation. Error: [details]"
└─► Resume with: /cc-full resume
```

## Resume Capability

If pipeline was interrupted:
```
/cc-full resume
├─► Read context bundle
├─► Identify last completed phase
├─► Continue from next phase
└─► Or: /cc-full resume --from=specs (restart from specific phase)
```

## Output Summary

After full pipeline completion:
```
RLM/
├── specs/
│   ├── PRD.md                ✓ Generated
│   ├── constitution.md       ✓ Generated
│   ├── features/             ✓ X features
│   └── architecture/         ✓ Complete
├── tasks/
│   ├── active/               (empty - all completed)
│   └── completed/            ✓ XX tasks
├── progress/
│   ├── token-usage/          ✓ Session logged
│   └── logs/                 ✓ Activity log
└── [project code]            ✓ Implemented
```

## Configuration

Pipeline respects settings from `RLM/progress/cc-config.json`:
```json
{
  "parallel_limit": 5,
  "automation_level": "supervised",
  "token_warning_threshold": 0.5,
  "auto_bundle_threshold": 0.9
}
```

Modify with `/cc-config [setting] [value]`.
