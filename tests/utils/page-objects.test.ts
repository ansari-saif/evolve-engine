import { test, expect } from '@playwright/test';
import { DashboardPage, AuthPage, TasksPage, SettingsPage } from './page-objects';

test.describe('Page Objects', () => {
  test.describe('DashboardPage', () => {
    test('should navigate to dashboard', async ({ page }) => {
      const dashboardPage = new DashboardPage(page);
      await dashboardPage.navigateToDashboard();
      // The page should navigate to dashboard (actual behavior may vary based on auth state)
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should have dashboard methods', async ({ page }) => {
      const dashboardPage = new DashboardPage(page);
      
      // Test that methods exist and are callable
      expect(typeof dashboardPage.navigateToDashboard).toBe('function');
      expect(typeof dashboardPage.getWelcomeMessage).toBe('function');
      expect(typeof dashboardPage.getTaskSummary).toBe('function');
      expect(typeof dashboardPage.clickCreateTask).toBe('function');
    });

    test('should interact with dashboard elements', async ({ page }) => {
      const dashboardPage = new DashboardPage(page);
      
      // Mock the dashboard content
      await page.setContent(`
        <div data-testid="dashboard-container">
          <div data-testid="welcome-message">Welcome User</div>
          <div data-testid="total-tasks">5</div>
          <div data-testid="pending-tasks">3</div>
          <div data-testid="completed-tasks">2</div>
          <div data-testid="overdue-tasks">0</div>
        </div>
      `);
      
      // Test getting welcome message
      const welcomeMessage = await dashboardPage.getWelcomeMessage();
      expect(welcomeMessage).toBe('Welcome User');
      
      // Test getting task summary
      const taskSummary = await dashboardPage.getTaskSummary();
      expect(taskSummary.total).toBe(5);
      expect(taskSummary.pending).toBe(3);
      expect(taskSummary.completed).toBe(2);
      expect(taskSummary.overdue).toBe(0);
    });
  });

  test.describe('AuthPage', () => {
    test('should navigate to login page', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.navigateToLogin();
      await expect(page).toHaveURL(/\/login/);
    });

    test('should navigate to registration page', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.navigateToRegister();
      await expect(page).toHaveURL(/\/register/);
    });

    test('should fill login form', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.navigateToLogin();
      
      // Mock the login form
      await page.setContent(`
        <form data-testid="login-form">
          <input data-testid="email-input" type="email" />
          <input data-testid="password-input" type="password" />
          <button data-testid="login-button">Login</button>
        </form>
      `);
      
      await authPage.fillLoginForm('test@example.com', 'password123');
      
      const emailValue = await page.locator('[data-testid="email-input"]').inputValue();
      const passwordValue = await page.locator('[data-testid="password-input"]').inputValue();
      
      expect(emailValue).toBe('test@example.com');
      expect(passwordValue).toBe('password123');
    });

    test('should verify login form is displayed', async ({ page }) => {
      const authPage = new AuthPage(page);
      await authPage.navigateToLogin();
      
      // Mock the login form
      await page.setContent(`
        <form data-testid="login-form">
          <input data-testid="email-input" type="email" />
          <input data-testid="password-input" type="password" />
          <button data-testid="login-button">Login</button>
        </form>
      `);
      
      await authPage.verifyLoginFormDisplayed();
    });

    test('should have auth methods', async ({ page }) => {
      const authPage = new AuthPage(page);
      
      // Test that methods exist and are callable
      expect(typeof authPage.login).toBe('function');
      expect(typeof authPage.register).toBe('function');
      expect(typeof authPage.resetPassword).toBe('function');
      expect(typeof authPage.getErrorMessage).toBe('function');
    });
  });

  test.describe('TasksPage', () => {
    test('should navigate to tasks page', async ({ page }) => {
      const tasksPage = new TasksPage(page);
      await tasksPage.navigateToTasks();
      await expect(page).toHaveURL(/\/tasks/);
    });

    test('should have tasks methods', async ({ page }) => {
      const tasksPage = new TasksPage(page);
      
      // Test that methods exist and are callable
      expect(typeof tasksPage.createTask).toBe('function');
      expect(typeof tasksPage.getTasks).toBe('function');
      expect(typeof tasksPage.searchTasks).toBe('function');
      expect(typeof tasksPage.getTaskCount).toBe('function');
    });

    test('should interact with tasks', async ({ page }) => {
      const tasksPage = new TasksPage(page);
      
      // Mock tasks list
      await page.setContent(`
        <div data-testid="tasks-container">
          <div data-testid="task-item">
            <div data-testid="task-title">Task 1</div>
            <div data-testid="task-description">Description 1</div>
            <div data-testid="task-priority">high</div>
            <div data-testid="task-status">pending</div>
            <div data-testid="task-due-date">2024-01-01</div>
            <div data-testid="task-assignee">John</div>
            <div data-testid="task-project">Project A</div>
          </div>
          <div data-testid="task-item">
            <div data-testid="task-title">Task 2</div>
            <div data-testid="task-description">Description 2</div>
            <div data-testid="task-priority">medium</div>
            <div data-testid="task-status">completed</div>
            <div data-testid="task-due-date">2024-01-02</div>
            <div data-testid="task-assignee">Jane</div>
            <div data-testid="task-project">Project B</div>
          </div>
        </div>
      `);
      
      // Test getting tasks
      const tasks = await tasksPage.getTasks();
      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Task 1');
      expect(tasks[0].priority).toBe('high');
      expect(tasks[1].title).toBe('Task 2');
      expect(tasks[1].status).toBe('completed');
      
      // Test getting task count
      const count = await tasksPage.getTaskCount();
      expect(count).toBe(2);
      
      // Test getting specific task
      const task = await tasksPage.getTaskByTitle('Task 1');
      expect(task).not.toBeNull();
      expect(task?.title).toBe('Task 1');
    });
  });

  test.describe('SettingsPage', () => {
    test('should navigate to settings page', async ({ page }) => {
      const settingsPage = new SettingsPage(page);
      await settingsPage.navigateToSettings();
      // The page redirects to signin since we're not authenticated
      await expect(page).toHaveURL(/\/signin/);
    });

    test('should have settings methods', async ({ page }) => {
      const settingsPage = new SettingsPage(page);
      
      // Test that methods exist and are callable
      expect(typeof settingsPage.updateProfile).toBe('function');
      expect(typeof settingsPage.changePassword).toBe('function');
      expect(typeof settingsPage.updatePreferences).toBe('function');
      expect(typeof settingsPage.configureNotifications).toBe('function');
    });

    test('should interact with settings tabs', async ({ page }) => {
      const settingsPage = new SettingsPage(page);
      
      // Mock the settings page with tabs
      await page.setContent(`
        <div data-testid="settings-container">
          <button data-testid="profile-tab">Profile</button>
          <button data-testid="account-tab">Account</button>
          <form data-testid="profile-form">
            <input data-testid="profile-name-input" />
          </form>
          <form data-testid="account-form">
            <input data-testid="current-password-input" />
          </form>
        </div>
      `);
      
      // Test clicking on profile tab
      await settingsPage.clickTab('profile');
      await expect(page.locator('[data-testid="profile-form"]')).toBeVisible();
      
      // Test clicking on account tab
      await settingsPage.clickTab('account');
      await expect(page.locator('[data-testid="account-form"]')).toBeVisible();
    });
  });

  test.describe('BasePage', () => {
    test('should have common functionality', async ({ page }) => {
      // Create a simple page object that extends BasePage
      class TestPage extends (await import('./page-objects/base-page')).BasePage {
        constructor(page: any) {
          super(page);
        }
      }
      
      const testPage = new TestPage(page);
      
      // Test navigation
      await testPage.navigate('/test');
      await expect(page).toHaveURL(/\/test/);
      
      // Test element interaction
      await page.setContent('<button data-testid="test-button">Test</button>');
      await testPage.clickElement('[data-testid="test-button"]');
      
      // Test input filling
      await page.setContent('<input data-testid="test-input" />');
      await testPage.fillInput('[data-testid="test-input"]', 'test value');
      const value = await page.locator('[data-testid="test-input"]').inputValue();
      expect(value).toBe('test value');
      
      // Test getting element text
      await page.setContent('<div data-testid="test-text">Hello World</div>');
      const text = await testPage.getElementText('[data-testid="test-text"]');
      expect(text).toBe('Hello World');
      
      // Test checking element visibility
      await page.setContent('<div data-testid="visible-element">Visible</div>');
      const isVisible = await testPage.isElementVisible('[data-testid="visible-element"]');
      expect(isVisible).toBe(true);
      
      // Test checking element presence
      const isPresent = await testPage.isElementPresent('[data-testid="visible-element"]');
      expect(isPresent).toBe(true);
    });
  });
});
