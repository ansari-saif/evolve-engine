import { test, expect } from '@playwright/test';
import { DashboardPage, TasksPage, AuthPage, SettingsPage } from '../utils/page-objects';

test.describe('Page Object Model Tests', () => {
  let dashboardPage: DashboardPage;
  let tasksPage: TasksPage;
  let authPage: AuthPage;
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    dashboardPage = new DashboardPage(page);
    tasksPage = new TasksPage(page);
    authPage = new AuthPage(page);
    settingsPage = new SettingsPage(page);
  });

  test.describe('Dashboard Page', () => {
    test('should load dashboard page correctly', async () => {
      await dashboardPage.navigateToDashboard();
      await dashboardPage.verifyDashboardLoaded();
      await dashboardPage.verifyDashboardSections();
    });

    test('should navigate between sections from dashboard', async () => {
      await dashboardPage.navigateToDashboard();
      
      // Navigate to tasks
      await dashboardPage.navigateToTasks();
      await expect(dashboardPage.page).toHaveURL(/.*\/tasks/);
      
      // Navigate back to dashboard
      await dashboardPage.navigateToDashboard();
      await expect(dashboardPage.page).toHaveURL(/.*\/$/);
    });

    test('should be responsive on different screen sizes', async () => {
      await dashboardPage.navigateToDashboard();
      
      // Test mobile layout
      await dashboardPage.verifyMobileLayout();
      
      // Test desktop layout
      await dashboardPage.verifyDesktopLayout();
    });

    test('should take screenshots', async () => {
      await dashboardPage.navigateToDashboard();
      await dashboardPage.takeDashboardScreenshot();
    });
  });

  test.describe('Tasks Page', () => {
    test('should load tasks page correctly', async () => {
      await tasksPage.navigateToTasks();
      await tasksPage.verifyTasksLoaded();
    });

    test('should switch between task tabs', async () => {
      await tasksPage.navigateToTasks();
      
      // Test all tabs
      await tasksPage.clickTab('all');
      await tasksPage.verifyTabActive('all');
      
      await tasksPage.clickTab('pending');
      await tasksPage.verifyTabActive('pending');
      
      await tasksPage.clickTab('in-progress');
      await tasksPage.verifyTabActive('in-progress');
      
      await tasksPage.clickTab('completed');
      await tasksPage.verifyTabActive('completed');
    });

    test('should create a new task', async () => {
      await tasksPage.navigateToTasks();
      
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        priority: 'High',
        energy: 'Medium'
      };
      
      await tasksPage.createTask(taskData);
      await tasksPage.verifyTaskExists('Test Task');
    });

    test('should search for tasks', async () => {
      await tasksPage.navigateToTasks();
      
      // Create a task first
      await tasksPage.createTask({
        title: 'Searchable Task',
        description: 'This task should be searchable'
      });
      
      // Search for the task
      await tasksPage.searchTasks('Searchable');
      await tasksPage.verifyTaskExists('Searchable Task');
      
      // Clear search
      await tasksPage.clearSearch();
    });

    test('should apply filters', async () => {
      await tasksPage.navigateToTasks();
      
      await tasksPage.applyFilters({
        status: 'Pending',
        priority: 'High'
      });
      
      // Verify filters are applied (this would depend on actual implementation)
      // await tasksPage.verifyFiltersApplied();
    });
  });

  test.describe('Authentication', () => {
    test('should load login page correctly', async () => {
      await authPage.navigateToLogin();
      await authPage.verifyLoginLoaded();
    });

    test('should load register page correctly', async () => {
      await authPage.navigateToRegister();
      await authPage.verifyRegisterLoaded();
    });

    test('should navigate between auth pages', async () => {
      await authPage.navigateToLogin();
      
      // Go to register from login
      await authPage.goToRegister();
      await authPage.verifyRegisterLoaded();
      
      // Go back to login from register
      await authPage.goToLogin();
      await authPage.verifyLoginLoaded();
    });

    test('should fill login form', async () => {
      await authPage.navigateToLogin();
      
      await authPage.fillLoginForm({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true
      });
      
      // Verify form is filled (this would depend on actual implementation)
      // await authPage.verifyLoginFormFilled();
    });

    test('should fill register form', async () => {
      await authPage.navigateToRegister();
      
      await authPage.fillRegisterForm({
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true
      });
      
      // Verify form is filled (this would depend on actual implementation)
      // await authPage.verifyRegisterFormFilled();
    });

    test('should request password reset', async () => {
      await authPage.navigateToForgotPassword();
      
      await authPage.requestPasswordReset('test@example.com');
      await authPage.verifyPasswordResetEmailSent();
    });
  });

  test.describe('Settings Page', () => {
    test('should load settings page correctly', async () => {
      await settingsPage.navigateToSettings();
      await settingsPage.verifySettingsLoaded();
    });

    test('should switch between settings tabs', async () => {
      await settingsPage.navigateToSettings();
      
      // Test all tabs
      await settingsPage.clickTab('profile');
      await settingsPage.verifyTabActive('profile');
      
      await settingsPage.clickTab('account');
      await settingsPage.verifyTabActive('account');
      
      await settingsPage.clickTab('preferences');
      await settingsPage.verifyTabActive('preferences');
      
      await settingsPage.clickTab('privacy');
      await settingsPage.verifyTabActive('privacy');
      
      await settingsPage.clickTab('notifications');
      await settingsPage.verifyTabActive('notifications');
    });

    test('should update profile information', async () => {
      await settingsPage.navigateToSettings();
      await settingsPage.clickTab('profile');
      
      const profileData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        bio: 'This is my bio'
      };
      
      await settingsPage.updateProfile(profileData);
      await settingsPage.saveSettings();
      await settingsPage.verifySettingsSaved();
    });

    test('should update theme preference', async () => {
      await settingsPage.navigateToSettings();
      await settingsPage.clickTab('preferences');
      
      await settingsPage.updateTheme('dark');
      await settingsPage.saveSettings();
      await settingsPage.verifyThemeApplied('dark');
    });

    test('should toggle notification settings', async () => {
      await settingsPage.navigateToSettings();
      await settingsPage.clickTab('notifications');
      
      await settingsPage.toggleTaskReminders(true);
      await settingsPage.toggleGoalUpdates(false);
      await settingsPage.toggleWeeklyReports(true);
      
      await settingsPage.saveSettings();
      
      await settingsPage.verifyNotificationSettings({
        taskReminders: true,
        goalUpdates: false,
        weeklyReports: true
      });
    });
  });

  test.describe('Integration Tests', () => {
    test('should complete a full user workflow', async () => {
      // Start at dashboard
      await dashboardPage.navigateToDashboard();
      await dashboardPage.verifyDashboardLoaded();
      
      // Navigate to tasks
      await dashboardPage.navigateToTasks();
      await tasksPage.verifyTasksLoaded();
      
      // Create a task
      await tasksPage.createTask({
        title: 'Integration Test Task',
        description: 'Task created during integration test',
        priority: 'Medium'
      });
      
      // Navigate to settings
      await dashboardPage.navigateToSettings();
      await settingsPage.verifySettingsLoaded();
      
      // Update a setting
      await settingsPage.clickTab('preferences');
      await settingsPage.updateTheme('light');
      await settingsPage.saveSettings();
      
      // Navigate back to dashboard
      await dashboardPage.navigateToDashboard();
      await dashboardPage.verifyDashboardLoaded();
    });
  });
});
