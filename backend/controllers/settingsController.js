const Settings = require('../models/settings');
const User = require('../models/user');

const getSettings = async (req, res) => {
  try {
    const { uid } = req.query;  // Adjusted to read from query parameters
    console.log(`Fetching settings for uid: ${uid}`);
    if (!uid) {
      return res.status(400).json({ message: 'UID is required' });
    }
    const settings = await Settings.findOne({ uid });
    if (!settings) {
      return res.json({
        pushNotification: true,
        inboxNotification: true,
        selectedLanguage: 'English'
      });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);  // Log the error for debugging
    res.status(500).json({ message: 'Error fetching settings', error });
  }
};

const saveSettings = async (req, res) => {
  try {
    const { uid, pushNotification, inboxNotification, selectedLanguage } = req.body;

    let settings = await Settings.findOne({ uid });

    if (!settings) {
      settings = new Settings({
        uid,
        pushNotification,
        inboxNotification,
        selectedLanguage
      });
    } else {
      settings.pushNotification = pushNotification;
      settings.inboxNotification = inboxNotification;
      settings.selectedLanguage = selectedLanguage;
    }

    await settings.save();
    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving settings', error });
  }
};

const getUserData = async (req, res) => {
  try {
    const user = await User.findOne({ uniqueId: req.user.userId }).select('-password');

    if (!user) {
      console.log('User not found:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      phone: user.phoneNumber,
      name: user.name,
      avatar: user.avatar,
      uid: user.uniqueId,
      walletBalance: user.walletBalance
    });
  } catch (error) {
    console.error('Failed to retrieve user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSettings,
  saveSettings,
  getUserData
};
