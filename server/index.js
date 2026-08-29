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
  'http://localhost:5173',
  'https://smart-factory-zeta.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean); // undefined 값 제거

const corsOptions = {
  origin: (origin, callback) => {
    // origin이 없는 요청(서버 간 통신, Postman 등)은 허용
    if (!origin || allowedOrigins.includes(origin)) {
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