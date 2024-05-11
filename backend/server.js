const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const { v4: uuidv4 } = require("uuid"); // Corrected import
const validator = require("validator");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(express.json());
app.use(require("cors")());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "korbin28@ethereal.email",
    pass: "H87UBGc5ByMVpHMujT",
  },
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  verificationOTPToken: { type: String },
  isVerified: { type: Boolean, default: false },
  uniqueId: {type: String,default: uuidv4},
  name: String,
  avatar: String,
});
const User = mongoose.model("User", userSchema);

const generateUniqueId = () => {
  return "uuidv4" + Math.floor(Math.random() * 100000);
};
// Generate a random username
const generateRandomUsername = () => {
  return "SWID" + Math.floor(Math.random() * 10000);
};
// Temporarily store user session data
let userSessions = {};
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received registration request for:", email);
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("Registration failed: User already exists with email", email);
      return res.status(409).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationOTPToken = randomstring.generate({
      length: 4,
      charset: "numeric",
    });
    const uid = generateUniqueId();
    const username = generateRandomUsername();

    console.log(`OTP generated for ${email}: ${verificationOTPToken}`);
    console.log(
      `Unique ID (${uid}) and username (${username}) assigned to ${email}`
    );

    const normalizedEmail = email.trim().toLowerCase();

    userSessions[normalizedEmail] = {
      uid,
      username,
      email: normalizedEmail,
      password: hashedPassword,
      verificationOTPToken,
      isVerified: false,
    };

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Please use the following OTP to verify your email: ${verificationOTPToken}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Failed to send OTP email to", email, ":", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }
      console.log("OTP email successfully sent to", email);
      res.status(200).json({
        message:
          "OTP sent to your email. Please verify to complete registration.",
        uid: uid,
      });
    });
  } catch (error) {
    console.error("Signup error for", email, ":", error);
    res.status(500).json({ message: "Failed to process your request" });
  }
});



//
// Login API Here
//
// Login Endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.trim().toLowerCase(); // Normalize email to prevent case-sensitive mismatches
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log(`User not found: ${normalizedEmail}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      console.log(`User not verified: ${normalizedEmail}`);
      return res.status(401).json({
        message: "Please verify your account.",
        redirectUrl: "/verify-account", // Adjust the URL/path as necessary
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Invalid password attempt for user: ${normalizedEmail}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if member name is set to determine if profile setup is required
    const profileSetupRequired = !user.name || !user.avatar; // true if memberName is not set

    const token = jwt.sign(
      { userId: user.uniqueId },
      process.env.JWT_SECRET,
      //{ expiresIn: "1h" } // Token is valid for 1 hour
    );

    console.log(
      `User logged in successfully: ${normalizedEmail} with UID: ${user.uniqueId}`
    );
    res.status(200).json({
      message: "Login successful",
      email: user.email,
      token,
      avatar: user.avatar,
      name: user.name,
      uid: user.uniqueId, // Send back UID if you need it client-side
      profileSetupRequired, // Indicate if the user needs to complete their profile setup
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});










//
// verify OTP API Here
//
app.post("/api/verifyOTP", async (req, res) => {
  const { email, otp, uid } = req.body;
  if (!email || !otp || !uid) {
    return res.status(400).json({ message: "Missing email, OTP, or UID." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (
    !userSessions[normalizedEmail] ||
    userSessions[normalizedEmail].uid !== uid
  ) {
    return res
      .status(400)
      .json({ message: "No session found for " + email + " or UID mismatch." });
  }

  if (userSessions[normalizedEmail].verificationOTPToken !== otp) {
    console.log(
      `Verification failed for ${normalizedEmail}: Incorrect OTP provided`
    );
    return res
      .status(400)
      .json({ message: "Invalid OTP. Verification failed." });
  }

  console.log(
    `OTP verified for ${normalizedEmail} with UID ${uid}: Proceeding to save user data`
  );

  const newUser = new User({
    email: normalizedEmail,
    password: userSessions[normalizedEmail].password,
    isVerified: true,
    uniqueId: uid,
    name: null,
    avatar: null,
  });

  try {
    await newUser.save();
    console.log("User successfully saved:", newUser);
    delete userSessions[normalizedEmail];
    res
      .status(201)
      .json({ message: "User verified and registered successfully." });
  } catch (error) {
    console.error("Error saving user", normalizedEmail, ":", error);
    res.status(500).json({ message: "Failed to save user." });
  }
});

//
// Resend OTP API Here
//
app.post("/api/resendOTP", async (req, res) => {
  const { email } = req.body;

  if (!userSessions[email]) {
    console.log("Resend OTP failed: No session found for", email);
    return res.status(400).json({
      message:
        "No ongoing registration found or session expired. Start registration again.",
    });
  }
  // Generate a new OTP and update the session
  const newOTPToken = randomstring.generate({ length: 4, charset: "numeric" });
  userSessions[email].verificationOTPToken = newOTPToken;
  console.log(`New OTP generated for ${email}: ${newOTPToken}`);
  // Send the new OTP via email
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your new OTP",
    text: `Here is your new OTP: ${newOTPToken}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Failed to resend OTP email to", email, ":", error);
      return res.status(500).json({ message: "Failed to resend OTP email" });
    }
    console.log("OTP email successfully resent to", email);
    return res
      .status(200)
      .json({ message: "OTP resent successfully. Please check your email." });
  });
});


