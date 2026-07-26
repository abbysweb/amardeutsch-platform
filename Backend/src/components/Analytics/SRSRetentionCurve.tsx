"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { UserActivityLog } from "./InterconnectedAnalyticsDashboard";

interface Props {
  activities: UserActivityLog[];
}

export default function SRSRetentionCurve({ activities }: Props) {
  const [activeTab, setActiveTab] = useState<"curve" | "queue">("curve");

  const { avgRetention, retentionState, refresherQueue, curvePoints } = useMemo(() => {
    const vocabAndGrammar = activities.filter((a) => a.type === "vocab" || a.type === "grammar" || a.type === "game");

    const now = Date.now();
    let totalRetention = 0;
    const itemsWithRetention: Array<{ item: UserActivityLog; retention: number; daysAgo: number }> = [];

    vocabAndGrammar.forEach((item) => {
      const daysAgo = Math.max((now - item.timestamp) / (1000 * 60 * 60 * 24), 0);
      let retention = Math.round(Math.exp(-daysAgo / 14.0) * 100);
      if (retention < 20) retention = 20;
      
      totalRetention += retention;
      itemsWithRetention.push({ item, retention, daysAgo: Math.round(daysAgo * 10) / 10 });
    });

    const avg = vocabAndGrammar.length > 0 ? Math.round(totalRetention / vocabAndGrammar.length) : 100;
    
    let state = { label: "Optimal Memory", color: "text-emerald-500", bg: "bg-emerald-500/10", badge: "🟢 High Recall" };
    if (avg < 80) state = { label: "Stable Retention", color: "text-amber-500", bg: "bg-amber-500/10", badge: "🟡 Medium Recall" };
    if (avg < 60) state = { label: "Needs Refresher", color: "text-rose-500", bg: "bg-rose-500/10", badge: "🔴 Rapid Decay" };

    const queue = [...itemsWithRetention].sort((a, b) => a.retention - b.retention).slice(0, 4);

    const pts = [0, 2, 5, 8, 12, 16, 20].map((d) => {
      const r = Math.round(Math.exp(-d / 14.0) * 100);
      return { day: `Day ${d}`, pct: r };
    });

    return { avgRetention: avg, retentionState: state, refresherQueue: queue, curvePoints: pts };
  }, [activities]);

  return (
    <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight">
                🧠 Spaced Repetition (SRS) Retention Curve
              </h3>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 ${retentionState.bg} ${retentionState.color}`}>
                {retentionState.badge}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Admin diagnostics: Scientific memory stability model calculated directly from timestamped user logs.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 text-[10px] font-black shrink-0">
            <button
              onClick={() => setActiveTab("curve")}
              className={`px-3 py-1 rounded-xl transition-all ${activeTab === "curve" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs" : "text-zinc-500"}`}
            >
              📉 Memory Curve
            </button>
            <button
              onClick={() => setActiveTab("queue")}
              className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === "queue" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs" : "text-zinc-500"}`}
            >
              <span>⚠️ Refresher Queue</span>
              {refresherQueue.length > 0 && (
                <span className="bg-rose-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black animate-pulse">
                  {refresherQueue.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "curve" ? (
          <div className="pt-2">
            <div className="flex items-end justify-between gap-3 mb-2 px-1">
              <div>
                <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{avgRetention}%</span>
                <span className="text-xs font-extrabold text-zinc-500 ml-2">Estimated Average Recall</span>
              </div>
              <div className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                Optimal Review Threshold: ~80%
              </div>
            </div>

            {/* SVG MEMORY RETENTION CURVE */}
            <div className="h-48 w-full relative pt-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <div className="w-full h-36 flex items-end justify-between px-2 gap-2">
                {curvePoints.map((pt, idx) => {
                  const hPct = pt.pct;
                  const isCurrentState = Math.abs(pt.pct - avgRetention) <= 10;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      <div className="text-[10px] font-black text-zinc-500 group-hover:text-amber-500 mb-1 opacity-80 transition-colors">
                        {pt.pct}%
                      </div>
                      <div
                        style={{ height: `${hPct}%` }}
                        className={`w-8 sm:w-12 rounded-xl transition-all duration-700 ease-out group-hover:scale-105 shadow-sm relative overflow-hidden ${
                          isCurrentState
                            ? "bg-gradient-to-t from-amber-500 to-amber-300 ring-2 ring-amber-400/80 shadow-md animate-pulse"
                            : "bg-gradient-to-t from-zinc-700 to-zinc-500 dark:from-zinc-800 dark:to-zinc-700"
                        }`}
                      />
                      {isCurrentState && (
                        <span className="absolute -bottom-6 text-[9px] font-black text-amber-500 uppercase tracking-tight whitespace-nowrap">
                          ▲ Current State
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between px-2 pt-6 text-xs font-bold text-zinc-400">
                {curvePoints.map((p) => (
                  <span key={p.day} className="flex-1 text-center">{p.day}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* TAB: REFRESHER QUEUE */
          <div className="space-y-3 pt-2">
            {refresherQueue.length === 0 ? (
              <div className="p-10 text-center text-zinc-500 text-xs bg-zinc-50/60 dark:bg-zinc-950/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <span className="block text-2xl mb-1">🛡️</span>
                <span className="font-extrabold text-zinc-700 dark:text-zinc-300 text-sm block">Memory Vault Perfect!</span>
                <span className="font-medium text-zinc-400 block max-w-sm mx-auto mt-1">
                  No degraded vocabulary cards or forgotten grammar theory detected in user logs.
                </span>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {refresherQueue.map(({ item, retention, daysAgo }) => (
                  <div key={item.id} className="bg-zinc-50/90 dark:bg-zinc-800/40 p-3.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h5 className="text-xs font-black text-zinc-900 dark:text-white truncate">{item.title}</h5>
                      <p className="text-[11px] text-zinc-400 font-medium">Last user interaction {daysAgo} day{daysAgo !== 1 ? "s" : ""} ago • {item.level}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${retention}%` }} className={`h-full rounded-full ${retention > 70 ? "bg-emerald-500" : "bg-amber-500"}`} />
                      </div>
                      <span className="text-xs font-black w-9 text-right text-zinc-700 dark:text-zinc-300">{retention}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-bold text-zinc-400 mt-4">
        <span>🧪 Ebbinghaus Spaced Repetition Active</span>
        <span>Target Study Rhythm: Every 48 Hours</span>
      </div>
    </div>
  );
}
