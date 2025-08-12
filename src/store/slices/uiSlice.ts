import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { 
  UIState, 
  ToastState, 
  AddToastPayload, 
  UpdateToastPayload,
  LoadingStateKey,
  ModalKey
} from '../types';

// Initial state
const initialState: UIState = {
  toasts: [],
  loadingStates: {},
  modals: {},
  sidebar: {
    isOpen: false,
    activeTab: 'dashboard',
  },
};

// Create the slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toast actions
    addToast: (state, action: PayloadAction<AddToastPayload>) => {
      const newToast: ToastState = {
        id: crypto.randomUUID(),
        ...action.payload.toast,
      };
      state.toasts.unshift(newToast);
      
      // Limit to 5 toasts
      if (state.toasts.length > 5) {
        state.toasts = state.toasts.slice(0, 5);
      }
    },
    
    updateToast: (state, action: PayloadAction<UpdateToastPayload>) => {
      const { id, updates } = action.payload;
      const toastIndex = state.toasts.findIndex(toast => toast.id === id);
      if (toastIndex !== -1) {
        state.toasts[toastIndex] = { ...state.toasts[toastIndex], ...updates };
      }
    },
    
    dismissToast: (state, action: PayloadAction<string>) => {
      const toastId = action.payload;
      const toastIndex = state.toasts.findIndex(toast => toast.id === toastId);
      if (toastIndex !== -1) {
        state.toasts[toastIndex].open = false;
      }
    },
    
    removeToast: (state, action: PayloadAction<string>) => {
      const toastId = action.payload;
      state.toasts = state.toasts.filter(toast => toast.id !== toastId);
    },
    
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    
    // Loading state actions
    setLoading: (state, action: PayloadAction<{ key: LoadingStateKey; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload;
      state.loadingStates[key] = isLoading;
    },
    
    clearLoading: (state, action: PayloadAction<LoadingStateKey>) => {
      const key = action.payload;
      delete state.loadingStates[key];
    },
    
    clearAllLoading: (state) => {
      state.loadingStates = {};
    },
    
    // Modal actions
    openModal: (state, action: PayloadAction<ModalKey>) => {
      const modalKey = action.payload;
      state.modals[modalKey] = true;
    },
    
    closeModal: (state, action: PayloadAction<ModalKey>) => {
      const modalKey = action.payload;
      state.modals[modalKey] = false;
    },
    
    toggleModal: (state, action: PayloadAction<ModalKey>) => {
      const modalKey = action.payload;
      state.modals[modalKey] = !state.modals[modalKey];
    },
    
    closeAllModals: (state) => {
      state.modals = {};
    },
    
    // Sidebar actions
    openSidebar: (state) => {
      state.sidebar.isOpen = true;
    },
    
    closeSidebar: (state) => {
      state.sidebar.isOpen = false;
    },
    
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    
    setSidebarTab: (state, action: PayloadAction<string>) => {
      state.sidebar.activeTab = action.payload;
    },
    
    // Reset UI state
    resetUI: (state) => {
      return initialState;
    },
  },
});

// Export actions
export const {
  addToast,
  updateToast,
  dismissToast,
  removeToast,
  clearAllToasts,
  setLoading,
  clearLoading,
  clearAllLoading,
  openModal,
  closeModal,
  toggleModal,
  closeAllModals,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  setSidebarTab,
  resetUI,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;

// Memoized selectors for better performance
export const selectToasts = createSelector(
  [(state: { ui: UIState }) => state.ui.toasts],
  (toasts) => toasts
);

export const selectLoadingStates = createSelector(
  [(state: { ui: UIState }) => state.ui.loadingStates],
  (loadingStates) => loadingStates
);

export const selectModals = createSelector(
  [(state: { ui: UIState }) => state.ui.modals],
  (modals) => modals
);

export const selectSidebar = createSelector(
  [(state: { ui: UIState }) => state.ui.sidebar],
  (sidebar) => sidebar
);

// Composite selectors for better performance
export const selectActiveToasts = createSelector(
  [selectToasts],
  (toasts) => toasts.filter(toast => toast.open)
);

export const selectToastCount = createSelector(
  [selectToasts],
  (toasts) => toasts.length
);

export const selectActiveToastCount = createSelector(
  [selectActiveToasts],
  (activeToasts) => activeToasts.length
);

export const selectIsAnyModalOpen = createSelector(
  [selectModals],
  (modals) => Object.values(modals).some(isOpen => isOpen)
);

export const selectOpenModals = createSelector(
  [selectModals],
  (modals) => Object.entries(modals)
    .filter(([_, isOpen]) => isOpen)
    .map(([key]) => key)
);

// Selector factories for parameterized selectors
export const selectIsLoading = (key: LoadingStateKey) => createSelector(
  [selectLoadingStates],
  (loadingStates) => loadingStates[key] || false
);

export const selectIsModalOpen = (key: ModalKey) => createSelector(
  [selectModals],
  (modals) => modals[key] || false
);

export const selectIsSidebarOpen = createSelector(
  [selectSidebar],
  (sidebar) => sidebar.isOpen
);

export const selectSidebarActiveTab = createSelector(
  [selectSidebar],
  (sidebar) => sidebar.activeTab
);
