const express = require('express');
const router = express.Router();
const initController = require('../controllers/initController');

router.post('/games/init', initController.initGame);

module.exports = router;
