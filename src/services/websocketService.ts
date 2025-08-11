import { useNotification } from '../hooks/use-notification';

export interface WebSocketMessage {
  message: string;
  type?: string;
  data?: unknown;
  timestamp?: string;
}

export interface WebSocketConfig {
  url: string;
  userId: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export type WebSocketEventListener = (data: WebSocketMessage) => void;

export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private config: WebSocketConfig | null = null;
  private listeners: WebSocketEventListener[] = [];
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private reconnectTimeout: number | null = null;
  private notificationHook: ReturnType<typeof useNotification> | null = null;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Initialize WebSocket connection
   */
  public connect(config: WebSocketConfig): void {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config
    };

    this.createConnection();
  }

  /**
   * Set notification hook for sending browser notifications
   */
  public setNotificationHook(notificationHook: ReturnType<typeof useNotification>): void {
    this.notificationHook = notificationHook;
  }

  /**
   * Create WebSocket connection
   */
  private createConnection(): void {
    if (!this.config) return;

    try {
      const wsUrl = `${this.config.url}/${this.config.userId}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);

      console.log('Connecting to WebSocket:', wsUrl);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Handle WebSocket connection open
   */
  private handleOpen(): void {
    console.log('Connected to WebSocket (receive-only mode)');
    this.isConnected = true;
    this.reconnectAttempts = 0;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const response = JSON.parse(event.data);
      console.log('Received:', response);

      const message: WebSocketMessage = {
        message: response.message || 'New notification',
        type: response.type,
        data: response.data,
        timestamp: new Date().toISOString()
      };

      // Emit to all listeners
      this.emitToListeners(message);

      // Send browser notification if available
      this.sendNotification(message);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket connection close
   */
  private handleClose(): void {
    console.log('Disconnected from WebSocket');
    this.isConnected = false;
    this.ws = null;

    // Attempt to reconnect if not manually closed
    if (this.config && this.reconnectAttempts < (this.config.maxReconnectAttempts || 10)) {
      this.scheduleReconnect();
    }
  }

  /**
   * Handle WebSocket errors
   */
  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (!this.config) return;

    this.reconnectAttempts++;
    const interval = this.config.reconnectInterval || 5000;

    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts} in ${interval}ms`);

    this.reconnectTimeout = window.setTimeout(() => {
      this.createConnection();
    }, interval);
  }

  /**
   * Emit message to all listeners
   */
  private emitToListeners(message: WebSocketMessage): void {
    this.listeners.forEach(listener => {
      try {
        listener(message);
      } catch (error) {
        console.error('Error in WebSocket message listener:', error);
      }
    });
  }

  /**
   * Send browser notification
   */
  private async sendNotification(message: WebSocketMessage): Promise<void> {
    if (!this.notificationHook) return;

    try {
      // Request permission if not already granted
      if (this.notificationHook.permission !== 'granted') {
        await this.notificationHook.requestPermission();
      }

      // Send notification
      const success = await this.notificationHook.notify(
        message.message,
        {
          body: message.data ? JSON.stringify(message.data) : undefined,
          tag: message.type || 'websocket-notification',
          requireInteraction: false,
          silent: false
        }
      );

      if (success) {
        console.log('Browser notification sent successfully');
      }
    } catch (error) {
      console.error('Failed to send browser notification:', error);
    }
  }

  /**
   * Add event listener for WebSocket messages
   */
  public addEventListener(listener: WebSocketEventListener): void {
    this.listeners.push(listener);
  }

  /**
   * Remove event listener
   */
  public removeEventListener(listener: WebSocketEventListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Check if WebSocket is connected
   */
  public isWebSocketConnected(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): {
    connected: boolean;
    readyState: number | null;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  } {
    return {
      connected: this.isConnected,
      readyState: this.ws?.readyState || null,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.config?.maxReconnectAttempts || 10
    };
  }

  /**
   * Manually disconnect WebSocket
   */
  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.config = null;
    this.reconnectAttempts = 0;
    console.log('WebSocket manually disconnected');
  }

  /**
   * Clean up all resources
   */
  public cleanup(): void {
    this.disconnect();
    this.listeners = [];
    this.notificationHook = null;
  }
}

// Export singleton instance
export const webSocketService = WebSocketService.getInstance();