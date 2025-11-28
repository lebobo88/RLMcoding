# RLM Automation Commands

## Overview

The RLM automation system provides command-line tools to orchestrate AI agent workflows in any supported IDE. These commands handle discovery, sync, build, test, and reporting operations.

## Core Commands

### 0. rlm-discover - AI-Powered Spec Generation (New!)

**Purpose**: Transform raw project ideas into production-ready specifications using AI agents.

**Usage**:
```bash
# PowerShell (Windows)
./RLM/commands/rlm-discover.ps1 [OPTIONS]

# Bash (Linux/Mac)
./RLM/commands/rlm-discover.sh [OPTIONS]

# Claude Code Slash Command
/discover [idea]
```

**Options**:
- `--idea <text>` - The project idea to research (required)
- `--codebase <path>` - Existing codebase to analyze (brownfield projects)
- `--domain <name>` - Target domain (fintech, healthcare, productivity, etc.)
- `--mode <interactive|auto>` - Question mode (default: interactive)
- `--provider <claude|openai|ollama>` - AI provider (default: claude)
- `--model <model-name>` - Specific model to use

**What it does**:
1. **Parse Phase**: Analyzes your idea to extract core problem, features, and constraints
2. **Research Phase**: Searches for competitors, best practices, and technology options
3. **Question Phase**: Asks prioritized clarifying questions by category:
   - Business (Critical): Goals, users, success metrics
   - Technical (High): Scale, integrations, constraints
   - Data (High): Storage, compliance, privacy
   - Security (Medium): Auth, encryption, audit
   - UX (Medium): Platforms, accessibility
4. **Synthesis Phase**: Generates comprehensive specifications
5. **Handoff Phase**: Creates Master Architect handoff document

**Output Files**:
```
RLM/research/sessions/[session-id]/
├── idea.md           # Parsed requirements
├── findings.md       # Research results
├── questions.md      # Clarifying Q&A
├── competitors.md    # Competitive analysis
├── recommendations.md # Tech recommendations
└── handoff.md        # Master Architect handoff

RLM/specs/
├── constitution.md   # Project standards
├── features/FTR-XXX/spec.md  # Feature specs
├── architecture/overview.md   # Technical design
└── epics/breakdown.md         # Sprint planning
```

**Examples**:
```bash
# Basic discovery
./RLM/commands/rlm-discover.ps1 --idea "Build a task management app with AI prioritization"

# With domain context
./RLM/commands/rlm-discover.ps1 --idea "Add payment processing" --domain fintech

# Extending existing codebase
./RLM/commands/rlm-discover.ps1 --idea "Add user authentication" --codebase ./src

# Auto mode (minimal questions)
./RLM/commands/rlm-discover.ps1 --idea "REST API for inventory" --mode auto

# Using Claude Code slash command
/discover Build a real-time chat app with AI moderation
```

**IDE Compatibility**:

| IDE | How to Use |
|-----|------------|
| Claude Code | `/discover [idea]` |
| Cursor | Terminal or custom command |
| Windsurf | Terminal or Cascade |
| VS Code | Terminal |
| Aider | `aider --read RLM/agents/research-agent.md` |
| Any AI Agent | Direct prompt with research-agent.md |

**After Discovery**:
```bash
# Review generated specs
cat RLM/specs/features/FTR-001/spec.md

# Start implementation
./RLM/commands/rlm-build.sh --mode supervised

# Monitor progress
./RLM/commands/rlm-observe.sh tail
```

---

### 1. rlm-init - Initialize RLM System

**Purpose**: Set up RLM directory structure and configuration in a new or existing project.

**Usage**:
```bash
./RLM/commands/rlm-init.sh [OPTIONS]
```

**Options**:
- `--ide <cursor|windsurf|vscode|kiro|antigravity|claude>` - Target IDE
- `--tech-stack <node|python|dotnet|go>` - Primary technology stack
- `--github-repo <url>` - GitHub repository URL
- `--force` - Overwrite existing RLM configuration

**What it does**:
1. Creates RLM directory structure
2. Generates default configuration files
3. Sets up Git hooks for sync automation
4. Configures IDE-specific agent profiles
5. Creates initial constitution.md template
6. Initializes progress tracking database

**Example**:
```bash
./RLM/commands/rlm-init.sh --ide cursor --tech-stack node --github-repo https://github.com/org/project
```

---

### 2. rlm-sync - Sync with GitHub

**Purpose**: Pull latest specifications and push progress updates bidirectionally.

**Usage**:
```bash
./RLM/commands/rlm-sync.sh [DIRECTION] [OPTIONS]
```

