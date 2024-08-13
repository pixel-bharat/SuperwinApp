// API CONTROOLERS MODELS ARE LISTED HERE IN THIS FOLODER

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const twilio = require('twilio');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const multer = require('multer');
const http = require('http');

require('dotenv').config();
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  name: String,
  avatar: String,
  isNameSet: { type: Boolean, default: false },
  isAvatarSet: { type: Boolean, default: false },
  uniqueId: String,
  walletBalance: { type: Number, default: 0 }
});
const User = mongoose.model('User', userSchema);

const generateUniqueId = () => {
  return 'uuidv4' + Math.floor(Math.random() * 100000);
};

const userSessions = {}; // Global or appropriate scoped session storage

app.post('/send-otp', async (req, res) => {
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
    lowerCaseAlphabets: false
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
});

app.post('/verify-otp', async (req, res) => {
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
});
app.post('/logout', async (req, res) => {
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
});

// POST endpoint to update user profile avatar and name
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

app.post('/avatar', async (req, res) => {
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
});

//
//
//Token Verification Middleware  here
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Token verified:', decoded);
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  uniqueId: { type: String, required: true }, // Assuming uniqueId is a string identifier for users
  amount: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
  transactionType: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

//
//// Middleware to verify token

app.post('/api/add_money', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  const numericAmount = parseFloat(amount);
  console.log('Add money request for amount:', numericAmount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    console.log('Invalid amount:', numericAmount);
    return res.status(400).json({ message: 'Invalid amount' });
  }
  try {
    const user = await User.findOne({ uniqueId: req.user.userId });
    if (!user) {
      console.log('User not found with uniqueId:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    user.walletBalance += numericAmount;
    await user.save();
    console.log('Wallet balance updated for user:', req.user.userId);

    const transaction = new Transaction({
      uniqueId: user.uniqueId,
      userId: user._id,
      amount: numericAmount,
      transactionType: 'credit',
      description: 'Add money to wallet'
    });
    await transaction.save();
    console.log('Transaction saved for user:', req.user.userId);

    res.json({
      message: 'Money added successfully',
      walletBalance: user.walletBalance
    });
  } catch (error) {
    console.error('Error adding money:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//
//
//Spend money API here
app.post('/api/spend', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  console.log('Spend money request:', amount);
  try {
    const user = await User.findOne({ uniqueId: req.user.userId });
    if (!user) {
      console.log('User not found with uniqueId:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.walletBalance < amount) {
      console.log('Insufficient balance for user:', req.user.userId);
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    user.walletBalance -= amount;
    await user.save();
    console.log('Balance updated after spending for user:', req.user.userId);

    const transaction = new Transaction({
      uniqueId: user.uniqueId,
      userId: user._id,
      amount,
      transactionType: 'debit',
      description: 'Spent from wallet'
    });
    await transaction.save();
    console.log('Debit transaction recorded for user:', req.user.userId);

    res.json({
      message: 'Amount spent successfully',
      newBalance: user.walletBalance
    });
  } catch (error) {
    console.error('Spend money error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//
//
//Transaction History Endpoint

app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching transactions for user:', req.user.userId);
    const transactions = await Transaction.find({
      uniqueId: req.user.userId
    }).sort({ transactionDate: -1 });
    // console.log('Transactions retrieved:', transactions.length);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Data Endpoint
app.get('/api/userdata', authenticateToken, async (req, res) => {
  try {
    // console.log('Fetching data for user:', req.user.userId);
    const user = await User.findOne({ uniqueId: req.user.userId }).select('-password'); // Exclude password from the response
    if (!user) {
      console.log('User not found:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    // console.log('User data retrieved:', user.phoneNumber);
    res.json({
      phone: user.phoneNumber,
      name: user.name,
      avatar: user.avatar,
      uid: user.uniqueId, // Ensure consistency in naming, might be 'uid' or 'uniqueId'
      walletBalance: user.walletBalance
    });
  } catch (error) {
    console.error('Failed to retrieve user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// User Data Endpoint

const roomSchema = new mongoose.Schema({
  roomID: { type: String, required: true, unique: true },
  uid: { type: String, required: true },
  roomType: { type: String, required: true },
  roomName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  membercount: { type: String, required: true },
  members: { type: [String], required: true },
  isActive: { type: Boolean, default: false },
  messages: [{ sender: String, message: String, timestamp: { type: Date, default: Date.now } }]
});

const Room = mongoose.model('Room', roomSchema);
// Create Room Endpoint
// Create Room Endpoint
// Route to create a room
app.post('/create-room', async (req, res) => {
  const { roomID, roomName, roomType, uid, roles } = req.body;
  try {
    // Check if the roomID already exists
    const existingRoom = await Room.findOne({ roomID });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room ID already exists' });
    }
    // Extract the total number of members from roomType and format members as "1/totalMembers"
    const totalMembers = parseInt(roomType.split('_')[0]);
    const membercount = `${1}/${totalMembers}`;
    // Create a new room
    const newRoom = new Room({
      uid,
      roomID,
      roomType,
      roomName,
      membercount
      // roles: [`${uid}`], // Assigning the role of "admin" to the user who creates the room
    });
    await newRoom.save();
    res.json({ message: 'Room created successfully', room: newRoom });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room' });
  }
});
const joinedUserSchema = new mongoose.Schema({
  uid: String,
  rid: mongoose.Schema.Types.ObjectId, // Assuming rid is the ObjectId of the room
  joinedAt: { type: Date, default: Date.now }
});
const JoinedUser = mongoose.model('JoinedUser', joinedUserSchema);
app.post('/join-room', authenticateToken, async (req, res) => {
  try {
    const { roomID } = req.body;
    const uid = req.user.userId;
    // console.log(roomID);
    // console.log(uid);
    const existingRoom = await Room.findOne({ roomID });
    if (!existingRoom) {
      return res.status(400).json({ message: 'Room ID not found' });
    }
    // Check if the user is the admin of the room
    if (existingRoom.uid === uid) {
      return res.status(400).json({ message: 'You are already the admin of the room' });
    }
    // Check if the user is already a member of the room
    if (existingRoom.members.includes(uid)) {
      return res.status(400).json({ message: 'User is already a member of the room' });
    }

    let [currentMembers, totalMembers] = existingRoom.membercount.split('/').map(Number);
    currentMembers += 1;
    existingRoom.membercount = `${currentMembers}/${totalMembers}`;
    existingRoom.members.push(uid);
    await existingRoom.save();
    await User.updateOne(
      { uniqueId: uid },
      {
        $addToSet: { rooms: roomID }
      }
    );
    res.json({ message: 'Joined room successfully', existingRoom });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ message: 'Failed to join room' });
  }
});
// Fetch Recent Rooms Endpoint
app.get('/admin-rooms', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uniqueId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Fetch rooms created by the user
    let recentRooms = await Room.find({ uid: user.uniqueId }).sort({
      createdAt: -1
    });
    // Adding message and role to each room item
    recentRooms = recentRooms.map((room) => ({
      ...room.toObject(), // Convert Mongoose document to plain JavaScript object
      role: 'Admin',
      navigate: 'adminroom'
    }));
    res.json(recentRooms);
  } catch (error) {
    console.error('Error fetching recent rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Fetch Recent Rooms Endpoint
app.get('/member-rooms', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uniqueId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Fetch rooms where the user is in the roles array
    let recentRooms = await Room.find({
      members: user.uniqueId
    }).sort({ createdAt: -1 });
    // Adding message and role to each room item
    recentRooms = recentRooms.map((room) => ({
      ...room.toObject(), // Convert Mongoose document to plain JavaScript object
      role: 'Member',
      navigate: 'RoomUser'
    }));
    // console.log(recentRooms);
    // Sending the modified recentRooms data
    res.json(recentRooms);
  } catch (error) {
    console.error('Error fetching recent rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const BankDetailsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  upiId: String,
  accountNumber: String,
  bankName: String,
  ifscCode: String,
  cardNumber: String,
  cardHolderName: String,
  expiryDate: String,
  cvv: String,
  uid: { type: String, required: true }
});

const BankDetails = mongoose.model('BankDetails', BankDetailsSchema);
// Routes
app.post('/api/verify/upi', async (req, res) => {
  const { upiId } = req.body;
  const isVerified = true; // Simulate verification logic (replace with actual verification logic)
  if (isVerified) {
    res.json({ message: 'UPI ID verified successfully' });
  } else {
    res.status(400).json({ error: 'UPI ID verification failed' });
  }
});

app.post('/api/verify/account', async (req, res) => {
  const { accountNumber, bankName, ifscCode } = req.body;
  const isVerified = true; // Simulate verification logic (replace with actual verification logic)
  if (isVerified) {
    res.json({ message: 'Account details verified successfully' });
  } else {
    res.status(400).json({ error: 'Account details verification failed' });
  }
});

app.post('/api/verify/creditcard', async (req, res) => {
  const { cardNumber, cardHolderName, expiryDate, cvv } = req.body;
  const isVerified = true; // Simulate verification logic (replace with actual verification logic)
  if (isVerified) {
    res.json({ message: 'Credit card details verified successfully' });
  } else {
    res.status(400).json({ error: 'Credit card details verification failed' });
  }
});

app.post('/api/saveBankDetails', async (req, res) => {
  const { uid, type, upiId, accountNumber, bankName, ifscCode, cardNumber, cardHolderName, expiryDate, cvv } = req.body;

  const bankDetails = new BankDetails({
    type,
    upiId,
    accountNumber,
    bankName,
    ifscCode,
    cardNumber,
    cardHolderName,
    expiryDate,
    cvv,
    uid
  });

  try {
    const savedBankDetails = await bankDetails.save();
    res.json({ message: 'Bank details saved successfully', data: savedBankDetails });
  } catch (err) {
    console.error('Failed to save bank details:', err);
    res.status(500).json({ error: 'Failed to save bank details' });
  }
});

app.get('/api/user-bank-details/:uid', async (req, res) => {
  const uid = req.params.uid;

  try {
    console.log(`fetching bank details for uid: ${uid}`);

    const userBankDetails = await BankDetails.find({ uid });

    if (userBankDetails.length === 0) {
      return res.status(404).json({ error: 'Bank details not found for this user' });
    }

    res.json(userBankDetails);
  } catch (err) {
    console.error('Error fetching bank details:', err);
    res.status(500).json({ error: 'Failed to fetch bank details' });
  }
});

const NotificationSchema = new mongoose.Schema({
  user_id: String,
  notification: String,
  type: String,
  date: { type: Date, default: Date.now },
  amount: Number,
  room_id: String,
  room_name: String
});

const Notification = mongoose.model('Notification', NotificationSchema);

// // Insert initial data if needed
// const initialNotifications = [
//   {
//     user_id: 'uuidv424401',
//     notifications: [
//       {
//         notification: 'Added money to account',
//         date: new Date('2024-06-20T10:00:00Z'),
//         type: 'add_money',
//         amount: 100,
//       },
//       {
//         notification: 'Withdrew money from account',
//         date: new Date('2024-06-19T09:00:00Z'),
//         type: 'withdraw_money',
//         amount: 50,
//       },
//       {
//         notification: 'Joined a new room',
//         date: new Date('2024-06-18T08:30:00Z'),
//         type: 'join_room',
//         room_id: 'room123',
//         room_name: 'Gaming Room',
//       },
//     ],
//   },
// ];

// // Check if data already exists, if not insert initial data
// const checkAndInsertInitialNotifications = async () => {
//   try {
//     const user = await Notification.findOne({ user_id: 'uuidv424401' });
//     if (!user) {
//       await Notification.insertMany(initialNotifications);
//       console.log('Initial notifications inserted');
//     }
//   } catch (error) {
//     console.error('Error checking or inserting initial notifications:', error);
//   }
// };

// checkAndInsertInitialNotifications();

// // API Endpoint to fetch notifications by user_id
// app.post('/api/notifications', async (req, res) => {
//   const { user_id } = req.body;

//   try {
//     const userNotifications = await Notification.findOne({ user_id });
//     if (userNotifications) {
//       res.json(userNotifications);
//     } else {
//       res.status(404).json({ message: 'No notifications found for this user.' });
//     }
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Start server
app.get('/api/notifications/all', async (req, res) => {
  try {
    const notifications = await Notification.find(); // Retrieve all notifications from MongoDB
    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});



















// Define the settings schema and model
const settingsSchema = new mongoose.Schema({
  uid: String,
  pushNotification: { type: Boolean, default: true },
  inboxNotification: { type: Boolean, default: true },
  selectedLanguage: { type: String, default: 'English' }
});

const Settings = mongoose.model('setting', settingsSchema);

app.get('/api/settings', async (req, res) => {
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
});



// Endpoint to save/update settings
app.post('/api/settings', async (req, res) => {
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
});















// API / CONTROLLER FOR EDIT PROFILE

// Update profile route
app.put('/api/profile/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { memberName, avatar } = req.body;

  console.log(`Updating profile for user ${id} with name ${memberName} and avatar ${avatar}`);

  try {
    const user = await User.findByIdAndUpdate(id, { name: memberName, avatar: avatar }, { new: true });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Route to update user profile
// Example backend logic to update user profile
// Example backend logic to update user profile
// Example backend logic to update user profile
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Destination folder where uploaded files will be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Naming convention for uploaded files
//   },
// });

// const upload = multer({ storage: storage });

// app.get('/api/users/:id', authenticateToken, (req, res) => {
//   const user = users.find((u) => u.id === parseInt(req.params.id));
//   if (!user) return res.status(404).send('User not found');
//   res.json(user);
// });

// // Update user profile with avatar upload
// app.put('/api/users/:id', authenticateToken, upload.single('avatar'), (req, res) => {
//   const userId = parseInt(req.params.id);
//   const user = users.find((u) => u.id === userId);
//   if (!user) return res.status(404).send('User not found');

//   // Update user's avatar
//   user.avatar = req.file.filename;

//   res.status(200).json({ message: 'Profile updated successfully', avatar: req.file.filename });
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
