import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import appConfigReducer, { setUserId, selectUserId } from '../../store/slices/appConfigSlice';
import uiReducer, { addToast, selectToasts } from '../../store/slices/uiSlice';
import dialogReducer, { setEnergyLevel, selectEnergyLevel } from '../../store/slices/dialogSlice';

// Create a test store with minimal configuration
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      appConfig: appConfigReducer,
      ui: uiReducer,
      dialog: dialogReducer,
    },
    preloadedState,
  });
};

describe('Redux Store Configuration', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('should initialize with default state', () => {
    const state = store.getState();
    
    // Check appConfig slice
    expect(state.appConfig.userId).toBeDefined();
    expect(state.appConfig.config).toBeDefined();
    
    // Check ui slice
    expect(state.ui.toasts).toEqual([]);
    expect(state.ui.loadingStates).toEqual({});
    expect(state.ui.modals).toEqual({});
    expect(state.ui.sidebar.isOpen).toBe(false);
    
    // Check dialog slice
    expect(state.dialog.currentState).toBe('INITIAL');
    expect(state.dialog.energyLevel).toBe(5);
    expect(state.dialog.isGenerating).toBe(false);
  });

  it('should handle appConfig actions', () => {
    // Test setUserId action
    store.dispatch(setUserId('test-user-123'));
    
    const state = store.getState();
    expect(state.appConfig.userId).toBe('test-user-123');
    
    // Test selector
    const userId = selectUserId(state);
    expect(userId).toBe('test-user-123');
  });

  it('should handle ui actions', () => {
    // Test addToast action
    store.dispatch(addToast({
      toast: {
        title: 'Test Toast',
        description: 'This is a test toast',
        open: true,
      }
    }));
    
    const state = store.getState();
    expect(state.ui.toasts).toHaveLength(1);
    expect(state.ui.toasts[0].title).toBe('Test Toast');
    
    // Test selector
    const toasts = selectToasts(state);
    expect(toasts).toHaveLength(1);
  });

  it('should handle dialog actions', () => {
    // Test setEnergyLevel action
    store.dispatch(setEnergyLevel({ energyLevel: 8 }));
    
    const state = store.getState();
    expect(state.dialog.energyLevel).toBe(8);
    
    // Test selector
    const energyLevel = selectEnergyLevel(state);
    expect(energyLevel).toBe(8);
  });

  it('should maintain state immutability', () => {
    const initialState = store.getState();
    
    // Dispatch an action
    store.dispatch(setUserId('new-user'));
    
    // Original state should not be mutated
    expect(initialState.appConfig.userId).not.toBe('new-user');
    
    // New state should be different
    const newState = store.getState();
    expect(newState.appConfig.userId).toBe('new-user');
    expect(newState).not.toBe(initialState);
  });
});
