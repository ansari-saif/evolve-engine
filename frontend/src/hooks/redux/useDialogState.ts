import { useSelector, useDispatch } from 'react-redux';
import {
  selectDialogState,
  selectEnergyLevel,
  selectCurrentPhase,
  setDialogState,
  setEnergyLevel,
  setCurrentPhase,
} from '../../store/slices/dialogSlice';
import type { AppDispatch } from '../../store';
import type { DialogStateEnum } from '../../store/types';

// Focused hook for dialog state management
export const useDialogState = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const currentState = useSelector(selectDialogState);
  const energyLevel = useSelector(selectEnergyLevel);
  const currentPhase = useSelector(selectCurrentPhase);
  
  // Actions
  const updateDialogState = (state: DialogStateEnum) => {
    dispatch(setDialogState(state));
  };
  
  const updateEnergyLevel = (level: number) => {
    dispatch(setEnergyLevel({ energyLevel: level }));
  };
  
  const updateCurrentPhase = (phase: string | null) => {
    dispatch(setCurrentPhase({ phase }));
  };
  
  return {
    // State
    currentState,
    energyLevel,
    currentPhase,
    
    // Actions
    updateDialogState,
    updateEnergyLevel,
    updateCurrentPhase,
  };
};
