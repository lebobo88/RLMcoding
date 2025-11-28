# RLM Quick Start Guide

Get up and running with the RLM AI Agent Development System in under 5 minutes!

## What is RLM?

RLM (Research-Lead-Manage) is an AI-powered development system that:
- **Discovers** your requirements through intelligent questioning
- **Creates** production-ready specifications automatically
- **Implements** features with TDD using AI agents
- **Works** with any IDE: Claude Code, Cursor, Windsurf, VS Code, Aider, and more

## Prerequisites Checklist

- [ ] Git installed
- [ ] Node.js 18+ or Python 3.11+ installed
- [ ] GitHub account (optional, for sync)
- [ ] AI API key (Anthropic Claude recommended)
- [ ] Any AI coding tool (Claude Code, Cursor, Windsurf, etc.)

---

## 5-Minute Setup

### 1. Navigate to Your Project (1 minute)

```bash
cd /path/to/your/project

# Or create a new project
mkdir my-ai-project && cd my-ai-project
git init
```

### 2. Install RLM (1 minute)

```bash
# Make scripts executable
chmod +x RLM/commands/*.sh

# Initialize
./RLM/commands/rlm-init.sh --ide cursor --tech-stack node
```

### 3. Configure (2 minutes)

```bash
# Copy environment template
cp RLM/.env.example .env

# Edit .env with your credentials
nano .env
```

**Minimal required configuration:**
```env
RLM_GITHUB_TOKEN=ghp_your_token
RLM_GITHUB_REPO=your-org/your-project
RLM_AI_API_KEY=sk-your-api-key
```

### 4. Discover Your First Feature (1 minute)

**Option A: AI-Powered Discovery (Recommended)**

Use the RLM discovery process to generate specs from your idea:

```bash
# Claude Code
/discover Build a hello world API with health check endpoint

# Or PowerShell (any IDE)
./RLM/commands/rlm-discover.ps1 --idea "Build a hello world API with health check"

# Or direct prompt to any AI agent
# "Read RLM/agents/research-agent.md and discover specs for: Hello World API"
```

The AI will:
1. Research best practices for REST APIs
2. Ask clarifying questions (scale, auth, etc.)
3. Generate complete specifications

**Option B: Manual Spec Creation**

```bash
# Copy template
mkdir -p RLM/specs/features/FTR-001-hello-world
cp RLM/templates/spec-template.md RLM/specs/features/FTR-001-hello-world/spec.md

# Edit the spec
nano RLM/specs/features/FTR-001-hello-world/spec.md
```

**Quick example spec:**
```markdown
# Feature: Hello World API

## Feature ID: FTR-001
## Status: Active
## Priority: High

## Overview
Create a simple Hello World API endpoint.

## Acceptance Criteria
- [ ] GET /api/hello returns "Hello, World!"
- [ ] Response time < 100ms
- [ ] Tests included
```

### 5. Run Your First Build! (30 seconds)

```bash
./RLM/commands/rlm-build.sh --mode supervised
```

---

## What Happens Next?

The AI agents will:
1. ✅ Read your feature specification
2. ✅ Create an implementation plan
3. ✅ Ask for your approval (supervised mode)
4. ✅ Write tests first (TDD)
5. ✅ Implement the code
6. ✅ Run tests and validate
7. ✅ Generate progress report

---

## Common First Tasks

### View Progress
```bash
./RLM/commands/rlm-report.sh summary
```

### Check Token Usage
```bash
./RLM/commands/utils/token-tracker.sh report
```

### Run Tests
```bash
./RLM/commands/rlm-test.sh all
```

### Sync with GitHub
```bash
./RLM/commands/rlm-sync.sh both
```

---

## Example Workflow

### Day 1: Setup
```bash
# Morning: Install and configure
./RLM/commands/rlm-init.sh

# Afternoon: Create first spec
nano RLM/specs/features/FTR-001/spec.md

# Evening: Run build
./RLM/commands/rlm-build.sh --mode supervised
```

### Day 2: Iterate
```bash
# Pull latest specs from PM
./RLM/commands/rlm-sync.sh pull

# Build new features
./RLM/commands/rlm-build.sh --mode auto

# Push progress
./RLM/commands/rlm-sync.sh push
```

---

## Automation Modes Explained

### Auto Mode (Fastest)
```bash
./RLM/commands/rlm-build.sh --mode auto
```
- ⚡ Fully automated
- No human intervention
- Best for: Well-defined tasks

### Supervised Mode (Recommended)
```bash
./RLM/commands/rlm-build.sh --mode supervised
```
- 🎯 Agents ask for approval
- Human oversight at key points
- Best for: New features, complex changes

### Manual Mode (Most Control)
```bash
./RLM/commands/rlm-build.sh --mode manual
```
- 🐢 Step-by-step
- Approve each step
- Best for: Learning, debugging

---

## Quick Tips

### 💡 Tip 1: Always Start with Discovery
Use `/discover` or `rlm-discover.ps1` before writing code. AI-generated specs are more comprehensive than manual ones.

### 💡 Tip 2: Use Supervised Mode
Until you're comfortable, always use `--mode supervised`.

### 💡 Tip 3: Read the Constitution
Your `RLM/specs/constitution.md` guides all agent behavior.

### 💡 Tip 4: Check Progress Often
```bash
watch -n 5 ./RLM/commands/rlm-report.sh summary
```

### 💡 Tip 5: Works with Any IDE
RLM works with Claude Code, Cursor, Windsurf, VS Code, Aider, and more. See [IDE Integration Guide](IDE-INTEGRATION.md).

### 💡 Tip 6: Monitor Token Usage
```bash
./RLM/commands/utils/token-tracker.sh report
```
RLM achieves **86% token savings** with Elite Context Engineering!

---

## Troubleshooting Quick Fixes

### Commands not working?
```bash
chmod +x RLM/commands/*.sh
```

### No AI responses?
- Check `RLM_AI_API_KEY` in `.env`
- Verify API credits

### GitHub sync issues?
- Check `RLM_GITHUB_TOKEN` in `.env`
- Verify token permissions

---

## Next Steps

1. ✅ **Complete Quick Start** ← You are here
2. 📖 **Read Full Guide**: `RLM/docs/RLM-User-Guide.md`
3. 🎯 **Create Real Feature**: Use your actual requirements
4. 🤖 **Try Auto Mode**: Once comfortable with supervised
5. 🚀 **Set Up CI/CD**: Automate with GitHub Actions

---

## Getting Help

- 📚 **Documentation**: `RLM/docs/`
- 💬 **Community**: GitHub Discussions
- 🐛 **Issues**: GitHub Issues
- 📧 **Email**: support@rlm-system.dev

---

## That's It!

You're now ready to build with AI agents. The system will:
- ✅ Write code for you
- ✅ Generate tests
- ✅ Handle debugging
- ✅ Track progress
- ✅ Report issues
- ✅ **Monitor token usage and costs**

**Happy automated development!** 🎉

**💰 Pro Tip:** Check token usage after your first build:
```bash
./RLM/commands/utils/token-tracker.sh report
```

**👀 Pro Tip:** Monitor agent activities in real-time:
```bash
# Live event stream
./RLM/commands/rlm-observe.sh tail

# Or start web dashboard
./RLM/commands/rlm-observe-server.sh start
./RLM/commands/rlm-observe-server.sh dashboard
```

---

## One-Liner for the Impatient

```bash
./RLM/commands/rlm-init.sh && cp RLM/.env.example .env && nano .env && ./RLM/commands/rlm-build.sh --mode supervised
```


