
const mongoose = require('mongoose');

const joinedUserSchema = new mongoose.Schema({
  uid: String,
  rid: mongoose.Schema.Types.ObjectId, 
  joinedAt: { type: Date, default: Date.now }
});

const JoinedUser = mongoose.model('JoinedUser', joinedUserSchema);

module.exports = JoinedUser;
