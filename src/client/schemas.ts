export const $AIContextCreate = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    behavior_patterns: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    productivity_insights: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    motivation_triggers: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    stress_indicators: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    optimal_work_times: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $AIContextResponse = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    behavior_patterns: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    productivity_insights: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    motivation_triggers: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    stress_indicators: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    optimal_work_times: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    context_id: {
      type: "number",
      isRequired: true,
    },
    last_updated: {
      type: "string",
      isRequired: true,
      format: "date-time",
    },
  },
} as const;

export const $AIContextUpdate = {
  properties: {
    behavior_patterns: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    productivity_insights: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    motivation_triggers: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    stress_indicators: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    optimal_work_times: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $BulkTaskCreate = {
  properties: {
    tasks: {
      type: "array",
      contains: {
        type: "TaskCreate",
      },
      isRequired: true,
    },
  },
} as const;

export const $CareerTransitionRequest = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
  },
} as const;

export const $CompletionStatusEnum = {
  type: "Enum",
  enum: ["Pending", "In Progress", "Completed", "Cancelled"],
} as const;

export const $DailyTasksRequest = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    energy_level: {
      type: "number",
      default: 5,
      maximum: 10,
      minimum: 1,
    },
    current_phase: {
      type: "any-of",
      contains: [
        {
          type: "PhaseEnum",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $DayLogBase = {
  properties: {
    date: {
      type: "string",
      isRequired: true,
      format: "date",
    },
    start_time: {
      type: "string",
      isRequired: true,
      format: "date-time",
    },
    end_time: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    summary: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    highlights: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    challenges: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    learnings: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    gratitude: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    tomorrow_plan: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    weather: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 100,
        },
        {
          type: "null",
        },
      ],
    },
    location: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 100,
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $DayLogBulkCreate = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    day_logs: {
      type: "array",
      contains: {
        type: "DayLogBase",
      },
      isRequired: true,
    },
  },
} as const;

export const $DayLogCreate = {
  properties: {
    date: {
      type: "string",
      isRequired: true,
      format: "date",
    },
    start_time: {
      type: "string",
      isRequired: true,
      format: "date-time",
    },
    end_time: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    summary: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    highlights: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    challenges: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    learnings: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    gratitude: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    tomorrow_plan: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    weather: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 100,
        },
        {
          type: "null",
        },
      ],
    },
    location: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 100,
        },
        {
          type: "null",
        },
      ],
    },
    user_id: {
      type: "string",
      isRequired: true,
    },
  },
} as const;

export const $DayLogResponse = {
  properties: {
    date: {
      type: "string",
      isRequired: true,
      format: "date",
    },
    start_time: {
      type: "string",
      isRequired: true,
      format: "date-time",
    },
    end_time: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    summary: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    highlights: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    challenges: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    learnings: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    gratitude: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    tomorrow_plan: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 2000,
        },
        {
          type: "null",
        },
      ],
    },
    weather: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 100,
        },
        {
          type: "null",
        },
      ],
    },
    location: {
      type: "any-of",
      contains: [
        {
          type: "string",
          maxLength: 100,
        },
        {
          type: "null",
        },
      ],
    },
    log_id: {
      type: "number",
      isRequired: true,
    },
    user_id: {
      type: "string",
      isRequired: true,
    },
  },
} as const;

export const $DayLogUpdate = {
  properties: {
    date: {
      type: "null",
    },
    start_time: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    end_time: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    summary: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    highlights: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    challenges: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    learnings: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    gratitude: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    tomorrow_plan: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    weather: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    location: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $DeadlineReminderRequest = {
  properties: {
    task_id: {
      type: "number",
      isRequired: true,
    },
    user_pattern: {
      type: "string",
      default: "default",
    },
  },
} as const;

export const $EnergyProfileEnum = {
  type: "Enum",
  enum: ["Morning", "Afternoon", "Evening"],
} as const;

export const $EnergyRequiredEnum = {
  type: "Enum",
  enum: ["High", "Medium", "Low"],
} as const;

export const $GoalCreate = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    type: {
      type: "GoalTypeEnum",
      isRequired: true,
    },
    description: {
      type: "string",
      isRequired: true,
    },
    deadline: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    status: {
      type: "StatusEnum",
      default: "Active",
    },
    phase: {
      type: "PhaseEnum",
      isRequired: true,
    },
    priority: {
      type: "PriorityEnum",
      default: "Medium",
    },
    completion_percentage: {
      type: "number",
      default: 0,
      maximum: 100,
      minimum: 0,
    },
  },
} as const;

