import mongoose from "mongoose";
import {apiError} from "./apiError.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof apiError) {
    console.log("Handled API error:", error.message);
  } else {
    console.error("Unexpected error:", error);
  }
  }
};

export default connectDB;