**Directions**:
- `pull` - Download latest specs and tasks from GitHub
- `push` - Upload progress and issues to GitHub
- `both` - Bidirectional sync (default)

**Options**:
- `--branch <name>` - Target branch (default: main)
- `--force` - Force push/pull even with conflicts
- `--dry-run` - Show what would happen without making changes

**What it does (PULL)**:
1. Fetches latest from GitHub
2. Downloads new/updated specs to `RLM/specs/`
3. Downloads new tasks to `RLM/tasks/active/`
4. Updates agent profiles if changed
5. Merges configuration updates
6. Logs sync metadata

**What it does (PUSH)**:
1. Commits all progress logs
2. Pushes completed task artifacts
3. Uploads issue reports to `RLM/issues/`
4. Updates status.json with current state
5. Tags commit with progress metrics
6. Triggers webhook (if configured)

**Example**:
```bash
# Pull latest instructions
./RLM/commands/rlm-sync.sh pull

# Push progress and issues
./RLM/commands/rlm-sync.sh push

# Full bidirectional sync
./RLM/commands/rlm-sync.sh both
```

---

### 3. rlm-build - Automated Implementation

**Purpose**: Execute AI agents to implement tasks according to specifications.

**Usage**:
```bash
./RLM/commands/rlm-build.sh [OPTIONS]
```

**Options**:
- `--task <task-id>` - Specific task to implement (default: all active)
- `--agent <architect|implementation|testing|devops>` - Specific agent
- `--mode <auto|supervised|manual>` - Automation level
- `--parallel` - Run multiple tasks in parallel
- `--dry-run` - Validate without making changes

**Modes**:
- **auto**: Full automation, agents make decisions independently
- **supervised**: Agents ask for approval at key decision points
- **manual**: Step-by-step execution with human oversight

**What it does**:
1. Validates prerequisites (specs exist, dependencies installed)
2. Loads task specifications from `RLM/tasks/active/`
3. Invokes appropriate agents based on task type:
   - **Architecture tasks** → Master Architect Agent
   - **Implementation tasks** → Implementation Agent
   - **Testing tasks** → Testing Agent
   - **Deployment tasks** → DevOps Agent
4. Executes TDD workflow (tests first, then implementation)
5. Runs automated tests and quality checks
6. Logs progress to `RLM/progress/logs/`
7. Updates status.json in real-time
8. Handles errors and creates issue reports
9. Commits completed work with descriptive messages

**Example**:
```bash
# Implement all active tasks in auto mode
./RLM/commands/rlm-build.sh --mode auto

# Implement specific task with supervision
./RLM/commands/rlm-build.sh --task TASK-123 --mode supervised

# Run architecture review only
./RLM/commands/rlm-build.sh --agent architect

# Parallel implementation of multiple tasks
./RLM/commands/rlm-build.sh --parallel --mode auto
```

---

### 4. rlm-test - Run Test Suites

**Purpose**: Execute comprehensive testing with AI-powered analysis.

**Usage**:
```bash
./RLM/commands/rlm-test.sh [TYPE] [OPTIONS]
```

**Test Types**:
- `unit` - Unit tests only
- `integration` - Integration tests
- `e2e` - End-to-end tests
- `all` - Full test suite (default)
- `coverage` - Generate coverage report

**Options**:
- `--fix` - Automatically fix failing tests (using Testing Agent)
- `--watch` - Continuous testing mode
- `--parallel` - Run tests in parallel
- `--ci` - CI mode (fail fast, machine-readable output)

**What it does**:
1. Runs specified test suite(s)
2. Generates test reports and coverage data
3. Analyzes failures with AI (if --fix enabled)
4. Suggests or implements fixes automatically
5. Updates test metrics in progress tracking
6. Creates issue reports for persistent failures

**Example**:
```bash
# Run full test suite
./RLM/commands/rlm-test.sh all

# Run unit tests with auto-fix
./RLM/commands/rlm-test.sh unit --fix

# Generate coverage report
./RLM/commands/rlm-test.sh coverage

# CI mode for automated pipelines
./RLM/commands/rlm-test.sh all --ci
```

---

### 5. rlm-report - Generate Progress Reports

**Purpose**: Create comprehensive status reports for project management.

**Usage**:
```bash
./RLM/commands/rlm-report.sh [FORMAT] [OPTIONS]
```

**Formats**:
- `summary` - High-level overview (default)
- `detailed` - Full progress with task breakdowns
- `metrics` - Quantitative metrics and charts
- `issues` - Focus on blockers and issues
- `json` - Machine-readable JSON format

