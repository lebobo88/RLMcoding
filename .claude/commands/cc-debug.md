# /cc-debug - Global Debug and Reconciliation Command

Diagnose and fix common RLM project issues with interactive reconciliation.

## Usage

```
/cc-debug              # Full diagnostic scan
/cc-debug quick        # Quick health check (no fixes)
/cc-debug fix          # Auto-fix safe issues
/cc-debug [issue-type] # Check specific issue type
```

## Issue Types

| Type | Description | Auto-Fixable |
|------|-------------|--------------|
| `orphan-tasks` | Tasks without parent features | Yes |
| `missing-tasks` | Features without tasks | Partial |
| `status-mismatch` | Status.json doesn't match files | Yes |
| `checkpoint-drift` | Checkpoint.json out of sync | Yes |
| `broken-deps` | Tasks with invalid dependencies | Yes |
| `duplicate-ids` | Duplicate task/feature IDs | No |
| `missing-specs` | Tasks referencing missing specs | No |
| `stale-progress` | Progress logs older than tasks | Yes |
| `blocked-loop` | Circular blocking dependencies | No |
| `incomplete-metadata` | Tasks missing required fields | Partial |

## Workflow

### Step 1: Run Diagnostic Scan

```
┌─────────────────────────────────────────────────────────────────┐
│ RLM Project Diagnostic                                          │
├─────────────────────────────────────────────────────────────────┤
│ Scanning project structure...                                   │
│                                                                 │
│ ✓ Specs:     12 features found                                  │
│ ✓ Tasks:     47 active, 23 completed, 3 blocked                 │
│ ⚠ Status:    3 issues detected                                  │
│ ✓ Checkpoint: Generation 4, last updated 2024-12-09            │
│ ⚠ Progress:  Stale logs detected                               │
└─────────────────────────────────────────────────────────────────┘
```

### Step 2: Detail Issues Found

For each issue type detected, report:

```
┌─────────────────────────────────────────────────────────────────┐
│ Issue #1: STATUS_MISMATCH (Auto-fixable)                        │
├─────────────────────────────────────────────────────────────────┤
│ status.json shows TASK-015 as "pending"                         │
│ File location: RLM/tasks/completed/TASK-015.md                  │
│                                                                 │
│ Recommended fix: Update status.json to "completed"              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Issue #2: ORPHAN_TASK (Auto-fixable)                            │
├─────────────────────────────────────────────────────────────────┤
│ TASK-023 references FTR-099 which does not exist                │
│ File: RLM/tasks/active/TASK-023.md                              │
│                                                                 │
│ Options:                                                        │
│ A. Move to blocked/ with note                                   │
│ B. Delete task file                                             │
│ C. Skip (manual review needed)                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Issue #3: BROKEN_DEPENDENCY (Auto-fixable)                      │
├─────────────────────────────────────────────────────────────────┤
│ TASK-025 depends on TASK-099 which does not exist               │
│ File: RLM/tasks/active/TASK-025.md                              │
│                                                                 │
│ Recommended fix: Remove invalid dependency                      │
└─────────────────────────────────────────────────────────────────┘
```

### Step 3: Interactive Reconciliation

For each issue, ask user:

```
Found 5 issues (3 auto-fixable, 2 manual)

Auto-fixable issues:
1. STATUS_MISMATCH: TASK-015 status wrong [FIX]
2. BROKEN_DEPENDENCY: TASK-025 invalid dep [FIX]
3. STALE_PROGRESS: Old session logs [FIX]

Manual review needed:
4. DUPLICATE_ID: TASK-030 appears twice
5. BLOCKED_LOOP: TASK-040 ↔ TASK-041 circular

Options:
A. Fix all auto-fixable (recommended)
B. Review each fix individually
C. Skip auto-fixes, show manual issues only
D. Cancel

Choose [A/B/C/D]:
```

### Step 4: Apply Fixes

For each approved fix:

```
Applying fixes...

[1/3] STATUS_MISMATCH: TASK-015
      ├─► Reading RLM/progress/status.json
      ├─► Updating TASK-015: "pending" → "completed"
      └─► ✓ Fixed

[2/3] BROKEN_DEPENDENCY: TASK-025
      ├─► Reading RLM/tasks/active/TASK-025.md
      ├─► Removing dependency: TASK-099
      └─► ✓ Fixed

[3/3] STALE_PROGRESS: Session logs
      ├─► Archiving logs older than 30 days
      ├─► Moved 12 files to RLM/progress/logs/archive/
      └─► ✓ Fixed

All auto-fixes applied successfully.
```

### Step 5: Manual Issue Guidance

For non-auto-fixable issues, provide guidance:

