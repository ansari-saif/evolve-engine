import { useEffect, useCallback } from 'react';
import { DialogStateEnum } from '../../store/types';

interface UseDialogKeyboardProps {
  currentState: DialogStateEnum;
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
    // Debug logging
    console.log('🔍 Keyboard event:', event.key, 'Ctrl:', event.ctrlKey, 'Meta:', event.metaKey, 'Current state:', currentState);
    
    // Prevent keyboard shortcuts when user is typing in input fields
    const activeElement = document.activeElement;
    const isInputField = activeElement?.tagName === 'INPUT' || 
                        activeElement?.tagName === 'TEXTAREA' || 
                        activeElement?.tagName === 'SELECT' ||
                        activeElement?.getAttribute('contenteditable') === 'true';
    
    if (isInputField) {
      console.log('🚫 Keyboard shortcut blocked - user is typing in input field');
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
        if (currentState === DialogStateEnum.PREVIEW && !isCreating) {
          event.preventDefault();
          onBack();
        }
        break;
        
      case 'Enter':
        // Enter to proceed to next step
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          
          switch (currentState) {
            case DialogStateEnum.INITIAL:
              if (onGenerate && !isGenerating) {
                onGenerate();
              }
              break;
            case DialogStateEnum.PREVIEW:
              if (onCreate && !isCreating && canCreate && !hasValidationErrors) {
                onCreate();
              }
              break;
            case DialogStateEnum.SUCCESS:
              onClose();
              break;
          }
        }
        break;
        
      case 'g':
      case 'G':
        // Ctrl/Cmd + G to generate tasks (only in initial state)
        console.log('🔍 G key pressed - checking conditions:', {
          ctrlOrMeta: event.ctrlKey || event.metaKey,
          currentState,
          isInitial: currentState === DialogStateEnum.INITIAL,
          notGenerating: !isGenerating
        });
        if ((event.ctrlKey || event.metaKey) && currentState === DialogStateEnum.INITIAL && !isGenerating) {
          console.log('✅ Ctrl/Cmd + G shortcut triggered!');
          event.preventDefault();
          if (onGenerate) {
            onGenerate();
          }
        }
        break;
        
      case 'c':
      case 'C':
        // Ctrl/Cmd + C to create tasks (only in preview state)
        if ((event.ctrlKey || event.metaKey) && currentState === DialogStateEnum.PREVIEW && !isCreating && canCreate && !hasValidationErrors) {
          event.preventDefault();
          if (onCreate) {
            onCreate();
          }
        }
        break;
        
      case 'b':
      case 'B':
        // Ctrl/Cmd + B to go back (only in preview state)
        if ((event.ctrlKey || event.metaKey) && currentState === DialogStateEnum.PREVIEW && !isCreating) {
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
    console.log('🎹 Attaching keyboard event listener for state:', currentState);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      console.log('🎹 Removing keyboard event listener');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return keyboard shortcuts info for UI display
  const getKeyboardShortcuts = () => {
    const shortcuts = [];
    
    switch (currentState) {
      case DialogStateEnum.INITIAL:
        if (!isGenerating) {
          shortcuts.push({ key: 'Ctrl/Cmd + G', action: 'Generate Tasks' });
        }
        shortcuts.push({ key: 'ESC', action: 'Close Dialog' });
        break;
        
      case DialogStateEnum.PREVIEW:
        if (!isCreating && canCreate && !hasValidationErrors) {
          shortcuts.push({ key: 'Ctrl/Cmd + C', action: 'Create Tasks' });
        }
        if (!isCreating) {
          shortcuts.push({ key: 'Ctrl/Cmd + B', action: 'Go Back' });
        }
        shortcuts.push({ key: 'ESC', action: 'Close Dialog' });
        break;
        
      case DialogStateEnum.SUCCESS:
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
