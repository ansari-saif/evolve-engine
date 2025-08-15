# Page Object Model Architecture

This directory contains the Page Object Model (POM) implementation for the Evolve Engine E2E test suite. The POM pattern provides a structured approach to organizing test code by encapsulating page-specific logic and selectors.

## Architecture Overview

### BasePage
The `BasePage` class serves as the foundation for all page objects, providing common functionality:

- **Navigation**: Methods for navigating to pages and waiting for page loads
- **Element Interaction**: Click, fill, select, check/uncheck, hover, and keyboard operations
- **Element Verification**: Visibility, text, value, attribute, and state checks
- **Waiting**: Methods for waiting for elements, navigation, network requests, and loading states
- **Storage**: Local and session storage operations
- **Screenshots**: Taking screenshots for debugging and reporting

### Page Objects

#### DashboardPage
Handles interactions with the main dashboard:

- **Navigation**: Navigate to dashboard and other sections
- **User Profile**: Get user information and manage user menu
- **Task Summary**: Retrieve task statistics and summaries
- **Quick Actions**: Create tasks, projects, and view all items
- **Recent Activity**: Get and manage recent activities
- **Notifications**: Handle notification management
- **Search & Filter**: Search functionality and filter application

#### AuthPage
Manages authentication flows:

- **Login**: Complete login process with form filling and submission
- **Registration**: User registration with form validation
- **Password Reset**: Password reset and recovery flows
- **Social Login**: Integration with social authentication providers
- **Two-Factor Authentication**: 2FA setup and verification
- **Form Validation**: Error handling and validation checks

#### TasksPage
Handles task management functionality:

- **Task Creation**: Create new tasks with various attributes
- **Task Management**: Edit, delete, complete, and reopen tasks
- **Task Listing**: Get tasks, filter, sort, and search
- **Bulk Operations**: Select multiple tasks and perform bulk actions
- **Task Details**: View and manage task details
- **View Modes**: Switch between list, grid, and kanban views

#### SettingsPage
Manages user settings and preferences:

- **Profile Management**: Update user profile information
- **Account Settings**: Password changes and account management
- **Preferences**: Theme, language, timezone, and format settings
- **Notifications**: Configure notification preferences
- **Security**: Two-factor authentication and session management
- **Team Management**: Invite team members and manage roles
- **API Management**: Generate and manage API keys
- **Data Management**: Export and import data

## Usage Examples

### Basic Navigation
```typescript
import { DashboardPage, AuthPage } from '../utils/page-objects';

test('should navigate to dashboard after login', async ({ page }) => {
  const authPage = new AuthPage(page);
  const dashboardPage = new DashboardPage(page);

  await authPage.login('user@example.com', 'password');
  await dashboardPage.verifyDashboardLoaded();
});
```

### Task Management
```typescript
import { TasksPage } from '../utils/page-objects';

test('should create and manage tasks', async ({ page }) => {
  const tasksPage = new TasksPage(page);

  // Create a task
  await tasksPage.createTask({
    title: 'Test Task',
    description: 'This is a test task',
    priority: 'high',
    dueDate: '2024-01-01'
  });

  // Verify task was created
  const tasks = await tasksPage.getTasks();
  expect(tasks.find(t => t.title === 'Test Task')).toBeDefined();

  // Complete the task
  await tasksPage.completeTask('Test Task');
});
```

### Settings Management
```typescript
import { SettingsPage } from '../utils/page-objects';

test('should update user preferences', async ({ page }) => {
  const settingsPage = new SettingsPage(page);

  await settingsPage.updatePreferences({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC'
  });

  const successMessage = await settingsPage.getSuccessMessage();
  expect(successMessage).toContain('saved');
});
```

## Best Practices

### 1. Use data-testid Attributes
All page objects use `data-testid` attributes for element selection to ensure stability:

```typescript
// Good
private readonly selectors = {
  loginButton: '[data-testid="login-button"]',
  emailInput: '[data-testid="email-input"]'
};

// Avoid
private readonly selectors = {
  loginButton: '.btn-primary',
  emailInput: 'input[type="email"]'
};
```

### 2. Encapsulate Page Logic
Page objects should contain all page-specific logic and hide implementation details:

```typescript
// Good - encapsulates the login flow
async login(email: string, password: string): Promise<void> {
  await this.navigateToLogin();
  await this.fillLoginForm(email, password);
  await this.submitLoginForm();
}

// Avoid - exposes implementation details in tests
test('should login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-button"]');
});
```

