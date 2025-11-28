# Elite Context Engineering in RLM

**Transform your AI development with advanced context management based on research-backed protocols.**

---

## Overview

The RLM system implements Elite Context Engineering principles to maximize context efficiency, reduce token costs, and enable scalable AI agent workflows. These patterns work across all AI-powered IDEs (Cursor, Windsurf, VS Code, Claude Code, etc.).

## Core Principle: R&D Framework

###Reduce → **Delegate** → **Manage**

1. **Reduce**: Minimize context loaded into agents
2. **Delegate**: Offload work to specialized sub-agents
3. **Manage**: Maintain state efficiently with bundles

---

## Key Features

### 1. Description Engineering ✅

**What It Is:** Agent descriptions that tell the PRIMARY agent when and how to invoke sub-agents.

**Implementation:** Enhanced agent profiles with detailed descriptions

```json
{
  "id": "implementation-agent",
  "description": "Use this agent for TDD code implementation. Invoke with: task specification, architecture plan, and acceptance criteria. The agent will write tests first, implement code to pass tests, and ensure quality standards."
}
```

**Why It Matters:**
- Primary agent knows when to delegate
- Sub-agents get exactly the context they need
- No wasted context on irrelevant information

**Files:**
- `RLM/config/agent-profiles.json` - All agents now have engineered descriptions

---

### 2. Context Priming ✅

**What It Is:** Load minimal, task-specific context only when needed.

**Implementation:** Prime templates for each agent type

**Available Primes:**
- `prime_architecture` - For architecture design (20-50k tokens)
- `prime_implementation` - For TDD coding (50-100k tokens)
- `prime_testing` - For test writing (30-50k tokens)
- `prime_devops` - For CI/CD setup (30-50k tokens)

**Usage:**
```bash
# Load context prime for implementation
./RLM/commands/utils/context-manager.sh prime implementation
```

**Benefits:**
- **70% less context** than loading everything
- Faster agent responses
- Lower token costs
- Focused attention on task at hand

**Files:**
- `RLM/templates/primes/*.md` - Prime templates for each agent type

---

### 3. Context Isolation ✅

**What It Is:** Each agent starts with zero context pollution - only gets what it needs.

**Implementation:** Context preparation before agent invocation

```bash
# Prepare isolated context for agent
./RLM/commands/utils/context-manager.sh prepare implementation-agent TASK-001
```

**How It Works:**
1. Primary agent identifies task
2. System prepares minimal context bundle
3. Sub-agent receives only:
   - Constitution essentials
   - Task specification
   - Relevant architecture
4. Sub-agent executes in isolation
5. Results reported back to primary
6. Context cleaned up

**Benefits:**
- Sub-agents start at 0% token usage
- No historical baggage
- Cleaner outputs
- Parallel execution possible

**Files:**
- `RLM/commands/utils/context-manager.sh` - Context preparation utilities

---

### 4. Context Bundles ✅

**What It Is:** Trail of work for state restoration without full verbose history.

**Implementation:** Append-only logs of critical actions

**Usage:**
```bash
# Create bundle from current session
./RLM/commands/utils/context-manager.sh bundle

# List available bundles
./RLM/commands/utils/context-manager.sh list-bundles

# Load bundle to restore state
./RLM/commands/utils/context-manager.sh load-bundle 1234567890
```

**What's Captured:**
- Session summary
- Active tasks
- Recent actions
- Current state
- Context size metrics

**Benefits:**
- Resume work after context explosion
- Share state between sessions
- Debug without replaying full history
- 90% smaller than full context

**Files:**
- `RLM/progress/context-bundles/` - Stored bundles
- `RLM/commands/utils/context-manager.sh` - Bundle management

---

### 5. Background Agents ✅

**What It Is:** Autonomous task execution out-of-loop, no human bottleneck.

**Implementation:** Background process execution with file-based reporting

**Usage:**
```bash
# Start agent in background
./RLM/commands/utils/background-agent.sh start implementation-agent TASK-001 auto

# Check status
./RLM/commands/utils/background-agent.sh status bg-1234567890

# List all background agents
./RLM/commands/utils/background-agent.sh list

# Wait for completion
./RLM/commands/utils/background-agent.sh wait bg-1234567890

# View log
./RLM/commands/utils/background-agent.sh log bg-1234567890
```

**Benefits:**
- Run multiple agents simultaneously
- No terminal occupation
- Work continues while you do other things
- Agents report via files when done

**Use Cases:**
- Long-running implementations
- Parallel feature development
- Overnight builds
- CI/CD pipelines

