const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { devices } = require('./devices');
const { startSimulator } = require('./simulator');

const app = express();
const server = http.createServer(app);

// 허용할 도메인 목록
const allowedOrigins = [
  'https://smart-factory-zeta.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    const isLocalhost = origin && /^http:\/\/localhost:\d+$/.test(origin);
    if (!origin || isLocalhost || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const io = new Server(server, {
  cors: corsOptions,
});

const PORT = process.env.PORT || 3001;
const history = [];

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/devices', (_req, res) => {
  res.json(devices);
});

app.get('/api/history', (_req, res) => {
  res.json(history);
});

io.on('connection', (socket) => {
  console.log('[Socket.io] Client connected:', socket.id);
  socket.emit('device-update', devices);

  socket.on('disconnect', () => {
    console.log('[Socket.io] Client disconnected:', socket.id);
  });
});

startSimulator(devices, history, (updatedDevices) => {
  io.emit('device-update', updatedDevices);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});