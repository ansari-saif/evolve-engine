import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../types';

export const selectTaskUi = (state: RootState) => state.taskUi;

export const selectActiveTab = (state: RootState) => state.taskUi.activeTab;
export const selectTaskFilters = (state: RootState) => state.taskUi.filters;
export const selectLoadingTaskId = (state: RootState) => state.taskUi.loadingTaskId;
export const selectEditingTask = (state: RootState) => state.taskUi.editingTask;
export const selectGenerateDialogOpen = (state: RootState) => state.taskUi.generateDialogOpen;

export const selectNormalizedFilters = createSelector(
	[selectTaskFilters],
	(filters) => ({ ...filters })
);



