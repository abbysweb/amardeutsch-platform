"use client";

import React, { useState } from "react";
import Link from "next/link";
import { playGermanAudio } from "@/shared/utils/naturalTTS";
import CountUp from "@/shared/components/CountUp";

const GAMES_LIST = [
  {
    id: "babadum-match",
    title: "🌟 BaBaDum Visual Word Match",
    level: "All CEFR Tiers",
    description: "The classic fast-paced visual game! Listen to authentic spoken German audio and tap the matching card out of a 4-option grid to build rapid recall and win streaks.",
    icon: "🎯",
    color: "from-emerald-500/20 to-teal-500/30 border-emerald-400 text-emerald-950",
    badge: "Featured Game #1",
    href: "/games/babadum"
  }
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/60 via-zinc-100 to-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-800 font-extrabold text-xs uppercase tracking-wider mb-3 shadow-2xs">
            <span>🎮 Interactive Gamified Mastery</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight mb-3">
            German Games Arena
          </h1>
          <p className="text-zinc-600 font-medium text-base">
            Level up your fluency with our featured interactive visual vocabulary game! Listen to native acoustics and build high-speed streak recall!
          </p>
        </div>

        {/* Game Mode Cards Grid */}
        <div className="max-w-2xl mx-auto mb-16">
          {GAMES_LIST.map((game) => (
            <div key={game.id} className={`bg-white rounded-3xl p-7 sm:p-9 border-2 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${game.color} flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-5xl bg-white p-4 rounded-2xl shadow-sm border border-zinc-100">{game.icon}</span>
                  <span className="px-3.5 py-1.5 bg-white rounded-full text-xs font-black shadow-xs border border-zinc-200/80 text-zinc-800">
                    ✨ {game.badge}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-xs font-black uppercase text-zinc-500 tracking-wider">Level Tier: {game.level}</span>
                  <h3 className="text-2xl font-black text-zinc-900 mt-1">{game.title}</h3>
                </div>
                <p className="text-zinc-600 text-sm font-medium leading-relaxed mb-6">
                  {game.description}
                </p>
              </div>

              <Link 
                href={game.href}
                className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-center rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Launch Challenge 🚀</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Navigation Ribbon */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-zinc-200 shadow-sm text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-zinc-900 mb-2">Want traditional flashcard practice instead?</h2>
          <p className="text-zinc-500 font-medium text-sm mb-6">Transition from high-octane gameplay to step-by-step vocabulary review across all proficiency levels.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/vocabulary" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm shadow-md transition-all">
              📚 Switch to Vocabulary Hub
            </Link>
            <Link href="/" className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-extrabold rounded-xl text-sm transition-all border border-zinc-200">
              🏠 Return to Dashboard
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
