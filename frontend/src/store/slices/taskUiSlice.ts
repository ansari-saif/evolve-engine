import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TaskResponse } from '../../client/models';

type ActiveTab = 'all' | 'pending' | 'in-progress' | 'completed';
type FilterStatus = 'All' | 'Pending' | 'In Progress' | 'Completed';
type FilterPriority = 'All' | 'Urgent' | 'High' | 'Medium' | 'Low';
type FilterEnergy = 'All' | 'High' | 'Medium' | 'Low';
type FilterGoal = 'All' | number;

export interface TaskUiFiltersState {
	status: FilterStatus;
	priority: FilterPriority;
	energy: FilterEnergy;
	goal: FilterGoal;
}

export interface TaskUiState {
	activeTab: ActiveTab;
	editingTask: TaskResponse | null;
	generateDialogOpen: boolean;
	loadingTaskId: number | null;
	filters: TaskUiFiltersState;
}

const initialState: TaskUiState = {
	activeTab: 'all',
	editingTask: null,
	generateDialogOpen: false,
	loadingTaskId: null,
	filters: {
		status: 'All',
		priority: 'All',
		energy: 'All',
		goal: 'All',
	},
};

const taskUiSlice = createSlice({
	name: 'taskUi',
	initialState,
	reducers: {
		setActiveTab(state, action: PayloadAction<ActiveTab>) {
			state.activeTab = action.payload;
		},
		startEditing(state, action: PayloadAction<TaskResponse>) {
			state.editingTask = action.payload;
		},
		stopEditing(state) {
			state.editingTask = null;
		},
		openGenerateDialog(state) {
			state.generateDialogOpen = true;
		},
		closeGenerateDialog(state) {
			state.generateDialogOpen = false;
		},
		setTaskLoading(state, action: PayloadAction<number | null>) {
			state.loadingTaskId = action.payload;
		},
		setFilters(state, action: PayloadAction<Partial<TaskUiFiltersState>>) {
			state.filters = { ...state.filters, ...action.payload };
		},
		resetFilters(state) {
			state.filters = initialState.filters;
		},
	},
});

export const {
	setActiveTab,
	startEditing,
	stopEditing,
	openGenerateDialog,
	closeGenerateDialog,
	setTaskLoading,
	setFilters,
	resetFilters,
} = taskUiSlice.actions;

export default taskUiSlice.reducer;



