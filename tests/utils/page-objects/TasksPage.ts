import { Page, expect } from '@playwright/test';
import { BasePageObject } from './BasePageObject';

/**
 * Page Object for the Tasks page
 */
export class TasksPage extends BasePageObject {
  // Locators
  private readonly pageTitle = 'h1:has-text("Tasks")';
  private readonly taskTabs = '[data-testid="task-tabs"]';
  private readonly createTaskButton = '[data-testid="create-task-button"]';
  private readonly taskFilters = '[data-testid="task-filters"]';
  private readonly taskList = '[data-testid="task-list"]';
  private readonly searchInput = '[data-testid="task-search"]';
  private readonly bulkActionsButton = '[data-testid="bulk-actions-button"]';
  private readonly generateTasksButton = '[data-testid="generate-tasks-button"]';

  // Tab locators
  private readonly allTab = '[data-testid="tab-all"]';
  private readonly pendingTab = '[data-testid="tab-pending"]';
  private readonly inProgressTab = '[data-testid="tab-in-progress"]';
  private readonly completedTab = '[data-testid="tab-completed"]';

  // Filter locators
  private readonly statusFilter = '[data-testid="filter-status"]';
  private readonly priorityFilter = '[data-testid="filter-priority"]';
  private readonly energyFilter = '[data-testid="filter-energy"]';
  private readonly goalFilter = '[data-testid="filter-goal"]';

  // Dialog locators
  private readonly createTaskDialog = '[data-testid="create-task-dialog"]';
  private readonly editTaskDialog = '[data-testid="edit-task-dialog"]';
  private readonly bulkCreateDialog = '[data-testid="bulk-create-dialog"]';
  private readonly generateTasksDialog = '[data-testid="generate-tasks-dialog"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the tasks page
   */
  async navigateToTasks(): Promise<void> {
    await this.navigateTo('/tasks');
    await this.waitForTasksToLoad();
  }

  /**
   * Wait for tasks page to be fully loaded
   */
  async waitForTasksToLoad(): Promise<void> {
    await this.waitForLoad();
    await this.waitForElement(this.taskTabs);
  }

  /**
   * Verify tasks page is loaded correctly
   */
  async verifyTasksLoaded(): Promise<void> {
    await this.expectVisible(this.taskTabs);
    await this.expectVisible(this.createTaskButton);
    await this.expectVisible(this.taskFilters);
  }

  /**
   * Click on a specific tab
   */
  async clickTab(tabName: 'all' | 'pending' | 'in-progress' | 'completed'): Promise<void> {
    const tabSelector = this.getTabSelector(tabName);
    await this.click(tabSelector);
    await this.waitForLoad();
  }

  /**
   * Get tab selector by name
   */
  private getTabSelector(tabName: string): string {
    const tabSelectors = {
      'all': this.allTab,
      'pending': this.pendingTab,
      'in-progress': this.inProgressTab,
      'completed': this.completedTab
    };
    return tabSelectors[tabName as keyof typeof tabSelectors];
  }

  /**
   * Verify tab is active
   */
  async verifyTabActive(tabName: 'all' | 'pending' | 'in-progress' | 'completed'): Promise<void> {
    const tabSelector = this.getTabSelector(tabName);
    await this.expectVisible(`${tabSelector}[data-state="active"]`);
  }

  /**
   * Open create task dialog
   */
  async openCreateTaskDialog(): Promise<void> {
    await this.click(this.createTaskButton);
    await this.waitForElement(this.createTaskDialog);
  }

  /**
   * Close create task dialog
   */
  async closeCreateTaskDialog(): Promise<void> {
    await this.click('[data-testid="dialog-close"]');
    await this.expectNotVisible(this.createTaskDialog);
  }

  /**
   * Fill create task form
   */
  async fillCreateTaskForm(taskData: {
    title: string;
    description?: string;
    priority?: string;
    energy?: string;
    goal?: string;
    scheduledFor?: string;
  }): Promise<void> {
    // Fill title
    await this.fill('[data-testid="task-title-input"]', taskData.title);
    
    // Fill description if provided
    if (taskData.description) {
      await this.fill('[data-testid="task-description-input"]', taskData.description);
    }
    
    // Select priority if provided
    if (taskData.priority) {
      await this.click('[data-testid="task-priority-select"]');
      await this.click(`[data-testid="priority-${taskData.priority.toLowerCase()}"]`);
    }
    
    // Select energy level if provided
    if (taskData.energy) {
      await this.click('[data-testid="task-energy-select"]');
      await this.click(`[data-testid="energy-${taskData.energy.toLowerCase()}"]`);
    }
    
    // Select goal if provided
    if (taskData.goal) {
      await this.click('[data-testid="task-goal-select"]');
      await this.click(`[data-testid="goal-${taskData.goal}"]`);
    }
    
    // Set scheduled date if provided
    if (taskData.scheduledFor) {
      await this.fill('[data-testid="task-scheduled-date"]', taskData.scheduledFor);
    }
  }

  /**
   * Submit create task form
   */
  async submitCreateTaskForm(): Promise<void> {
    await this.click('[data-testid="create-task-submit"]');
    await this.expectNotVisible(this.createTaskDialog);
  }

