const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticateToken = require('../middleware/auth'); // Assuming you have an auth middleware

router.post('/add_money', authenticateToken, transactionController.addMoney)
router.post('/spend', authenticateToken, transactionController.spendMoney);
router.get('/transactions', authenticateToken, transactionController.getTransactionHistory);

module.exports = router;
