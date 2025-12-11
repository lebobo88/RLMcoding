# RLM Create Tasks

Your goal is to break features into fine-grained implementable tasks.

## Instructions

Read `RLM/prompts/03-CREATE-TASKS.md` for the complete workflow.

## Process

### 1. Load Checkpoint
Check `RLM/progress/checkpoint.json` to detect existing tasks.
Only create tasks for NEW features (incremental approach).

### 2. Read Feature Specs
Load all feature specs from `RLM/specs/features/`

### 3. Create Tasks
For each feature, break down into tasks:
- Each task should be 1-4 hours of work
- Include clear acceptance criteria
- Define dependencies on other tasks
- Assign to appropriate feature (FTR-XXX)

### 4. Task Structure
Save each task to `RLM/tasks/active/TASK-XXX.md`:

```markdown
# TASK-XXX: [Task Title]

## Feature
FTR-XXX

## Description
[What needs to be done]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Dependencies
- TASK-YYY (if any)

## Estimated Time
[1-4 hours]
```

### 5. Update Tracking
- Create/update `RLM/tasks/INDEX.md` with task list
- Update `RLM/progress/checkpoint.json` with new generation

## Output
Provide summary of:
- Total tasks created
- Tasks per feature
- Suggested implementation order

