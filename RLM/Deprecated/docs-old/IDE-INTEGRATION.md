# RLM IDE & AI Agent Integration Guide

The RLM system is designed to work with **any IDE and any AI coding agent**. This comprehensive guide shows how to integrate RLM discovery, spec creation, and automated implementation across all popular development environments.

---

## Overview: Universal AI Agent Compatibility

RLM's power comes from its **IDE-agnostic design**. The same specifications, research process, and implementation workflow work identically whether you're using:

- **Claude Code** (Anthropic's CLI)
- **Cursor** (AI-first IDE)
- **Windsurf** (Codeium's IDE)
- **VS Code + GitHub Copilot**
- **Aider** (CLI pair programming)
- **Continue.dev** (Open-source AI assistant)
- **JetBrains AI Assistant**
- **Any other AI coding tool**

### Why This Works

RLM stores all knowledge in **version-controlled markdown files**:
- Agent prompts in `RLM/agents/`
- Specifications in `RLM/specs/`
- Templates in `RLM/templates/`
- Configuration in `RLM/config/`

Any AI agent can read these files and follow the RLM workflow.

---

## Quick Start (Any IDE)

### Option 1: PowerShell Script (Recommended for Windows)
```powershell
# Run discovery
./RLM/commands/rlm-discover.ps1 --idea "Your project idea"

# Then point your AI agent to read from RLM/specs/
```

### Option 2: Bash Script (Linux/Mac)
```bash
# Run discovery
./RLM/commands/rlm-discover.sh --idea "Your project idea"

# Then point your AI agent to read from RLM/specs/
```

### Option 3: Direct AI Agent Prompt (Universal)
```
Read RLM/agents/research-agent.md and help me discover specs for:
[Your project idea]

Follow the phased approach: Research → Questions → Draft → Refine.
Save outputs to RLM/specs/
```

---

## The RLM Workflow in Any IDE

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR AI CODING ENVIRONMENT                    │
│  (Cursor, Windsurf, VS Code, Claude Code, Aider, etc.)          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────────────┐
         ▼                       ▼                               ▼
┌─────────────────┐     ┌─────────────────┐             ┌─────────────────┐
│   DISCOVERY     │     │ IMPLEMENTATION  │             │   AUTOMATION    │
│                 │     │                 │             │                 │
│ /discover or    │     │ Read specs from │             │ rlm-build.sh    │
│ research-agent  │────▶│ RLM/specs/      │────────────▶│ rlm-test.sh     │
│                 │     │ and implement   │             │ rlm-sync.sh     │
└─────────────────┘     └─────────────────┘             └─────────────────┘
```

---

## Cursor

Cursor is an AI-first IDE that integrates seamlessly with RLM through multiple methods.

### Option 1: Cursor Rules (Recommended)
Add to `.cursor/rules` or `.cursorrules`:

```markdown
# RLM Method Integration

## Discovery Mode
When I say "discover [idea]" or want to start a new feature:
1. Read RLM/agents/research-agent.md for the full discovery process
2. Parse my idea and identify the core problem
3. Research competitors and best practices using web search
4. Ask clarifying questions by category (Business, Technical, Data, Security, UX)
5. Generate spec documents following RLM/templates/
6. Save outputs to RLM/specs/

## Implementation Mode
When implementing features:
1. ALWAYS read RLM/specs/constitution.md first for project standards
2. Check RLM/specs/features/ for the feature specification
3. Check RLM/specs/architecture/ for technical decisions
4. Follow TDD - write tests BEFORE implementation
5. Update RLM/progress/ with status as you work

## Context Optimization (Elite Context Engineering)
- Load only necessary context using RLM/config/mcp-configs/
- Use context primes from RLM/templates/primes/ for focused work
- Keep context minimal - read specs, implement, move on

## Quality Standards
- Follow constitution.md coding standards
- Minimum 80% test coverage
- All public functions documented
- Security-first approach
```

### Option 2: Run via Terminal in Cursor
```bash
# Open terminal in Cursor (Ctrl+`)

# Run discovery
./RLM/commands/rlm-discover.ps1 --idea "your idea"

# Run automated build
./RLM/commands/rlm-build.sh --mode supervised

# Check progress
./RLM/commands/rlm-report.sh summary
```

### Option 3: Custom Cursor Commands
Create `.cursor/commands/discover.md`:
```markdown
---
name: RLM Discover
description: Start AI-assisted spec creation with research
---

Run the RLM discovery process for a new project idea.

## Process
1. Ask the user for their project idea if not provided
2. Read RLM/agents/research-agent.md for the full workflow
3. Research phase: Analyze idea, find competitors, identify best practices
4. Question phase: Ask clarifying questions by priority
5. Draft phase: Generate spec documents
6. Refinement: Allow user to request changes

## Output Locations
- RLM/research/sessions/[session-id]/ - Research artifacts
- RLM/specs/constitution.md - Project standards
- RLM/specs/features/FTR-XXX/spec.md - Feature specs
- RLM/specs/architecture/overview.md - Technical design
- RLM/specs/epics/breakdown.md - Sprint planning

Use templates from RLM/templates/ for consistent formatting.
```

### Cursor Composer Integration
For larger tasks, use Cursor Composer with RLM:
```
@composer Read RLM/specs/features/FTR-001/spec.md and implement this feature
following TDD. Check RLM/specs/constitution.md for coding standards.
```

---

## GitHub Copilot

### Using Copilot Chat
In VS Code with Copilot Chat:

```
@workspace /explain Read RLM/agents/research-agent.md and help me discover specs for: [your idea]
```

Or create a custom chat participant by adding to `.github/copilot-instructions.md`:

```markdown
# RLM Method

This project uses the RLM (Research-Lead-Manage) method for AI-assisted development.

## Key Files
- RLM/specs/constitution.md - Project standards
- RLM/specs/features/ - Feature specifications
- RLM/agents/ - Agent prompts for different tasks

## Workflow
1. Discovery: Research idea → Generate questions → Create specs
2. Implementation: Read specs → TDD → Update progress
3. Review: Validate against acceptance criteria

When asked to "discover" or "research" an idea:
1. Follow the process in RLM/agents/research-agent.md
2. Generate structured findings
3. Ask clarifying questions using the categories: Business, Technical, UX, Data, Security
4. Create specs following templates in RLM/templates/
```

### Using Copilot CLI
```bash
# Use gh copilot to explain and run
gh copilot explain "./RLM/commands/rlm-discover.ps1 --idea 'task management app'"
```

---

## Claude Code (Anthropic CLI)

Claude Code is Anthropic's official CLI tool that provides first-class RLM integration through slash commands and direct terminal access.

### Native Slash Command (Recommended)
```bash
# Use the built-in /discover command
/discover Build a task management app with AI prioritization

# With options
/discover Add user authentication --codebase ./src --domain enterprise
```

The `/discover` command is defined in `.claude/commands/discover.md` and provides:
- Full research workflow with web search
- Prioritized clarifying questions
- Spec generation with templates
- Handoff to implementation

### Terminal Commands
```bash
# Run discovery script
./RLM/commands/rlm-discover.ps1 --idea "your project idea"

# Run automated build
./RLM/commands/rlm-build.sh --mode supervised

# Background execution (non-blocking)
./RLM/commands/utils/background-agent.sh start implementation-agent TASK-001 auto
```

### Direct Prompt (No Setup Required)
```
Read RLM/agents/research-agent.md and help me discover specs for:
A real-time collaboration tool for remote teams

Follow the 5-phase workflow:
1. Parse my idea
2. Research competitors and best practices
3. Ask clarifying questions by priority
4. Generate comprehensive specs
5. Create Master Architect handoff

Save outputs to RLM/specs/
```

### Claude Code Slash Command Setup
The `/discover` command is already configured in `.claude/commands/discover.md`.

To add more commands, create files in `.claude/commands/`:

**`.claude/commands/implement.md`**:
```markdown
---
description: Implement a feature from RLM specs
---

Implement the specified feature using RLM specifications.

1. Read RLM/specs/constitution.md for project standards
2. Read the feature spec from RLM/specs/features/[FEATURE_ID]/spec.md
3. Read architecture from RLM/specs/architecture/overview.md
4. Follow TDD: Write tests first, then implement
5. Ensure 80%+ test coverage
6. Update progress in RLM/progress/

Use context primes from RLM/templates/primes/ for efficiency.
```

**`.claude/commands/build.md`**:
```markdown
---
description: Run RLM automated build
---

Run the automated build process:
./RLM/commands/rlm-build.sh --mode supervised

Monitor progress and report any blockers.
```

### Elite Context Engineering with Claude Code
Claude Code supports the full RLM context optimization workflow:

```bash
# Analyze context before starting
./RLM/commands/utils/context-manager.sh analyze

# Use context primes for focused work
./RLM/commands/utils/context-manager.sh prime implementation

# Run with minimal context overhead
./RLM/commands/rlm-build.sh --task TASK-001
```

---

## Cline (VS Code Extension)

### Custom Instructions
Add to Cline settings or `.cline/instructions.md`:

```markdown
# RLM Method Integration

## Discovery Process
When starting a new project or feature, follow RLM discovery:

1. **Research Phase**
   - Analyze the project idea
   - Search for existing solutions and competitors
   - Identify best practices
   - Read existing codebase if brownfield project

2. **Question Phase**
   - Generate clarifying questions by category:
     - Business (Critical): Goals, users, timeline
     - Technical (High): Scale, integrations, constraints
     - Data (High): Storage, compliance, privacy
     - Security (Medium): Auth, encryption, audit
     - UX (Medium): Platforms, accessibility

3. **Draft Phase**
   - Create constitution.md with project standards
   - Create feature specs with user stories
   - Create architecture overview
   - Create epic breakdown for sprint planning

4. **Output Locations**
   - RLM/specs/constitution.md
   - RLM/specs/features/FTR-XXX/spec.md
   - RLM/specs/architecture/overview.md
   - RLM/specs/epics/breakdown.md

## Implementation
After discovery, implement using TDD:
1. Read the feature spec
2. Write tests first
3. Implement to pass tests
4. Update progress in RLM/progress/
```

### Cline MCP Server (Advanced)
You can also create an MCP server for Cline - see `RLM/docs/MCP-SERVER.md`

---

## Windsurf

### Cascade Rules
Add to `.windsurfrules`:

```markdown
# RLM Method

Use the Research-Lead-Manage method for this project.

## Spec Locations
- Constitution: RLM/specs/constitution.md
- Features: RLM/specs/features/
- Architecture: RLM/specs/architecture/
- Tasks: RLM/tasks/

## Discovery Command
When asked to discover or research a new idea:
1. Read RLM/agents/research-agent.md for the process
2. Generate research findings
3. Ask clarifying questions
4. Create spec documents following RLM/templates/

## Implementation
Always follow specs and use TDD approach.
```

---

## Aider

### Aider Configuration
Add to `.aider.conf.yml`:

```yaml
# RLM Integration
read:
  - RLM/specs/constitution.md
  - RLM/agents/research-agent.md
  - RLM/agents/master-architect.md

# Custom prompts
architect-prompt: |
  Follow the RLM method. Read specs from RLM/specs/ before making changes.
  Use TDD - write tests first.
```

### Running Discovery with Aider
```bash
aider --read RLM/agents/research-agent.md

# Then in aider:
/ask Help me discover specs for a task management app following the research-agent process
```

---

## JetBrains AI Assistant

### Custom Prompts
In Settings → AI Assistant → Custom Prompts, add:

**Discovery Prompt:**
```
You are helping with the RLM discovery process.

Read the research agent instructions from RLM/agents/research-agent.md.

For the idea: {{SELECTION}}

1. Analyze the core problem
2. Research existing solutions
3. Generate clarifying questions
4. Create spec documents

Output specs to RLM/specs/ following the templates in RLM/templates/
```

---

## Continue.dev

### Custom Slash Command
Add to `.continue/config.json`:

```json
{
  "slashCommands": [
    {
      "name": "discover",
      "description": "Start RLM discovery for an idea",
      "prompt": "Read RLM/agents/research-agent.md and help me discover specs for: {{{ input }}}\n\nFollow the phased approach:\n1. Research the idea\n2. Ask clarifying questions\n3. Generate spec documents\n\nSave outputs to RLM/specs/"
    }
  ],
  "contextProviders": [
    {
      "name": "rlm-specs",
      "params": {
        "directories": ["RLM/specs", "RLM/agents"]
      }
    }
  ]
}
```

---

## Generic Integration (Any AI Agent)

### The Universal Approach

Any AI coding agent can use RLM by simply reading the agent prompts:

1. **Point the agent to read**: `RLM/agents/research-agent.md`
2. **Tell it your idea**
3. **Ask it to follow the process** in the prompt
4. **Have it save outputs** to `RLM/specs/`

### Example Prompt for Any Agent

```
I want to use the RLM method for spec creation.

1. Read the file RLM/agents/research-agent.md - this contains the discovery process
2. My project idea is: [YOUR IDEA HERE]
3. Follow the phases:
   - Research: Analyze idea, find competitors, identify gaps
   - Questions: Ask me clarifying questions by category
   - Draft: Generate spec documents
4. Save outputs to:
   - RLM/specs/constitution.md
   - RLM/specs/features/FTR-001/spec.md
   - RLM/specs/architecture/overview.md
   - RLM/specs/epics/breakdown.md
```

---

## Running the PowerShell Script

If your AI agent supports terminal commands, you can run the full automated flow:

```powershell
# Basic
./RLM/commands/rlm-discover.ps1 --idea "your project idea"

# With specific AI provider
./RLM/commands/rlm-discover.ps1 --idea "your idea" --provider openai --model gpt-4o

# With local Ollama
./RLM/commands/rlm-discover.ps1 --idea "your idea" --provider ollama --model llama3

# Interactive mode (asks questions step by step)
./RLM/commands/rlm-discover.ps1 --idea "your idea" --mode interactive

# Auto mode (minimal interaction)
./RLM/commands/rlm-discover.ps1 --idea "your idea" --mode auto
```

---

## Best Practices

1. **Always start with discovery** before implementation
2. **Keep specs updated** as requirements change
3. **Use the constitution** for consistent standards
4. **Reference specs in commits** (e.g., "Implements FTR-001")
5. **Run discovery iteratively** for new features on existing projects

---

## Troubleshooting

### Agent doesn't know about RLM
→ Explicitly tell it to read `RLM/agents/research-agent.md`

### Agent creates files in wrong location
→ Specify exact paths: `RLM/specs/features/FTR-001/spec.md`

### Agent skips questions
→ Tell it: "Ask me the clarifying questions from each category before generating specs"

### Want to use a specific AI model
→ Set environment variable: `$env:RLM_AI_MODEL = "gpt-4o"`

---

## Complete IDE Comparison

| Feature | Claude Code | Cursor | Windsurf | VS Code + Copilot | Aider |
|---------|-------------|--------|----------|-------------------|-------|
| **Native slash commands** | ✅ /discover | ✅ Custom commands | ✅ Cascade | ❌ | ❌ |
| **Rules files** | ❌ | ✅ .cursorrules | ✅ .windsurfrules | ❌ | ✅ .aider.conf.yml |
| **Terminal integration** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **Web search** | ✅ Built-in | ✅ Built-in | ✅ Built-in | ❌ | ❌ |
| **Context optimization** | ✅ Full | ✅ Partial | ✅ Partial | ❌ | ✅ Read-only files |
| **Background agents** | ✅ Full | ✅ Via terminal | ✅ Via terminal | ✅ Via terminal | ❌ |
| **MCP support** | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## Best Practices for Any IDE

### 1. Always Start with Discovery
```bash
# Before writing ANY code
/discover [your idea]
# or
./RLM/commands/rlm-discover.ps1 --idea "your idea"
```

### 2. Read Specs Before Implementing
```
Always read these files first:
1. RLM/specs/constitution.md - Project standards
2. RLM/specs/features/[FTR-XXX]/spec.md - Feature requirements
3. RLM/specs/architecture/overview.md - Technical design
```

### 3. Use Context Optimization
```bash
# Analyze context usage
./RLM/commands/utils/context-manager.sh analyze

# Apply optimizations (86% token savings!)
./RLM/commands/utils/context-manager.sh optimize
```

### 4. Follow TDD
```
1. Read the spec
2. Write tests FIRST
3. Implement to pass tests
4. Refactor
5. Verify coverage >= 80%
```

### 5. Track Progress
```bash
# Update progress after each task
./RLM/commands/rlm-report.sh summary

# Sync with team
./RLM/commands/rlm-sync.sh push
```

---

## Summary: The Universal RLM Workflow

Regardless of which IDE you use, the RLM workflow remains the same:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RLM WORKFLOW (Any IDE)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. DISCOVERY                                                                │
│     ├── /discover or rlm-discover.ps1                                       │
│     ├── AI researches competitors, best practices                           │
│     ├── Generates clarifying questions                                      │
│     └── Creates specs in RLM/specs/                                         │
│                                                                              │
│  2. REVIEW                                                                   │
│     ├── Review generated specs                                              │
│     ├── Refine as needed                                                    │
│     └── Approve for implementation                                          │
│                                                                              │
│  3. IMPLEMENTATION                                                           │
│     ├── rlm-build.sh --mode supervised                                      │
│     ├── AI agents implement with TDD                                        │
│     ├── Tests written first, then code                                      │
│     └── Progress tracked automatically                                      │
│                                                                              │
│  4. TESTING                                                                  │
│     ├── rlm-test.sh all --fix                                               │
│     ├── AI analyzes and fixes failures                                      │
│     └── Coverage verified (>= 80%)                                          │
│                                                                              │
│  5. SYNC & DEPLOY                                                            │
│     ├── rlm-sync.sh push                                                    │
│     ├── Progress reported to PM                                             │
│     └── Ready for deployment                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**The key insight**: RLM specifications are IDE-agnostic markdown files. Any AI agent that can read files can follow the RLM workflow. This means you can:
- Switch IDEs without losing context
- Use multiple IDEs on the same project
- Share specs with team members using different tools
- Maintain consistent quality across all development

---

## Getting Started Checklist

- [ ] Clone/init your project with RLM structure
- [ ] Configure your IDE (see sections above)
- [ ] Run `/discover` or `rlm-discover.ps1` with your first idea
- [ ] Review generated specs
- [ ] Run `rlm-build.sh --mode supervised`
- [ ] Celebrate your first AI-automated feature!
