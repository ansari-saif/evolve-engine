import { useEffect, useCallback, useRef } from 'react';
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
  
  // Use refs to store current values to avoid recreating the callback
  const stateRef = useRef({
    currentState,
    isGenerating,
    isCreating,
    hasValidationErrors,
    canCreate,
    onClose,
    onBack,
    onGenerate,
    onCreate
  });
  
  // Update refs when props change
  useEffect(() => {
    stateRef.current = {
      currentState,
      isGenerating,
      isCreating,
      hasValidationErrors,
      canCreate,
      onClose,
      onBack,
      onGenerate,
      onCreate
    };
  });
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const state = stateRef.current;
    
    // Debug logging
    console.log('🔍 Keyboard event:', event.key, 'Ctrl:', event.ctrlKey, 'Meta:', event.metaKey, 'Current state:', state.currentState);
    
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
        if (!state.isGenerating && !state.isCreating) {
          event.preventDefault();
          state.onClose();
        }
        break;
        
      case 'Backspace':
        // Backspace to go back (only in preview state)
        if (state.currentState === DialogStateEnum.PREVIEW && !state.isCreating) {
          event.preventDefault();
          state.onBack();
        }
        break;
        
      case 'Enter':
        // Enter to proceed to next step
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          
          switch (state.currentState) {
            case DialogStateEnum.INITIAL:
              if (state.onGenerate && !state.isGenerating) {
                state.onGenerate();
              }
              break;
            case DialogStateEnum.PREVIEW:
              if (state.onCreate && !state.isCreating && state.canCreate && !state.hasValidationErrors) {
                state.onCreate();
              }
              break;
            case DialogStateEnum.SUCCESS:
              state.onClose();
              break;
          }
        }
        break;
        
      case 'g':
      case 'G':
        // Ctrl/Cmd + G to generate tasks (only in initial state)
        console.log('🔍 G key pressed - checking conditions:', {
          ctrlOrMeta: event.ctrlKey || event.metaKey,
          currentState: state.currentState,
          isInitial: state.currentState === DialogStateEnum.INITIAL,
          notGenerating: !state.isGenerating
        });
        if ((event.ctrlKey || event.metaKey) && state.currentState === DialogStateEnum.INITIAL && !state.isGenerating) {
          console.log('✅ Ctrl/Cmd + G shortcut triggered!');
          event.preventDefault();
          if (state.onGenerate) {
            state.onGenerate();
          }
        }
        break;
        
      case 'c':
      case 'C':
        // Ctrl/Cmd + C to create tasks (only in preview state)
        if ((event.ctrlKey || event.metaKey) && state.currentState === DialogStateEnum.PREVIEW && !state.isCreating && state.canCreate && !state.hasValidationErrors) {
          event.preventDefault();
          if (state.onCreate) {
            state.onCreate();
          }
        }
        break;
        
      case 'b':
      case 'B':
        // Ctrl/Cmd + B to go back (only in preview state)
        if ((event.ctrlKey || event.metaKey) && state.currentState === DialogStateEnum.PREVIEW && !state.isCreating) {
          event.preventDefault();
          state.onBack();
        }
        break;
    }
  }, []);

  useEffect(() => {
    console.log('🎹 Attaching keyboard event listener for state:', currentState);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      console.log('🎹 Removing keyboard event listener');
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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


