const express = require('express');
const Authenticate = require('../Middlewares/authenticate');
const router = express.Router();
const User = require('../Models/user.model');

// Get user information (profile)
router.get('/profile', Authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select('-password');

    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(401).json({
        message: "USER NOT FOUND"
      });
    }

    res.json({ user });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "ERROR while fetching info"
    });
  }
});

// Update user profile information
router.patch('/profile', async (req, res) => {
  try {
    const { email, username, dob, address, userPic } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found"  // Use 404 for "not found"
      });
    }

    // Update user fields
    user.username = username || user.username;
    user.dob = dob || user.dob;
    user.address = address || user.address;
    user.userPic = userPic || userPic;

    // Save the updated user
    await user.save();
    console.log(user);

    // Send a success response
    return res.status(200).json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;
