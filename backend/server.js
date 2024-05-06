const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const { v4: uuidv4 } = require('uuid'); // Corrected import
const multer  = require('multer');

dotenv.config();


const app = express();
app.use(express.json());
app.use(require("cors")());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: String,
  verificationOTPToken: String,
  isVerified: { type: Boolean, default: false }
});
const User = mongoose.model("User", userSchema);

const memberSchema = new mongoose.Schema({
  memberName: String,
  uniqueId: String,
});
const Member = mongoose.model("Member", memberSchema);


//schema for profilestup
const userProfileSchema = new mongoose.Schema({
  userId: String,
  avatar: String,
  images: [String],
  memberName: String
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'korbin28@ethereal.email',
    pass: 'H87UBGc5ByMVpHMujT'
  }
});

// Generate a unique ID using UUID
const generateUniqueId = () => {
  return uuidv4();
};

// Generate a random username
const generateRandomUsername = () => {
  return "user" + Math.floor(Math.random() * 1000);
};

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log("Attempting to register:", email, "Password:", password);

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("User already exists");
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationOTPToken = randomstring.generate({ length: 4, charset: 'numeric' });
    console.log("Generated OTP for", email, "is:", verificationOTPToken);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationOTPToken,
      isVerified: false
    });

    await newUser.save();
    console.log("User saved:", newUser);

    // Sending email
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Please use the following OTP to verify your email: ${verificationOTPToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }
      console.log("OTP email sent:", info.response);
      res.status(200).json({ message: "OTP sent to your email", verificationOTPToken });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Failed to process your request" });
  }
});

app.post("/api/verifyOTP", async (req, res) => {
  const { email, otp } = req.body;

  console.log("Received for verification:", { email, otp });

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail, verificationOTPToken: otp });

    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "Invalid OTP or email" });
    }

    user.isVerified = true;
    await user.save();
    return res.status(200).json({ message: "OTP is verified", userId: user._id });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const uniqueId = generateUniqueId();
    const username = generateRandomUsername();

    const newMember = new Member({ memberName: username, uniqueId });
    await newMember.save();

    res.status(200).json({ uniqueId, username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// API endpoint for updating avatar and uploading images
app.post('/api/profile/avatar', upload.array('images'), (req, res) => {
  const { userId, memberName } = req.body;
  const avatar = req.files[0] ? req.files[0].filename : null; // Get the first uploaded file as the avatar

  // If memberName is provided, update it
  const updateFields = { avatar };
  if (memberName) {
      updateFields.memberName = memberName;
  }

  // Update user profile with avatar and possibly memberName
  UserProfile.findOneAndUpdate({ userId }, updateFields, { new: true })
      .then(profile => res.json(profile))
      .catch(err => res.status(400).json({ error: err.message }));
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));