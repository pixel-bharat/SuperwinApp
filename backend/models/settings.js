const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  uid: String,
  pushNotification: { type: Boolean, default: true },
  inboxNotification: { type: Boolean, default: true },
  selectedLanguage: { type: String, default: 'English' }
});

const Settings = mongoose.model('setting', settingsSchema);

module.exports = Settings;
