const express = require('express');
const router = express.Router();
const User = require('../Models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendMail = require('../Services/MailingSystem.js');

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  // Checking existence
  if (!user) {
    console.log("USER NOT FOUND");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Checking password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("WRONG PASSWORD");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '5h' });

  res.status(201).json({ message: "Login successful", token });
});

// Register
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(401).json({ message: "Incomplete information" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(401).json({ message: "User already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      email: email,
      password: hashedPassword,
      username: username
    });

    await newUser.save();

    res.status(201).json({
      message: "Registration successful"
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Problem in registration" });
  }
});

// Google Login
router.post("/google", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
  
  if (!token) {
    return res.status(405).json({
      message: "Server error"
    });
  }

  res.status(201).json({ token });
});

module.exports = router;