**Files:**
- `RLM/commands/utils/background-agent.sh` - Background execution
- `RLM/progress/background/` - Active and completed agents

---

### 6. Selective MCP Loading ✅

**What It Is:** Load only the Model Context Protocol servers needed for specific tasks.

**Problem:** Default MCP configs waste ~12% of context with unused tools.

**Solution:** Specialized MCP configs per agent type.

**Available Configurations:**

| Config | Servers | Overhead | Use For |
|--------|---------|----------|---------|
| minimal | filesystem | ~2k tokens | Simple tasks |
| implementation | filesystem, git | ~4k tokens | Coding |
| testing | filesystem | ~2k tokens | Testing |
| architecture | filesystem, fetch, github | ~8k tokens | Design |
| devops | filesystem, github | ~4k tokens | CI/CD |

**Usage:**
```bash
# Load minimal config
cp RLM/config/mcp-configs/minimal.json .mcp.json

# Or let RLM choose based on agent
./RLM/commands/rlm-build.sh --task TASK-001  # Auto-selects MCP config
```

**Token Savings:**

```
Full MCP Load:     12,000 tokens
Minimal Config:     2,000 tokens
Savings:          10,000 tokens (83%)
```

**Files:**
- `RLM/config/mcp-configs/*.json` - Specialized configurations
- `RLM/config/mcp-configs/README.md` - Detailed guide

---

## Practical Workflows

### Workflow 1: Standard Feature Implementation

```bash
# 1. Create context bundle (starting point)
./RLM/commands/utils/context-manager.sh bundle

# 2. Start architecture agent with prime
./RLM/commands/rlm-build.sh --task ARCH-001 --agent master-architect
# (Automatically loads architecture prime + MCP config)

# 3. Start implementation in background
./RLM/commands/utils/background-agent.sh start implementation-agent TASK-001 auto

# 4. Monitor progress
./RLM/commands/utils/background-agent.sh list

# 5. When complete, review results
./RLM/commands/utils/background-agent.sh log bg-1234567890

# 6. Create bundle for next session
./RLM/commands/utils/context-manager.sh bundle
```

**Token Usage:**
- Architecture: ~30k tokens (with prime)
- Implementation: ~80k tokens (with prime, isolated)
- Total: ~110k tokens vs ~300k without optimization

---

### Workflow 2: Parallel Development

```bash
# Start multiple agents in parallel
./RLM/commands/utils/background-agent.sh start implementation-agent TASK-001 auto
./RLM/commands/utils/background-agent.sh start implementation-agent TASK-002 auto
./RLM/commands/utils/background-agent.sh start testing-agent TEST-001 auto

# All run simultaneously, no context pollution
# Each has isolated context
# All report when complete
```

---

### Workflow 3: Context Optimization

```bash
# Analyze current context
./RLM/commands/utils/context-manager.sh analyze

# Output shows:
# - Constitution size
# - Active tasks count
# - Spec complexity
# - Estimated token usage

# Optimize automatically
./RLM/commands/utils/context-manager.sh optimize

# Actions taken:
# - Archive old completed tasks
# - Clean old logs (90+ days)
# - Compress old bundles
```

---

## Token Savings Breakdown

### Before Elite Context Engineering:
```
Full Constitution:        15,000 tokens
All Active Tasks:         30,000 tokens
Full Feature Specs:       25,000 tokens
Full MCP Load:           12,000 tokens
Historical Context:       50,000 tokens
--------------------------------
Total per Agent:        132,000 tokens
```

### After Elite Context Engineering:
```
Constitution Essentials:   3,000 tokens
Single Task:               5,000 tokens
Relevant Spec Only:        8,000 tokens
Selective MCP:             2,000 tokens
No History (isolated):          0 tokens
--------------------------------
Total per Agent:          18,000 tokens

SAVINGS:                 114,000 tokens (86%)
```

---

## Best Practices

### ✅ Do's

1. **Use Context Primes**
   ```bash
   ./RLM/commands/utils/context-manager.sh prime implementation
   ```

2. **Isolate Agent Contexts**
   - Let RLM prepare context automatically
   - Don't load full codebase

3. **Create Bundles Regularly**
   ```bash
   # After major milestones
   ./RLM/commands/utils/context-manager.sh bundle
   ```

4. **Run Long Tasks in Background**
   ```bash
   ./RLM/commands/utils/background-agent.sh start agent task auto
   ```

5. **Use Selective MCP Configs**
   - Start with minimal
   - Add tools only when needed

