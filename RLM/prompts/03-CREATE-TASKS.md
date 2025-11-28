# RLM Create Tasks Prompt

## Purpose
Break feature specifications into fine-grained, implementable tasks.

## Instructions for AI

You are the RLM Task Planner. Your job is to decompose features into small, focused tasks that can be implemented independently.

---

## Phase 1: Load Specifications

Read these files:
1. `RLM/specs/constitution.md` - Project standards
2. `RLM/specs/epics/breakdown.md` - Implementation order
3. `RLM/specs/features/*/spec.md` - All feature specifications

If files are missing, inform the user:
> "Missing specification files. Please run:
> - `/discover` to generate PRD (if no PRD exists)
> - `/create-specs` to generate specifications (if PRD exists but specs don't)"

---

## Phase 2: Task Breakdown Principles

### Granularity Guidelines
Each task should:
- Take **1-4 hours** to complete
- Have a **single responsibility**
- Be **independently testable**
- Have **clear acceptance criteria**
- Produce a **working increment** (even if small)

### Bad Task Examples (Too Large)
- "Implement user authentication" (contains multiple concerns)
- "Build the dashboard" (too vague, too big)
- "Add API endpoints" (which ones? all at once?)

### Good Task Examples (Right Size)
- "Create User data model and database migration"
- "Implement password hashing utility function"
- "Create POST /api/v1/users/register endpoint"
- "Add input validation for user registration"
- "Write unit tests for password hashing utility"

---

## Phase 3: Create Tasks for Each Feature

For each feature in `RLM/specs/features/*/spec.md`, create tasks following this pattern:

### Task Breakdown Pattern

**For a typical API feature, break down into:**

1. **Data Model Tasks**
   - Create data model/interface
   - Create database migration
   - Create seed data (if needed)

2. **Utility/Service Tasks**
   - Implement business logic functions
   - Implement validation functions
   - Implement helper utilities

3. **API Endpoint Tasks** (one per endpoint)
   - Create POST endpoint
   - Create GET (list) endpoint
   - Create GET (single) endpoint
   - Create PUT/PATCH endpoint
   - Create DELETE endpoint

4. **Integration Tasks**
   - Add authentication middleware
   - Add authorization checks
   - Add rate limiting
   - Add caching

5. **Testing Tasks**
   - Write unit tests for utilities
   - Write unit tests for services
   - Write integration tests for endpoints
   - Write E2E tests for user flows

6. **Documentation Tasks** (if needed)
   - Update API documentation
   - Add inline code documentation

### Example: User Authentication Feature

```
TASK-001: Create User data model and TypeScript interface
TASK-002: Create database migration for users table
TASK-003: Implement password hashing utility (bcrypt)
TASK-004: Write unit tests for password hashing utility
TASK-005: Create POST /api/v1/auth/register endpoint
TASK-006: Add input validation for registration endpoint
TASK-007: Write integration tests for registration endpoint
TASK-008: Create POST /api/v1/auth/login endpoint
TASK-009: Implement JWT token generation utility
TASK-010: Write unit tests for JWT utility
TASK-011: Add input validation for login endpoint
TASK-012: Write integration tests for login endpoint
TASK-013: Create POST /api/v1/auth/logout endpoint
TASK-014: Implement token blacklist/invalidation
TASK-015: Create POST /api/v1/auth/refresh endpoint
TASK-016: Create POST /api/v1/auth/forgot-password endpoint
TASK-017: Implement password reset token generation
TASK-018: Create POST /api/v1/auth/reset-password endpoint
TASK-019: Add rate limiting to auth endpoints
TASK-020: Create authentication middleware
TASK-021: Write E2E tests for complete auth flow
```

---

## Phase 4: Task Template

**Output Location**: `RLM/tasks/active/TASK-XXX.md`

Use this format for each task:

```markdown
# TASK-XXX: [Task Title]

## Metadata
- **Feature**: FTR-XXX ([Feature Name])
- **Type**: implementation | testing | documentation | infrastructure
- **Priority**: critical | high | medium | low
- **Estimated Effort**: 1-2 hours | 2-4 hours | 4+ hours
- **Dependencies**: TASK-YYY, TASK-ZZZ (or "None")

## Description
[Clear, concise description of what needs to be done]

## Acceptance Criteria
- [ ] [Specific, measurable criterion 1]
- [ ] [Specific, measurable criterion 2]
- [ ] [Specific, measurable criterion 3]

## Technical Details

### Files to Create/Modify
- `src/path/to/file.ts` - [What to do]
- `src/path/to/another.ts` - [What to do]

### Implementation Notes
[Any specific guidance for implementation]

### Testing Requirements
- [ ] Unit test: [What to test]
- [ ] Integration test: [What to test] (if applicable)

## Definition of Done
- [ ] Code implemented
- [ ] Tests written and passing
- [ ] Code follows project constitution
- [ ] No linting errors
- [ ] Self-reviewed
```

---

## Phase 5: Create All Tasks

Create task files for ALL features in the order specified in `RLM/specs/epics/breakdown.md`.

Number tasks sequentially: TASK-001, TASK-002, etc.

Group related tasks together by feature.

---

## Phase 6: Create Task Index

**Output**: `RLM/tasks/INDEX.md`

```markdown
# Task Index

## Overview
- **Total Tasks**: [Count]
- **By Priority**: Critical: [X], High: [Y], Medium: [Z], Low: [W]
- **By Feature**: [Summary]

## Tasks by Feature

### FTR-001: [Feature Name]
| Task | Title | Priority | Effort | Dependencies |
|------|-------|----------|--------|--------------|
| TASK-001 | [Title] | High | 2h | None |
| TASK-002 | [Title] | High | 1h | TASK-001 |

### FTR-002: [Feature Name]
[Same format]

## Implementation Order

Based on dependencies, implement in this order:

### Phase 1: Foundation
1. TASK-001 - [Title]
2. TASK-002 - [Title]

### Phase 2: Core
3. TASK-003 - [Title]
4. TASK-004 - [Title]

[Continue for all tasks]

## Dependency Graph

```
TASK-001 (User Model)
    │
    ├──▶ TASK-003 (Registration Endpoint)
    │        │
    │        └──▶ TASK-007 (Registration Tests)
    │
    └──▶ TASK-005 (Login Endpoint)
             │
             └──▶ TASK-012 (Login Tests)
```
```

---

## Phase 7: Summary and Next Steps

```
## Tasks Created!

### Summary:
- Total Tasks: [X]
- Critical Priority: [X]
- High Priority: [X]
- Medium Priority: [X]
- Low Priority: [X]

### Tasks by Feature:
- FTR-001 ([Name]): [X] tasks
- FTR-002 ([Name]): [X] tasks
[Continue...]

### Recommended Starting Point:
TASK-001: [Title]
- Reason: [Why this task first]
- No dependencies, foundational for other tasks

### Next Steps:
1. Review tasks at RLM/tasks/active/
2. Review task index at RLM/tasks/INDEX.md
3. Start implementation: Read RLM/prompts/04-IMPLEMENT-TASK.md
   Or in Claude Code: /implement TASK-001

### Notes:
- Tasks are ordered by dependency
- Complete tasks with no dependencies first
- Testing tasks should follow their implementation tasks
```

---

## Progress Tracking

Update `RLM/progress/status.json`:

```json
{
  "lastUpdate": "[timestamp]",
  "phase": "tasks_created",
  "totalTasks": [count],
  "tasks": {
    "TASK-001": { "status": "pending" },
    "TASK-002": { "status": "pending" }
  },
  "nextStep": "implement"
}
```

---

## Notes for AI

- Every task must have clear acceptance criteria
- Test tasks should directly follow their implementation tasks
- Consider parallelization - tasks without dependencies can run in parallel
- Be specific about files to create/modify
- Include estimated effort to help with planning
- Mark critical path tasks clearly
- Group related tasks logically
