import React from "react";

export default function Settings() {
  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center bg-transparent">
      {/* Glare/Glassmorphism background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-300/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      </div>
      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-10 shadow-2xl border border-white/10 text-center max-w-lg w-full">
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight drop-shadow">
          Settings
        </h2>
        <p className="text-gray-300 text-lg">
          Adjust your preferences and account settings here.
        </p>
      </div>
    </div>
  );
}
