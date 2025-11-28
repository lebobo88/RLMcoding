# RLM AI Agent Development System

**Transform Ideas into Production Code with AI Agents in Any IDE**

The RLM (Research-Lead-Manage) system is a comprehensive AI agent workflow that enables fully automated development from initial idea discovery through implementation to production deployment.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/your-org/rlm-system)

**Works with:** Claude Code • Cursor • Windsurf • VS Code + Copilot • Aider • Continue.dev • Any AI Agent

---

## 🚀 Quick Start

### Option 1: AI-Powered Discovery (Recommended)
```bash
# Claude Code
/discover Build a task management app with AI prioritization

# Or PowerShell (any IDE)
./RLM/commands/rlm-discover.ps1 --idea "Your project idea"

# Then run implementation
./RLM/commands/rlm-build.sh --mode supervised
```

### Option 2: Traditional Setup
```bash
# 1. Initialize RLM
./RLM/commands/rlm-init.sh --ide cursor --tech-stack node

# 2. Configure
cp RLM/.env.example .env
nano .env  # Add your GitHub token and AI API key

# 3. Discover your feature (AI-powered spec generation)
/discover Build a user authentication system

# 4. Run automated build!
./RLM/commands/rlm-build.sh --mode supervised
```

**See [Quick Start Guide](RLM/docs/QUICK-START.md) for detailed walkthrough.**

---

## 🎯 What is RLM?

RLM is an automated AI agent development workflow that:

✅ **Discovers requirements** from your raw ideas with AI-powered research
✅ **Creates specifications** through intelligent clarifying questions
✅ **Designs architecture** with the Master Architect Agent
✅ **Implements code** using Test-Driven Development
✅ **Runs comprehensive tests** automatically
✅ **Debugs and fixes** issues autonomously
✅ **Deploys to production** with CI/CD automation
✅ **Works with any IDE** - Claude Code, Cursor, Windsurf, VS Code, and more  

### The Problem

Traditional AI-assisted development:
- ❌ Loses context across sessions
- ❌ Requires manual coordination
- ❌ Lacks traceability
- ❌ Produces untested code
- ❌ Has no PM integration

### The Solution

RLM provides:
- ✅ Persistent context in version control
- ✅ Automated agent orchestration
- ✅ Complete traceability
- ✅ TDD with comprehensive tests
- ✅ Seamless PM-developer workflow

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              PRODUCT MANAGEMENT WEB APP                     │
│       Research • Roadmapping • Sprint Planning              │
└────────────────────┬────────────────────────────────────────┘
                     │ Push Specs
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  GITHUB REPOSITORY                          │
│           Version-Controlled Specifications                 │
└────────────────────┬────────────────────────────────────────┘
                     │ Pull Instructions
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           LOCAL DEVELOPMENT (AI AGENTS)                     │
│  Master Architect → Implementation → Testing → DevOps       │
│  • Code Generation (TDD)                                    │
│  • Automated Testing                                        │
│  • CI/CD Execution                                          │
└────────────────────┬────────────────────────────────────────┘
                     │ Push Progress
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FEEDBACK LOOP (Back to PM)                     │
│  Completed Work • Test Results • Issues • Metrics          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Key Features

### 1. AI-Powered Discovery (New!)
Transform raw ideas into production-ready specs:
```bash
/discover Build a real-time chat app with AI moderation
```
The Research Agent will:
- Analyze your idea and research competitors
- Ask prioritized clarifying questions
- Generate comprehensive specifications
- Create architecture recommendations

### 2. Multi-Agent System
- **Research Agent** - Idea analysis and spec creation
- **Master Architect** - System design and technical decisions
- **Implementation Agent** - TDD code generation
- **Testing Agent** - Comprehensive test automation
- **DevOps Agent** - CI/CD and deployment

