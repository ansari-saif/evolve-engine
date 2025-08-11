import { useEffect, useCallback } from 'react';
import { DialogState } from './DialogStateManager';

interface UseDialogKeyboardProps {
  currentState: DialogState;
  onClose: () => void;
  onBack: () => void;
  onGenerate?: () => void;
  onCreate?: () => void;
  isGenerating?: boolean;
  isCreating?: boolean;
  hasValidationErrors?: boolean;
  canCreate?: boolean;
}

export const useDialogKeyboard = ({
  currentState,
  onClose,
  onBack,
  onGenerate,
  onCreate,
  isGenerating = false,
  isCreating = false,
  hasValidationErrors = false,
  canCreate = false
}: UseDialogKeyboardProps) => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent keyboard shortcuts when user is typing in input fields
    const activeElement = document.activeElement;
    const isInputField = activeElement?.tagName === 'INPUT' || 
                        activeElement?.tagName === 'TEXTAREA' || 
                        activeElement?.tagName === 'SELECT' ||
                        activeElement?.getAttribute('contenteditable') === 'true';
    
    if (isInputField) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        // ESC to close dialog (if not in loading state)
        if (!isGenerating && !isCreating) {
          event.preventDefault();
          onClose();
        }
        break;
        
      case 'Backspace':
        // Backspace to go back (only in preview state)
        if (currentState === DialogState.PREVIEW && !isCreating) {
          event.preventDefault();
          onBack();
        }
        break;
        
      case 'Enter':
        // Enter to proceed to next step
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          
          switch (currentState) {
            case DialogState.INITIAL:
              if (onGenerate && !isGenerating) {
                onGenerate();
              }
              break;
            case DialogState.PREVIEW:
              if (onCreate && !isCreating && canCreate && !hasValidationErrors) {
                onCreate();
              }
              break;
            case DialogState.SUCCESS:
              onClose();
              break;
          }
        }
        break;
        
      case 'g':
      case 'G':
        // Ctrl/Cmd + G to generate tasks (only in initial state)
        if ((event.ctrlKey || event.metaKey) && currentState === DialogState.INITIAL && !isGenerating) {
          event.preventDefault();
          if (onGenerate) {
            onGenerate();
          }
        }
        break;
        
      case 'c':
      case 'C':
        // Ctrl/Cmd + C to create tasks (only in preview state)
        if ((event.ctrlKey || event.metaKey) && currentState === DialogState.PREVIEW && !isCreating && canCreate && !hasValidationErrors) {
          event.preventDefault();
          if (onCreate) {
            onCreate();
          }
        }
        break;
        
      case 'b':
      case 'B':
        // Ctrl/Cmd + B to go back (only in preview state)
        if ((event.ctrlKey || event.metaKey) && currentState === DialogState.PREVIEW && !isCreating) {
          event.preventDefault();
          onBack();
        }
        break;
    }
  }, [
    currentState,
    onClose,
    onBack,
    onGenerate,
    onCreate,
    isGenerating,
    isCreating,
    hasValidationErrors,
    canCreate
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return keyboard shortcuts info for UI display
  const getKeyboardShortcuts = () => {
    const shortcuts = [];
    
    switch (currentState) {
      case DialogState.INITIAL:
        if (!isGenerating) {
          shortcuts.push({ key: 'Ctrl/Cmd + G', action: 'Generate Tasks' });
        }
        shortcuts.push({ key: 'ESC', action: 'Close Dialog' });
        break;
        
      case DialogState.PREVIEW:
        if (!isCreating && canCreate && !hasValidationErrors) {
          shortcuts.push({ key: 'Ctrl/Cmd + C', action: 'Create Tasks' });
        }
        if (!isCreating) {
          shortcuts.push({ key: 'Ctrl/Cmd + B', action: 'Go Back' });
        }
        shortcuts.push({ key: 'ESC', action: 'Close Dialog' });
        break;
        
      case DialogState.SUCCESS:
        shortcuts.push({ key: 'Enter', action: 'Close Dialog' });
        shortcuts.push({ key: 'ESC', action: 'Close Dialog' });
        break;
    }
    
    return shortcuts;
  };

  return {
    getKeyboardShortcuts
  };
};
