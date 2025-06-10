import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthProvider";

const Signup = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const data = await signUp(formData);
        // @ts-ignore
        if (data?.success) {
          navigate("/app/m");
        }
      } catch (error) {
        console.error("Signup error:", error);
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, signUp]
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-white tracking-tight">
            Create Your MediCoin Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-white/10 rounded-xl bg-black text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 pl-10 transition-all"
                    placeholder="First Name"
                  />
                  <FiUser className="absolute left-3 top-3 text-white/60" />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-white/10 rounded-xl bg-black text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 pl-10 transition-all"
                    placeholder="Last Name"
                  />
                  <FiUser className="absolute left-3 top-3 text-white/60" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-white/10 rounded-xl bg-black text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 pl-10 transition-all"
                  placeholder="Enter your email"
                />
                <FiMail className="absolute left-3 top-3 text-white/60" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-white/10 rounded-xl bg-black text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 pl-10 pr-10 transition-all"
                  placeholder="Enter your password"
                />
                <FiLock className="absolute left-3 top-3 text-white/60" />
                <div
                  className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={0}
                  role="button"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </div>
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
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          <p className="text-sm text-gray-400 text-center mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/signin")}
              className="text-white hover:underline cursor-pointer transition-colors"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
