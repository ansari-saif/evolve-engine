import { Page, expect } from '@playwright/test';
import { BasePageObject } from './BasePageObject';

/**
 * Page Object for Authentication pages (Login, Register, Password Reset)
 */
export class AuthPage extends BasePageObject {
  // Common locators
  private readonly authForm = '[data-testid="auth-form"]';
  private readonly emailInput = '[data-testid="email-input"]';
  private readonly passwordInput = '[data-testid="password-input"]';
  private readonly submitButton = '[data-testid="submit-button"]';
  private readonly errorMessage = '[data-testid="error-message"]';
  private readonly successMessage = '[data-testid="success-message"]';

  // Login specific locators
  private readonly loginForm = '[data-testid="login-form"]';
  private readonly rememberMeCheckbox = '[data-testid="remember-me"]';
  private readonly forgotPasswordLink = '[data-testid="forgot-password-link"]';
  private readonly loginWithGoogleButton = '[data-testid="login-google"]';
  private readonly loginWithGithubButton = '[data-testid="login-github"]';

  // Register specific locators
  private readonly registerForm = '[data-testid="register-form"]';
  private readonly confirmPasswordInput = '[data-testid="confirm-password-input"]';
  private readonly firstNameInput = '[data-testid="first-name-input"]';
  private readonly lastNameInput = '[data-testid="last-name-input"]';
  private readonly termsCheckbox = '[data-testid="terms-checkbox"]';
  private readonly registerWithGoogleButton = '[data-testid="register-google"]';
  private readonly registerWithGithubButton = '[data-testid="register-github"]';

  // Password reset specific locators
  private readonly resetPasswordForm = '[data-testid="reset-password-form"]';
  private readonly newPasswordInput = '[data-testid="new-password-input"]';
  private readonly confirmNewPasswordInput = '[data-testid="confirm-new-password-input"]';
  private readonly resetTokenInput = '[data-testid="reset-token-input"]';