**Options**:
- `--output <file>` - Write to file instead of stdout
- `--since <date>` - Report on changes since date
- `--team <name>` - Filter by team/agent
- `--email <address>` - Email report to address

**What it does**:
1. Aggregates data from `RLM/progress/` and `RLM/issues/`
2. Calculates metrics:
   - Tasks completed vs. remaining
   - Velocity and burn rate
   - Test coverage trends
   - Issue resolution time
3. Generates visualizations (if metrics format)
4. Formats report in requested format
5. Optionally sends via email or webhook

**Example**:
```bash
# Quick summary
./RLM/commands/rlm-report.sh summary

# Detailed report since last week
./RLM/commands/rlm-report.sh detailed --since "7 days ago"

# Generate JSON for dashboard
./RLM/commands/rlm-report.sh json --output ./dashboard/data.json

# Email metrics report
./RLM/commands/rlm-report.sh metrics --email pm@company.com
```

---

## Workflow Automation Recipes

### Recipe 1: Daily Development Cycle
```bash
#!/bin/bash
# daily-dev.sh - Run this at start of each day

# 1. Sync latest instructions from PM
./RLM/commands/rlm-sync.sh pull

# 2. Show what's pending
./RLM/commands/rlm-report.sh summary

# 3. Implement active tasks (supervised mode for safety)
./RLM/commands/rlm-build.sh --mode supervised

# 4. Run tests and auto-fix issues
./RLM/commands/rlm-test.sh all --fix

# 5. Push progress back to PM
./RLM/commands/rlm-sync.sh push

# 6. Generate daily report
./RLM/commands/rlm-report.sh detailed --output daily-report.md
```

### Recipe 2: Continuous Integration
```bash
#!/bin/bash
# ci-pipeline.sh - Run in CI/CD environment

# 1. Sync specifications
./RLM/commands/rlm-sync.sh pull

# 2. Build and test
./RLM/commands/rlm-build.sh --mode auto
./RLM/commands/rlm-test.sh all --ci

# 3. Report results
./RLM/commands/rlm-report.sh json --output ci-report.json

# 4. Push results
./RLM/commands/rlm-sync.sh push
```

### Recipe 3: Sprint Planning Integration
```bash
#!/bin/bash
# sprint-update.sh - Run at sprint boundaries

# 1. Pull sprint tasks from PM
./RLM/commands/rlm-sync.sh pull --branch sprint-42

# 2. Generate sprint metrics
./RLM/commands/rlm-report.sh metrics --since "2 weeks ago"

# 3. Analyze blockers
./RLM/commands/rlm-report.sh issues --output sprint-blockers.md

# 4. Archive completed sprint
git tag -a sprint-42-end -m "End of Sprint 42"
```

### Recipe 4: Emergency Hotfix
```bash
#!/bin/bash
# hotfix.sh - Quick fix workflow

# 1. Create hotfix branch
git checkout -b hotfix/critical-bug

# 2. Implement fix (manual mode for control)
./RLM/commands/rlm-build.sh --task HOTFIX-001 --mode manual

# 3. Run tests
./RLM/commands/rlm-test.sh all

# 4. Fast-track to production
git push origin hotfix/critical-bug
./RLM/commands/rlm-sync.sh push --branch hotfix/critical-bug
```

---

## IDE-Specific Integration

### Cursor IDE
```bash
# Add to .cursorrules or use as MCP command
{
  "rlm-build": {
    "command": "./RLM/commands/rlm-build.sh --mode supervised",
    "description": "Implement active tasks with AI agents",
    "trigger": "manual"
  },
  "rlm-sync": {
    "command": "./RLM/commands/rlm-sync.sh both",
    "description": "Sync with GitHub",
    "trigger": "on-save"
  }
}
```

### Windsurf IDE
```yaml
# .windsurf/workflows/rlm-build.yaml
name: RLM Build
on: manual
steps:
  - run: ./RLM/commands/rlm-sync.sh pull
  - run: ./RLM/commands/rlm-build.sh --mode supervised
  - run: ./RLM/commands/rlm-test.sh all
  - run: ./RLM/commands/rlm-sync.sh push
```

### Kiro IDE
```toml
# kiro-hooks.toml
[hooks.on_save]
command = "./RLM/commands/rlm-sync.sh push"
pattern = "RLM/**/*.md"

[hooks.on_task_complete]
command = "./RLM/commands/rlm-report.sh summary"
```

