import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Device } from './types/device';
import CanvasFactoryView from './CanvasFactoryView';
import StatsDashboard from './StatsDashboard';
import TopNav from './TopNav';
import Splash from './Splash';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? window.location.origin;

type Tab = 'canvas' | 'stats';

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('canvas');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('device-update', (updatedDevices: Device[]) => {
      setDevices(updatedDevices);
      setIsLoading(false); // 데이터가 처음 도착하면 스플래시 종료
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="app">
      <header>
        <h1>스마트팩토리 관제 대시보드</h1>
      </header>

      {isLoading ? (
        <Splash />
      ) : (
        <>
          <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
          <main>
            {activeTab === 'canvas' ? (
              <CanvasFactoryView devices={devices} />
            ) : (
              <StatsDashboard devices={devices} />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;