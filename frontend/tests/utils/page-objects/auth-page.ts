import { Page } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Authentication Page Object
 */
export class AuthPage extends BasePage {
  // Locators
  private readonly selectors = {
    // Login form elements
    loginForm: '[data-testid="login-form"]',
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    loginButton: '[data-testid="login-button"]',
    rememberMeCheckbox: '[data-testid="remember-me-checkbox"]',
    forgotPasswordLink: '[data-testid="forgot-password-link"]',
    
    // Registration form elements
    registerForm: '[data-testid="register-form"]',
    nameInput: '[data-testid="name-input"]',
    confirmPasswordInput: '[data-testid="confirm-password-input"]',
    registerButton: '[data-testid="register-button"]',
    termsCheckbox: '[data-testid="terms-checkbox"]',
    privacyCheckbox: '[data-testid="privacy-checkbox"]',
    
    // Password reset elements
    resetPasswordForm: '[data-testid="reset-password-form"]',
    resetEmailInput: '[data-testid="reset-email-input"]',
    resetPasswordButton: '[data-testid="reset-password-button"]',
    newPasswordInput: '[data-testid="new-password-input"]',
    confirmNewPasswordInput: '[data-testid="confirm-new-password-input"]',
    updatePasswordButton: '[data-testid="update-password-button"]',
    
    // Navigation elements
    loginLink: '[data-testid="login-link"]',
    registerLink: '[data-testid="register-link"]',
    backToLoginLink: '[data-testid="back-to-login-link"]',
    
    // Error and success messages
    errorMessage: '[data-testid="error-message"]',
    successMessage: '[data-testid="success-message"]',
    validationError: '[data-testid="validation-error"]',
    
    // Loading states
    loadingSpinner: '[data-testid="loading-spinner"]',
    submitButton: '[data-testid="submit-button"]',
    
    // Social login elements
    googleLoginButton: '[data-testid="google-login-button"]',
    githubLoginButton: '[data-testid="github-login-button"]',
    facebookLoginButton: '[data-testid="facebook-login-button"]',
    
    // Form validation elements
    emailValidation: '[data-testid="email-validation"]',
    passwordValidation: '[data-testid="password-validation"]',
    nameValidation: '[data-testid="name-validation"]',
    
    // Password strength indicator
    passwordStrengthIndicator: '[data-testid="password-strength-indicator"]',
    passwordStrengthText: '[data-testid="password-strength-text"]',
    
    // Captcha elements
    captchaContainer: '[data-testid="captcha-container"]',
    captchaCheckbox: '[data-testid="captcha-checkbox"]',
    
    // Two-factor authentication
    twoFactorForm: '[data-testid="two-factor-form"]',
    twoFactorInput: '[data-testid="two-factor-input"]',
    twoFactorSubmitButton: '[data-testid="two-factor-submit-button"]',
    resendCodeButton: '[data-testid="resend-code-button"]'
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.navigate('/login');
  }

  /**
   * Navigate to registration page
   */
  async navigateToRegister(): Promise<void> {
    await this.navigate('/register');
  }

  /**
   * Navigate to password reset page
   */
  async navigateToPasswordReset(): Promise<void> {
    await this.navigate('/reset-password');
  }

  /**
   * Wait for login form to load
   */
  async waitForLoginForm(): Promise<void> {
    await this.waitForElement(this.selectors.loginForm);
  }

  /**
   * Wait for registration form to load
   */
  async waitForRegisterForm(): Promise<void> {
    await this.waitForElement(this.selectors.registerForm);
  }

  /**
   * Fill login form
   */
  async fillLoginForm(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.fillInput(this.selectors.emailInput, email);
    await this.fillInput(this.selectors.passwordInput, password);
    
    if (rememberMe) {
      await this.checkCheckbox(this.selectors.rememberMeCheckbox);
    }
  }

