import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  likePost,
  getUserPosts,
} from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createPost);
router.get("/", protect, getPosts);
router.get("/user/:id", protect, getUserPosts);
router.get("/:id", protect, getPostById);
router.delete("/:id", protect, deletePost);
router.put("/like/:id", protect, likePost);

export default router;
