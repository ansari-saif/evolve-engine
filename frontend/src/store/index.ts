import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createLogger } from 'redux-logger';

// Import slices (we'll create these next)
import appConfigReducer from './slices/appConfigSlice';
import dialogReducer from './slices/dialogSlice';
import uiReducer from './slices/uiSlice';
import optimisticUpdatesReducer from './slices/optimisticUpdatesSlice';
import formReducer from './slices/formSlice';
import navigationReducer from './slices/navigationSlice';
import taskUiReducer from './slices/taskUiSlice';

// Import types
import type { RootState } from './types';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['appConfig', 'ui', 'navigation'], // Only persist these slices
  blacklist: ['dialog', 'optimisticUpdates', 'form'] // Don't persist these
};

// Combine all reducers
const rootReducer = combineReducers({
  appConfig: appConfigReducer,
  dialog: dialogReducer,
  ui: uiReducer,
  optimisticUpdates: optimisticUpdatesReducer,
  form: formReducer,
  navigation: navigationReducer,
  taskUi: taskUiReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure logger middleware for development
const logger = createLogger({
  collapsed: true,
  duration: true,
  timestamp: true,
  colors: {
    title: () => '#139BFE',
    prevState: () => '#9C9C9C',
    action: () => '#149945',
    nextState: () => '#A47104',
    error: () => '#FF0000',
  },
});

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['ui.toasts'], // Ignore toast onClick functions
      },
    });

    // Add logger in development
    if (process.env.NODE_ENV === 'development') {
      middleware.push(logger);
    }

    return middleware;
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type { RootState } from './types';

// Export selectors
export const selectAppConfig = (state: RootState) => state.appConfig;
export const selectDialog = (state: RootState) => state.dialog;
export const selectUI = (state: RootState) => state.ui;
export const selectOptimisticUpdates = (state: RootState) => state.optimisticUpdates;
export const selectForm = (state: RootState) => state.form;
export const selectNavigation = (state: RootState) => state.navigation;
