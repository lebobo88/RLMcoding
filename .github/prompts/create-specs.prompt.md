# RLM Create Specs

Your goal is to generate technical specifications from an existing PRD.

## Instructions

Read `RLM/prompts/02-CREATE-SPECS.md` for the complete workflow.

## Process

### 1. Read the PRD
Load and analyze `RLM/specs/PRD.md`

### 2. Auto-Detect Project Type
Determine if this is a UI project:
- Count UI-related requirements
- Set DESIGN_REQUIRED flag if UI score >= 3

### 3. Generate Feature Specs
For each feature identified in the PRD:
- Create `RLM/specs/features/FTR-XXX/spec.md`
- Include acceptance criteria
- Define technical requirements
- List dependencies

### 4. Generate Architecture
Create `RLM/specs/architecture/overview.md`:
- System components
- Data flow
- API contracts
- Technology decisions

### 5. Generate Epic Breakdown
Create `RLM/specs/epics/breakdown.md`:
- Sprint planning
- Feature prioritization
- Milestone definitions

## Templates
Use templates from `RLM/templates/`:
- `spec-template.md` for features
- `architecture-template.md` for architecture
- `epic-breakdown-template.md` for epics

## Output
Confirm all generated files and provide a summary of:
- Number of features identified
- Architecture decisions made
- Suggested sprint breakdown

