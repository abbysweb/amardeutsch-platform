"use client";

import { useState, memo, useCallback, useEffect } from "react";

interface QuizQuestion {
  id: number;
  question: string;
  english?: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuizCardProps {
  question: QuizQuestion;
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
    console.error("Audio not supported or blocked by browser:", e);
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
    console.error("Audio not supported or blocked by browser:", e);
  }
};

const QuizCard = memo(function QuizCard({ question, onAnswer, questionNumber, totalQuestions }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);

  // Reset state when switching to a new question
  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setShake(false);
  }, [question.id]);

  const handleSelect = useCallback((index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    const isCorrect = index === question.correctIndex;
    
    if (isCorrect) {
      playWinSound();
    } else {
      playWrongSound();
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }

    onAnswer(isCorrect);
  }, [answered, onAnswer, question.correctIndex]);

  const getOptionStyle = useCallback((index: number) => {
    if (!answered) {
      return selected === index
        ? "border-yellow-400 bg-yellow-50/80 shadow-md ring-2 ring-yellow-400/20"
        : "border-zinc-200/80 bg-white hover:border-zinc-300 hover:bg-zinc-50/50 hover:shadow-sm";
    }
    if (index === question.correctIndex) {
      return "border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-md ring-2 ring-emerald-500/30";
    }
    if (index === selected && index !== question.correctIndex) {
      return "border-rose-500 bg-rose-50/90 text-rose-900 shadow-sm ring-2 ring-rose-500/20";
    }
    return "border-zinc-200/50 bg-zinc-50/50 opacity-40";
  }, [answered, selected, question.correctIndex]);

  const getBadgeStyle = useCallback((index: number) => {
    if (!answered) {
      return "bg-zinc-100 border border-zinc-200/80 text-zinc-700 group-hover:bg-zinc-200/80 group-hover:text-zinc-900";
    }
    if (index === question.correctIndex) {
      return "bg-emerald-500 border border-emerald-600 text-white font-bold shadow-xs";
    }
    if (index === selected && index !== question.correctIndex) {
      return "bg-rose-500 border border-rose-600 text-white font-bold";
    }
    return "bg-zinc-100 border border-zinc-200 text-zinc-400";
  }, [answered, selected, question.correctIndex]);

  return (
    <div className={`bg-white rounded-2xl border border-zinc-200/80 shadow-lg p-6 sm:p-8 transition-all duration-300 ${shake ? "animate-pulse border-rose-400 ring-4 ring-rose-500/10" : ""}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
        <span className="text-sm font-semibold text-zinc-600 tracking-wide bg-zinc-100 px-3 py-1 rounded-full">
          {questionNumber} of {totalQuestions}
        </span>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-100/80 text-zinc-600 uppercase tracking-wider">
          {answered ? (selected === question.correctIndex ? "🎉 Correct Answer!" : "❌ Incorrect Selection") : "Select Option A, B, C, or D"}
        </span>
      </div>

      {/* Question Title & Translation */}
      <div className="mb-8">
        <h3 className="text-2xl font-extrabold text-zinc-900 leading-tight mb-2 tracking-tight">
          {question.question}
        </h3>
        {question.english && (
          <p className="text-md text-zinc-500 font-medium">
            🇺🇸 {question.english}
          </p>
        )}
      </div>

      {/* Options Grid with A B C D Badging */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D...
          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={answered}
              className={`group flex items-center gap-4 text-left p-4 rounded-xl border-2 transition-all duration-200 relative ${getOptionStyle(index)}`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-md font-bold transition-colors shrink-0 ${getBadgeStyle(index)}`}>
                {answered && index === question.correctIndex ? "✓" : (answered && index === selected && index !== question.correctIndex ? "✕" : letter)}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs text-zinc-400 font-semibold mb-0.5 uppercase tracking-wider block sm:hidden">
                  Option {letter}
                </span>
                <span className="text-lg font-bold truncate">
                  {option}
                </span>
              </div>
              {answered && index === question.correctIndex && (
                <span className="text-emerald-600 font-extrabold text-sm ml-auto animate-bounce">
                  🎉 Winner!
                </span>
              )}
              {answered && index === selected && index !== question.correctIndex && (
                <span className="text-rose-600 font-bold text-sm ml-auto">
                  ❌ Wrong
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {answered && (
        <div className={`mt-8 p-4 rounded-xl border transition-all duration-500 ${
          selected === question.correctIndex ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" : "bg-rose-50/50 border-rose-200 text-rose-950"
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">💡</span>
            <div>
              <p className="font-bold text-sm mb-1 uppercase tracking-wide opacity-80">
                Grammar Breakdown & Explanation
              </p>
              <p className="text-md font-medium leading-relaxed">
                {question.explanation || `The correct answer is Option ${String.fromCharCode(65 + question.correctIndex)} (${question.options[question.correctIndex]}).`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

QuizCard.displayName = "QuizCard";

export default QuizCard;