# RLM (Research-Lead-Manage) AI Agent Development System

## System Overview

The RLM System is a fully automated AI agent development workflow that transforms high-level product management into production-ready code through a seamless cycle of research, planning, implementation, and feedback.

## Architecture Components

### 1. Frontend Web Application (Product Management Hub)
- **Purpose**: High-level product planning, roadmapping, epic/story/sprint management
- **Features**: 
  - Research and discovery interface
  - Project design and architecture planning
  - Epic/Story/Sprint breakdown UI
  - Progress tracking dashboard
  - Issue resolution workspace
  - GitHub integration for bidirectional sync

### 2. Backend Database & API
- **Purpose**: Store and track all project data, specifications, tasks, progress, and issues
- **Tech Stack**: 
  - Node.js/Express or Python/FastAPI
  - PostgreSQL or MongoDB
  - RESTful API + WebSocket for real-time updates

### 3. GitHub Integration Layer
- **Purpose**: Bidirectional communication between webapp and local development
- **Features**:
  - Push agent instructions as structured files to repository
  - Pull progress updates and issues from local agents
  - Version control for all specifications and plans

### 4. Local IDE Agent Workflow
- **Purpose**: Automated implementation, testing, debugging, and CI/CD
- **Supported IDEs**: Cursor, Windsurf, VS Code (with Copilot), Kiro, Antigravity, Claude Code
- **Automation**: Command-driven workflows with agent hooks

## Core Workflow Cycle

```
┌─────────────────────────────────────────────────────────────┐
│  1. RESEARCH & PLANNING (Web App)                          │
│  - User conducts research and design                        │
│  - Creates epics, stories, and sprint plans                 │
│  - Defines specifications and acceptance criteria           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Push to GitHub
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  2. SYNC TO LOCAL (Developer)                              │
│  - Developer pulls latest instructions from GitHub         │
│  - Agent instructions appear in /RLM directory              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Run automation command
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  3. AUTOMATED IMPLEMENTATION (Local IDE + Agents)          │
│  - AI agents read specs and tasks                           │
│  - Generate code, tests, documentation                      │
│  - Run automated testing and debugging                      │
│  - Execute CI/CD pipelines                                  │
│  - Log all progress and blockers                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Push progress to GitHub
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  4. FEEDBACK & ITERATION (Web App)                         │
│  - Web app receives progress updates                        │
│  - User reviews completed work and issues                   │
│  - Re-plans or provides solutions to blockers               │
│  - Updates instructions and pushes back to GitHub           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Cycle repeats until completion
                      └─────────────────────────────────────────┘
```

## Key Principles

1. **Spec-Driven Development**: All work starts with clear, explicit specifications
2. **Agent Autonomy**: AI agents handle implementation details while humans manage strategy
3. **Continuous Feedback**: Progress and issues flow back immediately
4. **Version Control**: Everything is tracked via Git and structured files
5. **Tool Agnostic**: Works with any modern AI-powered IDE
6. **Production Ready**: Includes testing, CI/CD, documentation generation

## File Structure

```
project-root/
├── RLM/                                  # Agent workflow directory
│   ├── config/                           # System configuration
│   │   ├── project-config.json
│   │   ├── agent-profiles.json
│   │   └── ide-settings.json
│   ├── specs/                            # Specifications
│   │   ├── constitution.md
│   │   ├── requirements/
│   │   ├── architecture/
│   │   └── features/
│   ├── tasks/                            # Task breakdown
│   │   ├── active/
│   │   ├── completed/
│   │   └── blocked/
│   ├── progress/                         # Progress tracking
│   │   ├── logs/
│   │   ├── metrics.json
│   │   └── status.json
│   ├── issues/                           # Blocked items
│   │   ├── open/
│   │   └── resolved/
│   ├── agents/                           # Agent configurations
│   │   ├── master-architect.md
│   │   ├── implementation-agent.md
│   │   ├── testing-agent.md
│   │   └── devops-agent.md
│   ├── commands/                         # Automation commands
│   │   ├── rlm-init.sh
│   │   ├── rlm-sync.sh
│   │   ├── rlm-build.sh
│   │   ├── rlm-test.sh
│   │   └── rlm-report.sh
│   └── templates/                        # Document templates
│       ├── spec-template.md
│       ├── task-template.md
│       └── issue-template.md
└── [Your application code]
```

## Benefits

- **10x Faster Development**: Automated implementation with human oversight
- **Higher Code Quality**: AI agents follow best practices and run comprehensive tests
- **Clear Traceability**: Every decision and change is documented
- **Reduced Context Switching**: Agents handle the tedious parts
- **Scalable**: Works for solo developers and enterprise teams
- **Production Ready**: Built-in CI/CD, testing, and deployment automation

## Next Steps

1. Review detailed documentation for each component
2. Install and configure the RLM system in your project
3. Set up GitHub integration
4. Configure your IDE with agent profiles
5. Run your first automated build cycle