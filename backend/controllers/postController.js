import Post from "../models/Post.js";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  console.log("Create Post Hit:", req.body);
  console.log("File:", req.file);
  const { caption } = req.body;
  const image = req.file ? req.file.path : null;

  if (!image) {
    console.log("Error: Image is missing");
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    const post = await Post.create({
      user: req.user._id,
      caption,
      image,
    });
    console.log("Post Created Successfully");
    res.status(201).json(post);
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name username profilePic")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name username profilePic" },
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get posts by user ID
// @route   GET /api/posts/user/:id
// @access  Private
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate("user", "name username profilePic")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name username profilePic" },
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name username profilePic")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name username profilePic" },
      });
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/like/:id
// @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString(),
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json(post.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
