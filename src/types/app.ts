// Application-specific types for the startup diary

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  deadline?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  category: "Quarterly" | "Monthly" | "Weekly";
  targetDate: Date;
  progress: number; // 0-100
  status: "active" | "completed" | "paused";
  milestones: Milestone[];
  createdAt: Date;
}

export interface Milestone {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  date: string;
  goalId: number;
}

export interface DiaryEntry {
  id: number;
  date: Date;
  content: string;
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  gratitude?: string;
  challenges?: string;
  wins?: string;
  photos?: string[];
}

export interface MotivationMessage {
  id: number;
  type: "celebration" | "encouragement" | "accountability" | "inspiration";
  message: string;
  context?: string;
  createdAt: Date;
}

export interface UserProgress {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  focusTime: number; // in minutes
  goalsProgress: {
    quarterly: number;
    monthly: number;
    weekly: number;
  };
}

export interface StartupJourney {
  startDate: Date;
  endDate: Date;
  daysRemaining: number;
  overallProgress: number;
  currentPhase: "ideation" | "validation" | "development" | "launch" | "growth";
}

export interface WeeklyStats {
  tasksCompleted: number;
  goalsAchieved: number;
  focusTime: number;
  moodAverage: number;
  energyAverage: number;
  topAchievement: string;
  areasForImprovement: string[];
}

export interface NotificationSettings {
  taskReminders: boolean;
  deadlineAlerts: boolean;
  motivationMessages: boolean;
  weeklyReports: boolean;
  dailyReflections: boolean;
}

export interface AICoachSettings {
  style: "supportive" | "direct" | "analytical" | "inspirational";
  frequency: "high" | "medium" | "low";
  focus: "productivity" | "wellbeing" | "growth" | "balanced";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  startupIdea: string;
  industry: string;
  experience: "beginner" | "intermediate" | "experienced";
  goals: string[];
  notifications: NotificationSettings;
  aiCoach: AICoachSettings;
  journey: StartupJourney;
}