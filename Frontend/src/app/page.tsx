"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const CHILD_LEVEL_OPTIONS = [
  {
    id: "just-starting",
    label: "Just starting",
    subtitle: "Complete Beginner (0 words)",
    cefr: "Level A1",
    cefrHref: "/a1",
    icon: "🌱",
    color: "from-emerald-500 to-green-600 text-emerald-800 border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50",
    badgeBg: "bg-emerald-500 text-white",
    desc: "Perfect for kids taking their very first step! Features colorful vocabulary cards for animals, colors, family numbers, and playful basic greetings.",
    ctaText: "Launch Beginner Course (A1) 🎈",
  },
  {
    id: "knows-basics",
    label: "Knows the basics",
    subtitle: "Elementary Foundation",
    cefr: "Level A2",
    cefrHref: "/a2",
    icon: "📘",
    color: "from-blue-500 to-indigo-600 text-blue-800 border-blue-300 bg-blue-50/50 hover:bg-blue-50",
    badgeBg: "bg-blue-500 text-white",
    desc: "Ideal if your child already recognizes everyday German words and greetings! Focuses on constructing simple sentences, hobby vocabulary, and daily chores.",
    ctaText: "Explore Elementary Track (A2) 🧩",
  },
  {
    id: "conversational",
    label: "Conversational",
    subtitle: "Intermediate Confidence",
    cefr: "Level B1",
    cefrHref: "/b1",
    icon: "💬",
    color: "from-purple-500 to-fuchsia-600 text-purple-800 border-purple-300 bg-purple-50/50 hover:bg-purple-50",
    badgeBg: "bg-purple-500 text-white",
    desc: "Designed for young learners who can express preferences, narrate short stories, and hold natural conversations in social or classroom settings.",
    ctaText: "Enter Conversational Arena (B1) 🗣️",
  },
  {
    id: "fluent",
    label: "Fluent",
    subtitle: "Advanced Proficiency",
    cefr: "Level B2",
    cefrHref: "/b2",
    icon: "⭐",
    color: "from-amber-500 to-orange-600 text-amber-800 border-amber-300 bg-amber-50/50 hover:bg-amber-50",
    badgeBg: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    desc: "For bilingual and confident young German speakers! Refines complex grammatical grammar cases, debates, idioms, and reading comprehension.",
    ctaText: "Unlock Fluency Mastery (B2) 🏆",
  },
];

import { HOME_LEVELS } from "@/levels/config";
import { A1_STATS } from "@/levels/a1";
import { A2_STATS } from "@/levels/a2";
import { B1_STATS } from "@/levels/b1";
import { B2_STATS } from "@/levels/b2";

const LEVELS = HOME_LEVELS;