export const $GoalResponse = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    type: {
      type: "GoalTypeEnum",
      isRequired: true,
    },
    description: {
      type: "string",
      isRequired: true,
    },
    deadline: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    status: {
      type: "StatusEnum",
      default: "Active",
    },
    phase: {
      type: "PhaseEnum",
      isRequired: true,
    },
    priority: {
      type: "PriorityEnum",
      default: "Medium",
    },
    completion_percentage: {
      type: "number",
      default: 0,
      maximum: 100,
      minimum: 0,
    },
    goal_id: {
      type: "number",
      isRequired: true,
    },
  },
} as const;

export const $GoalTypeEnum = {
  type: "Enum",
  enum: ["Yearly", "Quarterly", "Monthly", "Weekly"],
} as const;

export const $GoalUpdate = {
  properties: {
    type: {
      type: "any-of",
      contains: [
        {
          type: "GoalTypeEnum",
        },
        {
          type: "null",
        },
      ],
    },
    description: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    deadline: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    status: {
      type: "any-of",
      contains: [
        {
          type: "StatusEnum",
        },
        {
          type: "null",
        },
      ],
    },
    phase: {
      type: "any-of",
      contains: [
        {
          type: "PhaseEnum",
        },
        {
          type: "null",
        },
      ],
    },
    priority: {
      type: "any-of",
      contains: [
        {
          type: "PriorityEnum",
        },
        {
          type: "null",
        },
      ],
    },
    completion_percentage: {
      type: "any-of",
      contains: [
        {
          type: "number",
          maximum: 100,
          minimum: 0,
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $GoalsAnalysisRequest = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
  },
} as const;

export const $HTTPValidationError = {
  properties: {
    detail: {
      type: "array",
      contains: {
        type: "ValidationError",
      },
    },
  },
} as const;

export const $JobMetricsAIAnalysis = {
  properties: {
    career_growth_score: {
      type: "number",
      isRequired: true,
    },
    financial_health_score: {
      type: "number",
      isRequired: true,
    },
    work_life_balance_score: {
      type: "number",
      isRequired: true,
    },
    overall_recommendation: {
      type: "string",
      isRequired: true,
    },
    action_items: {
      type: "array",
      contains: {
        type: "string",
      },
      isRequired: true,
    },
    risk_factors: {
      type: "array",
      contains: {
        type: "string",
      },
      isRequired: true,
    },
    opportunities: {
      type: "array",
      contains: {
        type: "string",
      },
      isRequired: true,
    },
  },
} as const;

export const $JobMetricsCreate = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    current_salary: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "string",
        },
      ],
      isRequired: true,
    },
    startup_revenue: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "string",
        },
      ],
      isRequired: true,
    },
    monthly_expenses: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "string",
        },
      ],
      isRequired: true,
    },
    runway_months: {
      type: "number",
      isRequired: true,
    },
    stress_level: {
      type: "number",
      isRequired: true,
    },
    job_satisfaction: {
      type: "number",
      isRequired: true,
    },
    quit_readiness_score: {
      type: "number",
      isRequired: true,
    },
    ai_analysis: {
      type: "any-of",
      contains: [
        {
          type: "JobMetricsAIAnalysis",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $JobMetricsResponse = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    current_salary: {
      type: "string",
      isRequired: true,
    },
    startup_revenue: {
      type: "string",
      isRequired: true,
    },
    monthly_expenses: {
      type: "string",
      isRequired: true,
    },
    runway_months: {
      type: "number",
      isRequired: true,
    },
    stress_level: {
      type: "number",
      isRequired: true,
    },
    job_satisfaction: {
      type: "number",
      isRequired: true,
    },
    quit_readiness_score: {
      type: "number",
      isRequired: true,
    },
    ai_analysis: {
      type: "any-of",
      contains: [
        {
          type: "JobMetricsAIAnalysis",
        },
        {
          type: "null",
        },
      ],
    },
    last_updated: {
      type: "string",
      isRequired: true,
      format: "date-time",
    },
  },
} as const;

export const $JobMetricsUpdate = {
  properties: {
    current_salary: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    startup_revenue: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    monthly_expenses: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    runway_months: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "null",
        },
      ],
    },
    stress_level: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "null",
        },
      ],
    },
    job_satisfaction: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "null",
        },
      ],
    },
    quit_readiness_score: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $LogCreate = {
  properties: {
    title: {
      type: "string",
      isRequired: true,
      maxLength: 255,
      minLength: 1,
    },
  },
} as const;

