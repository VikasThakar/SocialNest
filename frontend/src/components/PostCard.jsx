import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(user?._id) || false,
  );
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
    try {
      const { data } = await API.put(`/posts/like/${post._id}`);
      setLikes(data.length);
      setIsLiked(data.includes(user?._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const { data } = await API.post(`/comments/${post._id}`, {
        text: commentText,
      });
      setComments([
        ...comments,
        {
          ...data,
          user: {
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
          },
        },
      ]);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-lg">
      {/* Header */}
      <div className="p-5 flex justify-between items-center bg-white/50 backdrop-blur-sm">
        <Link
          to={`/profile/${post.user?._id}`}
          className="flex items-center space-x-3 group"
        >
          <img
            src={post.user?.profilePic || "https://via.placeholder.com/150"}
            alt={post.user?.username || "user"}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-50 group-hover:scale-105 transition shadow-sm"
          />
          <div>
            <p className="font-extrabold text-gray-900 group-hover:text-blue-600 transition">
              {post.user?.username || "Unknown User"}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
        {user?._id === post.user?._id && (
          <button
            onClick={() => onDelete(post._id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Image */}
      <div className="relative group">
        <img
          src={post.image}
          alt="Post content"
          className="w-full aspect-square object-cover"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Actions */}
      <div className="p-5">
        <div className="flex items-center space-x-6 mb-4">
          <button
            onClick={handleLike}
            className={`transition-all transform active:scale-125 hover:scale-110 ${isLiked ? "text-red-500" : "text-gray-800 hover:text-red-400"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill={isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className={`transition-all transform hover:scale-110 ${showComments ? "text-blue-500" : "text-gray-800 hover:text-blue-400"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <p className="font-extrabold text-gray-900">
            {(likes || 0).toLocaleString()} likes
          </p>
        </div>
        <p className="text-gray-800 leading-relaxed">
          <Link
            to={`/profile/${post.user?._id}`}
            className="font-extrabold mr-2 hover:text-blue-600 transition"
          >
            {post.user?.username || "Unknown"}
          </Link>
          {post.caption}
        </p>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-6 border-t border-gray-50 space-y-4">
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-gray-50 p-3 rounded-2xl border border-gray-100/50"
                >
                  <img
                    src={
                      comment.user?.profilePic ||
                      "https://via.placeholder.com/150"
                    }
                    alt=""
                    className="w-8 h-8 rounded-full shrink-0 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">
                      {comment.user?.username || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-600 break-words">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-gray-400 text-sm font-medium py-4">
                  No comments yet. Be the first!
                </p>
              )}
            </div>

            <form onSubmit={handleComment} className="flex space-x-3 mt-4">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-gray-100 px-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="text-blue-600 font-bold px-4 hover:text-blue-700 disabled:opacity-50 transition-all active:scale-95"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
