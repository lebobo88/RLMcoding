---
description: Start RLM discovery for a new project or feature idea
---

Read and follow the RLM Discovery workflow at `RLM/prompts/01-DISCOVER.md`.

**User's idea**: $ARGUMENTS

If no idea was provided, ask the user for their project idea.

## Quick Overview

This command transforms your raw idea into a comprehensive PRD (Product Requirements Document) through:

1. **Idea Analysis** - Parse and understand your concept
2. **Research** - Competitors, best practices (if web search available)
3. **Clarifying Questions** - 3 rounds of prioritized questions
4. **PRD Generation** - Comprehensive 13-section PRD
5. **Constitution** - Project standards and conventions

## Output Files

- `RLM/specs/PRD.md` - Complete Product Requirements Document
- `RLM/specs/constitution.md` - Project constitution

## Next Steps After Discovery

1. Review the PRD at `RLM/specs/PRD.md`
2. Generate technical specs: `/create-specs`
3. Create implementation tasks: `/create-tasks`
4. Start implementing: `/implement TASK-001`

## Examples

```
/discover Build a habit tracking app with social accountability
/discover Add user authentication to my existing app
/discover Create a REST API for inventory management
```

## For Other IDEs

Copy `RLM/prompts/01-DISCOVER.md` into your AI chat, or tell your AI:
"Read RLM/prompts/01-DISCOVER.md and help me discover specs for: [your idea]"
