const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring')
// Import uuid library to generate unique IDs
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email address
    pass: 'your-password', // Replace with your email password or app-specific password
  },
});
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
});
const User = mongoose.model("User", userSchema);

const memberSchema = new mongoose.Schema({
  memberName: String,
  uniqueId: String,
});
const Member = mongoose.model("Member", memberSchema);

// Function to generate a unique user ID using uuid
const generateUniqueId = () => {
  return uuidv4();
};

// Function to generate a random username
const generateRandomUsername = () => {
  // Logic to generate a random username
  // You can customize this logic as needed
  return "user" + Math.floor(Math.random() * 1000);
};

// Define route to handle POST requests for user registration (signup)
// Define route to handle POST requests for user registration (signup)
app.post("/api/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    email = email.trim();
    email = email.toLowerCase();

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate a verification OTP
    const verificationOTP = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user data to the database
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Send verification OTP to user's email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verification OTP for Signup',
      text: `Your verification OTP is: ${verificationOTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification OTP:', error);
        // Return an error response to the client
        return res.status(500).json({ message: "Failed to send verification OTP" });
      } else {
        console.log('Verification OTP sent:', info.response);
        // Send a success response to the client
        res.status(201).json({ message: "User registered successfully." });
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user." });
  }
});



// Define route to handle POST requests for user login
app.post("/api/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim();
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a unique user ID
    const uniqueId = generateUniqueId();

    // Generate a random username
    const username = generateRandomUsername();

    // Save the member data to the database
    const newMember = new Member({ memberName: username, uniqueId });
    await newMember.save();

    // Return the generated user ID and username in the response
    res.status(200).json({ uniqueId, username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Define route to handle GET request for generating random member data
app.get("/api/randomMember", async (req, res) => {
  try {
    // Generate random member name and unique ID
    const memberName = generateRandomUsername();
    const uniqueId = generateUniqueId();

    res.status(200).json({ memberName, uniqueId });
  } catch (error) {
    console.error("Random Member Generation Error:", error);
    res.status(500).json({ message: "Error generating random member data." });
  }
});

app.get("/home", (req, res) => {
  const { token } = req.query;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Token is valid, render home page or send response as needed
    res.send("Welcome to the home page");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
