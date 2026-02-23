import asyncHandler from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { sendResponse } from "../Utils/apiResponse.js";
import { task } from "../models/task.model.js";
import User from "../models/user.model.js";

// @desc    Get all tasks for current user
// @route   GET /api/tasks
// @access  Private
export const getAllTasks = asyncHandler(async (req, res) => {
  // Get tasks owned by user OR assigned to user
  const tasks = await task.find({
    $or: [
      { user: req.user._id },
      { taskAssignedTo: req.user._id }
    ]
  })
    .populate("taskAssignedTo", "displayName email")
    .select("-__v");

  if (!tasks || tasks.length === 0) {
    return sendResponse(res, 200, [], "No tasks found");
  }

  return sendResponse(res, 200, tasks, "Tasks retrieved successfully");
});

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = asyncHandler(async (req, res) => {
  // Get task if user owns it OR is assigned to it
  const taskItem = await task.findOne({
    _id: req.params.id,
    $or: [
      { user: req.user._id },
      { taskAssignedTo: req.user._id }
    ]
  })
    .populate("taskAssignedTo", "displayName email")
    .select("-__v");

  if (!taskItem) {
    throw new apiError(404, "Task not found");
  }

  return sendResponse(res, 200, taskItem, "Task retrieved successfully");
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { taskname, taskdescription, taskDeadline, taskTimeControl, taskAssignedTo, taskPriority } = req.body;

  // Validate required fields
  if (!taskname || !taskdescription || !taskDeadline || !taskTimeControl || !taskPriority) {
    throw new apiError(400, "Task name, description, deadline, time control, and priority are required");
  }

  // Check for duplicate task name for this user
  const existingTask = await task.findOne({ taskname, user: req.user._id });

  if (existingTask) {
    throw new apiError(400, "Task with this name already exists");
  }

  // Validate assigned user if provided
  let assignedUserId = null;
  if (taskAssignedTo) {
    const assignedUser = await User.findById(taskAssignedTo);
    if (!assignedUser) {
      throw new apiError(404, "Assigned user not found");
    }
    assignedUserId = taskAssignedTo;
  }

  const newTask = await task.create({
    user: req.user._id,
    taskname,
    taskdescription,
    taskDeadline,
    taskTimeControl,
    taskAssignedTo: assignedUserId,
    taskPriority,
    taskstatus: false
  });

  return sendResponse(res, 201, newTask, "Task created successfully");
});

// @desc    Update task by ID
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const { taskname, taskdescription, taskDeadline, taskTimeControl, taskAssignedTo, taskPriority, taskstatus } = req.body;

  const taskItem = await task.findOne({ _id: req.params.id, user: req.user._id });

  if (!taskItem) {
    throw new apiError(404, "Task not found");
  }

  // Check for duplicate task name if name is being changed
  if (taskname && taskname !== taskItem.taskname) {
    const existingTask = await task.findOne({ taskname, user: req.user._id, _id: { $ne: req.params.id } });
    if (existingTask) {
      throw new apiError(400, "Task with this name already exists");
    }
    taskItem.taskname = taskname;
  }

  if (taskdescription) taskItem.taskdescription = taskdescription;
  if (taskDeadline) taskItem.taskDeadline = taskDeadline;
  if (taskTimeControl) taskItem.taskTimeControl = taskTimeControl;
  if (taskPriority) taskItem.taskPriority = taskPriority;
  if (taskstatus !== undefined) taskItem.taskstatus = taskstatus;

  // Validate and update assigned user if provided
  if (taskAssignedTo) {
    const assignedUser = await User.findById(taskAssignedTo);
    if (!assignedUser) {
      throw new apiError(404, "Assigned user not found");
    }
    taskItem.taskAssignedTo = taskAssignedTo;
  }

  await taskItem.save();

  return sendResponse(res, 200, taskItem, "Task updated successfully");
});

// @desc    Delete task by ID
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const taskItem = await task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!taskItem) {
    throw new apiError(404, "Task not found");
  }

  return sendResponse(res, 200, null, "Task deleted successfully");
});

// @desc    Toggle task status
// @route   PATCH /api/tasks/:id/toggle-status
// @access  Private
export const toggleTaskStatus = asyncHandler(async (req, res) => {
  const taskItem = await task.findOne({ _id: req.params.id, user: req.user._id });

  if (!taskItem) {
    throw new apiError(404, "Task not found");
  }

  taskItem.taskstatus = !taskItem.taskstatus;
  await taskItem.save();

  return sendResponse(res, 200, taskItem, "Task status toggled successfully");
});

// @desc    Get tasks by status
// @route   GET /api/tasks/status/:status
// @access  Private
export const getTasksByStatus = asyncHandler(async (req, res) => {
  const status = req.params.status === "true";
  const tasks = await task.find({
    $or: [
      { user: req.user._id, taskstatus: status },
      { taskAssignedTo: req.user._id, taskstatus: status }
    ]
  })
    .populate("taskAssignedTo", "displayName email")
    .select("-__v");

  return sendResponse(res, 200, tasks, `Tasks with status ${status} retrieved successfully`);
});
