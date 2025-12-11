# RLM Resume Session

Your goal is to resume an interrupted RLM session.

## Instructions

Read `RLM/prompts/06-RESUME.md` for the complete workflow.

## Process

### 1. Check Current State
Read `RLM/progress/status.json` to understand:
- Current phase (discover, specs, tasks, implement)
- Last completed action
- Any in-progress work

### 2. Check Checkpoint
Read `RLM/progress/checkpoint.json` for:
- Task generation number
- Completed features
- Completed tasks
- Any saved context

### 3. Identify Resume Point
Determine where work was interrupted:
- Mid-discovery → Continue questions or drafting
- Mid-specs → Continue spec generation
- Mid-tasks → Continue task creation
- Mid-implementation → Continue current task

### 4. Load Necessary Context
Based on resume point, load:
- Relevant specs from `RLM/specs/`
- Active tasks from `RLM/tasks/active/`
- Any partial work

### 5. Continue Work
Resume from the last checkpoint.

## Output
Provide a summary of:
- What was completed before interruption
- What's currently in progress
- What's next to do
- Recommended action

