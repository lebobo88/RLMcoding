# Context Primer: Feature Development

You are priming context for feature development work. This is a lightweight context loader that avoids static memory file bloat.

## Purpose

Load only the context necessary for implementing a specific feature, following Elite Context Engineering principles.

## Arguments

`$ARGUMENTS` should be:
- Feature ID (e.g., `FTR-001`)
- Or feature name to search for

## Context Loading Protocol

### Step 1: Load Core Standards
Read the project constitution for coding standards:
```
RLM/specs/constitution.md
```

### Step 2: Load Feature Specification
Read the target feature spec:
```
RLM/specs/features/FTR-XXX/specification.md
```

If feature ID not provided, list available features:
```bash
ls RLM/specs/features/
```

### Step 3: Load Related Context
Based on feature type, load relevant files:

**For UI Features:**
- Component patterns from existing code
- Design system references
- State management patterns

**For API Features:**
- API design docs
- Database schema
- Authentication patterns

**For Integration Features:**
- External API documentation
- Integration patterns
- Error handling approaches

### Step 4: Summarize Context
Present a brief context summary:

```markdown
## Feature Context Loaded

**Feature**: [FTR-XXX] [Title]
**Status**: [planning|in-progress|testing|complete]

### Key Requirements
- [Requirement 1]
- [Requirement 2]

### Technical Approach
[Brief summary from spec]

### Related Tasks
- TASK-XXX: [title] [status]
- TASK-XXX: [title] [status]

### Standards to Follow
- [Key standard from constitution]
- [Key standard from constitution]

---
Context loaded. Ready for feature development.
Use `/cc-implement TASK-XXX` to start implementing.
```

## What This Primer Avoids

- Loading entire PRD (too large)
- Loading all feature specs (only need one)
- Loading implementation details of other features
- Loading test files until needed

## Context Efficiency

This primer loads ~500-1000 tokens vs ~5000+ for full project context.

Only the feature you're working on is in context.
