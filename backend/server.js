const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

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

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'korbin28@ethereal.email',
      pass: 'H87UBGc5ByMVpHMujT'
  }
});


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

    // Sending email
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

  if (!email || !otp) {
    return res.status(400).json({ message: "Both email and OTP must be provided" });
  }

  console.log("Received for verification:", { email, otp });  // Log received data

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail, verificationOTPToken: otp });

    console.log("User found:", user);  // Log the user object found

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




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
