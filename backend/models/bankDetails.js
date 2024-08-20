const mongoose = require('mongoose');

const BankDetailsSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  upiId: { type: String, default: null },
  accountNumber: { type: String, default: null },
  bankName: { type: String, default: null },
  ifscCode: { type: String, default: null },
  cardNumber: { type: String, default: null },
  cardHolderName: { type: String, default: null },
  expiryDate: { type: String, default: null },
  cvv: { type: String, default: null },
});

const BankDetails = mongoose.model('BankDetails', BankDetailsSchema);

module.exports = BankDetails;