const levelStats: Record<string, Array<{ href: string; label: string; count: number; badgeBg: string }>> = {
  A1: [
    { href: "/a1/vocabulary", label: "📚 Vocabulary", count: A1_STATS.vocabularyCount, badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { href: "/a1/grammar", label: "📖 Grammar", count: A1_STATS.grammarCount, badgeBg: "bg-blue-50 text-blue-800 border-blue-200" },
    { href: "/a1/quizzes", label: "✍️ Quizzes", count: A1_STATS.quizCount, badgeBg: "bg-purple-50 text-purple-800 border-purple-200" },
    { href: "/a1/sentences", label: "💬 Sentences", count: A1_STATS.sentenceCount, badgeBg: "bg-amber-50 text-amber-800 border-amber-200" },
  ],
  A2: [
    { href: "/a2/vocabulary", label: "📚 Vocabulary", count: A2_STATS.vocabularyCount, badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { href: "/a2/grammar", label: "📖 Grammar", count: A2_STATS.grammarCount, badgeBg: "bg-blue-50 text-blue-800 border-blue-200" },
    { href: "/a2/quizzes", label: "✍️ Quizzes", count: A2_STATS.quizCount, badgeBg: "bg-purple-50 text-purple-800 border-purple-200" },
    { href: "/a2/sentences", label: "💬 Sentences", count: A2_STATS.sentenceCount, badgeBg: "bg-amber-50 text-amber-800 border-amber-200" },
  ],
  B1: [
    { href: "/b1/vocabulary", label: "📚 Vocabulary", count: B1_STATS.vocabularyCount, badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { href: "/b1/grammar", label: "📖 Grammar", count: B1_STATS.grammarCount, badgeBg: "bg-blue-50 text-blue-800 border-blue-200" },
    { href: "/b1/quizzes", label: "✍️ Quizzes", count: B1_STATS.quizCount, badgeBg: "bg-purple-50 text-purple-800 border-purple-200" },
    { href: "/b1/sentences", label: "💬 Sentences", count: B1_STATS.sentenceCount, badgeBg: "bg-amber-50 text-amber-800 border-amber-200" },
  ],
  B2: [
    { href: "/b2/vocabulary", label: "📚 Vocabulary", count: B2_STATS.vocabularyCount, badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { href: "/b2/grammar", label: "📖 Grammar", count: B2_STATS.grammarCount, badgeBg: "bg-blue-50 text-blue-800 border-blue-200" },
    { href: "/b2/quizzes", label: "✍️ Quizzes", count: B2_STATS.quizCount, badgeBg: "bg-purple-50 text-purple-800 border-purple-200" },
    { href: "/b2/sentences", label: "💬 Sentences", count: B2_STATS.sentenceCount, badgeBg: "bg-amber-50 text-amber-800 border-amber-200" },
  ],
};

const TOOLS = [
  {
    href: "/games",
    icon: "🎮",
    title: "German Games Arena",
    desc: "Play immersive vocabulary memory matching, word scrambles, and fast-paced interactive challenges!",
    gradient: "from-violet-500/10 to-fuchsia-500/20 border-violet-200 text-violet-900 hover:border-violet-400",
    badge: "Interactive Fun",
  },
  {
    href: "/vocabulary",
    icon: "📚",
    title: "Vocabulary Hub",
    desc: "Browse over 4,000+ words across every CEFR level with interactive flashcard mode.",
    gradient: "from-blue-500/10 to-indigo-500/20 border-blue-200 text-blue-900 hover:border-blue-400",
    badge: "Flashcards",
  },
  {
    href: "/grammar",
    icon: "📖",
    title: "Grammar Master",
    desc: "Comprehensive sentence structures, cases (Akkusativ/Dativ), and verb declensions.",
    gradient: "from-purple-500/10 to-pink-500/20 border-purple-200 text-purple-900 hover:border-purple-400",
    badge: "Rules & Syntax",
  },
  {
    href: "/quizzes",
    icon: "✍️",
    title: "Quiz Generator",
    desc: "Earn XP by solving multiple-choice drills and listening comprehension tests.",
    gradient: "from-emerald-500/10 to-teal-500/20 border-emerald-200 text-emerald-900 hover:border-emerald-400",
    badge: "Earn XP",
  },
  {
    href: "/random-word",
    icon: "🎲",
    title: "Random Word Drill",
    desc: "Test your immediate recall with randomized vocabulary & pronunciation guides.",
    gradient: "from-amber-500/10 to-orange-500/20 border-amber-200 text-amber-900 hover:border-amber-400",
    badge: "Daily Practice",
  },
  {
    href: "/progress",
    icon: "📊",
    title: "Progress Analytics",
    desc: "Visualize your completed modules, streak logs, and mastered vocabulary counts.",
    gradient: "from-cyan-500/10 to-sky-500/20 border-cyan-200 text-cyan-900 hover:border-cyan-400",
    badge: "My Dashboard",
  },
  {
    href: "/custom",
    icon: "📝",
    title: "Custom Articles",
    desc: "Explore tailored readings and specialized vocabulary decks uploaded by instructors.",
    gradient: "from-rose-500/10 to-red-500/20 border-rose-200 text-rose-900 hover:border-rose-400",
    badge: "Teacher Decks",
  },
];

const WHY_US_FEATURES = [
  {
    title: "Gamified Progression",
    desc: "Stay inspired with daily streak counters, XP level milestones, and bite-sized quizzes designed by linguists.",
    icon: "🏆",
    color: "bg-amber-100 text-amber-800",
  },
  {
    title: "CEFR Aligned Curriculum",
    desc: "Structured precisely according to the European Framework from complete beginner A1 up to fluency B2.",
    icon: "📜",
    color: "bg-blue-100 text-blue-800",
  },
  {
    title: "Spaced Repetition Flashcards",
    desc: "Our intelligent vocabulary card deck helps commit complex German grammatical genders and plurals to permanent memory.",
    icon: "🧠",
    color: "bg-purple-100 text-purple-800",
  },
];

function UnauthenticatedLandingSuite() {
  const { signup, login, googleSignup, error, clearError } = useAuth();
  const [authMode, setAuthMode] = useState<"signup" | "login" | "google">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("learner.student@gmail.com");
  const [googleName, setGoogleName] = useState("Google Learner");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimpleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (authMode === "signup") {
      await signup(name.trim() || email.split("@")[0] || "Learner", email.trim(), password);
    } else if (authMode === "login") {
      await login(email.trim(), password);
    }
    setIsSubmitting(false);
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await googleSignup(googleEmail.trim(), googleName.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/90 via-orange-50/50 to-zinc-50 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Decorative Accents */}
      <div className="absolute top-12 left-10 text-5xl opacity-20 animate-float-slow select-none hidden md:block">🥨</div>
      <div className="absolute top-24 right-16 text-5xl opacity-20 animate-float-bounce select-none hidden md:block">🏰</div>
      <div className="absolute bottom-16 left-1/4 text-5xl opacity-20 animate-bounce select-none hidden md:block">🌟</div>
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Column: Colorful Messaging & Value Proposition */}
        <div className="lg:col-span-7 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-500 text-zinc-950 px-3.5 py-1.5 rounded-full text-xs font-black shadow-xs mb-6">
            <span className="animate-pulse">🇩🇪</span>
            <span>amardeutsch.com — Registration Required to Unlock Curriculum</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight mb-5 leading-[1.1]">
            Master German.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600">
              Sign Up & Start Learning.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 font-medium leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
            To ensure high learning retention and personalized CEFR advancement, our interactive courses are reserved for authenticated students. Every registered account generates a unique <strong className="text-amber-700 font-extrabold">5-Digit Student UID</strong> that monitors your study velocity, module engagement, and proficiency curve.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-amber-200/80 shadow-2xs">
              <span className="text-2xl block mb-1">⚡</span>
              <h4 className="text-xs font-black text-zinc-900">Instant Google Auth</h4>
              <p className="text-[11px] text-zinc-500 font-medium">1-click simplified enrollment</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-amber-200/80 shadow-2xs">
              <span className="text-2xl block mb-1">🎯</span>
              <h4 className="text-xs font-black text-zinc-900">5-Digit UID Tracking</h4>
              <p className="text-[11px] text-zinc-500 font-medium">Live behavioral retention stats</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-amber-200/80 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-2xl block mb-1">🏆</span>
              <h4 className="text-xs font-black text-zinc-900">CEFR A1 to B2</h4>
              <p className="text-[11px] text-zinc-500 font-medium">4,000+ interactive flashcards</p>
            </div>
          </div>
        </div>

        {/* Right Column: Simplified Registration & Google Suite */}
        <div className="lg:col-span-5">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500" />

            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-zinc-900">
                {authMode === "login" ? "Welcome Back!" : authMode === "google" ? "Google Account Sign Up" : "Create Student Account"}
              </h2>
              <p className="text-xs font-bold text-zinc-500 mt-1">
                {authMode === "login" ? "Enter your registered email and password" : "Get your 5-digit Student ID in seconds"}
              </p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="flex bg-zinc-100 p-1 rounded-xl mb-6 text-xs font-black">
              <button
                type="button"
                onClick={() => { setAuthMode("signup"); clearError(); }}
                className={`flex-1 py-2 rounded-lg transition-all ${authMode === "signup" ? "bg-amber-500 text-zinc-950 shadow-sm" : "text-zinc-600 hover:text-zinc-900"}`}
              >
                Sign Up ✨
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("google"); clearError(); }}
                className={`flex-1 py-2 rounded-lg transition-all ${authMode === "google" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-600 hover:text-zinc-900"}`}
              >
                Google 🌐
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("login"); clearError(); }}
                className={`flex-1 py-2 rounded-lg transition-all ${authMode === "login" ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-600 hover:text-zinc-900"}`}
              >
                Log In 🔑
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between animate__animated animate__shakeX">
                <span>⚠️ {error}</span>
                <button onClick={clearError} className="text-red-900 font-black px-1.5 hover:bg-red-100 rounded">×</button>
              </div>
            )}

            {authMode === "google" ? (
              <form onSubmit={handleGoogleSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-blue-50/90 border border-blue-200 text-blue-950 text-xs font-semibold mb-3 flex items-start gap-2.5 shadow-2xs">
                  <span className="text-xl">ℹ️</span>
                  <span>Confirm your Google Email below to generate your unique <strong>5-digit User ID</strong> and unlock all CEFR learning content!</span>
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-700 mb-1">Google Email Address</label>
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="your.name@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-700 mb-1">Learner Display Name</label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="Full Name or Google Alias"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Authenticating via Google..." : "Continue with Google Account 🚀"}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSimpleSubmit} className="space-y-3.5">
                {authMode === "signup" && (
                  <div>
                    <label className="block text-xs font-black text-zinc-700 mb-1">Your Full Name / Nickname</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Abdullah Al Mamun"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-black text-zinc-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@amardeutsch.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-4 font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 ${
                    authMode === "signup"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white"
                  }`}
                >
                  <span>{isSubmitting ? "Processing Account..." : authMode === "signup" ? "Generate 5-Digit UID & Start Free ✨" : "Log In to Your Courses 🗝️"}</span>
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
              <p className="text-xs font-semibold text-zinc-500">
                {authMode === "signup" ? (
                  <>Already have a student account? <button onClick={() => { setAuthMode("login"); clearError(); }} className="text-amber-600 font-black hover:underline">Log in here</button></>
                ) : (
                  <>New learner? <button onClick={() => { setAuthMode("signup"); clearError(); }} className="text-amber-600 font-black hover:underline">Sign up simple right here</button></>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  const [selectedChildLevel, setSelectedChildLevel] = useState<string>("just-starting");

  // Require user authentication before revealing learning content
  if (!user && !loading) {
    return <UnauthenticatedLandingSuite />;
  }

  return (
    <div className="overflow-hidden bg-zinc-50">
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-8 pb-16 px-4 bg-gradient-to-b from-amber-50/80 via-yellow-50/40 to-zinc-50 border-b border-zinc-200/60 overflow-hidden">
        {/* Decorative Floating Accents */}
        <div className="absolute top-12 left-10 text-4xl opacity-20 animate-float-slow hidden lg:block select-none">🥨</div>
        <div className="absolute top-20 right-16 text-4xl opacity-20 animate-float-bounce hidden lg:block select-none">🏰</div>
        <div className="absolute bottom-12 left-24 text-3xl opacity-20 animate-float-bounce hidden md:block select-none">💬</div>

        <div className="max-w-7xl mx-auto">
          {/* Personalized Database User Welcome Small Name Card with 5-Digit Telemetry UID */}
          {user && (
            <div className="inline-flex flex-wrap items-center gap-2.5 mb-6 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-300/80 shadow-2xs animate__animated animate__fadeInDown">
              <span className="text-xl animate-bounce">🌟</span>
              <span className="text-sm font-black text-amber-950">
                Willkommen zurück, <span className="text-amber-700">{user.name}</span>!
              </span>
              <span className="px-2.5 py-0.5 bg-amber-600 text-white font-mono font-black text-[11px] rounded-md shadow-2xs" title="Unique 5-Digit Behavior Tracking User ID">
                UID: #{user.id.toString().padStart(5, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold border border-emerald-300">
                ⚡ Telemetry Active
              </span>
            </div>
          )}

          <div className="max-w-4xl py-4 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-amber-300/80 rounded-full px-4 py-1.5 text-xs font-black text-amber-900 mb-6 shadow-sm">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
              <span className="uppercase tracking-wide">Next-Gen German Learning Engine</span>
              <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">Free</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 mb-5 leading-[1.1] tracking-tight">
              Master German.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600">
                Playful. Fast. Effective.
              </span>
            </h1>

            <p className="text-lg text-zinc-600 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed font-medium">
              Conquer German syntax and vocabulary through a gamified CEFR curriculum. Interactive flashcards, structured grammar breakdowns, and real-time quiz challenges from <strong className="text-zinc-900 font-extrabold">A1 Foundation</strong> to <strong className="text-zinc-900 font-extrabold">B2 Mastery</strong>.
            </p>

            {/* Trust Pill Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8 text-xs font-bold text-zinc-700">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-zinc-200">
                <span className="text-green-500 font-black">✓</span> 4,000+ Words
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-zinc-200">
                <span className="text-amber-500 font-black">★</span> Goethe / TELC Aligned
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-zinc-200">
                <span className="text-purple-500 font-black">⚡</span> 100% Free & Interactive
              </span>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/a1"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-black text-base rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 animate-green-glow gap-2 min-w-[200px]"
              >
                <span>Start Learning Now 🌱</span>
              </Link>
              <Link
                href="/quizzes"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-zinc-50 border-2 border-zinc-300 text-zinc-800 font-black text-base rounded-2xl transition-all shadow-md hover:border-amber-400 gap-2 min-w-[180px]"
              >
                <span>Enter Quiz Arena ✍️</span>
              </Link>
            </div>

            <div className="mt-5 text-center lg:text-left">
              <Link
                href="/a1/grammar"
                className="text-xs font-bold text-zinc-400 hover:text-amber-600 transition-colors inline-flex items-center gap-1 group"
              >
                <span>Already know basic greetings? Try our interactive Grammar Drills</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CHILD & LEARNER GERMAN LEVEL ASSESSMENT STUDIO ===== */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-6">
        <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-yellow-50/80 rounded-3xl p-6 sm:p-10 border-2 border-amber-200/80 shadow-md relative overflow-hidden">
          {/* Decorative floating accents */}
          <div className="absolute -top-4 -right-4 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-300 rounded-full text-xs font-black text-amber-900 mb-3 shadow-2xs">
              <span>🎒 Interactive Placement Guide</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              What&apos;s the child&apos;s German level?
            </h2>
            <p className="text-zinc-600 text-xs sm:text-sm font-semibold mt-2">
              Select an option below to instantly match with our structured European CEFR interactive learning modules.
            </p>
          </div>

          {/* Interactive Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {CHILD_LEVEL_OPTIONS.map((opt) => {
              const isSelected = selectedChildLevel === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedChildLevel(opt.id)}
                  className={`cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 flex flex-col justify-between relative bg-white ${
                    isSelected
                      ? "border-amber-500 shadow-xl scale-[1.03] ring-4 ring-amber-500/20 z-20"
                      : "border-zinc-200/80 shadow-sm hover:border-amber-300 hover:shadow-md hover:scale-[1.01]"
                  }`}
                >
                  {/* Option Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-xl bg-zinc-50 border border-zinc-100 shadow-2xs block">{opt.icon}</span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-2xs ${opt.badgeBg}`}>
                        {opt.cefr}
                      </span>
                    </div>

                    {/* Option Title & Subtitle */}
                    <div className="mb-4">
                      <h3 className="text-lg font-black text-zinc-900 mb-1 flex items-center justify-between">
                        <span>{opt.label}</span>
                        {isSelected && <span className="text-amber-500 text-base animate-bounce">✓</span>}
                      </h3>
                      <p className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wide mb-2">
                        {opt.subtitle}
                      </p>
                      <p className="text-xs text-zinc-600 font-medium leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </div>

                  {/* Selection radio visual & Jump Link */}
                  <div className="mt-2 pt-3 border-t border-zinc-100">
                    <Link
                      href={opt.cefrHref}
                      onClick={(e) => e.stopPropagation()}
                      className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 text-center transition-all shadow-2xs ${
                        isSelected
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md transform hover:-translate-y-0.5"
                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      <span>{opt.ctaText}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Dynamic Recommendation Highlight */}
          {(() => {
            const activeOpt = CHILD_LEVEL_OPTIONS.find((o) => o.id === selectedChildLevel) || CHILD_LEVEL_OPTIONS[0];
            return (
              <div className="mt-8 p-4.5 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate__animated animate__fadeIn">
                <div className="flex items-center gap-3.5 text-center sm:text-left">
                  <span className="text-3xl sm:text-4xl block animate-pulse">{activeOpt.icon}</span>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-zinc-900">
                      Recommended Target Course: <span className="text-amber-700 font-extrabold">{activeOpt.cefr} ({activeOpt.label})</span>
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold text-zinc-600">
                      We have automatically lined up vocabulary flashcards, kid-friendly grammar lessons, and audio quizzes tailored for this exact skill tier.
                    </p>
                  </div>
                </div>
                <Link
                  href={activeOpt.cefrHref}
                  className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap transform hover:scale-105"
                >
                  Start {activeOpt.label} Lessons →
                </Link>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ===== CEFR ADVENTURE MAP (ROADMAP) ===== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full mb-3 inline-block shadow-2xs">
            Structured European Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-3 tracking-tight">
            Your CEFR German Roadmap 🗺️
          </h2>
          <p className="text-zinc-600 text-base font-medium">
            Step-by-step proficiency building. Master fundamental words in A1, build solid syntax in A2, and achieve conversational professional fluency in B2.
          </p>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEVELS.map((level) => {
            const stats = levelStats[level.id] || [];
            return (
              <div key={level.id} className="group relative">
                <div className={`rounded-3xl border-2 ${level.border} ${level.bg} p-6 h-full level-card-transition relative overflow-hidden flex flex-col justify-between bg-white shadow-sm`}>
                  
                  {/* Glowing Top Accent Banner */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${level.color}`} />
                  
                  {/* Step Level Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl transform group-hover:scale-110 transition-transform duration-200 block">{level.emoji}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${level.badge} shadow-2xs border border-current/20`}>
                        Level {level.id}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-zinc-900 mb-1 group-hover:text-amber-700 transition-colors">
                      {level.name}
                    </h3>
                    <p className="text-zinc-500 text-xs font-medium mb-6 leading-relaxed">
                      {level.desc}
                    </p>

                    {/* Progress Simulator Pill */}
                    <div className="mb-6 bg-zinc-50 rounded-2xl p-3 border border-zinc-200/70">
                      <div className="flex justify-between text-[11px] font-bold text-zinc-600 mb-1.5">
                        <span>Curriculum Access:</span>
                        <span className="text-green-600 font-black">100% Unlocked</span>
                      </div>
                      <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${level.color} w-full rounded-full animate-pulse`} />
                      </div>
                    </div>

                    {/* Interactive Stats Buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {stats.map((stat) => (
                        <Link
                          key={stat.href}
                          href={stat.href}
                          className={`text-[11px] font-extrabold px-2.5 py-2 rounded-xl border ${stat.badgeBg} flex flex-col items-center justify-center text-center hover:scale-105 transition-transform shadow-2xs`}
                        >
                          <span>{stat.label}</span>
                          <span className="text-[10px] opacity-75 mt-0.5">({stat.count})</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Main CTA Link */}
                  <Link
                    href={level.href}
                    className={`w-full py-3.5 ${level.cta} text-white text-sm font-black rounded-2xl text-center shadow-lg hover:shadow-xl transition-all block transform group-hover:-translate-y-0.5`}
                  >
                    Start {level.id} Course →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== WHY LEARN WITH US (GAMIFICATION HIGHLIGHTS) ===== */}
      <section className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white py-16 px-4 border-y border-zinc-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full mb-3 inline-block border border-amber-500/40">
              Why amardeutsch.com Pro?
            </span>
            <h2 className="text-3xl font-black text-white mb-3">
              Engineered for Fluent Conversion 🚀
            </h2>
            <p className="text-zinc-400 text-sm font-medium">
              We eliminate dry textbook memorization by combining rigorous grammatical accuracy with modern interactive retention methods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US_FEATURES.map((feat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-amber-400/50 transition-colors shadow-lg">
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-2xl mb-4 shadow-sm ${feat.color}`}>
                  {feat.icon}
                </span>
                <h3 className="text-lg font-black text-white mb-2">{feat.title}</h3>
                <p className="text-xs font-medium text-zinc-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STANDALONE TOOLS ARENA ===== */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-md-end mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block border border-indigo-200">
                Practice Arena & Drills
              </span>
              <h2 className="text-3xl font-black text-zinc-900">
                🛠️ Specialized Learning Hubs
              </h2>
            </div>
            <p className="text-zinc-500 text-sm max-w-md mt-2 md:mt-0 font-medium">
              Target individual skills across all CEFR tiers. Practice random daily words, take custom grammar challenges, or inspect instructor content.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group">
                <div className={`rounded-3xl border-2 p-6 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${tool.gradient} relative overflow-hidden flex flex-col justify-between`}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-4xl p-3 bg-white rounded-2xl shadow-sm block transform group-hover:scale-110 transition-transform">{tool.icon}</span>
                      <span className="text-[11px] font-extrabold px-3 py-1 bg-white rounded-full shadow-2xs text-zinc-700 border border-zinc-200/60">
                        {tool.badge}
                      </span>
                    </div>
                    <h3 className="font-black text-zinc-900 text-lg mb-2 group-hover:text-amber-700 transition-colors">{tool.title}</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-medium mb-6">{tool.desc}</p>
                  </div>

                  <div className="flex items-center text-xs font-extrabold text-zinc-800 group-hover:text-amber-700 gap-1 pt-4 border-t border-current/10">
                    <span>Open Interactive Tool</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA BANNER ===== */}
      <section className="py-12 px-4 bg-amber-500 text-zinc-900 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
            Ready to Speak Confidently in German? 🇩🇪
          </h2>
          <p className="text-amber-950 font-bold text-base max-w-xl mx-auto mb-8">
            Join thousands of learners mastering grammar declensions and vocabulary decks today. No sign-up required for starter exercises!
          </p>
          <Link
            href="/a1"
            className="inline-flex items-center px-10 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-2xl text-lg shadow-2xl hover:scale-105 transition-all"
          >
            Launch Your A1 Course Now 🚀
          </Link>
        </div>
      </section>
    </div>
  );
}
