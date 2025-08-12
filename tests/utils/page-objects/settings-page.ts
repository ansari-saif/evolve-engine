import { Page } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Settings Page Object
 */
export class SettingsPage extends BasePage {
  // Locators
  private readonly selectors = {
    // Main settings elements
    settingsContainer: '[data-testid="settings-container"]',
    settingsHeader: '[data-testid="settings-header"]',
    settingsTabs: '[data-testid="settings-tabs"]',
    
    // Profile tab elements
    profileTab: '[data-testid="profile-tab"]',
    profileForm: '[data-testid="profile-form"]',
    profileNameInput: '[data-testid="profile-name-input"]',
    profileEmailInput: '[data-testid="profile-email-input"]',
    profilePhoneInput: '[data-testid="profile-phone-input"]',
    profileBioInput: '[data-testid="profile-bio-input"]',
    profileAvatarInput: '[data-testid="profile-avatar-input"]',
    saveProfileButton: '[data-testid="save-profile-button"]',
    cancelProfileButton: '[data-testid="cancel-profile-button"]',
    
    // Account tab elements
    accountTab: '[data-testid="account-tab"]',
    accountForm: '[data-testid="account-form"]',
    currentPasswordInput: '[data-testid="current-password-input"]',
    newPasswordInput: '[data-testid="new-password-input"]',
    confirmNewPasswordInput: '[data-testid="confirm-new-password-input"]',
    changePasswordButton: '[data-testid="change-password-button"]',
    deleteAccountButton: '[data-testid="delete-account-button"]',
    
    // Preferences tab elements
    preferencesTab: '[data-testid="preferences-tab"]',
    preferencesForm: '[data-testid="preferences-form"]',
    themeSelect: '[data-testid="theme-select"]',
    languageSelect: '[data-testid="language-select"]',
    timezoneSelect: '[data-testid="timezone-select"]',
    dateFormatSelect: '[data-testid="date-format-select"]',
    timeFormatSelect: '[data-testid="time-format-select"]',
    savePreferencesButton: '[data-testid="save-preferences-button"]',
    
    // Notification tab elements
    notificationsTab: '[data-testid="notifications-tab"]',
    notificationsForm: '[data-testid="notifications-form"]',
    emailNotificationsCheckbox: '[data-testid="email-notifications-checkbox"]',
    pushNotificationsCheckbox: '[data-testid="push-notifications-checkbox"]',
    smsNotificationsCheckbox: '[data-testid="sms-notifications-checkbox"]',
    taskRemindersCheckbox: '[data-testid="task-reminders-checkbox"]',
    projectUpdatesCheckbox: '[data-testid="project-updates-checkbox"]',
    weeklyReportsCheckbox: '[data-testid="weekly-reports-checkbox"]',
    saveNotificationsButton: '[data-testid="save-notifications-button"]',
    
    // Security tab elements
    securityTab: '[data-testid="security-tab"]',
    securityForm: '[data-testid="security-form"]',
    twoFactorEnabledCheckbox: '[data-testid="two-factor-enabled-checkbox"]',
    twoFactorSetupButton: '[data-testid="two-factor-setup-button"]',
    sessionTimeoutSelect: '[data-testid="session-timeout-select"]',
    loginHistoryButton: '[data-testid="login-history-button"]',
    activeSessionsButton: '[data-testid="active-sessions-button"]',
    saveSecurityButton: '[data-testid="save-security-button"]',
    
    // Team tab elements (for admin users)
    teamTab: '[data-testid="team-tab"]',
    teamMembersList: '[data-testid="team-members-list"]',
    inviteMemberButton: '[data-testid="invite-member-button"]',
    inviteEmailInput: '[data-testid="invite-email-input"]',
    inviteRoleSelect: '[data-testid="invite-role-select"]',
    sendInviteButton: '[data-testid="send-invite-button"]',
    
    // API tab elements
    apiTab: '[data-testid="api-tab"]',
    apiKeyInput: '[data-testid="api-key-input"]',
    generateApiKeyButton: '[data-testid="generate-api-key-button"]',
    regenerateApiKeyButton: '[data-testid="regenerate-api-key-button"]',
    apiKeyVisibilityToggle: '[data-testid="api-key-visibility-toggle"]',
    
    // Billing tab elements
    billingTab: '[data-testid="billing-tab"]',
    currentPlan: '[data-testid="current-plan"]',
    upgradePlanButton: '[data-testid="upgrade-plan-button"]',
    downgradePlanButton: '[data-testid="downgrade-plan-button"]',
    billingHistoryButton: '[data-testid="billing-history-button"]',
    paymentMethodButton: '[data-testid="payment-method-button"]',
    
    // Data tab elements
    dataTab: '[data-testid="data-tab"]',
    exportDataButton: '[data-testid="export-data-button"]',
    importDataButton: '[data-testid="import-data-button"]',
    deleteDataButton: '[data-testid="delete-data-button"]',
    
    // Confirmation dialogs
    confirmDeleteAccountModal: '[data-testid="confirm-delete-account-modal"]',
    confirmDeleteAccountButton: '[data-testid="confirm-delete-account-button"]',
    cancelDeleteAccountButton: '[data-testid="cancel-delete-account-button"]',
    
    confirmDeleteDataModal: '[data-testid="confirm-delete-data-modal"]',
    confirmDeleteDataButton: '[data-testid="confirm-delete-data-button"]',
    cancelDeleteDataButton: '[data-testid="cancel-delete-data-button"]',
    
    // Success and error messages
    successMessage: '[data-testid="success-message"]',
    errorMessage: '[data-testid="error-message"]',
    validationError: '[data-testid="validation-error"]',
    
    // Loading states
    loadingSpinner: '[data-testid="loading-spinner"]',
    saveButton: '[data-testid="save-button"]',
    
    // Form validation elements
    nameValidation: '[data-testid="name-validation"]',
    emailValidation: '[data-testid="email-validation"]',
    passwordValidation: '[data-testid="password-validation"]',
    phoneValidation: '[data-testid="phone-validation"]'
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to settings page
   */
  async navigateToSettings(): Promise<void> {
    await this.navigate('/settings');
  }

  /**
   * Wait for settings page to load
   */
  async waitForSettingsPageLoad(): Promise<void> {
    await this.waitForElement(this.selectors.settingsContainer);
    await this.waitForLoadingComplete();
  }

  /**
   * Click on settings tab
   */
  async clickTab(tabName: 'profile' | 'account' | 'preferences' | 'notifications' | 'security' | 'team' | 'api' | 'billing' | 'data'): Promise<void> {
    const tabSelector = this.selectors[`${tabName}Tab` as keyof typeof this.selectors];
    await this.clickElement(tabSelector);
    await this.waitForElement(`[data-testid="${tabName}-form"]`);
  }

  /**
   * Fill profile form
   */
  async fillProfileForm(profileData: {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
  }): Promise<void> {
    if (profileData.name) {
      await this.fillInput(this.selectors.profileNameInput, profileData.name);
    }
    
    if (profileData.email) {
      await this.fillInput(this.selectors.profileEmailInput, profileData.email);
    }
    
    if (profileData.phone) {
      await this.fillInput(this.selectors.profilePhoneInput, profileData.phone);
    }
    
    if (profileData.bio) {
      await this.fillInput(this.selectors.profileBioInput, profileData.bio);
    }
  }

  /**
   * Save profile changes
   */
  async saveProfile(): Promise<void> {
    await this.clickElement(this.selectors.saveProfileButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Update profile
   */
  async updateProfile(profileData: {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
  }): Promise<void> {
    await this.clickTab('profile');
    await this.fillProfileForm(profileData);
    await this.saveProfile();
  }

  /**
   * Fill password change form
   */
  async fillPasswordChangeForm(currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<void> {
    await this.fillInput(this.selectors.currentPasswordInput, currentPassword);
    await this.fillInput(this.selectors.newPasswordInput, newPassword);
    await this.fillInput(this.selectors.confirmNewPasswordInput, confirmNewPassword);
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<void> {
    await this.clickTab('account');
    await this.fillPasswordChangeForm(currentPassword, newPassword, confirmNewPassword);
    await this.clickElement(this.selectors.changePasswordButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Delete account
   */
  async deleteAccount(): Promise<void> {
    await this.clickTab('account');
    await this.clickElement(this.selectors.deleteAccountButton);
    await this.waitForElement(this.selectors.confirmDeleteAccountModal);
    await this.clickElement(this.selectors.confirmDeleteAccountButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Fill preferences form
   */
  async fillPreferencesForm(preferences: {
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: '12h' | '24h';
  }): Promise<void> {
    if (preferences.theme) {
      await this.selectOption(this.selectors.themeSelect, preferences.theme);
    }
    
    if (preferences.language) {
      await this.selectOption(this.selectors.languageSelect, preferences.language);
    }
    
    if (preferences.timezone) {
      await this.selectOption(this.selectors.timezoneSelect, preferences.timezone);
    }
    
    if (preferences.dateFormat) {
      await this.selectOption(this.selectors.dateFormatSelect, preferences.dateFormat);
    }
    
    if (preferences.timeFormat) {
      await this.selectOption(this.selectors.timeFormatSelect, preferences.timeFormat);
    }
  }

  /**
   * Save preferences
   */
  async savePreferences(): Promise<void> {
    await this.clickElement(this.selectors.savePreferencesButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Update preferences
   */
  async updatePreferences(preferences: {
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: '12h' | '24h';
  }): Promise<void> {
    await this.clickTab('preferences');
    await this.fillPreferencesForm(preferences);
    await this.savePreferences();
  }

  /**
   * Configure notification settings
   */
  async configureNotifications(settings: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    taskReminders?: boolean;
    projectUpdates?: boolean;
    weeklyReports?: boolean;
  }): Promise<void> {
    await this.clickTab('notifications');
    
    if (settings.email !== undefined) {
      if (settings.email) {
        await this.checkCheckbox(this.selectors.emailNotificationsCheckbox);
      } else {
        await this.uncheckCheckbox(this.selectors.emailNotificationsCheckbox);
      }
    }
    
    if (settings.push !== undefined) {
      if (settings.push) {
        await this.checkCheckbox(this.selectors.pushNotificationsCheckbox);
      } else {
        await this.uncheckCheckbox(this.selectors.pushNotificationsCheckbox);
      }
    }
    
    if (settings.sms !== undefined) {
      if (settings.sms) {
        await this.checkCheckbox(this.selectors.smsNotificationsCheckbox);
      } else {
        await this.uncheckCheckbox(this.selectors.smsNotificationsCheckbox);
      }
    }
    
    if (settings.taskReminders !== undefined) {
      if (settings.taskReminders) {
        await this.checkCheckbox(this.selectors.taskRemindersCheckbox);
      } else {
        await this.uncheckCheckbox(this.selectors.taskRemindersCheckbox);
      }
    }
    
    if (settings.projectUpdates !== undefined) {
      if (settings.projectUpdates) {
        await this.checkCheckbox(this.selectors.projectUpdatesCheckbox);
      } else {
        await this.uncheckCheckbox(this.selectors.projectUpdatesCheckbox);
      }
    }
    
    if (settings.weeklyReports !== undefined) {
      if (settings.weeklyReports) {
        await this.checkCheckbox(this.selectors.weeklyReportsCheckbox);
      } else {
        await this.uncheckCheckbox(this.selectors.weeklyReportsCheckbox);
      }
    }
    
    await this.clickElement(this.selectors.saveNotificationsButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Configure security settings
   */
  async configureSecurity(settings: {
    twoFactorEnabled?: boolean;
    sessionTimeout?: string;
  }): Promise<void> {
    await this.clickTab('security');
    
    if (settings.twoFactorEnabled !== undefined) {
      if (settings.twoFactorEnabled) {
        await this.checkCheckbox(this.selectors.twoFactorEnabledCheckbox);
      } else {
        await this.uncheckCheckbox(this.selectors.twoFactorEnabledCheckbox);
      }
    }
    
    if (settings.sessionTimeout) {
      await this.selectOption(this.selectors.sessionTimeoutSelect, settings.sessionTimeout);
    }
    
    await this.clickElement(this.selectors.saveSecurityButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Invite team member
   */
  async inviteTeamMember(email: string, role: string): Promise<void> {
    await this.clickTab('team');
    await this.clickElement(this.selectors.inviteMemberButton);
    await this.fillInput(this.selectors.inviteEmailInput, email);
    await this.selectOption(this.selectors.inviteRoleSelect, role);
    await this.clickElement(this.selectors.sendInviteButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Generate API key
   */
  async generateApiKey(): Promise<void> {
    await this.clickTab('api');
    await this.clickElement(this.selectors.generateApiKeyButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Get API key
   */
  async getApiKey(): Promise<string> {
    await this.clickTab('api');
    return await this.getElementText(this.selectors.apiKeyInput);
  }

  /**
   * Toggle API key visibility
   */
  async toggleApiKeyVisibility(): Promise<void> {
    await this.clickElement(this.selectors.apiKeyVisibilityToggle);
  }

  /**
   * Export data
   */
  async exportData(): Promise<void> {
    await this.clickTab('data');
    await this.clickElement(this.selectors.exportDataButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Delete data
   */
  async deleteData(): Promise<void> {
    await this.clickTab('data');
    await this.clickElement(this.selectors.deleteDataButton);
    await this.waitForElement(this.selectors.confirmDeleteDataModal);
    await this.clickElement(this.selectors.confirmDeleteDataButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Get current plan
   */
  async getCurrentPlan(): Promise<string> {
    await this.clickTab('billing');
    return await this.getElementText(this.selectors.currentPlan);
  }

  /**
   * Upgrade plan
   */
  async upgradePlan(): Promise<void> {
    await this.clickTab('billing');
    await this.clickElement(this.selectors.upgradePlanButton);
    await this.waitForNavigation();
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getElementText(this.selectors.successMessage);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.selectors.errorMessage);
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
   * Verify settings page is loaded
   */
  async verifySettingsPageLoaded(): Promise<void> {
    await this.expectElementVisible(this.selectors.settingsContainer);
    await this.expectElementVisible(this.selectors.settingsHeader);
    await this.expectElementVisible(this.selectors.settingsTabs);
  }

  /**
   * Verify profile tab is displayed
   */
  async verifyProfileTabDisplayed(): Promise<void> {
    await this.expectElementVisible(this.selectors.profileForm);
    await this.expectElementVisible(this.selectors.profileNameInput);
    await this.expectElementVisible(this.selectors.profileEmailInput);
  }

  /**
   * Verify account tab is displayed
   */
  async verifyAccountTabDisplayed(): Promise<void> {
    await this.expectElementVisible(this.selectors.accountForm);
    await this.expectElementVisible(this.selectors.currentPasswordInput);
    await this.expectElementVisible(this.selectors.newPasswordInput);
  }

  /**
   * Verify preferences tab is displayed
   */
  async verifyPreferencesTabDisplayed(): Promise<void> {
    await this.expectElementVisible(this.selectors.preferencesForm);
    await this.expectElementVisible(this.selectors.themeSelect);
    await this.expectElementVisible(this.selectors.languageSelect);
  }

  /**
   * Check if success message is displayed
   */
  async isSuccessMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.successMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.errorMessage);
  }

  /**
   * Take settings page screenshot
   */
  async takeSettingsScreenshot(): Promise<void> {
    await this.takeScreenshot('settings-page');
  }

  /**
   * Wait for settings to load
   */
  async waitForSettingsToLoad(): Promise<void> {
    await this.waitForSettingsPageLoad();
    await this.waitForElement(this.selectors.settingsTabs);
  }
}
