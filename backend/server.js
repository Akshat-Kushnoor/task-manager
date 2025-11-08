import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  
 
app.get("/", (req, res) => {
    res.send("beginning of the server: ");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
