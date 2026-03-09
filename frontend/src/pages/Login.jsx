import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl mt-12 border border-gray-100">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
          Welcome <span className="text-blue-600 italic">Back</span>
        </h2>
        <p className="text-gray-500 font-medium text-sm italic tracking-wide">
          Enter your credentials to continue
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-2xl mb-6 text-center text-sm font-semibold border border-red-100 animate-pulse">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium transition-all"
            placeholder="name@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium transition-all"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all transform active:scale-[0.98] shadow-lg shadow-blue-100"
        >
          Login
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-50 text-center">
        <p className="text-gray-500 text-sm font-medium">
          New to SocialNest?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:underline ml-1"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
