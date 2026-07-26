"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { vocabulary, getAllWords, EnrichedVocabularyWord } from "@/data/vocabulary";
import { playGermanAudio } from "@/shared/utils/naturalTTS";
import CountUp from "@/shared/components/CountUp";
import { hasStrictVisualIcon } from "@/shared/utils/semanticIcons";
import { logUserActivity } from "@/shared/components/Analytics/InterconnectedAnalyticsDashboard";

const LEVEL_FILTERS = ["ALL", "A1", "A2", "B1", "B2"];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type GraphicStyle = "hd-auto" | "3d" | "vector" | "emoji";

// Generate guaranteed high-definition 3D Icon, Vector SVG & Emoji graphic URLs
function getGuaranteedImageUrls(word: EnrichedVocabularyWord, style: GraphicStyle): string[] {
  if (style === "emoji") return []; // Instant pure native emoji mode

  const urls: string[] = [];

  // Extract proper hex Unicode code point for high-definition illustrations
  if (word.emoji && word.emoji.trim() !== "") {
    const chars = Array.from(word.emoji.trim());
    const primaryCp = chars[0]?.codePointAt(0)?.toString(16).toLowerCase();
    
    const fullCp = chars
      .map((c) => c.codePointAt(0)?.toString(16).toLowerCase())
      .filter((cp) => cp && cp !== "fe0f")
      .join("-");

    if (style === "hd-auto") {
      // SMART HD QUALITY PRIORITY: Automatically uses best available HD resolution (512px Noto WebP -> Twemoji SVG Vector -> Glossy Apple PNG)
      if (primaryCp) urls.push(`https://fonts.gstatic.com/s/e/notoemoji/latest/${primaryCp}/512.webp`);
      if (fullCp) urls.push(`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${fullCp}.svg`);
      if (fullCp) urls.push(`https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${fullCp}.png`);
      if (primaryCp) urls.push(`https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/${primaryCp.toUpperCase()}.svg`);
    } else if (style === "3d") {
      // Apple Glossy 3D Emojis via reliable jsDelivr datasource
      if (fullCp) urls.push(`https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${fullCp}.png`);
      if (primaryCp) urls.push(`https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${primaryCp}.png`);
      if (primaryCp) urls.push(`https://fonts.gstatic.com/s/e/notoemoji/latest/${primaryCp}/512.webp`);
      if (fullCp) urls.push(`https://cdn.jsdelivr.net/npm/emoji-datasource-google@15.0.1/img/google/64/${fullCp}.png`);
    } else if (style === "vector") {
      // Cloudflare CDN for Official Twemoji Vector SVGs & OpenMoji
      if (fullCp) urls.push(`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${fullCp}.svg`);
      if (primaryCp) urls.push(`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${primaryCp}.svg`);
      if (primaryCp) urls.push(`https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/${primaryCp.toUpperCase()}.svg`);
      if (fullCp) urls.push(`https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${fullCp}.png`);
    }
  }

  return urls.filter((url, index, self) => url && self.indexOf(url) === index);
}

interface VisualWordCardProps {
  word: EnrichedVocabularyWord;
  graphicStyle: GraphicStyle;
  isAnswered: boolean;
  isTarget: boolean;
  isSelected: boolean;
  onSelect: () => void;
  cardStyle: string;
}

