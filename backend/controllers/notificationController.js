const Notification = require('../models/notification');

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find(); // Retrieve all notifications from MongoDB
    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

module.exports = {
  getAllNotifications
};
