// Dialog state management for the task generation workflow

export enum DialogState {
  INITIAL = 'initial',
  PREVIEW = 'preview',
  SUCCESS = 'success'
}

// Type-safe enums for better type safety
export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type EnergyLevel = 'High' | 'Medium' | 'Low';

export interface GeneratedTask {
  description: string;
  priority: TaskPriority;
  energy_required: EnergyLevel;
  estimated_duration?: number;
  scheduled_for_date?: string;
}

// Interface for tasks with validation errors
export interface EditableGeneratedTask extends GeneratedTask {
  errors?: {
    description?: string;
    priority?: string;
    energy_required?: string;
    estimated_duration?: string;
  };
}

export interface DialogStateData {
  currentState: DialogState;
  energyLevel: number;
  currentPhase: string | null;
  generatedTasks: GeneratedTask[];
  editedTasks: EditableGeneratedTask[];
  isGenerating: boolean;
  isCreating: boolean;
  isSuccess: boolean;
  generationError: string | null;
  creationError: string | null;
  formErrors: { energy?: string; phase?: string };
}

export type DialogAction =
  | { type: 'SET_STATE'; payload: DialogState }
  | { type: 'SET_ENERGY_LEVEL'; payload: number }
  | { type: 'SET_CURRENT_PHASE'; payload: string | null }
  | { type: 'SET_GENERATED_TASKS'; payload: GeneratedTask[] }
  | { type: 'SET_EDITED_TASKS'; payload: EditableGeneratedTask[] }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_CREATING'; payload: boolean }
  | { type: 'SET_SUCCESS'; payload: boolean }
  | { type: 'SET_GENERATION_ERROR'; payload: string | null }
  | { type: 'SET_CREATION_ERROR'; payload: string | null }
  | { type: 'SET_FORM_ERRORS'; payload: { energy?: string; phase?: string } }
  | { type: 'RESET_STATE' }
  | { type: 'GO_BACK' }
  | { type: 'GO_TO_PREVIEW' }
  | { type: 'GO_TO_SUCCESS' };

export const initialState: DialogStateData = {
  currentState: DialogState.INITIAL,
  energyLevel: 5,
  currentPhase: null,
  generatedTasks: [],
  editedTasks: [],
  isGenerating: false,
  isCreating: false,
  isSuccess: false,
  generationError: null,
  creationError: null,
  formErrors: {}
};

export const dialogReducer = (state: DialogStateData, action: DialogAction): DialogStateData => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, currentState: action.payload };
    
    case 'SET_ENERGY_LEVEL':
      return { ...state, energyLevel: action.payload };
    
    case 'SET_CURRENT_PHASE':
      return { ...state, currentPhase: action.payload };
    
    case 'SET_GENERATED_TASKS':
      return { ...state, generatedTasks: action.payload };
    
    case 'SET_EDITED_TASKS':
      return { ...state, editedTasks: action.payload };
    
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    
    case 'SET_CREATING':
      return { ...state, isCreating: action.payload };
    
    case 'SET_SUCCESS':
      return { ...state, isSuccess: action.payload };
    
    case 'SET_GENERATION_ERROR':
      return { ...state, generationError: action.payload };
    
    case 'SET_CREATION_ERROR':
      return { ...state, creationError: action.payload };
    
    case 'SET_FORM_ERRORS':
      return { ...state, formErrors: action.payload };
    
    case 'RESET_STATE':
      return initialState;
    
    case 'GO_BACK':
      return {
        ...state,
        currentState: DialogState.INITIAL,
        isSuccess: false,
        generatedTasks: [],
        editedTasks: [],
        generationError: null,
        creationError: null,
        formErrors: {}
      };
    
    case 'GO_TO_PREVIEW':
      return {
        ...state,
        currentState: DialogState.PREVIEW,
        isGenerating: false,
        generationError: null,
        formErrors: {}
      };
    
    case 'GO_TO_SUCCESS':
      return {
        ...state,
        currentState: DialogState.SUCCESS,
        isCreating: false,
        creationError: null,
        isSuccess: true
      };
    
    default:
      return state;
  }
};

// Utility functions for state transitions
export const canGoBack = (state: DialogState): boolean => {
  return state === DialogState.PREVIEW;
};

export const canClose = (state: DialogStateData): boolean => {
  return !state.isGenerating && !state.isCreating;
};

export const getCurrentStep = (state: DialogState): number => {
  switch (state) {
    case DialogState.INITIAL:
      return 0;
    case DialogState.PREVIEW:
      return 1;
    case DialogState.SUCCESS:
      return 2;
    default:
      return 0;
  }
};

export const getStateTitle = (state: DialogState): string => {
  switch (state) {
    case DialogState.INITIAL:
      return 'Generate Daily Tasks';
    case DialogState.PREVIEW:
      return 'Review Generated Tasks';
    case DialogState.SUCCESS:
      return 'Tasks Created Successfully';
    default:
      return 'Generate Daily Tasks';
  }
};
