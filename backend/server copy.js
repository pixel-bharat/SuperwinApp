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
const cors = require("cors");
app.use(cors());

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
  isVerified: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },  
  phoneNumber: { type: Number, unique: true, required: true, lowercase: true },
  uniqueId: { type: String, default: uuidv4 },
  name: String,
  avatar: String,
});


const twilio = require('twilio');

const accountSid = 'AC88f7fc3fa10ad6a768ee8278dc43ed6d'; // Your Twilio account SID
const authToken = 'e4e503c5e372e41b1a0d4677403edcb5'; // Your Twilio Auth Token
const client = twilio(accountSid, authToken);

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
  const { phoneNumber } = req.body;
  console.log("Received registration request for:", phoneNumber);
  try {
    let existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      console.log("User already exists with phone number", phoneNumber);

      // Generate a new OTP
      const verificationOTPToken = randomstring.generate({
        length: 4,
        charset: "numeric",
      });
      
      console.log(`OTP generated for ${phoneNumber}: ${verificationOTPToken}`);

      // Update user session with new OTP
      userSessions[phoneNumber] = {
        uid: existingUser.uid,
        username: existingUser.username,
        phoneNumber,
        verificationOTPToken,
        isVerified: false,
      };

      // Send OTP via SMS using Twilio
      client.messages.create({
        body: `Please use the following OTP to verify your phone number: ${verificationOTPToken}`,
        from: '+1 814 228 5252', // Your Twilio phone number
        to: phoneNumber
      }).then(message => {
        console.log("OTP SMS successfully sent to", phoneNumber);
        res.status(200).json({
          message: "OTP sent to your phone number. Please verify to complete registration.",
          uid: existingUser.uid,
        });
      }).catch(error => {
        console.error("Failed to send OTP SMS to", phoneNumber, ":", error);
        return res.status(500).json({ message: "Failed to send OTP SMS" });
      });
    } else {
      // If user doesn't exist, proceed with creating a new user
      const verificationOTPToken = randomstring.generate({
        length: 4,
        charset: "numeric",
      });
      const uid = generateUniqueId();
      const username = generateRandomUsername();

      console.log(`OTP generated for ${phoneNumber}: ${verificationOTPToken}`);
      console.log(`Unique ID (${uid}) and username (${username}) assigned to ${phoneNumber}`);

      userSessions[phoneNumber] = {
        uid,
        username,
        phoneNumber,
        verificationOTPToken,
        isVerified: false,
      };

      // Send OTP via SMS using Twilio
      client.messages.create({
        body: `Please use the following OTP to verify your phone number: ${verificationOTPToken}`,
        from: '+1 814 228 5252', // Your Twilio phone number
        to: phoneNumber
      }).then(message => {
        console.log("OTP SMS successfully sent to", phoneNumber);
        res.status(200).json({
          message: "OTP sent to your phone number. Please verify to complete registration.",
          uid: uid,
        });
      }).catch(error => {
        console.error("Failed to send OTP SMS to", phoneNumber, ":", error);
        return res.status(500).json({ message: "Failed to send OTP SMS" });
      });
    }
  } catch (error) {
    console.error("Signup error for", phoneNumber, ":", error);
    res.status(500).json({ message: "Failed to process your request" });
  }
});



// app.post("/api/verifylogin-otp", async (req, res) => {
  // const { phoneNumber, otp } = req.body;
  // console.log("Received OTP verification request for:", phoneNumber);
  // const session = userSessions[phoneNumber];

  // if (!session || session.verificationOTPToken !== otp) {
  //   console.log("OTP verification failed for", phoneNumber);
  //   return res.status(400).json({ message: "Invalid OTP" });
  // }

  // console.log("OTP verified for", phoneNumber);

  // try {
  //   // Find the user in the database by phone number
  //   const user = await User.findOne({ phoneNumber: session.phoneNumber });

  //   if (!user) {
  //     // If user not found, return error
  //     console.log("User not found:", session.phoneNumber);
  //     return res.status(404).json({ message: "User not found" });
  //   }

  //   // If user found, create a new session and redirect to home screen
  //   const token = jwt.sign(
  //     {
  //       userId: user.uniqueId,
  //       email: user.email,
  //       avatar: user.avatar,
  //       name: user.name,
  //       walletBalance: user.walletBalance,
  //     },
  //     process.env.JWT_SECRET
  //   );

  //   res.status(200).json({
  //     message: "Login successful",
  //     token,
  //     user: {
  //       email: user.email,
  //       name: user.name,
  //       avatar: user.avatar,
  //       uid: user.uniqueId,
  //       name: user.name,
  //       profileSetupRequired: !user.memberName, // Determine if profile setup is required
  //     },
  //   });
  // } catch (error) {
  //   console.error("Failed to verifyfgh OTP:", error);
  //   res.status(500).json({ message: "Failed to vekrify OTP" });
  // }
