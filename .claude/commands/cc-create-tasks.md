# Break Features into Tasks with Sub-Agent Support

You are initiating Claude Code task creation mode. This command analyzes feature specs and creates fine-grained implementation tasks.

## Automatic Context Priming

This command automatically loads:
- `RLM/specs/features/` - All feature specifications
- `RLM/specs/constitution.md` - Coding standards for task sizing
- `RLM/specs/architecture/` - Technical context for dependencies

## Workflow

### Step 1: Verify Specs Exist
```
Check: RLM/specs/features/ has content?
├─► YES: Proceed to Step 1.5
└─► NO: Error - "No feature specs found. Run /cc-create-specs first."
```

### Step 1.5: Load Checkpoint (Incremental Detection)

Check for existing work to avoid overwriting:

```
Read: RLM/progress/checkpoint.json

If checkpoint exists:
├─► Load all_features list
├─► Load all_tasks list
├─► Determine current_generation
└─► Calculate next_task_id

Compare features in specs vs checkpoint:
├─► Features in both: SKIP (already have tasks)
├─► Features only in specs: CREATE TASKS (new features)
└─► Features only in checkpoint: WARN (orphaned tasks)

Report:
┌─────────────────────────────────────────────────────┐
│ Incremental Task Detection                          │
├─────────────────────────────────────────────────────┤
│ Existing: FTR-001, FTR-002 (6 tasks, gen 1)         │
│ New:      FTR-003, FTR-004 (need tasks)             │
│ Next ID:  TASK-007                                  │
│ New Gen:  2                                         │
├─────────────────────────────────────────────────────┤
│ Options:                                            │
│ 1. Proceed - Create tasks for new features only     │
│ 2. Regenerate - Delete all and start fresh          │
│ 3. Cancel                                           │
└─────────────────────────────────────────────────────┘
```

If no checkpoint exists, create initial checkpoint and start at TASK-001.

### Step 2: Load All Features (Filtered)
Read all feature specifications:
```bash
RLM/specs/features/FTR-*/specification.md
```

### Step 3: Analyze Dependencies
For each feature, identify:
- Internal dependencies (feature A needs feature B)
- External dependencies (APIs, services)
- Shared components

Build dependency graph for task ordering.

### Step 4: Break Down Each Feature
For each feature, create tasks following this pattern:

```markdown
Feature FTR-001 breaks into:
├─► TASK-001: Setup - Create file structure, base types
├─► TASK-002: Data Layer - Models, database schema
├─► TASK-003: API Layer - Endpoints, validation
├─► TASK-004: Business Logic - Core functionality
├─► TASK-005: UI Components - Interface elements
├─► TASK-006: Integration - Wire everything together
└─► TASK-007: Tests - Additional test coverage
```

### Step 5: Write Task Files
For each task, create `RLM/tasks/active/TASK-XXX.md`:

```markdown
---
id: TASK-XXX
title: [Descriptive title]
feature: FTR-XXX
status: pending
priority: [1-5]
estimated_tokens: [rough estimate]
dependencies: [TASK-YYY, TASK-ZZZ]
generation: [checkpoint generation number]
---

# TASK-XXX: [Title]

## Objective
[Clear statement of what this task accomplishes]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Technical Notes
[Implementation guidance, patterns to follow]

## Files to Create/Modify
- `path/to/file1.ts`
- `path/to/file2.ts`

## Test Requirements
- [ ] Unit tests for [component]
- [ ] Integration test for [flow]
```

### Step 6: Generate Task Summary
Create `RLM/tasks/TASKS-SUMMARY.md`:

```markdown
# Task Summary

## Statistics
- Total Tasks: XX
- By Feature:
  - FTR-001: X tasks
  - FTR-002: X tasks
- By Priority:
  - P1 (Critical): X tasks
  - P2 (High): X tasks
  - P3 (Medium): X tasks

## Dependency Order
[Visual dependency graph or ordered list]

## Estimated Effort
- Total estimated tokens: XXX,XXX
- Recommended parallel limit: X
```

### Step 7: Update Checkpoint

After task creation, update `RLM/progress/checkpoint.json`:

```
New checkpoint entry:
{
  "timestamp": "[now]",
  "generation": [incremented],
  "features_added": ["FTR-003", "FTR-004"],
  "tasks_created": ["TASK-007", "TASK-008", ...],
  "task_range": { "start": 7, "end": 12 }
}

Update totals:
- current_generation: [incremented]
- all_features: [append new features]
- all_tasks: [append new tasks]
- last_updated: [now]
```

Report checkpoint update:
```
┌─────────────────────────────────────────────────────┐
│ Checkpoint Updated - Generation 2                   │
├─────────────────────────────────────────────────────┤
│ Features added: FTR-003, FTR-004                    │
│ Tasks created:  TASK-007 through TASK-012 (6 new)   │
│ Total tasks:    12                                  │
│ Next run will start at: TASK-013                    │
└─────────────────────────────────────────────────────┘
```

### Step 8: Auto-Continue Option
Ask user:
```
XX tasks created successfully. Start implementation?
├─► YES (all): Execute /cc-implement all
├─► YES (single): Execute /cc-implement TASK-001
└─► NO: Stop here, user reviews tasks first
```

## Task Sizing Guidelines

Per Elite Context Engineering, tasks should be:
- **Atomic**: Completable in one sub-agent session
- **Testable**: Clear pass/fail criteria
- **Independent**: Minimal coupling (where possible)
- **Estimated**: Token cost awareness

| Task Type | Typical Size | Token Estimate |
|-----------|--------------|----------------|
| Setup/Config | Small | 2,000-5,000 |
| Data Layer | Medium | 5,000-10,000 |
| API Endpoint | Medium | 5,000-10,000 |
| Business Logic | Medium-Large | 8,000-15,000 |
| UI Component | Medium | 5,000-12,000 |
| Integration | Large | 10,000-20,000 |

## Automatic Token Reporting

- Task creation tokens logged
- Estimated implementation tokens calculated
- Budget projection displayed

## Output Structure

```
RLM/tasks/
├── TASKS-SUMMARY.md          # Overview and statistics
├── active/
│   ├── TASK-001.md
│   ├── TASK-002.md
│   └── ...
├── completed/                 # (empty initially)
└── blocked/                   # (empty initially)
```
