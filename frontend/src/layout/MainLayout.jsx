import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { FiLogOut, FiUser, FiSettings, FiUsers, FiCalendar, FiCpu } from "react-icons/fi";
import { FaHistory } from "react-icons/fa";
import { Sparkles } from "lucide-react";

const navItems = [
  { to: "/app/m", icon: <FiCpu />, label: "Model" },
  { to: "/app/models", icon: <FiCpu />, label: "Models" },
  { to: "/app/profile", icon: <FiUser />, label: "Profile" },
  { to: "/app/appointments", icon: <FiCalendar />, label: "Appointments" },
  { to: "/app/patients", icon: <FiUsers />, label: "Patients" },
  { to: "/app/settings", icon: <FiSettings />, label: "Settings" },
  { to: "/app/history", icon: <FaHistory />, label: "History" },
];

export default function MainLayout({ children }) {
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* Animated background glare */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-black/0 to-white/5 animate-bgfade" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float1" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-2xl animate-float2" />
        <div className="absolute top-24 left-16 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-orb1" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/15 rounded-full blur-xl animate-orb2" />
        <div className="absolute bottom-24 right-32 w-28 h-28 bg-white/25 rounded-full blur-2xl animate-orb3" />
        <div className="absolute bottom-1/3 left-1/2 w-16 h-16 bg-white/10 rounded-full blur-lg animate-orb4" />
        <div className="absolute top-1/4 right-1/5 w-24 h-24 bg-white/20 rounded-full blur-xl animate-orb5" />
      </div>
      <style>
        {`
        @keyframes bgfade {
          0%,100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-bgfade { animation: bgfade 12s ease-in-out infinite; }
        @keyframes float1 {
          0%,100% { transform: translateY(0) scale(1);}
          50% { transform: translateY(30px) scale(1.05);}
        }
        @keyframes float2 {
          0%,100% { transform: translateY(0) scale(1);}
          50% { transform: translateY(-30px) scale(1.08);}
        }
        .animate-float1 { animation: float1 16s ease-in-out infinite; }
        .animate-float2 { animation: float2 18s ease-in-out infinite; }
        @keyframes orb1 {
          0%,100% { transform: translateY(0) scale(1);}
          50% { transform: translateY(-20px) scale(1.08);}
        }
        @keyframes orb2 {
          0%,100% { transform: translateX(0) scale(1);}
          50% { transform: translateX(18px) scale(1.04);}
        }
        @keyframes orb3 {
          0%,100% { transform: translateY(0) scale(1);}
          50% { transform: translateY(24px) scale(1.1);}
        }
        @keyframes orb4 {
          0%,100% { transform: translateX(0) scale(1);}
          50% { transform: translateX(-16px) scale(1.07);}
        }
        @keyframes orb5 {
          0%,100% { transform: translateY(0) scale(1);}
          50% { transform: translateY(-18px) scale(1.06);}
        }
        .animate-orb1 { animation: orb1 13s ease-in-out infinite; }
        .animate-orb2 { animation: orb2 15s ease-in-out infinite; }
        .animate-orb3 { animation: orb3 17s ease-in-out infinite; }
        .animate-orb4 { animation: orb4 14s ease-in-out infinite; }
        .animate-orb5 { animation: orb5 16s ease-in-out infinite; }
        `}
      </style>
      {/* Sidebar */}
      <aside
        className={`relative z-20 flex flex-col h-full w-20 sm:w-56 bg-[#202123]/80 border-r border-white/10 shadow-lg transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col items-center py-8 gap-2">
         <Sparkles className="h-8 w-8 text-white transition-transform duration-700 hover:rotate-12 drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)]" />
          <span className="text-lg sm:text-2xl font-extrabold text-white tracking-widest drop-shadow text-center">
            MediCoin
          </span>
        </div>
        <nav className="flex-1 w-full">
          <ul className="flex flex-col gap-1 w-full px-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold transition-all duration-200 w-full
                    ${
                      location.pathname === item.to
                        ? "bg-white/10 text-white shadow"
                        : "hover:bg-white/5 text-white/80"
                    }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-2 pb-6">
          <button
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-600 hover:to-red-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 shadow font-bold transition-all duration-200"
            onClick={async () => {
              try {
                await signOut();
                // Clear token and any persisted user data
                localStorage.clear();
              } finally {
                navigate("/");
              }
            }}
          >
            <FiLogOut /> <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
        {/* Mobile close button */}
        <button
          className="absolute top-4 right-4 lg:hidden text-white/60 hover:text-white transition"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          ×
        </button>
      </aside>
      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        {/* Top bar for mobile */}
        <header className="bg-black/80 backdrop-blur-sm border-b border-white/10 p-4 flex items-center gap-4 lg:hidden z-20">
          <button
            className="text-white text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Open navigation"
          >
            ☰
          </button>
          <span className="text-lg font-bold text-white tracking-widest drop-shadow flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            MediCoin Dashboard
          </span>
        </header>
        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full rounded-2xl bg-white/5 backdrop-blur-xl shadow-xl ">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
