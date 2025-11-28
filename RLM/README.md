# RLM - Research, Lead, Manage

**AI-Powered Software Development Method**

RLM transforms raw project ideas into production-ready code through a structured workflow that works with **any AI coding agent** in **any IDE**.

## Start Here

**New to RLM?** Read [START-HERE.md](START-HERE.md)

## Two Entry Points

| Starting Point | Command | What You Get |
|----------------|---------|--------------|
| Have an idea | `/discover [idea]` | Complete PRD |
| Have a PRD | `/create-specs` | Technical specs, tasks |

## Workflow

```
/discover [idea]  →  /create-specs  →  /create-tasks  →  /implement
      │                   │                  │                │
      ▼                   ▼                  ▼                ▼
    PRD.md            Specs +           Tasks in         Working
  constitution     Architecture        active/            Code
```

## Quick Commands (Claude Code)

| Command | Purpose |
|---------|---------|
| `/discover [idea]` | Transform idea into PRD |
| `/create-specs` | Generate specs from PRD |
| `/create-tasks` | Break features into tasks |
| `/implement TASK-001` | Implement single task |
| `/implement all` | Implement all tasks |
| `/implement resume` | Resume interrupted session |

## For Other IDEs

Copy prompts from `RLM/prompts/` or tell your AI:
```
Read RLM/prompts/01-DISCOVER.md and help me with: [your idea]
```

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `prompts/` | Workflow prompts for any AI |
| `templates/` | Document templates |
| `specs/` | Generated specifications |
| `tasks/` | Implementation tasks |
| `progress/` | Progress tracking |
| `docs/` | Documentation |

## Documentation

- [User Guide](docs/USER-GUIDE.md) - Complete walkthrough
- [Quick Reference](docs/QUICK-REFERENCE.md) - One-page cheat sheet
- [Template Reference](docs/TEMPLATE-REFERENCE.md) - How to use templates
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues

## Features

- **Universal**: Works with any AI in any IDE
- **TDD by Default**: Test-Driven Development built in
- **Fine-Grained Tasks**: 1-4 hour tasks for predictable progress
- **3 Automation Levels**: AUTO, SUPERVISED, MANUAL
- **Resume Capability**: Stop and continue anytime
- **Progress Tracking**: Know where you are at all times

## License

MIT
