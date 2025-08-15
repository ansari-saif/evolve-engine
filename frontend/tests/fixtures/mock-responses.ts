import { TestData } from './test-data';

/**
 * Mock API responses for E2E tests
 */
export const MockResponses = {
  auth: {
    login: {
      success: {
        status: 200,
        body: {
          token: 'mock-jwt-token-12345',
          user: {
            id: 1,
            email: TestData.users.validUser.email,
            name: TestData.users.validUser.name,
            role: TestData.users.validUser.role
          },
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      },
      failure: {
        status: 401,
        body: {
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        }
      },
      admin: {
        status: 200,
        body: {
          token: 'mock-admin-jwt-token-67890',
          user: {
            id: 2,
            email: TestData.users.adminUser.email,
            name: TestData.users.adminUser.name,
            role: TestData.users.adminUser.role
          },
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      }
    },
    register: {
      success: {
        status: 201,
        body: {
          message: 'User registered successfully',
          user: {
            id: 3,
            email: 'newuser@example.com',
            name: 'New User',
            role: 'user'
          }
        }
      },
      failure: {
        status: 400,
        body: {
          error: 'Email already exists',
          message: 'A user with this email already exists'
        }
      }
    },
    logout: {
      success: {
        status: 200,
        body: {
          message: 'Logged out successfully'
        }
      }
    }
  },
  
  tasks: {
    list: {
      success: {
        status: 200,
        body: {
          tasks: [
            {
              id: 1,
              ...TestData.tasks.sampleTask,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 2,
              ...TestData.tasks.urgentTask,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 3,
              ...TestData.tasks.completedTask,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          total: 3,
          page: 1,
          limit: 10
        }
      },
      empty: {
        status: 200,
        body: {
          tasks: [],
          total: 0,
          page: 1,
          limit: 10
        }
      }
    },
    create: {
      success: {
        status: 201,
        body: {
          id: 4,
          title: 'New Task',
          description: 'A newly created task',
          priority: 'medium',
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      failure: {
        status: 400,
        body: {
          error: 'Validation failed',
          message: 'Title is required'
        }
      }
    },
    update: {
      success: {
        status: 200,
        body: {
          id: 1,
          title: 'Updated Task',
          description: 'This task has been updated',
          priority: 'high',
          status: 'in-progress',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    },
    delete: {
      success: {
        status: 200,
        body: {
          message: 'Task deleted successfully'
        }
      },
      notFound: {
        status: 404,
        body: {
          error: 'Task not found',
          message: 'The requested task does not exist'
        }
      }
    }
  },
  
  projects: {
    list: {
      success: {
        status: 200,
        body: {
          projects: [
            {
              id: 1,
              ...TestData.projects.sampleProject,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 2,
              ...TestData.projects.archivedProject,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          total: 2
        }
      }
    }
  },
  
  user: {
    profile: {
      success: {
        status: 200,
        body: {
          id: 1,
          email: TestData.users.validUser.email,
          name: TestData.users.validUser.name,
          role: TestData.users.validUser.role,
          settings: TestData.settings,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    },
    settings: {
      success: {
        status: 200,
        body: {
          ...TestData.settings,
          updatedAt: new Date().toISOString()
        }
      }
    }
  }
};

/**
 * Helper function to create mock response with custom data
 */
export function createMockResponse(baseResponse: Record<string, unknown>, customData: Record<string, unknown> = {}) {
  return {
    ...baseResponse,
    body: {
      ...baseResponse.body,
      ...customData
    }
  };
}

/**
 * Helper function to create error response
 */
export function createErrorResponse(status: number, error: string, message?: string) {
  return {
    status,
    body: {
      error,
      message: message || error
    }
  };
}
