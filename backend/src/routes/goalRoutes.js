import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  toggleGoalStatus
} from "../controllers/goal.controller.js";

const router = express.Router();

// All goal routes require authentication
router.use(authMiddleware);

// @route   GET /api/goals
// @desc    Get all goals for current user (private - only user's own goals)
router.get("/", getAllGoals);

// @route   GET /api/goals/:id
// @desc    Get goal by ID (private - only user's own goal)
router.get("/:id", getGoalById);

// @route   POST /api/goals
// @desc    Create a new goal
router.post("/", createGoal);

// @route   PUT /api/goals/:id
// @desc    Update goal by ID
router.put("/:id", updateGoal);

// @route   DELETE /api/goals/:id
// @desc    Delete goal by ID
router.delete("/:id", deleteGoal);

// @route   PATCH /api/goals/:id/toggle-status
// @desc    Toggle goal status
router.patch("/:id/toggle-status", toggleGoalStatus);

export default router;
