const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth'); // Assuming you have an auth middleware

router.post('/send-otp', userController.sendOTP);
router.post('/verify-otp', userController.verifyOTP);
router.post('/logout',authenticateToken, userController.logout);
router.post('/avatar', authenticateToken, userController.updateProfile); // Assuming authentication is required for profile update
router.get('/userdata', authenticateToken, userController.getUserData); 
module.exports = router;
