import React, { useEffect } from 'react';
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
import { useDialogs } from '../../hooks/redux/useDialogs';
import { useDialogKeyboard } from './useDialogKeyboard';
import type { PhaseEnum } from '../../client/models';
import type { GeneratedTask, EditableGeneratedTask } from '../../store/types';
import { DialogStateEnum } from '../../store/types';

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
  const {
    currentState,
    energyLevel,
    currentPhase,
    generatedTasks,
    editedTasks,
    isGenerating,
    isCreating,
    isSuccess,
    generationError,
    creationError,
    formErrors,
    updateDialogState,
    updateEnergyLevel,
    updateCurrentPhase,
    updateGeneratedTasks,
    updateEditedTasks,
    updateGenerating,
    updateCreating,
    updateSuccess,
    updateGenerationError,
    updateCreationError,
    updateFormErrors,
    resetDialog,
    handleGoBack,
    handleGoToPreview,
    handleGoToSuccess,
    handleUpdateEditedTask,
    handleRemoveEditedTask,
  } = useDialogs();
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      resetDialog();
    }
  }, [open, resetDialog]);

  const handleGenerate = async () => {
    updateGenerationError(null);
    updateFormErrors({});
    
    const validationErrors = validateGenerationParams(energyLevel.toString(), currentPhase || '');
    
    if (Object.keys(validationErrors).length > 0) {
      updateFormErrors(validationErrors);
      return;
    }
    
    updateGenerating(true);
    try {
      const tasks = await onGenerate({ energyLevel, currentPhase: currentPhase as PhaseEnum | null });
      updateGeneratedTasks(tasks);
      // Convert GeneratedTask[] to EditableGeneratedTask[] by adding id
      const editableTasks: EditableGeneratedTask[] = tasks.map((task, index) => ({
        ...task,
        id: `generated-${index}`,
      }));
      updateEditedTasks(editableTasks);
      handleGoToPreview();
    } catch (err) {
      updateGenerationError(err instanceof Error ? err.message : 'Failed to generate tasks');
    } finally {
      updateGenerating(false);
    }
  };

  const handleCreateTasks = async () => {
    updateCreationError(null);
    updateCreating(true);
    try {
      // Convert EditableGeneratedTask[] to GeneratedTask[] by removing id
      const tasksToCreate: GeneratedTask[] = editedTasks.map(({ id, ...task }) => task);
      await onCreateTasks(tasksToCreate);
      handleGoToSuccess();
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      updateCreationError(err instanceof Error ? err.message : 'Failed to create tasks' );
    } finally {
      updateCreating(false);
    }
  };

    const hasValidationErrors = false; // TODO: Implement validation errors in Redux

  const handleTasksChange = (tasks: EditableGeneratedTask[]) => {
    updateEditedTasks(tasks);
  };

  const handleBack = () => {
    handleGoBack();
  };

  const handleClose = () => {
    resetDialog();
    onClose();
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
            Energy Level: {energyLevel}/10 ({getEnergyLabel(energyLevel)})
          </Label>
          <Slider
            id="energy-level"
            value={[energyLevel]}
            onValueChange={(value) => updateEnergyLevel(value[0])}
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
            value={currentPhase || 'none'}
            onValueChange={(value) => updateCurrentPhase(value === 'none' ? null : value)}
            disabled={isGenerating}
          >
            <SelectTrigger className={`${formErrors.phase ? "border-destructive" : ""} h-10 sm:h-10`}>
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
          {formErrors.phase && (
            <p className="text-xs sm:text-sm text-destructive">{formErrors.phase}</p>
          )}
        </div>

        {/* Form Errors */}
        {(formErrors.energy || formErrors.phase) && (
          <div className="space-y-2">
            {formErrors.energy && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{formErrors.energy}</p>
              </div>
            )}
            {formErrors.phase && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{formErrors.phase}</p>
              </div>
            )}
          </div>
        )}

        {/* Generation Error */}
        <ErrorDisplay 
          error={generationError} 
          onDismiss={() => updateGenerationError(null)}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isGenerating}
            className="w-full sm:w-auto h-10 sm:h-10 text-sm sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 w-full sm:w-auto h-10 sm:h-10 text-sm sm:text-sm"
          >
            {isGenerating ? (
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
            disabled={isCreating}
            className="flex items-center gap-2 min-h-[36px] sm:min-h-[36px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Editable Task List */}
        <EditableTaskList
          tasks={editedTasks}
          onTasksChange={handleTasksChange}
        />

        {/* Creation Error */}
        <ErrorDisplay 
          error={creationError} 
          onDismiss={() => updateCreationError(null)}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
            className="w-full sm:w-auto h-10 sm:h-10 text-sm sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTasks}
            disabled={isCreating || editedTasks.length === 0 || hasValidationErrors}
            className="flex items-center gap-2 w-full sm:w-auto h-10 sm:h-10 text-sm sm:text-sm"
          >
            {isCreating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating Tasks...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Create {editedTasks.length} Tasks
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
              {editedTasks.length} task{editedTasks.length !== 1 ? 's' : ''} have been created and added to your task list.
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
    currentState: currentState,
    onClose: handleClose,
    onBack: handleBack,
    onGenerate: handleGenerate,
    onCreate: handleCreateTasks,
    isGenerating: isGenerating,
    isCreating: isCreating,
    hasValidationErrors,
    canCreate: editedTasks.length > 0 && !hasValidationErrors
  });

  const keyboardShortcuts = getKeyboardShortcuts();

  // Helper functions for state management
  const getStateTitle = (state: DialogStateEnum): string => {
    switch (state) {
      case DialogStateEnum.INITIAL:
        return 'Generate Daily Tasks';
      case DialogStateEnum.PREVIEW:
        return 'Review Tasks';
      case DialogStateEnum.SUCCESS:
        return 'Success!';
      default:
        return 'Generate Daily Tasks';
    }
  };

  const getCurrentStep = (state: DialogStateEnum): number => {
    switch (state) {
      case DialogStateEnum.INITIAL:
        return 1;
      case DialogStateEnum.PREVIEW:
        return 2;
      case DialogStateEnum.SUCCESS:
        return 3;
      default:
        return 1;
    }
  };

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
              {getStateTitle(currentState)}
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
            {currentState === DialogStateEnum.INITIAL && "Configure your energy level and phase to generate personalized daily tasks."}
            {currentState === DialogStateEnum.PREVIEW && "Review and edit the generated tasks before creating them."}
            {currentState === DialogStateEnum.SUCCESS && "Your tasks have been successfully created!"}
          </p>
        </div>
        
        {/* Workflow Progress */}
        <div className="px-4 sm:px-6">
          <WorkflowProgress 
            currentStep={getCurrentStep(currentState)} 
          />
        </div>
        
        {/* Keyboard Shortcuts - Hidden on Mobile */}
        <div className="hidden sm:block px-4 sm:px-6 mt-2">
          <KeyboardShortcutsDisplay shortcuts={keyboardShortcuts} />
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6 pt-3 sm:pt-4 relative">
          {currentState === DialogStateEnum.SUCCESS
            ? renderSuccessContent() 
            : currentState === DialogStateEnum.PREVIEW
            ? renderPreviewContent() 
            : renderInitialContent()
          }
          
          {/* Loading Overlay */}
          <LoadingOverlay
            isVisible={isGenerating || isCreating}
            message={isGenerating ? 'Generating tasks...' : 'Creating tasks...'}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerateDailyTasksDialog;


