"use client";

import { useState } from "react";
import { a1Sentences } from "@/levels/a1";
import SearchFilter from "@/shared/components/SearchFilter";
import { playGermanAudio } from "@/shared/utils/naturalTTS";
import CountUp from "@/shared/components/CountUp";

function speak(text: string) {
  playGermanAudio(text, 0.92);
}

export function Sentences() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-zinc-900">💬 Practice Sentences</h1>
          <span className="px-3 py-1 bg-amber-100/80 text-amber-800 font-semibold rounded-full text-sm flex items-center gap-1.5 shadow-sm border border-amber-200/60">
            <span>✨</span>
            <CountUp value={a1Sentences.length} />
            <span>Real Sentences</span>
          </span>
        </div>
        <p className="text-zinc-500 text-base">
          Learn German in context with <strong className="text-zinc-900 font-semibold"><CountUp value={a1Sentences.length} /> real example sentences</strong> covering daily situations and everyday conversations.
        </p>
      </div>

      <SearchFilter
        items={a1Sentences}
        searchKeys={["german", "english", "category", "grammarPoint"]}
        filterKey="category"
        filterLabel="Category"
        placeholder="Search sentences in German or English..."
        render={(filtered) => (
          <div className="space-y-3">
            {filtered.map((sentence) => (
              <div
                key={sentence.id}
                className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-800 font-medium text-lg">{sentence.german}</p>
                    <p className="text-zinc-500 mt-1">{sentence.english}</p>
                    {sentence.grammarPoint && (
                      <p className="text-xs text-zinc-400 mt-2 italic">
                        Grammar: {sentence.grammarPoint}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => speak(sentence.german)}
                    className="shrink-0 w-10 h-10 rounded-full bg-yellow-100 hover:bg-yellow-200 transition-colors flex items-center justify-center text-sm text-yellow-600"
                    title="Listen to pronunciation"
                  >
                    🔊
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                    A1
                  </span>
                  <span className="text-xs text-zinc-400">{sentence.category}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-zinc-400 py-12">No sentences found.</p>
            )}
          </div>
        )}
      />
    </div>
  );
}