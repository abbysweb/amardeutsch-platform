"use client";

import React, { useState, useMemo } from "react";
import { UserActivityLog } from "./InterconnectedAnalyticsDashboard";

interface Props {
  activities: UserActivityLog[];
}

interface SkillAxis {
  label: string;
  icon: string;
  score: number; // 0 to 100
  description: string;
  advice: string;
}

export default function SkillRadarChart({ activities }: Props) {
  const [hoveredAxis, setHoveredAxis] = useState<SkillAxis | null>(null);

  const skills = useMemo<SkillAxis[]>(() => {
    const vocabActs = activities.filter(a => a.type === "vocab");
    const grammarActs = activities.filter(a => a.type === "grammar");
    const quizActs = activities.filter(a => a.type === "quiz");
    const gameActs = activities.filter(a => a.type === "game");
    const b1b2Acts = activities.filter(a => a.level === "B1" || a.level === "B2");

    // Real dynamic scoring (capped between starter baseline 15 and max 100)
    const nounScore = Math.min(Math.round(15 + vocabActs.length * 10), 100);
    const caseScore = Math.min(Math.round(15 + grammarActs.length * 15), 100);
    const audioScore = Math.min(Math.round(20 + (vocabActs.length + gameActs.length) * 8), 100);
    const visualScore = Math.min(Math.round(15 + gameActs.length * 18), 100);
    const syntaxScore = Math.min(Math.round(15 + (quizActs.length * 12) + (b1b2Acts.length * 15)), 100);

    return [
      {
        label: "Noun Genders & Articles",
        icon: "📚",
        score: activities.length === 0 ? 0 : nounScore,
        description: "Mastery of Der/Die/Das definite articles and plural noun inflections.",
        advice: "Study A1 & A2 vocabulary cards to boost article recall speed.",
      },
      {
        label: "Case Government & Prepositions",
        icon: "🔄",
        score: activities.length === 0 ? 0 : caseScore,
        description: "Accurate usage of Akkusativ, Dativ, and two-way prepositions (Wechselpräpositionen).",
        advice: "Complete German grammar theory topics and case quizzes.",
      },
      {
        label: "Natural Acoustics & Listening",
        icon: "🗣️",
        score: activities.length === 0 ? 0 : audioScore,
        description: "Listening comprehension and native TTS pronunciation familiarity.",
        advice: "Listen to word pronunciations when flipping flashcards.",
      },
      {
        label: "Visual Recognition & Speed",
        icon: "⚡",
        score: activities.length === 0 ? 0 : visualScore,
        description: "Rapid mapping between high-definition imagery and native German terminology.",
        advice: "Play BaBaDum picture matching rounds to train split-second visual recall.",
      },
      {
        label: "Complex Sentence Syntax",
        icon: "📖",
        score: activities.length === 0 ? 0 : syntaxScore,
        description: "Subordinating conjunctions (weil, dass, obwohl) and verb position mastery.",
        advice: "Attend B1 and B2 quizzes to solidify sentence architecture.",
      },
    ];
  }, [activities]);

  // Geometry computation for 5-axis SVG spider web
  const size = 260;
  const center = size / 2;
  const radius = 96; // max web radius
  const angleStep = (Math.PI * 2) / skills.length;
  const startAngle = -Math.PI / 2; // start at noon

  // Generate web concentric polygon loops
  const webLoops = [0.25, 0.5, 0.75, 1.0].map((scale) => {
    const points = skills.map((_, i) => {
      const angle = startAngle + i * angleStep;
      const x = center + Math.cos(angle) * (radius * scale);
      const y = center + Math.sin(angle) * (radius * scale);
      return `${x},${y}`;
    });
    return points.join(" ");
  });

  // Calculate user skill polygon coordinates
  const userPolygonPoints = skills.map((s, i) => {
    const angle = startAngle + i * angleStep;
    // When 0 activities, show a minimal inner dot at scale 0.05 so animation transitions smoothly
    const scaledScore = activities.length === 0 ? 0.05 : s.score / 100.0;
    const x = center + Math.cos(angle) * (radius * scaledScore);
    const y = center + Math.sin(angle) * (radius * scaledScore);
    return { x, y, skill: s, pointStr: `${x},${y}` };
  });

  const polygonSvgString = userPolygonPoints.map(p => p.pointStr).join(" ");

  // Axis label positions (slightly outside max radius)
  const axisLabels = skills.map((s, i) => {
    const angle = startAngle + i * angleStep;
    const labelRadius = radius + 24;
    const x = center + Math.cos(angle) * labelRadius;
    const y = center + Math.sin(angle) * labelRadius;
    return { x, y, skill: s };
  });

  return (
    <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>🕸️ Linguistic Competency Radar Web</span>
          </h3>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            5-Axis SVG Spider
          </span>
        </div>
        <p className="text-xs text-zinc-500 font-medium mb-6">
          Multi-dimensional proficiency spectrum calculated directly from real grammar, vocabulary, audio, and visual game milestones.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* SVG RADAR WEB CONTAINER */}
          <div className="flex items-center justify-center py-2 relative select-none">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
              
              {/* Concentric grid webs */}
              {webLoops.map((pts, i) => (
                <polygon
                  key={i}
                  points={pts}
                  fill="none"
                  stroke="currentColor"
                  className="text-zinc-200 dark:text-zinc-800 stroke-[1.5]"
                />
              ))}

              {/* Spokes connecting center to vertices */}
              {skills.map((_, i) => {
                const angle = startAngle + i * angleStep;
                const x = center + Math.cos(angle) * radius;
                const y = center + Math.sin(angle) * radius;
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="currentColor"
                    className="text-zinc-200 dark:text-zinc-800 stroke-1"
                  />
                );
              })}

              {/* User Skill Polygon Fill & Outline */}
              {activities.length > 0 && (
                <>
                  <polygon
                    points={polygonSvgString}
                    className="fill-emerald-500/25 stroke-emerald-500 dark:stroke-emerald-400 stroke-2 transition-all duration-700 ease-out drop-shadow-md"
                  />
                  {/* Interactive Vertex Circles */}
                  {userPolygonPoints.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r="6"
                      onMouseEnter={() => setHoveredAxis(p.skill)}
                      onMouseLeave={() => setHoveredAxis(null)}
                      className="fill-amber-400 stroke-zinc-950 stroke-2 cursor-pointer hover:scale-150 transition-all shadow-lg"
                    />
                  ))}
                </>
              )}

              {/* Axis Icon Labels */}
              {axisLabels.map((lbl, idx) => (
                <g 
                  key={idx} 
                  transform={`translate(${lbl.x}, ${lbl.y})`} 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredAxis(lbl.skill)}
                  onMouseLeave={() => setHoveredAxis(null)}
                >
                  <circle cx="0" cy="0" r="15" className="fill-zinc-100 dark:fill-zinc-800 stroke-zinc-200 dark:stroke-zinc-700 transition-colors group-hover:fill-amber-400/20" />
                  <text x="0" y="4" textAnchor="middle" className="text-xs select-none">
                    {lbl.skill.icon}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* INTERACTIVE COMPETENCY BREAKDOWN & TOOLTIP CARD */}
          <div className="space-y-4">
            {hoveredAxis ? (
              <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white p-5 rounded-2xl border border-amber-500/30 shadow-xl animate-fade-in space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{hoveredAxis.icon}</span>
                  <span className="text-xs font-black text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    Score: {hoveredAxis.score} / 100
                  </span>
                </div>
                <h4 className="text-sm font-black tracking-tight text-white">{hoveredAxis.label}</h4>
                <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">{hoveredAxis.description}</p>
                <div className="pt-2 border-t border-zinc-800 text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>💡 Tip: {hoveredAxis.advice}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {skills.map((s, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredAxis(s)}
                    onMouseLeave={() => setHoveredAxis(null)}
                    className="bg-zinc-50/80 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{s.icon}</span>
                      <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 truncate group-hover:text-indigo-500 transition-colors">
                        {s.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${s.score}%` }} className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-700" />
                      </div>
                      <span className="text-[11px] font-black text-zinc-600 dark:text-zinc-300 w-8 text-right">{s.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-bold text-zinc-400 mt-4">
        <span>🔄 Synchronous 5-Axis Spider Web Active</span>
        <span>Hover over vertices for targeted guidance</span>
      </div>
    </div>
  );
}
