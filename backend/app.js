import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/Utils/db.js';


const app = express();
dotenv.config();

connectDB();


app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.send('API is running...');
});


import userRoutes from "./src/routes/userRoutes.js";
app.use('/api/users', userRoutes);


export default app;
