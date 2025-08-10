export type AIContextCreate = {
	user_id: string;
	behavior_patterns?: string | null;
	productivity_insights?: string | null;
	motivation_triggers?: string | null;
	stress_indicators?: string | null;
	optimal_work_times?: string | null;
};



export type AIContextResponse = {
	user_id: string;
	behavior_patterns?: string | null;
	productivity_insights?: string | null;
	motivation_triggers?: string | null;
	stress_indicators?: string | null;
	optimal_work_times?: string | null;
	context_id: number;
	last_updated: string;
};



export type AIContextUpdate = {
	behavior_patterns?: string | null;
	productivity_insights?: string | null;
	motivation_triggers?: string | null;
	stress_indicators?: string | null;
	optimal_work_times?: string | null;
};



export type BulkTaskCreate = {
	tasks: Array<TaskCreate>;
};



export type CareerTransitionRequest = {
	user_id: string;
};



export type CompletionStatusEnum = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';



export type DailyTasksRequest = {
	user_id: string;
	energy_level?: number;
	current_phase?: PhaseEnum | null;
};



export type DayLogBase = {
	date: string;
	start_time: string;
	end_time?: string | null;
	summary?: string | null;
	highlights?: string | null;
	challenges?: string | null;
	learnings?: string | null;
	gratitude?: string | null;
	tomorrow_plan?: string | null;
	weather?: string | null;
	location?: string | null;
};



export type DayLogBulkCreate = {
	user_id: string;
	day_logs: Array<DayLogBase>;
};



export type DayLogCreate = {
	date: string;
	start_time: string;
	end_time?: string | null;
	summary?: string | null;
	highlights?: string | null;
	challenges?: string | null;
	learnings?: string | null;
	gratitude?: string | null;
	tomorrow_plan?: string | null;
	weather?: string | null;
	location?: string | null;
	user_id: string;
};



export type DayLogResponse = {
	date: string;
	start_time: string;
	end_time?: string | null;
	summary?: string | null;
	highlights?: string | null;
	challenges?: string | null;
	learnings?: string | null;
	gratitude?: string | null;
	tomorrow_plan?: string | null;
	weather?: string | null;
	location?: string | null;
	log_id: number;
	user_id: string;
};



export type DayLogUpdate = {
	date?: null;
	start_time?: string | null;
	end_time?: string | null;
	summary?: string | null;
	highlights?: string | null;
	challenges?: string | null;
	learnings?: string | null;
	gratitude?: string | null;
	tomorrow_plan?: string | null;
	weather?: string | null;
	location?: string | null;
};



export type DeadlineReminderRequest = {
	task_id: number;
	user_pattern?: string;
};



export type EnergyProfileEnum = 'Morning' | 'Afternoon' | 'Evening';



export type EnergyRequiredEnum = 'High' | 'Medium' | 'Low';



export type GoalCreate = {
	user_id: string;
	type: GoalTypeEnum;
	description: string;
	deadline?: string | null;
	status?: StatusEnum;
	phase: PhaseEnum;
	priority?: PriorityEnum;
	completion_percentage?: number;
};



export type GoalResponse = {
	user_id: string;
	type: GoalTypeEnum;
	description: string;
	deadline?: string | null;
	status?: StatusEnum;
	phase: PhaseEnum;
	priority?: PriorityEnum;
	completion_percentage?: number;
	goal_id: number;
};



export type GoalTypeEnum = 'Yearly' | 'Quarterly' | 'Monthly' | 'Weekly';



export type GoalUpdate = {
	type?: GoalTypeEnum | null;
	description?: string | null;
	deadline?: string | null;
	status?: StatusEnum | null;
	phase?: PhaseEnum | null;
	priority?: PriorityEnum | null;
	completion_percentage?: number | null;
};



export type GoalsAnalysisRequest = {
	user_id: string;
};



export type HTTPValidationError = {
	detail?: Array<ValidationError>;
};



export type JobMetricsAIAnalysis = {
	career_growth_score: number;
	financial_health_score: number;
	work_life_balance_score: number;
	overall_recommendation: string;
	action_items: Array<string>;
	risk_factors: Array<string>;
	opportunities: Array<string>;
};



export type JobMetricsCreate = {
	user_id: string;
	current_salary: number | string;
	startup_revenue: number | string;
	monthly_expenses: number | string;
	runway_months: number;
	stress_level: number;
	job_satisfaction: number;
	quit_readiness_score: number;
	ai_analysis?: JobMetricsAIAnalysis | null;
};



export type JobMetricsResponse = {
	user_id: string;
	current_salary: string;
	startup_revenue: string;
	monthly_expenses: string;
	runway_months: number;
	stress_level: number;
	job_satisfaction: number;
	quit_readiness_score: number;
	ai_analysis?: JobMetricsAIAnalysis | null;
	last_updated: string;
};



export type JobMetricsUpdate = {
	current_salary?: number | string | null;
	startup_revenue?: number | string | null;
	monthly_expenses?: number | string | null;
	runway_months?: number | null;
	stress_level?: number | null;
	job_satisfaction?: number | null;
	quit_readiness_score?: number | null;
};



