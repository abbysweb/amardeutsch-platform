"use client";

import React, { useState, useMemo } from "react";
import { UserActivityLog } from "./InterconnectedAnalyticsDashboard";

interface Props {
  activities: UserActivityLog[];
}

export default function ContributionHeatmap({ activities }: Props) {
  const [hoveredDay, setHoveredDay] = useState<{ dateStr: string; xp: number; count: number } | null>(null);
  const [timeRange, setTimeRange] = useState<"180" | "365">("180");

  const { weeks, totalDaysActive, maxDayXp } = useMemo(() => {
    const totalDays = parseInt(timeRange, 10);
    const numWeeks = Math.ceil(totalDays / 7);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const dayMap = new Map<string, { xp: number; count: number }>();
    activities.forEach((act) => {
      const d = new Date(act.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const prev = dayMap.get(key) || { xp: 0, count: 0 };
      dayMap.set(key, { xp: prev.xp + (act.points || 0), count: prev.count + 1 });
    });

    let activeCount = 0;
    let maxXp = 0;
    const generatedWeeks = [];

    // Construct from oldest week to newest week
    for (let w = numWeeks - 1; w >= 0; w--) {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const dayOffset = w * 7 + (6 - i);
        const targetDate = new Date(today.getTime() - dayOffset * 24 * 60 * 60 * 1000);
        const dateStr = targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const key = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;
        
        const data = dayMap.get(key) || { xp: 0, count: 0 };
        if (data.count > 0) activeCount++;
        if (data.xp > maxXp) maxXp = data.xp;

        weekDays.push({
          dateStr,
          key,
          xp: data.xp,
          count: data.count,
          dayOfWeek: targetDate.getDay(),
        });
      }
      generatedWeeks.push(weekDays);
    }

    return { weeks: generatedWeeks, totalDaysActive: activeCount, maxDayXp: Math.max(maxXp, 1) };
  }, [activities, timeRange]);

  const getDayColor = (xp: number) => {
    if (xp === 0) return "bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-700";
    if (xp <= 20) return "bg-emerald-300 dark:bg-emerald-900/80 text-zinc-950";
    if (xp <= 60) return "bg-emerald-400 dark:bg-emerald-700";
    if (xp <= 120) return "bg-emerald-500 dark:bg-emerald-600 font-bold";
    return "bg-emerald-600 dark:bg-emerald-500 shadow-xs ring-1 ring-emerald-400/50";
  };

  return (
    <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>⏳ Git-Style Contribution & Study Heatmap</span>
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              Daily learning consistency and XP accumulation across your genuine activity ledger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-xl text-[10px] font-black">
              <button
                onClick={() => setTimeRange("180")}
                className={`px-2.5 py-1 rounded-lg transition-all ${timeRange === "180" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs" : "text-zinc-500"}`}
              >
                Past 6 Months
              </button>
              <button
                onClick={() => setTimeRange("365")}
                className={`px-2.5 py-1 rounded-lg transition-all ${timeRange === "365" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs" : "text-zinc-500"}`}
              >
                Past 1 Year
              </button>
            </div>
          </div>
        </div>

        {/* HEATMAP CONTAINER */}
        <div className="relative overflow-x-auto pb-2 pt-4">
          {hoveredDay && (
            <div className="sticky left-0 right-0 mx-auto w-fit -top-2 bg-zinc-950 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold shadow-xl border border-zinc-700 mb-3 animate-fade-in flex items-center gap-2 z-20">
              <span className="text-amber-400 font-black">📅 {hoveredDay.dateStr}:</span>
              {hoveredDay.xp > 0 ? (
                <>
                  <span className="text-emerald-400 font-black">{hoveredDay.xp} XP</span>
                  <span className="text-zinc-400 font-normal">({hoveredDay.count} activities logged)</span>
                </>
              ) : (
                <span className="text-zinc-400 font-normal">No learning activity recorded on this day.</span>
              )}
            </div>
          )}

          <div className="flex gap-1.5 min-w-[600px]">
            {weeks.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-1.5">
                {week.map((day) => (
                  <div
                    key={day.key}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-3.5 h-3.5 rounded-md transition-all duration-200 cursor-pointer ${getDayColor(day.xp)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HEATMAP LEGEND & SUMMARY FOOTER */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-zinc-500">
        <div className="flex items-center gap-2">
          <span>Active Streak Count: <strong className="text-emerald-600 dark:text-emerald-400 font-black">{totalDaysActive} Days</strong></span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span>Max Daily Output: <strong className="text-zinc-700 dark:text-zinc-300 font-extrabold">{maxDayXp} XP</strong></span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
          <span>Less</span>
          <span className="w-3 h-3 rounded bg-zinc-100 dark:bg-zinc-800/60 inline-block" />
          <span className="w-3 h-3 rounded bg-emerald-300 dark:bg-emerald-900/80 inline-block" />
          <span className="w-3 h-3 rounded bg-emerald-400 dark:bg-emerald-700 inline-block" />
          <span className="w-3 h-3 rounded bg-emerald-500 dark:bg-emerald-600 inline-block" />
          <span className="w-3 h-3 rounded bg-emerald-600 dark:bg-emerald-500 inline-block" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
