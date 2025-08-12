import { Page } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * Tasks Page Object
 */
export class TasksPage extends BasePage {
  // Locators
  private readonly selectors = {
    // Main page elements
    tasksContainer: '[data-testid="tasks-container"]',
    tasksHeader: '[data-testid="tasks-header"]',
    tasksList: '[data-testid="tasks-list"]',
    
    // Task creation elements
    createTaskButton: '[data-testid="create-task-button"]',
    createTaskModal: '[data-testid="create-task-modal"]',
    taskForm: '[data-testid="task-form"]',
    taskTitleInput: '[data-testid="task-title-input"]',
    taskDescriptionInput: '[data-testid="task-description-input"]',
    taskPrioritySelect: '[data-testid="task-priority-select"]',
    taskDueDateInput: '[data-testid="task-due-date-input"]',
    taskProjectSelect: '[data-testid="task-project-select"]',
    taskAssigneeSelect: '[data-testid="task-assignee-select"]',
    taskTagsInput: '[data-testid="task-tags-input"]',
    saveTaskButton: '[data-testid="save-task-button"]',
    cancelTaskButton: '[data-testid="cancel-task-button"]',
    
    // Task list elements
    taskItem: '[data-testid="task-item"]',
    taskTitle: '[data-testid="task-title"]',
    taskDescription: '[data-testid="task-description"]',
    taskPriority: '[data-testid="task-priority"]',
    taskStatus: '[data-testid="task-status"]',
    taskDueDate: '[data-testid="task-due-date"]',
    taskAssignee: '[data-testid="task-assignee"]',
    taskProject: '[data-testid="task-project"]',
    taskTags: '[data-testid="task-tags"]',
    
    // Task actions
    editTaskButton: '[data-testid="edit-task-button"]',
    deleteTaskButton: '[data-testid="delete-task-button"]',
    completeTaskButton: '[data-testid="complete-task-button"]',
    reopenTaskButton: '[data-testid="reopen-task-button"]',
    duplicateTaskButton: '[data-testid="duplicate-task-button"]',
    
    // Task details modal
    taskDetailsModal: '[data-testid="task-details-modal"]',
    taskDetailsTitle: '[data-testid="task-details-title"]',
    taskDetailsDescription: '[data-testid="task-details-description"]',
    taskDetailsPriority: '[data-testid="task-details-priority"]',
    taskDetailsStatus: '[data-testid="task-details-status"]',
    taskDetailsDueDate: '[data-testid="task-details-due-date"]',
    taskDetailsAssignee: '[data-testid="task-details-assignee"]',
    taskDetailsProject: '[data-testid="task-details-project"]',
    taskDetailsTags: '[data-testid="task-details-tags"]',
    taskDetailsCreatedAt: '[data-testid="task-details-created-at"]',
    taskDetailsUpdatedAt: '[data-testid="task-details-updated-at"]',
    closeTaskDetailsButton: '[data-testid="close-task-details-button"]',
    
    // Filter and search elements
    searchInput: '[data-testid="search-input"]',
    searchButton: '[data-testid="search-button"]',
    clearSearchButton: '[data-testid="clear-search-button"]',
    
    // Filter dropdowns
    statusFilter: '[data-testid="status-filter"]',
    priorityFilter: '[data-testid="priority-filter"]',
    projectFilter: '[data-testid="project-filter"]',
    assigneeFilter: '[data-testid="assignee-filter"]',
    dateFilter: '[data-testid="date-filter"]',
    
    // Sort elements
    sortDropdown: '[data-testid="sort-dropdown"]',
    sortByTitle: '[data-testid="sort-by-title"]',
    sortByPriority: '[data-testid="sort-by-priority"]',
    sortByDueDate: '[data-testid="sort-by-due-date"]',
    sortByCreatedAt: '[data-testid="sort-by-created-at"]',
    sortByAssignee: '[data-testid="sort-by-assignee"]',
    
    // Bulk actions
    selectAllCheckbox: '[data-testid="select-all-checkbox"]',
    bulkActionsDropdown: '[data-testid="bulk-actions-dropdown"]',
    bulkCompleteButton: '[data-testid="bulk-complete-button"]',
    bulkDeleteButton: '[data-testid="bulk-delete-button"]',
    bulkAssignButton: '[data-testid="bulk-assign-button"]',
    bulkMoveButton: '[data-testid="bulk-move-button"]',
    
    // Pagination
    paginationContainer: '[data-testid="pagination-container"]',
    previousPageButton: '[data-testid="previous-page-button"]',
    nextPageButton: '[data-testid="next-page-button"]',
    pageNumberButton: '[data-testid="page-number-button"]',
    itemsPerPageSelect: '[data-testid="items-per-page-select"]',
    
    // View options
    viewToggle: '[data-testid="view-toggle"]',
    listViewButton: '[data-testid="list-view-button"]',
    gridViewButton: '[data-testid="grid-view-button"]',
    kanbanViewButton: '[data-testid="kanban-view-button"]',
    
    // Kanban board elements
    kanbanBoard: '[data-testid="kanban-board"]',
    kanbanColumn: '[data-testid="kanban-column"]',
    kanbanCard: '[data-testid="kanban-card"]',
    
    // Loading and empty states
    loadingSpinner: '[data-testid="loading-spinner"]',
    emptyState: '[data-testid="empty-state"]',
    emptyStateMessage: '[data-testid="empty-state-message"]',
    createFirstTaskButton: '[data-testid="create-first-task-button"]',
    
    // Error states
    errorMessage: '[data-testid="error-message"]',
    retryButton: '[data-testid="retry-button"]',
    
    // Confirmation dialogs
    confirmDeleteModal: '[data-testid="confirm-delete-modal"]',
    confirmDeleteButton: '[data-testid="confirm-delete-button"]',
    cancelDeleteButton: '[data-testid="cancel-delete-button"]',
    
    // Success messages
    successMessage: '[data-testid="success-message"]',
    taskCreatedMessage: '[data-testid="task-created-message"]',
    taskUpdatedMessage: '[data-testid="task-updated-message"]',
    taskDeletedMessage: '[data-testid="task-deleted-message"]'
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to tasks page
   */
  async navigateToTasks(): Promise<void> {
    await this.navigate('/tasks');
  }

  /**
   * Wait for tasks page to load
   */
  async waitForTasksPageLoad(): Promise<void> {
    await this.waitForElement(this.selectors.tasksContainer);
    await this.waitForLoadingComplete();
  }

  /**
   * Click create task button
   */
  async clickCreateTask(): Promise<void> {
    await this.clickElement(this.selectors.createTaskButton);
    await this.waitForElement(this.selectors.createTaskModal);
  }

  /**
   * Fill task form
   */
  async fillTaskForm(taskData: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    project?: string;
    assignee?: string;
    tags?: string[];
  }): Promise<void> {
    await this.fillInput(this.selectors.taskTitleInput, taskData.title);
    
    if (taskData.description) {
      await this.fillInput(this.selectors.taskDescriptionInput, taskData.description);
    }
    
    if (taskData.priority) {
      await this.selectOption(this.selectors.taskPrioritySelect, taskData.priority);
    }
    
    if (taskData.dueDate) {
      await this.fillInput(this.selectors.taskDueDateInput, taskData.dueDate);
    }
    
    if (taskData.project) {
      await this.selectOption(this.selectors.taskProjectSelect, taskData.project);
    }
    
    if (taskData.assignee) {
      await this.selectOption(this.selectors.taskAssigneeSelect, taskData.assignee);
    }
    
    if (taskData.tags && taskData.tags.length > 0) {
      await this.fillInput(this.selectors.taskTagsInput, taskData.tags.join(', '));
    }
  }

