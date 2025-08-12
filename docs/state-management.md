# Redux State Management Documentation

## Overview

This document provides comprehensive documentation for the Redux Toolkit implementation in the Evolve Engine project. The Redux store has been designed to replace scattered state management patterns with a centralized, predictable state management solution.

## Architecture

### Store Structure

The Redux store is organized into the following slices:

```
src/store/
├── index.ts                 # Main store configuration
├── types.ts                 # TypeScript type definitions
└── slices/
    ├── appConfigSlice.ts    # App configuration state
    ├── dialogSlice.ts       # Dialog and form state management
    ├── uiSlice.ts          # UI state (toasts, loading, modals)
    ├── optimisticUpdatesSlice.ts # Optimistic updates for tasks
    ├── formSlice.ts        # Form state and validation
    └── navigationSlice.ts  # Navigation and routing state
```

### Provider Setup

The Redux Provider is configured in `src/main.tsx`:

```tsx
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
```

## Slices Documentation

### 1. AppConfig Slice

**Purpose**: Manages application configuration and user settings.

**State Structure**:
```typescript
interface AppConfigState {
  userId: string;
  config: typeof APP_CONFIG;
}
```

**Key Actions**:
- `setUserId(userId: string)` - Update user ID
- `updateConfig(updates: Partial<APP_CONFIG>)` - Update configuration
- `resetAppConfig()` - Reset to initial state

**Selectors**:
- `selectUserId` - Get current user ID
- `selectConfig` - Get full configuration
- `selectWebSocketUrl` - Get WebSocket URL
- `selectApiBaseUrl` - Get API base URL
- `selectAppConfigState` - Memoized selector for full state
- `selectWebSocketConfig` - Memoized selector for WebSocket config
- `selectApiConfig` - Memoized selector for API config

**Usage Example**:
```tsx
import { useAppConfig } from '@/hooks/redux/useAppConfig';

const MyComponent = () => {
  const { userId, webSocketUrl, updateUserId } = useAppConfig();
  
  return (
    <div>
      <p>User ID: {userId}</p>
      <button onClick={() => updateUserId('new-user-id')}>
        Update User
      </button>
    </div>
  );
};
```

### 2. Dialog Slice

**Purpose**: Manages dialog states, form data, and workflow progression.

**State Structure**:
```typescript
interface DialogState {
  currentState: DialogStateEnum;
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
```

**Key Actions**:
- `setDialogState(state: DialogStateEnum)` - Set current dialog state
- `setEnergyLevel(level: number)` - Update energy level
- `setCurrentPhase(phase: string | null)` - Update current phase
- `setGeneratedTasks(tasks: GeneratedTask[])` - Set generated tasks
- `setEditedTasks(tasks: EditableGeneratedTask[])` - Set edited tasks
- `setGenerating(generating: boolean)` - Set generation state
- `setCreating(creating: boolean)` - Set creation state
- `setSuccess(success: boolean)` - Set success state
- `setGenerationError(error: string | null)` - Set generation error
- `setCreationError(error: string | null)` - Set creation error
- `setFormErrors(errors: object)` - Set form validation errors
- `resetDialogState()` - Reset to initial state
- `goBack()` - Go back to previous state
- `goToPreview()` - Go to preview state
- `goToSuccess()` - Go to success state

**Usage Example**:
```tsx
import { useDialogs } from '@/hooks/redux/useDialogs';

const DialogComponent = () => {
  const {
    currentState,
    energyLevel,
    isGenerating,
    updateEnergyLevel,
    updateGenerating,
    handleGoToPreview
  } = useDialogs();
  
  return (
    <div>
      <p>Current State: {currentState}</p>
      <p>Energy Level: {energyLevel}</p>
      {isGenerating && <p>Generating tasks...</p>}
    </div>
  );
};
```

### 3. UI Slice

**Purpose**: Manages UI state including toasts, loading states, modals, and sidebar.

**State Structure**:
```typescript
interface UIState {
  toasts: ToastState[];
  loadingStates: Record<string, boolean>;
  modals: Record<string, boolean>;
  sidebar: {
    isOpen: boolean;
    activeTab: string;
  };
}
```

**Key Actions**:
- `addToast(toast: Omit<ToastState, 'id'>)` - Add new toast
- `updateToast(id: string, updates: Partial<ToastState>)` - Update toast
- `dismissToast(id: string)` - Dismiss toast
- `removeToast(id: string)` - Remove toast
- `clearAllToasts()` - Clear all toasts
- `setLoading(key: string, isLoading: boolean)` - Set loading state
- `clearLoading(key: string)` - Clear loading state
- `openModal(key: string)` - Open modal
- `closeModal(key: string)` - Close modal
- `toggleModal(key: string)` - Toggle modal
- `openSidebar()` - Open sidebar
- `closeSidebar()` - Close sidebar
- `toggleSidebar()` - Toggle sidebar
- `setSidebarTab(tab: string)` - Set sidebar active tab

