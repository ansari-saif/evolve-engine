import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AiServiceService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import type {
  DailyTasksRequest,
  MotivationRequest,
  DeadlineReminderRequest,
  WeeklyAnalysisRequest,
  PhaseTransitionRequest,
  GoalsAnalysisRequest,
  CareerTransitionRequest,
} from '../client/models';

export const useAiService = () => {
  // Generate daily tasks
  const generateDailyTasks = useMutation<Array<Record<string, unknown>>, Error, DailyTasksRequest, unknown>({
    mutationFn: async (request: DailyTasksRequest) => {
      const response = await AiServiceService.generateDailyTasksEndpointAiDailyTasksPost({ 
        requestBody: request 
      });
      return response;
    },
    onError: (error) => {
      console.error('Failed to generate daily tasks:', getErrorMessage(error));
    },
  });

  // Generate motivation
  const generateMotivation = useMutation<string, Error, MotivationRequest, unknown>({
    mutationFn: async (request: MotivationRequest) => {
      const response = await AiServiceService.generateMotivationAiMotivationPost({ 
        requestBody: request 
      });
      return response;
    },
    onError: (error) => {
      console.error('Failed to generate motivation:', getErrorMessage(error));
    },
  });

  // Generate deadline reminder
  const generateDeadlineReminder = useMutation<string, Error, DeadlineReminderRequest, unknown>({
    mutationFn: async (request: DeadlineReminderRequest) => {
      const response = await AiServiceService.generateDeadlineReminderAiDeadlineReminderPost({ 
        requestBody: request 
      });
      return response;
    },
    onError: (error) => {
      console.error('Failed to generate deadline reminder:', getErrorMessage(error));
    },
  });

  // Generate weekly analysis
  const generateWeeklyAnalysis = useMutation<Record<string, unknown>, Error, WeeklyAnalysisRequest, unknown>({
    mutationFn: async (request: WeeklyAnalysisRequest) => {
      const response = await AiServiceService.generateWeeklyAnalysisAiWeeklyAnalysisPost({ 
        requestBody: request 
      });
      return response;
    },
    onError: (error) => {
      console.error('Failed to generate weekly analysis:', getErrorMessage(error));
    },
  });

  // Evaluate phase transition
  const evaluatePhaseTransition = useMutation<Record<string, unknown>, Error, PhaseTransitionRequest, unknown>({
    mutationFn: async (request: PhaseTransitionRequest) => {
      const response = await AiServiceService.evaluatePhaseTransitionAiPhaseTransitionPost({ 
        requestBody: request 
      });
      return response;
    },
    onError: (error) => {
      console.error('Failed to evaluate phase transition:', getErrorMessage(error));
    },
  });

  // Analyze goals
  const analyzeGoals = useMutation<Record<string, unknown>, Error, GoalsAnalysisRequest, unknown>({
    mutationFn: async (request: GoalsAnalysisRequest) => {
      const response = await AiServiceService.analyzeGoalsAiAnalyzeGoalsPost({ 
        requestBody: request 
      });
      return response;
    },
    onError: (error) => {
      console.error('Failed to analyze goals:', getErrorMessage(error));
    },
  });

  // Analyze career transition
  const analyzeCareerTransition = useMutation<Record<string, unknown>, Error, CareerTransitionRequest, unknown>({
    mutationFn: async (request: CareerTransitionRequest) => {
      const response = await AiServiceService.analyzeCareerTransitionAiCareerTransitionPost({ 
        requestBody: request 
      });
      return response;
    },
    onError: (error) => {
      console.error('Failed to analyze career transition:', getErrorMessage(error));
    },
  });

  // Generate complete user analysis
  const generateCompleteUserAnalysis = useMutation<Record<string, unknown>, Error, string, unknown>({
    mutationFn: async (userId: string) => {
      const response = await AiServiceService.generateCompleteUserAnalysisAiUserUserIdCompleteAnalysisPost({ 
        userId 
      });
      return response;
    },
    onError: (error) => {
      console.error('Failed to generate complete user analysis:', getErrorMessage(error));
    },
  });

  return {
    generateDailyTasks,
    generateMotivation,
    generateDeadlineReminder,
    generateWeeklyAnalysis,
    evaluatePhaseTransition,
    analyzeGoals,
    analyzeCareerTransition,
    generateCompleteUserAnalysis,
  };
};
