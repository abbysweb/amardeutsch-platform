"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { vocabulary, EnrichedVocabularyWord } from "@/data/vocabulary";
import { LEVEL_LABEL, getLevelColor } from "@/levels/config";
import { playGermanAudio } from "@/shared/utils/naturalTTS";

function pickRandom<T>(arr: T[]): T {
  if (!arr || arr.length === 0) return {} as T;
  return arr[Math.floor(Math.random() * arr.length)];
}

function speak(text: string) {
  playGermanAudio(text, 0.92);
}

const TIMER_OPTIONS = [5, 10, 15, 20, 30, 60];
const LEVEL_FILTERS = ["ALL", "A1", "A2", "B1", "B2"];

export default function RandomWordPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [secondsTotal, setSecondsTotal] = useState(30);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [paused, setPaused] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [xpEarnedForCurrentWord, setXpEarnedForCurrentWord] = useState(false);

  // Filter vocabulary by chosen CEFR proficiency level
  const levelVocabulary = useMemo(() => {
    if (selectedLevel === "ALL") return vocabulary;
    return vocabulary.filter((w) => {
      const cleanLevel = w.level?.replace("0/", "").trim().toUpperCase() || "A1";
      return cleanLevel.startsWith(selectedLevel);
    });
  }, [selectedLevel]);

  const [word, setWord] = useState<EnrichedVocabularyWord>(() => pickRandom(levelVocabulary || []));

  const nextWord = useCallback(() => {
    if (levelVocabulary.length === 0) return;
    let next = pickRandom(levelVocabulary);
    let attempts = 0;
    while (next?.id === word?.id && levelVocabulary.length > 1 && attempts < 10) {
      next = pickRandom(levelVocabulary);
      attempts++;
    }
    setWord(next);
    setSecondsLeft(secondsTotal);
    setXpEarnedForCurrentWord(false);
  }, [word, secondsTotal, levelVocabulary]);

  // When selected level changes, pick a new word from that level deck
  useEffect(() => {
    if (levelVocabulary.length > 0) {
      setWord(pickRandom(levelVocabulary));
      setSecondsLeft(secondsTotal);
      setXpEarnedForCurrentWord(false);
    }
  }, [selectedLevel, levelVocabulary, secondsTotal]);

  useEffect(() => {
    setSecondsLeft(secondsTotal);
  }, [secondsTotal]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          nextWord();
          return secondsTotal;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [nextWord, secondsTotal, paused]);

  const handleEarnXp = () => {
    if (!xpEarnedForCurrentWord) {
      setSessionXp((prev) => prev + 10);
      setXpEarnedForCurrentWord(true);
    }
  };

  if (!vocabulary || vocabulary.length === 0) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 bg-zinc-50 text-center">
        <span className="text-5xl mb-4 animate-bounce">⏳</span>
        <h2 className="text-2xl font-black text-zinc-800 mb-2">Initializing 3NF Vocabulary Lexicon...</h2>
        <p className="text-sm font-bold text-zinc-500 mb-6">Synchronizing thousands of words from central database!</p>
      </div>
    );
  }

  return (
    <div className="min-h-[88vh] bg-gradient-to-b from-amber-50/70 via-zinc-100 to-zinc-50 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Glow Backgrounds */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        
        {/* Header Title Banner */}
        <div className="text-center mb-8">
          {sessionXp > 0 && (
            <div className="inline-flex items-center gap-2 bg-emerald-500 text-white font-black px-3 py-1 rounded-full text-xs shadow-2xs mb-3 animate__animated animate__bounceIn">
              <span>⚡ +{sessionXp} XP Session Score</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight mb-2">
            Random Word Arena 🎲
          </h1>
          <p className="text-sm font-medium text-zinc-600 max-w-xl mx-auto">
            Practice rapid German recall and assimilate authentic vocabulary with timed rotation!
          </p>
        </div>

        {/* CEFR Level Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mr-1">Deck Filter:</span>
          {LEVEL_FILTERS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all transform hover:scale-105 shadow-2xs border ${
                selectedLevel === lvl
                  ? "bg-zinc-900 text-white border-zinc-800 shadow-md"
                  : "bg-white text-zinc-600 border-zinc-200/80 hover:border-amber-400 hover:text-zinc-900"
              }`}
            >
              {lvl === "ALL" ? `🌟 All Levels (${vocabulary.length})` : `🎓 Level ${lvl}`}
            </button>
          ))}
        </div>

        {/* Timer & Play/Pause Control Ribbon */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-zinc-200 shadow-sm flex items-center justify-between gap-3 mb-6 flex-wrap max-w-3xl mx-auto">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wide mr-1">Interval:</span>
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => { setSecondsTotal(t); setPaused(false); }}
                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-colors ${
                  secondsTotal === t && !paused
                    ? "bg-amber-400 text-zinc-950 shadow-2xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {t}s
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className={`text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg ${secondsLeft <= 5 ? "bg-red-100 text-red-700 animate-pulse" : "bg-zinc-100 text-zinc-700"}`}>
              ⏱️ {paused ? "Paused (∞)" : `${secondsLeft}s remaining`}
            </span>
            <button
              onClick={() => setPaused(!paused)}
              title={paused ? "Resume automated timer" : "Pause timer"}
              className={`px-3.5 py-1 rounded-xl text-xs font-black transition-all border ${
                paused
                  ? "bg-red-500 text-white border-red-600 shadow-sm animate-pulse"
                  : "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200"
              }`}
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
          </div>
        </div>

        {/* MAIN WORD CHALLENGE CARD */}
        {word && word.german ? (
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-amber-300/80 p-5 sm:p-7 relative overflow-hidden text-center transition-all duration-300 hover:shadow-amber-500/10 max-w-[39rem] mx-auto mb-14">
            
            {/* Glowing Top Rainbow Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-emerald-500" />

            {/* Card Badges (Level & Category) */}
            <div className="mb-4 flex items-center justify-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-xs font-black shadow-2xs border border-current/20 ${getLevelColor(word.level)} bg-zinc-50`}>
                {word.level} • {LEVEL_LABEL[word.level] || LEVEL_LABEL[word.level.replace("0/", "")] || "Core German"}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-zinc-100 text-zinc-600 border border-zinc-200 shadow-2xs">
                🏷️ {word.category || "Vocabulary"}
              </span>
              {word.article && (
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs">
                  Article: <strong className="uppercase font-mono font-black">{word.article}</strong>
                </span>
              )}
              {word.emoji && (
                <span className="text-base sm:text-lg" title="Semantic icon">{word.emoji}</span>
              )}
            </div>

            {/* German Word Display */}
            <div className="my-4">
              <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
                {word.article && (
                  <span className="text-2xl sm:text-3xl font-extrabold text-zinc-400 font-mono tracking-tight select-none">
                    {word.article}
                  </span>
                )}
                <h2 className="text-3xl sm:text-[2.75rem] font-black text-zinc-900 tracking-tight drop-shadow-2xs">
                  {word.german}
                </h2>
                <button
                  type="button"
                  onClick={() => speak(word.german)}
                  className="w-9 h-9 rounded-2xl bg-amber-100 hover:bg-amber-200 active:scale-95 transition-all text-amber-700 flex items-center justify-center shadow-sm transform hover:scale-105"
                  title="Listen to native pronunciation"
                >
                  <span className="text-lg">🔊</span>
                </button>
                <span 
                  title="Word drill countdown timer" 
                  className={`ml-1 inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded text-zinc-500 bg-zinc-100 border border-zinc-200/70`}
                >
                  <span>⏱️ {paused ? "Paused" : `${secondsLeft}s`}</span>
                </span>
              </div>

              {word.ipa && (
                <p className="text-[11px] font-extrabold text-amber-700 font-mono tracking-wider mb-1">
                  Pronunciation: {word.ipa}
                </p>
              )}

              {word.plural && (
                <p className="text-[11px] font-bold text-zinc-400 font-mono mt-0.5 mb-2">
                  Plural form: <span className="text-zinc-600 font-sans font-extrabold">{word.plural}</span>
                </p>
              )}

              {/* Left-to-Right Animated Progress Bar Below Word */}
              <div className="w-56 sm:w-64 h-2 bg-zinc-100 rounded-full mx-auto my-3.5 overflow-hidden border border-zinc-200 shadow-inner" title="Time progression until next word">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-emerald-500 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${paused ? 100 : Math.min(100, ((secondsTotal - secondsLeft) / secondsTotal) * 100)}%` }}
                />
              </div>

              {/* Automatic English Translation Display */}
              <div className="mt-4 pt-4 border-t border-zinc-100 max-w-xs mx-auto">
                <div className="py-2 px-4 bg-emerald-500/15 border-2 border-emerald-400/60 rounded-2xl text-center shadow-2xs">
                  <span className="block text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-0.5">
                    English Translation:
                  </span>
                  <span className="text-lg sm:text-xl font-black text-emerald-950">
                    {word.english}
                  </span>
                </div>
              </div>
            </div>

            {/* Context Sentence Example */}
            {word.example && (
              <div className="mt-5 bg-gradient-to-br from-amber-50 via-amber-100/50 to-yellow-50 border-2 border-amber-300/80 rounded-3xl p-4 sm:p-5 shadow-md text-center transition-all">
                <div className="flex items-center justify-between mb-2.5 border-b border-amber-200/80 pb-2">
                  <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>💬 Authentic Sentence Example</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => speak(word.example)}
                    className="text-[11px] text-amber-950 bg-amber-300 hover:bg-amber-400 active:scale-95 px-2.5 py-1 rounded-xl font-black transition-all transform hover:scale-105 flex items-center gap-1 shadow-xs"
                    title="Listen to sentence"
                  >
                    <span>Listen</span>
                    <span className="text-xs animate-pulse">🔊</span>
                  </button>
                </div>

                <div className="py-1.5">
                  <p className="text-base sm:text-2xl font-black text-zinc-900 tracking-tight leading-snug drop-shadow-2xs">
                    &quot;{word.example}&quot;
                  </p>
                  {word.exampleEn && (
                    <p className="text-xs sm:text-base font-extrabold text-amber-950/85 mt-2 tracking-wide">
                      {word.exampleEn}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Grammar or Cultural Tip */}
            {word.tip && (
              <div className="mt-3.5 p-3 rounded-xl bg-purple-50 border border-purple-200 text-left text-xs font-bold text-purple-900 shadow-2xs">
                💡 <span className="uppercase tracking-wider font-black">Grammar Tip:</span> {word.tip}
              </div>
            )}

            {/* Animated Countdown Bar */}
            <div className="mt-5">
              {!paused ? (
                <div className="w-full bg-zinc-200/80 rounded-full h-1.5 overflow-hidden shadow-2xs">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-orange-500 to-green-500 h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(secondsLeft / secondsTotal) * 100}%` }}
                  />
                </div>
              ) : (
                <div className="w-full bg-red-100 text-red-700 rounded-full py-1 text-[10px] font-black tracking-wider uppercase text-center border border-red-200">
                  ⏸ Timer Paused • Click Resume when ready
                </div>
              )}
            </div>

            {/* Action Buttons & XP Gamification */}
            <div className="mt-5 flex flex-col sm:flex-row gap-2.5 justify-center">
              {!xpEarnedForCurrentWord ? (
                <button
                  type="button"
                  onClick={handleEarnXp}
                  className="py-2.5 px-5 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                >
                  <span>I Knew This Word! (+10 XP) ⚡</span>
                </button>
              ) : (
                <div className="py-2.5 px-5 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-1.5 animate__animated animate__bounceIn shadow-xs">
                  <span>🎉 +10 XP Added to your daily score!</span>
                </div>
              )}

              <button
                type="button"
                onClick={nextWord}
                className="py-2.5 px-5 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-zinc-950 font-black rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-1.5"
              >
                <span>Next Random Word ⏭️</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-zinc-200 shadow-sm mb-16">
            <span className="text-5xl mb-3 block">📭</span>
            <h3 className="text-xl font-black text-zinc-800">No matching words found in this deck</h3>
            <button onClick={() => setSelectedLevel("ALL")} className="mt-4 px-6 py-2.5 bg-amber-400 font-bold rounded-xl text-xs">Reset Deck</button>
          </div>
        )}

      </div>
    </div>
  );
}
