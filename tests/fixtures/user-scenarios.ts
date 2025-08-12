import { TestData } from './test-data';

/**
 * User scenarios for common workflows in E2E tests
 */
export const UserScenarios = {
  // Authentication scenarios
  auth: {
    successfulLogin: {
      description: 'User successfully logs in with valid credentials',
      steps: [
        'Navigate to login page',
        'Enter valid email and password',
        'Submit login form',
        'Verify successful redirect to dashboard',
        'Verify user profile is displayed'
      ],
      data: {
        user: TestData.users.validUser,
        expectedRedirect: '/dashboard'
      }
    },
    failedLogin: {
      description: 'User fails to log in with invalid credentials',
      steps: [
        'Navigate to login page',
        'Enter invalid email and password',
        'Submit login form',
        'Verify error message is displayed',
        'Verify user remains on login page'
      ],
      data: {
        user: TestData.users.invalidUser,
        expectedError: 'Invalid credentials'
      }
    },
    userRegistration: {
      description: 'New user successfully registers an account',
      steps: [
        'Navigate to registration page',
        'Fill out registration form with valid data',
        'Submit registration form',
        'Verify successful account creation',
        'Verify welcome message is displayed'
      ],
      data: {
        newUser: {
          email: 'newuser@example.com',
          password: 'NewPassword123!',
          name: 'New User'
        }
      }
    }
  },

  // Task management scenarios
  taskManagement: {
    createTask: {
      description: 'User creates a new task',
      steps: [
        'Navigate to tasks page',
        'Click "Create Task" button',
        'Fill out task form with valid data',
        'Submit task form',
        'Verify task appears in task list',
        'Verify task details are correct'
      ],
      data: {
        task: TestData.tasks.sampleTask
      }
    },
    editTask: {
      description: 'User edits an existing task',
      steps: [
        'Navigate to tasks page',
        'Find and click on existing task',
        'Click "Edit" button',
        'Modify task details',
        'Save changes',
        'Verify updated task details are displayed'
      ],
      data: {
        originalTask: TestData.tasks.sampleTask,
        updatedTask: {
          ...TestData.tasks.sampleTask,
          title: 'Updated Task Title',
          priority: 'high'
        }
      }
    },
    deleteTask: {
      description: 'User deletes a task',
      steps: [
        'Navigate to tasks page',
        'Find and click on existing task',
        'Click "Delete" button',
        'Confirm deletion in modal',
        'Verify task is removed from list',
        'Verify success message is displayed'
      ],
      data: {
        task: TestData.tasks.sampleTask
      }
    },
    filterTasks: {
      description: 'User filters tasks by various criteria',
      steps: [
        'Navigate to tasks page',
        'Apply priority filter (high)',
        'Verify only high priority tasks are shown',
        'Apply status filter (pending)',
        'Verify only pending tasks are shown',
        'Clear filters and verify all tasks are shown'
      ],
      data: {
        filters: {
          priority: 'high',
          status: 'pending'
        }
      }
    }
  },

  // Dashboard scenarios
  dashboard: {
    viewDashboard: {
      description: 'User views the main dashboard',
      steps: [
        'Navigate to dashboard',
        'Verify dashboard loads correctly',
        'Verify task summary is displayed',
        'Verify recent activity is shown',
        'Verify navigation menu is accessible'
      ],
      data: {
        expectedElements: [
          'task-summary',
          'recent-activity',
          'navigation-menu'
        ]
      }
    },
    dashboardNavigation: {
      description: 'User navigates between dashboard sections',
      steps: [
        'Navigate to dashboard',
        'Click on "Tasks" section',
        'Verify tasks page loads',
        'Click on "Projects" section',
        'Verify projects page loads',
        'Click on "Settings" section',
        'Verify settings page loads'
      ],
      data: {
        sections: ['tasks', 'projects', 'settings']
      }
    }
  },

  // Project management scenarios
  projectManagement: {
    createProject: {
      description: 'User creates a new project',
      steps: [
        'Navigate to projects page',
        'Click "Create Project" button',
        'Fill out project form',
        'Submit project form',
        'Verify project appears in project list',
        'Verify project details are correct'
      ],
      data: {
        project: TestData.projects.sampleProject
      }
    },
    archiveProject: {
      description: 'User archives an existing project',
      steps: [
        'Navigate to projects page',
        'Find and click on existing project',
        'Click "Archive" button',
        'Confirm archiving in modal',
        'Verify project status changes to archived',
        'Verify project moves to archived section'
      ],
      data: {
        project: TestData.projects.sampleProject
      }
    }
  },

  // Settings scenarios
  settings: {
    updateProfile: {
      description: 'User updates their profile information',
      steps: [
        'Navigate to settings page',
        'Click on "Profile" tab',
        'Update name and email',
        'Save changes',
        'Verify updated information is displayed',
        'Verify success message is shown'
      ],
      data: {
        updatedProfile: {
          name: 'Updated User Name',
          email: 'updated@example.com'
        }
      }
    },
    updatePreferences: {
      description: 'User updates their preferences',
      steps: [
        'Navigate to settings page',
        'Click on "Preferences" tab',
        'Change theme to light mode',
        'Update notification settings',
        'Save changes',
        'Verify preferences are applied',
        'Verify success message is shown'
      ],
      data: {
        updatedPreferences: {
          theme: 'light',
          notifications: {
            email: false,
            push: true
          }
        }
      }
    }
  }
};

/**
 * Helper function to get scenario by name
 */
export function getScenario(category: keyof typeof UserScenarios, scenario: string) {
  return UserScenarios[category][scenario as keyof typeof UserScenarios[typeof category]];
}

/**
 * Helper function to get all scenarios for a category
 */
export function getScenariosForCategory(category: keyof typeof UserScenarios) {
  return UserScenarios[category];
}

/**
 * Helper function to validate scenario data
 */
export function validateScenarioData(scenario: any) {
  return scenario && scenario.description && scenario.steps && scenario.data;
}
