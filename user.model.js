// user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['online', 'offline', 'hidden'], default: 'offline' },
  isOnline: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
