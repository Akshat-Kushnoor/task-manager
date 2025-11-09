const mongoose = require('mongoose');
import apiError from "./apiError.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (err instanceof ApiError) {
    console.log("Handled API error:", err.message);
  } else {
    console.error("Unexpected error:", err);
  }
  }
};

module.exports = connectDB;