**Selectors**:
- `selectToasts` - Get all toasts
- `selectActiveToasts` - Get only open toasts
- `selectToastCount` - Get total toast count
- `selectActiveToastCount` - Get active toast count
- `selectIsAnyModalOpen` - Check if any modal is open
- `selectOpenModals` - Get list of open modals
- `selectIsLoading(key)` - Check specific loading state
- `selectIsModalOpen(key)` - Check specific modal state
- `selectIsSidebarOpen` - Check sidebar state
- `selectSidebarActiveTab` - Get sidebar active tab

**Usage Example**:
```tsx
import { useToasts } from '@/hooks/redux/useToasts';

const ToastExample = () => {
  const { showSuccessToast, showErrorToast, toasts } = useToasts();
  
  const handleSuccess = () => {
    showSuccessToast('Success!', 'Operation completed successfully.');
  };
  
  const handleError = () => {
    showErrorToast('Error!', 'Something went wrong.');
  };
  
  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <p>Active toasts: {toasts.filter(t => t.open).length}</p>
    </div>
  );
};
```

### 4. Optimistic Updates Slice

**Purpose**: Manages optimistic updates for tasks and pending operations.

**State Structure**:
```typescript
interface OptimisticUpdatesState {
  optimisticTasks: OptimisticTask[];
  pendingOperations: Record<string, PendingOperation>;
}
```

**Key Actions**:
- `addOptimisticTask(task: OptimisticTask)` - Add optimistic task
- `confirmTask(taskId: number, confirmedTask: any)` - Confirm task
- `removeOptimisticTask(taskId: number)` - Remove optimistic task
- `clearOptimisticTasks()` - Clear all optimistic tasks
- `addPendingOperation(operation: PendingOperation)` - Add pending operation
- `removePendingOperation(operationId: string)` - Remove pending operation
- `clearPendingOperations()` - Clear all pending operations
- `updateOptimisticTask(taskId: number, updates: Partial<OptimisticTask>)` - Update optimistic task

**Usage Example**:
```tsx
import { useSelector } from 'react-redux';
import { selectOptimisticTasks, selectHasOptimisticTasks } from '@/store/slices/optimisticUpdatesSlice';

const TaskList = () => {
  const optimisticTasks = useSelector(selectOptimisticTasks);
  const hasOptimisticTasks = useSelector(selectHasOptimisticTasks);
  
  return (
    <div>
      {hasOptimisticTasks && <p>Processing tasks...</p>}
      {optimisticTasks.map(task => (
        <div key={task.task_id} className="opacity-50">
          {task.description} (Optimistic)
        </div>
      ))}
    </div>
  );
};
```

### 5. Form Slice

**Purpose**: Manages form states, validation errors, and submission states.

**State Structure**:
```typescript
interface FormState {
  forms: Record<string, FormData>;
  validationErrors: Record<string, Record<string, string>>;
  isSubmitting: Record<string, boolean>;
}
```

**Key Actions**:
- `setFormData(formId: string, data: Partial<FormData>)` - Set form data
- `setFormField(formId: string, field: string, value: any)` - Set form field
- `setFieldTouched(formId: string, field: string, touched: boolean)` - Set field touched
- `setFieldError(formId: string, field: string, error: string)` - Set field error
- `setValidationErrors(formId: string, errors: Record<string, string>)` - Set validation errors
- `clearFormErrors(formId: string)` - Clear form errors
- `setFormSubmitting(formId: string, isSubmitting: boolean)` - Set submission state
- `resetForm(formId: string)` - Reset form
- `resetAllForms()` - Reset all forms

**Usage Example**:
```tsx
import { useSelector } from 'react-redux';
import { selectForm, selectFormField, selectIsFormSubmitting } from '@/store/slices/formSlice';

const MyForm = () => {
  const formData = useSelector(selectForm('myForm'));
  const email = useSelector(selectFormField('myForm', 'email'));
  const isSubmitting = useSelector(selectIsFormSubmitting('myForm'));
  
  return (
    <form>
      <input 
        value={email || ''} 
        onChange={(e) => setFormField('myForm', 'email', e.target.value)}
      />
      {isSubmitting && <p>Submitting...</p>}
    </form>
  );
};
```

### 6. Navigation Slice

**Purpose**: Manages navigation state, routing history, and breadcrumbs.

**State Structure**:
```typescript
interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  navigationHistory: string[];
  breadcrumbs: BreadcrumbItem[];
}
```

**Key Actions**:
- `navigate(route: string)` - Navigate to route
- `goBack()` - Go back in history
- `setBreadcrumbs(breadcrumbs: BreadcrumbItem[])` - Set breadcrumbs
- `resetNavigation()` - Reset navigation state

