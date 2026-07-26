"use client";

import { useCallback } from "react";
import { useLevelVocabulary } from "@/hooks/useLevelVocabulary";
import Flashcard from "@/shared/components/Flashcard";
import SearchFilter from "@/shared/components/SearchFilter";
import { playGermanAudio } from "@/shared/utils/naturalTTS";

export function VocabularyA1() {
  const { vocabulary: a1Vocabulary, loading, error } = useLevelVocabulary("a1");

  const speak = useCallback((text: string) => {
    playGermanAudio(text, 0.92);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">A1 — Beginner</span>
        <span className="text-zinc-500">{loading ? "Loading..." : `${a1Vocabulary.length} words`}</span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">Loading vocabulary...</div>
      ) : error ? (
        <div className="py-20 text-center text-red-500">Failed to load vocabulary. Make sure the backend server is running.</div>
      ) : (
        <SearchFilter
          items={a1Vocabulary}
          searchKeys={["german", "english", "category"]}
          filterKey="category"
          filterLabel="Category"
          placeholder="Search A1 words in German or English..."
          render={(filtered) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((word: any) => (
                <Flashcard 
                  key={word.id} 
                  word={word} 
                  sentenceGerman={word.germanSentence}
                  sentenceEnglish={word.englishSentence}
                  onSpeak={speak} 
                />
              ))}
            </div>
          )}
        />
      )}

      {a1Vocabulary.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-zinc-400">
          <span className="flex items-center gap-1 text-green-600 font-medium">🟢 A1</span>
          <span>{a1Vocabulary.length} words total</span>
        </div>
      )}
    </div>
  );
}