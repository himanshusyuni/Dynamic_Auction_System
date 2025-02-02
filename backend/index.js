const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');


app.get('/' ,(req,res)=>{
  res.json({message : " Hello from backend"});
});
// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
const AuthRoutes = require('./Routes/auth');
app.use('/api/auth', AuthRoutes);

const UserRoutes = require('./Routes/User');
app.use('/api/user', UserRoutes);

const AuctionRoutes = require('./Routes/Auction');
app.use('/api/auction', AuctionRoutes);

// Set the server port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
