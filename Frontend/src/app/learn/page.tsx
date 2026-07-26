"use client";

import React from "react";
import Link from "next/link";
import CountUp from "@/shared/components/CountUp";
import { A1_STATS } from "@/levels/a1";
import { A2_STATS } from "@/levels/a2";
import { B1_STATS } from "@/levels/b1";
import { B2_STATS } from "@/levels/b2";

const CURRICULUM_TIERS = [
  {
    level: "A1",
    title: "Starter German & Everyday Essentials",
    subtitle: "Beginner Level • CEFR Standard",
    description: "Master foundational syntax, basic greetings, noun genders, numbers, and core everyday sentences.",
    color: "from-emerald-500/10 via-teal-500/5 to-white border-emerald-300 text-emerald-950",
    headerColor: "bg-emerald-600 text-white",
    stats: A1_STATS,
    href: "/a1",
    topics: ["Definite & Indefinite Articles", "Regular & Irregular Verbs", "Basic Question Word Order", "Time & Daily Schedule"]
  },
  {
    level: "A2",
    title: "Elementary Communication & Syntax",
    subtitle: "Pre-Intermediate Level • CEFR Standard",
    description: "Expand situational vocabulary across health, hobbies, and travel while tackling Dativ prepositions and Perfekt past tense.",
    color: "from-blue-500/10 via-indigo-500/5 to-white border-blue-300 text-blue-950",
    headerColor: "bg-blue-600 text-white",
    stats: A2_STATS,
    href: "/a2",
    topics: ["Dativ & Akkusativ Cases", "Separable & Reflexive Verbs", "Modal Verbs in Context", "Expressing Opinions & Preferences"]
  },
  {
    level: "B1",
    title: "Intermediate Dialogues & Work Life",
    subtitle: "Intermediate Level • CEFR Standard",
    description: "Achieve independent spoken fluency with subordinate clause structures (dass/weil), abstract concepts, and professional discussion.",
    color: "from-purple-500/10 via-fuchsia-500/5 to-white border-purple-300 text-purple-950",
    headerColor: "bg-purple-600 text-white",
    stats: B1_STATS,
    href: "/b1",
    topics: ["Konjunktiv II (Politeness)", "Subordinate Clauses & Word Order", "Genitiv Basics & Prepositions", "Professional Workplace Vocabulary"]
  },
  {
    level: "B2",
    title: "Advanced Professional & Academic German",
    subtitle: "Upper-Intermediate Level • CEFR Standard",
    description: "Navigate high-level academic debates, complex idiomatic terminology, nuanced passive constructions, and precise discourse markers.",
    color: "from-amber-500/10 via-yellow-500/5 to-white border-amber-300 text-amber-950",
    headerColor: "bg-amber-600 text-white",
    stats: B2_STATS,
    href: "/b2",
    topics: ["Advanced Passive Voice", "Nominalization & Academic Syntax", "Complex Connectors & Argumentation", "Idiomatic & Figurative Speech"]
  }
];

export default function LearnPathPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-100/70 to-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black uppercase tracking-wider mb-3 inline-block shadow-2xs">
            🎓 Structured German Roadmap
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight mb-3">
            Master Learning Path
          </h1>
          <p className="text-zinc-600 font-medium text-base">
            Progress step-by-step through verified European language proficiency tiers. Every lesson includes verified native speech and dynamic exercises!
          </p>
        </div>

        {/* Curriculum Cards Stack */}
        <div className="space-y-8 mb-16">
          {CURRICULUM_TIERS.map((tier) => (
            <div key={tier.level} className={`bg-white rounded-3xl border-2 shadow-md hover:shadow-xl transition-all overflow-hidden bg-gradient-to-r ${tier.color}`}>
              
              <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black shadow-sm ${tier.headerColor}`}>
                      Level {tier.level}
                    </span>
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-wider">
                      {tier.subtitle}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2">
                    {tier.title}
                  </h2>
                  <p className="text-zinc-600 font-medium text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
                    {tier.description}
                  </p>

                  {/* Core Topics Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    {tier.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-bold text-zinc-700 bg-white/80 p-2 rounded-xl border border-zinc-200/60 shadow-2xs">
                        <span className="text-emerald-500 font-black">✓</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Level Stats Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-white/90 rounded-xl text-xs font-bold text-zinc-600 border border-zinc-200/70 shadow-2xs flex items-center gap-1">
                      <span>📚 Vocab:</span>
                      <span className="font-black text-zinc-900"><CountUp value={tier.stats.vocabularyCount} /></span>
                    </span>
                    <span className="px-3 py-1 bg-white/90 rounded-xl text-xs font-bold text-zinc-600 border border-zinc-200/70 shadow-2xs flex items-center gap-1">
                      <span>📖 Grammar Rules:</span>
                      <span className="font-black text-zinc-900"><CountUp value={tier.stats.grammarCount} /></span>
                    </span>
                    <span className="px-3 py-1 bg-white/90 rounded-xl text-xs font-bold text-zinc-600 border border-zinc-200/70 shadow-2xs flex items-center gap-1">
                      <span>💬 Sentences:</span>
                      <span className="font-black text-zinc-900"><CountUp value={tier.stats.sentenceCount} /></span>
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                  <Link
                    href={tier.href}
                    className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-sm rounded-2xl shadow-lg text-center transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                  >
                    Start Level {tier.level} →
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Return Ribbon */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-200/80 hover:bg-zinc-300 text-zinc-800 font-black text-sm rounded-xl transition-all">
            <span>← Return to Home Dashboard</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
