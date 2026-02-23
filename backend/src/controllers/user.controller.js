import asyncHandler from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { sendResponse } from "../Utils/apiResponse.js";
import User from "../models/user.model.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-__v");

  if (!users || users.length === 0) {
    throw new apiError(404, "No users found");
  }

  return sendResponse(res, 200, users, "Users retrieved successfully");
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-__v");

  if (!user) {
    throw new apiError(404, "User not found");
  }

  return sendResponse(res, 200, user, "User retrieved successfully");
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private (requires auth middleware)
export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-__v");

  if (!user) {
    throw new apiError(404, "User not found");
  }

  return sendResponse(res, 200, user, "Profile retrieved successfully");
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { displayName, photoURL } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (displayName) user.displayName = displayName;
  if (photoURL) user.photoURL = photoURL;

  user.updatedAt = Date.now();
  await user.save();

  return sendResponse(res, 200, user, "Profile updated successfully");
});

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  return sendResponse(res, 200, null, "User deleted successfully");
});
