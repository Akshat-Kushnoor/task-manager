import asyncHandler from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { sendResponse } from "../Utils/apiResponse.js";
import { goalInfo } from "../models/goal.model.js";

// @desc    Get all goals for current user
// @route   GET /api/goals
// @access  Private
export const getAllGoals = asyncHandler(async (req, res) => {
  const goals = await goalInfo.find({ user: req.user._id }).select("-__v");

  if (!goals || goals.length === 0) {
    return sendResponse(res, 200, [], "No goals found");
  }

  return sendResponse(res, 200, goals, "Goals retrieved successfully");
});

// @desc    Get goal by ID
// @route   GET /api/goals/:id
// @access  Private
export const getGoalById = asyncHandler(async (req, res) => {
  const goal = await goalInfo.findOne({ _id: req.params.id, user: req.user._id }).select("-__v");

  if (!goal) {
    throw new apiError(404, "Goal not found");
  }

  return sendResponse(res, 200, goal, "Goal retrieved successfully");
});

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = asyncHandler(async (req, res) => {
  const { goalname, goaldescription, goalDeadline, goalPriority, goalType } = req.body;

  // Validate required fields
  if (!goalname || !goaldescription || !goalDeadline || !goalType) {
    throw new apiError(400, "Goal name, description, deadline, and type are required");
  }

  // Check for duplicate goal name for this user
  const existingGoal = await goalInfo.findOne({ goalname, user: req.user._id });

  if (existingGoal) {
    throw new apiError(400, "Goal with this name already exists");
  }

  const goal = await goalInfo.create({
    user: req.user._id,
    goalname,
    goaldescription,
    goalDeadline,
    goalPriority: goalPriority || 1,
    goalType,
    goalStatus: false
  });

  return sendResponse(res, 201, goal, "Goal created successfully");
});

// @desc    Update goal by ID
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = asyncHandler(async (req, res) => {
  const { goalname, goaldescription, goalDeadline, goalPriority, goalType, goalStatus } = req.body;

  const goal = await goalInfo.findOne({ _id: req.params.id, user: req.user._id });

  if (!goal) {
    throw new apiError(404, "Goal not found");
  }

  // Check for duplicate goal name if name is being changed
  if (goalname && goalname !== goal.goalname) {
    const existingGoal = await goalInfo.findOne({ goalname, user: req.user._id, _id: { $ne: req.params.id } });
    if (existingGoal) {
      throw new apiError(400, "Goal with this name already exists");
    }
    goal.goalname = goalname;
  }

  if (goaldescription) goal.goaldescription = goaldescription;
  if (goalDeadline) goal.goalDeadline = goalDeadline;
  if (goalPriority) goal.goalPriority = goalPriority;
  if (goalType) goal.goalType = goalType;
  if (goalStatus !== undefined) goal.goalStatus = goalStatus;

  await goal.save();

  return sendResponse(res, 200, goal, "Goal updated successfully");
});

// @desc    Delete goal by ID
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await goalInfo.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!goal) {
    throw new apiError(404, "Goal not found");
  }

  return sendResponse(res, 200, null, "Goal deleted successfully");
});

// @desc    Toggle goal status
// @route   PATCH /api/goals/:id/toggle-status
// @access  Private
export const toggleGoalStatus = asyncHandler(async (req, res) => {
  const goal = await goalInfo.findOne({ _id: req.params.id, user: req.user._id });

  if (!goal) {
    throw new apiError(404, "Goal not found");
  }

  goal.goalStatus = !goal.goalStatus;
  await goal.save();

  return sendResponse(res, 200, goal, "Goal status toggled successfully");
});
