import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

interface UseWebSocketOptions {
  url?: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    url = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/ws`,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const { token } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Event | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      setConnectionStatus('connecting');
      setError(null);

      const wsUrl = `${url}?token=${token}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;

        // Start heartbeat
        if (heartbeatInterval) {
          heartbeatTimeoutRef.current = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({ type: 'heartbeat' }));
            }
          }, heartbeatInterval);
        }

        onConnect?.();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        setConnectionStatus('disconnected');

        // Clear heartbeat
        if (heartbeatTimeoutRef.current) {
          clearInterval(heartbeatTimeoutRef.current);
          heartbeatTimeoutRef.current = null;
        }

        onDisconnect?.();

        // Attempt to reconnect if not manually closed
        if (!event.wasClean && reconnectAttemptsRef.current < reconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (event) => {
        setConnectionStatus('error');
        setError(event);
        onError?.(event);
      };

    } catch (error) {
      setConnectionStatus('error');
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [url, token, reconnectAttempts, reconnectInterval, heartbeatInterval, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
    reconnectAttemptsRef.current = 0;
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        ...message,
        timestamp: Date.now(),
      }));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  // Auto-connect when token is available
  useEffect(() => {
    if (token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    error,
    connect,
    disconnect,
    sendMessage,
  };
};

// Specific hooks for different types of real-time data
export const useRealTimeDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);

  const { lastMessage, sendMessage } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'dashboard_update') {
        setDashboardData(message.data);
      }
    },
  });

  const subscribeToDashboard = useCallback(() => {
    sendMessage({
      type: 'subscribe',
      channel: 'dashboard',
    });
  }, [sendMessage]);

  const unsubscribeFromDashboard = useCallback(() => {
    sendMessage({
      type: 'unsubscribe',
      channel: 'dashboard',
    });
  }, [sendMessage]);

  useEffect(() => {
    subscribeToDashboard();
    return () => {
      unsubscribeFromDashboard();
    };
  }, [subscribeToDashboard, unsubscribeFromDashboard]);

  return {
    dashboardData,
    subscribeToDashboard,
    unsubscribeFromDashboard,
  };
};

export const useRealTimeEvaluations = () => {
  const [evaluationUpdates, setEvaluationUpdates] = useState<any[]>([]);

  const { lastMessage, sendMessage } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'evaluation_update') {
        setEvaluationUpdates(prev => [message.data, ...prev.slice(0, 49)]); // Keep last 50 updates
      }
    },
  });

  const subscribeToEvaluations = useCallback(() => {
    sendMessage({
      type: 'subscribe',
      channel: 'evaluations',
    });
  }, [sendMessage]);

  const unsubscribeFromEvaluations = useCallback(() => {
    sendMessage({
      type: 'unsubscribe',
      channel: 'evaluations',
    });
  }, [sendMessage]);

  useEffect(() => {
    subscribeToEvaluations();
    return () => {
      unsubscribeFromEvaluations();
    };
  }, [subscribeToEvaluations, unsubscribeFromEvaluations]);

  return {
    evaluationUpdates,
    subscribeToEvaluations,
    unsubscribeFromEvaluations,
  };
};

export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const { lastMessage, sendMessage } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'notification') {
        setNotifications(prev => [message.data, ...prev]);

        // Also show browser notification if permission is granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(message.data.title, {
            body: message.data.body,
            icon: '/favicon.ico',
          });
        }
      }
    },
  });

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  const subscribeToNotifications = useCallback(() => {
    sendMessage({
      type: 'subscribe',
      channel: 'notifications',
    });
  }, [sendMessage]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    sendMessage({
      type: 'mark_notification_read',
      notificationId,
    });

    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, [sendMessage]);

  useEffect(() => {
    requestNotificationPermission();
    subscribeToNotifications();
    return () => {
      // Cleanup handled by useWebSocket hook
    };
  }, [requestNotificationPermission, subscribeToNotifications]);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    requestNotificationPermission,
    subscribeToNotifications,
    markNotificationAsRead,
  };
};