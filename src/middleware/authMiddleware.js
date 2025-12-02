import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { User } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