### VS Code (with Copilot)
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "RLM: Sync & Build",
      "type": "shell",
      "command": "./RLM/commands/rlm-sync.sh both && ./RLM/commands/rlm-build.sh",
      "group": "build"
    }
  ]
}
```

---

## Environment Variables

Configure these in your shell or CI environment:

```bash
# GitHub Integration
export RLM_GITHUB_TOKEN="ghp_xxxxx"          # GitHub personal access token
export RLM_GITHUB_REPO="org/project"         # Repository identifier
export RLM_GITHUB_BRANCH="main"              # Default branch

# AI Model Configuration
export RLM_AI_MODEL="claude-sonnet-4"        # Primary AI model
export RLM_AI_API_KEY="sk-xxxxx"             # API key for AI provider
export RLM_AI_TEMPERATURE="0.2"              # Consistency (0.0-1.0)

# Automation Preferences
export RLM_DEFAULT_MODE="supervised"         # auto|supervised|manual
export RLM_PARALLEL_TASKS="4"                # Max parallel task execution
export RLM_AUTO_COMMIT="true"                # Auto-commit completed work

# Notification Settings
export RLM_WEBHOOK_URL="https://..."         # Progress webhook
export RLM_EMAIL_TO="pm@company.com"         # Report email address
export RLM_SLACK_WEBHOOK="https://..."       # Slack notifications

# Testing Configuration
export RLM_TEST_COVERAGE_THRESHOLD="80"      # Minimum coverage %
export RLM_AUTO_FIX_TESTS="true"             # Enable auto-fix
```

---

## Command Exit Codes

All commands follow standard exit code conventions:

- `0` - Success
- `1` - General error
- `2` - Invalid arguments
- `10` - Sync conflict
- `20` - Build failure
- `30` - Test failure
- `40` - Agent error
- `50` - Configuration error

Use in scripts:
```bash
./RLM/commands/rlm-build.sh
if [ $? -eq 0 ]; then
  echo "Build successful"
  ./RLM/commands/rlm-sync.sh push
else
  echo "Build failed, creating issue report"
  ./RLM/commands/rlm-report.sh issues
fi
```

---

## Advanced Utilities

### Context Management

**Purpose**: Optimize context usage with Elite Context Engineering protocols.

**Usage**:
```bash
./RLM/commands/utils/context-manager.sh [COMMAND] [OPTIONS]
```

**Commands**:
- `prime <type>` - Load context prime template
- `bundle [session-id]` - Create context bundle
- `load-bundle <id>` - Load context bundle
- `list-bundles` - List available bundles
- `analyze` - Analyze context bloat
- `optimize` - Optimize context usage
- `prepare <agent> <task>` - Prepare agent context
- `cleanup <agent> <task>` - Clean up agent context

**Examples**:
```bash
# Load implementation prime
./RLM/commands/utils/context-manager.sh prime implementation

# Create bundle for session
./RLM/commands/utils/context-manager.sh bundle

# Analyze context usage
./RLM/commands/utils/context-manager.sh analyze

# Optimize context
./RLM/commands/utils/context-manager.sh optimize
```

**Benefits**:
- **70% less context** loaded with primes
- **State management** via bundles
- **Context isolation** for clean execution
- **86% token savings** overall

---

### Background Agent Execution

**Purpose**: Run agents autonomously without occupying your terminal.

**Usage**:
```bash
./RLM/commands/utils/background-agent.sh [COMMAND] [OPTIONS]
```

**Commands**:
- `start <agent> <task> [mode]` - Start background agent
- `status <session-id>` - Check agent status
- `list` - List all background agents
- `log <session-id>` - View agent log
- `wait <session-id> [timeout]` - Wait for completion
- `stop <session-id>` - Stop running agent
- `cleanup [days]` - Clean old completed agents
- `plan <plan-name>` - Execute quick plan

**Examples**:
```bash
# Start agent in background
./RLM/commands/utils/background-agent.sh start implementation-agent TASK-001 auto

# Check status
./RLM/commands/utils/background-agent.sh status bg-1234567890

# List all background agents
./RLM/commands/utils/background-agent.sh list

# Wait for completion
./RLM/commands/utils/background-agent.sh wait bg-1234567890 600

# View log
./RLM/commands/utils/background-agent.sh log bg-1234567890
```

**Benefits**:
- **Parallel execution** - run multiple agents simultaneously
- **No bottleneck** - agents work autonomously
- **Continue working** - your terminal stays free
- **File-based reporting** - results saved automatically

---

### Token Tracking

**Purpose**: Monitor token usage and control AI costs.

**Usage**:
```bash
./RLM/commands/utils/token-tracker.sh [COMMAND] [OPTIONS]
```

**Commands**:
- `report [period]` - Generate token usage report
- `check` - Check budget status
- `optimize` - Show optimization suggestions
- `export [file]` - Export usage to CSV
- `init` - Initialize token tracking

**Examples**:
```bash
# View usage report
./RLM/commands/utils/token-tracker.sh report

