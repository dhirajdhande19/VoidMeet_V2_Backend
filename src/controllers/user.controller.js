import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import httpStatus from "http-status";
import mongoose from "mongoose";

export const getUserHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No user found in request" });
    }
    console.log("req.user = ", req.user);
    const userId = req.user._id;

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

export const addToHistory = async (req, res) => {
  try {
    const id = req.user._id;
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

export const getDashboard = (req, res) => {
  res.json({ message: `Hello ${req.user.email}` });
};

export const clearOneHistory = async (req, res) => {
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

export const clearAllHistory = async (req, res) => {
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
