import { Page } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Dashboard Page Object
 */
export class DashboardPage extends BasePage {
  // Locators
  private readonly selectors = {
    // Main dashboard elements
    dashboardContainer: '[data-testid="dashboard-container"]',
    welcomeMessage: '[data-testid="welcome-message"]',
    userProfile: '[data-testid="user-profile"]',
    userMenu: '[data-testid="user-menu"]',
    userMenuButton: '[data-testid="user-menu-button"]',
    
    // Navigation elements
    navigationMenu: '[data-testid="navigation-menu"]',
    navTasks: '[data-testid="nav-tasks"]',
    navProjects: '[data-testid="nav-projects"]',
    navSettings: '[data-testid="nav-settings"]',
    navDashboard: '[data-testid="nav-dashboard"]',
    
    // Dashboard widgets
    taskSummary: '[data-testid="task-summary"]',
    recentActivity: '[data-testid="recent-activity"]',
    quickActions: '[data-testid="quick-actions"]',
    notifications: '[data-testid="notifications"]',
    
    // Task summary elements
    totalTasks: '[data-testid="total-tasks"]',
    pendingTasks: '[data-testid="pending-tasks"]',
    completedTasks: '[data-testid="completed-tasks"]',
    overdueTasks: '[data-testid="overdue-tasks"]',
    
    // Quick action buttons
    createTaskButton: '[data-testid="create-task-button"]',
    createProjectButton: '[data-testid="create-project-button"]',
    viewAllTasksButton: '[data-testid="view-all-tasks-button"]',
    viewAllProjectsButton: '[data-testid="view-all-projects-button"]',
    
    // Recent activity elements
    activityList: '[data-testid="activity-list"]',
    activityItem: '[data-testid="activity-item"]',
    activityTimestamp: '[data-testid="activity-timestamp"]',
    activityDescription: '[data-testid="activity-description"]',
    
    // Notification elements
    notificationList: '[data-testid="notification-list"]',
    notificationItem: '[data-testid="notification-item"]',
    notificationCount: '[data-testid="notification-count"]',
    markAllReadButton: '[data-testid="mark-all-read-button"]',
    
    // Search and filter elements
    searchInput: '[data-testid="search-input"]',
    searchButton: '[data-testid="search-button"]',
    filterDropdown: '[data-testid="filter-dropdown"]',
    
    // Loading states
    loadingSpinner: '[data-testid="loading-spinner"]',
    emptyState: '[data-testid="empty-state"]',
    
    // Error states
    errorMessage: '[data-testid="error-message"]',
    retryButton: '[data-testid="retry-button"]'
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to dashboard
   */
  async navigateToDashboard(): Promise<void> {
    await this.navigate('/dashboard');
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad(): Promise<void> {
    await this.waitForElement(this.selectors.dashboardContainer);
    await this.waitForLoadingComplete();
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getElementText(this.selectors.welcomeMessage);
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<{ name: string; email: string; role: string }> {
    const name = await this.getElementText('[data-testid="user-name"]');
    const email = await this.getElementText('[data-testid="user-email"]');
    const role = await this.getElementText('[data-testid="user-role"]');
    
    return { name, email, role };
  }

  /**
   * Open user menu
   */
  async openUserMenu(): Promise<void> {
    await this.clickElement(this.selectors.userMenuButton);
    await this.waitForElement(this.selectors.userMenu);
  }

  /**
   * Close user menu
   */
  async closeUserMenu(): Promise<void> {
    await this.clickElement(this.selectors.userMenuButton);
    await this.waitForElementHidden(this.selectors.userMenu);
  }

  /**
   * Navigate to tasks page
   */
  async navigateToTasks(): Promise<void> {
    await this.clickElement(this.selectors.navTasks);
    await this.waitForNavigation();
  }

  /**
   * Navigate to projects page
   */
  async navigateToProjects(): Promise<void> {
    await this.clickElement(this.selectors.navProjects);
    await this.waitForNavigation();
  }

  /**
   * Navigate to settings page
   */
  async navigateToSettings(): Promise<void> {
    await this.clickElement(this.selectors.navSettings);
    await this.waitForNavigation();
  }

  /**
   * Get task summary statistics
   */
  async getTaskSummary(): Promise<{
    total: number;
    pending: number;
    completed: number;
    overdue: number;
  }> {
    const total = parseInt(await this.getElementText(this.selectors.totalTasks)) || 0;
    const pending = parseInt(await this.getElementText(this.selectors.pendingTasks)) || 0;
    const completed = parseInt(await this.getElementText(this.selectors.completedTasks)) || 0;
    const overdue = parseInt(await this.getElementText(this.selectors.overdueTasks)) || 0;
    
    return { total, pending, completed, overdue };
  }

  /**
   * Click create task button
   */
  async clickCreateTask(): Promise<void> {
    await this.clickElement(this.selectors.createTaskButton);
  }

  /**
   * Click create project button
   */
  async clickCreateProject(): Promise<void> {
    await this.clickElement(this.selectors.createProjectButton);
  }

  /**
   * Click view all tasks button
   */
  async clickViewAllTasks(): Promise<void> {
    await this.clickElement(this.selectors.viewAllTasksButton);
    await this.waitForNavigation();
  }

  /**
   * Click view all projects button
   */
  async clickViewAllProjects(): Promise<void> {
    await this.clickElement(this.selectors.viewAllProjectsButton);
    await this.waitForNavigation();
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(): Promise<Array<{
    description: string;
    timestamp: string;
  }>> {
    const activities = [];
    const activityItems = this.page.locator(this.selectors.activityItem);
    const count = await activityItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = activityItems.nth(i);
      const description = await item.locator(this.selectors.activityDescription).textContent() || '';
      const timestamp = await item.locator(this.selectors.activityTimestamp).textContent() || '';
      
      activities.push({ description, timestamp });
    }
    
    return activities;
  }

  /**
   * Get notification count
   */
  async getNotificationCount(): Promise<number> {
    const countText = await this.getElementText(this.selectors.notificationCount);
    return parseInt(countText) || 0;
  }

  /**
   * Get notifications
   */
  async getNotifications(): Promise<Array<{
    message: string;
    type: string;
    read: boolean;
  }>> {
    const notifications = [];
    const notificationItems = this.page.locator(this.selectors.notificationItem);
    const count = await notificationItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = notificationItems.nth(i);
      const message = await item.locator('[data-testid="notification-message"]').textContent() || '';
      const type = await item.getAttribute('data-type') || '';
      const read = await item.hasClass('read');
      
      notifications.push({ message, type, read });
    }
    
    return notifications;
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(): Promise<void> {
    await this.clickElement(this.selectors.markAllReadButton);
    await this.waitForToast();
  }

  /**
   * Search for content
   */
  async search(query: string): Promise<void> {
    await this.fillInput(this.selectors.searchInput, query);
    await this.clickElement(this.selectors.searchButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Clear search
   */
  async clearSearch(): Promise<void> {
    await this.clearInput(this.selectors.searchInput);
    await this.clickElement(this.selectors.searchButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Apply filter
   */
  async applyFilter(filterValue: string): Promise<void> {
    await this.selectOption(this.selectors.filterDropdown, filterValue);
    await this.waitForLoadingComplete();
  }

  /**
   * Verify dashboard is loaded
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.expectElementVisible(this.selectors.dashboardContainer);
    await this.expectElementVisible(this.selectors.taskSummary);
    await this.expectElementVisible(this.selectors.recentActivity);
  }

  /**
   * Verify navigation menu is present
   */
  async verifyNavigationMenu(): Promise<void> {
    await this.expectElementVisible(this.selectors.navigationMenu);
    await this.expectElementVisible(this.selectors.navTasks);
    await this.expectElementVisible(this.selectors.navProjects);
    await this.expectElementVisible(this.selectors.navSettings);
  }

  /**
   * Verify user is logged in
   */
  async verifyUserLoggedIn(): Promise<void> {
    await this.expectElementVisible(this.selectors.userMenuButton);
    await this.expectElementVisible(this.selectors.welcomeMessage);
  }

  /**
   * Verify task summary is displayed
   */
  async verifyTaskSummaryDisplayed(): Promise<void> {
    await this.expectElementVisible(this.selectors.taskSummary);
    await this.expectElementVisible(this.selectors.totalTasks);
    await this.expectElementVisible(this.selectors.pendingTasks);
    await this.expectElementVisible(this.selectors.completedTasks);
  }

  /**
   * Verify quick actions are available
   */
  async verifyQuickActionsAvailable(): Promise<void> {
    await this.expectElementVisible(this.selectors.quickActions);
    await this.expectElementVisible(this.selectors.createTaskButton);
    await this.expectElementVisible(this.selectors.createProjectButton);
  }

  /**
   * Verify recent activity is displayed
   */
  async verifyRecentActivityDisplayed(): Promise<void> {
    await this.expectElementVisible(this.selectors.recentActivity);
    await this.expectElementVisible(this.selectors.activityList);
  }

  /**
   * Check if empty state is displayed
   */
  async isEmptyStateDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.emptyState);
  }

  /**
   * Check if error state is displayed
   */
  async isErrorStateDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.errorMessage);
  }

  /**
   * Retry loading dashboard
   */
  async retryLoading(): Promise<void> {
    await this.clickElement(this.selectors.retryButton);
    await this.waitForDashboardLoad();
  }

  /**
   * Take dashboard screenshot
   */
  async takeDashboardScreenshot(): Promise<void> {
    await this.takeScreenshot('dashboard');
  }

  /**
   * Wait for dashboard to be fully interactive
   */
  async waitForDashboardInteractive(): Promise<void> {
    await this.waitForDashboardLoad();
    await this.waitForElement(this.selectors.createTaskButton);
    await this.waitForElement(this.selectors.navTasks);
  }
}
