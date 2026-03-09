import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(
        formData.name,
        formData.username,
        formData.email,
        formData.password,
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl mt-12 border border-gray-100">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
          Join <span className="text-blue-600 italic">Us</span>
        </h2>
        <p className="text-gray-500 font-medium text-sm italic tracking-wide">
          Create your account to start sharing
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-2xl mb-6 text-center text-sm font-semibold border border-red-100 animate-pulse">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Full Name
          </label>
          <input
            placeholder="John Doe"
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium transition-all"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Username
          </label>
          <input
            placeholder="johndoe123"
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium transition-all"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Email
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium transition-all"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium transition-all"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all transform active:scale-[0.98] shadow-lg shadow-blue-100"
        >
          Register
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-50 text-center">
        <p className="text-gray-500 text-sm font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-bold hover:underline ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
