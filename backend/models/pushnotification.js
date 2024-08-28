const mongoose = require('mongoose');

const ArrNotificationSchema = new mongoose.Schema({
  notfi_arr: [{type: String}],
});

const Pushnotification = mongoose.model('Arrnotification', ArrNotificationSchema);

module.exports = Pushnotification;
