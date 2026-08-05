import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import type { Device } from './types/device';

const FACTORY_FLOOR_URL = '/assets/factory-floor.svg';
const MCT_URL = '/assets/mct.svg';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? window.location.origin;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDING = 20;
const MCT_SIZE = 48;

const WORLD_X_MIN = 0;
const WORLD_X_MAX = 65;
const WORLD_Z_MIN = 0;
const WORLD_Z_MAX = 35;

const STATUS_COLORS: Record<string, string> = {
  normal: '#22c55e',
  warning: '#f97316',
  error: '#ef4444',
};

function mapToCanvasX(x: number): number {
  const range = WORLD_X_MAX - WORLD_X_MIN;
  return PADDING + ((x - WORLD_X_MIN) / range) * (CANVAS_WIDTH - 2 * PADDING);
}

function mapToCanvasY(z: number): number {
  const range = WORLD_Z_MAX - WORLD_Z_MIN;
  return PADDING + ((z - WORLD_Z_MIN) / range) * (CANVAS_HEIGHT - 2 * PADDING);
}

function getStatusColor(status: Device['status'] | 'error'): string {
  return STATUS_COLORS[status] ?? STATUS_COLORS.normal;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function CanvasFactoryView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const devicesRef = useRef(devices);
  const imagesRef = useRef<{ floor: HTMLImageElement | null; mct: HTMLImageElement | null }>({
    floor: null,
    mct: null,
  });

  devicesRef.current = devices;

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('device-update', (updatedDevices: Device[]) => {
      setDevices(updatedDevices);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadImage(FACTORY_FLOOR_URL), loadImage(MCT_URL)])
      .then(([floor, mct]) => {
        if (!cancelled) {
          imagesRef.current = { floor, mct };
        }
      })
      .catch((err) => {
        console.error('[CanvasFactoryView] Failed to load images:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const half = MCT_SIZE / 2;

    const draw = () => {
      const { floor, mct } = imagesRef.current;

      if (floor) {
        ctx.drawImage(floor, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        ctx.fillStyle = '#2d2d2d';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      for (const device of devicesRef.current) {
        const cx = mapToCanvasX(device.position.x);
        const cy = mapToCanvasY(device.position.z);
        const statusColor = getStatusColor(device.status);

        ctx.beginPath();
        ctx.arc(cx, cy, half + 5, 0, Math.PI * 2);
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (mct) {
          ctx.drawImage(mct, cx - half, cy - half, MCT_SIZE, MCT_SIZE);
        }

        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.strokeText(device.id, cx, cy + half + 4);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(device.id, cx, cy + half + 4);
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
    />
  );
}
