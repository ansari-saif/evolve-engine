import { Page, expect, Locator } from '@playwright/test';
import { WaitHelpers } from '../helpers/wait-helpers';

/**
 * Base Page Object class with common functionality
 */
export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page, baseUrl: string = 'http://localhost:3000') {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  /**
   * Navigate to the page
   */
  async navigate(path: string = ''): Promise<void> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    await this.page.goto(url);
    await this.waitForLoad();
  }

  /**
   * Wait for page to load
   */
  async waitForLoad(): Promise<void> {
    await WaitHelpers.waitForPageLoad(this.page);
  }

  /**
   * Wait for specific element to be visible
   */
  async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
    await WaitHelpers.waitForElement(this.page, selector, timeout);
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementHidden(selector: string, timeout: number = 5000): Promise<void> {
    await WaitHelpers.waitForElementHidden(this.page, selector, timeout);
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await WaitHelpers.takeScreenshot(this.page, name);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element exists in DOM
   */
  async isElementPresent(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'attached', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element text content
   */
  async getElementText(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return await element.textContent() || '';
  }

  /**
   * Get element attribute value
   */
  async getElementAttribute(selector: string, attribute: string): Promise<string | null> {
    const element = this.page.locator(selector);
    return await element.getAttribute(attribute);
  }

  /**
   * Click element
   */
  async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  /**
   * Fill input field
   */
  async fillInput(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  /**
   * Clear input field
   */
  async clearInput(selector: string): Promise<void> {
    await this.page.fill(selector, '');
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  /**
   * Check checkbox
   */
  async checkCheckbox(selector: string): Promise<void> {
    await this.page.check(selector);
  }

  /**
   * Uncheck checkbox
   */
  async uncheckCheckbox(selector: string): Promise<void> {
    await this.page.uncheck(selector);
  }

  /**
   * Hover over element
   */
  async hoverElement(selector: string): Promise<void> {
    await this.page.hover(selector);
  }

  /**
   * Press key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Type text
   */
  async typeText(text: string): Promise<void> {
    await this.page.keyboard.type(text);
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForUrl(url: string | RegExp, timeout: number = 5000): Promise<void> {
    await WaitHelpers.waitForURL(this.page, url, timeout);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await WaitHelpers.waitForNavigation(this.page);
  }

  /**
   * Wait for network request
   */
  async waitForRequest(urlPattern: string | RegExp, timeout: number = 5000): Promise<void> {
    await WaitHelpers.waitForRequest(this.page, urlPattern, timeout);
  }

  /**
   * Wait for network response
   */
  async waitForResponse(urlPattern: string | RegExp, timeout: number = 5000): Promise<void> {
    await WaitHelpers.waitForResponse(this.page, urlPattern, timeout);
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete(spinnerSelector: string = '[data-testid="loading-spinner"]'): Promise<void> {
    await WaitHelpers.waitForLoadingComplete(this.page, spinnerSelector);
  }

  /**
   * Wait for toast notification
   */
  async waitForToast(toastSelector: string = '[data-testid="toast"]'): Promise<void> {
    await WaitHelpers.waitForToast(this.page, toastSelector);
  }

  /**
   * Verify element is visible
   */
  async expectElementVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Verify element is not visible
   */
  async expectElementNotVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).not.toBeVisible();
  }

  /**
   * Verify element has text
   */
  async expectElementText(selector: string, text: string | RegExp): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  /**
   * Verify element contains text
   */
  async expectElementContainsText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  /**
   * Verify element has value
   */
  async expectElementValue(selector: string, value: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveValue(value);
  }

  /**
   * Verify element is enabled
   */
  async expectElementEnabled(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeEnabled();
  }

  /**
   * Verify element is disabled
   */
  async expectElementDisabled(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeDisabled();
  }

  /**
   * Verify element is checked
   */
  async expectElementChecked(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeChecked();
  }

  /**
   * Verify element is not checked
   */
  async expectElementNotChecked(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).not.toBeChecked();
  }

  /**
   * Verify element count
   */
  async expectElementCount(selector: string, count: number): Promise<void> {
    await expect(this.page.locator(selector)).toHaveCount(count);
  }

  /**
   * Verify element has attribute
   */
  async expectElementAttribute(selector: string, attribute: string, value: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveAttribute(attribute, value);
  }

  /**
   * Verify element has class
   */
  async expectElementClass(selector: string, className: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveClass(new RegExp(className));
  }

  /**
   * Verify page title
   */
  async expectTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  /**
   * Verify current URL
   */
  async expectUrl(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  /**
   * Get locator for element
   */
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Get all locators for elements
   */
  getAllLocators(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Execute JavaScript in page context
   */
  async executeScript(script: string, ...args: any[]): Promise<any> {
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Get localStorage value
   */
  async getLocalStorage(key: string): Promise<string | null> {
    return await this.page.evaluate((key) => {
      return localStorage.getItem(key);
    }, key);
  }

  /**
   * Set localStorage value
   */
  async setLocalStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate((key, value) => {
      localStorage.setItem(key, value);
    }, key, value);
  }

  /**
   * Remove localStorage value
   */
  async removeLocalStorage(key: string): Promise<void> {
    await this.page.evaluate((key) => {
      localStorage.removeItem(key);
    }, key);
  }

  /**
   * Get sessionStorage value
   */
  async getSessionStorage(key: string): Promise<string | null> {
    return await this.page.evaluate((key) => {
      return sessionStorage.getItem(key);
    }, key);
  }

  /**
   * Set sessionStorage value
   */
  async setSessionStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate((key, value) => {
      sessionStorage.setItem(key, value);
    }, key, value);
  }

  /**
   * Remove sessionStorage value
   */
  async removeSessionStorage(key: string): Promise<void> {
    await this.page.evaluate((key) => {
      sessionStorage.removeItem(key);
    }, key);
  }
}
