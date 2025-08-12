import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { NavigationState, BreadcrumbItem, NavigatePayload } from '../types';

const initialState: NavigationState = {
  currentRoute: '/',
  previousRoute: null,
  navigationHistory: ['/'],
  breadcrumbs: [],
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<NavigatePayload>) => {
      const newRoute = action.payload.route;
      state.previousRoute = state.currentRoute;
      state.currentRoute = newRoute;
      state.navigationHistory.push(newRoute);
      if (state.navigationHistory.length > 10) {
        state.navigationHistory = state.navigationHistory.slice(-10);
      }
    },
    goBack: (state) => {
      if (state.navigationHistory.length > 1) {
        state.navigationHistory.pop();
        const previousRoute = state.navigationHistory[state.navigationHistory.length - 1];
        state.previousRoute = state.currentRoute;
        state.currentRoute = previousRoute;
      }
    },
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbs = action.payload;
    },
    resetNavigation: (state) => {
      return initialState;
    },
  },
});

export const { navigate, goBack, setBreadcrumbs, resetNavigation } = navigationSlice.actions;
export default navigationSlice.reducer;

export const selectCurrentRoute = (state: { navigation: NavigationState }) => state.navigation.currentRoute;
export const selectBreadcrumbs = (state: { navigation: NavigationState }) => state.navigation.breadcrumbs;
