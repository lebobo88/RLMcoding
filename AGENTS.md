# RLM AI Agent Instructions

This project uses the RLM (Research-Lead-Manage) method for AI-assisted development.

## Quick Start

Read `RLM/START-HERE.md` for the complete workflow overview.

## Project Structure

```
RLM/
├── prompts/         # Workflow prompts (use these!)
│   ├── 01-DISCOVER.md       # Idea → PRD
│   ├── 02-CREATE-SPECS.md   # PRD → Specs
│   ├── 03-CREATE-TASKS.md   # Specs → Tasks
│   ├── 04-IMPLEMENT-TASK.md # Single task TDD
│   ├── 05-IMPLEMENT-ALL.md  # All tasks
│   ├── 06-RESUME.md         # Resume session
│   └── patterns/            # Reusable reasoning patterns
├── specs/           # Specifications
│   ├── PRD.md               # Product Requirements Document
│   ├── constitution.md      # Project standards
│   ├── features/            # Feature specs (FTR-XXX)
│   ├── architecture/        # Technical architecture
│   └── design/              # Design system (UI projects)
├── tasks/           # Task management
│   ├── active/              # Tasks to implement
│   ├── completed/           # Finished tasks
│   └── blocked/             # Blocked tasks
├── progress/        # Progress tracking
│   ├── status.json          # Current state
│   └── checkpoint.json      # Incremental tracking
└── docs/            # Documentation
```

## Workflow Commands

### Discovery (Idea → PRD)
```
Read RLM/prompts/01-DISCOVER.md and help me discover specs for: [your idea]
```

### Create Specs (PRD → Feature Specs)
```
Read RLM/prompts/02-CREATE-SPECS.md and generate specs from my PRD
```

### Create Tasks (Specs → Tasks)
```
Read RLM/prompts/03-CREATE-TASKS.md and break down features into tasks
```

### Implement Single Task
```
Read RLM/prompts/04-IMPLEMENT-TASK.md and implement TASK-001
```

### Implement All Tasks
```
Read RLM/prompts/05-IMPLEMENT-ALL.md and implement all active tasks
```

### Resume Work
```
Read RLM/prompts/06-RESUME.md and resume my previous session
```

## Implementation Standards

### TDD Process (5 Steps)
1. **Load Context** (0-20%): Read task spec, feature spec, constitution
2. **Write Tests** (20-40%): TDD Red - write failing tests first
3. **Implement** (40-70%): TDD Green - write code to pass tests
4. **Verify** (70-85%): Run tests, fix failures, check coverage
5. **Review** (85-100%): Quality checks, update status

### Code Standards
- TypeScript with strict mode
- 80%+ test coverage target
- Functions < 50 lines
- Document public APIs
- Reference specs in commits (e.g., "Implements FTR-001")

### After Implementation
- Update `RLM/progress/status.json`
- Move completed task to `RLM/tasks/completed/`

## Key Files to Reference

| File | Purpose |
|------|---------|
| `RLM/START-HERE.md` | Entry point - read this first |
| `RLM/specs/PRD.md` | Product requirements |
| `RLM/specs/constitution.md` | Project standards |
| `RLM/progress/status.json` | Current state |
| `RLM/docs/USER-GUIDE.md` | Complete guide |

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

