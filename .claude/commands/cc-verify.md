# /cc-verify - Feature Verification Command

Verify a completed feature by running comprehensive E2E tests generated from acceptance criteria.

## Usage

```bash
/cc-verify FTR-XXX          # Verify specific feature
/cc-verify all              # Verify all features with status 'verification-pending'
/cc-verify FTR-XXX --retry  # Re-verify after bug fixes
```

## Workflow

### Step 1: Parse Arguments

Extract from command:
- `featureId`: The feature ID (FTR-XXX) or 'all'
- `isRetry`: Whether this is a retry after bug fixes

### Step 2: Validate Feature Completion

For the specified feature(s):

1. Read `RLM/tasks/INDEX.md` to find all tasks for the feature
2. Scan `RLM/tasks/active/` and `RLM/tasks/completed/`
3. Verify 100% of feature tasks are in `completed/`

If tasks remain in `active/`:
```
⚠️ Feature FTR-XXX cannot be verified.
   Remaining tasks: TASK-001, TASK-002
   Complete all tasks before verification.
```

### Step 3: Load Feature Context

Read the feature specification:
```
RLM/specs/features/FTR-XXX/spec.md
```

Extract:
- Feature name and description
- All user stories
- Acceptance criteria (the testable items)
- API endpoints (if any)
- UI routes (if any)

### Step 4: Spawn Verifier Sub-Agent

Delegate to the verifier agent with full context:

```markdown
## Verification Request

**Feature ID**: FTR-XXX
**Feature Name**: [from spec]
**Is Retry**: [yes/no]
**Feature Spec Path**: RLM/specs/features/FTR-XXX/spec.md

### Acceptance Criteria to Verify

#### US-001: [User Story]
- [ ] Criterion 1
- [ ] Criterion 2

#### US-002: [User Story]
- [ ] Criterion 1
- [ ] Criterion 2

### Routes to Test
- /[route-1]
- /[route-2]

### Instructions
1. Generate Playwright E2E tests from the acceptance criteria above
2. Run functional, accessibility, and visual regression tests
3. On PASS: Update feature status to 'verified'
4. On FAIL: Create bug tasks and block the feature
```

### Step 5: Process Verifier Results

#### On PASS

```
✅ Feature FTR-XXX VERIFIED

Test Results:
├── Functional: 12/12 passed
├── Accessibility: 8/8 passed
└── Visual: 5/5 passed

Status: verified
Report: RLM/progress/verification/FTR-XXX-2024-01-15.md
```

Update `RLM/progress/status.json`:
```json
{
  "features": {
    "FTR-XXX": {
      "status": "verified",
      "verificationRuns": [{
        "timestamp": "[ISO-8601]",
        "result": "passed",
        "testResults": {
          "functional": { "passed": 12, "total": 12 },
          "accessibility": { "passed": 8, "total": 8 },
          "visual": { "passed": 5, "total": 5 }
        }
      }]
    }
  }
}
```

#### On FAIL

```
❌ Feature FTR-XXX VERIFICATION FAILED

Test Results:
├── Functional: 10/12 passed
├── Accessibility: 6/8 passed (2 WCAG violations)
└── Visual: 4/5 passed (1 regression)

Bug Tasks Created:
├── TASK-XXX-BUG-001: Login form missing keyboard focus indicator
├── TASK-XXX-BUG-002: Color contrast violation on error message
└── TASK-XXX-BUG-003: Visual regression on mobile layout

Status: verification-failed
Report: RLM/progress/verification/FTR-XXX-2024-01-15.md

Next Steps:
1. Fix the bug tasks in RLM/tasks/active/
2. Run: /cc-verify FTR-XXX --retry
```

Update `RLM/progress/status.json`:
```json
{
  "features": {
    "FTR-XXX": {
      "status": "verification-failed",
      "verificationRuns": [{
        "timestamp": "[ISO-8601]",
        "result": "failed",
        "testResults": {
          "functional": { "passed": 10, "total": 12 },
          "accessibility": { "passed": 6, "total": 8 },
          "visual": { "passed": 4, "total": 5 }
        },
        "bugTasksCreated": [
          "TASK-XXX-BUG-001",
          "TASK-XXX-BUG-002",
          "TASK-XXX-BUG-003"
        ]
      }]
    }
  }
}
```

### Step 6: Verify All (when `all` is specified)

When `/cc-verify all` is called:

1. Scan `RLM/progress/status.json` for features with status `verification-pending`
2. For each feature, run verification sequentially
3. Report aggregate results:

```
Feature Verification Summary
============================

FTR-001: ✅ VERIFIED
FTR-002: ❌ FAILED (3 bug tasks created)
FTR-003: ✅ VERIFIED

Total: 2/3 verified
Bug tasks created: 3
```

## Automatic Triggering

This command is automatically triggered by the post-task hook when:
1. A task is completed
2. That task was the last remaining task for its feature
3. All other tasks for the same feature are in `completed/`

The hook calls: `/cc-verify FTR-XXX`

## Re-verification After Bug Fixes

When `/cc-verify FTR-XXX --retry` is called:

1. Verify all `TASK-XXX-BUG-*` tasks for the feature are completed
2. If bug tasks remain: Block and notify user
3. If all resolved: Run full verification suite again
4. Compare with previous run to highlight fixes

```
🔄 Re-verifying FTR-XXX after bug fixes...

Previously failed tests now passing:
├── ✅ Login form keyboard focus (was TASK-XXX-BUG-001)
├── ✅ Error message contrast (was TASK-XXX-BUG-002)
└── ✅ Mobile layout regression (was TASK-XXX-BUG-003)

All tests passing. Feature FTR-XXX is now VERIFIED.
```

## Test File Locations

Generated tests are stored per-feature:
```
rlm-app/tests/e2e/features/
├── FTR-001/
│   ├── FTR-001.functional.test.ts
│   ├── FTR-001.a11y.test.ts
│   └── FTR-001.visual.test.ts
├── FTR-002/
│   └── ...
```

## Verification Reports

Reports are stored with timestamps:
```
RLM/progress/verification/
├── FTR-001-2024-01-15T10-30-00.md
├── FTR-001-2024-01-16T14-00-00.md  # retry
└── FTR-002-2024-01-15T11-00-00.md
```

## Dependencies

- Feature spec must exist at `RLM/specs/features/FTR-XXX/spec.md`
- All feature tasks must be completed
- Playwright must be configured with axe-core
- Dev server must be runnable via `npm run dev`

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Feature not found | No spec at expected path | Create feature spec first |
| Tasks incomplete | Active tasks remain | Complete all tasks |
| Server failed | Dev server won't start | Fix build/startup errors |
| Tests failed | Implementation issues | Fix bugs, then retry |
