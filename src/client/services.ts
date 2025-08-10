import type { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";

import type {
  UserCreate,
  UserResponse,
  UserUpdate,
  GoalCreate,
  GoalResponse,
  GoalUpdate,
  BulkTaskCreate,
  CompletionStatusEnum,
  TaskCreate,
  TaskResponse,
  TaskUpdate,
  ProgressLogCreate,
  ProgressLogResponse,
  ProgressLogUpdate,
  AIContextCreate,
  AIContextResponse,
  AIContextUpdate,
  JobMetricsCreate,
  JobMetricsResponse,
  JobMetricsUpdate,
  CareerTransitionRequest,
  DailyTasksRequest,
  DeadlineReminderRequest,
  GoalsAnalysisRequest,
  MotivationRequest,
  PhaseTransitionRequest,
  WeeklyAnalysisRequest,
  DayLogBulkCreate,
  DayLogCreate,
  DayLogResponse,
  DayLogUpdate,
  LogCreate,
  LogResponse,
  PromptCreate,
  PromptResponse,
  PromptUpdate,
} from "./models";

export type UsersData = {
  CreateUserUsersPost: {
    requestBody: UserCreate;
  };
  ReadUsersUsersGet: {
    limit?: number;
    skip?: number;
  };
  ReadUserUsersTelegramIdGet: {
    telegramId: string;
  };
  UpdateUserUsersTelegramIdPut: {
    requestBody: UserUpdate;
    telegramId: string;
  };
  DeleteUserUsersTelegramIdDelete: {
    telegramId: string;
  };
  GetUserProfileUsersTelegramIdProfileGet: {
    telegramId: string;
  };
};

export type GoalsData = {
  CreateGoalGoalsPost: {
    requestBody: GoalCreate;
  };
  ReadGoalsGoalsGet: {
    limit?: number;
    skip?: number;
    userId?: string | null;
  };
  ReadGoalGoalsGoalIdGet: {
    goalId: number;
  };
  UpdateGoalGoalsGoalIdPut: {
    goalId: number;
    requestBody: GoalUpdate;
  };
  DeleteGoalGoalsGoalIdDelete: {
    goalId: number;
  };
  GetUserGoalsGoalsUserUserIdGet: {
    userId: string;
  };
  GetUserPendingGoalsGoalsUserUserIdPendingGet: {
    userId: string;
  };
};

export type TasksData = {
  CreateTaskTasksPost: {
    requestBody: TaskCreate;
  };
  ReadTasksTasksGet: {
    completionStatus?: CompletionStatusEnum | null;
    goalId?: number | null;
    limit?: number;
    skip?: number;
    userId?: string | null;
  };
  ReadTaskTasksTaskIdGet: {
    taskId: number;
  };
  UpdateTaskTasksTaskIdPut: {
    requestBody: TaskUpdate;
    taskId: number;
  };
  DeleteTaskTasksTaskIdDelete: {
    taskId: number;
  };
  GetUserPendingTasksTasksUserUserIdPendingGet: {
    userId: string;
  };
  GetUserTasksTasksUserUserIdGet: {
    userId: string;
  };
  GetUserTodayTasksTasksUserUserIdTodayGet: {
    userId: string;
  };
  CompleteTaskTasksTaskIdCompletePatch: {
    taskId: number;
  };
  CreateBulkTasksTasksBulkPost: {
    requestBody: BulkTaskCreate;
  };
};

export type ProgressLogsData = {
  CreateProgressLogProgressLogsPost: {
    requestBody: ProgressLogCreate;
  };
  ReadProgressLogsProgressLogsGet: {
    endDate?: string | null;
    limit?: number;
    skip?: number;
    startDate?: string | null;
    userId?: string | null;
  };
  ReadProgressLogProgressLogsLogIdGet: {
    logId: number;
  };
  UpdateProgressLogProgressLogsLogIdPut: {
    logId: number;
    requestBody: ProgressLogUpdate;
  };
  DeleteProgressLogProgressLogsLogIdDelete: {
    logId: number;
  };
  GetUserProgressLogsProgressLogsUserUserIdGet: {
    userId: string;
  };
  GetUserRecentProgressLogsProgressLogsUserUserIdRecentGet: {
    days?: number;
    userId: string;
  };
  GetUserProgressStatsProgressLogsUserUserIdStatsGet: {
    days?: number;
    userId: string;
  };
  GenerateProgressLogProgressLogsGenerateUserIdPost: {
    date?: string | null;
    userId: string;
  };
};

export type AiContextData = {
  CreateAiContextAiContextPost: {
    requestBody: AIContextCreate;
  };
  GetAiContextAiContextContextIdGet: {
    contextId: number;
  };
  UpdateAiContextAiContextContextIdPut: {
    contextId: number;
    requestBody: AIContextUpdate;
  };
  DeleteAiContextAiContextContextIdDelete: {
    contextId: number;
  };
  GetAiContextByUserAiContextUserUserIdGet: {
    userId: string;
  };
};

export type JobMetricsData = {
  CreateJobMetricsJobMetricsPost: {
    requestBody: JobMetricsCreate;
  };
  ReadJobMetricsJobMetricsGet: {
    limit?: number;
    skip?: number;
    userId?: string | null;
  };
  ReadJobMetricJobMetricsMetricIdGet: {
    metricId: number;
  };
  UpdateJobMetricsJobMetricsMetricIdPut: {
    metricId: number;
    requestBody: JobMetricsUpdate;
  };
  DeleteJobMetricsJobMetricsMetricIdDelete: {
    metricId: number;
  };
  GetUserJobMetricsJobMetricsUserUserIdGet: {
    userId: string;
  };
  GenerateJobMetricsForUserJobMetricsUserUserIdGeneratePost: {
    userId: string;
  };
  UpdateFinancialMetricsJobMetricsUserUserIdFinancialPatch: {
    requestBody: Record<string, unknown>;
    userId: string;
  };
  GetFinancialAnalysisJobMetricsUserUserIdAnalysisGet: {
    userId: string;
  };
  AnalyzeMetricsWithAiJobMetricsMetricIdAnalyzePost: {
    metricId: number;
  };
};

export type AiServiceData = {
  GenerateDailyTasksEndpointAiDailyTasksPost: {
    requestBody: DailyTasksRequest;
  };
  GenerateMotivationAiMotivationPost: {
    requestBody: MotivationRequest;
  };
  GenerateDeadlineReminderAiDeadlineReminderPost: {
    requestBody: DeadlineReminderRequest;
  };
  GenerateWeeklyAnalysisAiWeeklyAnalysisPost: {
    requestBody: WeeklyAnalysisRequest;
  };
  EvaluatePhaseTransitionAiPhaseTransitionPost: {
    requestBody: PhaseTransitionRequest;
  };
  AnalyzeGoalsAiAnalyzeGoalsPost: {
    requestBody: GoalsAnalysisRequest;
  };
  AnalyzeCareerTransitionAiCareerTransitionPost: {
    requestBody: CareerTransitionRequest;
  };
  GenerateCompleteUserAnalysisAiUserUserIdCompleteAnalysisPost: {
    userId: string;
  };
};

export type DayLogsData = {
  CreateDayLogEndpointDayLogsPost: {
    requestBody: DayLogCreate;
  };
  GetDayLogDayLogsLogIdGet: {
    logId: number;
  };
  UpdateDayLogEndpointDayLogsLogIdPatch: {
    logId: number;
    requestBody: DayLogUpdate;
  };
  DeleteDayLogEndpointDayLogsLogIdDelete: {
    logId: number;
  };
  GetUserDayLogsDayLogsUserUserIdGet: {
    limit?: number;
    location?: string;
    skip?: number;
    userId: string;
    weather?: string;
  };
  GetUserDayLogByDateDayLogsUserUserIdDateDateGet: {
    date: string;
    userId: string;
  };
  GetUserDayLogsByDateRangeDayLogsUserUserIdRangeGet: {
    endDate: string;
    location?: string;
    startDate: string;
    userId: string;
  };
  GetUserDayLogStatsDayLogsUserUserIdStatsGet: {
    userId: string;
  };
  CreateBulkDayLogsEndpointDayLogsBulkPost: {
    requestBody: DayLogBulkCreate;
  };
  GenerateDayLogDayLogsGenerateUserIdPost: {
    dateValue?: string | null;
    userId: string;
  };
};

export type LogData = {
  CreateLogEndpointLogPost: {
    requestBody: LogCreate;
  };
  ListLogsEndpointLogGet: {
    limit?: number;
    skip?: number;
  };
  GetLogEndpointLogLogIdGet: {
    logId: number;
  };
};

export type PromptsData = {
  CreatePromptPromptsPost: {
    requestBody: PromptCreate;
  };
  GetUserPromptsPromptsUserUserIdGet: {
    userId: string;
  };
  GetPromptPromptsPromptIdGet: {
    promptId: string;
  };
  UpdatePromptPromptsPromptIdPatch: {
    promptId: string;
    requestBody: PromptUpdate;
  };
};

export type DefaultData = {};

export class UsersService {
  /**
   * Create User
   * Create a new user.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static createUserUsersPost(
    data: UsersData["CreateUserUsersPost"]
  ): CancelablePromise<UserResponse> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/users/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Users
   * Get all users with pagination.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static readUsersUsersGet(
    data: UsersData["ReadUsersUsersGet"] = {}
  ): CancelablePromise<Array<UserResponse>> {
    const { skip = 0, limit = 100 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/users/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read User
   * Get a specific user by telegram_id.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static readUserUsersTelegramIdGet(
    data: UsersData["ReadUserUsersTelegramIdGet"]
  ): CancelablePromise<UserResponse> {
    const { telegramId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/users/{telegram_id}",
      path: {
        telegram_id: telegramId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update User
   * Update a user.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static updateUserUsersTelegramIdPut(
    data: UsersData["UpdateUserUsersTelegramIdPut"]
  ): CancelablePromise<UserResponse> {
    const { telegramId, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/users/{telegram_id}",
      path: {
        telegram_id: telegramId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete User
   * Delete a user.
   * @returns void Successful Response
   * @throws ApiError
   */
  public static deleteUserUsersTelegramIdDelete(
    data: UsersData["DeleteUserUsersTelegramIdDelete"]
  ): CancelablePromise<void> {
    const { telegramId } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/users/{telegram_id}",
      path: {
        telegram_id: telegramId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Profile
   * Get user profile with all relationships.
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static getUserProfileUsersTelegramIdProfileGet(
    data: UsersData["GetUserProfileUsersTelegramIdProfileGet"]
  ): CancelablePromise<UserResponse> {
    const { telegramId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/users/{telegram_id}/profile",
      path: {
        telegram_id: telegramId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class GoalsService {
  /**
   * Create Goal
   * Create a new goal.
   * @returns GoalResponse Successful Response
   * @throws ApiError
   */
  public static createGoalGoalsPost(
    data: GoalsData["CreateGoalGoalsPost"]
  ): CancelablePromise<GoalResponse> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/goals/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Goals
   * Get all goals with optional user filtering.
   * @returns GoalResponse Successful Response
   * @throws ApiError
   */
  public static readGoalsGoalsGet(
    data: GoalsData["ReadGoalsGoalsGet"] = {}
  ): CancelablePromise<Array<GoalResponse>> {
    const { skip = 0, limit = 100, userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/goals/",
      query: {
        skip,
        limit,
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Goal
   * Get a specific goal by ID.
   * @returns GoalResponse Successful Response
   * @throws ApiError
   */
  public static readGoalGoalsGoalIdGet(
    data: GoalsData["ReadGoalGoalsGoalIdGet"]
  ): CancelablePromise<GoalResponse> {
    const { goalId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/goals/{goal_id}",
      path: {
        goal_id: goalId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Goal
   * Update a goal.
   * @returns GoalResponse Successful Response
   * @throws ApiError
   */
  public static updateGoalGoalsGoalIdPut(
    data: GoalsData["UpdateGoalGoalsGoalIdPut"]
  ): CancelablePromise<GoalResponse> {
    const { goalId, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/goals/{goal_id}",
      path: {
        goal_id: goalId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Goal
   * Delete a goal.
   * @returns void Successful Response
   * @throws ApiError
   */
  public static deleteGoalGoalsGoalIdDelete(
    data: GoalsData["DeleteGoalGoalsGoalIdDelete"]
  ): CancelablePromise<void> {
    const { goalId } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/goals/{goal_id}",
      path: {
        goal_id: goalId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Goals
   * Get all goals for a specific user.
   * @returns GoalResponse Successful Response
   * @throws ApiError
   */
  public static getUserGoalsGoalsUserUserIdGet(
    data: GoalsData["GetUserGoalsGoalsUserUserIdGet"]
  ): CancelablePromise<Array<GoalResponse>> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/goals/user/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Pending Goals
   * Get all pending goals for a specific user.
   * @returns GoalResponse Successful Response
   * @throws ApiError
   */
  public static getUserPendingGoalsGoalsUserUserIdPendingGet(
    data: GoalsData["GetUserPendingGoalsGoalsUserUserIdPendingGet"]
  ): CancelablePromise<Array<GoalResponse>> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/goals/user/{user_id}/pending",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class TasksService {
  /**
   * Create Task
   * Create a new task.
   * @returns TaskResponse Successful Response
   * @throws ApiError
   */
  public static createTaskTasksPost(
    data: TasksData["CreateTaskTasksPost"]
  ): CancelablePromise<TaskResponse> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/tasks/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Tasks
   * Get all tasks with optional filtering.
   * @returns TaskResponse Successful Response
   * @throws ApiError
   */
  public static readTasksTasksGet(
    data: TasksData["ReadTasksTasksGet"] = {}
  ): CancelablePromise<Array<TaskResponse>> {
    const { skip = 0, limit = 100, userId, goalId, completionStatus } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/tasks/",
      query: {
        skip,
        limit,
        user_id: userId,
        goal_id: goalId,
        completion_status: completionStatus,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Task
   * Get a specific task by ID.
   * @returns TaskResponse Successful Response
   * @throws ApiError
   */
  public static readTaskTasksTaskIdGet(
    data: TasksData["ReadTaskTasksTaskIdGet"]
  ): CancelablePromise<TaskResponse> {
    const { taskId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/tasks/{task_id}",
      path: {
        task_id: taskId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Task
   * Update a task.
   * @returns TaskResponse Successful Response
   * @throws ApiError
   */
  public static updateTaskTasksTaskIdPut(
    data: TasksData["UpdateTaskTasksTaskIdPut"]
  ): CancelablePromise<TaskResponse> {
    const { taskId, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/tasks/{task_id}",
      path: {
        task_id: taskId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Task
   * Delete a task.
   * @returns void Successful Response
   * @throws ApiError
   */
  public static deleteTaskTasksTaskIdDelete(
    data: TasksData["DeleteTaskTasksTaskIdDelete"]
  ): CancelablePromise<void> {
    const { taskId } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/tasks/{task_id}",
      path: {
        task_id: taskId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Pending Tasks
   * Get all pending tasks for a specific user.
   * @returns TaskResponse Successful Response
   * @throws ApiError
   */
  public static getUserPendingTasksTasksUserUserIdPendingGet(
    data: TasksData["GetUserPendingTasksTasksUserUserIdPendingGet"]
  ): CancelablePromise<Array<TaskResponse>> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/tasks/user/{user_id}/pending",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Tasks
   * Get all tasks for a specific user.
   * @returns TaskResponse Successful Response
   * @throws ApiError
   */
  public static getUserTasksTasksUserUserIdGet(
    data: TasksData["GetUserTasksTasksUserUserIdGet"]
  ): CancelablePromise<Array<TaskResponse>> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/tasks/user/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Today Tasks
   * Get today's tasks for a specific user based on scheduled_for_date only.
   * @returns TaskResponse Successful Response
   * @throws ApiError
   */
  public static getUserTodayTasksTasksUserUserIdTodayGet(
    data: TasksData["GetUserTodayTasksTasksUserUserIdTodayGet"]
  ): CancelablePromise<Array<TaskResponse>> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/tasks/user/{user_id}/today",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Complete Task
   * Mark a task as completed.
   * @returns TaskResponse Successful Response
   * @throws ApiError
   */
  public static completeTaskTasksTaskIdCompletePatch(
    data: TasksData["CompleteTaskTasksTaskIdCompletePatch"]
  ): CancelablePromise<TaskResponse> {
    const { taskId } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/tasks/{task_id}/complete",
      path: {
        task_id: taskId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Bulk Tasks
   * Create multiple tasks in a single request.
   * @returns TaskResponse Successful Response
   * @throws ApiError
   */
  public static createBulkTasksTasksBulkPost(
    data: TasksData["CreateBulkTasksTasksBulkPost"]
  ): CancelablePromise<Array<TaskResponse>> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/tasks/bulk",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class ProgressLogsService {
  /**
   * Create Progress Log
   * Create a new progress log entry.
   * @returns ProgressLogResponse Successful Response
   * @throws ApiError
   */
  public static createProgressLogProgressLogsPost(
    data: ProgressLogsData["CreateProgressLogProgressLogsPost"]
  ): CancelablePromise<ProgressLogResponse> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/progress-logs/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Progress Logs
   * Get all progress logs with optional filtering.
   * @returns ProgressLogResponse Successful Response
   * @throws ApiError
   */
  public static readProgressLogsProgressLogsGet(
    data: ProgressLogsData["ReadProgressLogsProgressLogsGet"] = {}
  ): CancelablePromise<Array<ProgressLogResponse>> {
    const { skip = 0, limit = 100, userId, startDate, endDate } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/progress-logs/",
      query: {
        skip,
        limit,
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Progress Log
   * Get a specific progress log by ID.
   * @returns ProgressLogResponse Successful Response
   * @throws ApiError
   */
  public static readProgressLogProgressLogsLogIdGet(
    data: ProgressLogsData["ReadProgressLogProgressLogsLogIdGet"]
  ): CancelablePromise<ProgressLogResponse> {
    const { logId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/progress-logs/{log_id}",
      path: {
        log_id: logId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Progress Log
   * Update a progress log.
   * @returns ProgressLogResponse Successful Response
   * @throws ApiError
   */
  public static updateProgressLogProgressLogsLogIdPut(
    data: ProgressLogsData["UpdateProgressLogProgressLogsLogIdPut"]
  ): CancelablePromise<ProgressLogResponse> {
    const { logId, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/progress-logs/{log_id}",
      path: {
        log_id: logId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Progress Log
   * Delete a progress log.
   * @returns void Successful Response
   * @throws ApiError
   */
  public static deleteProgressLogProgressLogsLogIdDelete(
    data: ProgressLogsData["DeleteProgressLogProgressLogsLogIdDelete"]
  ): CancelablePromise<void> {
    const { logId } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/progress-logs/{log_id}",
      path: {
        log_id: logId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Progress Logs
   * Get all progress logs for a specific user.
   * @returns ProgressLogResponse Successful Response
   * @throws ApiError
   */
  public static getUserProgressLogsProgressLogsUserUserIdGet(
    data: ProgressLogsData["GetUserProgressLogsProgressLogsUserUserIdGet"]
  ): CancelablePromise<Array<ProgressLogResponse>> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/progress-logs/user/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Recent Progress Logs
   * Get recent progress logs for a specific user.
   * @returns ProgressLogResponse Successful Response
   * @throws ApiError
   */
  public static getUserRecentProgressLogsProgressLogsUserUserIdRecentGet(
    data: ProgressLogsData["GetUserRecentProgressLogsProgressLogsUserUserIdRecentGet"]
  ): CancelablePromise<Array<ProgressLogResponse>> {
    const { userId, days = 7 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/progress-logs/user/{user_id}/recent",
      path: {
        user_id: userId,
      },
      query: {
        days,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Progress Stats
   * Get progress statistics for a user over a specified period.
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static getUserProgressStatsProgressLogsUserUserIdStatsGet(
    data: ProgressLogsData["GetUserProgressStatsProgressLogsUserUserIdStatsGet"]
  ): CancelablePromise<Record<string, unknown>> {
    const { userId, days = 30 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/progress-logs/user/{user_id}/stats",
      path: {
        user_id: userId,
      },
      query: {
        days,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Generate Progress Log
   * Generate a progress log entry using AI based on user's activities, tasks, and metrics.
   * If date is not provided, generates for today.
   * @returns ProgressLogResponse Successful Response
   * @throws ApiError
   */
  public static generateProgressLogProgressLogsGenerateUserIdPost(
    data: ProgressLogsData["GenerateProgressLogProgressLogsGenerateUserIdPost"]
  ): CancelablePromise<ProgressLogResponse> {
    const { userId, date } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/progress-logs/generate/{user_id}",
      path: {
        user_id: userId,
      },
      query: {
        date,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class AiContextService {
  /**
   * Create Ai Context
   * @returns AIContextResponse Successful Response
   * @throws ApiError
   */
  public static createAiContextAiContextPost(
    data: AiContextData["CreateAiContextAiContextPost"]
  ): CancelablePromise<AIContextResponse> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/ai-context/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Ai Context
   * @returns AIContextResponse Successful Response
   * @throws ApiError
   */
  public static getAiContextAiContextContextIdGet(
    data: AiContextData["GetAiContextAiContextContextIdGet"]
  ): CancelablePromise<AIContextResponse> {
    const { contextId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/ai-context/{context_id}",
      path: {
        context_id: contextId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Ai Context
   * @returns AIContextResponse Successful Response
   * @throws ApiError
   */
  public static updateAiContextAiContextContextIdPut(
    data: AiContextData["UpdateAiContextAiContextContextIdPut"]
  ): CancelablePromise<AIContextResponse> {
    const { contextId, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/ai-context/{context_id}",
      path: {
        context_id: contextId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Ai Context
   * @returns void Successful Response
   * @throws ApiError
   */
  public static deleteAiContextAiContextContextIdDelete(
    data: AiContextData["DeleteAiContextAiContextContextIdDelete"]
  ): CancelablePromise<void> {
    const { contextId } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/ai-context/{context_id}",
      path: {
        context_id: contextId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Ai Context By User
   * @returns AIContextResponse Successful Response
   * @throws ApiError
   */
  public static getAiContextByUserAiContextUserUserIdGet(
    data: AiContextData["GetAiContextByUserAiContextUserUserIdGet"]
  ): CancelablePromise<AIContextResponse> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/ai-context/user/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class JobMetricsService {
  /**
   * Create Job Metrics
   * Create job metrics for a user.
   * @returns JobMetricsResponse Successful Response
   * @throws ApiError
   */
  public static createJobMetricsJobMetricsPost(
    data: JobMetricsData["CreateJobMetricsJobMetricsPost"]
  ): CancelablePromise<JobMetricsResponse> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/job-metrics/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Job Metrics
   * Get all job metrics with optional user filtering.
   * @returns JobMetricsResponse Successful Response
   * @throws ApiError
   */
  public static readJobMetricsJobMetricsGet(
    data: JobMetricsData["ReadJobMetricsJobMetricsGet"] = {}
  ): CancelablePromise<Array<JobMetricsResponse>> {
    const { skip = 0, limit = 100, userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/job-metrics/",
      query: {
        skip,
        limit,
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Read Job Metric
   * Get a specific job metric by ID.
   * @returns JobMetricsResponse Successful Response
   * @throws ApiError
   */
  public static readJobMetricJobMetricsMetricIdGet(
    data: JobMetricsData["ReadJobMetricJobMetricsMetricIdGet"]
  ): CancelablePromise<JobMetricsResponse> {
    const { metricId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/job-metrics/{metric_id}",
      path: {
        metric_id: metricId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Job Metrics
   * Update job metrics.
   * @returns JobMetricsResponse Successful Response
   * @throws ApiError
   */
  public static updateJobMetricsJobMetricsMetricIdPut(
    data: JobMetricsData["UpdateJobMetricsJobMetricsMetricIdPut"]
  ): CancelablePromise<JobMetricsResponse> {
    const { metricId, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: "/job-metrics/{metric_id}",
      path: {
        metric_id: metricId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Job Metrics
   * Delete job metrics.
   * @returns void Successful Response
   * @throws ApiError
   */
  public static deleteJobMetricsJobMetricsMetricIdDelete(
    data: JobMetricsData["DeleteJobMetricsJobMetricsMetricIdDelete"]
  ): CancelablePromise<void> {
    const { metricId } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/job-metrics/{metric_id}",
      path: {
        metric_id: metricId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Job Metrics
   * Get job metrics for a specific user.
   * @returns JobMetricsResponse Successful Response
   * @throws ApiError
   */
  public static getUserJobMetricsJobMetricsUserUserIdGet(
    data: JobMetricsData["GetUserJobMetricsJobMetricsUserUserIdGet"]
  ): CancelablePromise<JobMetricsResponse> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/job-metrics/user/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Generate Job Metrics For User
   * Generate initial JobMetrics for a user using AI when none exist.
   * @returns JobMetricsResponse Successful Response
   * @throws ApiError
   */
  public static generateJobMetricsForUserJobMetricsUserUserIdGeneratePost(
    data: JobMetricsData["GenerateJobMetricsForUserJobMetricsUserUserIdGeneratePost"]
  ): CancelablePromise<JobMetricsResponse> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/job-metrics/user/{user_id}/generate",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Financial Metrics
   * Update financial metrics for a user.
   * @returns JobMetricsResponse Successful Response
   * @throws ApiError
   */
  public static updateFinancialMetricsJobMetricsUserUserIdFinancialPatch(
    data: JobMetricsData["UpdateFinancialMetricsJobMetricsUserUserIdFinancialPatch"]
  ): CancelablePromise<JobMetricsResponse> {
    const { userId, requestBody } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/job-metrics/user/{user_id}/financial",
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Financial Analysis
   * Get financial analysis and recommendations for a user.
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static getFinancialAnalysisJobMetricsUserUserIdAnalysisGet(
    data: JobMetricsData["GetFinancialAnalysisJobMetricsUserUserIdAnalysisGet"]
  ): CancelablePromise<Record<string, unknown>> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/job-metrics/user/{user_id}/analysis",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Analyze Metrics With Ai
   * Analyze job metrics using AI to provide comprehensive insights and recommendations.
   * @returns JobMetricsResponse Successful Response
   * @throws ApiError
   */
  public static analyzeMetricsWithAiJobMetricsMetricIdAnalyzePost(
    data: JobMetricsData["AnalyzeMetricsWithAiJobMetricsMetricIdAnalyzePost"]
  ): CancelablePromise<JobMetricsResponse> {
    const { metricId } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/job-metrics/{metric_id}/analyze",
      path: {
        metric_id: metricId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class AiServiceService {
  /**
   * Generate Daily Tasks Endpoint
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static generateDailyTasksEndpointAiDailyTasksPost(
    data: AiServiceData["GenerateDailyTasksEndpointAiDailyTasksPost"]
  ): CancelablePromise<Array<Record<string, unknown>>> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/ai/daily-tasks",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Generate Motivation
   * Generate AI-powered motivation message for a user.
   * @returns string Successful Response
   * @throws ApiError
   */
  public static generateMotivationAiMotivationPost(
    data: AiServiceData["GenerateMotivationAiMotivationPost"]
  ): CancelablePromise<string> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/ai/motivation",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Generate Deadline Reminder
   * Generate AI-powered deadline reminder for a task.
   * @returns string Successful Response
   * @throws ApiError
   */
  public static generateDeadlineReminderAiDeadlineReminderPost(
    data: AiServiceData["GenerateDeadlineReminderAiDeadlineReminderPost"]
  ): CancelablePromise<string> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/ai/deadline-reminder",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Generate Weekly Analysis
   * Generate AI-powered weekly analysis for a user.
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static generateWeeklyAnalysisAiWeeklyAnalysisPost(
    data: AiServiceData["GenerateWeeklyAnalysisAiWeeklyAnalysisPost"]
  ): CancelablePromise<Record<string, unknown>> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/ai/weekly-analysis",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Evaluate Phase Transition
   * Evaluate phase transition readiness for a user.
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static evaluatePhaseTransitionAiPhaseTransitionPost(
    data: AiServiceData["EvaluatePhaseTransitionAiPhaseTransitionPost"]
  ): CancelablePromise<Record<string, unknown>> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/ai/phase-transition",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Analyze Goals
   * Analyze goals progress and provide strategic insights.
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static analyzeGoalsAiAnalyzeGoalsPost(
    data: AiServiceData["AnalyzeGoalsAiAnalyzeGoalsPost"]
  ): CancelablePromise<Record<string, unknown>> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/ai/analyze-goals",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Analyze Career Transition
   * Analyze career transition readiness for a user.
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static analyzeCareerTransitionAiCareerTransitionPost(
    data: AiServiceData["AnalyzeCareerTransitionAiCareerTransitionPost"]
  ): CancelablePromise<Record<string, unknown>> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/ai/career-transition",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Generate Complete User Analysis
   * Generate a complete AI analysis for a user combining all agents.
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static generateCompleteUserAnalysisAiUserUserIdCompleteAnalysisPost(
    data: AiServiceData["GenerateCompleteUserAnalysisAiUserUserIdCompleteAnalysisPost"]
  ): CancelablePromise<Record<string, unknown>> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/ai/user/{user_id}/complete-analysis",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class DayLogsService {
  /**
   * Create Day Log Endpoint
   * Create a new day log entry.
   * @returns DayLogResponse Successful Response
   * @throws ApiError
   */
  public static createDayLogEndpointDayLogsPost(
    data: DayLogsData["CreateDayLogEndpointDayLogsPost"]
  ): CancelablePromise<DayLogResponse> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/day-logs/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Day Log
   * Get a specific day log entry by ID.
   * @returns DayLogResponse Successful Response
   * @throws ApiError
   */
  public static getDayLogDayLogsLogIdGet(
    data: DayLogsData["GetDayLogDayLogsLogIdGet"]
  ): CancelablePromise<DayLogResponse> {
    const { logId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/day-logs/{log_id}",
      path: {
        log_id: logId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Day Log Endpoint
   * Update a day log entry.
   * @returns DayLogResponse Successful Response
   * @throws ApiError
   */
  public static updateDayLogEndpointDayLogsLogIdPatch(
    data: DayLogsData["UpdateDayLogEndpointDayLogsLogIdPatch"]
  ): CancelablePromise<DayLogResponse> {
    const { logId, requestBody } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/day-logs/{log_id}",
      path: {
        log_id: logId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Day Log Endpoint
   * Delete a day log entry.
   * @returns void Successful Response
   * @throws ApiError
   */
  public static deleteDayLogEndpointDayLogsLogIdDelete(
    data: DayLogsData["DeleteDayLogEndpointDayLogsLogIdDelete"]
  ): CancelablePromise<void> {
    const { logId } = data;
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/day-logs/{log_id}",
      path: {
        log_id: logId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Day Logs
   * Get all day logs for a specific user with optional filtering.
   * @returns DayLogResponse Successful Response
   * @throws ApiError
   */
  public static getUserDayLogsDayLogsUserUserIdGet(
    data: DayLogsData["GetUserDayLogsDayLogsUserUserIdGet"]
  ): CancelablePromise<Array<DayLogResponse>> {
    const { userId, skip = 0, limit = 10, location, weather } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/day-logs/user/{user_id}",
      path: {
        user_id: userId,
      },
      query: {
        skip,
        limit,
        location,
        weather,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Day Log By Date
   * Get a user's day log for a specific date.
   * @returns DayLogResponse Successful Response
   * @throws ApiError
   */
  public static getUserDayLogByDateDayLogsUserUserIdDateDateGet(
    data: DayLogsData["GetUserDayLogByDateDayLogsUserUserIdDateDateGet"]
  ): CancelablePromise<DayLogResponse> {
    const { userId, date } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/day-logs/user/{user_id}/date/{date}",
      path: {
        user_id: userId,
        date,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Day Logs By Date Range
   * Get user's day logs within a date range.
   * @returns DayLogResponse Successful Response
   * @throws ApiError
   */
  public static getUserDayLogsByDateRangeDayLogsUserUserIdRangeGet(
    data: DayLogsData["GetUserDayLogsByDateRangeDayLogsUserUserIdRangeGet"]
  ): CancelablePromise<Array<DayLogResponse>> {
    const { userId, startDate, endDate, location } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/day-logs/user/{user_id}/range",
      path: {
        user_id: userId,
      },
      query: {
        start_date: startDate,
        end_date: endDate,
        location,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Day Log Stats
   * Get statistics about user's day logs.
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static getUserDayLogStatsDayLogsUserUserIdStatsGet(
    data: DayLogsData["GetUserDayLogStatsDayLogsUserUserIdStatsGet"]
  ): CancelablePromise<unknown> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/day-logs/user/{user_id}/stats",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Create Bulk Day Logs Endpoint
   * Create multiple day log entries for a user.
   * @returns DayLogResponse Successful Response
   * @throws ApiError
   */
  public static createBulkDayLogsEndpointDayLogsBulkPost(
    data: DayLogsData["CreateBulkDayLogsEndpointDayLogsBulkPost"]
  ): CancelablePromise<Array<DayLogResponse>> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/day-logs/bulk",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Generate Day Log
   * Generate a DayLog using AI for the given user and optional date (defaults to today).
   * Fills the narrative fields (summary, highlights, challenges, learnings, gratitude, tomorrow_plan).
   * @returns DayLogResponse Successful Response
   * @throws ApiError
   */
  public static generateDayLogDayLogsGenerateUserIdPost(
    data: DayLogsData["GenerateDayLogDayLogsGenerateUserIdPost"]
  ): CancelablePromise<DayLogResponse> {
    const { userId, dateValue } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/day-logs/generate/{user_id}",
      path: {
        user_id: userId,
      },
      query: {
        date_value: dateValue,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class LogService {
  /**
   * Create Log Endpoint
   * @returns LogResponse Successful Response
   * @throws ApiError
   */
  public static createLogEndpointLogPost(
    data: LogData["CreateLogEndpointLogPost"]
  ): CancelablePromise<LogResponse> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/log/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * List Logs Endpoint
   * @returns LogResponse Successful Response
   * @throws ApiError
   */
  public static listLogsEndpointLogGet(
    data: LogData["ListLogsEndpointLogGet"] = {}
  ): CancelablePromise<Array<LogResponse>> {
    const { skip = 0, limit = 10 } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/log/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Log Endpoint
   * @returns LogResponse Successful Response
   * @throws ApiError
   */
  public static getLogEndpointLogLogIdGet(
    data: LogData["GetLogEndpointLogLogIdGet"]
  ): CancelablePromise<LogResponse> {
    const { logId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/log/{log_id}",
      path: {
        log_id: logId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class PromptsService {
  /**
   * Create Prompt
   * @returns PromptResponse Successful Response
   * @throws ApiError
   */
  public static createPromptPromptsPost(
    data: PromptsData["CreatePromptPromptsPost"]
  ): CancelablePromise<PromptResponse> {
    const { requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: "/prompts/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get User Prompts
   * Get all prompts for a specific user
   * @returns PromptResponse Successful Response
   * @throws ApiError
   */
  public static getUserPromptsPromptsUserUserIdGet(
    data: PromptsData["GetUserPromptsPromptsUserUserIdGet"]
  ): CancelablePromise<Array<PromptResponse>> {
    const { userId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/prompts/user/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Prompt
   * @returns PromptResponse Successful Response
   * @throws ApiError
   */
  public static getPromptPromptsPromptIdGet(
    data: PromptsData["GetPromptPromptsPromptIdGet"]
  ): CancelablePromise<PromptResponse> {
    const { promptId } = data;
    return __request(OpenAPI, {
      method: "GET",
      url: "/prompts/{prompt_id}",
      path: {
        prompt_id: promptId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Prompt
   * @returns PromptResponse Successful Response
   * @throws ApiError
   */
  public static updatePromptPromptsPromptIdPatch(
    data: PromptsData["UpdatePromptPromptsPromptIdPatch"]
  ): CancelablePromise<PromptResponse> {
    const { promptId, requestBody } = data;
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/prompts/{prompt_id}",
      path: {
        prompt_id: promptId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}

export class DefaultService {
  /**
   * Read Root
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static readRootGet(): CancelablePromise<unknown> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/",
    });
  }

  /**
   * Health Check
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static healthCheckHealthGet(): CancelablePromise<unknown> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/health",
    });
  }
}
