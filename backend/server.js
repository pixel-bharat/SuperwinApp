<<<<<<< HEAD
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from "../backend/routes/authroutes.js"

dotenv.config();

const { PORT, MONGODB_URI } = process.env;

const app = express();

app.use(bodyParser.json());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});      
=======
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/superwin", {
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
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Welcome to my api");
});

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const newUser = new User({ email, password });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully." });
    console.log(req.body)
    
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Error creating user." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
>>>>>>> d94690ce617c8fd92f8122c26c189d2391e2ccc3
