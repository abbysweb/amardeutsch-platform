"use client";

import { useCallback } from "react";
import { useLevelVocabulary } from "@/hooks/useLevelVocabulary";
import Flashcard from "@/shared/components/Flashcard";
import SearchFilter from "@/shared/components/SearchFilter";
import { playGermanAudio } from "@/shared/utils/naturalTTS";

export function Vocabulary() {
  const { vocabulary: a2Vocabulary, loading, error } = useLevelVocabulary("a2");

  const speak = useCallback((text: string) => {
    playGermanAudio(text, 0.92);
  }, []);

  if (loading) return <div className="py-20 text-center text-zinc-500">Loading vocabulary...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Failed to load vocabulary. Make sure backend server is running.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          📚 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">A2 Vocabulary</span> Flashcards
        </h1>
        <p className="text-zinc-500">
          Browse {a2Vocabulary.length} A2-level words by category. Click a card to flip it, click <strong>Listen</strong> to hear pronunciation.
        </p>
      </div>

      <SearchFilter
        items={a2Vocabulary}
        searchKeys={["german", "english", "category"]}
        filterKey="category"
        filterLabel="Category"
        placeholder="Search words in German or English..."
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
    </div>
  );
}
