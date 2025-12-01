import { Router } from "express";
import {
  googleCallback,
  login,
  redirectToGoogle,
  register,
  validUser,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, validUser);
router.get("/google", redirectToGoogle);
router.get("/google/callback", googleCallback);

export default router;
