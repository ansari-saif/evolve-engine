/**
 * Data generation helper functions for E2E tests
 */
export class DataHelpers {
  /**
   * Generate a random string of specified length
   */
  static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate a random email address
   */
  static generateRandomEmail(): string {
    const username = this.generateRandomString(8);
    const domain = this.generateRandomString(6);
    return `${username}@${domain}.com`;
  }

  /**
   * Generate a random name
   */
  static generateRandomName(): string {
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma', 'Alex', 'Maria'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  }

  /**
   * Generate a random password
   */
  static generateRandomPassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    
    // Ensure at least one character from each category
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    // Fill the rest with random characters
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 4; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle the password using Fisher-Yates algorithm
    const passwordArray = password.split('');
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    
    return passwordArray.join('');
  }

  /**
   * Generate a random phone number
   */
  static generateRandomPhoneNumber(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100; // 100-999
    const prefix = Math.floor(Math.random() * 900) + 100; // 100-999
    const lineNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  }

  /**
   * Generate a random date within a range
   */
  static generateRandomDate(startDate: Date = new Date(), endDate: Date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)): Date {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
  }

  /**
   * Generate a random date string in ISO format
   */
  static generateRandomDateString(startDate?: Date, endDate?: Date): string {
    return this.generateRandomDate(startDate, endDate).toISOString();
  }

  /**
   * Generate a random task title
   */
  static generateRandomTaskTitle(): string {
    const prefixes = ['Complete', 'Review', 'Update', 'Create', 'Implement', 'Test', 'Fix', 'Optimize', 'Design', 'Plan'];
    const subjects = ['user interface', 'database schema', 'API endpoint', 'documentation', 'test suite', 'deployment script', 'security feature', 'performance optimization', 'bug fix', 'feature implementation'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    
    return `${prefix} ${subject}`;
  }

  /**
   * Generate a random task description
   */
  static generateRandomTaskDescription(): string {
    const descriptions = [
      'This task involves implementing a new feature that will improve user experience.',
      'Review and update the existing codebase to ensure best practices are followed.',
      'Create comprehensive documentation for the new API endpoints.',
      'Test the application thoroughly to identify and fix any bugs.',
      'Optimize the database queries to improve performance.',
      'Design and implement a new user interface component.',
      'Update the deployment configuration for the production environment.',
      'Implement security measures to protect user data.',
      'Create automated tests for the new functionality.',
      'Plan and execute the migration to the new system architecture.'
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  /**
   * Generate a random priority level
   */
  static generateRandomPriority(): 'low' | 'medium' | 'high' {
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  }

  /**
   * Generate a random status
   */
  static generateRandomStatus(): 'pending' | 'in-progress' | 'completed' | 'cancelled' {
    const statuses: ('pending' | 'in-progress' | 'completed' | 'cancelled')[] = ['pending', 'in-progress', 'completed', 'cancelled'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  /**
   * Generate a random project name
   */
  static generateRandomProjectName(): string {
    const prefixes = ['E-commerce', 'Social Media', 'Task Management', 'Analytics', 'CRM', 'Learning', 'Healthcare', 'Finance', 'Travel', 'Entertainment'];
    const suffixes = ['Platform', 'Application', 'System', 'Dashboard', 'Portal', 'Suite', 'Hub', 'Center', 'Workspace', 'Studio'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${prefix} ${suffix}`;
  }

  /**
   * Generate a random user object
   */
  static generateRandomUser() {
    return {
      email: this.generateRandomEmail(),
      password: this.generateRandomPassword(),
      name: this.generateRandomName(),
      role: Math.random() > 0.8 ? 'admin' : 'user' as 'admin' | 'user'
    };
  }

  /**
   * Generate a random task object
   */
  static generateRandomTask() {
    return {
      title: this.generateRandomTaskTitle(),
      description: this.generateRandomTaskDescription(),
      priority: this.generateRandomPriority(),
      status: this.generateRandomStatus(),
      dueDate: this.generateRandomDateString()
    };
  }

  /**
   * Generate a random project object
   */
  static generateRandomProject() {
    return {
      name: this.generateRandomProjectName(),
      description: this.generateRandomTaskDescription(),
      status: Math.random() > 0.2 ? 'active' : 'archived' as 'active' | 'archived'
    };
  }

  /**
   * Generate multiple random users
   */
  static generateRandomUsers(count: number = 5) {
    return Array.from({ length: count }, () => this.generateRandomUser());
  }

  /**
   * Generate multiple random tasks
   */
  static generateRandomTasks(count: number = 10) {
    return Array.from({ length: count }, () => this.generateRandomTask());
  }

  /**
   * Generate multiple random projects
   */
  static generateRandomProjects(count: number = 3) {
    return Array.from({ length: count }, () => this.generateRandomProject());
  }

  /**
   * Generate a unique ID
   */
  static generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Generate a random color hex code
   */
  static generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  /**
   * Generate a random number within a range
   */
  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a random boolean
   */
  static generateRandomBoolean(): boolean {
    return Math.random() > 0.5;
  }

  /**
   * Generate a random array of items
   */
  static generateRandomArray<T>(generator: () => T, count: number): T[] {
    return Array.from({ length: count }, generator);
  }
}
