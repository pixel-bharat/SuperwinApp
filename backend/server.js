
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});



const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  verificationOTPToken: String,
}); 
const User = mongoose.model("User", userSchema);

const memberSchema = new mongoose.Schema({
  memberName: String,
  uniqueId: String,
});
const Member = mongoose.model("Member", memberSchema);

const generateUniqueId = () => {
  return uuidv4();
};

const generateRandomUsername = () => {
  return "user" + Math.floor(Math.random() * 1000);
};

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'korbin28@ethereal.email',
      pass: 'H87UBGc5ByMVpHMujT'
  }
});

// Route to handle user signup


// Route to handle user login
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


app.post("/api/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const verificationOTPToken = randomstring.generate({
      length: 4,
      charset: "numeric",
    });

    console.log("Generated OTP:", verificationOTPToken); // Log the generated OTP
    console.log("User email:", email); // Log the user's email for debugging

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, verificationOTPToken });
    // Store verification OTP in user document
    console.log(newUser)
    await newUser.save();

    // Send verification OTP via email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: "animeshpixelbharat@gmail.com",
      subject: "Verification OTP",
      text: `Your verification OTP is: ${verificationOTPToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification OTP:", error);
        return res
          .status(500)
          .json({ message: "Failed to send verification OTP" });
      } else {
        console.log("Verification OTP sent:", info.response);
        // Optionally, you can send the verification OTP in the response
        res.status(201).json({ message: "User registered successfully.", verificationOTPToken });
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user." });
  }
});


app.post("/api/verifyOTP", async (req, res) => {
  try {
    const { otp, email } = req.body; // Ensure that req.body contains the email and OTP

    const user = await User.findOne({ email }); // Find the user by email
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedOTP = user.verificationOTPToken; // Retrieve the stored OTP from the user document

    console.log("Stored OTP:", storedOTP); // Log the retrieved OTP
    console.log("Received OTP:", otp); // Log the received OTP

    // Compare the received OTP with the stored OTP
    if (otp === storedOTP) {
      // Mark the user as verified
      user.isVerified = true;
      await user.save();
      console.log("User verified successfully");
      return res.status(200).json({ message: "OTP is verified" });
    } else {
      console.log("Invalid OTP entered");
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
});
// Route to render home page
app.get("/home", (req, res) => {
  const { token } = req.query;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.send("Welcome to the home page");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

