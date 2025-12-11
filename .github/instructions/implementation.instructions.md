---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx,**/*.py"
---

# Implementation Instructions

When implementing code in this project:

## Before Coding
1. Read the relevant task from `RLM/tasks/active/`
2. Read the feature spec from `RLM/specs/features/`
3. Check standards in `RLM/specs/constitution.md`

## TDD Process
Always follow Test-Driven Development:
1. Write failing tests first
2. Implement minimum code to pass
3. Refactor while keeping tests green

## Code Standards
- TypeScript strict mode
- 80%+ test coverage target
- Functions < 50 lines
- Document public APIs
- Follow existing patterns in codebase

## Commits
- Reference specs in commit messages
- Format: "type(scope): description (FTR-XXX, TASK-YYY)"
- Types: feat, fix, docs, refactor, test

## After Implementation
- Run all tests
- Run linter
- Update progress in `RLM/progress/status.json`

