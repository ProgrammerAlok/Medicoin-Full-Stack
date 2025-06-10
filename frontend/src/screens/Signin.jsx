import React, { useCallback, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock } from "react-icons/fi";

const Signin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const data = await signIn({ email, password });
        // @ts-ignore
        if (data?.success) {
          navigate("/app/m");
        }
      } catch (error) {
        console.error("Sign in error:", error);
      } finally {
        setLoading(false);
      }
    },
    [email, navigate, password, signIn]
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-white tracking-tight">
            Sign In to MediCoin
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-white/10 rounded-xl bg-black text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 pl-10 transition-all"
                  placeholder="Enter your email"
                />
                <FiUser className="absolute left-3 top-3 text-white/60" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-white/10 rounded-xl bg-black text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 pl-10 transition-all"
                  placeholder="Enter your password"
                />
                <FiLock className="absolute left-3 top-3 text-white/60" />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl transition-all duration-300 text-lg font-bold shadow-xl hover:bg-black hover:text-white border border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 4v4a8 8 0 01-8 8z"
                  ></path>
                </svg>
              )}
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="text-sm text-gray-400 text-center mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-white hover:underline cursor-pointer transition-colors"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
