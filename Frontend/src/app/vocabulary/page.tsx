"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { A1_STATS } from "@/levels/a1";
import { A2_STATS } from "@/levels/a2";
import { B1_STATS } from "@/levels/b1";
import { B2_STATS } from "@/levels/b2";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import CountUp from "@/shared/components/CountUp";

// Lazy load each level's vocabulary component
const VocabularyA1 = dynamic(() => import("@/levels/a1/modules/VocabularyHub").then((mod) => ({ default: mod.VocabularyA1 })), {
  ssr: false,
  loading: () => <VocabularySkeleton />,
});

const VocabularyA2 = dynamic(() => import("@/levels/a2/modules/VocabularyHub").then((mod) => ({ default: mod.VocabularyA2 })), {
  ssr: false,
  loading: () => <VocabularySkeleton />,
});

const VocabularyB1 = dynamic(() => import("@/levels/b1/modules/VocabularyHub").then((mod) => ({ default: mod.VocabularyB1 })), {
  ssr: false,
  loading: () => <VocabularySkeleton />,
});

const VocabularyB2 = dynamic(() => import("@/levels/b2/modules/VocabularyHub").then((mod) => ({ default: mod.VocabularyB2 })), {
  ssr: false,
  loading: () => <VocabularySkeleton />,
});

function VocabularySkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-zinc-200 rounded-xl w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-zinc-200/80 rounded-2xl border border-zinc-300/50"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

type ActiveTabId = "ALL" | "A1" | "A2" | "B1" | "B2";

interface DisplayLevelCard {
  id: ActiveTabId;
  label: string;
  icon: string;
  count: React.ReactNode;
  badge: string;
  description: string;
  colorScheme: "purple" | "green" | "yellow" | "orange" | "red";
}

function getCardStyle(scheme: DisplayLevelCard["colorScheme"], isActive: boolean) {
  switch (scheme) {
    case "purple":
      return {
        bg: isActive 
          ? "bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 text-white shadow-xl shadow-purple-500/30 ring-4 ring-purple-300 scale-[1.02]" 
          : "bg-gradient-to-br from-purple-50 via-white to-indigo-50/80 text-zinc-900 border-2 border-purple-200/80 hover:border-purple-400 hover:shadow-lg",
        badge: isActive ? "bg-white/20 text-white border border-white/30" : "bg-purple-100 text-purple-800 border border-purple-200/80",
        count: isActive ? "text-purple-200 font-mono" : "text-purple-600 font-mono font-bold",
        desc: isActive ? "text-purple-100 text-xs" : "text-zinc-600 text-xs",
      };
    case "green":
      return {
        bg: isActive 
          ? "bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-300 scale-[1.02]" 
          : "bg-gradient-to-br from-emerald-50/90 via-white to-green-50/70 text-zinc-900 border-2 border-emerald-200/80 hover:border-emerald-400 hover:shadow-lg",
        badge: isActive ? "bg-white/20 text-white border border-white/30" : "bg-emerald-100 text-emerald-800 border border-emerald-200/80",
        count: isActive ? "text-emerald-200 font-mono" : "text-emerald-600 font-mono font-bold",
        desc: isActive ? "text-emerald-100 text-xs" : "text-zinc-600 text-xs",
      };
    case "yellow":
      return {
        bg: isActive 
          ? "bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-600 text-white shadow-xl shadow-amber-500/30 ring-4 ring-amber-300 scale-[1.02]" 
          : "bg-gradient-to-br from-amber-50/90 via-white to-yellow-50/70 text-zinc-900 border-2 border-amber-200/80 hover:border-amber-400 hover:shadow-lg",
        badge: isActive ? "bg-white/20 text-white border border-white/30" : "bg-amber-100 text-amber-900 border border-amber-200/80",
        count: isActive ? "text-amber-100 font-mono" : "text-amber-700 font-mono font-bold",
        desc: isActive ? "text-amber-100 text-xs" : "text-zinc-600 text-xs",
      };
    case "orange":
      return {
        bg: isActive 
          ? "bg-gradient-to-br from-orange-600 via-amber-600 to-red-600 text-white shadow-xl shadow-orange-500/30 ring-4 ring-orange-300 scale-[1.02]" 
          : "bg-gradient-to-br from-orange-50/90 via-white to-amber-50/70 text-zinc-900 border-2 border-orange-200/80 hover:border-orange-400 hover:shadow-lg",
        badge: isActive ? "bg-white/20 text-white border border-white/30" : "bg-orange-100 text-orange-900 border border-orange-200/80",
        count: isActive ? "text-orange-200 font-mono" : "text-orange-600 font-mono font-bold",
        desc: isActive ? "text-orange-100 text-xs" : "text-zinc-600 text-xs",
      };
    case "red":
      return {
        bg: isActive 
          ? "bg-gradient-to-br from-rose-600 via-red-600 to-pink-700 text-white shadow-xl shadow-rose-500/30 ring-4 ring-rose-300 scale-[1.02]" 
          : "bg-gradient-to-br from-rose-50/90 via-white to-pink-50/70 text-zinc-900 border-2 border-rose-200/80 hover:border-rose-400 hover:shadow-lg",
        badge: isActive ? "bg-white/20 text-white border border-white/30" : "bg-rose-100 text-rose-900 border border-rose-200/80",
        count: isActive ? "text-rose-200 font-mono" : "text-rose-600 font-mono font-bold",
        desc: isActive ? "text-rose-100 text-xs" : "text-zinc-600 text-xs",
      };
  }
}