  // Navigation locators
  private readonly loginLink = '[data-testid="login-link"]';
  private readonly registerLink = '[data-testid="register-link"]';
  private readonly backToLoginLink = '[data-testid="back-to-login"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForLoginToLoad();
  }

  /**
   * Navigate to register page
   */
  async navigateToRegister(): Promise<void> {
    await this.navigateTo('/register');
    await this.waitForRegisterToLoad();
  }

  /**
   * Navigate to forgot password page
   */
  async navigateToForgotPassword(): Promise<void> {
    await this.navigateTo('/forgot-password');
    await this.waitForForgotPasswordToLoad();
  }

  /**
   * Navigate to reset password page
   */
  async navigateToResetPassword(token: string): Promise<void> {
    await this.navigateTo(`/reset-password?token=${token}`);
    await this.waitForResetPasswordToLoad();
  }

  /**
   * Wait for login page to load
   */
  async waitForLoginToLoad(): Promise<void> {
    await this.waitForLoad();
    await this.waitForElement(this.loginForm);
  }

  /**
   * Wait for register page to load
   */
  async waitForRegisterToLoad(): Promise<void> {
    await this.waitForLoad();
    await this.waitForElement(this.registerForm);
  }

  /**
   * Wait for forgot password page to load
   */
  async waitForForgotPasswordToLoad(): Promise<void> {
    await this.waitForLoad();
    await this.waitForElement(this.resetPasswordForm);
  }

  /**
   * Wait for reset password page to load
   */
  async waitForResetPasswordToLoad(): Promise<void> {
    await this.waitForLoad();
    await this.waitForElement(this.resetPasswordForm);
  }

  /**
   * Verify login page is loaded correctly
   */
  async verifyLoginLoaded(): Promise<void> {
    await this.expectVisible(this.loginForm);
    await this.expectVisible(this.emailInput);
    await this.expectVisible(this.passwordInput);
    await this.expectVisible(this.submitButton);
  }

  /**
   * Verify register page is loaded correctly
   */
  async verifyRegisterLoaded(): Promise<void> {
    await this.expectVisible(this.registerForm);
    await this.expectVisible(this.emailInput);
    await this.expectVisible(this.passwordInput);
    await this.expectVisible(this.confirmPasswordInput);
    await this.expectVisible(this.submitButton);
  }

  /**
   * Fill login form
   */
  async fillLoginForm(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<void> {
    await this.fill(this.emailInput, credentials.email);
    await this.fill(this.passwordInput, credentials.password);
    
    if (credentials.rememberMe) {
      await this.click(this.rememberMeCheckbox);
    }
  }

  /**
   * Fill register form
   */
  async fillRegisterForm(userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
    acceptTerms?: boolean;
  }): Promise<void> {
    await this.fill(this.emailInput, userData.email);
    await this.fill(this.passwordInput, userData.password);
    await this.fill(this.confirmPasswordInput, userData.confirmPassword);
    
    if (userData.firstName) {
      await this.fill(this.firstNameInput, userData.firstName);
    }
    
    if (userData.lastName) {
      await this.fill(this.lastNameInput, userData.lastName);
    }
    
    if (userData.acceptTerms) {
      await this.click(this.termsCheckbox);
    }
  }

  /**
   * Fill forgot password form
   */
  async fillForgotPasswordForm(email: string): Promise<void> {
    await this.fill(this.emailInput, email);
  }

  /**
   * Fill reset password form
   */
  async fillResetPasswordForm(data: {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<void> {
    await this.fill(this.resetTokenInput, data.token);
    await this.fill(this.newPasswordInput, data.newPassword);
    await this.fill(this.confirmNewPasswordInput, data.confirmNewPassword);
  }

  /**
   * Submit login form
   */
  async submitLoginForm(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Submit register form
   */
  async submitRegisterForm(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Submit forgot password form
   */
  async submitForgotPasswordForm(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Submit reset password form
   */
  async submitResetPasswordForm(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Perform login
   */
  async login(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<void> {
    await this.fillLoginForm(credentials);
    await this.submitLoginForm();
  }

  /**
   * Perform registration
   */
  async register(userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
    acceptTerms?: boolean;
  }): Promise<void> {
    await this.fillRegisterForm(userData);
    await this.submitRegisterForm();
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    await this.fillForgotPasswordForm(email);
    await this.submitForgotPasswordForm();
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<void> {
    await this.fillResetPasswordForm(data);
    await this.submitResetPasswordForm();
  }

  /**
   * Login with Google
   */
  async loginWithGoogle(): Promise<void> {
    await this.click(this.loginWithGoogleButton);
    // Note: OAuth flow would need to be handled separately
  }

  /**
   * Login with GitHub
   */
  async loginWithGithub(): Promise<void> {
    await this.click(this.loginWithGithubButton);
    // Note: OAuth flow would need to be handled separately
  }

  /**
   * Register with Google
   */
  async registerWithGoogle(): Promise<void> {
    await this.click(this.registerWithGoogleButton);
    // Note: OAuth flow would need to be handled separately
  }

  /**
   * Register with GitHub
   */
  async registerWithGithub(): Promise<void> {
    await this.click(this.registerWithGithubButton);
    // Note: OAuth flow would need to be handled separately
  }

  /**
   * Navigate to forgot password from login
   */
  async goToForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
    await this.waitForForgotPasswordToLoad();
  }

  /**
   * Navigate to register from login
   */
  async goToRegister(): Promise<void> {
    await this.click(this.registerLink);
    await this.waitForRegisterToLoad();
  }

  /**
   * Navigate to login from register
   */
  async goToLogin(): Promise<void> {
    await this.click(this.loginLink);
    await this.waitForLoginToLoad();
  }

  /**
   * Navigate back to login from forgot password
   */
  async backToLogin(): Promise<void> {
    await this.click(this.backToLoginLink);
    await this.waitForLoginToLoad();
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage(expectedMessage?: string): Promise<void> {
    await this.expectVisible(this.errorMessage);
    if (expectedMessage) {
      await this.expectText(this.errorMessage, expectedMessage);
    }
  }

  /**
   * Verify success message is displayed
   */
  async verifySuccessMessage(expectedMessage?: string): Promise<void> {
    await this.expectVisible(this.successMessage);
    if (expectedMessage) {
      await this.expectText(this.successMessage, expectedMessage);
    }
  }

  /**
   * Verify user is redirected to dashboard after login
   */
  async verifyLoginSuccess(): Promise<void> {
    await this.waitForUrl(/.*\/$/);
    await this.expectVisible('h1:has-text("Your Journey")');
  }

  /**
   * Verify user is redirected to login after logout
   */
  async verifyLogoutSuccess(): Promise<void> {
    await this.waitForUrl(/.*\/login/);
    await this.expectVisible(this.loginForm);
  }

  /**
   * Verify password reset email sent message
   */
  async verifyPasswordResetEmailSent(): Promise<void> {
    await this.expectVisible('[data-testid="reset-email-sent"]');
  }

  /**
   * Verify password reset success
   */
  async verifyPasswordResetSuccess(): Promise<void> {
    await this.expectVisible('[data-testid="password-reset-success"]');
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.expectVisible('[data-testid="user-menu"]');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.click('[data-testid="user-menu"]');
    await this.click('[data-testid="logout-button"]');
  }

  /**
   * Take a screenshot of the auth page
   */
  async takeAuthScreenshot(name: string): Promise<void> {
    await this.takeScreenshot(`auth-${name}`);
  }
}
