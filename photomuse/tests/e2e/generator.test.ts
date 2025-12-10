import { test, expect } from '@playwright/test';

const mockShootCard = {
  id: 'test-card-1',
  title: 'Golden Hour Portrait',
  description: 'Capture the ethereal beauty of golden hour light on a contemplative subject.',
  subject: 'Portrait',
  technique: {
    aperture: 'f/2.8 for shallow depth',
    shutter: '1/200s to freeze motion',
    lighting: 'Natural golden hour backlighting',
    composition: 'Center subject with negative space',
  },
  mood: 'Contemplative',
  location: 'Open field at sunset',
  colorPalette: ['#1A1A1D', '#D4957A', '#E6B89C', '#FFD700', '#8B4513'],
  challengeLevel: 3,
  proTips: [
    'Shoot during the last hour before sunset',
    'Use a reflector to fill shadows',
    'Have your subject face away from the sun',
  ],
  referenceImages: [],
};

test.describe('Generator Page (FTR-001)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/generate');
    await page.waitForLoadState('networkidle');
  });

  test('displays header with brand logo and generate button', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'PHOTOMUSE' })).toBeVisible();
    await expect(page.getByRole('button', { name: /generate/i })).toBeVisible();
  });

  test('displays empty state with call to action', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /ready for inspiration/i })
    ).toBeVisible();
    await expect(
      page.getByText(/click the button below/i)
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /inspire me/i })
    ).toBeVisible();
  });

  test('logo links back to landing page', async ({ page }) => {
    const logoLink = page.getByRole('link', { name: /photomuse/i });
    await logoLink.click();
    await expect(page).toHaveURL('/');
  });

  test('has accessible main content landmark', async ({ page }) => {
    const main = page.locator('main#main-content');
    await expect(main).toBeVisible();
  });

  test('Inspire Me button is focusable and clickable', async ({ page }) => {
    const button = page.getByRole('button', { name: /inspire me/i });
    await button.focus();
    await expect(button).toBeFocused();
  });
});

test.describe('Generator Loading State (FTR-004)', () => {
  test('shows loading animation when generating', async ({ page }) => {
    // Mock the API to delay response
    await page.route('**/api/generate', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockShootCard }),
      });
    });

    await page.goto('/generate');
    await page.waitForLoadState('networkidle');

    // Click generate button
    const button = page.getByRole('button', { name: /inspire me/i });
    await button.click();

    // Check loading state appears
    await expect(page.getByText(/crafting your vision/i)).toBeVisible();
  });
});

test.describe('Shoot Card Display (FTR-001)', () => {
  test.beforeEach(async ({ page }) => {
    // Set up mock BEFORE navigation
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockShootCard }),
      });
    });

    await page.goto('/generate');
    await page.waitForLoadState('networkidle');
  });

  test('displays shoot card after generation', async ({ page }) => {
    const button = page.getByRole('button', { name: /inspire me/i });
    await button.click();

    // Wait for card to appear with increased timeout
    await expect(page.getByRole('heading', { name: 'Golden Hour Portrait' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/capture the ethereal beauty/i)).toBeVisible();
  });

  test('displays technique guide section', async ({ page }) => {
    const button = page.getByRole('button', { name: /inspire me/i });
    await button.click();

    await expect(page.getByRole('heading', { name: 'Golden Hour Portrait' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Technique Guide' })).toBeVisible();
    await expect(page.getByText('Aperture', { exact: true })).toBeVisible();
    await expect(page.getByText('Shutter', { exact: true })).toBeVisible();
    await expect(page.getByText('Lighting', { exact: true })).toBeVisible();
    await expect(page.getByText('Composition', { exact: true })).toBeVisible();
  });

  test('displays color palette', async ({ page }) => {
    const button = page.getByRole('button', { name: /inspire me/i });
    await button.click();

    await expect(page.getByRole('heading', { name: 'Golden Hour Portrait' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Color Palette' })).toBeVisible();
    // Color swatches should be present
    await expect(page.getByTitle(/click to copy/i).first()).toBeVisible();
  });

  test('displays pro tips section', async ({ page }) => {
    const button = page.getByRole('button', { name: /inspire me/i });
    await button.click();

    await expect(page.getByRole('heading', { name: 'Golden Hour Portrait' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Pro Tips' })).toBeVisible();
    await expect(page.getByText(/shoot during the last hour/i)).toBeVisible();
  });

  test('displays challenge rating', async ({ page }) => {
    const button = page.getByRole('button', { name: /inspire me/i });
    await button.click();

    await expect(page.getByRole('heading', { name: 'Golden Hour Portrait' })).toBeVisible({ timeout: 10000 });
    // Challenge stars should be visible
    const challengeSection = page.locator('[aria-label*="Difficulty"]');
    await expect(challengeSection).toBeVisible();
  });

  test('displays Generate Another button after card shown', async ({ page }) => {
    const button = page.getByRole('button', { name: /inspire me/i });
    await button.click();

    await expect(page.getByRole('heading', { name: 'Golden Hour Portrait' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /generate another idea/i })).toBeVisible();
  });

  test('header changes to New Idea after generation', async ({ page }) => {
    const button = page.getByRole('button', { name: /inspire me/i });
    await button.click();

    await expect(page.getByRole('heading', { name: 'Golden Hour Portrait' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /new idea/i })).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('displays error message on API failure', async ({ page }) => {
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Failed to generate. Please try again.',
        }),
      });
    });

    await page.goto('/generate');
    await page.waitForLoadState('networkidle');

    const button = page.getByRole('button', { name: /inspire me/i });
    await button.click();

    await expect(page.getByText(/failed to generate/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('shoot card has proper ARIA labels', async ({ page }) => {
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'test-a11y',
            title: 'Accessibility Test Card',
            description: 'Testing accessibility features.',
            subject: 'Portrait',
            technique: {
              aperture: 'f/2.8',
              shutter: '1/200s',
              lighting: 'Natural',
              composition: 'Centered',
            },
            mood: 'Calm',
            location: 'Studio',
            colorPalette: ['#1A1A1D', '#D4957A'],
            challengeLevel: 2,
            proTips: ['Test tip'],
            referenceImages: [],
          },
        }),
      });
    });

    await page.goto('/generate');
    await page.waitForLoadState('networkidle');

    const button = page.getByRole('button', { name: /inspire me/i });
    await button.click();

    // Card should have article role with aria-label
    const card = page.getByRole('article', { name: /shoot concept: accessibility test card/i });
    await expect(card).toBeVisible({ timeout: 10000 });

    // Color buttons should have aria-labels
    const colorButton = page.getByRole('button', { name: /color.*click to copy/i }).first();
    await expect(colorButton).toBeVisible();
  });
});