function LevelCard({ 
  card, 
  isActive, 
  onClick 
}: { 
  card: DisplayLevelCard;
  isActive: boolean;
  onClick: () => void;
}) {
  const styles = getCardStyle(card.colorScheme, isActive);

  return (
    <button
      onClick={onClick}
      className={`relative group overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer p-5 flex flex-col justify-between text-left h-full ${styles.bg}`}
      aria-pressed={isActive}
      aria-label={`Select ${card.label} vocabulary (${card.count})`}
    >
      {/* Glassmorphic sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Top Row: Icon and Badge */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-xs">
            {card.icon}
          </span>
          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs ${styles.badge}`}>
            {card.badge}
          </span>
        </div>

        {/* Title & Word Count */}
        <h3 className="text-xl font-black tracking-tight mb-1">
          {card.label}
        </h3>
        <div className={`text-xs font-black mb-2 flex items-center gap-1 ${styles.count}`}>
          <span>⚡</span>
          <span>{card.count}</span>
        </div>

        {/* Description */}
        <p className={`line-clamp-2 leading-relaxed mb-4 ${styles.desc}`}>
          {card.description}
        </p>
      </div>

      {/* Footer Status */}
      <div className="pt-3 border-t border-current/10 flex items-center justify-between w-full text-[11px] font-bold">
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white animate-pulse" : "bg-amber-500"}`} />
          <span>{isActive ? "Viewing Deck 👁️" : "Select Deck"}</span>
        </span>
        <span className="opacity-80 font-mono">→</span>
      </div>

      {/* Active bottom glow line */}
      {isActive && (
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-amber-300 via-white to-green-300 animate-pulse" />
      )}
    </button>
  );
}

