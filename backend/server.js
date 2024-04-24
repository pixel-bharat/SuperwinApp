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