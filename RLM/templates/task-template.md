# Task: [Task Title]

## Task ID: TASK-XXX
## Feature: [FTR-XXX]
## Type: [architecture|implementation|testing|deployment|documentation]
## Status: [pending|active|blocked|completed]
## Assigned Agent: [agent-id]
## Priority: [Low|Medium|High|Critical]
## Estimated Effort: [X hours]

## Description
Clear description of what needs to be done.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Details
- **Framework:** [Framework name]
- **Language:** [Programming language]
- **Libraries:** [List of libraries]
- **Patterns:** [Design patterns to use]

## UI/UX Requirements (if applicable)
- **Has UI Component:** [yes|no]
- **Design Spec:** [Link to RLM/specs/design/components/[name].md or RLM/specs/features/FTR-XXX/design-spec.md]
- **Component States Required:**
  - [ ] Default
  - [ ] Hover
  - [ ] Focus (keyboard visible)
  - [ ] Active
  - [ ] Disabled
  - [ ] Loading
  - [ ] Error
  - [ ] Empty (if data-driven)
- **Design Tokens to Use:** [List tokens from RLM/specs/design/tokens/]
- **Accessibility Requirements:**
  - [ ] ARIA role: [role]
  - [ ] Keyboard navigation: [Tab, Enter, Escape, Arrow keys]
  - [ ] Screen reader: [aria-label, aria-describedby]
  - [ ] Focus management: [trap, restore]
- **Responsive Breakpoints:** [mobile, tablet, desktop, large]
- **Animation Tier:** [MINIMAL|MODERATE|RICH] (see project constitution)

## Dependencies
- [ ] TASK-XXX (Description) - [Status]
- [ ] External dependency - [Status]

## Test Requirements
- [ ] Unit tests for [component]
- [ ] Integration tests for [feature]
- [ ] Test [specific scenario]
- [ ] Verify [behavior]

## Files to Modify/Create
- `src/path/to/file1.ts` - [What to do]
- `src/path/to/file2.ts` - [What to do]
- `tests/file.test.ts` - [What to test]

## Implementation Notes
- Note 1
- Note 2
- Note 3

## Definition of Done
- [ ] Code implemented according to spec
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] No linter errors
- [ ] Performance validated
- [ ] Security checked
- [ ] **Design compliance (if UI task):**
  - [ ] All 8 component states implemented
  - [ ] Design tokens used (no hardcoded values)
  - [ ] Accessibility requirements met (keyboard, screen reader)
  - [ ] Responsive at all breakpoints
  - [ ] Animation follows project tier
  - [ ] Design QA checklist passed (≥90%)

