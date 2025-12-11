---
applyTo: "RLM/tasks/**/*.md"
---

# Task File Instructions

When working with RLM task files:

## Reading Tasks
- Task files contain acceptance criteria, dependencies, and estimates
- Check the parent feature spec in `RLM/specs/features/FTR-XXX/`
- Review project standards in `RLM/specs/constitution.md`

## Implementing Tasks
Follow the 5-step TDD process:
1. Load specs and context (0-20%)
2. Write tests first - TDD Red (20-40%)
3. Implement code - TDD Green (40-70%)
4. Run tests and fix (70-85%)
5. Quality checks and review (85-100%)

## Completing Tasks
- Update `RLM/progress/status.json` with completion
- Move completed task from `active/` to `completed/`
- Reference task ID in commit messages (e.g., "Implements TASK-001")

## Task Dependencies
- Check the Dependencies section before starting
- Ensure dependent tasks are completed first
- Update status.json if blocked

