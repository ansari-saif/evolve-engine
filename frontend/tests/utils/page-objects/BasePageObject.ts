import { Page, expect, Locator } from '@playwright/test';

/**
 * Base Page Object class providing common functionality for all page objects
 */
export abstract class BasePageObject {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for element to be visible and stable
   */
  async waitForElement(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }

  /**
   * Take a screenshot with timestamp
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png` 
    });
  }

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForLoad();
  }

  /**
   * Get element by data-testid attribute
   */
  getByTestId(testId: string): Locator {
    return this.page.locator(`[data-testid="${testId}"]`);
  }

  /**
   * Get element by role and name
   */
  getByRole(role: string, name?: string): Locator {
    return this.page.getByRole(role, name ? { name } : undefined);
  }

  /**
   * Get element by text content
   */
  getByText(text: string): Locator {
    return this.page.getByText(text);
  }

  /**
   * Verify element text content
   */
  async expectText(selector: string, expectedText: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(expectedText);
  }

  /**
   * Verify element is visible
   */
  async expectVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Verify element is not visible
   */
  async expectNotVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).not.toBeVisible();
  }

  /**
   * Click on element
   */
  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  /**
   * Fill input field
   */
  async fill(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  /**
   * Type text into input field
   */
  async type(selector: string, value: string): Promise<void> {
    await this.page.type(selector, value);
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForUrl(url: string | RegExp): Promise<void> {
    await this.page.waitForURL(url);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Reload the page
   */
  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForLoad();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForLoad();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForLoad();
  }
}
