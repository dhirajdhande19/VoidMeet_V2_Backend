import { Router } from "express";
import {
  register,
  login,
  addToHistory,
  getUserHistory,
  getDashboard,
  clearOneHistory,
  clearAllHistory,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../utils/Middlewares.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.get("/dashboard", authMiddleware, getDashboard);
router.post("/add_to_activity", authMiddleware, addToHistory);
router.get("/get_all_activity", authMiddleware, getUserHistory);
router.delete("/history", authMiddleware, clearAllHistory);
router.delete("/history/:id", authMiddleware, clearOneHistory);

export default router;