function VisualWordCard({ word, graphicStyle, isAnswered, isTarget, isSelected, onSelect, cardStyle }: VisualWordCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imgFailed, setImgFailed] = useState(false);

  const imageUrls = useMemo(() => getGuaranteedImageUrls(word, graphicStyle), [word, graphicStyle]);
  const currentUrl = imageUrls[imgIndex];

  // Reset loading & index when word or style changes
  useEffect(() => {
    setImgIndex(0);
    setLoading(true);
    setImgFailed(false);
  }, [word.id, graphicStyle]);

  const handleImageError = () => {
    if (imgIndex < imageUrls.length - 1) {
      setImgIndex(prev => prev + 1);
      setLoading(true);
    } else {
      // All URLs exhausted; finalize with native emoji so it never displays an empty box
      setImgFailed(true);
      setLoading(false);
    }
  };

  const showRemoteImg = currentUrl && !imgFailed && graphicStyle !== "emoji";

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isAnswered}
      className={`p-3 sm:p-4 rounded-2xl transition-all duration-200 flex items-center justify-center min-h-[7.5rem] sm:min-h-[8.5rem] relative overflow-hidden group ${cardStyle}`}
    >
      {/* Pure Visual Image / Emoji / Vector Container with Zero Text! */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white/95 text-zinc-900 p-2 flex items-center justify-center shadow-md relative transform group-hover:scale-110 transition-transform duration-200 overflow-hidden border border-zinc-200">
        {/* Instantaneous High-Speed Emoji / Symbol displayed immediately with zero waiting time or when CDNs fallback */}
        <span className={`text-5xl sm:text-6xl select-none absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform filter drop-shadow-sm ${
          showRemoteImg && !loading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
          {word.emoji || "💡"}
        </span>

        {/* High-definition Vector SVG / Apple Emoji / Noto PNG glides in smoothly as it loads */}
        {showRemoteImg && (
          <img
            key={currentUrl}
            src={currentUrl}
            alt="German vocabulary illustration option"
            onLoad={() => {
              setLoading(false);
              setImgFailed(false);
            }}
            onError={handleImageError}
            className={`w-full h-full object-contain filter drop-shadow-sm transition-opacity duration-300 z-10 ${
              loading ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          />
        )}
      </div>

      {/* Status indicator badge on round finish */}
      {isAnswered && isTarget && (
        <span className="absolute top-2 right-2 text-sm bg-emerald-400 text-zinc-950 rounded-full w-6 h-6 flex items-center justify-center font-black shadow-md border border-white animate-bounce">
          ✓
        </span>
      )}
      {isAnswered && isSelected && !isTarget && (
        <span className="absolute top-2 right-2 text-sm bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-black shadow-md border border-white">
          ✕
        </span>
      )}
    </button>
  );
}

