import { useSelector, useDispatch } from 'react-redux';
import { 
  selectUserId, 
  selectConfig, 
  selectWebSocketUrl, 
  selectApiBaseUrl,
  setUserId,
  updateConfig,
  resetAppConfig
} from '../../store/slices/appConfigSlice';
import type { AppDispatch, RootState } from '../../store';

// Custom hook for app configuration
export const useAppConfig = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const userId = useSelector(selectUserId);
  const config = useSelector(selectConfig);
  const webSocketUrl = useSelector(selectWebSocketUrl);
  const apiBaseUrl = useSelector(selectApiBaseUrl);
  
  // Actions
  const updateUserId = (newUserId: string) => {
    dispatch(setUserId(newUserId));
  };
  
  const updateAppConfig = (updates: Partial<typeof config>) => {
    dispatch(updateConfig(updates));
  };
  
  const resetConfig = () => {
    dispatch(resetAppConfig());
  };
  
  return {
    // State
    userId,
    config,
    webSocketUrl,
    apiBaseUrl,
    
    // Actions
    updateUserId,
    updateAppConfig,
    resetConfig,
  };
};

// Convenience hook for getting userId (similar to current useUserId)
export const useUserId = () => {
  return useSelector(selectUserId);
};
