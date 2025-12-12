# Sub-Agent Reliability System (v2.7.1)

This document describes the reliability improvements made to ensure sub-agent work is properly tracked 100% of the time.

## Problem Statement

Previously, the sub-agent system had these issues:
1. **Context Loss**: Sub-agents would complete work but primary agent lost track of results
2. **No File Verification**: Primary agent trusted summaries without verifying files existed
3. **Missing Hooks**: The `hooks.json` file didn't exist, so automatic tracking wasn't functional
4. **Progress Not Updated**: `status.json` and progress logs weren't being updated

## Solution Overview

Two-pronged approach:

### 1. Executable Hooks System
Real hooks that run shell commands automatically on Claude Code events.

### 2. Explicit Completion Protocol
Sub-agents must write completion manifests that primary agent verifies.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRIMARY AGENT                                │
│  1. Spawns sub-agent with explicit instructions                 │
│  2. Waits for completion                                        │
│  3. VERIFIES manifest exists in RLM/progress/manifests/         │
│  4. VERIFIES files in manifest exist on disk                    │
│  5. Only then marks task complete                               │
└─────────────────────────────────────────────────────────────────┘
         │                              ▲
         │ Task tool                    │ Returns summary
         ▼                              │
┌─────────────────────────────────────────────────────────────────┐
│                      SUB-AGENT                                   │
│  1. Reads task/context files                                    │
│  2. WRITES code/tests using Write/Edit tools                    │
│  3. Runs tests to verify passing                                │
│  4. WRITES completion manifest (REQUIRED)                       │
│  5. Returns summary to primary                                  │
└─────────────────────────────────────────────────────────────────┘
         │
         │ Manifest written to disk
         ▼
