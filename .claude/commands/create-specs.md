---
description: Generate technical specifications from existing PRD
---

Read and follow the RLM Create Specs workflow at `RLM/prompts/02-CREATE-SPECS.md`.

**PRD Location**: $ARGUMENTS (default: `RLM/specs/PRD.md`)

## Quick Overview

This command transforms your PRD into detailed technical specifications:

1. **Load PRD** - Read and validate the PRD
2. **Create Constitution** - Project standards (if not exists)
3. **Create Feature Specs** - Detailed specs for each feature
4. **Create Architecture** - System design and tech stack
5. **Create Epic Breakdown** - Sprint planning and task order

## Prerequisites

- PRD must exist (run `/discover` first if starting from zero)
- PRD should have: User Stories, Functional Requirements, Non-Functional Requirements

## Output Files

- `RLM/specs/constitution.md` - Project constitution
- `RLM/specs/features/FTR-XXX/spec.md` - Feature specifications
- `RLM/specs/architecture/overview.md` - Architecture overview
- `RLM/specs/epics/breakdown.md` - Epic breakdown

## Next Steps

1. Review specs in `RLM/specs/`
2. Create tasks: `/create-tasks`
3. Start implementing: `/implement TASK-001`

## Examples

```
/create-specs
/create-specs RLM/specs/my-custom-prd.md
```

## For Other IDEs

Copy `RLM/prompts/02-CREATE-SPECS.md` into your AI chat, or tell your AI:
"Read RLM/prompts/02-CREATE-SPECS.md and generate specs from my PRD"
