"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, error, clearError, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-amber-50/50 via-zinc-100 to-zinc-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full z-10 animate__animated animate__fadeIn">
        {/* Card Container */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-amber-200/80 p-8 sm:p-10 relative overflow-hidden">
          {/* Top Gradient Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-600" />

          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block text-5xl mb-3 animate-bounce shadow-2xs">🇩🇪</span>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">
              Welcome Back!
            </h1>
            <p className="text-sm font-medium text-zinc-500">
              Sign in to save your German streak, sync XP, and unlock your personalized database dashboard.
            </p>
          </div>

          {/* Validation Error Box */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-200 flex items-start gap-3 text-red-800 text-xs font-bold animate__animated animate__shakeX">
              <span className="text-base text-red-600">⚠️</span>
              <div className="flex-1">
                <p className="font-black text-sm text-red-900">Sign In Failed</p>
                <p className="mt-0.5 font-medium">{error}</p>
              </div>
              <button
                type="button"
                onClick={clearError}
                className="text-red-500 hover:text-red-800 font-bold text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 text-base">📧</span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { clearError(); setEmail(e.target.value); }}
                  placeholder="student@amardeutsch.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 border-2 border-zinc-200 rounded-2xl text-sm font-bold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-black text-zinc-700 uppercase tracking-wider">
                  Password
                </label>
                <Link href="/signup" className="text-xs font-extrabold text-amber-600 hover:text-amber-700 underline">
                  Need an account?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 text-base">🔒</span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { clearError(); setPassword(e.target.value); }}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 border-2 border-zinc-200 rounded-2xl text-sm font-bold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !email || !password}
              className={`w-full py-4 rounded-2xl font-black text-white text-base shadow-xl transition-all transform ${
                submitting || !email || !password
                  ? "bg-zinc-400 cursor-not-allowed opacity-75"
                  : "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 hover:-translate-y-0.5 hover:shadow-2xl active:scale-95"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Database...</span>
                </span>
              ) : (
                <span>Sign In to Your Dashboard 🚀</span>
              )}
            </button>
          </form>

          {/* Footer separator & Sign Up Prompt */}
          <div className="mt-8 pt-6 border-t border-zinc-200 text-center">
            <p className="text-xs font-bold text-zinc-500 mb-2">
              New to amardeutsch.com Pro?
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-2xl text-sm font-black text-zinc-800 transition-all hover:scale-[1.01]"
            >
              ✨ Create Free Student Account
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors inline-flex items-center gap-1">
              <span>← Return to Public Guest Gateway</span>
            </Link>
          </div>
        </div>

        {/* Database Trust Note */}
        <p className="mt-6 text-center text-xs font-extrabold text-zinc-400 flex items-center justify-center gap-1.5">
          <span>🛡️ Verified 3NF SQLite Database Auth</span>
          <span>•</span>
          <span>⚡ Goethe & TELC Ready</span>
        </p>
      </div>
    </div>
  );
}
