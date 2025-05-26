import { useEffect, useRef } from 'react';

/**
 * Hook for real-time client status updates via Server-Sent Events
 * @param {Function} onClientStatusChange - Callback when client status changes
 * @returns {Object} - Connection status and methods
 */
export const useRealtimeClients = (onClientStatusChange) => {
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = () => {
    try {
      // Use the same base URL as the API
      const baseUrl = import.meta.env.VITE_API_URL || 'https://signcast-watchdog-91d66c3ccf16.herokuapp.com';
      const eventSource = new EventSource(`${baseUrl}/api/clients/events`);
      
      eventSource.onopen = () => {
        console.log('Real-time connection established');
      };
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'client_status_change') {
            console.log(`Client ${data.computerName} ${data.status}`);
            onClientStatusChange(data);
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        eventSource.close();
        
        // Reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 5000);
      };
      
      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
    }
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  return {
    disconnect,
    reconnect: connect
  };
}; 