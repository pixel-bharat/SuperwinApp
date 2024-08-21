const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authenticateToken = require('../middleware/auth'); // Assuming you have an auth middleware

router.post('/create-room', authenticateToken, roomController.createRoom); // Assuming authentication is required for room creation
router.post('/join-room', authenticateToken, roomController.joinRoom); // Assuming authentication is required for joining a room
router.get('/admin-rooms', authenticateToken, roomController.getAdminRooms);
router.get('/member-rooms', authenticateToken, roomController.getMemberRooms);

module.exports = router;
