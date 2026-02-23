import asyncHandler from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { sendResponse } from "../Utils/apiResponse.js";
import { routine } from "../models/routine.model.js";
import { task } from "../models/task.model.js";

// @desc    Get all routines for current user
// @route   GET /api/routines
// @access  Private
export const getAllRoutines = asyncHandler(async (req, res) => {
  const routines = await routine.find({ user: req.user._id })
    .populate("taskList")
    .select("-__v");

  if (!routines || routines.length === 0) {
    return sendResponse(res, 200, [], "No routines found");
  }

  return sendResponse(res, 200, routines, "Routines retrieved successfully");
});

// @desc    Get routine by ID
// @route   GET /api/routines/:id
// @access  Private
export const getRoutineById = asyncHandler(async (req, res) => {
  const routineItem = await routine.findOne({ _id: req.params.id, user: req.user._id })
    .populate("taskList")
    .select("-__v");

  if (!routineItem) {
    throw new apiError(404, "Routine not found");
  }

  return sendResponse(res, 200, routineItem, "Routine retrieved successfully");
});

// @desc    Create a new routine
// @route   POST /api/routines
// @access  Private
export const createRoutine = asyncHandler(async (req, res) => {
  const { taskList } = req.body;

  // Validate task list
  if (!taskList || !Array.isArray(taskList)) {
    throw new apiError(400, "Task list is required and must be an array");
  }

  // Validate that all tasks exist and belong to the user
  const tasks = await task.find({ _id: { $in: taskList }, user: req.user._id });

  if (tasks.length !== taskList.length) {
    throw new apiError(400, "One or more tasks not found or do not belong to you");
  }

  const newRoutine = await routine.create({
    user: req.user._id,
    taskList,
    isFollowed: false
  });

  const populatedRoutine = await routine.findById(newRoutine._id).populate("taskList");

  return sendResponse(res, 201, populatedRoutine, "Routine created successfully");
});

// @desc    Update routine by ID
// @route   PUT /api/routines/:id
// @access  Private
export const updateRoutine = asyncHandler(async (req, res) => {
  const { taskList, isFollowed } = req.body;

  const routineItem = await routine.findOne({ _id: req.params.id, user: req.user._id });

  if (!routineItem) {
    throw new apiError(404, "Routine not found");
  }

  // Update task list if provided
  if (taskList) {
    if (!Array.isArray(taskList)) {
      throw new apiError(400, "Task list must be an array");
    }

    // Validate that all tasks exist and belong to the user
    const tasks = await task.find({ _id: { $in: taskList }, user: req.user._id });

    if (tasks.length !== taskList.length) {
      throw new apiError(400, "One or more tasks not found or do not belong to you");
    }

    routineItem.taskList = taskList;
  }

  // Update isFollowed if provided
  if (isFollowed !== undefined) {
    routineItem.isFollowed = isFollowed;
  }

  await routineItem.save();

  const updatedRoutine = await routine.findById(routineItem._id).populate("taskList");

  return sendResponse(res, 200, updatedRoutine, "Routine updated successfully");
});

// @desc    Delete routine by ID
// @route   DELETE /api/routines/:id
// @access  Private
export const deleteRoutine = asyncHandler(async (req, res) => {
  const routineItem = await routine.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!routineItem) {
    throw new apiError(404, "Routine not found");
  }

  return sendResponse(res, 200, null, "Routine deleted successfully");
});

// @desc    Toggle routine follow status
// @route   PATCH /api/routines/:id/toggle-follow
// @access  Private
export const toggleRoutineFollow = asyncHandler(async (req, res) => {
  const routineItem = await routine.findOne({ _id: req.params.id, user: req.user._id });

  if (!routineItem) {
    throw new apiError(404, "Routine not found");
  }

  routineItem.isFollowed = !routineItem.isFollowed;
  await routineItem.save();

  return sendResponse(res, 200, routineItem, "Routine follow status toggled successfully");
});

// @desc    Add task to routine
// @route   POST /api/routines/:id/tasks
// @access  Private
export const addTaskToRoutine = asyncHandler(async (req, res) => {
  const { taskId } = req.body;

  if (!taskId) {
    throw new apiError(400, "Task ID is required");
  }

  const routineItem = await routine.findOne({ _id: req.params.id, user: req.user._id });

  if (!routineItem) {
    throw new apiError(404, "Routine not found");
  }

  // Validate task exists and belongs to user
  const taskItem = await task.findOne({ _id: taskId, user: req.user._id });

  if (!taskItem) {
    throw new apiError(404, "Task not found or does not belong to you");
  }

  // Check if task already in routine
  if (routineItem.taskList.includes(taskId)) {
    throw new apiError(400, "Task already exists in this routine");
  }

  routineItem.taskList.push(taskId);
  await routineItem.save();

  const updatedRoutine = await routine.findById(routineItem._id).populate("taskList");

  return sendResponse(res, 200, updatedRoutine, "Task added to routine successfully");
});

// @desc    Remove task from routine
// @route   DELETE /api/routines/:id/tasks/:taskId
// @access  Private
export const removeTaskFromRoutine = asyncHandler(async (req, res) => {
  const { id, taskId } = req.params;

  const routineItem = await routine.findOne({ _id: id, user: req.user._id });

  if (!routineItem) {
    throw new apiError(404, "Routine not found");
  }

  // Check if task exists in routine
  if (!routineItem.taskList.includes(taskId)) {
    throw new apiError(400, "Task not found in this routine");
  }

  routineItem.taskList = routineItem.taskList.filter(
    (tid) => tid.toString() !== taskId
  );

  await routineItem.save();

  const updatedRoutine = await routine.findById(routineItem._id).populate("taskList");

  return sendResponse(res, 200, updatedRoutine, "Task removed from routine successfully");
});
