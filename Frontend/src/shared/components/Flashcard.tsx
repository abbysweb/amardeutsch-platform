"use client";

import { useState, memo, useCallback, useRef, useEffect } from "react";
import { FLASHCARD_STYLES, DEFAULT_FLASHCARD_STYLE } from "@/levels/config";

/**
 * Represents the structure of a vocabulary word passed into the flashcard.
 * This can be either a raw backend object or an enriched object containing dynamic sentences.
 */
interface VocabularyWord {
  id: number | string;
  german: string;
  english: string;
  article?: string;
  plural?: string;
  category?: string;
  level: string;
  example?: string;
  germanSentence?: string | null;
  englishSentence?: string | null;
}


/**
 * Props for the Flashcard component.
 */
interface FlashcardProps {
  /** The vocabulary word object containing the core data to display. */
  word: VocabularyWord;
  /** An optional dynamically generated German example sentence (overrides word.germanSentence). */
  sentenceGerman?: string;
  /** An optional dynamically generated English example sentence (overrides word.englishSentence). */
  sentenceEnglish?: string;
  /** Callback fired when the user clicks a "Listen" button. */
  onSpeak: (text: string) => void;
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


/**
 * An interactive, flippable 3D flashcard component used to study vocabulary words.
 * 
 * - **Front side**: Displays the German word, its article, plural form, and CEFR level.
 * - **Back side**: Displays a German example sentence, its English translation, and a button to hear it spoken.
 * 
 * Includes an auto-flip-back timeout (10 seconds) so that inactive flipped cards reset.
 * 
 * @param props - FlashcardProps
 */
const Flashcard = memo(function Flashcard({ word, sentenceGerman, sentenceEnglish, onSpeak }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const s = FLASHCARD_STYLES[word.level] ?? DEFAULT_FLASHCARD_STYLE;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!flipped) return;
    const id = setTimeout(() => setFlipped(false), 10000);
    return () => clearTimeout(id);
  }, [flipped]);

  const handleSpeak = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSpeak(word.german);
  }, [onSpeak, word.german]);

  const handleSpeakSentence = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (sentenceGerman) onSpeak(sentenceGerman);
  }, [onSpeak, sentenceGerman]);

  return (
    <div
      ref={cardRef}
      className="relative h-80 cursor-pointer [perspective:1000px] group"
      onClick={handleFlip}
    >
      <div
        style={{ transformStyle: "preserve-3d" }}
        className={`absolute inset-0 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        <div
          style={{ backfaceVisibility: "hidden" }}
          className={`absolute inset-0 bg-white rounded-2xl border-2 ${s.border} p-6 flex flex-col items-center justify-center shadow-lg shadow-black/5 transition-all duration-500 ${s.glow} overflow-hidden`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${s.tint} rounded-2xl`} />
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.bar} rounded-t-2xl`} />
          <span className={`relative text-[11px] font-bold px-2.5 py-1 rounded-full ${s.badge} ${s.badgeText} mb-3`}>
            {word.level}
          </span>
          {word.article && (
            <span className="relative text-sm font-medium text-zinc-400 mb-1">{word.article}</span>
          )}
          <span className="relative text-2xl font-bold text-zinc-900 text-center leading-tight">{word.german}</span>
          {word.plural && (
            <span className="relative text-sm text-zinc-400 mt-1">Plural: {word.plural}</span>
          )}
          <button
            onClick={handleSpeak}
            className={`relative mt-auto flex items-center gap-1.5 text-sm text-zinc-400 ${s.listenHover} transition-colors`}
          >
            🔊 Listen
          </button>
          {word.category && (
            <span className="relative text-[11px] text-zinc-300 mt-1">{CATEGORY_EMOJI[word.category] ?? "📁"} {word.category}</span>
          )}
        </div>

        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className={`absolute inset-0 bg-white rounded-2xl border-2 ${s.border} p-6 flex flex-col items-center justify-center shadow-lg shadow-black/5 transition-all duration-500 ${flipped ? s.glow : ""} overflow-hidden`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${s.tint} rounded-2xl`} />
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.bar} rounded-t-2xl`} />
          <p className="relative text-2xl font-bold text-zinc-900 text-center leading-tight mb-4">{sentenceGerman ?? word.germanSentence ?? word.german}</p>
          <p className="relative text-lg text-zinc-500 text-center mb-4">{sentenceEnglish ?? word.englishSentence ?? word.english}</p>
          <button
            onClick={handleSpeakSentence}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-600 ${s.listenHover} rounded-xl transition-all border border-zinc-200`}
          >
            🔊 Listen
          </button>
          <p className="relative text-xs text-zinc-300 mt-auto">Click to flip back</p>
        </div>
      </div>
    </div>
  );
});

Flashcard.displayName = "Flashcard";

export default Flashcard;
