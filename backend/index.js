const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const frontendURL = process.env.FrontendURL;
const io = new Server(server, {
  cors: {
    origin: frontendURL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }
});

app.set("io", io);
app.use(express.json());

app.use(cors({
  origin: frontendURL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' MongoDB connected successfully'))
  .catch((err) => console.log(' MongoDB connection error:', err));

// Routes
const AuthRoutes = require('./Routes/Auth');
const UserRoutes = require('./Routes/User');
const AuctionRoutes = require('./Routes/Auction'); 

app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/auction', AuctionRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Hello from backend" });
});
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
    console.log(`User ${socket.id} joined auction ${auctionId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
