import { Page, expect } from '@playwright/test';

/**
 * Wait utility functions for E2E tests
 */
export class WaitHelpers {
  /**
   * Wait for element to be visible with custom timeout
   */
  static async waitForElement(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   */
  static async waitForElementHidden(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   * Wait for element to be attached to DOM
   */
  static async waitForElementAttached(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await page.waitForSelector(selector, { state: 'attached', timeout });
  }

  /**
   * Wait for element to be detached from DOM
   */
  static async waitForElementDetached(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await page.waitForSelector(selector, { state: 'detached', timeout });
  }

  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
  }

  /**
   * Wait for page to be loaded (DOM ready)
   */
  static async waitForDOMReady(page: Page): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for specific URL
   */
  static async waitForURL(page: Page, url: string | RegExp, timeout: number = 5000): Promise<void> {
    await page.waitForURL(url, { timeout });
  }

  /**
   * Wait for navigation to complete
   */
  static async waitForNavigation(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
  }

  /**
   * Wait for network request to complete
   */
  static async waitForRequest(page: Page, urlPattern: string | RegExp, timeout: number = 5000): Promise<void> {
    await page.waitForRequest(urlPattern, { timeout });
  }

  /**
   * Wait for network response
   */
  static async waitForResponse(page: Page, urlPattern: string | RegExp, timeout: number = 5000): Promise<void> {
    await page.waitForResponse(urlPattern, { timeout });
  }

  /**
   * Wait for function to return true
   */
  static async waitForFunction(page: Page, fn: () => boolean, timeout: number = 5000): Promise<void> {
    await page.waitForFunction(fn, { timeout });
  }

  /**
   * Wait for element text to match
   */
  static async waitForText(page: Page, selector: string, text: string | RegExp, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toHaveText(text, { timeout });
  }

  /**
   * Wait for element to contain text
   */
  static async waitForTextContains(page: Page, selector: string, text: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toContainText(text, { timeout });
  }

  /**
   * Wait for element value to match
   */
  static async waitForValue(page: Page, selector: string, value: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toHaveValue(value, { timeout });
  }

  /**
   * Wait for element to be enabled
   */
  static async waitForEnabled(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toBeEnabled({ timeout });
  }

  /**
   * Wait for element to be disabled
   */
  static async waitForDisabled(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toBeDisabled({ timeout });
  }

  /**
   * Wait for element to be checked
   */
  static async waitForChecked(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toBeChecked({ timeout });
  }

  /**
   * Wait for element to be unchecked
   */
  static async waitForUnchecked(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).not.toBeChecked({ timeout });
  }

  /**
   * Wait for element count to match
   */
  static async waitForElementCount(page: Page, selector: string, count: number, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toHaveCount(count, { timeout });
  }

  /**
   * Wait for element to have specific attribute
   */
  static async waitForAttribute(page: Page, selector: string, attribute: string, value: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toHaveAttribute(attribute, value, { timeout });
  }

  /**
   * Wait for element to have class
   */
  static async waitForClass(page: Page, selector: string, className: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toHaveClass(new RegExp(className), { timeout });
  }

  /**
   * Wait for element to not have class
   */
  static async waitForNotClass(page: Page, selector: string, className: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).not.toHaveClass(new RegExp(className), { timeout });
  }

  /**
   * Wait for element to be focused
   */
  static async waitForFocused(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toBeFocused({ timeout });
  }

  /**
   * Wait for element to be empty
   */
  static async waitForEmpty(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toBeEmpty({ timeout });
  }

  /**
   * Wait for element to not be empty
   */
  static async waitForNotEmpty(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).not.toBeEmpty({ timeout });
  }

  /**
   * Wait for element to have specific CSS property
   */
  static async waitForCSSProperty(page: Page, selector: string, property: string, value: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toHaveCSS(property, value, { timeout });
  }

  /**
   * Wait for element to be in viewport
   */
  static async waitForInViewport(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).toBeInViewport({ timeout });
  }

  /**
   * Wait for element to not be in viewport
   */
  static async waitForNotInViewport(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await expect(page.locator(selector)).not.toBeInViewport({ timeout });
  }

  /**
   * Wait for a specific amount of time (use sparingly)
   */
  static async waitForTime(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Wait for animation to complete (approximate)
   */
  static async waitForAnimation(page: Page, selector: string, timeout: number = 1000): Promise<void> {
    // Wait for CSS transitions/animations to complete
    await this.waitForTime(timeout);
  }

  /**
   * Wait for loading spinner to disappear
   */
  static async waitForLoadingComplete(page: Page, spinnerSelector: string = '[data-testid="loading-spinner"]', timeout: number = 10000): Promise<void> {
    try {
      await this.waitForElementHidden(page, spinnerSelector, timeout);
    } catch (error) {
      // If spinner doesn't exist, that's fine
      console.log('Loading spinner not found or already hidden');
    }
  }

  /**
   * Wait for toast/notification to appear and then disappear
   */
  static async waitForToast(page: Page, toastSelector: string = '[data-testid="toast"]', timeout: number = 5000): Promise<void> {
    // Wait for toast to appear
    await this.waitForElement(page, toastSelector, timeout);
    
    // Wait for toast to disappear
    await this.waitForElementHidden(page, toastSelector, timeout * 2);
  }
}
