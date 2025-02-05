const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

// Middleware
app.use(express.json());

// CORS configuration (allow frontend origin)
const frontendURL = 'https://dynamic-auction-system-53nw.vercel.app'; // Replace with your actual frontend URL
app.use(cors({
  origin: frontendURL, // Only allow this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

// MongoDB Connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
const AuthRoutes = require('./Routes/Auth');  // Ensure file exists as Auth.js in Routes
app.use('/api/auth', AuthRoutes);

const UserRoutes = require('./Routes/User');  // Ensure file exists as User.js in Routes
app.use('/api/user', UserRoutes);

const AuctionRoutes = require('./Routes/Auction');  // Ensure file exists as Auction.js in Routes
app.use('/api/auction', AuctionRoutes);

// Home route (for testing)
app.get('/', (req, res) => {
  res.json({ message: "Hello from backend" });
});

// Set the server port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
