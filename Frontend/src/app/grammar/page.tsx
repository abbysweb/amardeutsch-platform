"use client"

import { useState } from "react"
import { grammarLessons } from "@/data/grammar"
import SearchFilter from "@/shared/components/SearchFilter"
import Link from "next/link"
import { LEVEL_META, type CEFRLevel } from "@/levels/cefr"

const LEVEL_TABS = ([
  { id: "ALL" as const, label: "All Levels", badge: "bg-zinc-100 text-zinc-700", border: "border-zinc-300" },
  ...(["A1", "A2", "B1", "B2"] as const).map((id) => ({
    id,
    label: LEVEL_META[id].label,
    badge: `${LEVEL_META[id].bgColor} ${LEVEL_META[id].textColor}`,
    border: LEVEL_META[id].borderColor,
  })),
] as const)

export default function GrammarPage() {
  const [expandedId, setExpandedId] = useState<number | string | null>(null)
  const [activeLevel, setActiveLevel] = useState<"ALL" | CEFRLevel>("ALL")

  const filteredByLevel = activeLevel === "ALL"
    ? grammarLessons
    : grammarLessons.filter((l) => l.level.includes(activeLevel))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
          <Link href="/" className="hover:text-zinc-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-700 font-medium">Grammar</span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">📖 Grammar Lessons</h1>
        <p className="text-zinc-500">
          Learn German grammar step by step, organised by CEFR level from A1 to B2.
        </p>
      </div>

      {/* Level Tab Switcher */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl border border-zinc-200 p-2 shadow-sm">
        {LEVEL_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveLevel(tab.id as typeof activeLevel); setExpandedId(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLevel === tab.id
                ? `${tab.badge} border ${tab.border}`
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {tab.label}
            {tab.id !== "ALL" && (
              <span className="ml-1.5 text-xs opacity-60">
                ({grammarLessons.filter((l) => l.level.includes(tab.id)).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <SearchFilter
        items={filteredByLevel}
        searchKeys={["title", "description", "category"]}
        filterKey="level"
        filterLabel="Level"
        placeholder="Search lessons..."
        render={(filtered) => (
          <div className="space-y-4">
            {filtered.map((lesson) => {
              const isOpen = expandedId === lesson.id
              const levelKey = (["A1", "A2", "B1", "B2"] as const).find((l) => lesson.level.includes(l)) ?? "A1"
              const levelColor = `${LEVEL_META[levelKey].bgColor} ${LEVEL_META[levelKey].textColor}`

              return (
                <div
                  key={lesson.id}
                  className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : lesson.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColor}`}>
                          {lesson.level}
                        </span>
                        <span className="text-xs text-zinc-400">{lesson.category}</span>
                      </div>
                      <h3 className="font-semibold text-zinc-900">{lesson.title}</h3>
                      <p className="text-sm text-zinc-500 mt-1">{lesson.description}</p>
                    </div>
                    <span className={`mt-1 transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-zinc-100">
                      <div className="prose prose-sm max-w-none mt-4 text-zinc-700 whitespace-pre-line leading-relaxed">
                        {lesson.content}
                      </div>

                      {lesson.conjugationTable && lesson.conjugationTable.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-zinc-800 text-sm mb-2">Conjugation Table:</h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
                            {lesson.conjugationTable.map((row, i) => (
                              <p key={i} className="text-sm text-blue-800 font-mono">{row}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {lesson.errorTraps && lesson.errorTraps.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-red-700 text-sm mb-2">⚠ Error Traps:</h4>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                            {lesson.errorTraps.map((trap, i) => (
                              <p key={i} className="text-sm text-red-700">• {trap}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium text-zinc-800 text-sm">Examples:</h4>
                        {lesson.examples?.map((ex, i) => (
                          <div key={i} className="bg-zinc-50 rounded-lg p-3 border border-zinc-100">
                            <p className="text-zinc-800 font-medium">{ex.german}</p>
                            <p className="text-zinc-500 text-sm">{ex.english}</p>
                          </div>
                        ))}
                      </div>

                      {lesson.testable && (
                        <div className="mt-3 text-xs text-green-600 font-medium">
                          ✅ This topic is testable in official {lesson.level} exams
                        </div>
                      )}

                      {/* Link to level page */}
                      <div className="mt-4 pt-4 border-t border-zinc-100">
                        <Link
                          href={`/${lesson.level.includes("A1") ? "a1" : lesson.level.toLowerCase()}/grammar`}
                          className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                          → Go to {lesson.level.includes("A1") ? "A1" : lesson.level} Grammar Hub for more lessons
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {filtered.length === 0 && (
              <p className="text-center text-zinc-400 py-12">No lessons found.</p>
            )}
          </div>
        )}
      />
    </div>
  )
}