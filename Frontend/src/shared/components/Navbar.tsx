"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { NAVBAR_LEVELS } from "@/levels/config";
import { useAuth } from "@/context/AuthContext";

const TOOLS = [
  { href: "/vocabulary", label: "📚 Vocabulary Hub", sublabel: "All words & flashcards" },
  { href: "/grammar", label: "📖 Grammar Rules", sublabel: "A1 to B2 master lessons" },
  { href: "/quizzes", label: "✍️ Quiz Arena", sublabel: "Test your skills & earn XP" },
  { href: "/random-word", label: "🎲 Random Word", sublabel: "Daily practice challenge" },
  { href: "/games", label: "🎮 Games Arena", sublabel: "Interactive vocabulary drills" },
];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return { open, setOpen, ref };
}

export default function Navbar() {
  const pathname = usePathname();
  const levelsDropdown = useDropdown();
  const toolsDropdown = useDropdown();
  const userDropdown = useDropdown();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, loading, logout } = useAuth();

  const isLevelActive = NAVBAR_LEVELS.some((l) => pathname.startsWith(l.href));
  const isToolActive = TOOLS.some((t) => pathname.startsWith(t.href));

  const handleLogout = async () => {
    userDropdown.setOpen(false);
    setMobileOpen(false);
    await logout();
  };

  return (
    <nav className="glass-nav border-b border-zinc-200/80 sticky top-0 z-50 transition-all duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-zinc-900 shrink-0 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🇩🇪</span> 
            <span>Amar<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600">Deutsch</span></span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-300/60 shadow-xs">amardeutsch.com</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname === "/"
                  ? "bg-amber-100/80 text-amber-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
              }`}
            >
              🏠 Home
            </Link>

            {/* CEFR Levels Dropdown */}
            <div className="relative" ref={levelsDropdown.ref}>
              <button
                onClick={() => {
                  levelsDropdown.setOpen(!levelsDropdown.open);
                  toolsDropdown.setOpen(false);
                  userDropdown.setOpen(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                  isLevelActive
                    ? "bg-amber-100/80 text-amber-900 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
                }`}
              >
                <span>🎓 Courses</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${levelsDropdown.open ? "rotate-180 text-amber-600" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {levelsDropdown.open && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-zinc-200/80 shadow-2xl py-2 z-50 overflow-hidden animate__animated animate__fadeIn animate__faster">
                  <div className="px-4 py-2 bg-gradient-to-r from-zinc-50 to-amber-50/50 border-b border-zinc-100 mb-1">
                    <span className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">CEFR Roadmap</span>
                  </div>
                  {NAVBAR_LEVELS.map((level) => (
                    <Link
                      key={level.href}
                      href={level.href}
                      onClick={() => levelsDropdown.setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50/60 transition-colors group border-l-4 border-transparent hover:border-amber-500"
                    >
                      <span className={`flex items-center justify-center w-9 h-9 rounded-xl text-xs font-black shadow-xs ${level.bg} ${level.color} group-hover:scale-105 transition-transform`}>
                        {level.label}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-zinc-800 group-hover:text-amber-900">{level.sublabel}</div>
                        <div className="text-[11px] text-zinc-400 font-medium">Interactive vocabulary & rules</div>
                      </div>
                      {pathname.startsWith(level.href) && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-amber-500 shadow-sm animate-pulse" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Learning Tools Dropdown */}
            <div className="relative" ref={toolsDropdown.ref}>
              <button
                onClick={() => {
                  toolsDropdown.setOpen(!toolsDropdown.open);
                  levelsDropdown.setOpen(false);
                  userDropdown.setOpen(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                  isToolActive
                    ? "bg-amber-100/80 text-amber-900 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
                }`}
              >
                <span>🛠️ Practice Arena</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${toolsDropdown.open ? "rotate-180 text-amber-600" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {toolsDropdown.open && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-zinc-200/80 shadow-2xl py-2 z-50 overflow-hidden animate__animated animate__fadeIn animate__faster">
                  <div className="px-4 py-2 bg-gradient-to-r from-zinc-50 to-amber-50/50 border-b border-zinc-100 mb-1">
                    <span className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">Skill Boosters</span>
                  </div>
                  {TOOLS.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => toolsDropdown.setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-bold text-zinc-800 group-hover:text-amber-600 transition-colors">{tool.label}</p>
                        <p className="text-[11px] text-zinc-400 font-medium">{tool.sublabel}</p>
                      </div>
                      {pathname.startsWith(tool.href) && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-amber-500 shadow-sm" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Tracker */}
            <Link
              href="/progress"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname.startsWith("/progress")
                  ? "bg-amber-100/80 text-amber-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
              }`}
            >
              📊 Progress
            </Link>
          </div>

          {/* User Authentication Status Widget (Right Side) */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* User Authentication Status Widget */}
            {loading ? (
              <div className="w-24 h-8 bg-zinc-200/70 animate-pulse rounded-xl" />
            ) : user ? (
              <div className="relative" ref={userDropdown.ref}>
                <button
                  type="button"
                  onClick={() => {
                    userDropdown.setOpen(!userDropdown.open);
                    levelsDropdown.setOpen(false);
                    toolsDropdown.setOpen(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black shadow-md transition-all border border-zinc-700 hover:border-amber-400"
                >
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-zinc-950 font-extrabold flex items-center justify-center text-[10px] uppercase shadow-2xs">
                    {user.name.charAt(0)}
                  </span>
                  <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${userDropdown.open ? "rotate-180 text-amber-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Drawer */}
                {userDropdown.open && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-zinc-200/80 shadow-2xl p-4 z-50 animate__animated animate__fadeIn animate__faster text-left">
                    <div className="pb-3 mb-3 border-b border-zinc-100">
                      <p className="text-xs font-black text-zinc-900 truncate">{user.name}</p>
                      <p className="text-[11px] font-medium text-zinc-500 truncate">{user.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-300">
                        <span>🏷️ Role: {user.role}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ms-1" />
                      </div>
                    </div>

                    {user.role === "ADMIN" && (
                      <a
                        href="/backend/Dashboard"
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full text-left py-2 px-3 mb-1 bg-purple-50 hover:bg-purple-100 text-purple-900 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-between"
                      >
                        <span>🛡️ Open CMS Admin Panel</span>
                        <span>↗</span>
                      </a>
                    )}

                    <Link
                      href="/progress"
                      onClick={() => userDropdown.setOpen(false)}
                      className="block py-2 px-3 mb-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-extrabold text-xs rounded-xl transition-colors"
                    >
                      📊 View Learning Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-between"
                    >
                      <span>Sign Out</span>
                      <span>👋</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-extrabold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl transition-all border border-zinc-200/80 shadow-2xs"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 hover:from-green-600 hover:to-teal-800 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up Free ✨
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              className="p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 transition-colors border border-zinc-200"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white/95 backdrop-blur-lg px-4 py-5 space-y-2 animate__animated animate__fadeIn">
          {/* Mobile User Authentication Status */}
          {user ? (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 mb-3 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-950">👋 Welcome, {user.name}</span>
                <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">{user.role}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs rounded-xl transition-colors text-center shadow-2xs block border border-red-200/60"
              >
                Sign Out 👋
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-zinc-100">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 bg-zinc-100 text-zinc-800 font-extrabold text-xs rounded-xl text-center border border-zinc-200 block"
              >
                Sign In 🔑
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 bg-green-500 text-white font-extrabold text-xs rounded-xl text-center shadow-md block"
              >
                Sign Up Free ✨
              </Link>
            </div>
          )}

          <Link 
            href="/" 
            onClick={() => setMobileOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-sm font-bold ${pathname === "/" ? "bg-amber-100 text-amber-900" : "text-zinc-700 hover:bg-zinc-100"}`}
          >
            🏠 Home Dashboard
          </Link>

          <p className="px-3 pt-3 pb-1 text-xs font-extrabold text-zinc-400 uppercase tracking-wide">CEFR Courses</p>
          <div className="grid grid-cols-2 gap-2">
            {NAVBAR_LEVELS.map((level) => (
              <Link
                key={level.href}
                href={level.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border border-zinc-200 shadow-2xs ${
                  pathname.startsWith(level.href) ? "bg-amber-100 text-amber-900 border-amber-300" : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <span className={`w-6 h-6 rounded-md flex items-center justify-center font-extrabold ${level.bg} ${level.color}`}>{level.label}</span>
                <span>{level.sublabel}</span>
              </Link>
            ))}
          </div>

          <p className="px-3 pt-3 pb-1 text-xs font-extrabold text-zinc-400 uppercase tracking-wide">Practice Arena</p>
          <div className="space-y-1">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-xl text-sm font-bold ${
                  pathname.startsWith(tool.href) ? "bg-amber-100 text-amber-900" : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {tool.label} <span className="text-xs font-normal text-zinc-400 ms-1">({tool.sublabel})</span>
              </Link>
            ))}
          </div>

          <Link 
            href="/progress" 
            onClick={() => setMobileOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-sm font-bold ${pathname.startsWith("/progress") ? "bg-amber-100 text-amber-900" : "text-zinc-700 hover:bg-zinc-100"}`}
          >
            📊 Learning Progress Tracker
          </Link>

          <div className="pt-3">
            <Link
              href="/quizzes"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 bg-green-500 text-white font-black rounded-xl text-center shadow-lg block uppercase tracking-wide text-sm"
            >
              🚀 Start Quick Practice Quiz
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}