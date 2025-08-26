import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import createTokenAndSaveCookie from "../jwt/generateToken.js";
import mongoose from "mongoose";

export const signup = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;
    if (!fullname || !email || !password || !confirmPassword)
      return res.status(400).json({ error: "All fields are required" });
    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    const exists = await User.findOne({ email }).maxTimeMS(5000);
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ fullname, email, password: hash });

    createTokenAndSaveCookie(newUser._id, res);
    res.status(201).json({ message: "User created", user: { _id: newUser._id, fullname, email } });
  } catch (e) {
    console.error("Signup error:", e);
    if (e.name === 'MongoServerSelectionError' || e.name === 'MongoNetworkError') {
      return res.status(503).json({ error: "Database connection error. Please try again." });
    }
    res.status(500).json({ error: e.message || "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email & password required" });

    // Check database connection first
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected. Please try again." });
    }

    // Add timeout to the database query
    const user = await User.findOne({ email }).maxTimeMS(5000);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    createTokenAndSaveCookie(user._id, res);
    res.json({ message: "Login successful", user: { _id: user._id, fullname: user.fullname, email: user.email } });
  } catch (e) {
    console.error("Login error:", e);
    
    // Handle specific database errors
    if (e.name === 'MongoServerSelectionError' || e.name === 'MongoNetworkError') {
      return res.status(503).json({ error: "Database connection error. Please try again." });
    }
    
    if (e.name === 'MongoError' && e.code === 50) {
      return res.status(503).json({ error: "Database operation timed out. Please try again." });
    }
    
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

export const logout = async (_req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.json({ message: "Logout successful" });
  } catch (e) {
    console.error("Logout error:", e);
    res.status(500).json({ error: e.message || "Internal server error" });
  }
};

export const allUsers = async (req, res) => {
  try {
    const loggedInUser = req.userId;
    
    // Check database connection first
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected. Please try again." });
    }
    
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password").maxTimeMS(5000);
    
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in allUsers Controller:", error);
    
    if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({ error: "Database connection error. Please try again." });
    }
    
    if (error.name === 'MongoError' && error.code === 50) {
      return res.status(503).json({ error: "Database operation timed out. Please try again." });
    }
    
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Check database connection first
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected. Please try again." });
    }
    
    // exclude current user if req.userId is set by secureRoute
    const query = req.userId ? { _id: { $ne: req.userId } } : {};
    const users = await User.find(query).select("_id fullname email").maxTimeMS(5000);
    res.json(users);
  } catch (e) {
    console.error("getAllUsers error:", e);
    
    if (e.name === 'MongoServerSelectionError' || e.name === 'MongoNetworkError') {
      return res.status(503).json({ error: "Database connection error. Please try again." });
    }
    
    if (e.name === 'MongoError' && e.code === 50) {
      return res.status(503).json({ error: "Database operation timed out. Please try again." });
    }
    
    res.status(500).json({ error: "Failed to fetch users" });
  }
};