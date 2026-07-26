"use client";

import { useEffect } from "react";

export default function FrontendAdminRedirect() {
  useEffect(() => {
    // Redirect to the genuine Backend Admin Panel Studio
    window.location.replace("/backend/admin/game-vocab");
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center p-6 font-sans text-white">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6" />
      <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent mb-2">
        Connecting to Backend Admin Panel Studio...
      </h1>
      <p className="text-sm font-bold text-zinc-400 max-w-md">
        Transferring you to the official Full-Stack Admin Hub at <code className="text-emerald-300">/backend/admin/game-vocab</code>.
      </p>
      <a
        href="/backend/admin/game-vocab"
        className="mt-6 inline-block px-6 py-2.5 bg-emerald-500 text-zinc-950 font-extrabold rounded-xl shadow-lg hover:bg-emerald-400 transition-colors text-sm"
      >
        Click here if not redirected automatically ➡️
      </a>
    </div>
  );
}
