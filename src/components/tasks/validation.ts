// Validation functions for task generation and editing

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormErrors {
  energy?: string;
  phase?: string;
  [key: string]: string | undefined;
}

// Validate generation parameters
export const validateGenerationParams = (energy: string, phase: string): FormErrors => {
  const errors: FormErrors = {};
  
  if (!energy || energy.trim() === '') {
    errors.energy = 'Energy level is required';
  }
  
  // Phase is optional, so we don't validate it
  // if (!phase || phase.trim() === '') {
  //   errors.phase = 'Phase is required';
  // }
  
  return errors;
};

// Validate task title
export const validateTitle = (value: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: 'Title cannot be empty' };
  }
  
  if (value.length > 100) {
    return { isValid: false, error: 'Title must be less than 100 characters' };
  }
  
  return { isValid: true };
};

// Validate task description
export const validateDescription = (value: string): ValidationResult => {
  if (value && value.length > 500) {
    return { isValid: false, error: 'Description must be less than 500 characters' };
  }
  
  return { isValid: true };
};

// Validate priority
export const validatePriority = (value: string): ValidationResult => {
  const validPriorities = ['Urgent', 'High', 'Medium', 'Low'];
  
  if (!validPriorities.includes(value)) {
    return { isValid: false, error: 'Priority must be one of: Urgent, High, Medium, Low' };
  }
  
  return { isValid: true };
};

// Validate energy required
export const validateEnergyRequired = (value: string): ValidationResult => {
  const validEnergyLevels = ['High', 'Medium', 'Low'];
  
  if (!validEnergyLevels.includes(value)) {
    return { isValid: false, error: 'Energy level must be one of: High, Medium, Low' };
  }
  
  return { isValid: true };
};

// Validate duration
export const validateDuration = (value: number | string): ValidationResult => {
  const duration = typeof value === 'string' ? parseInt(value, 10) : value;
  
  if (isNaN(duration) || duration <= 0) {
    return { isValid: false, error: 'Duration must be a positive number' };
  }
  
  if (duration > 1440) {
    return { isValid: false, error: 'Duration must be less than 24 hours (1440 minutes)' };
  }
  
  return { isValid: true };
};

// Validate a complete task
export const validateTask = (task: Record<string, unknown>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const titleValidation = validateTitle(task.description || '');
  const descValidation = validateDescription(task.description || '');
  const priorityValidation = validatePriority(task.priority || '');
  const energyValidation = validateEnergyRequired(task.energy_required || '');
  const durationValidation = validateDuration(task.estimated_duration || 0);
  
  if (!titleValidation.isValid) {
    errors.description = titleValidation.error!;
  }
  
  if (!descValidation.isValid) {
    errors.description = descValidation.error!;
  }
  
  if (!priorityValidation.isValid) {
    errors.priority = priorityValidation.error!;
  }
  
  if (!energyValidation.isValid) {
    errors.energy_required = energyValidation.error!;
  }
  
  if (!durationValidation.isValid) {
    errors.estimated_duration = durationValidation.error!;
  }
  
  return errors;
};

// Check if any tasks have validation errors
export const hasValidationErrors = (tasks: Record<string, unknown>[]): boolean => {
  return tasks.some(task => {
    const errors = validateTask(task);
    return Object.keys(errors).length > 0;
  });
};

// Get validation error count
export const getValidationErrorCount = (tasks: Record<string, unknown>[]): number => {
  return tasks.reduce((count, task) => {
    const errors = validateTask(task);
    return count + Object.keys(errors).length;
  }, 0);
};
