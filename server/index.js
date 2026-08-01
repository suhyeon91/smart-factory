const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { devices } = require('./devices');
const { startSimulator } = require('./simulator');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 3001;
const history = [];

app.use(cors());
app.use(express.json());

app.get('/api/devices', (_req, res) => {
  res.json(devices);
});

app.get('/api/history', (_req, res) => {
  res.json(history);
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.emit('device-update', devices);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

startSimulator(devices, history, (updatedDevices) => {
  io.emit('device-update', updatedDevices);
});

server.listen(PORT, () => {
  console.log(`Smart factory server running on http://localhost:${PORT}`);
});
