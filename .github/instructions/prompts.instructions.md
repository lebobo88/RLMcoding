---
applyTo: "RLM/prompts/**/*.md"
---

# RLM Prompt Instructions

When working with RLM prompt files:

## Purpose
These prompts define the RLM workflow steps:
- `01-DISCOVER.md` - Transform ideas into PRD
- `02-CREATE-SPECS.md` - Generate specs from PRD
- `03-CREATE-TASKS.md` - Break features into tasks
- `04-IMPLEMENT-TASK.md` - Single task TDD
- `05-IMPLEMENT-ALL.md` - All tasks implementation
- `06-RESUME.md` - Resume interrupted work
- `07-TEST.md` - Run and fix tests
- `08-REPORT.md` - Generate progress report

## Using Prompts
- Read the appropriate prompt for each workflow step
- Follow the instructions in sequence
- Don't skip steps unless explicitly allowed

## Prompt Patterns
The `patterns/` subdirectory contains reusable reasoning patterns:
- `root-cause-analysis.md` - Bug investigation
- `decision-matrix.md` - Technology selection
- `comparative-analysis.md` - Alternative evaluation
- `problem-decomposition.md` - Complex task breakdown

## Modifying Prompts
- Prompts are version-controlled
- Changes should be tested before committing
- Document any modifications in WHATS-NEW.md

