# RLM Implement Task

Your goal is to implement a task using Test-Driven Development (TDD).

## Instructions

Read `RLM/prompts/04-IMPLEMENT-TASK.md` for the complete workflow.

Task to implement: {{ input }}

## 5-Step TDD Process

### Step 1: Load Context (0-20%)
1. Read the task spec from `RLM/tasks/active/{{ input }}.md`
2. Read the parent feature spec from `RLM/specs/features/FTR-XXX/spec.md`
3. Read project standards from `RLM/specs/constitution.md`
4. Check for design tokens if UI task: `RLM/specs/design/`

### Step 2: Write Tests - TDD Red (20-40%)
1. Create test file(s) for the task
2. Write failing tests that cover:
   - Happy path scenarios
   - Edge cases
   - Error handling
3. Run tests to confirm they fail (Red)

### Step 3: Implement Code - TDD Green (40-70%)
1. Write minimum code to pass tests
2. Follow patterns from constitution
3. Use design tokens for UI components
4. Keep functions < 50 lines

### Step 4: Run Tests and Fix (70-85%)
1. Run all tests
2. Fix any failures
3. Ensure no regressions
4. Check coverage >= 80%

### Step 5: Quality Checks and Review (85-100%)
1. Run linter and fix issues
2. Review code against constitution
3. Update documentation if needed
4. Self-review checklist:
   - [ ] Tests pass
   - [ ] Code follows standards
   - [ ] No security issues
   - [ ] Documentation updated

## Completion
1. Update `RLM/progress/status.json`
2. Move task to `RLM/tasks/completed/`
3. Report completion with summary