┌─────────────────────────────────────────────────────────────────┐
│           RLM/progress/manifests/TASK-XXX-timestamp.json        │
│  {                                                              │
│    "task_id": "TASK-001",                                       │
│    "status": "completed",                                       │
│    "files_created": ["src/component.tsx", "src/test.ts"],      │
│    "files_modified": [],                                        │
│    "tests_added": 5                                             │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
         │
         │ Post-subagent hook processes
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AUTOMATIC ACTIONS                              │
│  - Update RLM/progress/status.json                              │
│  - Move task file: active/ → completed/                         │
│  - Log to RLM/progress/logs/                                    │
│  - Update session tracking                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Files Created

### Hooks System

| File | Purpose |
|------|---------|
| `.claude/hooks/hooks.json` | Defines hook events and PowerShell commands |
| `.claude/scripts/session-start.ps1` | Initialize session tracking |
| `.claude/scripts/pre-subagent.ps1` | Track before sub-agent spawns |
| `.claude/scripts/post-subagent.ps1` | Process sub-agent completion, update status, move task files |
| `.claude/scripts/track-file-write.ps1` | Log file writes |
| `.claude/scripts/session-end.ps1` | Finalize session, generate summary |
| `.claude/scripts/write-manifest.ps1` | Called by sub-agents to report completion |
| `.claude/scripts/estimate-tokens.ps1` | Estimate tokens for file operations |
| `.claude/scripts/pre-compact.ps1` | Log when context is about to be summarized |
| `.claude/scripts/capture-session-cost.ps1` | Capture post-session /cost data |
| `.claude/scripts/show-token-usage.ps1` | Display current token usage summary |

### Hook Events

| Event | Trigger | Script |
|-------|---------|--------|
| `SessionStart` | Claude Code session begins | `session-start.ps1` |
| `PreToolUse` (Task) | Before sub-agent spawns | `pre-subagent.ps1` |
| `PostToolUse` (Task) | After Task tool completes | `post-subagent.ps1`, `estimate-tokens.ps1` |
| `PostToolUse` (Read) | After file read | `estimate-tokens.ps1` |
| `PostToolUse` (Write) | After file write | `estimate-tokens.ps1` |
| `PostToolUse` (Edit) | After file edit | `estimate-tokens.ps1` |
| `PreCompact` (auto) | Before context summarization | `pre-compact.ps1` |
| `SubagentStop` | When any sub-agent finishes | `post-subagent.ps1` |
| `Stop` | Session ends | `session-end.ps1` |

Uses `$CLAUDE_PROJECT_DIR` environment variable for absolute paths.

### Updated Agent Protocols

All agents in `.claude/agents/` now have:
1. **CRITICAL: Completion Protocol** section
2. Mandatory file write instructions
3. Manifest writing requirement
4. Verification steps before reporting

---

## Completion Manifest

Every sub-agent must write a manifest before reporting completion:

```bash
powershell -ExecutionPolicy Bypass -File ".claude/scripts/write-manifest.ps1" \
  -WorkspaceRoot "." \
  -TaskId "TASK-XXX" \
  -Status "completed" \
  -FilesCreated "path1,path2" \
  -FilesModified "path3" \
  -TestsAdded 5 \
  -Notes "Brief summary"
```

This creates a JSON file:
```json
{
  "manifest_id": "TASK-XXX-143025",
  "task_id": "TASK-XXX",
  "status": "completed",
  "timestamp": "2024-12-12T14:30:25Z",
  "files_created": ["path1", "path2"],
  "files_modified": ["path3"],
  "tests_added": 5,
  "notes": "Brief summary"
}
```

---

## Primary Agent Verification Protocol

After any sub-agent call, primary agent MUST:

1. **Check manifest exists**:
   ```bash
   dir RLM\progress\manifests\TASK-XXX-*.json
   ```

2. **Read manifest**:
   ```bash
   type RLM\progress\manifests\TASK-XXX-*.json
   ```

3. **Verify files exist**:
   ```bash
   dir [each file in files_created]
   ```

4. **Run tests** (if applicable):
   ```bash
   npm test -- --watchAll=false
   ```

5. **Only then** mark task complete and update progress.

**If ANY verification fails, task is NOT complete.**

---

## Session Tracking

Each session maintains:

```
RLM/progress/token-usage/current-session.json
{
  "session_id": "SESSION-2024-12-12-143000",
  "started_at": "timestamp",
  "subagent_calls": [...],
  "files_written": [...],
  "tasks_completed": [...],
  "metrics": {
    "total_subagent_calls": N,
    "files_created": N,
    "files_modified": N
  }
}
```

---

## Key Principles

1. **Trust but Verify**: Never trust sub-agent summaries alone. Check files exist.

2. **Manifests are Truth**: The manifest file is the source of truth for what was done.

3. **Files are Proof**: If the files don't exist, the work wasn't done.

4. **Progress is Incremental**: Update after EACH verified task, not in batches.

5. **Hooks Automate**: Let hooks handle status updates, but verify they ran.

---

## Troubleshooting

### Sub-agent completed but no manifest found
- Sub-agent didn't follow protocol
- Re-run with explicit manifest requirement in prompt

### Files in manifest don't exist
- Sub-agent reported success but didn't write files
- Mark task as blocked, re-run

### status.json not updated
- Post-subagent hook may have failed
- Manually check manifests and update status

### Session tracking empty
- Session may not have started
- Run `session-start.ps1` manually

---

## Token Usage Tracking

Token tracking uses a multi-layer approach since real-time counts aren't available to the AI:

### Estimation (During Session)

Hooks on PostToolUse events estimate tokens based on:
- File read/write sizes (~0.25 tokens per char)
- Subagent spawns (2,000-12,000 tokens by type)
- Tool calls (~50 tokens base)

### Post-Session Capture (Accurate)

After session ends, capture `/cost` output:
```bash
powershell -ExecutionPolicy Bypass -File ".claude/scripts/capture-session-cost.ps1" -WorkspaceRoot "." -CostOutput "[paste /cost output]"
```

### Context Limit Detection

`PreCompact` hook fires when context is about to be summarized, logging the event for analysis.

### View Current Usage
```bash
powershell -ExecutionPolicy Bypass -File ".claude/scripts/show-token-usage.ps1" -WorkspaceRoot "." -Detailed -History
```

See [TOKEN-TRACKING.md](TOKEN-TRACKING.md) for complete documentation.

---

## Testing the System

1. Run a simple `/cc-implement TASK-XXX` command
2. Check `RLM/progress/manifests/` for new manifest
3. Check `RLM/progress/status.json` for task update
4. Check `RLM/progress/logs/[date].md` for log entry
5. Verify files mentioned in manifest exist
6. Check `RLM/progress/token-usage/` for token estimates
