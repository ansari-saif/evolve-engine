import { expect, Locator } from '@playwright/test';

/**
 * Custom matchers for domain-specific assertions
 */
export class CustomMatchers {
  /**
   * Check if element has task priority styling
   */
  static async toHaveTaskPriority(locator: Locator, priority: 'low' | 'medium' | 'high'): Promise<void> {
    const priorityClasses = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high'
    };
    
    await expect(locator).toHaveClass(new RegExp(priorityClasses[priority]));
  }

  /**
   * Check if element has task status styling
   */
  static async toHaveTaskStatus(locator: Locator, status: 'pending' | 'in-progress' | 'completed' | 'cancelled'): Promise<void> {
    const statusClasses = {
      pending: 'status-pending',
      'in-progress': 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    
    await expect(locator).toHaveClass(new RegExp(statusClasses[status]));
  }

  /**
   * Check if element contains valid email format
   */
  static async toContainValidEmail(locator: Locator): Promise<void> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const text = await locator.textContent();
    expect(text).toMatch(emailRegex);
  }

  /**
   * Check if element contains valid date format
   */
  static async toContainValidDate(locator: Locator, format: 'ISO' | 'MM/DD/YYYY' | 'DD/MM/YYYY' = 'ISO'): Promise<void> {
    const text = await locator.textContent();
    
    let dateRegex: RegExp;
    switch (format) {
      case 'ISO':
        dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
        break;
      case 'MM/DD/YYYY':
        dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        break;
      case 'DD/MM/YYYY':
        dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        break;
      default:
        dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    }
    
    expect(text).toMatch(dateRegex);
  }

  /**
   * Check if element contains valid phone number format
   */
  static async toContainValidPhoneNumber(locator: Locator): Promise<void> {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    const text = await locator.textContent();
    expect(text).toMatch(phoneRegex);
  }

  /**
   * Check if element contains valid password strength
   */
  static async toContainStrongPassword(locator: Locator): Promise<void> {
    const text = await locator.textContent();
    // Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.<>?])[A-Za-z\d!@#$%^&*()_+\-=[\]{}|;:,.<>?]{8,}$/;
    expect(text).toMatch(strongPasswordRegex);
  }

  /**
   * Check if element is a valid task title
   */
  static async toBeValidTaskTitle(locator: Locator): Promise<void> {
    const text = await locator.textContent();
    // Task title should not be empty and should be reasonable length
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(0);
    expect(text!.length).toBeLessThanOrEqual(100);
  }

  /**
   * Check if element is a valid task description
   */
  static async toBeValidTaskDescription(locator: Locator): Promise<void> {
    const text = await locator.textContent();
    // Task description should not be empty and should be reasonable length
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(0);
    expect(text!.length).toBeLessThanOrEqual(1000);
  }

  /**
   * Check if element has proper accessibility attributes
   */
  static async toBeAccessible(locator: Locator): Promise<void> {
    // Check for aria-label or aria-labelledby
    const ariaLabel = await locator.getAttribute('aria-label');
    const ariaLabelledBy = await locator.getAttribute('aria-labelledby');
    
    if (!ariaLabel && !ariaLabelledBy) {
      // Check if element has text content or is an image with alt text
      const textContent = await locator.textContent();
      const tagName = await locator.evaluate(el => el.tagName.toLowerCase());
      
      if (tagName === 'img') {
        const altText = await locator.getAttribute('alt');
        expect(altText).toBeTruthy();
      } else if (!textContent || textContent.trim() === '') {
        throw new Error('Element lacks accessibility attributes and has no text content');
      }
    }
  }

  /**
   * Check if element has proper focus management
   */
  static async toHaveProperFocus(locator: Locator): Promise<void> {
    // Check if element can receive focus
    const tabIndex = await locator.getAttribute('tabindex');
    const tagName = await locator.evaluate(el => el.tagName.toLowerCase());
    
    const focusableTags = ['button', 'input', 'select', 'textarea', 'a', 'area'];
    const isFocusable = focusableTags.includes(tagName) || tabIndex !== '-1';
    
    expect(isFocusable).toBe(true);
  }

  /**
   * Check if element has proper color contrast (basic check)
   */
  static async toHaveGoodContrast(locator: Locator): Promise<void> {
    const backgroundColor = await locator.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor;
    });
    
    const color = await locator.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.color;
    });
    
    // Basic check - ensure colors are different
    expect(backgroundColor).not.toBe(color);
  }

  /**
   * Check if element is responsive (has proper viewport behavior)
   */
  static async toBeResponsive(locator: Locator): Promise<void> {
    const hasResponsiveClasses = await locator.evaluate(el => {
      const classList = el.className;
      const responsiveClasses = ['responsive', 'mobile', 'tablet', 'desktop', 'sm:', 'md:', 'lg:', 'xl:'];
      return responsiveClasses.some(cls => classList.includes(cls));
    });
    
    // This is a basic check - in a real scenario you'd test different viewport sizes
    expect(hasResponsiveClasses).toBe(true);
  }

  /**
   * Check if element has proper loading state
   */
  static async toHaveLoadingState(locator: Locator): Promise<void> {
    const isLoading = await locator.evaluate(el => {
      return el.classList.contains('loading') || 
             el.getAttribute('aria-busy') === 'true' ||
             el.querySelector('[data-testid="loading-spinner"]') !== null;
    });
    
    expect(isLoading).toBe(true);
  }

  /**
   * Check if element has proper error state
   */
  static async toHaveErrorState(locator: Locator): Promise<void> {
    const hasError = await locator.evaluate(el => {
      return el.classList.contains('error') || 
             el.getAttribute('aria-invalid') === 'true' ||
             el.querySelector('[data-testid="error-message"]') !== null;
    });
    
    expect(hasError).toBe(true);
  }

  /**
   * Check if element has proper success state
   */
  static async toHaveSuccessState(locator: Locator): Promise<void> {
    const hasSuccess = await locator.evaluate(el => {
      return el.classList.contains('success') || 
             el.querySelector('[data-testid="success-message"]') !== null;
    });
    
    expect(hasSuccess).toBe(true);
  }

  /**
   * Check if element is properly disabled
   */
  static async toBeProperlyDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
    
    const ariaDisabled = await locator.getAttribute('aria-disabled');
    expect(ariaDisabled).toBe('true');
  }

  /**
   * Check if element has proper keyboard navigation
   */
  static async toHaveKeyboardNavigation(locator: Locator): Promise<void> {
    const hasKeyboardSupport = await locator.evaluate(el => {
      const tagName = el.tagName.toLowerCase();
      const hasOnKeyDown = el.onkeydown !== null;
      const hasOnKeyUp = el.onkeyup !== null;
      const hasOnKeyPress = el.onkeypress !== null;
      
      return hasOnKeyDown || hasOnKeyUp || hasOnKeyPress || ['button', 'input', 'select', 'textarea', 'a'].includes(tagName);
    });
    
    expect(hasKeyboardSupport).toBe(true);
  }

  /**
   * Check if element has proper ARIA attributes
   */
  static async toHaveAriaAttributes(locator: Locator): Promise<void> {
    const hasAriaAttributes = await locator.evaluate(el => {
      const attributes = el.getAttributeNames();
      return attributes.some(attr => attr.startsWith('aria-'));
    });
    
    expect(hasAriaAttributes).toBe(true);
  }

  /**
   * Check if element has proper role attribute
   */
  static async toHaveRole(locator: Locator, role: string): Promise<void> {
    const elementRole = await locator.getAttribute('role');
    expect(elementRole).toBe(role);
  }

  /**
   * Check if element has proper data attributes
   */
  static async toHaveDataAttributes(locator: Locator, attributes: string[]): Promise<void> {
    for (const attr of attributes) {
      const value = await locator.getAttribute(`data-${attr}`);
      expect(value).toBeTruthy();
    }
  }
}
