# RLM Create Specs Prompt

## Purpose
Generate technical specifications from an existing PRD (Product Requirements Document).

## Instructions for AI

You are the RLM Master Architect. Your job is to transform a PRD into detailed technical specifications that guide implementation.

---

## Phase 1: Load PRD

Look for the PRD in this order:
1. `RLM/specs/PRD.md`
2. Ask user if they want to paste the PRD content
3. Ask for a file path to the PRD

Once you have the PRD, read it completely.

---

## Phase 1.5: Detect Project Type (Auto-Design Detection)

Before creating specs, determine if this project requires design phases.

### Step 1.5.1: Run Project Type Detection

Execute the detection protocol from `RLM/prompts/00-DETECT-PROJECT-TYPE.md`:

1. Scan PRD for UI indicators (+1 each):
   - "user interface", "UI", "frontend"
   - "screen", "page", "view", "route"
   - "button", "form", "input", "modal"
   - React, Vue, Angular, Next.js, Svelte
   - "responsive", "mobile", "tablet"
   - "dashboard", "layout", "navigation"

2. Scan PRD for Non-UI indicators (-1 each):
   - "CLI", "command line", "terminal"
   - "API only", "headless", "backend only"
   - "library", "package", "SDK"

3. Calculate Net Score = UI indicators - Non-UI indicators

### Step 1.5.2: Classify Project

| Net Score | Classification | DESIGN_REQUIRED |
|-----------|---------------|-----------------|
| >= 3 | UI Project | **true** |
| <= -2 | Non-UI Project | **false** |
| -1 to 2 | Ambiguous | Ask user |

### Step 1.5.3: Report Detection

```
┌─────────────────────────────────────────────────────────────────┐
│ Project Type Detection                                          │
├─────────────────────────────────────────────────────────────────┤
│ UI Indicators: [X] | Non-UI Indicators: [Y] | Net Score: [Z]   │
│                                                                 │
│ Classification: [UI PROJECT / NON-UI PROJECT]                   │
│ DESIGN_REQUIRED: [true/false]                                   │
│                                                                 │
│ Design phases will be [included/skipped].                       │
└─────────────────────────────────────────────────────────────────┘
```

### Step 1.5.4: Store Classification

This classification will be stored in:
- `RLM/specs/constitution.md` (Project Classification section)
- `RLM/progress/cc-config.json` (design settings)

---

## Phase 2: Validate PRD Completeness

Check that the PRD contains:
- [ ] Executive Summary
- [ ] Problem Statement
- [ ] User Personas
- [ ] User Stories with Acceptance Criteria
- [ ] Functional Requirements
- [ ] Non-Functional Requirements
- [ ] Technical Constraints

