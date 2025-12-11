# RLM Implement All Tasks

Your goal is to implement all active tasks using Test-Driven Development (TDD).

## Instructions

Read `RLM/prompts/05-IMPLEMENT-ALL.md` for the complete workflow.

## Automation Level: SUPERVISED
Pause after each task for approval before continuing.

## Process

### 1. Load All Tasks
Read all tasks from `RLM/tasks/active/`

### 2. Sort by Priority
Order tasks by:
1. Dependencies (implement dependencies first)
2. Priority (critical → high → medium → low)
3. Feature grouping

### 3. For Each Task
Follow the 5-step TDD process:

**Step 1: Load Context (0-20%)**
- Read task spec
- Read feature spec
- Read constitution

**Step 2: Write Tests - TDD Red (20-40%)**
- Create test files
- Write failing tests

**Step 3: Implement Code - TDD Green (40-70%)**
- Write code to pass tests
- Follow standards

**Step 4: Run Tests and Fix (70-85%)**
- Run all tests
- Fix failures
- Check coverage

**Step 5: Quality Checks (85-100%)**
- Run linter
- Self-review
- Update docs

### 4. After Each Task
- Update `RLM/progress/status.json`
- Move to `RLM/tasks/completed/`
- **PAUSE for approval** before next task

### 5. Completion
Report final summary:
- Tasks completed
- Tests passing
- Coverage achieved
- Any issues encountered

