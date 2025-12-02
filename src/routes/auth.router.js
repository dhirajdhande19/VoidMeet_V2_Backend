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
router.get("/me", authMiddleware, validUser); // to check if user already have a valid token (not expired)
router.get("/google", redirectToGoogle);
router.get("/google/callback", googleCallback);

export default router;