  /**
   * Fill registration form
   */
  async fillRegisterForm(
    name: string, 
    email: string, 
    password: string, 
    confirmPassword: string,
    acceptTerms: boolean = true,
    acceptPrivacy: boolean = true
  ): Promise<void> {
    await this.fillInput(this.selectors.nameInput, name);
    await this.fillInput(this.selectors.emailInput, email);
    await this.fillInput(this.selectors.passwordInput, password);
    await this.fillInput(this.selectors.confirmPasswordInput, confirmPassword);
    
    if (acceptTerms) {
      await this.checkCheckbox(this.selectors.termsCheckbox);
    }
    
    if (acceptPrivacy) {
      await this.checkCheckbox(this.selectors.privacyCheckbox);
    }
  }

  /**
   * Submit login form
   */
  async submitLoginForm(): Promise<void> {
    await this.clickElement(this.selectors.loginButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Submit registration form
   */
  async submitRegisterForm(): Promise<void> {
    await this.clickElement(this.selectors.registerButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Complete login process
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.navigateToLogin();
    await this.waitForLoginForm();
    await this.fillLoginForm(email, password, rememberMe);
    await this.submitLoginForm();
  }

  /**
   * Complete registration process
   */
  async register(
    name: string, 
    email: string, 
    password: string, 
    confirmPassword: string,
    acceptTerms: boolean = true,
    acceptPrivacy: boolean = true
  ): Promise<void> {
    await this.navigateToRegister();
    await this.waitForRegisterForm();
    await this.fillRegisterForm(name, email, password, confirmPassword, acceptTerms, acceptPrivacy);
    await this.submitRegisterForm();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.selectors.forgotPasswordLink);
    await this.waitForNavigation();
  }

  /**
   * Fill password reset form
   */
  async fillPasswordResetForm(email: string): Promise<void> {
    await this.fillInput(this.selectors.resetEmailInput, email);
  }

  /**
   * Submit password reset form
   */
  async submitPasswordResetForm(): Promise<void> {
    await this.clickElement(this.selectors.resetPasswordButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Complete password reset process
   */
  async resetPassword(email: string): Promise<void> {
    await this.navigateToPasswordReset();
    await this.fillPasswordResetForm(email);
    await this.submitPasswordResetForm();
  }

  /**
   * Fill new password form
   */
  async fillNewPasswordForm(newPassword: string, confirmNewPassword: string): Promise<void> {
    await this.fillInput(this.selectors.newPasswordInput, newPassword);
    await this.fillInput(this.selectors.confirmNewPasswordInput, confirmNewPassword);
  }

  /**
   * Submit new password form
   */
  async submitNewPasswordForm(): Promise<void> {
    await this.clickElement(this.selectors.updatePasswordButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Complete new password setup
   */
  async setNewPassword(newPassword: string, confirmNewPassword: string): Promise<void> {
    await this.fillNewPasswordForm(newPassword, confirmNewPassword);
    await this.submitNewPasswordForm();
  }

  /**
   * Click register link from login page
   */
  async clickRegisterLink(): Promise<void> {
    await this.clickElement(this.selectors.registerLink);
    await this.waitForNavigation();
  }

  /**
   * Click login link from registration page
   */
  async clickLoginLink(): Promise<void> {
    await this.clickElement(this.selectors.loginLink);
    await this.waitForNavigation();
  }

  /**
   * Click back to login link
   */
  async clickBackToLogin(): Promise<void> {
    await this.clickElement(this.selectors.backToLoginLink);
    await this.waitForNavigation();
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.selectors.errorMessage);
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getElementText(this.selectors.successMessage);
  }

  /**
   * Get validation errors
   */
  async getValidationErrors(): Promise<string[]> {
    const errors = [];
    const errorElements = this.page.locator(this.selectors.validationError);
    const count = await errorElements.count();
    
    for (let i = 0; i < count; i++) {
      const error = await errorElements.nth(i).textContent();
      if (error) {
        errors.push(error);
      }
    }
    
    return errors;
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.errorMessage);
  }

  /**
   * Check if success message is displayed
   */
  async isSuccessMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.successMessage);
  }

  /**
   * Verify login form is displayed
   */
  async verifyLoginFormDisplayed(): Promise<void> {
    await this.expectElementVisible(this.selectors.loginForm);
    await this.expectElementVisible(this.selectors.emailInput);
    await this.expectElementVisible(this.selectors.passwordInput);
    await this.expectElementVisible(this.selectors.loginButton);
  }

  /**
   * Verify registration form is displayed
   */
  async verifyRegisterFormDisplayed(): Promise<void> {
    await this.expectElementVisible(this.selectors.registerForm);
    await this.expectElementVisible(this.selectors.nameInput);
    await this.expectElementVisible(this.selectors.emailInput);
    await this.expectElementVisible(this.selectors.passwordInput);
    await this.expectElementVisible(this.selectors.confirmPasswordInput);
    await this.expectElementVisible(this.selectors.registerButton);
  }

  /**
   * Verify password reset form is displayed
   */
  async verifyPasswordResetFormDisplayed(): Promise<void> {
    await this.expectElementVisible(this.selectors.resetPasswordForm);
    await this.expectElementVisible(this.selectors.resetEmailInput);
    await this.expectElementVisible(this.selectors.resetPasswordButton);
  }

  /**
   * Verify form validation errors
   */
  async verifyFormValidationErrors(expectedErrors: string[]): Promise<void> {
    const actualErrors = await this.getValidationErrors();
    expect(actualErrors).toEqual(expect.arrayContaining(expectedErrors));
  }

  /**
   * Verify password strength indicator
   */
  async verifyPasswordStrength(strength: 'weak' | 'medium' | 'strong'): Promise<void> {
    await this.expectElementVisible(this.selectors.passwordStrengthIndicator);
    await this.expectElementContainsText(this.selectors.passwordStrengthText, strength);
  }

  /**
   * Click social login button
   */
  async clickSocialLogin(provider: 'google' | 'github' | 'facebook'): Promise<void> {
    const buttonSelector = this.selectors[`${provider}LoginButton` as keyof typeof this.selectors];
    await this.clickElement(buttonSelector);
    await this.waitForNavigation();
  }

  /**
   * Fill two-factor authentication code
   */
  async fillTwoFactorCode(code: string): Promise<void> {
    await this.fillInput(this.selectors.twoFactorInput, code);
  }

  /**
   * Submit two-factor authentication
   */
  async submitTwoFactorCode(): Promise<void> {
    await this.clickElement(this.selectors.twoFactorSubmitButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Complete two-factor authentication
   */
  async completeTwoFactorAuthentication(code: string): Promise<void> {
    await this.fillTwoFactorCode(code);
    await this.submitTwoFactorCode();
  }

  /**
   * Resend two-factor authentication code
   */
  async resendTwoFactorCode(): Promise<void> {
    await this.clickElement(this.selectors.resendCodeButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Check if two-factor authentication is required
   */
  async isTwoFactorRequired(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.twoFactorForm);
  }

  /**
   * Check if captcha is required
   */
  async isCaptchaRequired(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.captchaContainer);
  }

  /**
   * Complete captcha verification
   */
  async completeCaptcha(): Promise<void> {
    await this.checkCheckbox(this.selectors.captchaCheckbox);
  }

  /**
   * Clear all form inputs
   */
  async clearAllInputs(): Promise<void> {
    await this.clearInput(this.selectors.emailInput);
    await this.clearInput(this.selectors.passwordInput);
    await this.clearInput(this.selectors.nameInput);
    await this.clearInput(this.selectors.confirmPasswordInput);
  }

  /**
   * Take authentication page screenshot
   */
  async takeAuthScreenshot(): Promise<void> {
    await this.takeScreenshot('auth-page');
  }

  /**
   * Wait for authentication to complete
   */
  async waitForAuthenticationComplete(): Promise<void> {
    // Wait for redirect to dashboard or home page
    await this.waitForUrl(/\/dashboard|\/home|\/$/);
  }
}