// });

app.post("/api/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    let existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      console.log("Received OTP verification request for existing user:", phoneNumber);
      const session = userSessions[phoneNumber];

      if (!session || session.verificationOTPToken !== otp) {
        console.log("OTP verification failed for", phoneNumber);
        return res.status(400).json({ message: "Invalid OTP" });
      }

      console.log("OTP verified for", phoneNumber);

      const token = jwt.sign(
        {
          userId: existingUser.uniqueId,
          phonerNumber: existingUser.phonerNumber,
          avatar: existingUser.avatar,
          name: existingUser.name,
          walletBalance: existingUser.walletBalance,
        },
        process.env.JWT_SECRET
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          phonerNumber: existingUser.phonerNumber,
          name: existingUser.name,
          avatar: existingUser.avatar,
          uid: existingUser.uniqueId,
          profileSetupRequired: !existingUser.memberName,
        },
        exists: true, // Indicate that the user exists
      });
    } 
    
    // If user doenot exists then create a new user
    
    else {
      console.log("Received OTP verification request for new user:", phoneNumber);
      const session = userSessions[phoneNumber];

      if (!session || session.verificationOTPToken !== otp) {
        console.log("OTP verification failed for", phoneNumber);
        return res.status(400).json({ message: "Invalid OTP" });
      }

      console.log("OTP verified for new user:", phoneNumber);
      const newUser = new User({
        uniqueId: session.uid,
        username: session.username,
        phoneNumber: session.phoneNumber,
        isVerified: true,
      });

      await newUser.save();
      console.log("New user created:", phoneNumber);
      delete userSessions[phoneNumber]; // Clean up session data after successful registration

      return res.status(200).json({
        message: "Registration successful",
        uid: session.uid,
        exists: false, // Indicate that the user is new
      });
    }
  } catch (error) {
    console.error("Failed to process OTP verification:", error);
    res.status(500).json({ message: "Failed to process OTP verification" });
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


//
// Login API Here
//
// Login Endpoint

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Attempting to login user:", email);
  try {
    const normalizedEmail = email.trim().toLowerCase();
    console.log("Normalized email:", normalizedEmail);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log("No user found with email:", normalizedEmail);
      return res.status(401).json({ message: "Email is not registered" });
    }
   
    if (!user.isVerified) {
      console.log("User not verified:", normalizedEmail);
      return res
        .status(401)
        .json({
          message: "Please verify your account.",
          redirectUrl: "/verify-account",
        });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", normalizedEmail);
      return res.status(401).json({ message: "Invalid email or password" });
    }
// Check if member name is set to determine if profile setup is required
const profileSetupRequired = !user.memberName; // true if memberName is not set
    console.log("User authenticated, generating token:", normalizedEmail);
    const token = jwt.sign(
      {
        userId: user.uniqueId,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
        walletBalance: user.walletBalance,
      },
      process.env.JWT_SECRET
    ); 
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        uid: user.uniqueId,
        name: user.name,
        profileSetupRequired
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});














// POST endpoint to update user profile avatar and name

