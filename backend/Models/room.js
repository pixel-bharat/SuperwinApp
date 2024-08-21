const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomID: { type: String, required: true, unique: true },
  uid: { type: String, required: true },
  roomType: { type: String, required: true },
  roomName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  membercount: { type: String, required: true },
  members: { type: [String], required: true },
  isActive: { type: Boolean, default: false },
  messages: [{ sender: String, message: String, timestamp: { type: Date, default: Date.now } }]
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
