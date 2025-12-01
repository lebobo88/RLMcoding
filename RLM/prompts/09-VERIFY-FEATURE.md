# RLM Prompt: Verify Feature

## Purpose

Verify a completed feature by generating and running comprehensive E2E tests from acceptance criteria. This prompt is triggered automatically when all tasks for a feature are completed, or manually via `/cc-verify FTR-XXX`.

## Prerequisites

- All implementation tasks for the feature are completed
- Feature specification exists at `RLM/specs/features/FTR-XXX/spec.md`
- Development server can be started via `npm run dev`
- Playwright and axe-core are configured

---

## Phase 1: Validate Feature Readiness

### Step 1.1: Load Feature Context

```
Read: RLM/specs/features/[FTR-XXX]/spec.md
```

Extract:
- Feature ID, name, and status
- All user stories (US-XXX)
- Acceptance criteria for each user story
- Technical specifications (routes, API endpoints)
- Testing requirements section

### Step 1.2: Verify Task Completion

```
Scan: RLM/tasks/active/ for tasks with "## Feature: [FTR-XXX]"
Scan: RLM/tasks/completed/ for tasks with "## Feature: [FTR-XXX]"
```

Compute:
- `totalTasks`: Count of all tasks for this feature
- `completedTasks`: Count in completed/ directory
- `remainingTasks`: Count in active/ directory

If `remainingTasks > 0`:
```
⛔ VERIFICATION BLOCKED

Feature FTR-XXX has incomplete tasks:
- TASK-XXX: [title] (active)
- TASK-YYY: [title] (active)

Complete all tasks before verification.
```
EXIT

### Step 1.3: Update Feature Status

Update `RLM/progress/status.json`:
```json
{
  "features": {
    "FTR-XXX": {
      "status": "verification-pending",
      "totalTasks": [count],
      "completedTasks": [count]
    }
  }
}
```

---

## Phase 2: Parse Acceptance Criteria

### Step 2.1: Extract User Stories

From the feature spec, identify all user stories:

```markdown
## User Stories

### US-001: [Story Title]
As a [user type], I want to [action] so that [benefit].

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
```

### Step 2.2: Categorize Criteria by Test Type

Map each criterion to a test category:

| Pattern | Category | Test Approach |
|---------|----------|---------------|
| "User can [action]" | Functional | Simulate action, verify outcome |
| "[element] displays/shows" | Visibility | Check element visible with correct content |
| "Invalid [x] shows error" | Error Handling | Submit invalid data, verify error |
| "Successful [x] redirects to" | Navigation | Complete action, verify URL |
| "Rate limiting prevents" | API Behavior | Mock rate limit response |
| "[x] is logged/recorded" | Side Effects | Verify log/database entry |
| "Session expires after" | Timing | Test timeout behavior |

### Step 2.3: Identify Routes and Components

From Technical Specifications section:
- UI routes to test (e.g., `/login`, `/dashboard`)
- API endpoints to verify (e.g., `POST /api/auth/login`)
- Key components and their selectors

---

## Phase 3: Generate E2E Tests

### Step 3.1: Create Feature Test Directory

```
mkdir -p rlm-app/tests/e2e/features/FTR-XXX/
```

### Step 3.2: Generate Functional Tests

Create: `rlm-app/tests/e2e/features/FTR-XXX/FTR-XXX.functional.test.ts`

For each user story, generate tests from acceptance criteria:

```typescript
import { test, expect } from '@playwright/test';

test.describe('FTR-XXX: [Feature Name]', () => {

  test.describe('US-001: [User Story Title]', () => {

    test('should [criterion 1 in test form]', async ({ page }) => {
      // Arrange: Navigate to feature route
      await page.goto('/[route]');

      // Act: Perform the action from criterion
      await page.locator('[selector]').fill('value');
      await page.locator('[submit]').click();

      // Assert: Verify expected outcome
      await expect(page.locator('[result]')).toBeVisible();
    });

    test('should [criterion 2 in test form]', async ({ page }) => {
      // ...
    });
  });

  test.describe('US-002: [User Story Title]', () => {
    // Tests for second user story
  });
});
```

### Step 3.3: Generate Accessibility Tests

