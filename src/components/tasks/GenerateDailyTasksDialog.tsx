import React, { useState, useReducer, useEffect } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Sparkles, ArrowLeft, Check, X } from 'lucide-react';
import EditableTaskList from './EditableTaskList';
import WorkflowProgress from './WorkflowProgress';
import LoadingOverlay from './LoadingOverlay';
import ErrorDisplay from './ErrorDisplay';
import KeyboardShortcutsDisplay from './KeyboardShortcutsDisplay';
import { validateGenerationParams } from './validation';
import { 
  DialogState, 
  dialogReducer, 
  initialState, 
  getCurrentStep, 
  getStateTitle,
  canGoBack,
  canClose
} from './DialogStateManager';
import { useDialogKeyboard } from './useDialogKeyboard';
import type { PhaseEnum } from '../../client/models';
import type { GeneratedTask, EditableGeneratedTask } from './DialogStateManager';

interface GenerateDailyTasksDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (params: { energyLevel: number; currentPhase: PhaseEnum | null }) => Promise<GeneratedTask[]>;
  onCreateTasks: (tasks: GeneratedTask[]) => Promise<void>;
  isLoading?: boolean;
}

const GenerateDailyTasksDialog: React.FC<GenerateDailyTasksDialogProps> = ({
  open,
  onClose,
  onGenerate,
  onCreateTasks,
  isLoading = false
}) => {
  const [state, dispatch] = useReducer(dialogReducer, initialState);
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      dispatch({ type: 'RESET_STATE' });
    }
  }, [open]);

  const handleGenerate = async () => {
    dispatch({ type: 'SET_GENERATION_ERROR', payload: null });
    dispatch({ type: 'SET_FORM_ERRORS', payload: {} });
    
    const validationErrors = validateGenerationParams(state.energyLevel.toString(), state.currentPhase || '');
    
    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: 'SET_FORM_ERRORS', payload: validationErrors });
      return;
    }
    
    dispatch({ type: 'SET_GENERATING', payload: true });
    try {
      const tasks = await onGenerate({ energyLevel: state.energyLevel, currentPhase: state.currentPhase as PhaseEnum | null });
      dispatch({ type: 'SET_GENERATED_TASKS', payload: tasks });
      dispatch({ type: 'SET_EDITED_TASKS', payload: tasks });
      dispatch({ type: 'GO_TO_PREVIEW' });
    } catch (err) {
      dispatch({ type: 'SET_GENERATION_ERROR', payload: err instanceof Error ? err.message : 'Failed to generate tasks' });
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  };

  const handleCreateTasks = async () => {
    dispatch({ type: 'SET_CREATION_ERROR', payload: null });
    dispatch({ type: 'SET_CREATING', payload: true });
    try {
      // Convert EditableGeneratedTask[] to GeneratedTask[] by removing errors
      const tasksToCreate: GeneratedTask[] = state.editedTasks.map(({ errors, ...task }) => task);
      await onCreateTasks(tasksToCreate);
      dispatch({ type: 'GO_TO_SUCCESS' });
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      dispatch({ type: 'SET_CREATION_ERROR', payload: err instanceof Error ? err.message : 'Failed to create tasks' });
    } finally {
      dispatch({ type: 'SET_CREATING', payload: false });
    }
  };

    const hasValidationErrors = state.editedTasks.some(task => 
    task.errors && Object.keys(task.errors).length > 0
  );

  const handleTasksChange = (tasks: EditableGeneratedTask[]) => {
    dispatch({ type: 'SET_EDITED_TASKS', payload: tasks });
  };

  const handleBack = () => {
    dispatch({ type: 'GO_BACK' });
  };

  const handleClose = () => {
    if (canClose(state)) {
      dispatch({ type: 'RESET_STATE' });
      onClose();
    }
  };

  const phases: { value: PhaseEnum; label: string }[] = [
    { value: 'Research', label: 'Research' },
    { value: 'MVP', label: 'MVP' },
    { value: 'Growth', label: 'Growth' },
    { value: 'Scale', label: 'Scale' },
    { value: 'Transition', label: 'Transition' }
  ];

  const getEnergyLabel = (level: number) => {
    if (level <= 2) return 'Very Low';
    if (level <= 4) return 'Low';
    if (level <= 6) return 'Medium';
    if (level <= 8) return 'High';
    return 'Very High';
  };

  const renderInitialContent = () => (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Energy Level Slider */}
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="energy-level" className="text-sm sm:text-base">
            Energy Level: {state.energyLevel}/10 ({getEnergyLabel(state.energyLevel)})
          </Label>
          <Slider
            id="energy-level"
            value={[state.energyLevel]}
            onValueChange={(value) => dispatch({ type: 'SET_ENERGY_LEVEL', payload: value[0] })}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Very Low</span>
            <span>Very High</span>
          </div>
        </div>

        {/* Phase Selection */}
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="current-phase" className="text-sm sm:text-base">Current Phase (Optional)</Label>
          <Select
            value={state.currentPhase || 'none'}
            onValueChange={(value) => dispatch({ type: 'SET_CURRENT_PHASE', payload: value === 'none' ? null : value })}
            disabled={state.isGenerating}
          >
            <SelectTrigger className={`${state.formErrors.phase ? "border-destructive" : ""} h-10 sm:h-10`}>
              <SelectValue placeholder="Select your current phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {phases.map((phase) => (
                <SelectItem key={phase.value} value={phase.value}>
                  {phase.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.formErrors.phase && (
            <p className="text-xs sm:text-sm text-destructive">{state.formErrors.phase}</p>
          )}
        </div>

        {/* Form Errors */}
        {(state.formErrors.energy || state.formErrors.phase) && (
          <div className="space-y-2">
            {state.formErrors.energy && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{state.formErrors.energy}</p>
              </div>
            )}
            {state.formErrors.phase && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{state.formErrors.phase}</p>
              </div>
            )}
          </div>
        )}

        {/* Generation Error */}
        <ErrorDisplay 
          error={state.generationError} 
          onDismiss={() => dispatch({ type: 'SET_GENERATION_ERROR', payload: null })}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={state.isGenerating}
            className="w-full sm:w-auto h-10 sm:h-10 text-sm sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={state.isGenerating}
            className="flex items-center gap-2 w-full sm:w-auto h-10 sm:h-10 text-sm sm:text-sm"
          >
            {state.isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating Tasks...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Tasks
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );

  const renderPreviewContent = () => (
    <>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">Review and Edit Tasks</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={state.isCreating}
            className="flex items-center gap-2 min-h-[36px] sm:min-h-[36px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Editable Task List */}
        <EditableTaskList
          tasks={state.editedTasks}
          onTasksChange={handleTasksChange}
        />

        {/* Creation Error */}
        <ErrorDisplay 
          error={state.creationError} 
          onDismiss={() => dispatch({ type: 'SET_CREATION_ERROR', payload: null })}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={state.isCreating}
            className="w-full sm:w-auto h-10 sm:h-10 text-sm sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTasks}
            disabled={state.isCreating || state.editedTasks.length === 0 || hasValidationErrors}
            className="flex items-center gap-2 w-full sm:w-auto h-10 sm:h-10 text-sm sm:text-sm"
          >
            {state.isCreating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating Tasks...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Create {state.editedTasks.length} Tasks
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );

  const renderSuccessContent = () => (
    <>
      <div className="space-y-4 sm:space-y-6 text-center">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-green-600">
              Tasks Created Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {state.editedTasks.length} task{state.editedTasks.length !== 1 ? 's' : ''} have been created and added to your task list.
            </p>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          This dialog will close automatically...
        </div>
      </div>
    </>
  );

  // Add keyboard shortcuts
  const { getKeyboardShortcuts } = useDialogKeyboard({
    currentState: state.currentState,
    onClose: handleClose,
    onBack: handleBack,
    onGenerate: handleGenerate,
    onCreate: handleCreateTasks,
    isGenerating: state.isGenerating,
    isCreating: state.isCreating,
    hasValidationErrors,
    canCreate: state.editedTasks.length > 0 && !hasValidationErrors
  });

  const keyboardShortcuts = getKeyboardShortcuts();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-4xl mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            <h2 className="text-base sm:text-lg font-semibold">
              {getStateTitle(state.currentState)}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 min-h-[32px] sm:min-h-[32px]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Description */}
        <div className="px-4 sm:px-6 pt-2 pb-3 sm:pb-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {state.currentState === DialogState.INITIAL && "Configure your energy level and phase to generate personalized daily tasks."}
            {state.currentState === DialogState.PREVIEW && "Review and edit the generated tasks before creating them."}
            {state.currentState === DialogState.SUCCESS && "Your tasks have been successfully created!"}
          </p>
        </div>
        
        {/* Workflow Progress */}
        <div className="px-4 sm:px-6">
          <WorkflowProgress 
            currentStep={getCurrentStep(state.currentState)} 
          />
        </div>
        
        {/* Keyboard Shortcuts - Hidden on Mobile */}
        <div className="hidden sm:block px-4 sm:px-6 mt-2">
          <KeyboardShortcutsDisplay shortcuts={keyboardShortcuts} />
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6 pt-3 sm:pt-4 relative">
          {state.currentState === DialogState.SUCCESS
            ? renderSuccessContent() 
            : state.currentState === DialogState.PREVIEW
            ? renderPreviewContent() 
            : renderInitialContent()
          }
          
          {/* Loading Overlay */}
          <LoadingOverlay
            isVisible={state.isGenerating || state.isCreating}
            message={state.isGenerating ? 'Generating tasks...' : 'Creating tasks...'}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerateDailyTasksDialog;


