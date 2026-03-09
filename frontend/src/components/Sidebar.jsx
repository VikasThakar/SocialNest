import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const Sidebar = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const { data } = await API.get("/users/search?q=");
        if (Array.isArray(data)) {
          setUsers(data.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuggested();
  }, []);

  return (
    <div className="hidden lg:block w-96 fixed right-[5%] top-24 space-y-8">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          Suggested for <span className="text-blue-600 ml-1.5 italic">You</span>
        </h3>
        <div className="space-y-5">
          {users.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user._id}`}
              className="flex items-center space-x-3 group hover:scale-[1.02] transition-transform"
            >
              <img
                src={user.profilePic || "https://via.placeholder.com/150"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover border border-blue-50 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate group-hover:text-blue-600 transition">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.name}</p>
              </div>
              <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
                View
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-6 text-xs text-gray-400 font-medium">
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Help</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
        </div>
        <p>© 2026 SOCIALNEST FROM VIKAS</p>
      </div>
    </div>
  );
};

export default Sidebar;