### 3. Universal IDE Compatibility
Works with **any AI coding environment**:
- **Claude Code** - Native `/discover` slash command
- **Cursor** - Custom rules and commands
- **Windsurf** - Cascade integration
- **VS Code + Copilot** - Workspace commands
- **Aider** - CLI integration
- **Any AI Agent** - Just read the agent prompts!

### 4. Three Automation Modes

| Mode | Description | Best For |
|------|-------------|----------|
| **Auto** | Full autonomy | Well-defined tasks |
| **Supervised** | Approval at key points | New features, complex changes |
| **Manual** | Step-by-step control | Learning, debugging |

### 5. Complete Automation
```bash
# Discover specs from idea
/discover Your project idea here

# Single command implements entire feature
./RLM/commands/rlm-build.sh --mode auto

# Automatic GitHub sync
./RLM/commands/rlm-sync.sh both

# Comprehensive testing with auto-fix
./RLM/commands/rlm-test.sh all --fix
```

### 6. Comprehensive Observability
- **Event Logging** - Structured event capture with SQLite persistence
- **Real-time Monitoring** - Live event streams via CLI and WebSocket
- **AI Summarization** - Automatic event summarization using Claude Haiku
- **Web Dashboard** - Real-time visualization and intervention controls
- **Session Tracking** - Color-coded session identification

```bash
# Live event monitoring
./RLM/commands/rlm-observe.sh tail

# Activity summary
./RLM/commands/rlm-observe.sh summary

# Start web dashboard
./RLM/commands/rlm-observe-server.sh start
```

**See [Observability Guide](RLM/docs/OBSERVABILITY.md) for complete details.**

### 7. IDE Agnostic
Works with: **Claude Code** • **Cursor** • **Windsurf** • **VS Code + Copilot** • **Aider** • **Continue.dev** • **JetBrains AI** • **Any AI Agent**

---

## 📁 Project Structure

```
your-project/
├── RLM/                          # AI Agent System
│   ├── config/                   # System configuration
│   ├── specs/                    # All specifications
│   │   ├── constitution.md       # Project standards
│   │   ├── requirements/         # Business requirements
│   │   ├── features/             # Feature specs
│   │   └── architecture/         # Technical design
│   ├── tasks/                    # Task management
│   │   ├── active/               # Current tasks
│   │   ├── completed/            # Finished tasks
│   │   └── blocked/              # Blocked tasks
│   ├── progress/                 # Progress tracking
│   ├── issues/                   # Issue management
│   ├── agents/                   # Agent prompts
│   ├── commands/                 # Automation scripts
│   ├── templates/                # Document templates
│   └── docs/                     # Documentation
└── [Your application code]
```

---

## 🔧 Core Commands

| Command | Purpose |
|---------|---------|
| `/discover` | AI-powered spec generation from ideas (Claude Code) |
| `rlm-discover` | Discovery script for any IDE |
| `rlm-init` | Initialize RLM system |
| `rlm-sync` | Sync with GitHub (bidirectional) |
| `rlm-build` | Automated implementation |
| `rlm-test` | Run comprehensive tests |
| `rlm-report` | Generate progress reports |
| `rlm-observe` | Monitor agent activities (CLI) |
| `rlm-observe-server` | Start observability web dashboard |

**See [Commands Guide](RLM/docs/RLM-Commands-Guide.md) for full reference.**
**See [IDE Integration Guide](RLM/docs/IDE-INTEGRATION.md) for setup in your IDE.**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Quick Start](RLM/docs/QUICK-START.md) | 5-minute setup guide |
| [**IDE Integration**](RLM/docs/IDE-INTEGRATION.md) | **Setup for Claude Code, Cursor, Windsurf, VS Code, Aider** |
| [User Guide](RLM/docs/RLM-User-Guide.md) | Complete walkthrough from discovery to deployment |
| [Commands Guide](RLM/docs/RLM-Commands-Guide.md) | Command reference including discover |
| [Installation](RLM/docs/INSTALLATION.md) | Detailed installation instructions |
| [Token Tracking](RLM/docs/TOKEN-TRACKING.md) | Cost management and optimization |
| [**Elite Context Engineering**](RLM/docs/ELITE-CONTEXT-ENGINEERING.md) | **Advanced context management (86% token savings)** |
| [**Observability**](RLM/docs/OBSERVABILITY.md) | **Complete monitoring and debugging system** |
| [System Overview](RLM/docs/RLM-System-Overview.md) | Architecture overview |
| [Project Structure](RLM/docs/RLM-Project-Structure.md) | Directory structure guide |

