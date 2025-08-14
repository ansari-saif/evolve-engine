import { useCallback } from 'react';
import { useTaskOperations } from '../useTaskOperations';
import { useUserId } from './useAppConfig';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { setTaskLoading } from '../../store/slices/taskUiSlice';
import type { TaskCreate, TaskUpdate } from '../../client/models';

export const useTaskActions = () => {
	const userId = useUserId();
	const ops = useTaskOperations(userId);
	const dispatch = useDispatch<AppDispatch>();

	const wrapLoading = useCallback(async <T>(taskId: number | null, fn: () => Promise<T>) => {
		try {
			dispatch(setTaskLoading(taskId));
			return await fn();
		} finally {
			dispatch(setTaskLoading(null));
		}
	}, [dispatch]);

	const createTask = useCallback((payload: TaskCreate) => wrapLoading(null, () => ops.createTask(payload)), [ops, wrapLoading]);
	const updateTask = useCallback((taskId: number, updates: TaskUpdate) => wrapLoading(taskId, () => ops.updateTask(taskId, updates)), [ops, wrapLoading]);
	const completeTask = useCallback((taskId: number) => wrapLoading(taskId, () => ops.completeTask(taskId)), [ops, wrapLoading]);
	const deleteTask = useCallback((taskId: number) => wrapLoading(taskId, () => ops.deleteTask(taskId)), [ops, wrapLoading]);

	return { createTask, updateTask, completeTask, deleteTask };
};



