"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ACCOUNT_BENEFITS = [
  { icon: "🔥", text: "Save Daily Streak logs across desktop & mobile" },
  { icon: "⚡", text: "Earn XP points in interactive Quiz Arenas" },
  { icon: "📚", text: "Unlock custom vocabulary flashcard decks" },
  { icon: "🎓", text: "Track CEFR progress from A1 up to B2 mastery" },
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup, error, clearError, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setSubmitting(true);
    const success = await signup(name, email, password);
    setSubmitting(false);
    if (success) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center bg-gradient-to-b from-amber-50/60 via-zinc-50 to-zinc-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-green-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-20 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate__animated animate__fadeIn">
        
        {/* Left Column: Gamified Value Proposition */}
        <div className="lg:col-span-5 text-center lg:text-left space-y-6 px-2">
          <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 px-3.5 py-1.5 rounded-full text-xs font-black text-green-800 shadow-2xs">
            <span>🎉 Free Lifetime Access</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight leading-tight">
            Start Your German Journey Today! 🚀
          </h1>

          <p className="text-sm text-zinc-600 font-medium leading-relaxed">
            Create your Database Student ID to synchronize your progress in real-time with our normalized SQLite backend.
          </p>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-amber-200 shadow-sm space-y-3">
            <h2 className="text-xs font-black text-amber-900 uppercase tracking-wider border-b border-amber-100 pb-2">
              ✨ Member Benefits
            </h2>
            <div className="space-y-2.5">
              {ACCOUNT_BENEFITS.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-xs font-bold text-zinc-700">
                  <span className="text-lg bg-amber-50 p-1.5 rounded-xl border border-amber-200/60 shadow-2xs">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div className="lg:col-span-7">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-amber-300/80 p-8 sm:p-10 relative overflow-hidden">
            
            {/* Top Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500" />

            <div className="mb-8">
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-1">
                Create Free Account 🇩🇪
              </h2>
              <p className="text-xs font-bold text-zinc-500">
                Already registered?{" "}
                <Link href="/login" className="text-amber-600 hover:text-amber-800 font-black underline ml-1">
                  Sign In to your existing account →
                </Link>
              </p>
            </div>

            {/* Validation Error Box */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-200 flex items-start gap-3 text-red-800 text-xs font-bold animate__animated animate__shakeX">
                <span className="text-base text-red-600">⚠️</span>
                <div className="flex-1">
                  <p className="font-black text-sm text-red-900">Registration Failed</p>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-1.5">
                  Your Full Name or Nickname
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 text-base">👤</span>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => { clearError(); setName(e.target.value); }}
                    placeholder="e.g., Alex Schmidt"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-2xl text-sm font-bold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-1.5">
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
                    placeholder="alex@amardeutsch.com"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-2xl text-sm font-bold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-black text-zinc-700 uppercase tracking-wider mb-1.5">
                  Choose Security Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 text-base">🔑</span>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => { clearError(); setPassword(e.target.value); }}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border-2 border-zinc-200 rounded-2xl text-sm font-bold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
                <p className="mt-1 text-[11px] font-medium text-zinc-400">
                  Must be at least 6 characters long for bcrypt database encryption.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || !name || !email || !password}
                className={`w-full py-4 rounded-2xl font-black text-white text-base shadow-xl transition-all transform mt-4 ${
                  submitting || !name || !email || !password
                    ? "bg-zinc-400 cursor-not-allowed opacity-75"
                    : "bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 hover:from-green-600 hover:to-teal-800 hover:-translate-y-0.5 hover:shadow-2xl active:scale-95"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registering to SQLite Database...</span>
                  </span>
                ) : (
                  <span>Create Free Account & Jump In 🌱</span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
              <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors inline-flex items-center gap-1">
                <span>← Browse curriculum as Guest first</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
