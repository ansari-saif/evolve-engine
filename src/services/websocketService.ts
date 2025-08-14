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

  private constructor() {
    // Global cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.cleanup();
      });
    }
  }

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
    // Prevent multiple connections with same config
    if (this.isConnected && this.config && 
        this.config.url === config.url && 
        this.config.userId === config.userId) {
      console.log('🔄 WebSocket already connected with same config, skipping...');
      return;
    }

    // Disconnect existing connection if different config
    if (this.ws) {
      console.log('🔄 Disconnecting existing WebSocket before new connection...');
      this.disconnect();
    }

    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config
    };

    this.createConnection();
  }

  /**
   * Initialize WebSocket with default configuration and auto-connect
   * Useful for quick setup with sensible defaults
   */
  public initialize(userId: string, url: string = 'ws://localhost:8000/api/v1/ws'): void {
    this.connect({
      url,
      userId,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10
    });
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
    console.log('✅ Connected to WebSocket (receive-only mode)');
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
    console.log('❌ Disconnected from WebSocket');
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
   * Send data over the active WebSocket connection
   * Returns true if the message was sent, false otherwise
   */
  public send(data: string | Record<string, unknown>): boolean {
    try {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        console.warn('WebSocket is not connected. Cannot send message.');
        return false;
      }
      const payload = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(payload);
      return true;
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      return false;
    }
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
   * Send browser notification with sound and app icon
   */
  private async sendNotification(message: WebSocketMessage): Promise<void> {
    if (!this.notificationHook) return;

    try {
      // Request permission if not already granted
      if (this.notificationHook.permission !== 'granted') {
        await this.notificationHook.requestPermission();
      }
      console.log("Sending notification", message);

      // Send notification with app icon and sound
      const success = await this.notificationHook.notify(
        "Evolve Engine",
        {
          body: message.message,
          tag: 'websocket-notification',
          icon: '/favicon.svg', // Use FAB app icon
          badge: '/favicon-192.png', // Badge icon for mobile
          requireInteraction: false,
          silent: false // Enable sound
        }
      );

      if (success) {
        console.log('🔔 Browser notification sent with sound');
        // Play additional notification sound
        this.playNotificationSound();
        // Trigger vibration on mobile devices
        this.triggerVibration();
      }
    } catch (error) {
      console.error('Failed to send browser notification:', error);
    }
  }

  /**
   * Play notification sound
   */
  private playNotificationSound(): void {
    try {
      // Create audio context for notification sound
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      // Create a short beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz tone
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  /**
   * Trigger vibration on mobile devices
   */
  private triggerVibration(): void {
    try {
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]); // Vibration pattern: vibrate 200ms, pause 100ms, vibrate 200ms
      }
    } catch (error) {
      console.warn('Could not trigger vibration:', error);
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