export const $LogResponse = {
  properties: {
    title: {
      type: "string",
      isRequired: true,
      maxLength: 255,
      minLength: 1,
    },
    log_id: {
      type: "number",
      isRequired: true,
    },
    created_at: {
      type: "string",
      isRequired: true,
      format: "date-time",
    },
  },
} as const;

export const $MotivationRequest = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    current_challenge: {
      type: "string",
      isRequired: true,
    },
    stress_level: {
      type: "number",
      default: 5,
    },
  },
} as const;

export const $PhaseEnum = {
  type: "Enum",
  enum: ["Research", "MVP", "Growth", "Scale", "Transition"],
} as const;

export const $PhaseTransitionRequest = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    current_phase: {
      type: "string",
    },
  },
} as const;

export const $PriorityEnum = {
  type: "Enum",
  enum: ["High", "Medium", "Low"],
} as const;

export const $ProgressLogCreate = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    date: {
      type: "string",
      isRequired: true,
      format: "date",
    },
    tasks_completed: {
      type: "number",
      default: 0,
    },
    tasks_planned: {
      type: "number",
      default: 0,
    },
    mood_score: {
      type: "number",
      isRequired: true,
      maximum: 10,
      minimum: 1,
    },
    energy_level: {
      type: "number",
      isRequired: true,
      maximum: 10,
      minimum: 1,
    },
    focus_score: {
      type: "number",
      isRequired: true,
      maximum: 10,
      minimum: 1,
    },
    daily_reflection: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    ai_insights: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $ProgressLogResponse = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    date: {
      type: "string",
      isRequired: true,
      format: "date",
    },
    tasks_completed: {
      type: "number",
      default: 0,
    },
    tasks_planned: {
      type: "number",
      default: 0,
    },
    mood_score: {
      type: "number",
      isRequired: true,
      maximum: 10,
      minimum: 1,
    },
    energy_level: {
      type: "number",
      isRequired: true,
      maximum: 10,
      minimum: 1,
    },
    focus_score: {
      type: "number",
      isRequired: true,
      maximum: 10,
      minimum: 1,
    },
    daily_reflection: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    ai_insights: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    log_id: {
      type: "number",
      isRequired: true,
    },
  },
} as const;

export const $ProgressLogUpdate = {
  properties: {
    date: {
      type: "null",
    },
    tasks_completed: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "null",
        },
      ],
    },
    tasks_planned: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "null",
        },
      ],
    },
    mood_score: {
      type: "any-of",
      contains: [
        {
          type: "number",
          maximum: 10,
          minimum: 1,
        },
        {
          type: "null",
        },
      ],
    },
    energy_level: {
      type: "any-of",
      contains: [
        {
          type: "number",
          maximum: 10,
          minimum: 1,
        },
        {
          type: "null",
        },
      ],
    },
    focus_score: {
      type: "any-of",
      contains: [
        {
          type: "number",
          maximum: 10,
          minimum: 1,
        },
        {
          type: "null",
        },
      ],
    },
    daily_reflection: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    ai_insights: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $PromptCreate = {
  properties: {
    user_id: {
      type: "string",
      description: `ID of the user making the prompt request`,
      isRequired: true,
    },
    prompt_text: {
      type: "string",
      description: `The prompt text to send to Gemini API`,
      isRequired: true,
    },
  },
} as const;

