# Context Bundle Hook

This hook saves session state for resumption, implementing context persistence per Elite Context Engineering.

## Trigger

Activated when:
- Session checkpoint reached
- Before long-running sub-agent call
- On session stop/pause
- Manual `/cc-bundle save` command

## Purpose

Context bundles allow:
- Session resumption without re-reading everything
- Handoff between sessions
- Debugging by reviewing session history
- Recovery from context window overflow

## Actions

### Step 1: Capture Session State
Gather current session information:
```json
{
  "session_id": "[uuid]",
  "timestamp": "[ISO-8601]",
  "context_version": "2.1"
}
```

### Step 2: Capture Work State
```json
{
  "currentWork": {
    "type": "[discover|architect|implement|test|review]",
    "target": "[FTR-XXX or TASK-XXX]",
    "progress": "[description of where we are]",
    "pendingDecisions": []
  }
}
```

### Step 3: Capture Key Files Read
```json
{
  "filesRead": [
    {
      "path": "RLM/specs/PRD.md",
      "sections": ["relevant sections"],
      "reason": "why it was read"
    }
  ]
}
```

### Step 4: Capture Decisions Made
```json
{
  "decisions": [
    {
      "topic": "[what was decided]",
      "choice": "[the decision]",
      "rationale": "[why]",
      "timestamp": "[when]"
    }
  ]
}
```

### Step 5: Capture Token Usage
```json
{
  "tokenUsage": {
    "primaryAgent": 15000,
    "subAgents": {
      "research": 5000,
      "architect": 3000,
      "coder": 8000
    },
    "total": 31000
  }
}
```

### Step 6: Write Bundle
Save to `RLM/progress/bundles/[session_id].json`:
```json
{
  "session_id": "[uuid]",
  "created_at": "[ISO-8601]",
  "workflow_state": { ... },
  "files_read": [ ... ],
  "decisions": [ ... ],
  "token_usage": { ... },
  "resume_instructions": "[how to continue]"
}
```

## Bundle Format

Full bundle structure:
```json
{
  "session_id": "abc123",
  "created_at": "2024-11-27T10:00:00Z",
  "workflow_state": {
    "phase": "implementation",
    "currentTask": "TASK-003",
    "tasksCompleted": ["TASK-001", "TASK-002"],
    "tasksRemaining": ["TASK-003", "TASK-004"],
    "blockers": []
  },
  "files_read": [
    {"path": "RLM/specs/PRD.md", "summary": "E-commerce app"},
    {"path": "RLM/specs/features/FTR-001/spec.md", "summary": "Auth feature"}
  ],
  "decisions": [
    {"topic": "Database", "choice": "PostgreSQL", "rationale": "ACID needs"}
  ],
  "token_usage": {
    "total": 45000,
    "by_agent": {"coder": 20000, "tester": 10000}
  },
  "resume_instructions": "Continue with TASK-003 implementation. Auth feature specs loaded. TDD in progress - tests written, implementation pending."
}
```

## Resuming from Bundle

Use `/cc-bundle load [session_id]` or `/implement resume`:

1. Read bundle file
2. Load referenced files
3. Restore workflow state
4. Display resume instructions
5. Continue from checkpoint

## Storage

```
RLM/progress/bundles/
├── [session-1].json
├── [session-2].json
└── latest.json  (symlink to most recent)
```

## Cleanup

Bundles older than 7 days can be archived:
```bash
# Move old bundles to archive
mv RLM/progress/bundles/*.json RLM/progress/bundles/archive/
```
