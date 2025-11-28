# MCP Configuration Files

## Purpose

Specialized Model Context Protocol (MCP) configurations for different agent types. This implements the "don't autoload everything" principle from Elite Context Engineering.

## Principle: Selective Loading

**Problem:** Loading all MCP servers wastes ~12% of context tokens with tools you don't need.

**Solution:** Load only the MCPs required for the specific agent/task.

## Available Configurations

### minimal.json
- **Servers:** filesystem only
- **Overhead:** ~2,000 tokens
- **Use for:** Simple tasks, when you want maximum context efficiency
- **Example:** Writing documentation, simple file operations

### architecture.json
- **Servers:** filesystem, fetch (web scraping), GitHub
- **Overhead:** ~8,000 tokens
- **Use for:** Architecture design, technology research
- **Example:** Researching tech stack, reviewing similar projects

### implementation.json
- **Servers:** filesystem, git
- **Overhead:** ~4,000 tokens
- **Use for:** Code implementation, TDD development
- **Example:** Writing code and tests, committing changes

### testing.json
- **Servers:** filesystem only
- **Overhead:** ~2,000 tokens
- **Use for:** Test writing, test analysis
- **Example:** Writing test suites, analyzing coverage

### devops.json
- **Servers:** filesystem, GitHub
- **Overhead:** ~4,000 tokens
- **Use for:** CI/CD setup, deployment
- **Example:** Configuring GitHub Actions, deployment scripts

## Usage in RLM

### IDE Configuration

The agent profiles in `RLM/config/agent-profiles.json` specify which MCP config to use:

```json
{
  "id": "implementation-agent",
  "mcpConfig": "mcp-configs/implementation.json",
  ...
}
```

### Manual Selection

For Cursor, Windsurf, or other IDEs with MCP support:

1. Copy desired config to `.mcp.json` in project root
2. Restart IDE to load new configuration
3. Agent now has only the specified tools

```bash
# Load implementation config
cp RLM/config/mcp-configs/implementation.json .mcp.json
```

### Environment Variables

MCP configs use environment variables for credentials:

- `GITHUB_TOKEN` - For GitHub MCP server
- `ANTHROPIC_API_KEY` - For AI model access
- Other service-specific tokens as needed

## Benefits

### Token Savings

| Configuration | Token Overhead | Savings vs Full |
|---------------|----------------|-----------------|
| Minimal | 2,000 | 10,000 |
| Implementation | 4,000 | 8,000 |
| Testing | 2,000 | 10,000 |
| Architecture | 8,000 | 4,000 |
| DevOps | 4,000 | 8,000 |

*Assuming "full" config loads ~12,000 tokens of MCP metadata*

### Context Efficiency

- **More room for code**: Less MCP overhead = more space for actual context
- **Faster responses**: Fewer tools = less decision overhead
- **Lower costs**: Fewer tokens = lower API costs
- **Focused agents**: Only relevant tools loaded

## Best Practices

### 1. Start Minimal

Begin with `minimal.json` and add more only if needed:

```bash
cp RLM/config/mcp-configs/minimal.json .mcp.json
```

### 2. Task-Specific Loading

Switch configs based on current task:

```bash
# For architecture work
cp RLM/config/mcp-configs/architecture.json .mcp.json

# For implementation work
cp RLM/config/mcp-configs/implementation.json .mcp.json
```

### 3. Don't Autoload

**❌ Bad:** Default `.mcp.json` in root that loads everything

**✅ Good:** No default `.mcp.json`, load specifically when needed

### 4. Custom Configurations

Create custom configs for specialized workflows:

```json
{
  "mcpServers": {
    "filesystem": { ... },
    "custom-tool": { ... }
  },
  "description": "Custom config for my specific use case",
  "tokenOverhead": "~5000 tokens",
  "useCase": "My specific workflow"
}
```

## Integration with RLM Commands

The RLM build system can automatically select the appropriate MCP config:

```bash
# rlm-build.sh will use MCP config from agent profile
./RLM/commands/rlm-build.sh --task TASK-001

# Or specify explicitly
./RLM/commands/rlm-build.sh --task TASK-001 --mcp minimal
```

## Troubleshooting

### MCP Server Not Found

If an MCP server fails to load:

1. Check if the package is installed: `npm list @modelcontextprotocol/server-*`
2. Verify environment variables are set
3. Check server logs in IDE

### Token Overhead Still High

If context is still bloated:

1. Use `minimal.json` instead
2. Check if other context (files, history) is the issue
3. Use context management tools: `./RLM/commands/utils/context-manager.sh analyze`

### Tools Not Available

If agent can't access a tool:

1. Verify tool is in the loaded MCP config
2. Check MCP server is running
3. Restart IDE to reload configuration

## Advanced: Dynamic MCP Loading

For advanced users, load MCPs programmatically:

```bash
# Load MCP config for specific agent
./RLM/commands/utils/load-mcp.sh implementation-agent TASK-001
```

This script reads the agent profile, determines required MCPs, and configures them dynamically.

---

**Remember:** Spend tokens wisely. Load only what you need. Your context window is precious.