6. **Analyze Context Regularly**
   ```bash
   ./RLM/commands/utils/context-manager.sh analyze
   ```

### ❌ Don'ts

1. **Don't Load Everything**
   - No full constitution every time
   - No all tasks in context
   - No full MCP load

2. **Don't Reuse Polluted Context**
   - Create fresh contexts for agents
   - Use isolation

3. **Don't Skip Cleanup**
   ```bash
   ./RLM/commands/utils/context-manager.sh optimize
   ```

4. **Don't Ignore Token Budgets**
   - Each prime has a target
   - Stay within limits

5. **Don't Mix Concerns**
   - Architecture agent = architecture work only
   - Implementation agent = implementation only

---

## Integration with RLM Build

The `rlm-build.sh` script automatically uses Elite Context Engineering:

```bash
./RLM/commands/rlm-build.sh --task TASK-001 --mode supervised
```

**What Happens:**
1. Determines agent needed (from task type)
2. Loads appropriate context prime
3. Prepares isolated context
4. Selects correct MCP config
5. Invokes agent with minimal context
6. Captures results
7. Cleans up context
8. Reports token usage

**All automatic - no manual intervention needed!**

---

## Measuring Success

### Context Efficiency Metrics

```bash
# Before optimization
./RLM/commands/utils/context-manager.sh analyze
# Shows: 150,000 estimated tokens

# After optimization
./RLM/commands/utils/context-manager.sh optimize
./RLM/commands/utils/context-manager.sh analyze
# Shows: 25,000 estimated tokens

# Savings: 83%
```

### Token Usage Reports

```bash
# View token usage with context details
./RLM/commands/utils/token-tracker.sh report
```

Includes:
- Per-agent token usage
- Context overhead
- Optimization opportunities

---

## Advanced Patterns

### Custom Prime Templates

Create your own primes for specialized tasks:

```bash
# Create custom prime
cat > RLM/templates/primes/prime_custom.md << EOF
# Context Prime: Custom Task

## Purpose
[Your purpose]

## Essential Context Only
- [List what's needed]

## Run Step
[Your workflow]
EOF

# Use it
./RLM/commands/utils/context-manager.sh prime custom
```

### Dynamic MCP Selection

Let agents request specific MCPs:

```json
{
  "agent": "implementation-agent",
  "task": "TASK-001",
  "requestedMCP": ["filesystem", "git"],
  "reason": "Need git for commits"
}
```

### Context Streaming

For very large tasks, stream context in chunks:

```bash
# Prepare context in chunks
./RLM/commands/utils/context-manager.sh prepare-chunked agent task
```

---

## Troubleshooting

### Issue: Context Still Too Large

```bash
# Analyze what's using tokens
./RLM/commands/utils/context-manager.sh analyze

# Check specific areas:
# - Constitution size (should be < 5k tokens)
# - Active tasks (keep under 10)
# - Spec complexity (break down large features)
```

### Issue: Agent Missing Context

If agent doesn't have needed information:

1. Check prime includes it
2. Verify task specification is complete
3. Add to agent's inputContext in agent-profiles.json

### Issue: Background Agent Stuck

```bash
# Check status
./RLM/commands/utils/background-agent.sh status bg-SESSION-ID

# View log
./RLM/commands/utils/background-agent.sh log bg-SESSION-ID

# Stop if needed
./RLM/commands/utils/background-agent.sh stop bg-SESSION-ID
```

---

## Summary

Elite Context Engineering in RLM provides:

✅ **86% token savings** through context optimization  
✅ **Isolated agent execution** with zero context pollution  
✅ **Background processing** for autonomous work  
✅ **Selective tool loading** with specialized MCP configs  
✅ **State management** via context bundles  
✅ **Scalable workflows** with parallel agent execution  

**Result:** More efficient AI development with lower costs and better outcomes.

---

## Quick Reference

```bash
# Context Management
./RLM/commands/utils/context-manager.sh prime <type>
./RLM/commands/utils/context-manager.sh bundle
./RLM/commands/utils/context-manager.sh analyze
./RLM/commands/utils/context-manager.sh optimize

# Background Agents
./RLM/commands/utils/background-agent.sh start <agent> <task>
./RLM/commands/utils/background-agent.sh list
./RLM/commands/utils/background-agent.sh status <session-id>

# MCP Configs
cp RLM/config/mcp-configs/minimal.json .mcp.json
```

---

**Master context engineering. Build smarter, not harder.** 🚀

