import { Page, expect } from '@playwright/test';
import { BasePageObject } from './BasePageObject';

/**
 * Page Object for the Dashboard page
 */
export class DashboardPage extends BasePageObject {
  // Locators
  private readonly heroTitle = 'h1:has-text("Your Journey")';
  private readonly heroSubtitle = 'p:has-text("Transform dreams into reality")';
  private readonly weeklyRoadmap = '[data-testid="weekly-roadmap"]';
  private readonly statsCards = '[data-testid="stats-cards"]';
  private readonly todaysTasks = '[data-testid="todays-tasks"]';
  private readonly motivationCard = '[data-testid="motivation-card"]';
  private readonly navigationMenu = '[data-testid="navigation-menu"]';
  private readonly bottomTabBar = '[data-testid="bottom-tab-bar"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the dashboard page
   */
  async navigateToDashboard(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForDashboardToLoad();
  }

  /**
   * Wait for dashboard to be fully loaded
   */
  async waitForDashboardToLoad(): Promise<void> {
    await this.waitForLoad();
    await this.waitForElement(this.heroTitle);
  }

  /**
   * Verify dashboard page is loaded correctly
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.expectVisible(this.heroTitle);
    await this.expectVisible(this.heroSubtitle);
    await this.expectText(this.heroTitle, 'Your Journey');
    await this.expectText(this.heroSubtitle, 'Transform dreams into reality, one step at a time.');
  }

  /**
   * Verify all dashboard sections are present
   */
  async verifyDashboardSections(): Promise<void> {
    // Verify main sections exist
    await this.expectVisible(this.weeklyRoadmap);
    await this.expectVisible(this.statsCards);
    await this.expectVisible(this.todaysTasks);
    await this.expectVisible(this.motivationCard);
  }

  /**
   * Get the weekly roadmap element
   */
  getWeeklyRoadmap() {
    return this.page.locator(this.weeklyRoadmap);
  }

  /**
   * Get the stats cards element
   */
  getStatsCards() {
    return this.page.locator(this.statsCards);
  }

  /**
   * Get today's tasks element
   */
  getTodaysTasks() {
    return this.page.locator(this.todaysTasks);
  }

  /**
   * Get motivation card element
   */
  getMotivationCard() {
    return this.page.locator(this.motivationCard);
  }

  /**
   * Navigate to tasks page from dashboard
   */
  async navigateToTasks(): Promise<void> {
    await this.click('[data-testid="nav-tasks"]');
    await this.waitForUrl(/.*\/tasks/);
  }

  /**
   * Navigate to goals page from dashboard
   */
  async navigateToGoals(): Promise<void> {
    await this.click('[data-testid="nav-goals"]');
    await this.waitForUrl(/.*\/goals/);
  }

  /**
   * Navigate to diary page from dashboard
   */
  async navigateToDiary(): Promise<void> {
    await this.click('[data-testid="nav-diary"]');
    await this.waitForUrl(/.*\/diary/);
  }

  /**
   * Navigate to statistics page from dashboard
   */
  async navigateToStatistics(): Promise<void> {
    await this.click('[data-testid="nav-statistics"]');
    await this.waitForUrl(/.*\/statistics/);
  }

  /**
   * Navigate to settings page from dashboard
   */
  async navigateToSettings(): Promise<void> {
    await this.click('[data-testid="nav-settings"]');
    await this.waitForUrl(/.*\/settings/);
  }

  /**
   * Navigate to chat page from dashboard
   */
  async navigateToChat(): Promise<void> {
    await this.click('[data-testid="nav-chat"]');
    await this.waitForUrl(/.*\/chat/);
  }

  /**
   * Verify navigation menu is present
   */
  async verifyNavigationMenu(): Promise<void> {
    await this.expectVisible(this.navigationMenu);
  }

  /**
   * Verify bottom tab bar is present
   */
  async verifyBottomTabBar(): Promise<void> {
    await this.expectVisible(this.bottomTabBar);
  }

  /**
   * Take a screenshot of the dashboard
   */
  async takeDashboardScreenshot(): Promise<void> {
    await this.takeScreenshot('dashboard');
  }

  /**
   * Check if dashboard is responsive (mobile view)
   */
  async verifyMobileLayout(): Promise<void> {
    // Set viewport to mobile size
    await this.page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile-specific layout elements
    await this.expectVisible('div.block.lg\\:hidden');
    await this.expectNotVisible('div.hidden.lg\\:grid');
  }

  /**
   * Check if dashboard is responsive (desktop view)
   */
  async verifyDesktopLayout(): Promise<void> {
    // Set viewport to desktop size
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    
    // Verify desktop-specific layout elements
    await this.expectVisible('div.hidden.lg\\:grid');
    await this.expectNotVisible('div.block.lg\\:hidden');
  }
}
