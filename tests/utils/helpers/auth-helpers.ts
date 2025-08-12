import { Page, expect } from '@playwright/test';
import { TestData } from '../../fixtures/test-data';

/**
 * Authentication helper functions for E2E tests
 */
export class AuthHelpers {
  /**
   * Login with provided credentials
   */
  static async login(page: Page, email: string, password: string): Promise<void> {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('[data-testid="email-input"]', email);
    await page.fill('[data-testid="password-input"]', password);
    
    // Submit form
    await page.click('[data-testid="login-button"]');
    
    // Wait for navigation or success message
    await page.waitForLoadState('networkidle');
  }

  /**
   * Login with valid user credentials
   */
  static async loginWithValidUser(page: Page): Promise<void> {
    const user = TestData.users.validUser;
    await this.login(page, user.email, user.password);
  }

  /**
   * Login with admin user credentials
   */
  static async loginWithAdminUser(page: Page): Promise<void> {
    const user = TestData.users.adminUser;
    await this.login(page, user.email, user.password);
  }

  /**
   * Login with invalid credentials (for testing error scenarios)
   */
  static async loginWithInvalidUser(page: Page): Promise<void> {
    const user = TestData.users.invalidUser;
    await this.login(page, user.email, user.password);
  }

  /**
   * Register a new user
   */
  static async registerUser(page: Page, userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<void> {
    // Navigate to registration page
    await page.goto('/register');
    
    // Fill in registration form
    await page.fill('[data-testid="name-input"]', userData.name);
    await page.fill('[data-testid="email-input"]', userData.email);
    await page.fill('[data-testid="password-input"]', userData.password);
    await page.fill('[data-testid="confirm-password-input"]', userData.password);
    
    // Submit form
    await page.click('[data-testid="register-button"]');
    
    // Wait for registration to complete
    await page.waitForLoadState('networkidle');
  }

  /**
   * Logout current user
   */
  static async logout(page: Page): Promise<void> {
    // Click on user menu/profile
    await page.click('[data-testid="user-menu"]');
    
    // Click logout option
    await page.click('[data-testid="logout-button"]');
    
    // Wait for logout to complete
    await page.waitForLoadState('networkidle');
  }

  /**
   * Verify user is logged in
   */
  static async verifyLoggedIn(page: Page, expectedUser?: {
    name?: string;
    email?: string;
  }): Promise<void> {
    // Check if user menu/profile is visible
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    
    // If expected user data is provided, verify it
    if (expectedUser) {
      if (expectedUser.name) {
        await expect(page.locator('[data-testid="user-name"]')).toHaveText(expectedUser.name);
      }
      if (expectedUser.email) {
        await expect(page.locator('[data-testid="user-email"]')).toHaveText(expectedUser.email);
      }
    }
  }

  /**
   * Verify user is logged out
   */
  static async verifyLoggedOut(page: Page): Promise<void> {
    // Check if login/register links are visible
    await expect(page.locator('[data-testid="login-link"]')).toBeVisible();
    await expect(page.locator('[data-testid="register-link"]')).toBeVisible();
    
    // Check if user menu is not visible
    await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
  }

  /**
   * Verify login error message is displayed
   */
  static async verifyLoginError(page: Page, expectedError?: string): Promise<void> {
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    if (expectedError) {
      await expect(page.locator('[data-testid="error-message"]')).toHaveText(expectedError);
    }
  }

  /**
   * Verify registration error message is displayed
   */
  static async verifyRegistrationError(page: Page, expectedError?: string): Promise<void> {
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    if (expectedError) {
      await expect(page.locator('[data-testid="error-message"]')).toHaveText(expectedError);
    }
  }

  /**
   * Check if user has admin privileges
   */
  static async verifyAdminAccess(page: Page): Promise<void> {
    // Check if admin-specific elements are visible
    await expect(page.locator('[data-testid="admin-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="admin-menu"]')).toBeVisible();
  }

  /**
   * Check if user has regular user privileges
   */
  static async verifyUserAccess(page: Page): Promise<void> {
    // Check if admin elements are not visible
    await expect(page.locator('[data-testid="admin-panel"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="admin-menu"]')).not.toBeVisible();
  }

  /**
   * Get current user token from localStorage
   */
  static async getAuthToken(page: Page): Promise<string | null> {
    return await page.evaluate(() => {
      return localStorage.getItem('authToken');
    });
  }

  /**
   * Set auth token in localStorage (for testing authenticated requests)
   */
  static async setAuthToken(page: Page, token: string): Promise<void> {
    await page.evaluate((token) => {
      localStorage.setItem('authToken', token);
    }, token);
  }

  /**
   * Clear auth token from localStorage
   */
  static async clearAuthToken(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.removeItem('authToken');
    });
  }
}