export type LogCreate = {
	title: string;
};



export type LogResponse = {
	title: string;
	log_id: number;
	created_at: string;
};



export type MotivationRequest = {
	user_id: string;
	current_challenge: string;
	stress_level?: number;
};



export type PhaseEnum = 'Research' | 'MVP' | 'Growth' | 'Scale' | 'Transition';



export type PhaseTransitionRequest = {
	user_id: string;
	current_phase?: string;
};



export type PriorityEnum = 'High' | 'Medium' | 'Low';



export type ProgressLogCreate = {
	user_id: string;
	date: string;
	tasks_completed?: number;
	tasks_planned?: number;
	mood_score: number;
	energy_level: number;
	focus_score: number;
	daily_reflection?: string | null;
	ai_insights?: string | null;
};



export type ProgressLogResponse = {
	user_id: string;
	date: string;
	tasks_completed?: number;
	tasks_planned?: number;
	mood_score: number;
	energy_level: number;
	focus_score: number;
	daily_reflection?: string | null;
	ai_insights?: string | null;
	log_id: number;
};



export type ProgressLogUpdate = {
	date?: null;
	tasks_completed?: number | null;
	tasks_planned?: number | null;
	mood_score?: number | null;
	energy_level?: number | null;
	focus_score?: number | null;
	daily_reflection?: string | null;
	ai_insights?: string | null;
};



export type PromptCreate = {
	/**
	 * ID of the user making the prompt request
	 */
	user_id: string;
	/**
	 * The prompt text to send to Gemini API
	 */
	prompt_text: string;
};



export type PromptResponse = {
	/**
	 * ID of the user making the prompt request
	 */
	user_id: string;
	/**
	 * The prompt text to send to Gemini API
	 */
	prompt_text: string;
	/**
	 * Unique identifier for the prompt
	 */
	prompt_id: string;
	/**
	 * Response from Gemini API
	 */
	response_text: string;
	/**
	 * When the prompt was created
	 */
	created_at: string;
	/**
	 * When the response was received
	 */
	completed_at?: string | null;
};



export type PromptUpdate = {
	/**
	 * Updated response from Gemini API
	 */
	response_text?: string | null;
	/**
	 * When the response was completed
	 */
	completed_at?: string | null;
};



export type StatusEnum = 'Active' | 'Completed' | 'Paused';



export type TaskCreate = {
	description: string;
	priority?: TaskPriorityEnum;
	completion_status?: CompletionStatusEnum;
	estimated_duration?: number | null;
	actual_duration?: number | null;
	energy_required?: EnergyRequiredEnum;
	scheduled_for_date?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	started_at?: string | null;
	completed_at?: string | null;
	user_id?: string | null;
	goal_id?: number | null;
};



export type TaskPriorityEnum = 'Urgent' | 'High' | 'Medium' | 'Low';



export type TaskResponse = {
	description: string;
	priority?: TaskPriorityEnum;
	completion_status?: CompletionStatusEnum;
	estimated_duration?: number | null;
	actual_duration?: number | null;
	energy_required?: EnergyRequiredEnum;
	scheduled_for_date?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	started_at?: string | null;
	completed_at?: string | null;
	task_id: number;
	goal_id?: number | null;
	ai_generated?: boolean;
	user_id: string;
};



export type TaskUpdate = {
	goal_id?: number | null;
	description?: string | null;
	priority?: TaskPriorityEnum | null;
	ai_generated?: boolean | null;
	completion_status?: CompletionStatusEnum | null;
	estimated_duration?: number | null;
	actual_duration?: number | null;
	energy_required?: EnergyRequiredEnum | null;
	scheduled_for_date?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	started_at?: string | null;
	completed_at?: string | null;
};



export type TimezoneEnum = 'UTC' | 'EST' | 'PST' | 'CST' | 'MST' | 'IST';



export type UserCreate = {
	telegram_id: string;
	name: string;
	birthday?: string | null;
	timezone?: TimezoneEnum;
	current_phase?: PhaseEnum;
	quit_job_target?: string | null;
	onboarding_complete?: boolean;
	morning_time?: string | null;
	energy_profile?: EnergyProfileEnum;
};



export type UserResponse = {
	telegram_id: string;
	name: string;
	birthday?: string | null;
	timezone?: TimezoneEnum;
	current_phase?: PhaseEnum;
	quit_job_target?: string | null;
	onboarding_complete?: boolean;
	morning_time?: string | null;
	energy_profile?: EnergyProfileEnum;
};



export type UserUpdate = {
	name?: string | null;
	birthday?: string | null;
	timezone?: TimezoneEnum | null;
	current_phase?: PhaseEnum | null;
	quit_job_target?: string | null;
	onboarding_complete?: boolean | null;
	morning_time?: string | null;
	energy_profile?: EnergyProfileEnum | null;
};



export type ValidationError = {
	loc: Array<string | number>;
	msg: string;
	type: string;
};



export type WeeklyAnalysisRequest = {
	user_id: string;
	weeks?: number;
};

