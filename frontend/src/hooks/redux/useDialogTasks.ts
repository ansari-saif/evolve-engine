import { useSelector, useDispatch } from 'react-redux';
import {
  selectGeneratedTasks,
  selectEditedTasks,
  setGeneratedTasks,
  setEditedTasks,
  updateEditedTask,
  removeEditedTask,
} from '../../store/slices/dialogSlice';
import type { AppDispatch } from '../../store';
import type { GeneratedTask, EditableGeneratedTask } from '../../store/types';

export const useDialogTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const generatedTasks = useSelector(selectGeneratedTasks);
  const editedTasks = useSelector(selectEditedTasks);
  
  const updateGeneratedTasks = (tasks: GeneratedTask[]) => {
    dispatch(setGeneratedTasks({ tasks }));
  };
  
  const updateEditedTasks = (tasks: EditableGeneratedTask[]) => {
    dispatch(setEditedTasks({ tasks }));
  };
  
  const handleUpdateEditedTask = (id: string, updates: Partial<EditableGeneratedTask>) => {
    dispatch(updateEditedTask({ id, updates }));
  };
  
  const handleRemoveEditedTask = (taskId: string) => {
    dispatch(removeEditedTask(taskId));
  };
  
  return {
    generatedTasks,
    editedTasks,
    updateGeneratedTasks,
    updateEditedTasks,
    handleUpdateEditedTask,
    handleRemoveEditedTask,
  };
};
