import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function MainLayout({ children }) {
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform  ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 h-full bg-gray-800 z-10 text-white p-6 transition-transform duration-300 lg:relative lg:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/m"
                className="hover:underline"
                onClick={() => setIsSidebarOpen(false)}
              >
                Model
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:underline"
                onClick={() => setIsSidebarOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/appointments"
                className="hover:underline"
                onClick={() => setIsSidebarOpen(false)}
              >
                Appointments
              </Link>
            </li>
            <li>
              <Link
                to="/patients"
                className="hover:underline"
                onClick={() => setIsSidebarOpen(false)}
              >
                Patients
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="hover:underline"
                onClick={() => setIsSidebarOpen(false)}
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-8 h-full">
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-100 p-4 flex items-center gap-4 lg:hidden">
          <button
            className="text-gray-800"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
