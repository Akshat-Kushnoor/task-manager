import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './Utils/db.js';


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Example routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import routes (example)
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

module.exports = app;
