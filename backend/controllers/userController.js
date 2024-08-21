const User = require('../models/user');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const twilio = require('twilio');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const userSessions = {}; // Global or appropriate scoped session storage

const generateUniqueId = () => {
  return 'uuidv4' + Math.floor(Math.random() * 100000);
};

const sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).send('Phone number is required');
  }

  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCase: false,
    specialChars: false,
    alphabets: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });

  try {
    let user = await User.findOne({ phoneNumber: cleanedPhoneNumber });

    if (!user) {
      console.log(`New User Register with Phone number ${cleanedPhoneNumber}`);
      user = new User({ phoneNumber: cleanedPhoneNumber });
      const uid = generateUniqueId();
      user.uniqueId = uid;
      console.log(`Generated UID for ${cleanedPhoneNumber}: ${uid}`);
    } else {
      console.log(`User found. Phone number: ${user.phoneNumber}, UID: ${user.uniqueId}`);
    }

    // Store OTP, phone number, and unique ID in local session using cleanedPhoneNumber as the key
    userSessions[cleanedPhoneNumber] = {
      otp,
      phoneNumber: cleanedPhoneNumber,
      uid: user.uniqueId
    };
    // console.log(`Stored session data for ${cleanedPhoneNumber}: `, userSessions[cleanedPhoneNumber]);

    await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+${cleanedPhoneNumber}`
    });

    console.log(`OTP sent to ${phoneNumber}: ${otp}`);
    res.status(200).send('OTP sent successfully');
  } catch (error) {
    console.error(`Error sending OTP to ${phoneNumber}: `, error);
    res.status(500).send('Error sending OTP');
  }
};

const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.status(400).send('Phone number and OTP are required');
  }

  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
  // console.log(`Verifying OTP for phone number: ${cleanedPhoneNumber}, OTP: ${otp}`);

  try {
    const sessionData = userSessions[cleanedPhoneNumber];
    // console.log(`Session data for ${cleanedPhoneNumber}: `, sessionData);

    if (!sessionData) {
      console.log(`No session data found for phone number: ${cleanedPhoneNumber}`);
      return res.status(400).send('Invalid phone number or OTP');
    }

    if (sessionData.otp !== otp) {
      console.log(`Invalid OTP for phone number: ${cleanedPhoneNumber}. Expected: ${sessionData.otp}, Received: ${otp}`);
      return res.status(400).send('Invalid OTP');
    }

    let user = await User.findOne({ phoneNumber: cleanedPhoneNumber });

    if (!user) {
      user = new User({
        phoneNumber: cleanedPhoneNumber,
        uniqueId: sessionData.uid
      });
      await user.save();
      // console.log(`New user registered. Phone number: ${cleanedPhoneNumber}, UID: ${sessionData.uid}`);
    } else {
      // console.log(`Existing user verified. Phone number: ${user.phoneNumber}, UID: ${user.uniqueId}`);
    }

    // OTP verification successful, cleanup session data
    delete userSessions[cleanedPhoneNumber];

    // Check if profile setup is required
    const profileSetupRequired = !(user.isNameSet && user.isAvatarSet);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.uniqueId,
        phoneNumber: user.phoneNumber,
        name: user.name,
        avatar: user.avatar,
        walletBalance: user.walletBalance,
        profileSetupRequired
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // console.log(`OTP verified successfully for phone number: ${cleanedPhoneNumber}`);
    res.status(200).send({
      message: 'OTP verified successfully',
      uid: user.uniqueId,
      token,
      profileSetupRequired,
      name: user.name,
      phoneNumber: user.phoneNumber,
      walletBalance: user.walletBalance
    });
  } catch (error) {
    console.error(`Error verifying OTP for phone number: ${cleanedPhoneNumber}: `, error);
    res.status(500).send('Error verifying OTP');
  }
};

const logout = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).send('Phone number is required');
  }
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
  console.log(`Logging out user with phone number: ${cleanedPhoneNumber}`);
  try {
    await User.updateOne({ phoneNumber: cleanedPhoneNumber }, { isActive: false });
    console.log(`User with phone number ${cleanedPhoneNumber} logged out`);
    res.status(200).send('Logged out successfully');
  } catch (error) {
    console.error(`Error logging out user with phone number ${cleanedPhoneNumber}: `, error);
    res.status(500).send('Error logging out');
  }
};

const updateProfile = async (req, res) => {
  const { uid, memberName, avatar, phoneNumber } = req.body;

  if (!uid || !phoneNumber) {
    return res.status(400).json({ message: 'User ID and phone number are required' });
  }

  try {
    const user = await User.findOne({ uniqueId: uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (memberName && memberName.trim()) {
      user.name = memberName.trim();
      user.isNameSet = true;
    }

    if (avatar) {
      if (!validateAvatar(avatar)) {
        return res.status(400).json({ message: 'Invalid avatar reference' });
      }
      user.avatar = avatar;
      user.isAvatarSet = true;
    }

    const profileSetupRequired = !(user.isNameSet && user.isAvatarSet);

    const token = jwt.sign(
      {
        userId: user.uniqueId,
        phoneNumber: user.phoneNumber,
        name: user.name,
        avatar: user.avatar,
        profileSetupRequired
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await user.save();

    res.status(200).json({
      message: 'Profile update successful',
      profile: {
        phoneNumber: user.phoneNumber,
        name: user.name,
        avatar: user.avatar,
        uid: user.uniqueId,
        profileSetupRequired
      },
      token
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

function validateAvatar(avatar) {
  const allowedAvatars = ['avatar_1', 'avatar_2', 'avatar_3', 'avatar_4', 'avatar_5', 'upload_avatar'];

  if (
    validator.isURL(avatar, {
      protocols: ['http', 'https'],
      require_protocol: true
    })
  ) {
    return true;
  }

  if (allowedAvatars.includes(avatar)) {
    return true;
  }

  throw new Error('Invalid avatar provided. Must be a valid URL or a recognized filename.');
}
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
  sendOTP,
  verifyOTP,
  logout,
  updateProfile,
  getUserData
};
