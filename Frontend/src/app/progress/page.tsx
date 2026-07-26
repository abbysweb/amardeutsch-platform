"use client"

import React, { useState, useEffect } from "react"
import { vocabulary } from "@/data/vocabulary"
import { grammarLessons } from "@/data/grammar"
import { quizzes } from "@/data/quizzes"
import { useAllProgress } from "@/presentation/hooks/useProgressV2"
import InterconnectedAnalyticsDashboard from "@/shared/components/Analytics/InterconnectedAnalyticsDashboard"

export default function ProgressPage() {
  const { vocab, grammar, quiz } = useAllProgress()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const completedVocabCount = mounted ? vocabulary.filter((w) => vocab.isCompleted(w.id)).length : 0
  const completedGrammarCount = mounted ? grammarLessons.filter((l) => grammar.isCompleted(l.id)).length : 0
  const completedQuizzesCount = mounted ? quizzes.filter((q) => quiz.isCompleted(q.id)).length : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      
      {/* PAGE HERO HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>🚀 Student Learning Profile & Real-Time Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">
            Live interactive tracking across your German study journey. Synchronized directly with administrative auditing.
          </p>
        </div>

        {/* SUMMARY QUICK BADGES */}
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/80 px-4 py-2 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs text-xs font-black">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <span>📚</span>
            <span>{mounted ? completedVocabCount : "-"} Words</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span>📖</span>
            <span>{mounted ? completedGrammarCount : "-"} Lessons</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <span>✍️</span>
            <span>{mounted ? completedQuizzesCount : "-"} Quizzes</span>
          </div>
        </div>
      </div>

      {/* INTERCONNECTED GRAPHICAL ANALYTICS CENTERPIECE */}
      <div className="animate-fade-in">
        <InterconnectedAnalyticsDashboard viewMode="user" />
      </div>
    </div>
  )
}
