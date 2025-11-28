# RLM Method - GitHub Copilot Instructions

This project uses the RLM (Research-Lead-Manage) method for AI-assisted development.

## Project Structure

```
RLM/
├── specs/           # Specifications
│   ├── constitution.md      # Project standards
│   ├── features/            # Feature specs (FTR-XXX)
│   ├── architecture/        # Technical architecture
│   └── epics/              # Sprint planning
├── agents/          # Agent prompts
│   ├── research-agent.md    # Discovery process
│   ├── master-architect.md  # Architecture design
│   └── implementation-agent.md  # Coding standards
├── templates/       # Document templates
├── tasks/          # Active/completed tasks
└── progress/       # Progress tracking
```

## Discovery Process

When I ask you to "discover" or "research" an idea:

1. Read `RLM/agents/research-agent.md` for the detailed process
2. Research the idea:
   - Identify the core problem
   - Find existing solutions/competitors
   - Note best practices
3. Ask clarifying questions in these categories:
   - **Business** (Critical): What's the goal? Who are users? Timeline?
   - **Technical** (High): Expected scale? Tech constraints? Integrations?
   - **Data** (High): What data? Compliance needs? Privacy?
   - **Security** (Medium): Auth method? Encryption? Audit logging?
   - **UX** (Medium): Platforms? Accessibility? Key workflows?
4. Generate spec documents:
   - `RLM/specs/constitution.md` - Project standards
   - `RLM/specs/features/FTR-001/spec.md` - Feature specifications
   - `RLM/specs/architecture/overview.md` - Technical architecture
   - `RLM/specs/epics/breakdown.md` - Sprint planning

## Implementation

When implementing features:

1. Read the relevant spec from `RLM/specs/features/`
2. Follow TDD - write tests first
3. Check `RLM/specs/constitution.md` for coding standards
4. Reference `RLM/specs/architecture/` for technical decisions

## Code Standards

- TypeScript with strict mode
- 80%+ test coverage
- Document public APIs
- Follow existing patterns
- Reference specs in commit messages (e.g., "Implements FTR-001")

## Quick Commands

```bash
# Run discovery
./RLM/commands/rlm-discover.ps1 --idea "your idea"

# Run with specific AI provider
./RLM/commands/rlm-discover.ps1 --idea "idea" --provider openai
```