  /**
   * Create a new task
   */
  async createTask(taskData: {
    title: string;
    description?: string;
    priority?: string;
    energy?: string;
    goal?: string;
    scheduledFor?: string;
  }): Promise<void> {
    await this.openCreateTaskDialog();
    await this.fillCreateTaskForm(taskData);
    await this.submitCreateTaskForm();
  }

  /**
   * Open edit task dialog for a specific task
   */
  async openEditTaskDialog(taskTitle: string): Promise<void> {
    await this.click(`[data-testid="edit-task-${taskTitle}"]`);
    await this.waitForElement(this.editTaskDialog);
  }

  /**
   * Edit an existing task
   */
  async editTask(taskTitle: string, updates: {
    title?: string;
    description?: string;
    priority?: string;
    energy?: string;
    goal?: string;
    scheduledFor?: string;
  }): Promise<void> {
    await this.openEditTaskDialog(taskTitle);
    
    // Update fields if provided
    if (updates.title) {
      await this.fill('[data-testid="task-title-input"]', updates.title);
    }
    if (updates.description) {
      await this.fill('[data-testid="task-description-input"]', updates.description);
    }
    if (updates.priority) {
      await this.click('[data-testid="task-priority-select"]');
      await this.click(`[data-testid="priority-${updates.priority.toLowerCase()}"]`);
    }
    if (updates.energy) {
      await this.click('[data-testid="task-energy-select"]');
      await this.click(`[data-testid="energy-${updates.energy.toLowerCase()}"]`);
    }
    if (updates.goal) {
      await this.click('[data-testid="task-goal-select"]');
      await this.click(`[data-testid="goal-${updates.goal}"]`);
    }
    if (updates.scheduledFor) {
      await this.fill('[data-testid="task-scheduled-date"]', updates.scheduledFor);
    }
    
    await this.click('[data-testid="edit-task-submit"]');
    await this.expectNotVisible(this.editTaskDialog);
  }

  /**
   * Delete a task
   */
  async deleteTask(taskTitle: string): Promise<void> {
    await this.click(`[data-testid="delete-task-${taskTitle}"]`);
    await this.click('[data-testid="confirm-delete"]');
  }

  /**
   * Complete a task
   */
  async completeTask(taskTitle: string): Promise<void> {
    await this.click(`[data-testid="complete-task-${taskTitle}"]`);
  }

  /**
   * Search for tasks
   */
  async searchTasks(searchTerm: string): Promise<void> {
    await this.fill(this.searchInput, searchTerm);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Clear search
   */
  async clearSearch(): Promise<void> {
    await this.fill(this.searchInput, '');
    await this.page.keyboard.press('Enter');
  }

  /**
   * Apply filters
   */
  async applyFilters(filters: {
    status?: string;
    priority?: string;
    energy?: string;
    goal?: string;
  }): Promise<void> {
    if (filters.status) {
      await this.click(this.statusFilter);
      await this.click(`[data-testid="status-${filters.status.toLowerCase()}"]`);
    }
    
    if (filters.priority) {
      await this.click(this.priorityFilter);
      await this.click(`[data-testid="priority-${filters.priority.toLowerCase()}"]`);
    }
    
    if (filters.energy) {
      await this.click(this.energyFilter);
      await this.click(`[data-testid="energy-${filters.energy.toLowerCase()}"]`);
    }
    
    if (filters.goal) {
      await this.click(this.goalFilter);
      await this.click(`[data-testid="goal-${filters.goal}"]`);
    }
  }

  /**
   * Clear all filters
   */
  async clearFilters(): Promise<void> {
    await this.click('[data-testid="clear-filters"]');
  }

  /**
   * Open bulk create dialog
   */
  async openBulkCreateDialog(): Promise<void> {
    await this.click(this.bulkActionsButton);
    await this.click('[data-testid="bulk-create-option"]');
    await this.waitForElement(this.bulkCreateDialog);
  }

  /**
   * Open generate tasks dialog
   */
  async openGenerateTasksDialog(): Promise<void> {
    await this.click(this.generateTasksButton);
    await this.waitForElement(this.generateTasksDialog);
  }

  /**
   * Verify task exists in the list
   */
  async verifyTaskExists(taskTitle: string): Promise<void> {
    await this.expectVisible(`[data-testid="task-item-${taskTitle}"]`);
  }

  /**
   * Verify task does not exist in the list
   */
  async verifyTaskNotExists(taskTitle: string): Promise<void> {
    await this.expectNotVisible(`[data-testid="task-item-${taskTitle}"]`);
  }

  /**
   * Get task count
   */
  async getTaskCount(): Promise<number> {
    const taskItems = this.page.locator('[data-testid^="task-item-"]');
    return await taskItems.count();
  }

  /**
   * Verify task status
   */
  async verifyTaskStatus(taskTitle: string, status: string): Promise<void> {
    await this.expectVisible(`[data-testid="task-item-${taskTitle}"][data-status="${status.toLowerCase()}"]`);
  }

  /**
   * Take a screenshot of the tasks page
   */
  async takeTasksScreenshot(): Promise<void> {
    await this.takeScreenshot('tasks');
  }
}
