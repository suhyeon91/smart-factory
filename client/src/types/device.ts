export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Device {
  id: string;
  type: 'agv' | 'sensor';
  position: Position;
  status: 'normal' | 'warning';
  temperature: number;
  battery: number;
}

export interface HistoryEntry {
  id: string;
  deviceId: string;
  type: string;
  temperature: number;
  status: string;
  timestamp: string;
  message: string;
}
