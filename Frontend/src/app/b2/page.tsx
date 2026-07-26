"use client";

import React from "react";
import Link from "next/link";
import { B2_STATS } from "@/levels/b2";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import CountUp from "@/shared/components/CountUp";

export default function B2Page() {
  const liveStats = useRealtimeStats("b2", {
    vocabularyCount: B2_STATS.vocabularyCount || 512,
    grammarCount: B2_STATS.grammarCount,
    quizCount: B2_STATS.quizCount,
    totalQuestions: B2_STATS.totalQuestions,
    sentenceCount: B2_STATS.sentenceCount,
    examCount: 2
  });

  const cards = [
    { 
      href: "/b2/vocabulary", 
      emoji: "📚", 
      title: "Vocabulary", 
      count: liveStats.vocabularyCount, 
      sublabel: "Normalized Words",
      accent: "from-green-400 to-emerald-500", 
      border: "border-green-200", 
      bg: "bg-green-50", 
      badge: "bg-green-100 text-green-700", 
      cta: "bg-green-500 hover:bg-green-600" 
    },
    { 
      href: "/b2/grammar", 
      emoji: "📖", 
      title: "Grammar", 
      count: liveStats.grammarCount, 
      sublabel: "Grammar Units",
      accent: "from-purple-400 to-purple-500", 
      border: "border-purple-200", 
      bg: "bg-purple-50", 
      badge: "bg-purple-100 text-purple-700", 
      cta: "bg-purple-500 hover:bg-purple-600" 
    },
    { 
      href: "/b2/quizzes", 
      emoji: "✍️", 
      title: "Quizzes", 
      count: liveStats.quizCount, 
      sublabel: <><CountUp value={liveStats.totalQuestions} /> Questions</>,
      accent: "from-indigo-400 to-indigo-500", 
      border: "border-indigo-200", 
      bg: "bg-indigo-50", 
      badge: "bg-indigo-100 text-indigo-700", 
      cta: "bg-indigo-500 hover:bg-indigo-600" 
    },
    { 
      href: "/b2/sentences", 
      emoji: "💬", 
      title: "Sentences", 
      count: liveStats.sentenceCount, 
      sublabel: "Example Dialogues",
      accent: "from-teal-400 to-teal-500", 
      border: "border-teal-200", 
      bg: "bg-teal-50", 
      badge: "bg-teal-100 text-teal-700", 
      cta: "bg-teal-500 hover:bg-teal-600" 
    },
    { 
      href: "/b2/exam", 
      emoji: "📝", 
      title: "Practice Exam", 
      count: liveStats.examCount, 
      sublabel: "Marathon Simulators",
      accent: "from-rose-400 to-rose-500", 
      border: "border-rose-200", 
      bg: "bg-rose-50", 
      badge: "bg-rose-100 text-rose-700", 
      cta: "bg-rose-500 hover:bg-rose-600" 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-rose-50 to-white">
      {/* Breadcrumb + cross-level nav */}
      <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-zinc-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-700 font-medium">B2</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium">
            <Link href="/a1" className="px-2 py-1 rounded text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">A1</Link>
            <svg className="w-3 h-3 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <Link href="/a2" className="px-2 py-1 rounded text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">A2</Link>
            <svg className="w-3 h-3 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <Link href="/b1" className="px-2 py-1 rounded text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">B1</Link>
            <svg className="w-3 h-3 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="px-2 py-1 rounded bg-red-100 text-red-800 font-bold">B2</span>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          {/* Real-Time Database Status Ticker Badge */}
          <div className="inline-flex items-center gap-2.5 bg-zinc-900 border border-zinc-700 text-white rounded-full px-5 py-2 text-xs sm:text-sm font-semibold mb-4 shadow-lg transition-all hover:scale-[1.02]">
            <span className={`w-2.5 h-2.5 rounded-full ${liveStats.isLive ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
            <span className="text-emerald-400 font-extrabold tracking-wide">REAL-TIME DB SYNCED:</span>
            <span><CountUp value={liveStats.vocabularyCount} /> Vocab Words • <CountUp value={liveStats.quizCount} /> Quizzes (<CountUp value={liveStats.totalQuestions} /> Questions) • <CountUp value={liveStats.examCount} /> Exams</span>
            <button 
              onClick={(e) => { e.preventDefault(); liveStats.refresh(); }} 
              className="ml-1 text-zinc-400 hover:text-white transition-colors"
              title="Refresh Live Statistics"
            >
              🔄
            </button>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 mb-3 tracking-tight">
            📕 B2 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">Vocabulary</span> &amp; Grammar Hub
          </h1>
          <p className="text-zinc-600 max-w-2xl mx-auto font-medium text-base sm:text-lg">
            Master professional fluency and advanced grammar — synchronized in real time with Admin Portal updates!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="group block h-full">
              <div className={`rounded-2xl border-2 ${card.border} ${card.bg} p-6 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1.5 relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.accent}`} />
                
                <div className="flex flex-col items-center justify-center text-center pt-2">
                  <span className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{card.emoji}</span>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${card.badge} uppercase tracking-wider mb-3`}>
                    Level B2
                  </span>
                  <h2 className="text-xl font-bold text-zinc-900 mb-1">{card.title}</h2>
                  <div className="mt-2 text-center">
                    <span className="text-2xl font-black text-zinc-800 block leading-none"><CountUp value={card.count} /></span>
                    <span className="text-xs font-semibold text-zinc-500 uppercase mt-1 block">{card.sublabel}</span>
                  </div>
                </div>

                <div className={`mt-6 w-full py-3 ${card.cta} text-white text-sm font-extrabold rounded-xl text-center shadow-md transition-all group-hover:brightness-110`}>
                  Explore Now →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tools quick links */}
        <div className="mt-14 pt-8 border-t border-zinc-200">
          <div className="text-center mb-6">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Study Tools &amp; Arenas</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/vocabulary" className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:border-yellow-400 hover:text-yellow-700 hover:shadow-md transition-all">📚 Vocabulary Hub</Link>
            <Link href="/grammar" className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:border-purple-400 hover:text-purple-700 hover:shadow-md transition-all">📖 Grammar Hub</Link>
            <Link href="/quizzes" className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:border-indigo-400 hover:text-indigo-700 hover:shadow-md transition-all">✍️ Quizzes Arena</Link>
            <Link href="/random-word" className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:border-pink-400 hover:text-pink-700 hover:shadow-md transition-all">🎲 Random Word</Link>
            <Link href="/progress" className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:border-slate-400 hover:text-slate-700 hover:shadow-md transition-all">📊 Progress</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

