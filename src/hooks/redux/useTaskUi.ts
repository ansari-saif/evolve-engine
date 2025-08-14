import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import type { RootState } from '../../store/types';
import { 
	setActiveTab,
	startEditing,
	stopEditing,
	openGenerateDialog,
	closeGenerateDialog,
	setTaskLoading,
	setFilters,
	resetFilters,
} from '../../store/slices/taskUiSlice';
import { 
	selectActiveTab,
	selectTaskFilters,
	selectLoadingTaskId,
	selectEditingTask,
	selectGenerateDialogOpen,
} from '../../store/selectors/taskUiSelectors';

export const useTaskUi = () => {
	const dispatch = useDispatch<AppDispatch>();

	// State selectors
	const activeTab = useSelector(selectActiveTab);
	const filters = useSelector(selectTaskFilters);
	const loadingTaskId = useSelector(selectLoadingTaskId);
	const editingTask = useSelector(selectEditingTask);
	const generateDialogOpen = useSelector(selectGenerateDialogOpen);

	// Action dispatchers
	const handleTabChange = (tab: 'all' | 'pending' | 'in-progress' | 'completed') => {
		dispatch(setActiveTab(tab));
	};

	const updateFilters = (nextFilters: RootState['taskUi']['filters']) => {
		dispatch(setFilters(nextFilters));
	};

	const setLoadingTask = (taskId: number | null) => {
		dispatch(setTaskLoading(taskId));
	};

	const beginEditing = (task: unknown) => {
		// TaskResponse type is inside client models; unknown here to avoid import cycles in hooks
		dispatch(startEditing(task as any));
	};

	const endEditing = () => {
		dispatch(stopEditing());
	};

	const openGenerate = () => {
		dispatch(openGenerateDialog());
	};

	const closeGenerate = () => {
		dispatch(closeGenerateDialog());
	};

	const resetAllFilters = () => {
		dispatch(resetFilters());
	};

	return {
		// State
		activeTab,
		filters,
		loadingTaskId,
		editingTask,
		generateDialogOpen,

		// Actions
		handleTabChange,
		updateFilters,
		setLoadingTask,
		beginEditing,
		endEditing,
		openGenerate,
		closeGenerate,
		resetAllFilters,
	};
};



