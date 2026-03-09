import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import API from "../api/axios";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(useLocation().search).get("q");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/users/search?q=${query}`);
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchUsers();
  }, [query]);

  if (loading)
    return <div className="text-center mt-20 text-gray-400">Searching...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
        Results for <span className="text-blue-600 ml-2 italic">"{query}"</span>
      </h2>
      {users.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-medium">
            No users found matching your search.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user._id}`}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center space-x-4 hover:shadow-md transition group"
            >
              <img
                src={user.profilePic || "https://via.placeholder.com/150"}
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-50 group-hover:scale-105 transition"
              />
              <div>
                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition">
                  {user.username}
                </p>
                <p className="text-sm text-gray-500">{user.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
