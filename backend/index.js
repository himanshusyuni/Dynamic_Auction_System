const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors =require('cors');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my Express API');
});

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

app.use(cors());

const AuthRoutes = require('./Routes/auth');
app.use('/api/auth',AuthRoutes);

const UserRoutes = require('./Routes/User');
app.use('/api/user',UserRoutes);

const AuctionRoutes = require('./Routes/Auction');
app.use('/api/auction',AuctionRoutes);




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