Create: `rlm-app/tests/e2e/features/FTR-XXX/FTR-XXX.a11y.test.ts`

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('FTR-XXX: [Feature Name] - Accessibility', () => {

  test('main page meets WCAG 2.1 AA standards', async ({ page }) => {
    await page.goto('/[main-route]');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('error state meets accessibility standards', async ({ page }) => {
    await page.goto('/[main-route]');
    // Trigger error state
    await page.locator('button[type="submit"]').click();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/[main-route]');

    // Tab through all focusable elements
    const focusable = page.locator(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const count = await focusable.count();

    for (let i = 0; i < count; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.locator(':focus').first();
      await expect(focused).toBeVisible();
    }
  });

  test('color contrast meets WCAG requirements', async ({ page }) => {
    await page.goto('/[main-route]');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();

    const contrastViolations = results.violations.filter(
      v => v.id.includes('contrast')
    );
    expect(contrastViolations).toEqual([]);
  });

  test('focus indicators are visible', async ({ page }) => {
    await page.goto('/[main-route]');

    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      await button.focus();

      // Check for visible focus indicator
      const hasFocusStyle = await button.evaluate(el => {
        const style = window.getComputedStyle(el);
        return (
          style.outline !== 'none' ||
          style.boxShadow !== 'none' ||
          style.border !== window.getComputedStyle(document.body).border
        );
      });

      expect(hasFocusStyle).toBe(true);
    }
  });
});
```

### Step 3.4: Generate Visual Regression Tests

Create: `rlm-app/tests/e2e/features/FTR-XXX/FTR-XXX.visual.test.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('FTR-XXX: [Feature Name] - Visual Regression', () => {

  test('default state matches baseline', async ({ page }) => {
    await page.goto('/[main-route]');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('FTR-XXX-default.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('error state matches baseline', async ({ page }) => {
    await page.goto('/[main-route]');
    // Trigger error
    await page.locator('button[type="submit"]').click();
    await page.waitForSelector('[data-testid="error"]');

    await expect(page).toHaveScreenshot('FTR-XXX-error.png', {
      fullPage: true,
    });
  });

  test('success state matches baseline', async ({ page }) => {
    await page.goto('/[main-route]');
    // Complete successful flow
    await page.locator('[data-testid="input"]').fill('valid-data');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/success/);

    await expect(page).toHaveScreenshot('FTR-XXX-success.png', {
      fullPage: true,
    });
  });

  test('mobile layout matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/[main-route]');

    await expect(page).toHaveScreenshot('FTR-XXX-mobile.png', {
      fullPage: true,
    });
  });

  test('tablet layout matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/[main-route]');

    await expect(page).toHaveScreenshot('FTR-XXX-tablet.png', {
      fullPage: true,
    });
  });
});
```

### Step 3.5: Create Page Object (if needed)

If the feature requires complex interactions, create a Page Object:

```typescript
// rlm-app/tests/e2e/page-objects/[feature].page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class [Feature]Page extends BasePage {
  readonly form: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page, '/[route]');
    this.form = page.locator('form');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
  }

  async submitForm(data: Record<string, string>): Promise<void> {
    for (const [name, value] of Object.entries(data)) {
      await this.page.locator(`[name="${name}"]`).fill(value);
    }
    await this.submitButton.click();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectSuccess(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
  }
}
```

---

## Phase 4: Run Test Suite

### Step 4.1: Execute Tests

```bash
# Run all tests for the feature
cd rlm-app
npx playwright test tests/e2e/features/FTR-XXX/ --reporter=json,html

# Output: test-results/results.json
```

### Step 4.2: Parse Results

Read `test-results/results.json` and extract:
- Total tests run
- Passed count
- Failed count
- Skipped count
- Duration
- Individual test results with error details

---

## Phase 5: Analyze Results

### Step 5.1: Categorize Failures

Group failures by type:
- **Functional failures**: Test assertions failed
- **Accessibility violations**: axe-core detected issues
- **Visual regressions**: Screenshot diffs exceeded threshold

### Step 5.2: Generate Verification Report

Create: `RLM/progress/verification/FTR-XXX-[timestamp].md`

```markdown
# Feature Verification Report

## Feature: FTR-XXX - [Feature Name]
## Verification Date: [ISO-8601]
## Result: PASSED | FAILED

---

## Summary

| Category | Passed | Total | Status |
|----------|--------|-------|--------|
| Functional | X | Y | ✅/❌ |
| Accessibility | X | Y | ✅/❌ |
| Visual | X | Y | ✅/❌ |
| **Total** | **X** | **Y** | **✅/❌** |