export const $PromptResponse = {
  properties: {
    user_id: {
      type: "string",
      description: `ID of the user making the prompt request`,
      isRequired: true,
    },
    prompt_text: {
      type: "string",
      description: `The prompt text to send to Gemini API`,
      isRequired: true,
    },
    prompt_id: {
      type: "string",
      description: `Unique identifier for the prompt`,
      isRequired: true,
    },
    response_text: {
      type: "string",
      description: `Response from Gemini API`,
      isRequired: true,
    },
    created_at: {
      type: "string",
      description: `When the prompt was created`,
      isRequired: true,
      format: "date-time",
    },
    completed_at: {
      type: "any-of",
      description: `When the response was received`,
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $PromptUpdate = {
  properties: {
    response_text: {
      type: "any-of",
      description: `Updated response from Gemini API`,
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    completed_at: {
      type: "any-of",
      description: `When the response was completed`,
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $StatusEnum = {
  type: "Enum",
  enum: ["Active", "Completed", "Paused"],
} as const;

export const $TaskCreate = {
  properties: {
    description: {
      type: "string",
      isRequired: true,
    },
    deadline: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    priority: {
      type: "TaskPriorityEnum",
      default: "Medium",
    },
    completion_status: {
      type: "CompletionStatusEnum",
      default: "Pending",
    },
    estimated_duration: {
      type: "any-of",
      contains: [
        {
          type: "number",
          minimum: 0,
        },
        {
          type: "null",
        },
      ],
    },
    actual_duration: {
      type: "any-of",
      contains: [
        {
          type: "number",
          minimum: 0,
        },
        {
          type: "null",
        },
      ],
    },
    energy_required: {
      type: "EnergyRequiredEnum",
      default: "Medium",
    },
    created_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    updated_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    started_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    completed_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    user_id: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    goal_id: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $TaskPriorityEnum = {
  type: "Enum",
  enum: ["Urgent", "High", "Medium", "Low"],
} as const;

export const $TaskResponse = {
  properties: {
    description: {
      type: "string",
      isRequired: true,
    },
    deadline: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    priority: {
      type: "TaskPriorityEnum",
      default: "Medium",
    },
    completion_status: {
      type: "CompletionStatusEnum",
      default: "Pending",
    },
    estimated_duration: {
      type: "any-of",
      contains: [
        {
          type: "number",
          minimum: 0,
        },
        {
          type: "null",
        },
      ],
    },
    actual_duration: {
      type: "any-of",
      contains: [
        {
          type: "number",
          minimum: 0,
        },
        {
          type: "null",
        },
      ],
    },
    energy_required: {
      type: "EnergyRequiredEnum",
      default: "Medium",
    },
    created_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    updated_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    started_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    completed_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    task_id: {
      type: "number",
      isRequired: true,
    },
    goal_id: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "null",
        },
      ],
    },
    ai_generated: {
      type: "boolean",
      default: false,
    },
    user_id: {
      type: "string",
      isRequired: true,
    },
  },
} as const;

export const $TaskUpdate = {
  properties: {
    goal_id: {
      type: "any-of",
      contains: [
        {
          type: "number",
        },
        {
          type: "null",
        },
      ],
    },
    description: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    deadline: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    priority: {
      type: "any-of",
      contains: [
        {
          type: "TaskPriorityEnum",
        },
        {
          type: "null",
        },
      ],
    },
    ai_generated: {
      type: "any-of",
      contains: [
        {
          type: "boolean",
        },
        {
          type: "null",
        },
      ],
    },
    completion_status: {
      type: "any-of",
      contains: [
        {
          type: "CompletionStatusEnum",
        },
        {
          type: "null",
        },
      ],
    },
    estimated_duration: {
      type: "any-of",
      contains: [
        {
          type: "number",
          minimum: 0,
        },
        {
          type: "null",
        },
      ],
    },
    actual_duration: {
      type: "any-of",
      contains: [
        {
          type: "number",
          minimum: 0,
        },
        {
          type: "null",
        },
      ],
    },
    energy_required: {
      type: "any-of",
      contains: [
        {
          type: "EnergyRequiredEnum",
        },
        {
          type: "null",
        },
      ],
    },
    created_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    updated_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    started_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
    completed_at: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date-time",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $TimezoneEnum = {
  type: "Enum",
  enum: ["UTC", "EST", "PST", "CST", "MST", "IST"],
} as const;

export const $UserCreate = {
  properties: {
    telegram_id: {
      type: "string",
      isRequired: true,
    },
    name: {
      type: "string",
      isRequired: true,
    },
    birthday: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    timezone: {
      type: "TimezoneEnum",
      default: "UTC",
    },
    current_phase: {
      type: "PhaseEnum",
      default: "Research",
    },
    quit_job_target: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    onboarding_complete: {
      type: "boolean",
      default: false,
    },
    morning_time: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "time",
        },
        {
          type: "null",
        },
      ],
    },
    energy_profile: {
      type: "EnergyProfileEnum",
      default: "Morning",
    },
  },
} as const;

export const $UserResponse = {
  properties: {
    telegram_id: {
      type: "string",
      isRequired: true,
    },
    name: {
      type: "string",
      isRequired: true,
    },
    birthday: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    timezone: {
      type: "TimezoneEnum",
      default: "UTC",
    },
    current_phase: {
      type: "PhaseEnum",
      default: "Research",
    },
    quit_job_target: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    onboarding_complete: {
      type: "boolean",
      default: false,
    },
    morning_time: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "time",
        },
        {
          type: "null",
        },
      ],
    },
    energy_profile: {
      type: "EnergyProfileEnum",
      default: "Morning",
    },
  },
} as const;

export const $UserUpdate = {
  properties: {
    name: {
      type: "any-of",
      contains: [
        {
          type: "string",
        },
        {
          type: "null",
        },
      ],
    },
    birthday: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    timezone: {
      type: "any-of",
      contains: [
        {
          type: "TimezoneEnum",
        },
        {
          type: "null",
        },
      ],
    },
    current_phase: {
      type: "any-of",
      contains: [
        {
          type: "PhaseEnum",
        },
        {
          type: "null",
        },
      ],
    },
    quit_job_target: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "null",
        },
      ],
    },
    onboarding_complete: {
      type: "any-of",
      contains: [
        {
          type: "boolean",
        },
        {
          type: "null",
        },
      ],
    },
    morning_time: {
      type: "any-of",
      contains: [
        {
          type: "string",
          format: "time",
        },
        {
          type: "null",
        },
      ],
    },
    energy_profile: {
      type: "any-of",
      contains: [
        {
          type: "EnergyProfileEnum",
        },
        {
          type: "null",
        },
      ],
    },
  },
} as const;

export const $ValidationError = {
  properties: {
    loc: {
      type: "array",
      contains: {
        type: "any-of",
        contains: [
          {
            type: "string",
          },
          {
            type: "number",
          },
        ],
      },
      isRequired: true,
    },
    msg: {
      type: "string",
      isRequired: true,
    },
    type: {
      type: "string",
      isRequired: true,
    },
  },
} as const;

export const $WeeklyAnalysisRequest = {
  properties: {
    user_id: {
      type: "string",
      isRequired: true,
    },
    weeks: {
      type: "number",
      default: 1,
    },
  },
} as const;
