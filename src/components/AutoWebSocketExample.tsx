import React, { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { WebSocketMessage } from '../services/websocketService';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function AutoWebSocketExample() {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  // Auto-connects on component mount with default config
  const { 
    isConnected, 
    lastMessage, 
    connectionStatus, 
    disconnect,
    notification 
  } = useWebSocket({
    url: 'ws://localhost:8000/api/v1/ws',
    userId: '123456789',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  }, {
    onMessage: (message) => {
      setMessages(prev => [message, ...prev].slice(0, 10)); // Keep last 10 messages
      console.log('New message received:', message);
    },
    onConnect: () => {
      console.log('🟢 WebSocket connected automatically!');
    },
    onDisconnect: () => {
      console.log('🔴 WebSocket disconnected!');
    },
    // autoConnect defaults to true, so WebSocket will connect automatically
  });

  const requestNotificationPermission = async () => {
    const permission = await notification.requestPermission();
    console.log('Notification permission:', permission);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Auto-Connecting WebSocket Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </Badge>
            <Badge variant="outline">
              Ready State: {connectionStatus.readyState ?? 'N/A'}
            </Badge>
            <Badge variant="outline">
              Reconnects: {connectionStatus.reconnectAttempts}/{connectionStatus.maxReconnectAttempts}
            </Badge>
            <Badge variant="outline">
              Notifications: {notification.permission}
            </Badge>
          </div>

          {/* Connection Info */}
          <div className="text-sm text-gray-600">
            <p><strong>WebSocket URL:</strong> ws://localhost:8000/api/v1/ws/123456789</p>
            <p><strong>Auto-connect:</strong> Enabled (connects automatically on component mount)</p>
            <p><strong>Auto-reconnect:</strong> Enabled (up to 10 attempts with 5s intervals)</p>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button 
              onClick={disconnect} 
              disabled={!isConnected}
              variant="outline"
            >
              Disconnect
            </Button>
            <Button 
              onClick={requestNotificationPermission}
              variant="outline"
            >
              Enable Notifications
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Last Message */}
      {lastMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Last Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
              <div className="font-medium text-blue-900">{lastMessage.message}</div>
              {lastMessage.data && (
                <div className="text-sm text-blue-700 mt-1">
                  <strong>Data:</strong> {JSON.stringify(lastMessage.data)}
                </div>
              )}
              <div className="text-xs text-blue-600 mt-2">
                {lastMessage.timestamp} • Type: {lastMessage.type || 'unknown'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages ({messages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>🔌 Connected and waiting for messages...</p>
              <p className="text-sm mt-2">Send messages from your WebSocket server to see them here</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md border hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">{message.message}</span>
                    <Badge variant="outline" className="text-xs">
                      {message.type || 'unknown'}
                    </Badge>
                  </div>
                  {message.data && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Data:</strong> {JSON.stringify(message.data)}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    {message.timestamp}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>✅ <strong>Auto-connects</strong> to WebSocket server when component mounts</p>
            <p>🔔 <strong>Browser notifications</strong> are sent automatically for each message</p>
            <p>🔄 <strong>Auto-reconnects</strong> if connection is lost (with exponential backoff)</p>
            <p>📱 <strong>Real-time updates</strong> - messages appear instantly when received</p>
            <p>💾 <strong>Message history</strong> - keeps the last 10 messages for reference</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}