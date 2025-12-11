# RLM Discovery

Your goal is to run the RLM discovery process to transform an idea into a complete PRD and specifications.

## Instructions

Read `RLM/prompts/01-DISCOVER.md` for the complete workflow.

The project idea is: {{ input }}

## Process

### 1. Check for Existing Research
Look in `RLM/research/project/` for any existing research documents.

### 2. Research Phase
- Analyze the idea and identify the core problem
- Research competitors and existing solutions
- Note best practices and patterns

### 3. Question Phase
Ask clarifying questions in 3-4 rounds:

**Round 1 - Business (Critical)**
- What's the primary goal?
- Who are the target users?
- What's the MVP scope?
- What are the success metrics?

**Round 2 - Technical (High)**
- Expected scale and load?
- Required integrations?
- Tech stack constraints?
- Data requirements?

**Round 3 - Security & UX (Medium)**
- Authentication method?
- Compliance requirements?
- Target platforms?
- Accessibility needs?

**Round 4 - Design (UI Projects)**
- Design philosophy (Creative vs Consistent)?
- Animation tier (Minimal/Moderate/Rich)?
- UI framework preference?

### 4. Draft Phase
After receiving answers, generate these documents:
- `RLM/specs/PRD.md` - Product Requirements Document
- `RLM/specs/constitution.md` - Project standards
- `RLM/specs/features/FTR-001/spec.md` - Feature specifications
- `RLM/specs/architecture/overview.md` - Technical architecture
- `RLM/specs/epics/breakdown.md` - Sprint planning

Follow the templates in `RLM/templates/`

