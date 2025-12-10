import { test, expect } from '@playwright/test';

test.describe('Landing Page (FTR-005)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('displays hero section with brand name', async ({ page }) => {
    // Check for the brand text in the page content using exact match
    await expect(page.getByText('PHOTOMUSE', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('displays subheadline with value proposition', async ({ page }) => {
    await expect(
      page.getByText(/ai-powered photography ideas/i)
    ).toBeVisible();
  });

  test('has Start Creating CTA button that navigates to /generate', async ({ page }) => {
    const ctaButton = page.getByRole('link', { name: /start creating/i });
    await expect(ctaButton).toBeVisible();
    await ctaButton.click();
    await expect(page).toHaveURL(/\/generate/);
  });

  test('displays How It Works section with 3 steps', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /how it works/i })).toBeVisible();
    await expect(page.getByText('01')).toBeVisible();
    await expect(page.getByText('02')).toBeVisible();
    await expect(page.getByText('03')).toBeVisible();
  });

  test('displays final CTA section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /ready to create something/i })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /begin your creative journey/i })
    ).toBeVisible();
  });

  test('has accessible main content landmark', async ({ page }) => {
    const main = page.locator('main#main-content');
    await expect(main).toBeVisible();
  });

  test('footer displays attribution', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer').getByText(/PhotoMuse/)).toBeVisible();
  });
});