// Validation function to clean up main logic
function validateAvatar(avatar) {
  const allowedAvatars = [
    "avatar_1",
    "avatar_2",
    "avatar_3",
    "avatar_4",
    "avatar_5",
    "upload_avatar",
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
  const { uid, memberName, avatar, phoneNumber } = req.body;

  if (!uid || !phoneNumber) {
    return res.status(400).json({ message: "User ID and phoneNumber are required" });
  }

  try {
    const user = await User.findOne({ uniqueId: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the name if provided
    if (memberName && memberName.trim()) {
      user.name = memberName.trim();
    }

    // Validate and optionally update the avatar
    if (avatar) {
      if (!validateAvatar(avatar)) {
        return res.status(400).json({ message: "Invalid avatar reference" });
      }
      user.avatar = avatar;
    }

    // Determine if the profile setup is required
    const profileSetupRequired = !(user.name && user.avatar);

    // Generate JWT token before saving user to avoid async timing issues
    const token = jwt.sign({
      userId: user.uniqueId,
      phoneNumber: user.phoneNumber,
      name: user.name,
      avatar: user.avatar,
      profileSetupRequired,
    }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token expiration is optional

    // Save updated user information
    await user.save();

    // Send a single response with all necessary information
    res.status(200).json({
      message: "Profile update successful",
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
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


//
//
//Logout API here

const tokenBlacklistSchema = new mongoose.Schema({
  token: String,
  expiresAt: Date,
});

const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);

app.post("/api/logout", async (req, res) => {
  try {
    const { token } = req.body; // Assuming the token is sent back on logout
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const blacklistedToken = new TokenBlacklist({
      token: token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    await blacklistedToken.save();
    res.status(200).send("Logout successful and token blacklisted.");
  } catch (error) {
    res.status(500).json({ message: "Failed to logout" });
  }
});



//
//
//Token Verification Middleware  here
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token verified:", decoded);
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(400).json({ message: "Invalid token." });
  }
};

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  uniqueId: { type: String, required: true }, // Assuming uniqueId is a string identifier for users
  amount: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
  transactionType: { type: String, enum: ["Credit", "Debit"], required: true },
  description: { type: String },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

//
//// Middleware to verify token

app.post("/api/add_money", authenticateToken, async (req, res) => {
  const { amount } = req.body;
  const numericAmount = parseFloat(amount);
  console.log("Add money request for amount:", numericAmount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    console.log("Invalid amount:", numericAmount);
    return res.status(400).json({ message: "Invalid amount" });
  }
  try {
    const user = await User.findOne({ uniqueId: req.user.userId });
    if (!user) {
      console.log("User not found with uniqueId:", req.user.userId);
      return res.status(404).json({ message: "User not found" });
    }
    user.walletBalance += numericAmount;
    await user.save();
    console.log("Wallet balance updated for user:", req.user.userId);

    const transaction = new Transaction({
      uniqueId: user.uniqueId, // Assuming transactions use `uniqueId`
      amount: numericAmount,
      transactionType: "Credit",
      description: "Add money to wallet",
    });
    await transaction.save();
    console.log("Transaction saved for user:", req.user.userId);

    res.json({
      message: "Money added successfully",
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    console.error("Error adding money:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//
//
//Spend money API here
app.post("/api/spend", authenticateToken, async (req, res) => {
  const { amount } = req.body;
  console.log("Spend money request:", amount);
  try {
    const user = await User.findOne({ uniqueId: req.user.userId });
    if (!user) {
      console.log("User not found with uniqueId:", req.user.userId);
      return res.status(404).json({ message: "User not found" });
    }
    if (user.walletBalance < amount) {
      console.log("Insufficient balance for user:", req.user.userId);
      return res.status(400).json({ message: "Insufficient balance" });
    }
    user.walletBalance -= amount;
    await user.save();
    console.log("Balance updated after spending for user:", req.user.userId);

    const transaction = new Transaction({
      uniqueId: user.uniqueId,
      amount,
      transactionType: "Debit",
      description: "Spent from wallet",
    });
    await transaction.save();
    console.log("Debit transaction recorded for user:", req.user.userId);

    res.json({
      message: "Amount spent successfully",
      newBalance: user.walletBalance,
    });
  } catch (error) {
    console.error("Spend money error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//
//
//Transaction History Endpoint

app.get("/api/transactions", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching transactions for user:", req.user.userId);
    const transactions = await Transaction.find({
      uniqueId: req.user.userId,
    }).sort({ transactionDate: -1 });
    console.log("Transactions retrieved:", transactions.length);
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Data Endpoint
app.get("/api/userdata", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching data for user:", req.user.userId);
    const user = await User.findOne({ uniqueId: req.user.userId }).select(
      "-password"
    ); // Exclude password from the response
    if (!user) {
      console.log("User not found:", req.user.userId);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User data retrieved:", user.email);
    res.json({
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      uid: user.uniqueId, // Ensure consistency in naming, might be 'uid' or 'uniqueId'
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    console.error("Failed to retrieve user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// User Data Endpoint






//
//
// forgot-password Start from here

// Generate a 4-digit OTP
function generateOTP() {
  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log("Generated OTP:", otp);
  return otp;
}


// Store OTPs for verification
const otpStore = {};

// Define the POST endpoint for forgot password
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Request received for forgot password:", email);
  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found with email:", email);
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate and store OTP
    const otp = generateOTP();
    otpStore[email] = otp;

    // Log OTP for testing (remove this line in production)
    console.log("Storing OTP for email:", email, "OTP:", otp);
    sendOTPByEmail(email, otp);

    console.log("OTP sent to:", email);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Define the POST endpoint for verifying OTP and resetting password
app.post("/api/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  console.log("Request received for password reset:", email);
  
  try {
    // Verify OTP
    const storedOTP = otpStore[email];
    console.log("entered otp: ", otp);
    console.log("stored otp for ", email, ": ", storedOTP);
    
    if (!storedOTP || storedOTP !== parseInt(otp)) {
      console.log("Invalid OTP for email:", email);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Password reset for:", email);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Function to send OTP by email
function sendOTPByEmail(email, otp) {
  // Email options
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'OTP for Password Reset',
    text: `Your OTP for password reset is: ${otp}`
  };

  // Send email
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error("Email sending error:", error);
    } else {
      console.log("OTP Email sent:", info.response);
    }
  });
}





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
