const express = require('express');
const router = express.Router();
const bankDetailsController = require('../controllers/bankDetailsController');
const authenticateToken = require('../middleware/auth');

router.post('/verify/upi', bankDetailsController.verifyUPI);
router.post('/verify/account', bankDetailsController.verifyAccount);
router.post('/verify/creditcard',bankDetailsController.verifyCreditCard);
router.post('/saveBankDetails',bankDetailsController.saveBankDetails);
router.get('/user-bank-details/:uid',bankDetailsController.getUserBankDetails);

module.exports = router;
