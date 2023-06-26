import { useEffect, useState } from 'react';

const WEBSOCKET_URL = 'http://localhost:8080/';

export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      setData(receivedData);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { socket, data };
};
