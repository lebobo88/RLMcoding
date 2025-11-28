# Architecture Design with Sub-Agent Delegation

You are initiating Claude Code architecture mode. This command delegates architectural analysis to the Architect Sub-Agent for isolated, focused decision-making.

## Automatic Context Priming

This command automatically loads:
- `RLM/specs/PRD.md` - Product requirements
- `RLM/specs/constitution.md` - Project standards (if exists)
- `RLM/specs/features/` - Existing feature specifications
- `RLM/templates/decision-record-template.md` - ADR format
- `RLM/progress/cc-config.json` - Configuration settings

## Automatic Token Reporting

Token usage is tracked automatically:
- Each Architect sub-agent call logged silently
- **50% budget**: Warning displayed, continue design
- **75% budget**: "Consider finalizing current ADRs and tech-stack decisions"
- **90% budget**: Auto-save context, generate remaining architecture files only

## Workflow

### Step 1: Gather Context
Read the following files to understand the project:
- `RLM/specs/PRD.md` - Product requirements
- `RLM/specs/constitution.md` - Project standards (if exists)
- `RLM/specs/features/` - Feature specifications (if exist)

Arguments provided: $ARGUMENTS

### Step 2: Identify Architectural Decisions Needed
Based on PRD and features, identify key decisions:
- Technology stack selection
- Database design
- API architecture
- Authentication/authorization approach
- Deployment strategy
- Scaling considerations

### Step 3: Delegate to Architect Sub-Agent
Use the Task tool to spawn the Architect Sub-Agent for each major decision:
- **subagent_type**: Use the Task tool with `architect` prompt referencing `.claude/agents/architect.md`
- **prompt**: Include:
  - The specific architectural question
  - Relevant constraints from PRD
  - Scale requirements
  - Team skill considerations (if known)

### Step 4: Synthesize Architecture
Collect sub-agent recommendations and create:

1. **Architecture Overview** (`RLM/specs/architecture/overview.md`)
   - System components
   - Data flow diagrams (text-based)
   - Integration points

2. **Technology Stack** (`RLM/specs/architecture/tech-stack.md`)
   - Frontend, backend, database, infrastructure
   - Rationale for each choice
   - Confidence levels

3. **ADRs** (`RLM/specs/architecture/decisions/`)
   - One ADR per significant decision
   - Following `RLM/templates/decision-record-template.md` format

### Step 5: Generate Constitution
If not exists, create `RLM/specs/constitution.md` with:
- Coding standards
- File organization
- Naming conventions
- Testing requirements
- Documentation standards

### Step 6: Report Token Usage
Log architecture session token usage.

## Output Files

```
RLM/specs/architecture/
├── overview.md           # System architecture overview
├── tech-stack.md        # Technology choices with rationale
├── data-model.md        # Database schema design
├── api-design.md        # API structure and endpoints
└── decisions/           # Architecture Decision Records
    ├── ADR-001-*.md
    └── ADR-002-*.md
```

## Context Efficiency Notes

- Architect sub-agent evaluates options without polluting primary context
- Only final recommendations with rationale are returned
- Detailed analysis preserved in ADR files
- Primary agent synthesizes without carrying full evaluation context
