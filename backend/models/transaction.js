const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  uniqueId: { type: String, required: true }, 
  amount: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
  transactionType: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
