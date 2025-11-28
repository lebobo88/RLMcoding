# Generate Specs from PRD with Sub-Agent Delegation

You are initiating Claude Code spec generation mode. This is **Path 2** entry point - starting from an existing PRD.

## Automatic Context Priming

This command automatically loads:
- `RLM/specs/PRD.md` - The existing Product Requirements Document
- `RLM/specs/constitution.md` - Project standards (if exists)
- `RLM/templates/` - Relevant templates for spec generation

## Workflow

### Step 1: Verify PRD Exists
```
Check: RLM/specs/PRD.md exists?
├─► YES: Proceed to Step 2
└─► NO: Error - "No PRD found. Use /cc-discover to create one first."
```

### Step 2: Analyze PRD
Read and analyze the PRD to identify:
- Features to specify
- Architecture decisions needed
- Technical requirements
- Integration points

### Step 3: Delegate to Architect Sub-Agent
Use the Task tool to spawn the Architect Sub-Agent:

```
Spawn Architect Sub-Agent with:
- PRD content summary
- Request: Generate architecture overview, tech stack decisions
- Output: Write to RLM/specs/architecture/
```

### Step 4: Generate Feature Specifications
For each feature identified in PRD:

```
For feature in features:
├─► Create RLM/specs/features/FTR-XXX/
│   ├─► specification.md - Feature spec
│   ├─► api.md - API contracts (if applicable)
│   └─► ui.md - UI requirements (if applicable)
```

### Step 5: Generate Architecture Specs
Synthesize architect sub-agent output:
- `RLM/specs/architecture/overview.md`
- `RLM/specs/architecture/tech-stack.md`
- `RLM/specs/architecture/data-model.md`
- `RLM/specs/architecture/decisions/ADR-XXX.md`

### Step 6: Create Constitution (if not exists)
If `RLM/specs/constitution.md` doesn't exist:
- Generate based on tech stack decisions
- Include coding standards, file organization, testing requirements

### Step 7: Auto-Continue Option
Ask user:
```
Specs generated successfully. Continue to task creation?
├─► YES: Execute /cc-create-tasks automatically
└─► NO: Stop here, user reviews specs first
```

## Automatic Token Reporting

Token usage is automatically tracked:
- Architect sub-agent tokens logged
- Running total displayed at end
- Warning if approaching budget threshold

## Output Structure

```
RLM/specs/
├── PRD.md                    # (existing)
├── constitution.md           # Project standards
├── features/
│   ├── FTR-001/
│   │   ├── specification.md
│   │   ├── api.md
│   │   └── ui.md
│   ├── FTR-002/
│   │   └── ...
├── architecture/
│   ├── overview.md
│   ├── tech-stack.md
│   ├── data-model.md
│   └── decisions/
│       ├── ADR-001-*.md
│       └── ADR-002-*.md
└── epics/
    └── EPIC-001.md
```

## Parallel Processing

If PRD contains many features, spawn multiple Architect sub-agents:
- Batch features into groups
- Each sub-agent handles one group
- Synthesize results at end

## Error Handling

If architect sub-agent encounters issues:
1. Log error to `RLM/progress/logs/errors/`
2. Invoke problem-solving framework
3. Retry with clarified context or escalate to user
