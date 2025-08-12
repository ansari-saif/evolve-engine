/**
 * Test data fixtures for E2E tests
 */
export const TestData = {
  users: {
    validUser: {
      email: 'test@example.com',
      password: 'TestPassword123!',
      name: 'Test User',
      role: 'user'
    },
    adminUser: {
      email: 'admin@example.com',
      password: 'AdminPassword123!',
      name: 'Admin User',
      role: 'admin'
    },
    invalidUser: {
      email: 'invalid@example.com',
      password: 'wrongpassword',
      name: 'Invalid User',
      role: 'user'
    }
  },
  
  tasks: {
    sampleTask: {
      title: 'Sample Task',
      description: 'This is a sample task for testing',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    },
    urgentTask: {
      title: 'Urgent Task',
      description: 'This is an urgent task that needs immediate attention',
      priority: 'high',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 day from now
    },
    completedTask: {
      title: 'Completed Task',
      description: 'This task has been completed',
      priority: 'low',
      status: 'completed',
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  },
  
  projects: {
    sampleProject: {
      name: 'Sample Project',
      description: 'A sample project for testing',
      status: 'active'
    },
    archivedProject: {
      name: 'Archived Project',
      description: 'An archived project',
      status: 'archived'
    }
  },
  
  settings: {
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: false,
      sms: false
    }
  }
};

/**
 * API response mocks
 */
export const MockResponses = {
  auth: {
    login: {
      success: {
        token: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User'
        }
      },
      failure: {
        error: 'Invalid credentials'
      }
    }
  },
  
  tasks: {
    list: {
      success: [
        {
          id: 1,
          title: 'Sample Task',
          description: 'This is a sample task',
          priority: 'medium',
          status: 'pending'
        }
      ]
    }
  }
};
