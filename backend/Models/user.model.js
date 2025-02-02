const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is necessary'],
    },
    password: {
      type: String,
      required: [true, 'Password is necessary'],
      minlength: 6,
    },
    profilePic: {  // Changed from userPic to profilePic for consistency
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email is necessary'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    dob: {
      type: Date,
    },
    address: String,
    purchasedItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],
    soldItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
