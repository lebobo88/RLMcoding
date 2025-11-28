# RLM Automation Commands

## Overview

The RLM automation system provides command-line tools to orchestrate AI agent workflows in any supported IDE. These commands handle sync, build, test, and reporting operations.

## Core Commands

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