import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTasksByStatus
} from "../controllers/task.controller.js";

const router = express.Router();

// All task routes require authentication
//router.use(authMiddleware);

// @route   GET /api/tasks
// @desc    Get all tasks (user's own tasks + tasks assigned to them)
router.get("/", getAllTasks);

// @route   GET /api/tasks/status/:status
// @desc    Get tasks by status
router.get("/status/:status", getTasksByStatus);

// @route   GET /api/tasks/:id
// @desc    Get task by ID (visible if user owns it or is assigned to it)
router.get("/:id", getTaskById);

// @route   POST /api/tasks
// @desc    Create a new task
router.post("/", createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task by ID (only owner can update)
router.put("/:id", updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task by ID (only owner can delete)
router.delete("/:id", deleteTask);

// @route   PATCH /api/tasks/:id/toggle-status
// @desc    Toggle task status
router.patch("/:id/toggle-status", toggleTaskStatus);

export default router;
