import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  guestLogin,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/guest-login", guestLogin);
router.get("/me", protect, getMe);

export default router;