function ActiveLevelContent({ activeLevel }: { activeLevel: ActiveTabId }) {
  return (
    <div className="mt-6 space-y-16 animate-fade-in-up">
      {/* CEFR LEVEL A1 */}
      {(activeLevel === "ALL" || activeLevel === "A1") && (
        <section className="bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-emerald-300/90 shadow-xl p-4 sm:p-8 relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2 pb-4 border-b border-zinc-200/80">
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl">🌱</span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
                  <span>Level A1 Foundation</span>
                </h2>
                <p className="text-xs sm:text-sm font-bold text-emerald-700">
                  Beginner German • Everyday terms, basic greetings, & core pronunciation
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-900 rounded-full border border-emerald-300 shadow-2xs flex items-center gap-1">
              <span>Tier A1</span>
              <span>⚡</span>
            </span>
          </div>

          <ErrorBoundary fallback={<div className="p-8 text-center text-red-500 font-bold">Failed to load A1 vocabulary. Make sure backend is running on port 3001!</div>}>
            <VocabularyA1 />
          </ErrorBoundary>
        </section>
      )}

      {/* CEFR LEVEL A2 */}
      {(activeLevel === "ALL" || activeLevel === "A2") && (
        <section className="bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-amber-300/90 shadow-xl p-4 sm:p-8 relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2 pb-4 border-b border-zinc-200/80">
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl">🌿</span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
                  <span>Level A2 Elementary</span>
                </h2>
                <p className="text-xs sm:text-sm font-bold text-amber-700">
                  Elementary German • Situational dialogue for transport, shopping, & schedules
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-4 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 rounded-full border border-amber-300 shadow-2xs flex items-center gap-1">
              <span>Tier A2</span>
              <span>⚡</span>
            </span>
          </div>

          <ErrorBoundary fallback={<div className="p-8 text-center text-red-500 font-bold">Failed to load A2 vocabulary.</div>}>
            <VocabularyA2 />
          </ErrorBoundary>
        </section>
      )}

      {/* CEFR LEVEL B1 */}
      {(activeLevel === "ALL" || activeLevel === "B1") && (
        <section className="bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-orange-300/90 shadow-xl p-4 sm:p-8 relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-amber-500 to-red-500" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2 pb-4 border-b border-zinc-200/80">
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl">🌳</span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
                  <span>Level B1 Intermediate</span>
                </h2>
                <p className="text-xs sm:text-sm font-bold text-orange-700">
                  Intermediate German • Abstract thoughts, storytelling vocabulary, & opinions
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-4 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 rounded-full border border-orange-300 shadow-2xs flex items-center gap-1">
              <span>Tier B1</span>
              <span>🔥</span>
            </span>
          </div>

          <ErrorBoundary fallback={<div className="p-8 text-center text-red-500 font-bold">Failed to load B1 vocabulary.</div>}>
            <VocabularyB1 />
          </ErrorBoundary>
        </section>
      )}

      {/* CEFR LEVEL B2 */}
      {(activeLevel === "ALL" || activeLevel === "B2") && (
        <section className="bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-rose-300/90 shadow-xl p-4 sm:p-8 relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2 pb-4 border-b border-zinc-200/80">
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl">🌲</span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
                  <span>Level B2 Mastery</span>
                </h2>
                <p className="text-xs sm:text-sm font-bold text-rose-700">
                  Upper-Intermediate German • Professional debates, idiomatic phrasing, & rhetoric
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-4 py-1.5 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-900 rounded-full border border-rose-300 shadow-2xs flex items-center gap-1">
              <span>Tier B2</span>
              <span>🏆</span>
            </span>
          </div>

          <ErrorBoundary fallback={<div className="p-8 text-center text-red-500 font-bold">Failed to load B2 vocabulary.</div>}>
            <VocabularyB2 />
          </ErrorBoundary>
        </section>
      )}
    </div>
  );
}

