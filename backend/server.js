const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring");
const { v4: uuidv4 } = require("uuid"); // Corrected import
const multer = require("multer");

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

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: String,
  verificationOTPToken: String,
  isVerified: { type: Boolean, default: false },
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
  memberName: String,
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "korbin28@ethereal.email",
    pass: "H87UBGc5ByMVpHMujT",
  },
});


// Generate a unique ID using UUID
const generateUniqueId = () => {
  return uuidv4();
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
    console.log("Password hashed for:", email);

    const verificationOTPToken = randomstring.generate({ length: 4, charset: 'numeric' });
    const uid = generateUniqueId();
    const username = generateRandomUsername();

    console.log(`OTP generated for ${email}: ${verificationOTPToken}`);
    console.log(`Unique ID (${uid}) and username (${username}) assigned to ${email}`);

    // Store user data in session
    userSessions[email] = {
      uid,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationOTPToken,
      isVerified: false
    };

    // Sending email
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
      res.status(200).json({ message: "OTP sent to your email. Please verify to complete registration." });
    });
  } catch (error) {
    console.error("Signup error for", email, ":", error);
    res.status(500).json({ message: "Failed to process your request" });
  }
});

app.post("/api/verifyOTP", async (req, res) => {
  const { email, otp } = req.body;

  if (!userSessions[email]) {
    console.log("Verification failed: No session found for", email);
    return res.status(400).json({ message: "No registration found or session expired." });
  }

  if (userSessions[email].verificationOTPToken !== otp) {
    console.log(`Verification failed for ${email}: Incorrect OTP provided`);
    return res.status(400).json({ message: "Invalid OTP. Verification failed." });
  }

  console.log(`OTP verified for ${email}: Proceeding to save user data`);

  // Create the user in the database
  const newUser = new User({
    ...userSessions[email],
    isVerified: true
  });

  try {
    await newUser.save();
    console.log("User successfully saved:", newUser);
    delete userSessions[email];  // Remove user data from the session after saving
    res.status(201).json({ message: "User verified and registered successfully." });
  } catch (error) {
    console.error("Error saving user", email, ":", error);
    res.status(500).json({ message: "Failed to save user." });
  }
});


app.post("/api/resendOTP", async (req, res) => {
  const { email } = req.body;

  if (!userSessions[email]) {
    console.log("Resend OTP failed: No session found for", email);
    return res.status(400).json({ message: "No ongoing registration found or session expired. Start registration again." });
  }

  // Generate a new OTP and update the session
  const newOTPToken = randomstring.generate({ length: 4, charset: 'numeric' });
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
    return res.status(200).json({ message: "OTP resent successfully. Please check your email." });
  });
});





app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Normalize email input to prevent case-sensitive mismatches
    const normalizedEmail = email.trim().toLowerCase();

    // Find the user by email
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.isVerified) {
      console.log(`User not found or not verified: ${normalizedEmail}`);
      return res.status(307).json({
        message: "Please register or verify your account.",
        redirectUrl: "/signup"  // Adjust the URL/path as necessary
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Invalid password attempt for user: ${normalizedEmail}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // Token is valid for 1 hour
    );

    console.log(`User logged in successfully: ${normalizedEmail}`);
    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });



// API endpoint for updating avatar and uploading images
// app.post("/api/profile/avatar", upload.array("images"), (req, res) => {
//   const { userId, memberName } = req.body;
//   const avatar = req.files[0] ? req.files[0].filename : null; // Get the first uploaded file as the avatar

//   // If memberName is provided, update it
//   const updateFields = { avatar };
//   if (memberName) {
//     updateFields.memberName = memberName;
//   }



//   // Update user profile with avatar and possibly memberName
//   UserProfile.findOneAndUpdate({ userId }, updateFields, { new: true })
//     .then((profile) => res.json(profile))
//     .catch((err) => res.status(400).json({ error: err.message }));
// });



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post("/api/profile/avatar", upload.single('images'), async (req, res) => {
  const { userId, memberName } = req.body;
  const avatar = req.file ? req.file.path : null; // Path where the uploaded file is saved

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Update user's profile information
      user.name = memberName;
      if (avatar) user.avatar = avatar;

      await user.save();

      res.status(200).json({
          message: "Profile updated successfully",
          profile: {
              name: user.name,
              avatar: user.avatar
          }
      });
  } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error" });
  }
});






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
