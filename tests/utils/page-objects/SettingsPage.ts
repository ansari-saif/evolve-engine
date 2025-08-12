import { Page, expect } from '@playwright/test';
import { BasePageObject } from './BasePageObject';

/**
 * Page Object for the Settings page
 */
export class SettingsPage extends BasePageObject {
  // Main locators
  private readonly settingsForm = '[data-testid="settings-form"]';
  private readonly settingsTabs = '[data-testid="settings-tabs"]';
  private readonly saveButton = '[data-testid="save-settings"]';
  private readonly cancelButton = '[data-testid="cancel-settings"]';
  private readonly resetButton = '[data-testid="reset-settings"]';

  // Profile settings locators
  private readonly profileTab = '[data-testid="tab-profile"]';
  private readonly firstNameInput = '[data-testid="first-name-input"]';
  private readonly lastNameInput = '[data-testid="last-name-input"]';
  private readonly emailInput = '[data-testid="email-input"]';
  private readonly avatarUpload = '[data-testid="avatar-upload"]';
  private readonly bioTextarea = '[data-testid="bio-textarea"]';

  // Account settings locators
  private readonly accountTab = '[data-testid="tab-account"]';
  private readonly currentPasswordInput = '[data-testid="current-password-input"]';
  private readonly newPasswordInput = '[data-testid="new-password-input"]';
  private readonly confirmPasswordInput = '[data-testid="confirm-password-input"]';
  private readonly changePasswordButton = '[data-testid="change-password-button"]';
  private readonly deleteAccountButton = '[data-testid="delete-account-button"]';
  private readonly exportDataButton = '[data-testid="export-data-button"]';

  // Preferences settings locators
  private readonly preferencesTab = '[data-testid="tab-preferences"]';
  private readonly themeSelect = '[data-testid="theme-select"]';
  private readonly languageSelect = '[data-testid="language-select"]';
  private readonly timezoneSelect = '[data-testid="timezone-select"]';
  private readonly notificationsToggle = '[data-testid="notifications-toggle"]';
  private readonly emailNotificationsToggle = '[data-testid="email-notifications-toggle"]';
  private readonly pushNotificationsToggle = '[data-testid="push-notifications-toggle"]';

  // Privacy settings locators
  private readonly privacyTab = '[data-testid="tab-privacy"]';
  private readonly profileVisibilitySelect = '[data-testid="profile-visibility-select"]';
  private readonly dataSharingToggle = '[data-testid="data-sharing-toggle"]';
  private readonly analyticsToggle = '[data-testid="analytics-toggle"]';

  // Notification settings locators
  private readonly notificationsTab = '[data-testid="tab-notifications"]';
  private readonly taskRemindersToggle = '[data-testid="task-reminders-toggle"]';
  private readonly goalUpdatesToggle = '[data-testid="goal-updates-toggle"]';
  private readonly weeklyReportsToggle = '[data-testid="weekly-reports-toggle"]';
  private readonly achievementAlertsToggle = '[data-testid="achievement-alerts-toggle"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the settings page
   */
  async navigateToSettings(): Promise<void> {
    await this.navigateTo('/settings');
    await this.waitForSettingsToLoad();
  }

  /**
   * Wait for settings page to be fully loaded
   */
  async waitForSettingsToLoad(): Promise<void> {
    await this.waitForLoad();
    await this.waitForElement(this.settingsForm);
  }

  /**
   * Verify settings page is loaded correctly
   */
  async verifySettingsLoaded(): Promise<void> {
    await this.expectVisible(this.settingsForm);
    await this.expectVisible(this.settingsTabs);
    await this.expectVisible(this.saveButton);
  }

  /**
   * Click on a specific settings tab
   */
  async clickTab(tabName: 'profile' | 'account' | 'preferences' | 'privacy' | 'notifications'): Promise<void> {
    const tabSelector = this.getTabSelector(tabName);
    await this.click(tabSelector);
    await this.waitForLoad();
  }

  /**
   * Get tab selector by name
   */
  private getTabSelector(tabName: string): string {
    const tabSelectors = {
      'profile': this.profileTab,
      'account': this.accountTab,
      'preferences': this.preferencesTab,
      'privacy': this.privacyTab,
      'notifications': this.notificationsTab
    };
    return tabSelectors[tabName as keyof typeof tabSelectors];
  }

