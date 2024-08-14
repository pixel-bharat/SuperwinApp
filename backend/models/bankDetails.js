const mongoose = require('mongoose');

const BankDetailsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  upiId: String,
  accountNumber: String,
  bankName: String,
  ifscCode: String,
  cardNumber: String,
  cardHolderName: String,
  expiryDate: String,
  cvv: String,
  uid: { type: String, required: true }
});

const BankDetails = mongoose.model('BankDetails', BankDetailsSchema);

module.exports = BankDetails;