export default function VocabularyPage() {
  const [activeLevel, setActiveLevel] = useState<ActiveTabId>("ALL");
  const [isContentLoaded, setIsContentLoaded] = useState(true);

  const a1Stats = useRealtimeStats("a1", { vocabularyCount: A1_STATS.vocabularyCount || 338, grammarCount: 0, quizCount: 0, sentenceCount: 0 });
  const a2Stats = useRealtimeStats("a2", { vocabularyCount: A2_STATS.vocabularyCount || 645, grammarCount: 0, quizCount: 0, sentenceCount: 0 });
  const b1Stats = useRealtimeStats("b1", { vocabularyCount: B1_STATS.vocabularyCount || 482, grammarCount: 0, quizCount: 0, sentenceCount: 0 });
  const b2Stats = useRealtimeStats("b2", { vocabularyCount: B2_STATS.vocabularyCount || 512, grammarCount: 0, quizCount: 0, sentenceCount: 0 });

  const totalVocabs = (a1Stats.vocabularyCount || 338) + (a2Stats.vocabularyCount || 645) + (b1Stats.vocabularyCount || 482) + (b2Stats.vocabularyCount || 512);

  const displayCards: DisplayLevelCard[] = [
    {
      id: "ALL",
      label: "All Levels",
      icon: "🌟",
      count: <><CountUp value={totalVocabs} /> real words</>,
      badge: "Total Library",
      description: "Browse all vocabulary words across every CEFR level simultaneously.",
      colorScheme: "purple",
    },
    {
      id: "A1",
      label: "Beginner",
      icon: "🌱",
      count: <><CountUp value={a1Stats.vocabularyCount || 338} /> real words</>,
      badge: "Tier A1",
      description: "Essential daily terms, basic greetings, and conversational foundations.",
      colorScheme: "green",
    },
    {
      id: "A2",
      label: "Elementary",
      icon: "🌿",
      count: <><CountUp value={a2Stats.vocabularyCount || 645} /> real words</>,
      badge: "Tier A2",
      description: "Expanded situational dialogue for shopping, travel, and simple errands.",
      colorScheme: "yellow",
    },
    {
      id: "B1",
      label: "Intermediate",
      icon: "🌳",
      count: <><CountUp value={b1Stats.vocabularyCount || 482} /> real words</>,
      badge: "Tier B1",
      description: "Expressing abstract thoughts, personal experiences, and media opinions.",
      colorScheme: "orange",
    },
    {
      id: "B2",
      label: "Upper-Int.",
      icon: "🌲",
      count: <><CountUp value={b2Stats.vocabularyCount || 512} /> real words</>,
      badge: "Tier B2",
      description: "Advanced workplace rhetoric, specialized verbs, and native fluency idioms.",
      colorScheme: "red",
    },
  ];

  const handleLevelClick = useCallback((level: ActiveTabId) => {
    if (activeLevel === level) {
      // If clicking already active single level, toggle back to showing ALL
      if (level !== "ALL") {
        setIsContentLoaded(false);
        setActiveLevel("ALL");
        setTimeout(() => setIsContentLoaded(true), 120);
      }
      return;
    }
    setIsContentLoaded(false);
    setActiveLevel(level);
    setTimeout(() => setIsContentLoaded(true), 120);
  }, [activeLevel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50">
      {/* Ambient background blur circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <main className="relative flex-1">
        {/* Header Section */}
        <header className="relative py-12 sm:py-16 px-4 bg-gradient-to-b from-amber-50/50 via-white to-transparent border-b border-zinc-200/60">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-50 border border-amber-300/80 text-amber-900 font-extrabold text-xs shadow-xs mb-4">
                <span className="animate-bounce text-sm">📚</span>
                <span className="uppercase tracking-wider">CEFR Complete Vocabulary Repository</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight mb-4">
                Your German <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600">Vocabulary Hub</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 font-medium leading-relaxed">
                Explore our real-time synchronized collection of <strong className="text-zinc-900 font-extrabold"><CountUp value={totalVocabs} /> verified vocabulary cards</strong> across all language milestones. Click any card below to filter by difficulty or view your full German collection simultaneously!
              </p>
            </div>

            {/* Level Selection Cards (5-Column Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5" role="tablist" aria-label="CEFR Vocabulary Levels">
              {displayCards.map((card) => (
                <LevelCard
                  key={card.id}
                  card={card}
                  isActive={activeLevel === card.id}
                  onClick={() => handleLevelClick(card.id)}
                />
              ))}
            </div>
          </div>
        </header>

        {/* Active Level Content (Displays All Vocabs by Level by Default!) */}
        <section className="relative px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            {isContentLoaded ? (
              <ActiveLevelContent activeLevel={activeLevel} />
            ) : (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-zinc-400">Loading vocabulary decks...</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}