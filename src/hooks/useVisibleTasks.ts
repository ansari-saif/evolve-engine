import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetUserTasks } from './useTasks';
import { useUserId } from './redux/useAppConfig';
import { selectActiveTab, selectTaskFilters } from '../store/selectors/taskUiSelectors';
import { useTaskFiltering } from './useTaskFiltering';
import { useTaskSorting } from './useTaskSorting';
import type { TaskResponse } from '../client/models';

export const useVisibleTasks = () => {
	const userId = useUserId();
	const { data: tasks, isLoading, error } = useGetUserTasks(userId);
	const filters = useSelector(selectTaskFilters);
	const activeTab = useSelector(selectActiveTab);

	const filtered = useTaskFiltering(tasks, filters);
	const sorted = useTaskSorting(filtered);

	const taskGroups = useMemo(() => ({
		all: sorted,
		pending: sorted.filter(t => t.completion_status === 'Pending'),
		'in-progress': sorted.filter(t => t.completion_status === 'In Progress'),
		completed: sorted.filter(t => t.completion_status === 'Completed'),
	}), [sorted]);

	const visibleTasks: TaskResponse[] = useMemo(() => {
		switch (activeTab) {
			case 'pending': return taskGroups.pending;
			case 'in-progress': return taskGroups['in-progress'];
			case 'completed': return taskGroups.completed;
			default: return taskGroups.all;
		}
	}, [activeTab, taskGroups]);

	return { tasks, isLoading, error, filtered, sorted, taskGroups, visibleTasks };
};