export default function BabadumGamePage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [audioOnlyMode, setAudioOnlyMode] = useState<boolean>(false);
  const [graphicStyle, setGraphicStyle] = useState<GraphicStyle>("hd-auto");
  const [targetWord, setTargetWord] = useState<EnrichedVocabularyWord | null>(null);
  const [options, setOptions] = useState<EnrichedVocabularyWord[]>([]);
  
  // Game State & Scoring
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [roundsPlayed, setRoundsPlayed] = useState<number>(0);

  // Filter vocabulary by chosen CEFR proficiency level & STRICT VISUAL VERIFICATION
  const validPool = useMemo(() => {
    let list = getAllWords() || [];
    if (selectedLevel !== "ALL") {
      list = list.filter((w) => {
        const cleanLevel = w.level?.replace("0/", "").trim().toUpperCase() || "A1";
        return cleanLevel.startsWith(selectedLevel);
      });
    }
    // STRICT CONTROL: Ensure words have translations and verified accurate concrete visuals
    const strictlyVerified = list.filter(w => w && w.german && w.english && hasStrictVisualIcon(w));
    return strictlyVerified.length >= 4 ? strictlyVerified : list.filter(w => w && w.german && w.english);
  }, [selectedLevel]);

  // Generate a new game round
  const startNewRound = useCallback(() => {
    if (!validPool || validPool.length < 4) return;
    
    // Pick target word
    const targetIdx = Math.floor(Math.random() * validPool.length);
    const newTarget = validPool[targetIdx];

    // Pick 3 distinct distractor words
    const distractors: EnrichedVocabularyWord[] = [];
    let attempts = 0;
    while (distractors.length < 3 && attempts < 50) {
      const candIdx = Math.floor(Math.random() * validPool.length);
      const cand = validPool[candIdx];
      if (
        cand.id !== newTarget.id && 
        cand.english !== newTarget.english && 
        !distractors.some(d => d.id === cand.id || d.english === cand.english)
      ) {
        distractors.push(cand);
      }
      attempts++;
    }

    // Fill with generic backup if pool was somehow constrained
    while (distractors.length < 3) {
      distractors.push({ id: -Math.floor(Math.random() * 1000000) - 1, german: "Wort", english: "Word", emoji: "🇩🇪", level: "A1" } as unknown as EnrichedVocabularyWord);
    }

    const shuffledOptions = shuffleArray([newTarget, ...distractors]);
    
    setTargetWord(newTarget);
    setOptions(shuffledOptions);
    setSelectedWordId(null);
    setIsAnswered(false);

    // Automatically pronounce native word upon beginning round
    setTimeout(() => {
      playGermanAudio(newTarget.german, 0.92);
    }, 150);
  }, [validPool]);

  // Initialize round on level change or startup
  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleOptionClick = (option: EnrichedVocabularyWord) => {
    if (isAnswered || !targetWord) return;
    
    setSelectedWordId(option.id || null);
    setIsAnswered(true);
    setRoundsPlayed(prev => prev + 1);

    const isCorrect = option.id === targetWord.id || option.english === targetWord.english;
    if (isCorrect) {
      setScore(prev => prev + 15);
      logUserActivity({
        type: "game",
        title: `Won BaBaDum Round: ${targetWord.german} (${targetWord.english})`,
        points: 15,
        level: (targetWord.level || "ALL") as "A1" | "A2" | "B1" | "B2" | "ALL",
        details: `Correct image match in level ${targetWord.level || "General"}.`,
      });
      setStreak(prev => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      // Speak triumphant repetition
      setTimeout(() => playGermanAudio(targetWord.german, 0.95), 200);
      
      // Advance to next round smoothly
      setTimeout(() => {
        startNewRound();
      }, 1400);
    } else {
      setStreak(0);
      // Give more time to inspect correct answer
      setTimeout(() => {
        startNewRound();
      }, 2300);
    }
  };

  if (!targetWord || options.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4 text-center">
        <span className="text-6xl animate-bounce mb-4">🎯</span>
        <h2 className="text-2xl font-black mb-2">Preparing BaBaDum Image Deck...</h2>
        <p className="text-sm font-medium text-zinc-400">Loading high-definition picture cards & native acoustics!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-zinc-900 to-zinc-950 text-white py-8 px-4 sm:px-6 relative overflow-hidden select-none">
      
      {/* Subtle background glow spheres */}
      <div className="absolute top-10 left-1/4 w-[28rem] h-[28rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto z-10 relative">
        
        {/* Top Navigation & Score Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg mb-6">
          <Link href="/games" className="inline-flex items-center gap-2 text-xs font-black text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
            <span>← Back to Games</span>
          </Link>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 shadow-2xs">
              <span>⚡ Score:</span>
              <span className="text-sm font-mono font-black text-white"><CountUp value={score} /> XP</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-orange-500/20 border border-orange-400/30 text-orange-300 font-extrabold text-xs flex items-center gap-1.5 shadow-2xs">
              <span>🔥 Streak:</span>
              <span className="text-sm font-mono font-black text-white">{streak}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 font-extrabold text-xs flex items-center gap-1.5 shadow-2xs hidden sm:flex">
              <span>🏆 Best:</span>
              <span className="text-sm font-mono font-black text-white">{bestStreak}</span>
            </div>
          </div>
        </div>

        {/* Level Filters & Picture Style Switchers */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-zinc-800/90 p-4 rounded-2xl border border-zinc-700 shadow-sm">
          
          {/* CEFR Level Deck Button Bar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider mr-1">CEFR Deck:</span>
            {LEVEL_FILTERS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => { setSelectedLevel(lvl); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedLevel === lvl
                    ? "bg-emerald-500 text-zinc-950 shadow-md scale-105"
                    : "bg-zinc-700/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {lvl === "ALL" ? "🌟 All Levels" : `Level ${lvl}`}
              </button>
            ))}
          </div>

          {/* Enjoyable Graphic Style Selector (HD Best, 3D, Vector, or Emoji!) */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-700 shadow-sm flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 px-2 select-none">Style:</span>
            <button
              type="button"
              onClick={() => setGraphicStyle("hd-auto")}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                graphicStyle === "hd-auto" ? "bg-gradient-to-r from-amber-400 to-emerald-400 text-zinc-950 shadow-sm scale-105 font-extrabold" : "text-zinc-400 hover:text-white"
              }`}
              title="Automatically select the sharpest HD resolution artwork available (512px WebP / SVG Vector)"
            >
              <span>✨ HD Best Quality</span>
            </button>
            <button
              type="button"
              onClick={() => setGraphicStyle("3d")}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                graphicStyle === "3d" ? "bg-amber-500 text-zinc-950 shadow-sm scale-105" : "text-zinc-400 hover:text-white"
              }`}
              title="Vibrant 3D-style Google Noto graphic illustrations"
            >
              <span>🌟 3D Icon</span>
            </button>
            <button
              type="button"
              onClick={() => setGraphicStyle("vector")}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                graphicStyle === "vector" ? "bg-emerald-500 text-zinc-950 shadow-sm scale-105" : "text-zinc-400 hover:text-white"
              }`}
              title="Clean 2D Twemoji Vector artwork"
            >
              <span>🎨 Vector Image</span>
            </button>
            <button
              type="button"
              onClick={() => setGraphicStyle("emoji")}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                graphicStyle === "emoji" ? "bg-indigo-500 text-white shadow-sm scale-105" : "text-zinc-400 hover:text-white"
              }`}
              title="Instant zero-latency jumbo native system Emojis"
            >
              <span>⚡ Pure Emoji</span>
            </button>
          </div>
        </div>

        {/* TARGET WORD BANNER WITH INLINE TEXT + AUDIO TOGGLE */}
        <div className="text-center my-8 transition-all animate__animated animate__fadeIn">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block mb-2">
            Round #{roundsPlayed + 1} • Tap the Matching Picture Card
          </span>

          <div className="flex items-center justify-center my-2.5">
            {!audioOnlyMode ? (
              <div className="inline-flex flex-col items-center justify-center gap-2 bg-zinc-800/95 border-2 border-emerald-500/60 shadow-lg px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl backdrop-blur-xl">
                <span className="text-xs font-extrabold text-amber-300 bg-amber-500/20 px-3 py-0.5 rounded-full uppercase tracking-wide border border-amber-400/30">
                  Concept: {targetWord.english}
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap mt-0.5">
                  {targetWord.article && (
                    <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono select-none uppercase tracking-tight">
                      {targetWord.article}
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                    {targetWord.german}
                  </h1>
                  <button
                    type="button"
                    onClick={() => playGermanAudio(targetWord.german, 0.92)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 flex items-center justify-center shadow-sm transition-all transform hover:scale-110 ml-1"
                    title="Listen to native audio again"
                  >
                    <span className="text-lg">🔊</span>
                  </button>
                </div>

                {/* Text + Audio Mode Toggle Inside Word Box */}
                <button
                  type="button"
                  onClick={() => setAudioOnlyMode(true)}
                  title="Switch to Audio Only mode for native acoustic listening challenges"
                  className="px-3 py-1 rounded-lg text-[11px] font-black bg-zinc-700/80 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all border border-zinc-600 shadow-2xs flex items-center gap-1.5"
                >
                  <span>👁️ Text + Audio (Click to hide German text)</span>
                </button>
              </div>
            ) : (
              <div className="inline-flex flex-col items-center justify-center gap-2 bg-indigo-950/90 border-2 border-indigo-400/80 shadow-lg px-6 sm:px-7 py-4 rounded-2xl backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => playGermanAudio(targetWord.german, 0.92)}
                  className="w-14 h-14 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white flex items-center justify-center shadow-md transition-all transform hover:scale-105 animate-bounce mb-0.5"
                >
                  <span className="text-2xl">🎧</span>
                </button>
                <span className="text-[11px] sm:text-xs font-extrabold text-indigo-200 uppercase tracking-wider">
                  Listen & Tap Matching Picture
                </span>

                {/* Audio Only Toggle Inside Word Box */}
                <button
                  type="button"
                  onClick={() => setAudioOnlyMode(false)}
                  title="Switch back to displaying written German text and audio"
                  className="mt-0.5 px-3 py-1 rounded-lg text-[11px] font-black bg-indigo-600 text-white hover:bg-indigo-500 transition-all border border-indigo-400 shadow-sm flex items-center gap-1.5 animate-pulse"
                >
                  <span>🎧 Audio Only (Click to reveal text)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4-OPTION VISUAL BABADUM GRID WITH RELEVANT IMAGES (Ultra-Compact Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 my-5 max-w-lg mx-auto">
          {options.map((opt) => {
            const isSelected = selectedWordId === opt.id;
            const isTarget = opt.id === targetWord.id || opt.english === targetWord.english;
            
            let cardStyle = "bg-zinc-800/95 border-2 border-zinc-700 hover:border-emerald-400 hover:bg-zinc-800 text-zinc-100 shadow-xl hover:shadow-2xl transform hover:-translate-y-1.5";
            
            if (isAnswered) {
              if (isTarget) {
                // Winning Card in Green!
                cardStyle = "bg-emerald-600/95 text-white border-2 border-emerald-300 scale-105 shadow-2xl z-20 animate__animated animate__pulse";
              } else if (isSelected && !isTarget) {
                // Wrong Card Selected in Red!
                cardStyle = "bg-rose-600/95 text-white border-2 border-rose-300 opacity-95 scale-95 animate__animated animate__shakeX";
              } else {
                // Unselected wrong option dimming
                cardStyle = "bg-zinc-900/50 border-2 border-zinc-800/80 text-zinc-500 opacity-30 pointer-events-none";
              }
            }

            return (
              <VisualWordCard
                key={opt.id || opt.english}
                word={opt}
                graphicStyle={graphicStyle}
                isAnswered={isAnswered}
                isTarget={isTarget}
                isSelected={isSelected}
                onSelect={() => handleOptionClick(opt)}
                cardStyle={cardStyle}
              />
            );
          })}
        </div>

        {/* Bottom Game Tip Ribbon */}
        <div className="text-center mt-14 text-xs font-bold text-zinc-500 max-w-lg mx-auto bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800/80">
          💡 <span className="text-zinc-400 font-extrabold">BaBaDum Science:</span> Tying native auditory input directly to illustrated image cards accelerates semantic memory encoding!
        </div>

      </div>
    </div>
  );
}
