# Context Primer: Task Implementation

You are priming context for single task implementation. This loads the minimum context needed for focused TDD work.

## Purpose

Load only what's needed to implement a specific task, following TDD workflow.

## Arguments

`$ARGUMENTS` should be:
- Task ID (e.g., `TASK-001`)
- Or `next` to pick the next priority task

## Context Loading Protocol

### Step 1: Identify Task
If task ID provided:
- Read `RLM/tasks/active/TASK-XXX.md`

If `next` or empty:
- List `RLM/tasks/active/`
- Select highest priority unblocked task

### Step 2: Load Task Context
Read the task file and extract:
- Task title and description
- Acceptance criteria
- Parent feature reference
- Dependencies
- Technical notes

### Step 3: Load Parent Feature
Read the parent feature spec (referenced in task):
```
RLM/specs/features/FTR-XXX/specification.md
```

Extract only:
- Feature context relevant to this task
- Technical approach for this task
- API contracts if applicable

### Step 4: Load TDD Workflow Reference
```markdown
## TDD Implementation Workflow

### Red Phase
1. Identify test file location
2. Write test describing expected behavior
3. Run test - verify it fails
4. Commit: "test: add failing test for [task]"

### Green Phase
1. Write minimal code to pass test
2. Run test - verify it passes
3. Don't over-engineer
4. Commit: "feat: implement [task]"

### Refactor Phase
1. Improve code quality
2. Run tests - must stay green
3. Extract patterns if needed
4. Commit: "refactor: improve [task]"
```

### Step 5: Load Constitution (Minimal)
From `RLM/specs/constitution.md`, extract only:
- Naming conventions
- File organization rules
- Testing requirements for this area

### Step 6: Present Task Mode
```markdown
## Task Implementation Mode Active

**Task**: [TASK-XXX] [Title]
**Feature**: [FTR-XXX] [Feature Title]
**Status**: [status]

### Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### TDD Plan
1. **Test First**: [Test file path]
2. **Implement**: [Source file path]
3. **Verify**: Run tests

### Dependencies
- [Dependency or "None"]

---
Ready for TDD implementation.
Start by writing tests for the first acceptance criterion.
```

## What This Primer Avoids

- Loading full PRD
- Loading other tasks
- Loading unrelated features
- Loading full constitution

## Context Efficiency

This primer loads ~600 tokens of targeted context vs ~3000+ for full task context.

Single-task focus means zero context pollution from other work.
