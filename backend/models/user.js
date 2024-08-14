const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  name: String,
  avatar: String,
  isNameSet: { type: Boolean, default: false },
  isAvatarSet: { type: Boolean, default: false },
  uniqueId: String,
  walletBalance: { type: Number, default: 0 },
  // ... other fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;