```
┌─────────────────────────────────────────────────────────────────┐
│ Manual Review Required: DUPLICATE_ID                            │
├─────────────────────────────────────────────────────────────────┤
│ TASK-030 exists in two locations:                               │
│ - RLM/tasks/active/TASK-030.md (created 2024-12-08)            │
│ - RLM/tasks/completed/TASK-030.md (created 2024-12-09)         │
│                                                                 │
│ Suggested actions:                                              │
│ 1. Compare files to determine correct version                   │
│ 2. Rename duplicate with new ID (TASK-074)                      │
│ 3. Delete incorrect version                                     │
│                                                                 │
│ Run: /cc-debug fix duplicate-ids TASK-030                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Manual Review Required: BLOCKED_LOOP                            │
├─────────────────────────────────────────────────────────────────┤
│ Circular dependency detected:                                   │
│ TASK-040 depends on → TASK-041                                 │
│ TASK-041 depends on → TASK-040                                 │
│                                                                 │
│ Suggested actions:                                              │
│ 1. Review task specs to determine correct order                 │
│ 2. Remove one dependency to break cycle                         │
│ 3. Merge tasks if they should be one unit                       │
│                                                                 │
│ Run: /cc-debug fix blocked-loop TASK-040 TASK-041              │
└─────────────────────────────────────────────────────────────────┘
```

### Step 6: Generate Report

Create `RLM/progress/logs/debug-report-[timestamp].md`:

```markdown
# Debug Report

## Generated: 2024-12-09T15:30:00Z
## Command: /cc-debug

## Summary
| Status | Count |
|--------|-------|
| Issues Found | 5 |
| Auto-Fixed | 3 |
| Manual Review | 2 |
| Skipped | 0 |

## Issues Fixed
1. **STATUS_MISMATCH** - TASK-015 status corrected
2. **BROKEN_DEPENDENCY** - TASK-025 invalid dep removed
3. **STALE_PROGRESS** - 12 old logs archived

## Issues Requiring Manual Review
1. **DUPLICATE_ID** - TASK-030 exists twice
2. **BLOCKED_LOOP** - TASK-040 ↔ TASK-041 circular

## Recommendations
- Review duplicate TASK-030 files
- Break circular dependency between TASK-040/041
- Consider running `/cc-debug` weekly during active development
```

## Diagnostic Checks

### 1. Orphan Tasks
```
For each task in RLM/tasks/active/:
  Read metadata.feature (FTR-XXX)
  Check if RLM/specs/features/FTR-XXX/spec.md exists
  If not: Flag as orphan
```

### 2. Missing Tasks
```
For each feature in RLM/specs/features/:
  Check if any task references this feature
  If not: Flag as missing tasks
```

### 3. Status Mismatch
```
Read RLM/progress/status.json
For each task entry:
  Check actual file location (active/completed/blocked)
  Compare status field
  If mismatch: Flag
```

### 4. Checkpoint Drift
```
Read RLM/progress/checkpoint.json
Scan all task files for actual features/tasks
Compare lists
If drift: Flag discrepancies
```

### 5. Broken Dependencies
```
For each task:
  Read dependencies list
  For each dependency:
    Check if target task exists
    If not: Flag as broken
```

### 6. Duplicate IDs
```
Collect all task IDs from all directories
Check for duplicates
If found: Flag with locations
```

### 7. Missing Specs
```
For each task:
  Check referenced files in "Files to Create/Modify"
  For specs references, verify they exist
  If missing: Flag
```

### 8. Stale Progress
```
Read RLM/progress/logs/*.md
Compare timestamps to task modifications
If log older than 30 days: Flag as stale
```

### 9. Blocked Loop
```
Build dependency graph from all tasks
Detect cycles using DFS
If cycle found: Flag with path
```

### 10. Incomplete Metadata
```
For each task:
  Check required fields: id, title, feature, status, priority
  If missing: Flag with field name
```

## Quick Mode

`/cc-debug quick` runs health check without fixes:

```
┌─────────────────────────────────────────────────────────────────┐
│ RLM Quick Health Check                                          │
├─────────────────────────────────────────────────────────────────┤
│ Specs:      ✓ 12 features                                       │
│ Tasks:      ✓ 73 total (47 active, 23 done, 3 blocked)         │
│ Status:     ⚠ 3 mismatches                                      │
│ Checkpoint: ✓ Gen 4, synced                                    │
│ Progress:   ⚠ 12 stale logs                                     │
│ Deps:       ✓ All valid                                         │
├─────────────────────────────────────────────────────────────────┤
│ Health: FAIR (2 warnings)                                       │
│ Run `/cc-debug` for full diagnostics                            │
└─────────────────────────────────────────────────────────────────┘
```

## Auto-Fix Mode

`/cc-debug fix` applies all safe fixes without prompts:

```
Auto-fixing safe issues...
✓ Fixed 3 status mismatches
✓ Fixed 2 broken dependencies
✓ Archived 12 stale logs
✓ Updated checkpoint.json

Skipped 2 issues requiring manual review.
Run `/cc-debug` for details on manual issues.
```

## Configuration

Add to `RLM/progress/cc-config.json`:

```json
{
  "debug": {
    "auto_fix_safe": true,
    "archive_logs_after_days": 30,
    "warn_on_stale_checkpoint_hours": 24,
    "max_dependency_depth": 10
  }
}
```