## Custom Hooks

### useAppConfig

Provides access to app configuration state and actions.

```tsx
const { userId, config, webSocketUrl, updateUserId, updateAppConfig } = useAppConfig();
```

### useDialogs

Provides access to dialog state management.

```tsx
const { 
  currentState, 
  energyLevel, 
  isGenerating, 
  updateEnergyLevel, 
  handleGoToPreview 
} = useDialogs();
```

### useToasts

Provides access to toast notifications with convenience methods.

```tsx
const { 
  toasts, 
  showSuccessToast, 
  showErrorToast, 
  showInfoToast 
} = useToasts();
```

## Performance Optimizations

### Memoized Selectors

All slices use `createSelector` from Redux Toolkit for memoized selectors:

```typescript
export const selectActiveToasts = createSelector(
  [selectToasts],
  (toasts) => toasts.filter(toast => toast.open)
);
```

### Shallow Equality

Use `shallowEqual` for complex objects to prevent unnecessary re-renders:

```tsx
import { shallowEqual } from 'react-redux';

const complexData = useSelector(selectComplexData, shallowEqual);
```

### Selective Subscriptions

Only subscribe to the specific state slices you need:

```tsx
// Good - only subscribes to specific slice
const userId = useSelector(selectUserId);

// Avoid - subscribes to entire state
const state = useSelector(state => state);
```

## Migration Guide

### From AppContext

**Before**:
```tsx
import { useAppContext } from '@/contexts/AppContext';

const { userId, config } = useAppContext();
```

**After**:
```tsx
import { useAppConfig } from '@/hooks/redux/useAppConfig';

const { userId, config } = useAppConfig();
```

### From DialogStateManager

**Before**:
```tsx
import { useReducer } from 'react';
import { dialogReducer, initialState } from './DialogStateManager';

const [state, dispatch] = useReducer(dialogReducer, initialState);
```

**After**:
```tsx
import { useDialogs } from '@/hooks/redux/useDialogs';

const { currentState, energyLevel, updateEnergyLevel } = useDialogs();
```

### From useToast

**Before**:
```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();
toast({ title: 'Success', description: 'Operation completed' });
```

**After**:
```tsx
import { useToasts } from '@/hooks/redux/useToasts';

const { showSuccessToast } = useToasts();
showSuccessToast('Success', 'Operation completed');
```

## Testing

### Unit Testing Slices

```typescript
import { configureStore } from '@reduxjs/toolkit';
import appConfigReducer, { setUserId } from './appConfigSlice';

describe('AppConfig Slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        appConfig: appConfigReducer,
      },
    });
  });

  it('should handle setUserId', () => {
    store.dispatch(setUserId('new-user-id'));
    const state = store.getState();
    expect(state.appConfig.userId).toBe('new-user-id');
  });
});
```

### Testing Components with Redux

```tsx
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      appConfig: appConfigReducer,
      ui: uiReducer,
      // ... other reducers
    },
    preloadedState,
  });
};

const renderWithRedux = (component: React.ReactElement, preloadedState = {}) => {
  const store = createTestStore(preloadedState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};
```

## Best Practices

1. **Use Custom Hooks**: Always use the provided custom hooks instead of direct `useSelector` and `useDispatch`.

2. **Memoized Selectors**: Use memoized selectors for derived state to prevent unnecessary re-renders.

3. **Action Naming**: Use descriptive action names that clearly indicate what they do.

4. **State Normalization**: Keep state normalized and avoid nested objects when possible.

5. **Error Handling**: Always handle errors in async actions and update state accordingly.

6. **Persistence**: Only persist necessary state slices to avoid performance issues.

7. **TypeScript**: Use proper TypeScript types for all actions, state, and selectors.

## Troubleshooting

### Common Issues

1. **State Not Updating**: Check if the action is being dispatched correctly and the reducer is handling it.

2. **Performance Issues**: Use React DevTools Profiler to identify unnecessary re-renders and optimize selectors.

3. **TypeScript Errors**: Ensure all action payloads match the expected types.

4. **Persistence Issues**: Check if the slice is included in the persist configuration.

### Debugging with Redux DevTools

1. Install Redux DevTools Extension
2. Open DevTools and navigate to Redux tab
3. Monitor state changes and action history
4. Use time-travel debugging to step through state changes

## Future Enhancements

1. **Redux Toolkit Query**: Consider migrating from React Query to RTK Query for server state management.

2. **Redux Saga**: Add Redux Saga for complex side effects if needed.

3. **Redux Toolkit Listener**: Use RTK Listener for cross-slice communication.

4. **Performance Monitoring**: Add performance monitoring for Redux operations.

---

For questions or issues, please refer to the Redux Toolkit documentation or create an issue in the project repository.
