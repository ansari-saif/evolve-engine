import { test, expect } from '@playwright/test';
import { DashboardPage, AuthPage, TasksPage, SettingsPage } from '../utils/page-objects';
import { TestData } from '../fixtures/test-data';

test.describe('Page Object Model Demo', () => {
  test('should demonstrate complete user workflow using page objects', async ({ page }) => {
    const authPage = new AuthPage(page);
    const dashboardPage = new DashboardPage(page);
    const tasksPage = new TasksPage(page);
    const settingsPage = new SettingsPage(page);

    // Step 1: Navigate to login page
    await authPage.navigateToLogin();
    await expect(page).toHaveURL(/\/login/);

    // Step 2: Fill and submit login form
    await authPage.fillLoginForm(TestData.users.validUser.email, TestData.users.validUser.password);
    await authPage.submitLoginForm();

    // Step 3: Wait for authentication to complete and verify dashboard
    await authPage.waitForAuthenticationComplete();
    await dashboardPage.verifyDashboardLoaded();

    // Step 4: Navigate to tasks page
    await dashboardPage.navigateToTasks();
    await tasksPage.verifyTasksPageLoaded();

    // Step 5: Create a new task
    await tasksPage.createTask({
      title: TestData.tasks.sampleTask.title,
      description: TestData.tasks.sampleTask.description,
      priority: TestData.tasks.sampleTask.priority as 'low' | 'medium' | 'high',
      dueDate: TestData.tasks.sampleTask.dueDate,
      project: 'Demo Project',
      assignee: TestData.users.validUser.name,
      tags: ['demo', 'e2e']
    });

    // Step 6: Verify task was created
    const tasks = await tasksPage.getTasks();
    const createdTask = tasks.find(task => task.title === TestData.tasks.sampleTask.title);
    expect(createdTask).toBeDefined();
    expect(createdTask?.description).toBe(TestData.tasks.sampleTask.description);

    // Step 7: Search for the created task
    await tasksPage.searchTasks(TestData.tasks.sampleTask.title);
    const searchResults = await tasksPage.getTasks();
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].title).toBe(TestData.tasks.sampleTask.title);

    // Step 8: Complete the task
    await tasksPage.completeTask(TestData.tasks.sampleTask.title);

    // Step 9: Navigate back to dashboard
    await tasksPage.navigateToTasks();
    await dashboardPage.navigateToDashboard();

    // Step 10: Verify task summary was updated
    const taskSummary = await dashboardPage.getTaskSummary();
    expect(taskSummary.completed).toBeGreaterThan(0);

    // Step 11: Navigate to settings
    await dashboardPage.navigateToSettings();
    await settingsPage.verifySettingsPageLoaded();

    // Step 12: Update user preferences
    await settingsPage.updatePreferences({
      theme: 'dark',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h'
    });

    // Step 13: Verify settings were saved
    const successMessage = await settingsPage.getSuccessMessage();
    expect(successMessage).toContain('saved');

    // Step 14: Navigate back to dashboard
    await settingsPage.navigateToSettings();
    await dashboardPage.navigateToDashboard();

    // Step 15: Take a screenshot of the final state
    await dashboardPage.takeDashboardScreenshot();
  });

  test('should handle authentication errors gracefully', async ({ page }) => {
    const authPage = new AuthPage(page);

    // Navigate to login page
    await authPage.navigateToLogin();

    // Fill form with invalid credentials
    await authPage.fillLoginForm(TestData.users.invalidUser.email, TestData.users.invalidUser.password);
    await authPage.submitLoginForm();

    // Verify error message is displayed
    const errorMessage = await authPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.length).toBeGreaterThan(0);
  });

  test('should demonstrate task management workflow', async ({ page }) => {
    const authPage = new AuthPage(page);
    const tasksPage = new TasksPage(page);

    // Login first
    await authPage.navigateToLogin();
    await authPage.fillLoginForm(TestData.users.validUser.email, TestData.users.validUser.password);
    await authPage.submitLoginForm();
    await authPage.waitForAuthenticationComplete();

    // Navigate to tasks
    await tasksPage.navigateToTasks();

    // Create multiple tasks
    const taskData = [
      {
        title: 'High Priority Task',
        description: 'This is a high priority task',
        priority: 'high' as const,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Medium Priority Task',
        description: 'This is a medium priority task',
        priority: 'medium' as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Low Priority Task',
        description: 'This is a low priority task',
        priority: 'low' as const,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ];

    for (const task of taskData) {
      await tasksPage.createTask(task);
    }

    // Verify all tasks were created
    const tasks = await tasksPage.getTasks();
    expect(tasks.length).toBeGreaterThanOrEqual(taskData.length);

    // Test filtering by priority
    await tasksPage.applyFilter('priority', 'high');
    const highPriorityTasks = await tasksPage.getTasks();
    expect(highPriorityTasks.every(task => task.priority === 'high')).toBe(true);

    // Test sorting
    await tasksPage.sortTasks('priority');
    const sortedTasks = await tasksPage.getTasks();
    expect(sortedTasks.length).toBeGreaterThan(0);

    // Test bulk operations
    await tasksPage.selectAllTasks();
    await tasksPage.bulkCompleteTasks();

    // Verify tasks were completed
    const completedTasks = await tasksPage.getTasks();
    expect(completedTasks.every(task => task.status === 'completed')).toBe(true);
  });

  test('should demonstrate settings management', async ({ page }) => {
    const authPage = new AuthPage(page);
    const settingsPage = new SettingsPage(page);

    // Login first
    await authPage.navigateToLogin();
    await authPage.fillLoginForm(TestData.users.validUser.email, TestData.users.validUser.password);
    await authPage.submitLoginForm();
    await authPage.waitForAuthenticationComplete();

    // Navigate to settings
    await settingsPage.navigateToSettings();

    // Test profile update
    await settingsPage.updateProfile({
      name: 'Updated User Name',
      email: TestData.users.validUser.email,
      phone: '+1234567890',
      bio: 'This is a test bio for E2E testing'
    });

    // Test notification settings
    await settingsPage.configureNotifications({
      email: true,
      push: false,
      sms: false,
      taskReminders: true,
      projectUpdates: false,
      weeklyReports: true
    });

    // Test security settings
    await settingsPage.configureSecurity({
      twoFactorEnabled: false,
      sessionTimeout: '30 minutes'
    });

    // Verify all settings were saved
    const successMessage = await settingsPage.getSuccessMessage();
    expect(successMessage).toBeTruthy();
  });

  test('should handle empty states gracefully', async ({ page }) => {
    const authPage = new AuthPage(page);
    const tasksPage = new TasksPage(page);

    // Login first
    await authPage.navigateToLogin();
    await authPage.fillLoginForm(TestData.users.validUser.email, TestData.users.validUser.password);
    await authPage.submitLoginForm();
    await authPage.waitForAuthenticationComplete();

    // Navigate to tasks
    await tasksPage.navigateToTasks();

    // Clear all tasks (if any exist)
    const initialTasks = await tasksPage.getTasks();
    for (const task of initialTasks) {
      await tasksPage.deleteTask(task.title);
    }

    // Verify empty state
    const isEmptyState = await tasksPage.isEmptyStateDisplayed();
    expect(isEmptyState).toBe(true);

    // Create first task
    await tasksPage.createTask({
      title: 'First Task',
      description: 'This is the first task',
      priority: 'medium'
    });

    // Verify empty state is no longer displayed
    const isEmptyStateAfter = await tasksPage.isEmptyStateDisplayed();
    expect(isEmptyStateAfter).toBe(false);
  });
});
