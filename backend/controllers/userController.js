import User from "../models/User.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("followers following", "username name profilePic");

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers following", "username name profilePic");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;

    // If a file was uploaded, use its path, otherwise check body for profilePic URL
    if (req.file) {
      user.profilePic = req.file.path;
    } else {
      user.profilePic = req.body.profilePic || user.profilePic;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Follow/Unfollow user
// @route   PUT /api/users/follow/:id
// @access  Private
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow)
      return res.status(404).json({ message: "User not found" });

    if (currentUser.following.includes(req.params.id)) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id,
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== req.user._id.toString(),
      );
      await currentUser.save();
      await userToFollow.save();
      return res.json({
        message: "Unfollowed successfully",
        isFollowing: false,
      });
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
      await currentUser.save();
      await userToFollow.save();
      return res.json({ message: "Followed successfully", isFollowing: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
export const searchUsers = async (req, res) => {
  const query = req.query.q;
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("name username profilePic");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
