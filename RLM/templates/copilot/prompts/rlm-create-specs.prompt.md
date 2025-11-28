# Create Feature Specifications

Generate technical specifications from the PRD.

## Instructions

1. Read the PRD at `RLM/specs/PRD.md`
2. Break down into discrete features (FTR-001, FTR-002, etc.)
3. For each feature, create a specification in `RLM/specs/features/FTR-XXX/`
4. Define acceptance criteria, technical approach, and dependencies

## Input
- `RLM/specs/PRD.md`
- `RLM/specs/constitution.md`

## Output
- Feature specs in `RLM/specs/features/FTR-XXX/spec.md`
- Architecture decisions in `RLM/specs/architecture/`

## Feature Spec Structure

```markdown
# Feature: [Title]

## Feature ID: FTR-XXX
## Priority: [High | Medium | Low]
## Status: [Draft | Ready | In Progress | Complete]

## Description
[Detailed description of what this feature does]

## User Stories
- As a [user type], I want [action], so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Technical Approach
[How this will be implemented]

## Dependencies
- FTR-YYY (if any)
- External services/APIs

## UI/UX Requirements
[Mockups, wireframes, or descriptions]

## API Endpoints
[If applicable]

## Data Model Changes
[If applicable]

## Security Considerations
[Authentication, authorization, data protection]

## Testing Strategy
[Unit, integration, E2E test approach]
```

## Naming Conventions
- Feature IDs: `FTR-001`, `FTR-002`, etc.
- Feature folders: `RLM/specs/features/FTR-001/`
- Spec file: `spec.md`