## Test Duration
- Total: Xs
- Average per test: Xms

---

## Detailed Results

### Functional Tests

| Test | Status | Duration | Error |
|------|--------|----------|-------|
| US-001: should allow login | ✅ | 1.2s | - |
| US-001: should show error for invalid credentials | ❌ | 0.8s | [link] |

### Accessibility Tests

| Test | Status | Violations |
|------|--------|------------|
| WCAG 2.1 AA compliance | ❌ | 2 |
| Keyboard accessibility | ✅ | 0 |

#### Accessibility Violations

1. **color-contrast** (serious)
   - Element: `<p class="error-text">`
   - Issue: Foreground and background colors do not have sufficient contrast ratio
   - Fix: Increase contrast to 4.5:1 minimum

2. **button-name** (critical)
   - Element: `<button class="icon-btn">`
   - Issue: Button does not have an accessible name
   - Fix: Add aria-label or visible text

### Visual Regression Tests

| Test | Status | Diff Pixels |
|------|--------|-------------|
| Default state | ✅ | 0 |
| Mobile layout | ❌ | 245 |

---

## Evidence

- Screenshots: `rlm-app/test-results/FTR-XXX/`
- Trace files: `rlm-app/test-results/trace.zip`
- HTML Report: `rlm-app/playwright-report/index.html`

---

## Bug Tasks Created

[If failures exist]
- TASK-XXX-BUG-001: [Title]
- TASK-XXX-BUG-002: [Title]

---

## Next Steps

[If PASSED]
Feature FTR-XXX is verified and ready for release.

[If FAILED]
1. Review and fix bug tasks in `RLM/tasks/active/`
2. Run `/cc-verify FTR-XXX --retry` after fixes
```

---

## Phase 6: Handle Results

### On PASS

1. Update feature status:
```json
{
  "features": {
    "FTR-XXX": {
      "status": "verified",
      "verificationRuns": [...]
    }
  }
}
```

2. Update feature spec status to `Verified`

3. Report to user:
```
✅ FEATURE VERIFIED: FTR-XXX

All acceptance criteria have been validated:
- Functional: 15/15 passed
- Accessibility: 8/8 passed
- Visual: 6/6 passed

Report: RLM/progress/verification/FTR-XXX-[timestamp].md
```

### On FAIL (Block & Report)

1. Update feature status:
```json
{
  "features": {
    "FTR-XXX": {
      "status": "verification-failed",
      "verificationRuns": [...]
    }
  }
}
```

2. Create bug tasks for each failure (use template)

3. Report to user:
```
❌ FEATURE VERIFICATION FAILED: FTR-XXX

Failures detected:
- 2 functional test failures
- 1 accessibility violation
- 1 visual regression

Bug tasks created:
- TASK-XXX-BUG-001: Login redirect not working
- TASK-XXX-BUG-002: Missing button accessible name
- TASK-XXX-BUG-003: Error text contrast too low
- TASK-XXX-BUG-004: Mobile layout regression

Next steps:
1. Fix the bug tasks
2. Run: /cc-verify FTR-XXX --retry
```

---

## Phase 7: Retry After Bug Fixes

When `--retry` flag is used:

1. Verify all `TASK-XXX-BUG-*` tasks are completed
2. Run full verification suite again
3. Compare results with previous run
4. Report fixes and any remaining issues

```
🔄 Re-verification: FTR-XXX

Previous failures now passing:
✅ TASK-XXX-BUG-001: Login redirect (fixed)
✅ TASK-XXX-BUG-002: Button name (fixed)
❌ TASK-XXX-BUG-003: Error contrast (still failing)

Remaining issues: 1
New bug task: TASK-XXX-BUG-005: Error contrast still below threshold
```

---

## Output Artifacts

| Artifact | Location |
|----------|----------|
| E2E Tests | `rlm-app/tests/e2e/features/FTR-XXX/` |
| Page Objects | `rlm-app/tests/e2e/page-objects/` |
| Test Results | `rlm-app/test-results/` |
| HTML Report | `rlm-app/playwright-report/` |
| Verification Report | `RLM/progress/verification/FTR-XXX-[timestamp].md` |
| Bug Tasks | `RLM/tasks/active/TASK-XXX-BUG-*.md` |
