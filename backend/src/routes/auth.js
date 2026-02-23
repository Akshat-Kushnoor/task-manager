import express from "express";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../Utils/jwt.js";
import asyncHandler from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { sendResponse } from "../Utils/response.js";

router.post("/register", asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        throw new apiError(408, "All fields (username, email, password) are required");
    }

    // Check if user already exists
    // 1. Enforce email limit
    const userCount = await User.countDocuments({ email });

    if (userCount >= 3) {
        return sendResponse(res, 400, null, "Email limit reached");
    }

    // 2. Check username globally
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
    }

    // 3. Create user
    const newUser = await User.create({ email, username });
    res.status(201).json(newUser);


    // user verification ends.
    if (existingUser) {
        throw new apiError(400, "User with this email or username already exists");
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await user.addRefreshToken(refreshToken);

    // Set cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Send final response
    return sendResponse(res, 201, {
        accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    }, "User created successfully");
}));
