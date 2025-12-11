# RLM AI Agent Development System

**Transform Ideas into Production Code with AI Agents**

The RLM (Research-Lead-Manage) system is a comprehensive AI agent workflow that enables fully automated development from initial idea discovery through implementation to production deployment.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.7-blue.svg)](https://github.com/lebobo88/RLMcoding)

**Works with:** Claude Code | Cursor | Windsurf | VS Code + Copilot | Aider | Any AI Agent

---

## Quick Start

### Option 1: Claude Code (Recommended)

```bash
# Complete 9-phase automation from idea to verified code
/cc-full Build a task management app with AI prioritization

# Or step-by-step approach
/discover Build a task management app with AI prioritization
```

### Option 2: Any AI Agent (Cursor, Windsurf, VS Code, Aider, etc.)

Tell your AI:
```
Read RLM/prompts/01-DISCOVER.md and help me discover specs for:
Build a task management app with AI prioritization
```

**See [RLM/START-HERE.md](RLM/START-HERE.md) for detailed walkthrough.**

---

## What is RLM?

RLM is an automated AI agent development workflow that:

- **Discovers requirements** from your raw ideas with AI-powered research
- **Creates specifications** through intelligent clarifying questions
- **Designs architecture** with the Master Architect Agent
- **Implements code** using Test-Driven Development
- **Runs comprehensive tests** automatically
- **Debugs and fixes** issues autonomously
- **Works with any IDE** - Claude Code, Cursor, Windsurf, VS Code, and more

### The Problem

Traditional AI-assisted development:
- Loses context across sessions
- Requires manual coordination
- Lacks traceability
- Produces untested code
- Has no PM integration

### The Solution

RLM provides:
- Persistent context in version control
- Automated agent orchestration
- Complete traceability
- TDD with comprehensive tests
- Seamless PM-developer workflow

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCT MANAGEMENT                        │
│          Research • Roadmapping • Sprint Planning            │
└────────────────────┬────────────────────────────────────────┘
                     │ Create Specs
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  VERSION CONTROL (GitHub)                    │
│           Version-Controlled Specifications                  │
└────────────────────┬────────────────────────────────────────┘
                     │ AI Reads Instructions
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           LOCAL DEVELOPMENT (AI AGENTS)                      │
│  Master Architect → Implementation → Testing → DevOps        │
│  • Code Generation (TDD)                                     │
│  • Automated Testing                                         │
│  • CI/CD Execution                                           │
└────────────────────┬────────────────────────────────────────┘
                     │ Push Progress
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FEEDBACK LOOP (Back to PM)                      │
│  Completed Work • Test Results • Issues • Metrics            │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. AI-Powered Discovery

Transform raw ideas into production-ready specs:

**Claude Code:**
```bash
/discover Build a real-time chat app with AI moderation
```

**Any AI:**
```
Read RLM/prompts/01-DISCOVER.md and help me discover specs for:
Build a real-time chat app with AI moderation
```

The Research Agent will:
- Analyze your idea and research competitors
- Ask prioritized clarifying questions (3-4 rounds)
- Generate comprehensive specifications
- Create architecture recommendations

### 2. Multi-Agent System

| Agent | Purpose |
|-------|---------|
| **Research Agent** | Idea analysis, competitor research, spec creation |
| **Master Architect** | System design and technical decisions |
| **Designer Agent** | UI/UX design systems, tokens, accessibility |
| **Implementation Agent** | TDD code generation |
| **Testing Agent** | Comprehensive test automation |
| **Reviewer Agent** | Code review, security, compliance |
| **Verifier Agent** | E2E testing, accessibility validation |

### 3. Universal IDE Compatibility

Works with **any AI coding environment** with native configuration files:
- **Claude Code** - Native slash commands (`/discover`, `/cc-full`, etc.) via `.claude/commands/`
- **Cursor** - Native slash commands via `.cursor/commands/` and rules via `.cursor/rules/`
- **VS Code + Copilot** - Prompt files via `.github/prompts/` and instructions via `.github/instructions/`
- **Windsurf** - Cascade integration with `AGENTS.md`
- **Aider** - CLI integration via `.aider.conf.yml`
- **Any AI Agent** - Read prompts from `RLM/prompts/` or use `AGENTS.md`

### 4. Three Automation Modes

| Mode | Description | Best For |
|------|-------------|----------|
| **AUTO** | Full autonomy | Well-defined tasks |
| **SUPERVISED** | Approval at key points | New features, complex changes |
| **MANUAL** | Step-by-step control | Learning, debugging |

### 5. Complete 9-Phase Pipeline

```
Phase 1: DISCOVER        → PRD.md, constitution.md
Phase 2: DESIGN SYSTEM   → Design tokens, component library (UI projects)
Phase 3: SPECIFICATIONS  → Feature specs, architecture
Phase 4: FEATURE DESIGN  → UI/UX specs per feature (UI projects)
Phase 5: TASKS           → Fine-grained tasks with dependencies
Phase 6: IMPLEMENTATION  → TDD with integrated review
Phase 7: QUALITY         → Design QA + Code Review + Tests
Phase 8: VERIFICATION    → E2E tests per feature
Phase 9: REPORT          → Complete project summary
```

---

## Core Commands

### Claude Code Slash Commands

| Command | Purpose |
|---------|---------|
| `/discover [idea]` | Transform idea into PRD via research and questions |
| `/create-specs` | Generate technical specs from PRD |
| `/create-tasks` | Break features into fine-grained tasks |
| `/implement TASK-XXX` | Implement single task with TDD |
| `/implement all` | Implement all active tasks |
| `/implement resume` | Resume interrupted session |

### Enhanced Commands (v2.7)

| Command | Phase | Purpose |
|---------|-------|---------|
| `/cc-full [idea]` | All | Complete 9-phase automation |
| `/cc-full --from-prd` | 2-9 | Start from existing PRD |
| `/cc-discover [idea]` | 1 | Discovery with research agent |
| `/cc-design system` | 2 | Generate design system |
| `/cc-create-specs` | 3 | Generate specs from PRD |
| `/cc-design feature FTR-XXX` | 4 | Feature UI/UX specs |
| `/cc-create-tasks` | 5 | Break features into tasks |
| `/cc-implement [task\|all]` | 6 | TDD with parallel agents |
| `/cc-design qa` | 7 | 117-point design QA |
| `/cc-review` | 7 | Code review |
| `/cc-test` | 7 | Testing with coverage |
| `/cc-verify FTR-XXX` | 8 | E2E feature verification |
| `/cc-debug` | - | Diagnose and fix state issues |

### Cursor Slash Commands

Native slash commands available via `.cursor/commands/`:

| Command | Purpose |
|---------|---------|
| `/discover [idea]` | Transform idea into PRD |
| `/create-specs` | Generate specs from PRD |
| `/create-tasks` | Break features into tasks |
| `/implement [task]` | Implement single task with TDD |
| `/implement-all` | Implement all active tasks |
| `/resume` | Resume interrupted session |
| `/rlm-status` | Show project status |
| `/rlm-test` | Run and fix tests |

### VS Code + Copilot Prompt Files

Prompt files available via `.github/prompts/`:

| Prompt | Purpose |
|--------|---------|
| `discover.prompt.md` | Transform idea into PRD |
| `create-specs.prompt.md` | Generate specs from PRD |
| `create-tasks.prompt.md` | Break features into tasks |
| `implement.prompt.md` | Implement single task |
| `implement-all.prompt.md` | Implement all tasks |
| `resume.prompt.md` | Resume session |
| `status.prompt.md` | Show project status |
| `test.prompt.md` | Run and fix tests |

### Using with Any AI (Manual Approach)

Tell your AI to read the appropriate prompt:

```
Read RLM/prompts/01-DISCOVER.md and help me discover specs for: [your idea]
Read RLM/prompts/02-CREATE-SPECS.md and generate specs from my PRD
Read RLM/prompts/03-CREATE-TASKS.md and break down features into tasks
Read RLM/prompts/04-IMPLEMENT-TASK.md and implement TASK-001
Read RLM/prompts/05-IMPLEMENT-ALL.md and implement all tasks
Read RLM/prompts/06-RESUME.md and resume my previous session
```

---

## Project Structure

```
your-project/
├── AGENTS.md                     # Cross-platform AI instructions
├── CLAUDE.md                     # Claude Code specific instructions
├── .cursorrules                  # Cursor legacy rules (deprecated)
├── .aider.conf.yml               # Aider configuration
├── .github/
│   ├── copilot-instructions.md   # GitHub Copilot instructions
│   ├── prompts/                  # Copilot slash commands
│   └── instructions/             # Path-specific Copilot rules
├── .cursor/
│   ├── commands/                 # Cursor slash commands
│   └── rules/                    # Cursor project rules
├── .claude/
│   ├── commands/                 # Claude Code slash commands
│   ├── agents/                   # Sub-agent configurations
│   └── hooks/                    # Lifecycle event handlers
├── RLM/                          # AI Agent System
│   ├── START-HERE.md             # Entry point - read this first
│   ├── prompts/                  # Workflow prompts (copy to any AI)
│   │   ├── 01-DISCOVER.md        # Idea → PRD
│   │   ├── 02-CREATE-SPECS.md    # PRD → Specs
│   │   ├── 03-CREATE-TASKS.md    # Specs → Tasks
│   │   ├── 04-IMPLEMENT-TASK.md  # Single task TDD
│   │   ├── 05-IMPLEMENT-ALL.md   # All tasks
│   │   ├── 06-RESUME.md          # Resume session
│   │   ├── 07-TEST.md            # Testing
│   │   ├── 08-REPORT.md          # Reporting
│   │   └── patterns/             # Reusable reasoning patterns
│   ├── specs/                    # All specifications
│   │   ├── PRD.md                # Product Requirements Document
│   │   ├── constitution.md       # Project standards
│   │   ├── features/             # Feature specs (FTR-XXX)
│   │   ├── architecture/         # Technical design
│   │   └── design/               # Design system (UI projects)
│   ├── tasks/                    # Task management
│   │   ├── active/               # Current tasks
│   │   ├── completed/            # Finished tasks
│   │   └── blocked/              # Blocked tasks
│   ├── progress/                 # Progress tracking
│   │   ├── status.json           # Current state
│   │   ├── checkpoint.json       # Incremental tracking
│   │   └── cc-config.json        # Configuration
│   ├── agents/                   # Agent prompt definitions
│   ├── templates/                # Document templates
│   ├── research/                 # Project research (auto-detected)
│   └── docs/                     # Documentation
└── [Your application code]
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [START-HERE.md](RLM/START-HERE.md) | Entry point and quick start |
| [User Guide](RLM/docs/USER-GUIDE.md) | Complete step-by-step guide |
| [Quick Reference](RLM/docs/QUICK-REFERENCE.md) | One-page command reference |
| [Claude Code Guide](RLM/docs/CLAUDE-CODE-GUIDE.md) | Sub-agent workflow guide |
| [Template Reference](RLM/docs/TEMPLATE-REFERENCE.md) | How to use templates |
| [Troubleshooting](RLM/docs/TROUBLESHOOTING.md) | Common issues and solutions |
| [UI Framework Reference](RLM/docs/UI-FRAMEWORK-REFERENCE.md) | Design token implementation |
| [Design Patterns Library](RLM/docs/DESIGN-PATTERNS-LIBRARY.md) | UI/UX pattern reference |
| [Accessibility Guide](RLM/docs/ACCESSIBILITY-GUIDE.md) | WCAG compliance guide |
| [What's New](RLM/docs/WHATS-NEW.md) | Version changelog |

---

## Example Usage

### Product Manager Creates Feature Spec

```markdown
# Feature: User Login

## Acceptance Criteria
- Email/password validation
- JWT token generation
- Rate limiting (5 attempts/15min)
- Session management

## Technical Requirements
- Endpoint: POST /api/auth/login
- Security: bcrypt + JWT
- Performance: < 100ms response
```

### Developer Runs Automation

**Claude Code:**
```bash
/cc-full --from-prd    # Complete automation from PRD
```

**Any AI:**
```
Read RLM/prompts/02-CREATE-SPECS.md and generate specs from my PRD
```

### AI Agents Execute

- **Master Architect** designs JWT structure and API contract
- **Implementation Agent** writes tests, implements code
- **Testing Agent** runs tests, validates coverage
- **Result**: Production-ready feature in minutes

---

## Benefits

### For Developers
- 10x faster implementation
- Focus on architecture, not boilerplate
- Comprehensive tests automatically generated
- Complete documentation created

### For Product Managers
- Real-time visibility into progress
- Accurate velocity metrics
- Early blocker detection
- Fast iteration cycles

### For Teams
- Clear communication via structured specs
- Complete knowledge preservation
- Full traceability of decisions
- Consistent code quality

---

## Technology Stack

### Supported Languages
- Node.js / TypeScript
- Python
- .NET / C#
- Go

### Supported IDEs
- Claude Code (recommended)
- Cursor
- Windsurf
- VS Code + Copilot
- Aider
- Any AI coding assistant

### AI Models
- Claude Sonnet/Opus 4.5+(Anthropic) - recommended
- GPT-5+ (OpenAI)
- Gemini 2.5+ (Google)

---

## Getting Started

### Prerequisites
- Git
- Node.js 18+ or Python 3.11+
- AI API key (Anthropic, OpenAI, or Google)

### Setup

1. **Ensure RLM folder exists** in your project with:
   - `RLM/prompts/` - Workflow prompts
   - `RLM/templates/` - Document templates
   - `RLM/specs/` - Specifications (generated)
   - `RLM/tasks/` - Tasks (generated)

2. **Start Discovery**:
   ```
   /discover [your project idea]
   ```
   Or tell your AI:
   ```
   Read RLM/prompts/01-DISCOVER.md and help me discover specs for: [your idea]
   ```

3. **Answer Questions** - The AI will ask 12-18 questions in 3-4 rounds

4. **Review & Implement**:
   - Review generated PRD at `RLM/specs/PRD.md`
   - Generate specs: `/create-specs`
   - Create tasks: `/create-tasks`
   - Implement: `/implement all`

---

## Learning Resources

1. **Read START-HERE.md** - Get oriented in 5 minutes
2. **Review Example** - Check `RLM/specs/features/FTR-001-example/`
3. **Create Constitution** - Define your project standards
4. **Write First Spec** - Use templates from `RLM/templates/`
5. **Run Implementation** - Try SUPERVISED mode first

---

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE) file

---

## Acknowledgments

Built upon research and best practices from:
- **BMAD Method** - Multi-agent AI development framework
- **GitHub Spec-Kit** - Spec-driven development toolkit
- **OpenSpec** - Structured specifications for AI
- **Kiro IDE** - Spec-driven development approach
- **IndyDevDan** - YouTube Channel for Elite Context Engineering with Claude Code

---

## Support

- **Documentation**: `RLM/docs/` directory
- **Email**: rob@robleemedia.com

---

## IDE Configuration Files

| File/Directory | IDE | Purpose |
|----------------|-----|---------|
| `AGENTS.md` | All | Cross-platform AI instructions |
| `CLAUDE.md` | Claude Code | Detailed Claude Code instructions |
| `.cursorrules` | Cursor | Legacy rules (deprecated, use `.cursor/rules/`) |
| `.cursor/rules/` | Cursor | Project rules with glob patterns |
| `.cursor/commands/` | Cursor | Native slash commands |
| `.github/copilot-instructions.md` | VS Code + Copilot | Repository-wide instructions |
| `.github/prompts/` | VS Code + Copilot | Reusable prompt files |
| `.github/instructions/` | VS Code + Copilot | Path-specific instructions |
| `.aider.conf.yml` | Aider | CLI configuration |
| `.continue/config.json` | Continue.dev | Slash commands and context |
| `.claude/commands/` | Claude Code | Slash command definitions |
| `.claude/agents/` | Claude Code | Sub-agent configurations |

---

## Status

- Core system implemented
- Multi-agent orchestration
- Comprehensive documentation
- 9-phase pipeline with TDD
- Native IDE configurations for Claude Code, Cursor, and Copilot

---

**Ready to transform your development workflow?**

```bash
/cc-full [your project idea]
```

Or tell your AI:
```
Read RLM/START-HERE.md and help me get started
```

**Let's build something amazing together!**
