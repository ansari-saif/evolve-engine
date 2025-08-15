import { Page, expect } from '@playwright/test';

/**
 * Utility functions for common test operations
 */
export class TestHelpers {
  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
  }

  /**
   * Wait for element to be visible and stable
   */
  static async waitForElement(page: Page, selector: string): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible' });
  }

  /**
   * Take a screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `test-results/screenshots/${name}-${timestamp}.png` });
  }

  /**
   * Verify element text content
   */
  static async expectText(page: Page, selector: string, expectedText: string): Promise<void> {
    await expect(page.locator(selector)).toHaveText(expectedText);
  }

  /**
   * Verify element is visible
   */
  static async expectVisible(page: Page, selector: string): Promise<void> {
    await expect(page.locator(selector)).toBeVisible();
  }

  /**
   * Verify element is not visible
   */
  static async expectNotVisible(page: Page, selector: string): Promise<void> {
    await expect(page.locator(selector)).not.toBeVisible();
  }
}
