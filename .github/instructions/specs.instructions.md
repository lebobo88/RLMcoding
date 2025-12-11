---
applyTo: "RLM/specs/**/*.md"
---

# Specification File Instructions

When working with RLM specification files:

## PRD (Product Requirements Document)
- `RLM/specs/PRD.md` contains the product vision and requirements
- Use as the source of truth for feature scope
- Reference when creating feature specs

## Constitution
- `RLM/specs/constitution.md` defines project standards
- Always check before implementing any code
- Contains coding standards, patterns, and conventions

## Feature Specs
- Located in `RLM/specs/features/FTR-XXX/`
- Include acceptance criteria and technical requirements
- Reference when implementing related tasks

## Architecture
- `RLM/specs/architecture/overview.md` contains system design
- Reference for technology decisions and patterns
- Check before making architectural changes

## Modifying Specs
- Specs should be updated through the discovery process
- Don't modify specs during implementation without approval
- Track changes in commit messages

