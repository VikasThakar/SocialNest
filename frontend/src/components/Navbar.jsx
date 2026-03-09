import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${search}`);
      setSearch("");
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            SocialNest
          </Link>
          <form onSubmit={handleSearch} className="hidden md:block">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition w-64"
            />
          </form>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                Profile
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-blue-600 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