  /**
   * Save task
   */
  async saveTask(): Promise<void> {
    await this.clickElement(this.selectors.saveTaskButton);
    await this.waitForLoadingComplete();
    await this.waitForElementHidden(this.selectors.createTaskModal);
  }

  /**
   * Cancel task creation
   */
  async cancelTaskCreation(): Promise<void> {
    await this.clickElement(this.selectors.cancelTaskButton);
    await this.waitForElementHidden(this.selectors.createTaskModal);
  }

  /**
   * Create a new task
   */
  async createTask(taskData: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    project?: string;
    assignee?: string;
    tags?: string[];
  }): Promise<void> {
    await this.clickCreateTask();
    await this.fillTaskForm(taskData);
    await this.saveTask();
  }

  /**
   * Get all tasks
   */
  async getTasks(): Promise<Array<{
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate: string;
    assignee: string;
    project: string;
  }>> {
    const tasks = [];
    const taskItems = this.page.locator(this.selectors.taskItem);
    const count = await taskItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = taskItems.nth(i);
      const title = await item.locator(this.selectors.taskTitle).textContent() || '';
      const description = await item.locator(this.selectors.taskDescription).textContent() || '';
      const priority = await item.locator(this.selectors.taskPriority).textContent() || '';
      const status = await item.locator(this.selectors.taskStatus).textContent() || '';
      const dueDate = await item.locator(this.selectors.taskDueDate).textContent() || '';
      const assignee = await item.locator(this.selectors.taskAssignee).textContent() || '';
      const project = await item.locator(this.selectors.taskProject).textContent() || '';
      
      tasks.push({ title, description, priority, status, dueDate, assignee, project });
    }
    
    return tasks;
  }

  /**
   * Get task by title
   */
  async getTaskByTitle(title: string): Promise<{
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate: string;
    assignee: string;
    project: string;
  } | null> {
    const tasks = await this.getTasks();
    return tasks.find(task => task.title === title) || null;
  }

  /**
   * Click on task to view details
   */
  async clickTask(title: string): Promise<void> {
    const taskItem = this.page.locator(this.selectors.taskItem).filter({ hasText: title });
    await taskItem.click();
    await this.waitForElement(this.selectors.taskDetailsModal);
  }

  /**
   * Edit task
   */
  async editTask(title: string, updates: {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    project?: string;
    assignee?: string;
    tags?: string[];
  }): Promise<void> {
    const taskItem = this.page.locator(this.selectors.taskItem).filter({ hasText: title });
    await taskItem.locator(this.selectors.editTaskButton).click();
    await this.waitForElement(this.selectors.taskForm);
    
    if (updates.title) {
      await this.clearInput(this.selectors.taskTitleInput);
      await this.fillInput(this.selectors.taskTitleInput, updates.title);
    }
    
    if (updates.description) {
      await this.clearInput(this.selectors.taskDescriptionInput);
      await this.fillInput(this.selectors.taskDescriptionInput, updates.description);
    }
    
    if (updates.priority) {
      await this.selectOption(this.selectors.taskPrioritySelect, updates.priority);
    }
    
    if (updates.dueDate) {
      await this.fillInput(this.selectors.taskDueDateInput, updates.dueDate);
    }
    
    if (updates.project) {
      await this.selectOption(this.selectors.taskProjectSelect, updates.project);
    }
    
    if (updates.assignee) {
      await this.selectOption(this.selectors.taskAssigneeSelect, updates.assignee);
    }
    
    if (updates.tags) {
      await this.fillInput(this.selectors.taskTagsInput, updates.tags.join(', '));
    }
    
    await this.saveTask();
  }

  /**
   * Delete task
   */
  async deleteTask(title: string): Promise<void> {
    const taskItem = this.page.locator(this.selectors.taskItem).filter({ hasText: title });
    await taskItem.locator(this.selectors.deleteTaskButton).click();
    await this.waitForElement(this.selectors.confirmDeleteModal);
    await this.clickElement(this.selectors.confirmDeleteButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Complete task
   */
  async completeTask(title: string): Promise<void> {
    const taskItem = this.page.locator(this.selectors.taskItem).filter({ hasText: title });
    await taskItem.locator(this.selectors.completeTaskButton).click();
    await this.waitForLoadingComplete();
  }

  /**
   * Reopen task
   */
  async reopenTask(title: string): Promise<void> {
    const taskItem = this.page.locator(this.selectors.taskItem).filter({ hasText: title });
    await taskItem.locator(this.selectors.reopenTaskButton).click();
    await this.waitForLoadingComplete();
  }

  /**
   * Duplicate task
   */
  async duplicateTask(title: string): Promise<void> {
    const taskItem = this.page.locator(this.selectors.taskItem).filter({ hasText: title });
    await taskItem.locator(this.selectors.duplicateTaskButton).click();
    await this.waitForElement(this.selectors.createTaskModal);
  }

  /**
   * Search tasks
   */
  async searchTasks(query: string): Promise<void> {
    await this.fillInput(this.selectors.searchInput, query);
    await this.clickElement(this.selectors.searchButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Clear search
   */
  async clearSearch(): Promise<void> {
    await this.clickElement(this.selectors.clearSearchButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Apply filter
   */
  async applyFilter(filterType: 'status' | 'priority' | 'project' | 'assignee' | 'date', value: string): Promise<void> {
    const filterSelector = this.selectors[`${filterType}Filter` as keyof typeof this.selectors];
    await this.selectOption(filterSelector, value);
    await this.waitForLoadingComplete();
  }

  /**
   * Sort tasks
   */
  async sortTasks(sortBy: 'title' | 'priority' | 'dueDate' | 'createdAt' | 'assignee'): Promise<void> {
    await this.clickElement(this.selectors.sortDropdown);
    const sortSelector = this.selectors[`sortBy${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}` as keyof typeof this.selectors];
    await this.clickElement(sortSelector);
    await this.waitForLoadingComplete();
  }

  /**
   * Select all tasks
   */
  async selectAllTasks(): Promise<void> {
    await this.checkCheckbox(this.selectors.selectAllCheckbox);
  }

  /**
   * Select specific task
   */
  async selectTask(title: string): Promise<void> {
    const taskItem = this.page.locator(this.selectors.taskItem).filter({ hasText: title });
    await taskItem.locator('input[type="checkbox"]').check();
  }

  /**
   * Bulk complete tasks
   */
  async bulkCompleteTasks(): Promise<void> {
    await this.clickElement(this.selectors.bulkActionsDropdown);
    await this.clickElement(this.selectors.bulkCompleteButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Bulk delete tasks
   */
  async bulkDeleteTasks(): Promise<void> {
    await this.clickElement(this.selectors.bulkActionsDropdown);
    await this.clickElement(this.selectors.bulkDeleteButton);
    await this.waitForElement(this.selectors.confirmDeleteModal);
    await this.clickElement(this.selectors.confirmDeleteButton);
    await this.waitForLoadingComplete();
  }

  /**
   * Switch to list view
   */
  async switchToListView(): Promise<void> {
    await this.clickElement(this.selectors.listViewButton);
    await this.waitForElement(this.selectors.tasksList);
  }

  /**
   * Switch to grid view
   */
  async switchToGridView(): Promise<void> {
    await this.clickElement(this.selectors.gridViewButton);
    await this.waitForElement(this.selectors.tasksList);
  }

  /**
   * Switch to kanban view
   */
  async switchToKanbanView(): Promise<void> {
    await this.clickElement(this.selectors.kanbanViewButton);
    await this.waitForElement(this.selectors.kanbanBoard);
  }

  /**
   * Get task count
   */
  async getTaskCount(): Promise<number> {
    const taskItems = this.page.locator(this.selectors.taskItem);
    return await taskItems.count();
  }

  /**
   * Verify tasks page is loaded
   */
  async verifyTasksPageLoaded(): Promise<void> {
    await this.expectElementVisible(this.selectors.tasksContainer);
    await this.expectElementVisible(this.selectors.tasksHeader);
    await this.expectElementVisible(this.selectors.createTaskButton);
  }

  /**
   * Verify task is displayed
   */
  async verifyTaskDisplayed(title: string): Promise<void> {
    const taskItem = this.page.locator(this.selectors.taskItem).filter({ hasText: title });
    await expect(taskItem).toBeVisible();
  }

  /**
   * Verify task is not displayed
   */
  async verifyTaskNotDisplayed(title: string): Promise<void> {
    const taskItem = this.page.locator(this.selectors.taskItem).filter({ hasText: title });
    await expect(taskItem).not.toBeVisible();
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
   * Take tasks page screenshot
   */
  async takeTasksScreenshot(): Promise<void> {
    await this.takeScreenshot('tasks-page');
  }

  /**
   * Wait for tasks to load
   */
  async waitForTasksToLoad(): Promise<void> {
    await this.waitForTasksPageLoad();
    await this.waitForElement(this.selectors.tasksList);
  }
}
