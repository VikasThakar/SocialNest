import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  followUser,
  searchUsers,
  getUserById,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("profilePic"), updateUserProfile);
router.get("/search", protect, searchUsers);
router.get("/:id", protect, getUserById);
router.put("/follow/:id", protect, followUser);

export default router;
