# RLM Method - GitHub Copilot Instructions
# RLM v2.7 - Prompt-based workflow

This project uses the RLM (Research-Lead-Manage) method for AI-assisted development.

## Quick Start

Read `RLM/START-HERE.md` for the complete workflow overview.

## Key Directories

- `RLM/prompts/` - Workflow prompts (use these for each step)
- `RLM/specs/` - All specifications (PRD, constitution, features, architecture)
- `RLM/templates/` - Templates for spec documents
- `RLM/tasks/` - Active, completed, and blocked tasks
- `RLM/progress/` - Progress tracking (status.json, checkpoint.json)
- `RLM/agents/` - Agent role definitions
- `RLM/research/` - Project research (auto-detected during discovery)
- `RLM/docs/` - Documentation

## Discovery Process

When asked to "discover", "research", or start a new project/feature:

1. **Read** `RLM/prompts/01-DISCOVER.md` for the full workflow
2. **Check** `RLM/research/project/` for existing research
3. **Research** the idea - analyze competitors, best practices, existing solutions
4. **Questions** - Ask clarifying questions in 3-4 rounds:
   - Round 1: Business goals, target users, MVP scope, success metrics
   - Round 2: Scale expectations, integrations, tech constraints, data requirements
   - Round 3: Authentication, platforms, compliance, UX priorities
   - Round 4 (UI projects): Design philosophy, animation tier, framework preferences
5. **Draft** specs following templates in `RLM/templates/`
6. **Save** to `RLM/specs/` (PRD.md, constitution.md, features/, architecture/)

## Creating Specs from PRD

When asked to create specs from an existing PRD:

1. **Read** `RLM/prompts/02-CREATE-SPECS.md`
2. **Read** the PRD from `RLM/specs/PRD.md`
3. **Generate** feature specs in `RLM/specs/features/FTR-XXX/`
4. **Generate** architecture in `RLM/specs/architecture/overview.md`
5. **Generate** epic breakdown in `RLM/specs/epics/breakdown.md`

## Creating Tasks

When asked to create tasks from specs:

1. **Read** `RLM/prompts/03-CREATE-TASKS.md`
2. **Check** `RLM/progress/checkpoint.json` for existing tasks
3. **Create** fine-grained tasks (1-4 hours each) for NEW features only
4. **Save** to `RLM/tasks/active/TASK-XXX.md`
5. **Update** `RLM/tasks/INDEX.md` and `RLM/progress/checkpoint.json`

## Implementation Process

When implementing features:

1. **Read** `RLM/prompts/04-IMPLEMENT-TASK.md` for the workflow
2. **Read** the task spec from `RLM/tasks/active/TASK-XXX.md`
3. **Read** the feature spec from `RLM/specs/features/FTR-XXX/spec.md`
4. **Follow TDD** - 5-step process:
   - Step 1: Load specs and context (0-20%)
   - Step 2: Write tests - TDD Red (20-40%)
   - Step 3: Implement code - TDD Green (40-70%)
   - Step 4: Run tests and fix (70-85%)
   - Step 5: Quality checks and review (85-100%)
5. **Check** constitution at `RLM/specs/constitution.md` for standards
6. **Update** `RLM/progress/status.json` when complete
7. **Move** completed task to `RLM/tasks/completed/`

## Resuming Work

When asked to resume or continue:

1. **Read** `RLM/prompts/06-RESUME.md`
2. **Check** `RLM/progress/status.json` for current state
3. **Check** `RLM/progress/checkpoint.json` for progress
4. **Continue** from the last checkpoint

## Code Standards

- TypeScript with strict mode
- 80%+ test coverage
- Document public APIs
- Follow existing patterns
- Reference specs in commits (e.g., "Implements FTR-001")

## Key Files

| File | Purpose |
|------|---------|
| `RLM/START-HERE.md` | Entry point - read this first |
| `RLM/specs/PRD.md` | Product Requirements Document |
| `RLM/specs/constitution.md` | Project standards |
| `RLM/progress/status.json` | Current state |
| `RLM/progress/checkpoint.json` | Incremental tracking |

## Prompts Reference

| Prompt | Purpose |
|--------|---------|
| `01-DISCOVER.md` | Transform idea into PRD |
| `02-CREATE-SPECS.md` | Generate specs from PRD |
| `03-CREATE-TASKS.md` | Break features into tasks |
| `04-IMPLEMENT-TASK.md` | Implement single task (TDD) |
| `05-IMPLEMENT-ALL.md` | Implement all active tasks |
| `06-RESUME.md` | Resume interrupted work |
| `07-TEST.md` | Run and fix tests |
| `08-REPORT.md` | Generate progress report |
