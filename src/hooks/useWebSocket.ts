import { useEffect, useState, useCallback, useRef } from 'react';
import { webSocketService, WebSocketMessage, WebSocketConfig, WebSocketEventListener } from '../services/websocketService';
import { useNotification } from './use-notification';

export interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoConnect?: boolean;
}

export function useWebSocket(config?: WebSocketConfig, options?: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionStatus, setConnectionStatus] = useState(webSocketService.getConnectionStatus());
  const listenerRef = useRef<WebSocketEventListener | null>(null);
  const notification = useNotification();

  // Set up message listener
  const messageListener = useCallback((message: WebSocketMessage) => {
    setLastMessage(message);
    options?.onMessage?.(message);
  }, [options]);

  // Connection status updater
  const updateConnectionStatus = useCallback(() => {
    const status = webSocketService.getConnectionStatus();
    setConnectionStatus(status);
    setIsConnected(status.connected);
  }, []);

  // Connect function
  const connect = useCallback((connectConfig?: WebSocketConfig) => {
    if (!connectConfig && !config) {
      console.error('WebSocket config is required to connect');
      return;
    }

    const finalConfig = connectConfig || config!;
    
    // Set notification hook
    webSocketService.setNotificationHook(notification);
    
    // Connect
    webSocketService.connect(finalConfig);
    
    // Add message listener
    if (listenerRef.current) {
      webSocketService.removeEventListener(listenerRef.current);
    }
    listenerRef.current = messageListener;
    webSocketService.addEventListener(messageListener);

    // Update connection status
    updateConnectionStatus();
    
    // Set up periodic status updates
    const statusInterval = setInterval(updateConnectionStatus, 1000);
    
    // Cleanup function
    return () => {
      clearInterval(statusInterval);
      if (listenerRef.current) {
        webSocketService.removeEventListener(listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, [config, messageListener, notification, updateConnectionStatus]);

  // Disconnect function
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    updateConnectionStatus();
  }, [updateConnectionStatus]);

  // Auto-connect on mount if enabled (defaults to true)
  useEffect(() => {
    if ((options?.autoConnect ?? true) && config) {
      const cleanup = connect();
      return cleanup;
    }
  }, [config, options?.autoConnect, connect]);

  // Handle connection state changes
  useEffect(() => {
    if (isConnected && options?.onConnect) {
      options.onConnect();
    } else if (!isConnected && options?.onDisconnect) {
      options.onDisconnect();
    }
  }, [isConnected, options]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        webSocketService.removeEventListener(listenerRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    lastMessage,
    connectionStatus,
    connect,
    disconnect,
    notification
  } as const;
}