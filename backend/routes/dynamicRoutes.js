const express = require('express');
const router = express.Router();
const dynamiccontroller = require('../controllers/dynamic');

router.get('/fetchnoti', dynamiccontroller.fetchnoti); // Assuming authentication is required for room creation


module.exports = router;
