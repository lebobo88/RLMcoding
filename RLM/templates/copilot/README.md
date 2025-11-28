# GitHub Copilot Integration Templates

This directory contains templates that enable GitHub Copilot features in RLM-generated projects.

## Overview

When RLM generates a new project, these templates are copied to enable Copilot's autonomous coding capabilities:

| Template | Destination | Purpose |
|----------|-------------|---------|
| `copilot-instructions.md.template` | `.github/copilot-instructions.md` | Repository-wide Copilot instructions |
| `AGENTS.md.template` | `AGENTS.md` | Coding agent guidance |
| `agents/*.agent.md` | `.github/agents/` | Custom agent profiles |
| `prompts/*.prompt.md` | `.github/prompts/` | Reusable prompts |
| `workflows/*.yml` | `.github/workflows/` | GitHub Actions automation |

## Directory Structure

```
copilot/
├── README.md                            # This file
├── copilot-instructions.md.template     # Repository-wide instructions
├── AGENTS.md.template                   # Coding agent instructions
├── agents/                              # Custom agent definitions
│   ├── rlm-architect.agent.md           # Architecture decisions
│   ├── rlm-coder.agent.md               # TDD implementation
│   ├── rlm-tester.agent.md              # Test writing
│   ├── rlm-reviewer.agent.md            # Code review
│   └── rlm-research.agent.md            # Research
├── prompts/                             # Reusable prompts
│   ├── rlm-discover.prompt.md           # Idea → PRD
│   ├── rlm-create-specs.prompt.md       # PRD → Specs
│   ├── rlm-create-tasks.prompt.md       # Specs → Tasks
│   ├── rlm-implement.prompt.md          # Single task
│   ├── rlm-implement-all.prompt.md      # All tasks
│   ├── rlm-test.prompt.md               # Testing
│   ├── rlm-review.prompt.md             # Code review
│   ├── rlm-fix-bug.prompt.md            # Bug fixes
│   ├── rlm-prime-feature.prompt.md      # Feature context
│   └── rlm-prime-task.prompt.md         # Task context
└── workflows/                           # GitHub Actions
    └── rlm-task-to-issue.yml            # Task → Issue automation
```

## Template Variables

Templates use these variables that are replaced during project generation:

| Variable | Source | Description |
|----------|--------|-------------|
| `{{PROJECT_NAME}}` | PRD.md | Project name |
| `{{PROJECT_DESCRIPTION}}` | PRD.md | Project description |
| `{{TECH_STACK_SUMMARY}}` | constitution.md | Technology stack overview |

## Copilot Features

### 1. Custom Instructions (`.github/copilot-instructions.md`)

Repository-wide guidance for all Copilot interactions:
- RLM methodology explanation
- Coding standards
- Testing requirements
- File structure conventions

**Requires**: Any Copilot tier

### 2. AGENTS.md

Instructions specifically for Copilot coding agent:
- Pre-implementation checklist
- TDD workflow requirements
- Completion criteria
- Error handling guidance

**Requires**: Copilot Pro+/Enterprise with coding agent enabled

### 3. Custom Agents (`.github/agents/*.agent.md`)

Specialized agent profiles:

| Agent | Purpose | Tools |
|-------|---------|-------|
| **rlm-coder** | TDD implementation | read_file, edit_file, run_in_terminal |
| **rlm-tester** | Test writing & coverage | read_file, edit_file, run_in_terminal |
| **rlm-reviewer** | Code review & security | read_file |
| **rlm-architect** | Architecture & ADRs | read_file, edit_file |
| **rlm-research** | Research & documentation | read_file, edit_file |

**Requires**: Copilot with custom agents support

### 4. Prompt Files (`.github/prompts/*.prompt.md`)

Reusable prompts for Copilot Chat:

```
@workspace /rlm-implement TASK-001
@workspace /rlm-review
@workspace /rlm-fix-bug
```

**Requires**: Copilot Chat

### 5. GitHub Actions Workflow

Automates task-to-issue conversion:
- Triggers when task files are pushed
- Creates GitHub issues with proper labels
- Issues can be assigned to Copilot coding agent

**Requires**: GitHub repository with Actions enabled

## Usage

### Using Copilot Prompts

In VS Code with GitHub Copilot:

```
@workspace /rlm-implement TASK-001
```

This loads the prompt from `.github/prompts/rlm-implement.prompt.md`.

### Using Copilot Coding Agent

1. Push task files to `RLM/tasks/active/`
2. GitHub Actions creates issues automatically
3. Open issue on GitHub
4. Click "Assign to Copilot" in sidebar
5. Copilot implements and creates PR
6. Review and merge

### Manual Setup

If templates weren't copied during project generation:

1. Copy templates to your project:
   ```bash
   cp -r RLM/templates/copilot/agents .github/agents
   cp -r RLM/templates/copilot/prompts .github/prompts
   cp -r RLM/templates/copilot/workflows .github/workflows
   cp RLM/templates/copilot/copilot-instructions.md.template .github/copilot-instructions.md
   cp RLM/templates/copilot/AGENTS.md.template AGENTS.md
   ```

2. Replace template variables in copied files

## Requirements

| Feature | Minimum Copilot Tier |
|---------|---------------------|
| Custom Instructions | Any |
| Prompt Files | Any (with Chat) |
| Custom Agents | Enterprise/Pro+ |
| Coding Agent | Pro+/Enterprise |

## Resources

- [GitHub Copilot Coding Agent](https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent)
- [Custom Agents](https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/)
- [AGENTS.md Support](https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/)
- [Copilot Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-copilot)
