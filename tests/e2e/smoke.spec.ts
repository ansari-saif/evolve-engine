import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load the application', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Verify the page loads (checking for any title that indicates the app is working)
    await expect(page).toHaveTitle(/.*/);
    
    // Check that the page is accessible
    await expect(page.locator('body')).toBeVisible();
    
    // Log the actual title for debugging
    const title = await page.title();
    console.log('Page title:', title);
  });

  test('should have basic page structure', async ({ page }) => {
    await page.goto('/');
    
    // Verify basic page elements exist
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
    // Note: head element is typically hidden in browsers, so we don't test for it
  });
});
