import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  taskname: {
    type: String,
    required: [true, "Please provide a task name"],
    unique: true,
  },
  taskdescription: {
    type: String,
    required: [true, "Please provide an description"],
  },
  taskstatus: {
    type: Boolean,
    default: false,
  },
  taskDeadline: {
    type: Date,
    default: Date.now,
    required: [true, "Please provide a deadline"],
  },
  taskTimeControl: {
    type: Number,
    required: [true, "Please provide a time control"],
  },
  taskAssignedTo: {
    type: mongoose.Schema.Types.ObjectId, // ✅ fixed
    ref: "User",                           // ✅ match model name
    required: true,
  },
  taskPriority: {
    type: Number,
    required: [true, "Please provide a priority"],
  },
}, { timestamps: true });

export const task = mongoose.model("Task", taskSchema); // Optional: capitalize model name