### 3. Use Descriptive Method Names
Method names should clearly describe what they do:

```typescript
// Good
await dashboardPage.getTaskSummary();
await tasksPage.createTask(taskData);
await settingsPage.updateProfile(profileData);

// Avoid
await dashboardPage.getData();
await tasksPage.add(taskData);
await settingsPage.save(profileData);
```

### 4. Handle Loading States
Always wait for loading states to complete:

```typescript
// Good
async createTask(taskData: TaskData): Promise<void> {
  await this.clickCreateTask();
  await this.fillTaskForm(taskData);
  await this.saveTask();
  await this.waitForLoadingComplete();
}

// Avoid
async createTask(taskData: TaskData): Promise<void> {
  await this.clickCreateTask();
  await this.fillTaskForm(taskData);
  await this.saveTask();
  // Missing wait for loading
}
```

### 5. Provide Meaningful Error Messages
Use custom matchers and assertions for better error reporting:

```typescript
// Good
async verifyDashboardLoaded(): Promise<void> {
  await this.expectElementVisible(this.selectors.dashboardContainer);
  await this.expectElementVisible(this.selectors.taskSummary);
  await this.expectElementVisible(this.selectors.recentActivity);
}

// Avoid
async verifyDashboardLoaded(): Promise<void> {
  await this.page.waitForSelector(this.selectors.dashboardContainer);
}
```

## Testing the Page Objects

Run the page object tests to verify functionality:

```bash
# Run all page object tests
npx playwright test tests/utils/page-objects.test.ts

# Run specific test file
npx playwright test tests/e2e/page-objects-demo.spec.ts

# Run with specific browser
npx playwright test tests/utils/page-objects.test.ts --project=chromium
```

## Extending the Architecture

### Adding New Page Objects

1. Create a new page object class extending `BasePage`:
```typescript
import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class NewPage extends BasePage {
  private readonly selectors = {
    // Define selectors
  };

  constructor(page: Page) {
    super(page);
  }

  // Add page-specific methods
}
```

2. Add the page object to the index file:
```typescript
export { NewPage } from './new-page';
```

3. Create tests for the new page object:
```typescript
test.describe('NewPage', () => {
  test('should have expected functionality', async ({ page }) => {
    const newPage = new NewPage(page);
    // Test implementation
  });
});
```

### Adding New Base Functionality

1. Add methods to `BasePage`:
```typescript
async newBaseMethod(): Promise<void> {
  // Implementation
}
```

2. Update all page objects that need the new functionality
3. Add tests for the new base functionality

## Maintenance

### Updating Selectors
When UI changes occur:

1. Update the selectors in the relevant page object
2. Update any tests that depend on the changed selectors
3. Verify that all tests still pass

### Adding New Features
When new features are added:

1. Add new methods to the appropriate page object
2. Update the selectors object with new element selectors
3. Add comprehensive tests for the new functionality
4. Update documentation

### Performance Considerations
- Use efficient selectors (prefer `data-testid` over complex CSS selectors)
- Minimize the number of page interactions in each method
- Use appropriate waiting strategies to avoid flaky tests
- Consider using `page.locator()` for better performance with multiple elements

## Troubleshooting

### Common Issues

1. **Element Not Found**: Check that the `data-testid` attribute is present in the UI
2. **Timing Issues**: Ensure proper waiting strategies are implemented
3. **Flaky Tests**: Use stable selectors and appropriate waits
4. **Performance Issues**: Optimize selectors and reduce unnecessary page interactions

### Debugging

1. Use screenshots for debugging:
```typescript
await pageObject.takeScreenshot('debug-screenshot');
```

2. Add logging to page object methods:
```typescript
async clickElement(selector: string): Promise<void> {
  console.log(`Clicking element: ${selector}`);
  await this.page.click(selector);
}
```

3. Use Playwright's built-in debugging tools:
```bash
npx playwright test --debug
```

## Conclusion

The Page Object Model architecture provides a robust foundation for E2E testing by:

- **Improving Maintainability**: Centralizing page-specific logic
- **Enhancing Readability**: Making tests more descriptive and easier to understand
- **Reducing Duplication**: Sharing common functionality across tests
- **Increasing Stability**: Using stable selectors and proper waiting strategies
- **Facilitating Collaboration**: Providing a clear structure for team development

This architecture scales well as the application grows and provides a solid foundation for comprehensive E2E testing.
