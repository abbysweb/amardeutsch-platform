"use client";

import { useState, useMemo, useCallback } from "react";
import { useLevelVocabulary } from "@/hooks/useLevelVocabulary";
import Flashcard from "@/shared/components/Flashcard";
import { playGermanAudio } from "@/shared/utils/naturalTTS";

const PER_PAGE = 30;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CATEGORY_EMOJI: Record<string, string> = {
  Basics: "🔤", Greetings: "👋", Verbs: "🏃", Transport: "🚗", Food: "🍕",
  Objects: "📦", Education: "📚", Travel: "✈️", Health: "🏥", Pronouns: "👤",
  People: "👥", Family: "👨‍👩‍👧‍👦", Home: "🏠", Numbers: "🔢", Body: "🧍",
  Adjectives: "✨", Time: "⏰", Animals: "🐾", Nature: "🌿", Prepositions: "📍",
  Questions: "❓", Professions: "💼", Places: "🗺️", Shopping: "🛍️", Feelings: "😊",
  Directions: "🧭", Conjunctions: "🔗", Months: "📅", Seasons: "🌈", Kitchen: "🍳",
  Hobbies: "🎮", Positions: "📐", Clothes: "👕", Work: "💻", Weather: "🌤️",
};

export function Vocabulary() {
  const { vocabulary: a1Vocabulary, loading, error } = useLevelVocabulary("a1");
  const [page, setPage] = useState(0);
  const speak = useCallback((text: string) => {
    playGermanAudio(text, 0.92);
  }, []);
  const [shuffled, setShuffled] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const CATS = useMemo(() => {
    return [...new Set(a1Vocabulary.map((w: any) => w.category).filter(Boolean))] as string[];
  }, [a1Vocabulary]);

  const words = shuffled ? shuffle(a1Vocabulary) : a1Vocabulary;

  const filtered = useMemo(() => {
    return words.filter((word: any) => {
      if (category && word.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !word.german.toLowerCase().includes(q) &&
          !word.english.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [words, category, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const start = safePage * PER_PAGE;
  const pageWords = filtered.slice(start, start + PER_PAGE);

  const handleShuffle = useCallback(() => {
    setShuffled((p) => !p);
    setPage(0);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  }, []);

  const handleCategory = useCallback((cat: string) => {
    setCategory((prev) => prev === cat ? "" : cat);
    setPage(0);
  }, []);

  if (loading) return <div className="py-20 text-center text-zinc-500">Loading vocabulary...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Failed to load vocabulary.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-1">
          📚 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Vocabulary</span> Flashcards
        </h1>
        <p className="text-zinc-500">
          Page {page + 1} of {totalPages} &middot; {words.length} words
        </p>
      </div>

      <div className="bg-white border-2 border-zinc-200 rounded-2xl p-4 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search words..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border-2 border-zinc-200 bg-white text-zinc-700 placeholder-zinc-400 focus:border-amber-300 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {CATS.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all ${
                    active
                      ? "border-amber-300 bg-amber-50 text-amber-700"
                      : "border-zinc-200 text-zinc-500 bg-white hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                  }`}
                >
                  {CATEGORY_EMOJI[cat] ?? "📁"} {cat}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setPage(0)} disabled={start === 0} className="px-3 py-1.5 text-sm font-semibold rounded-xl border-2 border-zinc-200 text-zinc-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-200 disabled:hover:bg-transparent disabled:hover:text-zinc-600 transition-all bg-white">First</button>
          <button onClick={() => { if (safePage > 0) setPage(safePage - 1); }} disabled={start === 0} className="px-4 py-1.5 text-sm font-semibold rounded-xl border-2 border-zinc-200 text-zinc-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-200 disabled:hover:bg-transparent disabled:hover:text-zinc-600 transition-all bg-white">← Prev</button>
          <span className="text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-1.5 min-w-[4.5rem] text-center">{safePage + 1} / {totalPages || 1}</span>
          <span className="text-xs text-zinc-400">({filtered.length} words)</span>
          <button onClick={handleShuffle} className={`px-3 py-1.5 text-sm font-semibold rounded-xl border-2 transition-all bg-white ${shuffled ? "border-amber-300 bg-amber-50 text-amber-700" : "border-zinc-200 text-zinc-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"}`}>🎲 {shuffled ? "Ordered" : "Shuffle"}</button>
          <button onClick={() => { if (safePage < totalPages - 1) setPage(safePage + 1); }} disabled={start + PER_PAGE >= filtered.length} className="px-4 py-1.5 text-sm font-semibold rounded-xl border-2 border-zinc-200 text-zinc-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-200 disabled:hover:bg-transparent disabled:hover:text-zinc-600 transition-all bg-white">Next →</button>
          <button onClick={() => setPage(totalPages - 1)} disabled={start + PER_PAGE >= filtered.length} className="px-3 py-1.5 text-sm font-semibold rounded-xl border-2 border-zinc-200 text-zinc-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-200 disabled:hover:bg-transparent disabled:hover:text-zinc-600 transition-all bg-white">Last</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageWords.map((word: any) => (
          <Flashcard 
            key={word.id} 
            word={word} 
            sentenceGerman={word.germanSentence}
            sentenceEnglish={word.englishSentence}
            onSpeak={speak} 
          />
        ))}
      </div>
    </div>
  );
}