# Check budget
./RLM/commands/utils/token-tracker.sh check

# Get optimization tips
./RLM/commands/utils/token-tracker.sh optimize

# Export to CSV
./RLM/commands/utils/token-tracker.sh export monthly-report.csv
```

**Benefits**:
- **Complete visibility** into AI costs
- **Budget alerts** prevent overruns
- **Optimization suggestions** reduce waste
- **Financial reporting** for stakeholders

---

## Advanced Workflow Examples

### Recipe 5: Elite Context Workflow
```bash
#!/bin/bash
# elite-workflow.sh - Maximum efficiency workflow

# 1. Analyze current context
./RLM/commands/utils/context-manager.sh analyze

# 2. Optimize if needed
./RLM/commands/utils/context-manager.sh optimize

# 3. Create starting bundle
./RLM/commands/utils/context-manager.sh bundle

# 4. Run multiple agents in background
./RLM/commands/utils/background-agent.sh start implementation-agent TASK-001 auto
./RLM/commands/utils/background-agent.sh start implementation-agent TASK-002 auto
./RLM/commands/utils/background-agent.sh start testing-agent TEST-001 auto

# 5. Wait for all to complete
./RLM/commands/utils/background-agent.sh list

# 6. Review token usage
./RLM/commands/utils/token-tracker.sh report

# 7. Create ending bundle
./RLM/commands/utils/context-manager.sh bundle

# 8. Push results
./RLM/commands/rlm-sync.sh push
```

### Recipe 6: Cost-Optimized Development
```bash
#!/bin/bash
# cost-optimized.sh - Minimize AI costs

# 1. Check current budget
./RLM/commands/utils/token-tracker.sh check

# 2. Use minimal MCP config
cp RLM/config/mcp-configs/minimal.json .mcp.json

# 3. Use context priming
./RLM/commands/utils/context-manager.sh prime implementation

# 4. Run in auto mode (less back-and-forth)
./RLM/commands/rlm-build.sh --mode auto

# 5. Review savings
./RLM/commands/utils/token-tracker.sh optimize

# Result: 86% cost reduction!
```

---

## MCP Configuration Management

### Selective MCP Loading

**Available Configs**:
- `minimal.json` - Filesystem only (2k overhead)
- `implementation.json` - Filesystem + Git (4k overhead)
- `testing.json` - Filesystem only (2k overhead)
- `architecture.json` - Filesystem + Fetch + GitHub (8k overhead)
- `devops.json` - Filesystem + GitHub (4k overhead)

**Usage**:
```bash
# Load minimal config for maximum efficiency
cp RLM/config/mcp-configs/minimal.json .mcp.json

# Or let RLM select automatically based on agent
./RLM/commands/rlm-build.sh --task TASK-001  # Auto-selects
```

**Token Savings**:
```
Full MCP Load:     12,000 tokens
Minimal Config:     2,000 tokens
Savings:          10,000 tokens (83%)
```

---

## Performance Metrics

### Token Efficiency

| Workflow | Before | After | Savings |
|----------|--------|-------|---------|
| Feature Implementation | 150k | 25k | 83% |
| Architecture Design | 80k | 20k | 75% |
| Test Writing | 60k | 15k | 75% |
| Bug Fixing | 40k | 10k | 75% |

### Cost Impact (100 Tasks)

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Total Tokens | 15M | 2.5M | 12.5M (83%) |
| Total Cost | $45.00 | $7.50 | $37.50 (83%) |
| Per Task | $0.45 | $0.075 | $0.375 (83%) |

---

## Integration Notes

All new utilities integrate seamlessly with existing RLM commands:

- `rlm-build` - Automatically uses context priming and selective MCP
- `rlm-test` - Uses minimal context for testing
- `rlm-report` - Includes context and token metrics
- `rlm-sync` - Compatible with all features

No breaking changes. All backward compatible.

---

**See individual command help for detailed usage:**
```bash
./RLM/commands/utils/context-manager.sh help
./RLM/commands/utils/background-agent.sh help
./RLM/commands/utils/token-tracker.sh help
./RLM/commands/utils/event-logger.sh help
./RLM/commands/utils/event-summarizer.sh help
./RLM/commands/utils/intervention-handler.sh help
```
