const Pushnotification = require('../models/pushnotification');

const fetchnoti = async (req, res) => {
  try {
    const notifications = await Pushnotification.find();
    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

module.exports = {
  fetchnoti
};
 