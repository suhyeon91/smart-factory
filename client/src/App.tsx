import { useEffect } from 'react';
import { io } from 'socket.io-client';
import type { Device } from './types/device';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3001';

function App() {
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('[Socket.io] Connected:', socket.id);
    });

    socket.on('device-update', (devices: Device[]) => {
      console.log('[device-update]', devices);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.io] Disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="app">
      <header>
        <h1>스마트팩토리 관제 대시보드</h1>
        <p>Socket.io 연결 중 — 브라우저 개발자 콘솔에서 device-update 이벤트를 확인하세요.</p>
      </header>
    </div>
  );
}

export default App;
