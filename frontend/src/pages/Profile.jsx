import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const profileId = id || currentUser?._id;
      if (!profileId) return;

      const { data: userData } = await API.get(`/users/${id ? id : "profile"}`);
      setUser(userData);
      setIsFollowing(userData.followers.includes(currentUser?._id));

      const { data: postData } = await API.get(`/posts/user/${userData._id}`);
      setPosts(postData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, currentUser?._id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollow = async () => {
    try {
      const { data } = await API.put(`/users/follow/${user._id}`);
      setIsFollowing(data.isFollowing);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-400 animate-pulse">
        Loading Profile...
      </div>
    );
  if (!user)
    return <div className="text-center mt-20 text-red-500">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12 mb-12">
        <div className="relative group">
          <img
            src={user.profilePic || "https://via.placeholder.com/150"}
            alt={user.username}
            className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-4 border-blue-50 shadow-inner"
          />
          {(!id || id === currentUser?._id) && (
            <Link
              to="/edit-profile"
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </Link>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {user.username}
            </h1>
            {id && id !== currentUser?._id && (
              <button
                onClick={handleFollow}
                className={`px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
                  isFollowing
                    ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <div className="flex justify-center md:justify-start space-x-10 mb-6">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
                Posts
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-gray-900">
                {user.followers.length}
              </p>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
                Followers
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-gray-900">
                {user.following.length}
              </p>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
                Following
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-gray-800 text-lg">{user.name}</p>
            <p className="text-gray-600 leading-relaxed font-medium">
              {user.bio || "No bio yet ✨"}
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        Posts
      </h2>
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-medium">No posts to show</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
