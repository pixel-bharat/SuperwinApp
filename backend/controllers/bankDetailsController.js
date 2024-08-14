const BankDetails = require('../models/bankDetails');

const verifyUPI = async (req, res) => {
  const { upiId } = req.body;
  const isVerified = true;
  if (isVerified) {
    res.json({ message: 'UPI ID verified successfully' });
  } else {
    res.status(400).json({ error: 'UPI ID verification failed' });
  }
};

const verifyAccount = async (req, res) => {
  const { accountNumber, bankName, ifscCode } = req.body;
  const isVerified = true; 
  if (isVerified) {
    res.json({ message: 'Account details verified successfully' });
  } else {
    res.status(400).json({ error: 'Account details verification failed' });
  }
};

const verifyCreditCard = async (req, res) => {
  const { cardNumber, cardHolderName, expiryDate, cvv } = req.body;
  const isVerified = true; // Simulate verification logic (replace with actual verification logic)
  if (isVerified) {
    res.json({ message: 'Credit card details verified successfully' });
  } else {
    res.status(400).json({ error: 'Credit card details verification failed' });
  }
};

const saveBankDetails = async (req, res) => {
  const { uid, type, upiId, accountNumber, bankName, ifscCode, cardNumber, cardHolderName, expiryDate, cvv } = req.body;

  const bankDetails = new BankDetails({
    type,
    upiId,
    accountNumber,
    bankName,
    ifscCode,
    cardNumber,
    cardHolderName,
    expiryDate,
    cvv,
    uid
  });

  try {
    const savedBankDetails = await bankDetails.save();
    res.json({ message: 'Bank details saved successfully', data: savedBankDetails });
  } catch (err) {
    console.error('Failed to save bank details:', err);
    res.status(500).json({ error: 'Failed to save bank details' });
  }
};

const getUserBankDetails = async (req, res) => {
  const uid = req.params.uid;

  try {
    console.log(`fetching bank details for uid: ${uid}`);

    const userBankDetails = await BankDetails.find({ uid });

    if (userBankDetails.length === 0) {
      return res.status(404).json({ error: 'Bank details not found for this user' });
    }

    res.json(userBankDetails);
  } catch (err) {
    console.error('Error fetching bank details:', err);
    res.status(500).json({ error: 'Failed to fetch bank details' });
  }
};

module.exports = {
  verifyUPI,
  verifyAccount,
  verifyCreditCard,
  saveBankDetails,
  getUserBankDetails
};
