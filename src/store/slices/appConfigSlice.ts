import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { APP_CONFIG } from '@/config/app';
import type { AppConfigState } from '../types';

// Initial state based on current AppContext
const initialState: AppConfigState = {
  userId: APP_CONFIG.userId,
  config: APP_CONFIG,
};

// Create the slice
const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    // Update user ID
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    
    // Update config
    updateConfig: (state, action: PayloadAction<Partial<typeof APP_CONFIG>>) => {
      state.config = { ...state.config, ...action.payload };
    },
    
    // Reset to initial state
    resetAppConfig: (state) => {
      state.userId = initialState.userId;
      state.config = initialState.config;
    },
  },
});

// Export actions
export const { setUserId, updateConfig, resetAppConfig } = appConfigSlice.actions;

// Export reducer
export default appConfigSlice.reducer;

// Basic selectors
export const selectUserId = (state: { appConfig: AppConfigState }) => state.appConfig.userId;
export const selectConfig = (state: { appConfig: AppConfigState }) => state.appConfig.config;
export const selectWebSocketUrl = (state: { appConfig: AppConfigState }) => state.appConfig.config.webSocketUrl;
export const selectApiBaseUrl = (state: { appConfig: AppConfigState }) => state.appConfig.config.apiBaseUrl;

// Memoized selectors for better performance
export const selectAppConfigState = createSelector(
  [selectUserId, selectConfig],
  (userId, config) => ({ userId, config })
);

export const selectWebSocketConfig = createSelector(
  [selectWebSocketUrl, selectUserId],
  (webSocketUrl, userId) => ({
    url: webSocketUrl + '/api/v1/ws',
    userId,
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  })
);

export const selectApiConfig = createSelector(
  [selectApiBaseUrl, selectUserId],
  (apiBaseUrl, userId) => ({
    baseUrl: apiBaseUrl,
    userId,
    headers: {
      'Content-Type': 'application/json',
    }
  })
);