// POST endpoint to update user profile avatar and name

// Validation function to clean up main logic
function validateAvatar(avatar) {
  const allowedAvatars = [
    "avatar_1.png",
    "avatar_2.png",
    "avatar_3.png",
    "avatar_4.png",
    "avatar_5.png",
    "upload_avatar.png",
  ];

  // Check if the avatar is a valid URL
  if (
    validator.isURL(avatar, {
      protocols: ["http", "https"],
      require_protocol: true,
    })
  ) {
    return true; // The avatar is a valid URL
  }

  // If not a URL, check if it's a known avatar filename
  if (allowedAvatars.includes(avatar)) {
    return true; // The avatar is a recognized local filename
  }

  throw new Error(
    "Invalid avatar provided. Must be a valid URL or a recognized filename."
  );
}

app.post("/api/avatar", async (req, res) => {
  const { uid, memberName, avatar, email } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const user = await User.findOne({ uniqueId: uid });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    // Update the name if provided
    if (memberName && memberName.trim()) {
      user.name = memberName.trim();
    }

    // Validate and optionally update the avatar
    if (avatar) {
      if (!validateAvatar(avatar)) {
        return res.status(400).json({ message: "Invalid avatar reference" });
      }
      user.avatar = avatar; // Assume validateAvatar ensures validity
    }

    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      profile: { name: user.name, avatar: user.avatar, uid: user.uniqueId },
    });

    const token = jwt.sign(
      { userId: user.uniqueId },
      process.env.JWT_SECRET,
    //  { expiresIn: "1h" } // Token is valid for 1 hour
    );

    res.status(200).json({
      message: "Profile update successful",
      email: user.email,
      token,
      name: user.name,
      avatar: user.avatar,
      uid: user.uniqueId, // Send back UID if you need it client-side
      profileSetupRequired, // Indicate if the user needs to complete their profile setup
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



//
//
//Logout API here

const tokenBlacklistSchema = new mongoose.Schema({
  token: String,
  expiresAt: Date
});

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

app.post('/api/logout', async (req, res) => {
  try {
      const { token } = req.body; // Assuming the token is sent back on logout
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const blacklistedToken = new TokenBlacklist({
          token: token,
          expiresAt: new Date(decoded.exp * 1000)
      });

      await blacklistedToken.save();
      res.status(200).send('Logout successful and token blacklisted.');
  } catch (error) {
      res.status(500).json({ message: "Failed to logout" });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
