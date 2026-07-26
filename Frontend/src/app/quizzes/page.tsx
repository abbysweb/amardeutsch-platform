"use client";

import { useState } from "react";
import Link from "next/link";
import { useCentralQuizzes } from "@/data/quizzes";
import SearchFilter from "@/shared/components/SearchFilter";

const CEFR_LEVELS = [
  { id: "all", name: "All Levels", color: "bg-zinc-900 text-white" },
  { id: "A1", name: "A1 Beginner", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { id: "A2", name: "A2 Elementary", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "B1", name: "B1 Intermediate", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { id: "B2", name: "B2 Upper Intermediate", color: "bg-amber-100 text-amber-800 border-amber-200" }
];

export default function QuizzesHubPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "multiple_choice" | "fill_blank">("all");
  
  // Pull directly from the centralized quiz data source of truth
  const { quizzes: allQuizzes, loading } = useCentralQuizzes("all");

  // Filter quizzes by CEFR level and quiz format
  const filteredByLevelAndType = allQuizzes.filter((q) => {
    const levelMatch = selectedLevel === "all" || q.level.toUpperCase() === selectedLevel.toUpperCase();
    const typeMatch = typeFilter === "all" || q.quizType === typeFilter;
    return levelMatch && typeMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header section */}
      <div className="mb-10 bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-3 inline-block">
            🎯 Interactive CEFR Quiz Arena
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-3 tracking-tight">
            German Grammar & Vocabulary Quizzes
          </h1>
          <p className="text-md sm:text-lg text-zinc-500 font-medium max-w-2xl">
            Choose a CEFR level and practice with our sound-enabled Multiple Choice (A/B/C/D) and Sentence Missing Word fill-up challenges.
          </p>
        </div>

        {/* Level Quick Actions */}
        <div className="shrink-0 flex flex-col gap-3">
          <Link
            href="/a1/quizzes"
            className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-md rounded-2xl shadow-lg hover:shadow-xl transition-all text-center flex items-center justify-center gap-2"
          >
            <span>🚀 Open A1 Arena</span>
          </Link>
          <span className="text-xs text-center text-zinc-400 font-medium">
            Powered by centralized quiz engine
          </span>
        </div>
      </div>

      {/* CEFR Level & Type Filter Controls */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-400 mr-1">
            Level:
          </span>
          {CEFR_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                selectedLevel === level.id
                  ? level.id === "all" ? "bg-zinc-900 text-white border-zinc-900 shadow-sm" : `${level.color} shadow-sm font-black`
                  : "bg-white text-zinc-600 border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300"
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === "all" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setTypeFilter("multiple_choice")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === "multiple_choice" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            🔘 Multiple Choice
          </button>
          <button
            onClick={() => setTypeFilter("fill_blank")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === "fill_blank" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            ✍️ Missing Word
          </button>
        </div>
      </div>

      {/* Quizzes List & Search Filter */}
      <SearchFilter
        items={filteredByLevelAndType}
        searchKeys={["title", "description", "category"]}
        filterKey="category"
        filterLabel="Category Topic"
        placeholder="Search quizzes by title, grammatical rule or topic..."
        render={(filtered) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((q) => {
              const isFillBlank = q.quizType === "fill_blank";
              const targetUrl = q.level === "A1" ? "/a1/quizzes" : `/${q.level.toLowerCase()}/quizzes`;

              return (
                <Link
                  key={q.id}
                  href={targetUrl}
                  className="group bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-6 hover:shadow-md hover:border-zinc-300 transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Level {q.level}
                        </span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                          {isFillBlank ? "✍️ Sentence Fill-In" : "🔘 A/B/C/D Options"}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-zinc-400">
                        {q.questions?.length || 5} Questions
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-zinc-900 group-hover:text-amber-600 transition-colors mb-2">
                      {q.title}
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium line-clamp-2">
                      {q.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-sm font-extrabold text-amber-600 group-hover:translate-x-1 transition-transform">
                    <span>Play Challenge in {q.level} Arena →</span>
                    <span className="text-xs text-zinc-400 font-normal">🔊 Audio Enabled</span>
                  </div>
                </Link>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center text-zinc-400 py-16 col-span-2 bg-white rounded-3xl border border-zinc-200/60 shadow-xs">
                <p className="text-5xl mb-3">📭</p>
                <p className="text-lg font-extrabold text-zinc-700">No quizzes found in this selection</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Try switching the CEFR Level tab or checking the "All Types" filter above.
                </p>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}