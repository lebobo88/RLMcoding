# Verify Tasks Command

Re-verifies all tasks to ensure files actually exist. Use this to audit sub-agent work.

## Arguments

`$ARGUMENTS` can be:
- (empty) - Verify all completed tasks
- `active` - Verify active tasks have required dependencies
- `all` - Verify both active and completed tasks
- `TASK-XXX` - Verify specific task

## Workflow

### Step 1: Determine Scope

```
If $ARGUMENTS is empty or "completed":
  - Scan RLM/tasks/completed/*.md

If $ARGUMENTS is "active":
  - Scan RLM/tasks/active/*.md

If $ARGUMENTS is "all":
  - Scan both directories

If $ARGUMENTS matches TASK-XXX:
  - Find that specific task file
```

### Step 2: For Each Task

1. **Read task file** to extract:
   - Feature ID (from metadata)
   - Expected deliverables (from acceptance criteria)

2. **Check for completion manifest**:
   ```bash
   dir RLM\progress\manifests\TASK-XXX-*.json
   ```

3. **If manifest exists, verify files**:
   ```bash
   # For each file in files_created and files_modified
   dir [file_path]
   ```

4. **If no manifest, check common locations**:
   - Look for files matching task description
   - Check test files exist
   - Check implementation files exist

### Step 3: Run Verification Script

For comprehensive verification, run:

```bash
powershell -ExecutionPolicy Bypass -File ".claude/scripts/verify-tasks.ps1" -WorkspaceRoot "." -Scope "[scope]"
```

### Step 4: Report Results

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TASK VERIFICATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scope: [completed/active/all]
Tasks Checked: N

VERIFIED (files exist):
├─► TASK-001: ✅ 3 files verified
├─► TASK-002: ✅ 2 files verified
└─► TASK-003: ✅ 4 files verified

ISSUES FOUND:
├─► TASK-004: ⚠️ Missing 2 files
│   └─ src/components/Button.tsx
│   └─ src/__tests__/Button.test.tsx
├─► TASK-005: ❌ No manifest found
└─► TASK-006: ⚠️ Missing 1 file
    └─ src/utils/format.ts

SUMMARY:
  Verified: X tasks
  Issues: Y tasks
  No Manifest: Z tasks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 5: Offer Remediation

If issues found:

```
Would you like to:
1. Move unverified tasks back to active/ for re-implementation
2. Create bug tasks for missing files
3. Re-run implementation for specific tasks

Reply with option number or task ID to re-implement.
```

## Automatic Actions

Based on verification results:

### For tasks with missing files:
1. Move from `completed/` back to `active/`
2. Add note to task file documenting what's missing
3. Update status.json

### For tasks without manifests:
1. Flag for manual review
2. Attempt to locate files based on task description
3. Create manifest if files found

## Example Usage

```
/cc-verify-tasks              # Verify all completed
/cc-verify-tasks active       # Check active tasks are ready
/cc-verify-tasks TASK-005     # Verify specific task
/cc-verify-tasks all          # Full audit
```
