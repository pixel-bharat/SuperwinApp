const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user_id: String,
  notification: String,
  type: String,
  date: { type: Date, default: Date.now },
  amount: Number,
  room_id: String,
  room_name: String
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
