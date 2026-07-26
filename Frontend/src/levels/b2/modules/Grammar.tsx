"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { b2Grammar } from "@/levels/b2";
import lectures from "@/levels/b2/grammar/lectures";
import Link from "next/link";
import SimpleMarkdown from "@/levels/a1/modules/SimpleMarkdown";

const UNIT_ICONS: Record<number, string> = {
  1: "🔮", 2: "🧲", 3: "🎭", 4: "🔄", 5: "💼",
};

export function Grammar() {
  const searchParams = useSearchParams();
  const unitParam = searchParams.get("unit");
  const selectedUnit = unitParam ? parseInt(unitParam, 10) : 1;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const unit = b2Grammar.find((u) => u.id === selectedUnit) ?? b2Grammar[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50">
      {/* Mobile hamburger */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-4 py-3 flex items-center gap-3">
        <Link href="/b2" className="p-2 -ml-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors" aria-label="Back to B2 Menu">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <span className="text-sm font-semibold text-zinc-700 truncate">
          Unit {unit.id}: {unit.title}
        </span>
      </div>

      <div className="flex relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 z-40 lg:z-10
            w-80 lg:w-72 xl:w-80
            bg-white border-r border-zinc-200
            h-[calc(100vh-4rem)] overflow-y-auto
            transition-transform duration-300 ease-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Sidebar header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-4 border-b border-zinc-200">
            <Link href="/b2" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-3 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to B2 Menu
            </Link>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">B2</span>
              <h2 className="text-lg font-bold text-zinc-900">Grammar Units</h2>
            </div>
            <p className="text-xs text-zinc-400">{b2Grammar.length} units · Click to explore</p>
          </div>

          {/* Unit list */}
          <nav className="p-2 space-y-0.5 pb-8">
            {b2Grammar.map((u) => {
              const isActive = selectedUnit === u.id;
              return (
                <Link
                  key={u.id}
                  href={`?unit=${u.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-start gap-3 group block
                    ${isActive
                      ? "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 shadow-sm"
                      : "hover:bg-zinc-50 border border-transparent"
                    }
                  `}
                >
                  {/* Unit number badge */}
                  <span
                    className={`
                      shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors
                      ${isActive
                        ? "bg-red-500 text-white shadow-sm"
                        : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"
                      }
                    `}
                  >
                    {u.id}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium leading-snug ${
                        isActive ? "text-red-800" : "text-zinc-700 group-hover:text-zinc-900"
                      }`}
                    >
                      {u.title}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                      <span>{UNIT_ICONS[u.id] ?? "📖"}</span>
                      <span>{u.category}</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main ref={contentRef} className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Unit header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-red-200">
                  {unit.id}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">B2</span>
                    <span className="text-xs text-zinc-400">{unit.category}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                    Unit {unit.id}: {unit.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-5 sm:p-6 mb-6">
              <p className="text-zinc-700 leading-relaxed">{unit.description}</p>
            </div>

            {/* Lecture Content */}
            {lectures[unit.id] ? (
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 mb-6 shadow-sm">
                <SimpleMarkdown key={unit.id} content={lectures[unit.id]} />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 mb-6 shadow-sm">
                <p className="text-zinc-500 italic">Lecture content for this unit is currently being written...</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 pb-12">
              <Link
                href={selectedUnit > 1 ? `?unit=${selectedUnit - 1}` : "#"}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-all ${selectedUnit <= 1 ? "opacity-30 pointer-events-none" : "hover:bg-zinc-50 hover:shadow-sm"}`}
              >
                ← Previous Unit
              </Link>
              <span className="text-xs text-zinc-400 hidden sm:block">
                Unit {selectedUnit} of {b2Grammar.length}
              </span>
              <Link
                href={selectedUnit < b2Grammar.length ? `?unit=${selectedUnit + 1}` : "#"}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-red-500 text-white transition-all ${selectedUnit >= b2Grammar.length ? "opacity-30 pointer-events-none" : "hover:bg-red-600 hover:shadow-sm"}`}
              >
                Next Unit →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
