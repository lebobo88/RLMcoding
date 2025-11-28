# Background Agent Spawn

You are initiating a Claude Code background agent. This command spawns an independent process that runs autonomously, freeing your active session.

## Automatic Context Priming

This command automatically bundles for background execution:
- `RLM/specs/PRD.md` - Product requirements
- `RLM/specs/constitution.md` - Project standards
- `RLM/progress/cc-config.json` - Configuration settings
- Task-specific context based on background task type:
  - `implement`: Task file + parent feature spec
  - `test`: Source files + existing test files
  - `review`: Changed files + spec context
  - `research`: PRD + market context
  - `plan`: Feature specs + architecture

## Automatic Token Reporting

Background agents track tokens independently:
- Token metrics logged to `RLM/progress/background/[session-id]-tokens.json`
- Summary included in final report
- Aggregated into main session logs on completion

## Arguments

`$ARGUMENTS` should specify the task:
- `implement [task-id]` - Background implementation
- `test [scope]` - Background test execution
- `review [scope]` - Background code review
- `research [topic]` - Background research
- `plan [task]` - Background planning

## Workflow

### Step 1: Parse Background Task
Identify from `$ARGUMENTS`:
- Task type (implement, test, review, research, plan)
- Task scope/target
- Any additional parameters

### Step 2: Prepare Background Context
Create a context payload file at `RLM/progress/background/[session-id]-context.json`:

```json
{
  "session_id": "[generated-uuid]",
  "task_type": "[type]",
  "task_scope": "[scope]",
  "started_at": "[ISO-8601]",
  "context_files": [
    "RLM/specs/PRD.md",
    "RLM/specs/constitution.md",
    "[other relevant files]"
  ],
  "output_location": "RLM/progress/background/[session-id]-report.md"
}
```

### Step 3: Spawn Background Process
Use the Task tool with `run_in_background: true` to spawn:

```
Execute the following task autonomously:

Task Type: [type]
Scope: [scope]

Instructions:
1. Read context from: RLM/progress/background/[session-id]-context.json
2. Execute task following RLM workflow
3. Write results to: RLM/progress/background/[session-id]-report.md
4. Update status in context file when complete

Do not wait for user input. Execute fully and report.
```

### Step 4: Confirm Spawn
Report to user:
```
Background agent spawned successfully.

Session ID: [session-id]
Task: [description]
Status File: RLM/progress/background/[session-id]-context.json
Output: RLM/progress/background/[session-id]-report.md

Use `/cc-background status [session-id]` to check progress.
Use `/cc-background cancel [session-id]` to terminate.
```

## Background Task Types

### `implement [task-id]`
- Delegates to Coder Sub-Agent in background
- Implements task(s) following TDD
- Reports completion with test results

### `test [scope]`
- Delegates to Tester Sub-Agent in background
- Runs tests and coverage analysis
- Reports results and failures

### `review [scope]`
- Delegates to Reviewer Sub-Agent in background
- Performs comprehensive review
- Reports findings by severity

### `research [topic]`
- Delegates to Research Sub-Agent in background
- Gathers information on topic
- Reports findings with sources

### `plan [task]`
- Creates implementation plan
- Breaks down into sub-tasks
- Reports proposed approach

## Status Commands

`/cc-background status [session-id]` - Check background task status
`/cc-background list` - List all active background tasks
`/cc-background cancel [session-id]` - Terminate background task
`/cc-background report [session-id]` - View completed report

## Context Efficiency Notes

- Background agents run completely out-of-loop
- No context pollution to active session
- Results written to files for later review
- Enables parallel work streams
- Primary agent can continue with other tasks

## File Structure

```
RLM/progress/background/
├── [session-id]-context.json   # Task context and status
├── [session-id]-report.md      # Final report
└── [session-id]-log.md         # Execution log (optional)
```
