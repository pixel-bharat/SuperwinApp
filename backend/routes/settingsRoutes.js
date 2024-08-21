const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authenticateToken = require('../middleware/auth');
router.get('/settings' ,authenticateToken,settingsController.getSettings);
router.post('/settings', settingsController.saveSettings);

module.exports = router;