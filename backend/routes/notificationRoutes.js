const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticateToken = require('../middleware/auth');
router.get('/all',notificationController.getAllNotifications);

module.exports = router;
