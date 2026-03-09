import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// @desc    Add comment to post
// @route   POST /api/comments/:postId
// @access  Private
export const addComment = async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      user: req.user._id,
      post: req.params.postId,
      text,
    });

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const post = await Post.findById(comment.post);
    post.comments = post.comments.filter(
      (id) => id.toString() !== req.params.id,
    );
    await post.save();

    await comment.deleteOne();
    res.json({ message: "Comment removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