If critical sections are missing, inform the user:
> "The PRD is missing [sections]. Would you like to:
> 1. Add the missing information now
> 2. Proceed with assumptions (I'll document them)
> 3. Run `/discover` to generate a complete PRD"

---

## Phase 3: Create Constitution (if not exists)

Check if `RLM/specs/constitution.md` exists.

If not, create it using:
- Technology stack from PRD's Technical Constraints
- Non-functional requirements for quality standards
- Use `RLM/templates/CONSTITUTION-TEMPLATE.md` as the template

**Output**: `RLM/specs/constitution.md`

---

## Phase 4: Create Feature Specifications

For each major feature/epic in the PRD, create a detailed specification.

**Output Location**: `RLM/specs/features/FTR-XXX/spec.md`

Use this format for each feature:

```markdown
# Feature Specification: [Feature Name]

## Feature ID: FTR-XXX
## Status: Draft
## Priority: [From PRD]
## Epic: [Parent Epic]

## Overview
[Feature description from PRD]

## User Stories
[Copy relevant user stories from PRD]

### US-XXX: [Story Title]
As a [persona], I want [action], so that [benefit].

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

## Technical Design

### API Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/v1/[resource] | Create [resource] | Yes |
| GET | /api/v1/[resource] | List [resources] | Yes |

### Data Model
```typescript
interface [Resource] {
  id: string;
  // ... fields based on requirements
  createdAt: Date;
  updatedAt: Date;
}
```

### Business Logic
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Error Handling
| Scenario | Error Code | User Message |
|----------|------------|--------------|
| [Scenario] | [CODE] | [Message] |

## Security Considerations
- [ ] Authentication: [Details]
- [ ] Authorization: [Details]
- [ ] Input Validation: [Details]

## Performance Requirements
- Response time: [Target]
- Throughput: [Target]

## Testing Requirements
- Unit tests: [What to test]
- Integration tests: [What to test]
- E2E tests: [Critical paths]

## Dependencies
- [Dependency 1]
- [Dependency 2]

## Implementation Notes
[Any special considerations for implementation]

## Design Requirements (if DESIGN_REQUIRED)
{{IF DESIGN_REQUIRED == true}}

### UI Components
| Component | States Required | Accessibility |
|-----------|-----------------|---------------|
| [Component] | 8 states | ARIA labels, keyboard nav |

### User Flow
[Describe the step-by-step user interaction]

### Screen Layouts
[Reference to design spec or description of layouts]

### Design Tokens to Use
- Colors: `--color-primary`, `--color-secondary`
- Spacing: `--space-md`, `--space-lg`
- Typography: `--font-heading`, `--font-body`

### Animation Requirements
- Animation Tier: [MINIMAL/MODERATE/RICH]
- Transitions: [List key transitions]

### Accessibility Requirements
- WCAG 2.1 Level: AA (minimum)
- Focus management: [Details]
- Screen reader: [Details]
{{ENDIF}}
```

Create specs for ALL features in the PRD.

---

## Phase 5: Create Architecture Overview

**Output**: `RLM/specs/architecture/overview.md`

Include:

```markdown
# Architecture Overview

## System Context
[High-level description of how the system fits into the larger ecosystem]

## Technology Stack
| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Frontend | [Tech] | [Ver] | [Why] |
| Backend | [Tech] | [Ver] | [Why] |
| Database | [Tech] | [Ver] | [Why] |
| Cache | [Tech] | [Ver] | [Why] |
| Infrastructure | [Tech] | N/A | [Why] |

## System Components
[Diagram using ASCII or description]

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   API       │────▶│  Database   │
│   (Web/App) │     │   Server    │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Cache     │
                    └─────────────┘
```

## Data Flow
[Describe how data flows through the system]

## Authentication & Authorization
[Detail the auth architecture]

## API Design
- Base URL: `/api/v1`
- Authentication: [Method]
- Rate Limiting: [Details]

## Database Schema Overview
[Key entities and relationships]

## Deployment Architecture
[How the system is deployed]

## Security Architecture
[Security layers and measures]

## Scalability Considerations
[How the system scales]

## Monitoring & Observability
[Logging, metrics, alerting approach]
```

---

## Phase 6: Create Epic Breakdown

**Output**: `RLM/specs/epics/breakdown.md`

```markdown
# Epic Breakdown & Implementation Order

## Overview
[Brief summary of total scope]

## Epics

### EPIC-001: [Epic Name]
**Description**: [What this epic accomplishes]
**Features**: FTR-001, FTR-002
**Priority**: Must Have
**Estimated Effort**: [T-shirt size: S/M/L/XL]

**Implementation Order**:
1. FTR-001 - [Feature Name] - [Rationale for order]
2. FTR-002 - [Feature Name] - [Rationale for order]

### EPIC-002: [Epic Name]
[Same format]

## Suggested Sprint Plan

### Sprint 1: Foundation
**Goal**: [Sprint goal]
**Features**:
- [ ] FTR-001: [Feature Name]
- [ ] FTR-002: [Feature Name]

### Sprint 2: Core Features
**Goal**: [Sprint goal]
**Features**:
- [ ] FTR-003: [Feature Name]
- [ ] FTR-004: [Feature Name]

[Continue for all sprints needed]

## Dependencies Graph
[Show which features depend on others]

## Risk Items
[Features with highest risk that need early attention]
```

---

## Phase 7: Summary and Next Steps

```
## Specifications Complete!

### Documents Created:
- RLM/specs/constitution.md - Project Constitution
- RLM/specs/architecture/overview.md - Architecture Overview
- RLM/specs/epics/breakdown.md - Epic Breakdown
- RLM/specs/features/FTR-001/spec.md - [Feature 1 Name]
- RLM/specs/features/FTR-002/spec.md - [Feature 2 Name]
[List all created feature specs]

### Architecture Decisions:
- [Decision 1]
- [Decision 2]
- [Decision 3]

### Implementation Order:
1. [First feature to implement]
2. [Second feature]
3. [Third feature]

### Next Steps:
1. Review the architecture at RLM/specs/architecture/overview.md
2. Review feature specs in RLM/specs/features/
3. Create implementation tasks: Read RLM/prompts/03-CREATE-TASKS.md
   Or in Claude Code: /create-tasks

### Technical Decisions Needing Validation:
[Any decisions you made that the user should confirm]
```

---

## Progress Tracking

Update `RLM/progress/status.json`:

```json
{
  "lastUpdate": "[timestamp]",
  "phase": "specs_complete",
  "documentsCreated": ["constitution.md", "architecture/overview.md", "epics/breakdown.md", "features/FTR-001/spec.md", ...],
  "nextStep": "create-tasks"
}
```

---

## Notes for AI

- Make specific technical decisions based on the PRD requirements
- If the PRD lacks technical details, use reasonable defaults and document assumptions
- Ensure consistency between all spec documents
- Consider dependencies when ordering features
- Think about testability when designing APIs and data models
- Include error handling in every feature spec
