const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const twilio = require('twilio');
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const multer = require('multer');
const http = require('http');
const Pushnotification = require('./models/pushnotification');

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
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/api/dynamic/fetchnoti', async (req, res) => {
  try {
    const notifications = await Pushnotification.find();
    console.log('Fetched notifications:', notifications);
    res.status(200).json({notifications});
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({error: 'Failed to fetch notifications.'});
  }
});

const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bankDetailsRoutes = require('./routes/bankDetailsRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const gamesRoutes=require("../backend/routes/games")
// const dynamicRoutes = require('./routes/dynamicRoutes');
const initRoutes=require("../backend/routes/init")

// app.use('/api/dynamic', dynamicRoutes);

// Register your routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bankdetails', bankDetailsRoutes);
// app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);


app.use("/games", gamesRoutes);
app.use('/api', initRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
