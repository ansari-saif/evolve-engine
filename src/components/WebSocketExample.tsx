import React, { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { WebSocketMessage } from '../services/websocketService';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

export function WebSocketExample() {
  const [userId, setUserId] = useState('123456789');
  const [wsUrl, setWsUrl] = useState('ws://localhost:8000/api/v1/ws');
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  const { 
    isConnected, 
    lastMessage, 
    connectionStatus, 
    connect, 
    disconnect,
    notification 
  } = useWebSocket(undefined, {
    onMessage: (message) => {
      setMessages(prev => [message, ...prev].slice(0, 10)); // Keep last 10 messages
    },
    onConnect: () => {
      console.log('WebSocket connected!');
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected!');
    },
    autoConnect: false
  });

  const handleConnect = () => {
    connect({
      url: wsUrl,
      userId: userId,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10
    });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const requestNotificationPermission = async () => {
    const permission = await notification.requestPermission();
    console.log('Notification permission:', permission);
  };

  const testNotification = async () => {
    const success = await notification.notify('Test Notification', {
      body: 'This is a test notification from the WebSocket service',
      tag: 'test-notification'
    });
    console.log('Test notification sent:', success);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>WebSocket Service Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wsUrl">WebSocket URL</Label>
              <Input
                id="wsUrl"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                placeholder="ws://localhost:8000/api/v1/ws"
                disabled={isConnected}
              />
            </div>
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="123456789"
                disabled={isConnected}
              />
            </div>
          </div>

          {/* Connection Controls */}
          <div className="flex gap-2">
            <Button 
              onClick={handleConnect} 
              disabled={isConnected}
              variant="default"
            >
              Connect
            </Button>
            <Button 
              onClick={handleDisconnect} 
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
            <Button 
              onClick={testNotification}
              variant="outline"
            >
              Test Notification
            </Button>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Badge variant="outline">
              Ready State: {connectionStatus.readyState ?? 'N/A'}
            </Badge>
            <Badge variant="outline">
              Reconnect Attempts: {connectionStatus.reconnectAttempts}/{connectionStatus.maxReconnectAttempts}
            </Badge>
            <Badge variant="outline">
              Notifications: {notification.permission}
            </Badge>
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
            <div className="bg-gray-50 p-3 rounded-md">
              <pre className="text-sm">{JSON.stringify(lastMessage, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message History */}
      <Card>
        <CardHeader>
          <CardTitle>Message History (Last 10)</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages received yet</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md border">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{message.message}</span>
                    <Badge variant="outline" className="text-xs">
                      {message.type || 'unknown'}
                    </Badge>
                  </div>
                  {message.data && (
                    <div className="text-sm text-gray-600">
                      <strong>Data:</strong> {JSON.stringify(message.data)}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {message.timestamp}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>1. Configure the WebSocket URL and User ID above</p>
            <p>2. Click "Connect" to establish WebSocket connection</p>
            <p>3. Click "Enable Notifications" to allow browser notifications</p>
            <p>4. Send messages from your WebSocket server to see them appear here</p>
            <p>5. Browser notifications will be sent automatically for each message</p>
            <p>6. The service will automatically reconnect if connection is lost</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}