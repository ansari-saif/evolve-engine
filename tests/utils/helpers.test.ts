import { test, expect } from '@playwright/test';
import { DataHelpers, CustomMatchers } from './helpers';

test.describe('Helper Functions', () => {
  test.describe('DataHelpers', () => {
    test('should generate random string', () => {
      const randomString = DataHelpers.generateRandomString(10);
      expect(randomString).toHaveLength(10);
      expect(typeof randomString).toBe('string');
    });

    test('should generate random email', () => {
      const email = DataHelpers.generateRandomEmail();
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    test('should generate random name', () => {
      const name = DataHelpers.generateRandomName();
      expect(name).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
    });

    test('should generate strong password', () => {
      const password = DataHelpers.generateRandomPassword();
      expect(password).toMatch(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.<>?])[A-Za-z\d!@#$%^&*()_+\-=[\]{}|;:,.<>?]{12,}$/);
    });

    test('should generate random task', () => {
      const task = DataHelpers.generateRandomTask();
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('status');
      expect(task).toHaveProperty('dueDate');
      expect(['low', 'medium', 'high']).toContain(task.priority);
      expect(['pending', 'in-progress', 'completed', 'cancelled']).toContain(task.status);
    });

    test('should generate random user', () => {
      const user = DataHelpers.generateRandomUser();
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');
      expect(['admin', 'user']).toContain(user.role);
    });

    test('should generate unique ID', () => {
      const id1 = DataHelpers.generateUniqueId();
      const id2 = DataHelpers.generateUniqueId();
      expect(id1).not.toBe(id2);
    });

    test('should generate random number in range', () => {
      const number = DataHelpers.generateRandomNumber(1, 10);
      expect(number).toBeGreaterThanOrEqual(1);
      expect(number).toBeLessThanOrEqual(10);
    });

    test('should generate random boolean', () => {
      const bool = DataHelpers.generateRandomBoolean();
      expect(typeof bool).toBe('boolean');
    });
  });

  test.describe('CustomMatchers', () => {
    test('should validate email format', async ({ page }) => {
      await page.setContent('<div>test@example.com</div>');
      const locator = page.locator('div');
      await CustomMatchers.toContainValidEmail(locator);
    });

    test('should validate phone number format', async ({ page }) => {
      await page.setContent('<div>(123) 456-7890</div>');
      const locator = page.locator('div');
      await CustomMatchers.toContainValidPhoneNumber(locator);
    });

    test('should validate strong password', async ({ page }) => {
      await page.setContent('<div>StrongPass123!</div>');
      const locator = page.locator('div');
      await CustomMatchers.toContainStrongPassword(locator);
    });

    test('should validate task title', async ({ page }) => {
      await page.setContent('<div>Valid Task Title</div>');
      const locator = page.locator('div');
      await CustomMatchers.toBeValidTaskTitle(locator);
    });

    test('should validate task description', async ({ page }) => {
      await page.setContent('<div>This is a valid task description that is not too long.</div>');
      const locator = page.locator('div');
      await CustomMatchers.toBeValidTaskDescription(locator);
    });

    test('should check for accessibility attributes', async ({ page }) => {
      await page.setContent('<button aria-label="Submit form">Submit</button>');
      const locator = page.locator('button');
      await CustomMatchers.toBeAccessible(locator);
    });

    test('should check for proper focus management', async ({ page }) => {
      await page.setContent('<button>Click me</button>');
      const locator = page.locator('button');
      await CustomMatchers.toHaveProperFocus(locator);
    });

    test('should check for ARIA attributes', async ({ page }) => {
      await page.setContent('<div aria-label="Test element">Content</div>');
      const locator = page.locator('div');
      await CustomMatchers.toHaveAriaAttributes(locator);
    });

    test('should check for role attribute', async ({ page }) => {
      await page.setContent('<button role="button">Click me</button>');
      const locator = page.locator('button');
      await CustomMatchers.toHaveRole(locator, 'button');
    });

    test('should check for data attributes', async ({ page }) => {
      await page.setContent('<div data-testid="test-element" data-type="button">Content</div>');
      const locator = page.locator('div');
      await CustomMatchers.toHaveDataAttributes(locator, ['testid', 'type']);
    });
  });
});
