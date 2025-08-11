/**
 * Example usage of the WebSocket service
 * This demonstrates how to use the WebSocket service outside of React components
 */

import { webSocketService } from '../services/websocketService';
import { useNotification } from '../hooks/use-notification';

// Example 1: Basic usage with auto-connect
export function basicWebSocketExample() {
  const userId = "123456789";

  // Add message listener BEFORE connecting
  webSocketService.addEventListener((message) => {
    console.log('Received message:', message);
    
    // Handle different message types
    switch (message.type) {
      case 'notification':
        console.log('New notification:', message.message);
        break;
      case 'update':
        console.log('Update received:', message.data);
        break;
      case 'alert':
        console.log('Alert:', message.message);
        break;
      default:
        console.log('General message:', message.message);
    }
  });

  // Initialize and auto-connect with sensible defaults
  webSocketService.initialize(userId);

  // Or use custom URL:
  // webSocketService.initialize(userId, 'ws://your-server.com/ws');

  // Check connection status
  console.log('Connection status:', webSocketService.getConnectionStatus());
}

// Example 2: With notifications (requires React context)
export function webSocketWithNotifications() {
  const userId = "123456789";
  const wsUrl = "ws://localhost:8000/api/v1/ws";

  // This would typically be called within a React component
  // where you have access to the notification hook
  const setupWithNotifications = (notification: ReturnType<typeof useNotification>) => {
    // Set notification hook
    webSocketService.setNotificationHook(notification);

    // Request permission if needed
    if (notification.permission !== 'granted') {
      notification.requestPermission();
    }

    // Add message listener
    webSocketService.addEventListener((message) => {
      console.log('Received:', message);
      // Browser notifications will be sent automatically by the service
    });

    // Connect
    webSocketService.connect({
      url: wsUrl,
      userId: userId
    });
  };

  return setupWithNotifications;
}

// Example 3: Handle specific message types
export function handleSpecificMessageTypes() {
  webSocketService.addEventListener((message) => {
    switch (message.type) {
      case 'task_completed':
        console.log('Task completed:', message.data);
        // Handle task completion notification
        break;
        
      case 'reminder':
        console.log('Reminder:', message.message);
        // Handle reminder notification
        break;
        
      case 'status_update':
        console.log('Status update:', message.data);
        // Handle status updates
        break;
        
      case 'system_alert':
        console.log('System alert:', message.message);
        // Handle system alerts
        break;
        
      default:
        console.log('Unknown message type:', message);
    }
  });
}

// Example 4: Connection monitoring
export function monitorConnection() {
  const checkStatus = () => {
    const status = webSocketService.getConnectionStatus();
    console.log('WebSocket Status:', {
      connected: status.connected,
      readyState: status.readyState,
      reconnectAttempts: status.reconnectAttempts,
      maxReconnectAttempts: status.maxReconnectAttempts
    });
  };

  // Check status every 5 seconds
  const intervalId = setInterval(checkStatus, 5000);

  // Cleanup function
  return () => {
    clearInterval(intervalId);
  };
}

// Example 5: Graceful shutdown
export function gracefulShutdown() {
  // Disconnect and cleanup
  webSocketService.disconnect();
  console.log('WebSocket disconnected gracefully');
}

// Example message formats that the server might send:
export const exampleServerMessages = {
  // Basic notification
  notification: {
    message: "You have a new task assigned",
    type: "notification",
    data: {
      taskId: 123,
      title: "Review pull request",
      priority: "high"
    }
  },

  // Reminder
  reminder: {
    message: "Meeting starts in 5 minutes",
    type: "reminder",
    data: {
      meetingId: 456,
      title: "Team standup",
      startTime: "2024-01-15T09:00:00Z"
    }
  },

  // Status update
  statusUpdate: {
    message: "Task status changed",
    type: "status_update",
    data: {
      taskId: 123,
      oldStatus: "in_progress",
      newStatus: "completed"
    }
  },

  // System alert
  systemAlert: {
    message: "System maintenance scheduled",
    type: "system_alert",
    data: {
      maintenanceWindow: "2024-01-15T02:00:00Z",
      duration: "2 hours",
      affectedServices: ["api", "database"]
    }
  }
};