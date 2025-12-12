# RLM - Research, Lead, Manage

**AI-Powered Software Development Method**

RLM transforms raw project ideas into production-ready code through a structured 9-phase pipeline that works with **any AI coding agent** in **any IDE** with native configuration support.

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

## IDE Support

### Claude Code
Native slash commands via `.claude/commands/`:
```
/discover [idea]    /create-specs    /create-tasks    /implement
/cc-full [idea]     /cc-debug        /cc-verify       /cc-design
```

### Cursor
Native slash commands via `.cursor/commands/`:
```
/discover [idea]    /create-specs    /create-tasks    /implement
/implement-all      /resume          /rlm-status      /rlm-test
```

### VS Code + Copilot
Prompt files via `.github/prompts/`:
- `discover.prompt.md`, `create-specs.prompt.md`, `create-tasks.prompt.md`
- `implement.prompt.md`, `implement-all.prompt.md`, `resume.prompt.md`

### Any Other AI
Tell your AI:
```
Read RLM/prompts/01-DISCOVER.md and help me with: [your idea]
```

Or use the cross-platform `AGENTS.md` file in the project root.

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `prompts/` | Workflow prompts for any AI |
| `templates/` | Document templates |
| `specs/` | Generated specifications |
| `tasks/` | Implementation tasks |
| `progress/` | Progress tracking |
| `docs/` | Documentation |

## IDE Configuration Files

| File/Directory | IDE |
|----------------|-----|
| `AGENTS.md` | All (cross-platform) |
| `CLAUDE.md` | Claude Code |
| `.cursor/commands/` | Cursor |
| `.cursor/rules/` | Cursor |
| `.github/prompts/` | VS Code + Copilot |
| `.github/instructions/` | VS Code + Copilot |
| `.aider.conf.yml` | Aider |
| `.continue/config.json` | Continue.dev |

## Documentation

| Document | Purpose |
|----------|---------|
| [START-HERE.md](START-HERE.md) | Quick start guide |
| [User Guide](docs/USER-GUIDE.md) | Complete walkthrough |
| [Quick Reference](docs/QUICK-REFERENCE.md) | One-page cheat sheet |
| [Claude Code Guide](docs/CLAUDE-CODE-GUIDE.md) | Sub-agent workflow |
| [Sub-Agent Reliability](docs/SUB-AGENT-RELIABILITY.md) | How sub-agent tracking works |
| [Token Tracking](docs/TOKEN-TRACKING.md) | Token usage estimation |
| [Template Reference](docs/TEMPLATE-REFERENCE.md) | How to use templates |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues |
| [What's New](docs/WHATS-NEW.md) | Version history and changes |

## Features

### Core Workflow
- **9-Phase Pipeline**: Complete automation from idea to verified code
- **TDD by Default**: Test-Driven Development built in
- **Fine-Grained Tasks**: 1-4 hour tasks for predictable progress
- **3 Automation Levels**: AUTO, SUPERVISED, MANUAL
- **Resume Capability**: Stop and continue anytime

### Sub-Agent System
- **7 Specialized Agents**: Research, Architect, Designer, Coder, Tester, Reviewer, Verifier
- **Completion Manifests**: Every sub-agent writes what it accomplished
- **Executable Hooks**: Automatic tracking of all sub-agent activity
- **File Verification**: Primary agent verifies files actually exist

### Token Tracking
- **Real-Time Estimation**: Approximate tokens based on file operations
- **Post-Session Capture**: Accurate data from `/cost` command
- **Context Detection**: Know when context is being summarized

### Universal Compatibility
- Works with any AI in any IDE with native configs
- Cross-platform support via AGENTS.md
- Native configurations for Claude Code, Cursor, VS Code, Aider, Continue

## License

MIT
