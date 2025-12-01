import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

const register = async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please provide data to continue" });
  }

  // email check call
  if (!validateEmail(email)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid email format" });
  }

  try {
    // To check if user alredy exist or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(httpStatus.FOUND).json({
        message:
          "User with the given email already exits! Please try another email.",
      });
    }

    // to hash the password entered by user
    const hashedPassword = await bcrypt.hash(password, 10);

    // thus new user is created
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res
      .status(httpStatus.CREATED)
      .json({ message: "User Registered Successfully" });
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: `${e}`,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please provide data to continue" });
  }

  // email check
  if (!validateEmail(email)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found!" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // create token for user
      const token = jwt.sign(
        { id: user._id, email: user.email }, // payload
        JWT_SECRET, // Secret from .env
        { expiresIn: JWT_EXPIRES_IN } // expiry timeline
      );

      return res
        .status(httpStatus.OK)
        .json({ message: "Logged in Successfully", token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

const getUserHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No user found in request" });
    }

    const userId = req.user.id || req.user._id;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Check if user exists in DB
    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch meetings for the user
    const meetings = await Meeting.find({ user_id: userId }).sort({ date: -1 });

    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const addToHistory = async (req, res) => {
  try {
    const { id } = req.user;
    const { meeting_code } = req.body;
    const user = await User.findOne({ _id: id });
    const newMeeting = new Meeting({
      user_id: user._id,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    await User.findByIdAndUpdate(id, { $push: { meetings: newMeeting._id } });
    res
      .status(httpStatus.CREATED)
      .json({ message: "Added code to history", user });
  } catch (e) {
    res.json({
      message: `${e}`,
    });
  }
};

// Validate email before saving user into db
const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const getDashboard = (req, res) => {
  res.json({ message: `Hello ${req.user.email}` });
};

const clearOneHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id);

    if (meeting) {
      const user = await User.findByIdAndUpdate(meeting.user_id, {
        $pull: { meetings: meeting._id },
      });

      await Meeting.findByIdAndDelete(id);
      res
        .status(httpStatus.OK)
        .json({ message: "Meeting history for one code deleted sucessfully" });
    } else {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "this meeting history dosen't exist anymore" });
    }
  } catch (e) {
    return res.status(500).json({ message: `${e}` });
  }
};

const clearAllHistory = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    const meetings = await Meeting.deleteMany({ user_id: id });
    await User.findByIdAndUpdate(id, {
      $set: { meetings: [] },
    });

    res.status(httpStatus.OK).json({ message: "All History Cleared!" });
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `${e}` });
  }
};

export {
  register,
  login,
  getUserHistory,
  addToHistory,
  getDashboard,
  clearOneHistory,
  clearAllHistory,
};
