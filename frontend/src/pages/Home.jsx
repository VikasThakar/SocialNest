import { useState, useEffect } from "react";
import API from "../api/axios";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get("/posts");
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error("Posts data is not an array:", data);
        setPosts([]);
      }
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await API.delete(`/posts/${id}`);
        setPosts(posts.filter((post) => post._id !== id));
      } catch {
        alert("Failed to delete post");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-500 animate-pulse">
        Loading feed...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          Your <span className="text-blue-600 ml-2 italic">Feed</span>
        </h1>
        <Link
          to="/create-post"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center space-x-2 shadow-lg shadow-blue-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Create Post</span>
        </Link>
      </div>

      {!Array.isArray(posts) || posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-xl font-medium mb-4">
            {Array.isArray(posts) ? "No posts yet!" : "Failed to load posts"}
          </p>
          <Link
            to="/create-post"
            className="text-blue-600 font-bold hover:underline"
          >
            Start the conversation
          </Link>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default Home;
