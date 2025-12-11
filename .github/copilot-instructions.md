# RLM Method - GitHub Copilot Instructions

This project uses the RLM (Research-Lead-Manage) method for AI-assisted development.

## Project Structure

```
RLM/
├── prompts/         # Workflow prompts (use these!)
│   ├── 01-DISCOVER.md       # Idea → PRD
│   ├── 02-CREATE-SPECS.md   # PRD → Specs
│   ├── 03-CREATE-TASKS.md   # Specs → Tasks
│   ├── 04-IMPLEMENT-TASK.md # Single task TDD
│   ├── 05-IMPLEMENT-ALL.md  # All tasks
│   ├── 06-RESUME.md         # Resume session
│   └── patterns/            # Reusable reasoning patterns
├── specs/           # Specifications
│   ├── PRD.md               # Product Requirements Document
│   ├── constitution.md      # Project standards
│   ├── features/            # Feature specs (FTR-XXX)
│   ├── architecture/        # Technical architecture
│   └── design/              # Design system (UI projects)
├── agents/          # Agent prompts
│   ├── research-agent.md    # Discovery process
│   ├── master-architect.md  # Architecture design
│   ├── design-agent.md      # UI/UX design
│   └── implementation-agent.md  # Coding standards
├── templates/       # Document templates
├── tasks/           # Task management
│   ├── active/              # Tasks to implement
│   ├── completed/           # Finished tasks
│   └── blocked/             # Blocked tasks
├── progress/        # Progress tracking
│   ├── status.json          # Current state
│   ├── checkpoint.json      # Incremental tracking
│   └── cc-config.json       # Configuration
├── research/        # Project research (auto-detected)
└── docs/            # Documentation
```

## Discovery Process

When I ask you to "discover" or "research" an idea:

1. Read `RLM/prompts/01-DISCOVER.md` for the detailed workflow
2. Check for existing research in `RLM/research/project/`
3. Research the idea:
   - Identify the core problem
   - Find existing solutions/competitors
   - Note best practices
4. Ask clarifying questions in 3-4 rounds:
   - **Business** (Critical): What's the goal? Who are users? Timeline? Success metrics?
   - **Technical** (High): Expected scale? Tech constraints? Integrations?
   - **Data** (High): What data? Compliance needs? Privacy?
   - **Security** (Medium): Auth method? Encryption? Audit logging?
   - **UX** (Medium): Platforms? Accessibility? Key workflows?
   - **Design** (UI projects): Design philosophy? Animation tier? Framework?
5. Generate spec documents:
   - `RLM/specs/PRD.md` - Product Requirements Document
   - `RLM/specs/constitution.md` - Project standards
   - `RLM/specs/features/FTR-XXX/spec.md` - Feature specifications
   - `RLM/specs/architecture/overview.md` - Technical architecture
   - `RLM/specs/epics/breakdown.md` - Sprint planning

## Implementation

When implementing features:

1. Read the relevant spec from `RLM/specs/features/`
2. Follow TDD - write tests first
3. Check `RLM/specs/constitution.md` for coding standards
4. Reference `RLM/specs/architecture/` for technical decisions
5. Update task status when complete

## Code Standards

- TypeScript with strict mode
- 80%+ test coverage
- Document public APIs
- Follow existing patterns
- Reference specs in commit messages (e.g., "Implements FTR-001")

## Using RLM Prompts

Tell me to read the appropriate prompt for each workflow step:

```
# Discovery (idea → PRD)
Read RLM/prompts/01-DISCOVER.md and help me discover specs for: [your idea]

# Create Specs (PRD → feature specs)
Read RLM/prompts/02-CREATE-SPECS.md and generate specs from my PRD

# Create Tasks (specs → tasks)
Read RLM/prompts/03-CREATE-TASKS.md and break down features into tasks

# Implement Single Task
Read RLM/prompts/04-IMPLEMENT-TASK.md and implement TASK-001

# Implement All Tasks
Read RLM/prompts/05-IMPLEMENT-ALL.md and implement all active tasks

# Resume Work
Read RLM/prompts/06-RESUME.md and resume my previous session
```

## Key Files to Reference

| File | Purpose |
|------|---------|
| `RLM/START-HERE.md` | Entry point - read this first |
| `RLM/specs/PRD.md` | Product requirements |
| `RLM/specs/constitution.md` | Project standards |
| `RLM/progress/status.json` | Current state |
| `RLM/docs/USER-GUIDE.md` | Complete guide |
