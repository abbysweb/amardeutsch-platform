"use client";

import { useState, memo, useCallback, useEffect, useRef } from "react";
import { playGermanAudio } from "@/shared/utils/naturalTTS";

interface FillBlankQuestion {
  id: number;
  sentenceBefore?: string;
  blankWord: string;
  sentenceAfter?: string;
  hint?: string;
  english?: string;
  explanation?: string;
}

interface FillBlankQuizCardProps {
  question: FillBlankQuestion;
  onAnswer: (correct: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

// Web Audio API Sound Generator for Instant Zero-Latency Game Effects
const playWinSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major Fanfare)
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.25);
    });
  } catch (e) {
    console.error("Audio not supported or blocked:", e);
  }
};

const playWrongSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Low double-pulse buzzer tone (Eee-Eaa!)
    [0, 0.15].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, ctx.currentTime + offset);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + offset + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + offset + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.12);
    });
  } catch (e) {
    console.error("Audio not supported or blocked:", e);
  }
};

const FillBlankQuizCard = memo(function FillBlankQuizCard({ question, onAnswer, questionNumber, totalQuestions }: FillBlankQuizCardProps) {
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect" | "revealed">("idle");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when question changes
  useEffect(() => {
    setUserInput("");
    setStatus("idle");
    setShake(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question.id]);

  const handleCharInsert = useCallback((char: string) => {
    if (status !== "idle" && status !== "incorrect") return;
    setUserInput((prev) => prev + char);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || status === "correct" || status === "revealed") return;

    const cleanedUser = userInput.trim().toLowerCase();
    const cleanedTarget = (question.blankWord || "").trim().toLowerCase();
    const isCorrect = cleanedUser === cleanedTarget;

    if (isCorrect) {
      setStatus("correct");
      playWinSound();
      onAnswer(true);
    } else {
      setStatus("incorrect");
      playWrongSound();
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }, [userInput, status, question.blankWord, onAnswer]);

  const handleReveal = useCallback(() => {
    setStatus("revealed");
    setUserInput(question.blankWord || "");
    playWrongSound();
    onAnswer(false);
  }, [question.blankWord, onAnswer]);

  const handleListen = useCallback(() => {
    try {
      const fullSentence = `${question.sentenceBefore || ""} ${question.blankWord || ""} ${question.sentenceAfter || ""}`.trim();
      playGermanAudio(fullSentence, 0.92);
    } catch (err) {
      console.error("Speech playback error:", err);
    }
  }, [question]);

  return (
    <div className={`bg-white rounded-2xl border border-zinc-200/80 shadow-lg p-6 sm:p-8 transition-all duration-300 ${
      shake ? "animate-pulse border-rose-400 ring-4 ring-rose-500/10" : ""
    }`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
        <span className="text-sm font-semibold text-zinc-600 tracking-wide bg-zinc-100 px-3 py-1 rounded-full">
          {questionNumber} of {totalQuestions}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleListen}
            className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-xs"
            title="Listen to full German sentence"
          >
            <span>🔊 Listen</span>
          </button>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-100/80 text-zinc-600 uppercase tracking-wider">
            {status === "correct" ? "🎉 Perfect!" : status === "revealed" ? "💡 Answer Revealed" : status === "incorrect" ? "❌ Try Again!" : "✍️ Type Missing Word"}
          </span>
        </div>
      </div>

      {/* Hint & English Translation */}
      <div className="mb-6">
        {question.hint && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-bold mb-3 border border-blue-100/80">
            <span>💡 Hint:</span>
            <span>{question.hint}</span>
          </div>
        )}
        {question.english && (
          <p className="text-md text-zinc-500 font-medium italic">
            🇺🇸 "{question.english}"
          </p>
        )}
      </div>

      {/* Sentence Fill-in Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-zinc-50 p-6 sm:p-8 rounded-xl border border-zinc-200/80 shadow-inner flex flex-wrap items-center justify-center gap-3 text-2xl font-extrabold text-zinc-900 text-center leading-relaxed">
          {question.sentenceBefore && <span>{question.sentenceBefore}</span>}
          <div className="relative inline-block w-full sm:w-auto min-w-[160px]">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                if (status === "incorrect") setStatus("idle");
              }}
              disabled={status === "correct" || status === "revealed"}
              placeholder="________"
              className={`w-full px-4 py-2 text-center text-2xl font-extrabold rounded-xl border-3 outline-none transition-all ${
                status === "correct"
                  ? "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-md ring-2 ring-emerald-500/30"
                  : status === "revealed"
                  ? "bg-amber-100 border-amber-500 text-amber-900"
                  : status === "incorrect"
                  ? "bg-rose-50 border-rose-500 text-rose-900 shadow-sm ring-2 ring-rose-500/20"
                  : "bg-white border-yellow-400 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-400/20 text-zinc-900 shadow-sm"
              }`}
            />
            {status === "correct" && (
              <span className="absolute -top-3 -right-2 bg-emerald-500 text-white rounded-full text-xs font-black px-2 py-0.5 shadow-sm animate-bounce">
                🎉 Correct!
              </span>
            )}
          </div>
          {question.sentenceAfter && <span>{question.sentenceAfter}</span>}
        </div>

        {/* Quick Keyboard Character Assistants */}
        {(status === "idle" || status === "incorrect") && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"].map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => handleCharInsert(char)}
                className="w-10 h-10 bg-white border border-zinc-200 rounded-lg font-extrabold text-lg text-zinc-700 hover:bg-yellow-50 hover:border-yellow-400 hover:text-zinc-900 transition-all shadow-xs active:scale-95"
              >
                {char}
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {(status === "idle" || status === "incorrect") && (
            <>
              <button
                type="submit"
                className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-md rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Check Answer 🚀
              </button>
              <button
                type="button"
                onClick={handleReveal}
                className="px-6 py-3 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-500 font-bold text-md rounded-xl transition-colors"
              >
                Reveal Answer 👁️
              </button>
            </>
          )}
          {status === "incorrect" && (
            <p className="w-full text-center text-rose-600 font-extrabold mt-2 animate-bounce">
              ❌ Not quite right! Double check the spelling or click Reveal.
            </p>
          )}
        </div>
      </form>

      {/* Explanation & Grammar Rules */}
      {(status === "correct" || status === "revealed") && (
        <div className={`p-4 rounded-xl border transition-all duration-500 ${
          status === "correct" ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" : "bg-amber-50/50 border-amber-200 text-amber-950"
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">💡</span>
            <div>
              <p className="font-bold text-sm mb-1 uppercase tracking-wide opacity-80">
                Grammar Breakdown & Explanation
              </p>
              <p className="text-md font-medium leading-relaxed">
                {question.explanation || `The correct missing grammar word is "${question.blankWord}".`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

FillBlankQuizCard.displayName = "FillBlankQuizCard";

export default FillBlankQuizCard;
