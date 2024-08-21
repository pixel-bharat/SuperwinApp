const Transaction = require('../models/transaction');
const User = require('../models/user');

const addMoney = async (req, res) => {
  const { amount } = req.body;
  const numericAmount = parseFloat(amount);
  console.log('Add money request for amount:', numericAmount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    console.log('Invalid amount:', numericAmount);
    return res.status(400).json({ message: 'Invalid amount' });
  }
  try {
    const user = await User.findOne({ uniqueId: req.user.userId });
    if (!user) {
      console.log('User not found with uniqueId:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    user.walletBalance += numericAmount;
    await user.save();
    console.log('Wallet balance updated for user:', req.user.userId);

    const transaction = new Transaction({
      uniqueId: user.uniqueId,
      userId: user._id,
      amount: numericAmount,
      transactionType: 'credit',
      description: 'Add money to wallet'
    });
    await transaction.save();
    console.log('Transaction saved for user:', req.user.userId);

    res.json({
      message: 'Money added successfully',
      walletBalance: user.walletBalance
    });
  } catch (error) {
    console.error('Error adding money:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const spendMoney = async (req, res) => {
  const { amount } = req.body;
  console.log('Spend money request:', amount);
  try {
    const user = await User.findOne({ uniqueId: req.user.userId });
    if (!user) {
      console.log('User not found with uniqueId:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.walletBalance < amount) {
      console.log('Insufficient balance for user:', req.user.userId);
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    user.walletBalance -= amount;
    await user.save();
    console.log('Balance updated after spending for user:', req.user.userId);

    const transaction = new Transaction({
      uniqueId: user.uniqueId,
      userId: user._id,
      amount,
      transactionType: 'debit',
      description: 'Spent from wallet'
    });
    await transaction.save();
    console.log('Debit transaction recorded for user:', req.user.userId);

    res.json({
      message: 'Amount spent successfully',
      newBalance: user.walletBalance
    });
  } catch (error) {
    console.error('Spend money error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    console.log('Fetching transactions for user:', req.user.userId);
    const transactions = await Transaction.find({
      uniqueId: req.user.userId
    }).sort({ transactionDate: -1 });
    // console.log('Transactions retrieved:', transactions.length);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addMoney,
  spendMoney,
  getTransactionHistory
};