  /**
   * Verify tab is active
   */
  async verifyTabActive(tabName: string): Promise<void> {
    const tabSelector = this.getTabSelector(tabName);
    await this.expectVisible(`${tabSelector}[data-state="active"]`);
  }

  /**
   * Update profile information
   */
  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string;
  }): Promise<void> {
    if (profileData.firstName) {
      await this.fill(this.firstNameInput, profileData.firstName);
    }
    if (profileData.lastName) {
      await this.fill(this.lastNameInput, profileData.lastName);
    }
    if (profileData.email) {
      await this.fill(this.emailInput, profileData.email);
    }
    if (profileData.bio) {
      await this.fill(this.bioTextarea, profileData.bio);
    }
  }

  /**
   * Upload avatar image
   */
  async uploadAvatar(filePath: string): Promise<void> {
    await this.page.setInputFiles(this.avatarUpload, filePath);
  }

  /**
   * Change password
   */
  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.fill(this.currentPasswordInput, passwordData.currentPassword);
    await this.fill(this.newPasswordInput, passwordData.newPassword);
    await this.fill(this.confirmPasswordInput, passwordData.confirmPassword);
    await this.click(this.changePasswordButton);
  }

  /**
   * Export user data
   */
  async exportData(): Promise<void> {
    await this.click(this.exportDataButton);
  }

  /**
   * Delete account
   */
  async deleteAccount(confirmationPassword: string): Promise<void> {
    await this.click(this.deleteAccountButton);
    await this.fill('[data-testid="delete-confirmation-password"]', confirmationPassword);
    await this.click('[data-testid="confirm-delete-account"]');
  }

  /**
   * Update theme preference
   */
  async updateTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
    await this.click(this.themeSelect);
    await this.click(`[data-testid="theme-${theme}"]`);
  }

  /**
   * Update language preference
   */
  async updateLanguage(language: string): Promise<void> {
    await this.click(this.languageSelect);
    await this.click(`[data-testid="language-${language}"]`);
  }

  /**
   * Update timezone preference
   */
  async updateTimezone(timezone: string): Promise<void> {
    await this.click(this.timezoneSelect);
    await this.click(`[data-testid="timezone-${timezone}"]`);
  }

  /**
   * Toggle general notifications
   */
  async toggleNotifications(enabled: boolean): Promise<void> {
    const isEnabled = await this.page.locator(this.notificationsToggle).isChecked();
    if (isEnabled !== enabled) {
      await this.click(this.notificationsToggle);
    }
  }

  /**
   * Toggle email notifications
   */
  async toggleEmailNotifications(enabled: boolean): Promise<void> {
    const isEnabled = await this.page.locator(this.emailNotificationsToggle).isChecked();
    if (isEnabled !== enabled) {
      await this.click(this.emailNotificationsToggle);
    }
  }

  /**
   * Toggle push notifications
   */
  async togglePushNotifications(enabled: boolean): Promise<void> {
    const isEnabled = await this.page.locator(this.pushNotificationsToggle).isChecked();
    if (isEnabled !== enabled) {
      await this.click(this.pushNotificationsToggle);
    }
  }

  /**
   * Update profile visibility
   */
  async updateProfileVisibility(visibility: 'public' | 'private' | 'friends'): Promise<void> {
    await this.click(this.profileVisibilitySelect);
    await this.click(`[data-testid="visibility-${visibility}"]`);
  }

  /**
   * Toggle data sharing
   */
  async toggleDataSharing(enabled: boolean): Promise<void> {
    const isEnabled = await this.page.locator(this.dataSharingToggle).isChecked();
    if (isEnabled !== enabled) {
      await this.click(this.dataSharingToggle);
    }
  }

  /**
   * Toggle analytics
   */
  async toggleAnalytics(enabled: boolean): Promise<void> {
    const isEnabled = await this.page.locator(this.analyticsToggle).isChecked();
    if (isEnabled !== enabled) {
      await this.click(this.analyticsToggle);
    }
  }

  /**
   * Toggle task reminders
   */
  async toggleTaskReminders(enabled: boolean): Promise<void> {
    const isEnabled = await this.page.locator(this.taskRemindersToggle).isChecked();
    if (isEnabled !== enabled) {
      await this.click(this.taskRemindersToggle);
    }
  }

  /**
   * Toggle goal updates
   */
  async toggleGoalUpdates(enabled: boolean): Promise<void> {
    const isEnabled = await this.page.locator(this.goalUpdatesToggle).isChecked();
    if (isEnabled !== enabled) {
      await this.click(this.goalUpdatesToggle);
    }
  }

  /**
   * Toggle weekly reports
   */
  async toggleWeeklyReports(enabled: boolean): Promise<void> {
    const isEnabled = await this.page.locator(this.weeklyReportsToggle).isChecked();
    if (isEnabled !== enabled) {
      await this.click(this.weeklyReportsToggle);
    }
  }

  /**
   * Toggle achievement alerts
   */
  async toggleAchievementAlerts(enabled: boolean): Promise<void> {
    const isEnabled = await this.page.locator(this.achievementAlertsToggle).isChecked();
    if (isEnabled !== enabled) {
      await this.click(this.achievementAlertsToggle);
    }
  }

  /**
   * Save settings
   */
  async saveSettings(): Promise<void> {
    await this.click(this.saveButton);
    await this.expectVisible('[data-testid="settings-saved"]');
  }

  /**
   * Cancel settings changes
   */
  async cancelSettings(): Promise<void> {
    await this.click(this.cancelButton);
  }

  /**
   * Reset settings to defaults
   */
  async resetSettings(): Promise<void> {
    await this.click(this.resetButton);
    await this.click('[data-testid="confirm-reset"]');
  }

  /**
   * Verify settings saved successfully
   */
  async verifySettingsSaved(): Promise<void> {
    await this.expectVisible('[data-testid="settings-saved"]');
  }

  /**
   * Verify profile information is displayed correctly
   */
  async verifyProfileInformation(profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string;
  }): Promise<void> {
    if (profileData.firstName) {
      await this.expectText(this.firstNameInput, profileData.firstName);
    }
    if (profileData.lastName) {
      await this.expectText(this.lastNameInput, profileData.lastName);
    }
    if (profileData.email) {
      await this.expectText(this.emailInput, profileData.email);
    }
    if (profileData.bio) {
      await this.expectText(this.bioTextarea, profileData.bio);
    }
  }

  /**
   * Verify theme is applied
   */
  async verifyThemeApplied(theme: string): Promise<void> {
    await this.expectVisible(`${this.themeSelect}[data-value="${theme}"]`);
  }

  /**
   * Verify notification settings
   */
  async verifyNotificationSettings(settings: {
    general?: boolean;
    email?: boolean;
    push?: boolean;
    taskReminders?: boolean;
    goalUpdates?: boolean;
    weeklyReports?: boolean;
    achievementAlerts?: boolean;
  }): Promise<void> {
    if (settings.general !== undefined) {
      const isChecked = await this.page.locator(this.notificationsToggle).isChecked();
      expect(isChecked).toBe(settings.general);
    }
    if (settings.email !== undefined) {
      const isChecked = await this.page.locator(this.emailNotificationsToggle).isChecked();
      expect(isChecked).toBe(settings.email);
    }
    if (settings.push !== undefined) {
      const isChecked = await this.page.locator(this.pushNotificationsToggle).isChecked();
      expect(isChecked).toBe(settings.push);
    }
    if (settings.taskReminders !== undefined) {
      const isChecked = await this.page.locator(this.taskRemindersToggle).isChecked();
      expect(isChecked).toBe(settings.taskReminders);
    }
    if (settings.goalUpdates !== undefined) {
      const isChecked = await this.page.locator(this.goalUpdatesToggle).isChecked();
      expect(isChecked).toBe(settings.goalUpdates);
    }
    if (settings.weeklyReports !== undefined) {
      const isChecked = await this.page.locator(this.weeklyReportsToggle).isChecked();
      expect(isChecked).toBe(settings.weeklyReports);
    }
    if (settings.achievementAlerts !== undefined) {
      const isChecked = await this.page.locator(this.achievementAlertsToggle).isChecked();
      expect(isChecked).toBe(settings.achievementAlerts);
    }
  }

  /**
   * Take a screenshot of the settings page
   */
  async takeSettingsScreenshot(): Promise<void> {
    await this.takeScreenshot('settings');
  }
}