---

## 💡 Example Usage

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

```bash
./RLM/commands/rlm-sync.sh pull    # Pull spec from GitHub
./RLM/commands/rlm-build.sh --mode supervised  # Build
```

### AI Agents Execute

- **Master Architect** designs JWT structure and API contract
- **Implementation Agent** writes tests, implements code
- **Testing Agent** runs tests, validates coverage
- **Result**: Production-ready feature in minutes

---

## 📈 Benefits

### For Developers
- ⚡ **10x faster** implementation
- 🎯 Focus on architecture, not boilerplate
- ✅ Comprehensive tests automatically generated
- 📝 Complete documentation created
- 💰 **86% lower AI costs** with context engineering

### For Product Managers
- 👁️ Real-time visibility into progress
- 📊 Accurate velocity metrics
- 🚫 Early blocker detection
- 🔄 Fast iteration cycles

### For Teams
- 🤝 Clear communication via structured specs
- 📚 Complete knowledge preservation
- 🔍 Full traceability of decisions
- ⚙️ Consistent code quality
- 💰 **Predictable AI costs** with token tracking

---

## 🛠️ Technology Stack

### Supported Languages
- Node.js / TypeScript
- Python
- .NET / C#
- Go

### Supported IDEs
- Cursor (recommended)
- Windsurf
- VS Code + Copilot
- Kiro
- Antigravity
- Claude Code CLI

### AI Models
- Claude (Anthropic) - recommended
- GPT-4 (OpenAI)
- Gemini (Google)

---

## 📦 Installation

### Prerequisites
- Git
- Node.js 18+ or Python 3.11+
- AI API key (Anthropic, OpenAI, or Google)
- GitHub account and token

### Install
```bash
# Clone your project
git clone your-repo
cd your-project

# Initialize RLM
./RLM/commands/rlm-init.sh

# Configure
cp RLM/.env.example .env
nano .env  # Add credentials

# Verify
./RLM/commands/rlm-init.sh --check
```

**See [Installation Guide](RLM/docs/INSTALLATION.md) for detailed instructions.**

---

## 🎓 Learning Resources

1. **Read Quick Start** - Get running in 5 minutes
2. **Review Example** - Check `RLM/specs/features/FTR-001-example/`
3. **Create Constitution** - Define your project standards
4. **Write First Spec** - Use templates from `RLM/templates/`
5. **Run Build** - Try supervised mode first

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

Built upon research and best practices from:
- **BMAD Method** - Multi-agent AI development framework
- **GitHub Spec-Kit** - Spec-driven development toolkit
- **OpenSpec** - Structured specifications for AI
- **Kiro IDE** - Spec-driven development approach

---

## 📞 Support

- 📚 **Documentation**: `RLM/docs/` directory
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/rlm-system/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-org/rlm-system/discussions)
- 📧 **Email**: support@rlm-system.dev

---

## 🌟 Star History

If this project helps you, please consider giving it a ⭐️!

---

**Built with ❤️ by developers who believe AI should amplify human creativity, not replace it.**

---

## 🚦 Status

- ✅ Core system implemented
- ✅ Multi-agent orchestration
- ✅ CI/CD integration
- ✅ Comprehensive documentation
- 🚧 Web app for PM (coming soon)
- 🚧 Advanced analytics dashboard (coming soon)

---

**Ready to transform your development workflow?**

```bash
./RLM/commands/rlm-init.sh && ./RLM/commands/rlm-build.sh --mode supervised
```

🚀 **Let's build something amazing together!**

