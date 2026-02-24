import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  getAllRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  toggleRoutineFollow,
  addTaskToRoutine,
  removeTaskFromRoutine
} from "../controllers/routine.controller.js";

const router = express.Router();

// All routine routes require authentication
//router.use(authMiddleware);

// @route   GET /api/routines
// @desc    Get all routines for current user (private - only user's own routines)
router.get("/", getAllRoutines);

// @route   GET /api/routines/:id
// @desc    Get routine by ID (private - only user's own routine)
router.get("/:id", getRoutineById);

// @route   POST /api/routines
// @desc    Create a new routine
router.post("/", createRoutine);

// @route   PUT /api/routines/:id
// @desc    Update routine by ID
router.put("/:id", updateRoutine);

// @route   DELETE /api/routines/:id
// @desc    Delete routine by ID
router.delete("/:id", deleteRoutine);

// @route   PATCH /api/routines/:id/toggle-follow
// @desc    Toggle routine follow status
router.patch("/:id/toggle-follow", toggleRoutineFollow);

// @route   POST /api/routines/:id/tasks
// @desc    Add task to routine
router.post("/:id/tasks", addTaskToRoutine);

// @route   DELETE /api/routines/:id/tasks/:taskId
// @desc    Remove task from routine
router.delete("/:id/tasks/:taskId", removeTaskFromRoutine);

export default router;
