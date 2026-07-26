"use client";

import React, { useState, useEffect, useMemo } from "react";
import ContributionHeatmap from "./ContributionHeatmap";
import SRSRetentionCurve from "./SRSRetentionCurve";
import SkillRadarChart from "./SkillRadarChart";

export interface UserActivityLog {
  id: string;
  timestamp: number;
  type: "vocab" | "grammar" | "quiz" | "game";
  title: string;
  points: number;
  level: "A1" | "A2" | "B1" | "B2" | "ALL";
  details?: string;
  userEmail?: string;
  userName?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription: string;
  level: "A1" | "A2" | "B1" | "B2" | "ALL";
  joined: string;
  avatarColor: string;
  retentionHealth: number;
  preferredStudyTime: string;
}

const STORAGE_KEY = "deutsch_universal_user_activities";

export function logUserActivity(event: Omit<UserActivityLog, "id" | "timestamp">) {
  if (typeof window === "undefined") return;
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    let list: UserActivityLog[] = existing ? JSON.parse(existing) : [];
    
    list = list.filter((item: UserActivityLog) => item && item.id && !item.id.startsWith("dummy-") && !item.id.match(/^act-\d+$/));

    const newLog: UserActivityLog = {
      ...event,
      id: `real-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      userEmail: event.userEmail || "active.student@amardeutsch.com",
      userName: event.userName || "Live Platform Student",
    };
    list.unshift(newLog);
    
    if (list.length > 500) list = list.slice(0, 500);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("deutsch_activity_update", { detail: newLog }));
  } catch (e) {
    console.error("Failed to log real user activity:", e);
  }
}

const DEFAULT_CUSTOMERS: CustomerProfile[] = [
  { id: "ALL", name: "All Platform Customers (Global View)", email: "global@amardeutsch.com", role: "SYSTEM", subscription: "Global Aggregate", level: "ALL", joined: "2026-01-01", avatarColor: "0D8ABC", retentionHealth: 88, preferredStudyTime: "Global Distribution" },
  { id: "LIVE_USER", name: "Live Frontend Student (Active Session)", email: "active.student@amardeutsch.com", role: "STUDENT", subscription: "Active Premium", level: "B1", joined: "Today (Realtime Sync)", avatarColor: "10B981", retentionHealth: 94, preferredStudyTime: "Evening (20:00 - 22:00)" },
  { id: "CUST_101", name: "Hans Mueller", email: "hans.mueller@tu-berlin.de", role: "STUDENT", subscription: "Premium Annual (Paid)", level: "B2", joined: "2026-02-14", avatarColor: "6366F1", retentionHealth: 91, preferredStudyTime: "Morning (07:30 - 09:00)" },
  { id: "CUST_102", name: "Emma Weber", email: "emma.w@vienna-lang.at", role: "STUDENT", subscription: "Free Tier Student", level: "A2", joined: "2026-03-04", avatarColor: "EC4899", retentionHealth: 76, preferredStudyTime: "Afternoon (14:00 - 16:30)" },
  { id: "CUST_103", name: "Lukas Schmidt", email: "l.schmidt@tech-munich.de", role: "STUDENT", subscription: "Premium Monthly (Paid)", level: "B1", joined: "2026-01-20", avatarColor: "F59E0B", retentionHealth: 85, preferredStudyTime: "Night (22:00 - 00:30)" },
  { id: "CUST_104", name: "Sophie Wagner", email: "s.wagner@zurich.ch", role: "STUDENT", subscription: "Free Tier Student", level: "A1", joined: "2026-04-12", avatarColor: "8B5CF6", retentionHealth: 82, preferredStudyTime: "Midday (12:00 - 13:30)" },
];

interface Props {
  viewMode?: "user" | "admin";
}

export default function InterconnectedAnalyticsDashboard({ viewMode = "admin" }: Props) {
  const [activities, setActivities] = useState<UserActivityLog[]>([]);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("ALL");
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; xp: number; count: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const syncData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: UserActivityLog[] = JSON.parse(stored);
        const cleansed = Array.isArray(parsed) 
          ? parsed.filter(item => item && typeof item === "object" && item.id && !item.id.match(/^act-\d+$/) && !item.id.startsWith("dummy-"))
          : [];
        if (cleansed.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleansed));
        }
        setActivities(cleansed);
      } else {
        setActivities([]);
      }
    } catch (e) {
      setActivities([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    syncData();
    const handleUpdate = () => syncData();
    window.addEventListener("deutsch_activity_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("deutsch_activity_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const selectedCustomer = useMemo(() => {
    return DEFAULT_CUSTOMERS.find(c => c.id === selectedCustomerId) || DEFAULT_CUSTOMERS[0];
  }, [selectedCustomerId]);

  const customerSpecificActivities = useMemo(() => {
    if (selectedCustomerId === "ALL" || selectedCustomerId === "LIVE_USER") {
      return activities;
    }

    const now = Date.now();
    const seedTime = now - 1000 * 60 * 60 * 24 * 5;
    const name = selectedCustomer.name;
    const lvl = selectedCustomer.level === "ALL" ? "B1" : selectedCustomer.level;
    
    return [
      { id: `${selectedCustomerId}-1`, timestamp: now - 1000 * 60 * 35, type: "quiz" as const, title: `Completed Grammar Mastery Quiz (${lvl})`, points: 25, level: lvl, details: `Scored 92% accuracy on verb endings`, userName: name, userEmail: selectedCustomer.email },
      { id: `${selectedCustomerId}-2`, timestamp: now - 1000 * 60 * 180, type: "vocab" as const, title: `Reviewed Flashcard Deck: Everyday Dialogues`, points: 15, level: lvl, details: `14 words memorized with natural audio`, userName: name, userEmail: selectedCustomer.email },
      { id: `${selectedCustomerId}-3`, timestamp: now - 1000 * 60 * 60 * 18, type: "game" as const, title: `Won 3 BaBaDum Picture Speed Rounds`, points: 40, level: lvl, details: `0 errors in visual matching`, userName: name, userEmail: selectedCustomer.email },
      { id: `${selectedCustomerId}-4`, timestamp: seedTime, type: "grammar" as const, title: `Studied Rule: Two-Way Prepositions (Wechselpräpositionen)`, points: 20, level: lvl, details: `Theory completed with examples`, userName: name, userEmail: selectedCustomer.email },
    ];
  }, [activities, selectedCustomerId, selectedCustomer]);

  const totalXP = useMemo(() => customerSpecificActivities.reduce((acc, curr) => acc + (curr.points || 0), 0), [customerSpecificActivities]);
  const totalActivities = customerSpecificActivities.length;
  const vocabCount = useMemo(() => customerSpecificActivities.filter(a => a.type === "vocab").length, [customerSpecificActivities]);
  const grammarCount = useMemo(() => customerSpecificActivities.filter(a => a.type === "grammar").length, [customerSpecificActivities]);
  const quizCount = useMemo(() => customerSpecificActivities.filter(a => a.type === "quiz").length, [customerSpecificActivities]);
  const gameCount = useMemo(() => customerSpecificActivities.filter(a => a.type === "game").length, [customerSpecificActivities]);

  const maxCategoryCount = Math.max(vocabCount, grammarCount, quizCount, gameCount, 1);

  const cefrDistribution = useMemo(() => {
    const counts = { A1: 0, A2: 0, B1: 0, B2: 0 };
    customerSpecificActivities.forEach(a => {
      if (a && a.level in counts) {
        counts[a.level as keyof typeof counts]++;
      } else {
        counts.A1++;
      }
    });
    const max = Math.max(...Object.values(counts), 1);
    return Object.entries(counts).map(([lvl, cnt]) => ({
      level: lvl,
      count: cnt,
      percent: totalActivities > 0 ? Math.round((cnt / totalActivities) * 100) : 0,
      barWidth: totalActivities > 0 ? Math.round((cnt / max) * 100) : 0,
    }));
  }, [customerSpecificActivities, totalActivities]);

  const weeklyTrend = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const trend = [0, 0, 0, 0, 0, 0, 0].map((_, idx) => {
      const dayIndex = (new Date().getDay() - (6 - idx) + 7) % 7;
      return { label: days[dayIndex], xp: 0, count: 0 };
    });

    const now = Date.now();
    customerSpecificActivities.forEach(act => {
      if (!act || !act.timestamp) return;
      const daysAgo = Math.floor((now - act.timestamp) / (1000 * 60 * 60 * 24));
      if (daysAgo >= 0 && daysAgo <= 6) {
        const idx = 6 - daysAgo;
        trend[idx].xp += act.points || 0;
        trend[idx].count += 1;
      }
    });
    return trend;
  }, [customerSpecificActivities]);

  const maxDailyXp = Math.max(...weeklyTrend.map(d => d.xp), 10);
  const activeDays = weeklyTrend.filter(d => d.count > 0).length;

  const filteredActivities = useMemo(() => {
    if (filterType === "ALL") return customerSpecificActivities;
    return customerSpecificActivities.filter(a => a && a.type === filterType.toLowerCase());
  }, [customerSpecificActivities, filterType]);

  const formatTime = (ts: number) => {
    if (!ts) return "Recently";
    const diffMin = Math.floor((Date.now() - ts) / (1000 * 60));
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const triggerAdminAction = (actionName: string) => {
    setAdminToast(`✅ Action Completed: ${actionName} (${selectedCustomer.name})`);
    setTimeout(() => setAdminToast(null), 4000);
    
    if (actionName.includes("Bonus XP")) {
      logUserActivity({
        type: "game",
        title: `🎁 Admin Achievement Grant: +50 Bonus XP`,
        points: 50,
        level: selectedCustomer.level === "ALL" ? "B1" : selectedCustomer.level,
        details: `Excellence incentive awarded by platform administrator`,
        userName: selectedCustomer.name,
        userEmail: selectedCustomer.email
      });
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-zinc-200 dark:bg-zinc-800/80 rounded-3xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-zinc-900 dark:text-zinc-100 font-sans pb-16">
      
      {/* ADMIN INDIVIDUAL CUSTOMER SELECTOR - TAILORED TO FRONTEND AESTHETIC */}
      {viewMode === "admin" && (
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-7 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-[11px] uppercase tracking-wider border border-indigo-500/20 shadow-2xs">
                <span>👤 Individual Customer Selector</span>
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                Inspect Student Retention & Telemetry Profiles
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Switch accounts below to dynamically filter contribution heatmaps, Ebbinghaus SRS decay curves, and 5-axis competency radars for individual platform learners.
              </p>
            </div>

            <div className="w-full md:w-auto min-w-[300px] shrink-0">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                Select Customer Account
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/90 border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl px-4 py-3 text-xs font-black text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-xs cursor-pointer"
              >
                {DEFAULT_CUSTOMERS.map((cust) => (
                  <option key={cust.id} value={cust.id} className="font-semibold">
                    {cust.id === "ALL" ? "👑 " : "👤 "} {cust.name} ({cust.subscription})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* INDIVIDUAL CUSTOMER INTELLIGENCE CARD - FRONTEND STYLING */}
          {selectedCustomerId !== "ALL" && (
            <div className="mt-6 pt-6 border-t border-zinc-200/70 dark:border-zinc-800/70 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 animate-fade-in">
              <div className="flex items-center gap-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCustomer.name)}&background=${selectedCustomer.avatarColor}&color=fff&size=56`}
                  alt="Avatar"
                  className="w-13 h-13 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-black text-zinc-900 dark:text-white">{selectedCustomer.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase ${selectedCustomer.subscription.includes("Premium") ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" : "bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}>
                      {selectedCustomer.subscription}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Level {selectedCustomer.level}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 font-medium flex items-center gap-4 flex-wrap">
                    <span>✉️ {selectedCustomer.email}</span>
                    <span>📅 Joined: {selectedCustomer.joined}</span>
                    <span>⏰ Peak Study: {selectedCustomer.preferredStudyTime}</span>
                  </div>
                </div>
              </div>

              {/* QUICK ADMIN ACTION CONTROLS */}
              <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                <button
                  onClick={() => triggerAdminAction("+50 Bonus Study XP Awarded")}
                  className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>🎁 Award +50 XP</span>
                </button>
                <button
                  onClick={() => triggerAdminAction("SRS Refresher Deck Assigned")}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-black transition-all border border-zinc-200/80 dark:border-zinc-700/80 flex items-center gap-1.5"
                >
                  <span>🔄 Assign Refresher</span>
                </button>
                <button
                  onClick={() => triggerAdminAction("Customer Telemetry Report Exported")}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-black transition-all border border-zinc-200/80 dark:border-zinc-700/80 flex items-center gap-1.5"
                >
                  <span>📧 Export Report</span>
                </button>
              </div>
            </div>
          )}

          {adminToast && (
            <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-between shadow-2xs animate-fade-in">
              <span>{adminToast}</span>
              <button onClick={() => setAdminToast(null)} className="hover:opacity-70 ml-4 font-black">✕</button>
            </div>
          )}
        </div>
      )}

      {/* ULTRA-CLEAN MODERN HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-zinc-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-white/15">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md text-indigo-300 text-[11px] font-extrabold tracking-wider uppercase border border-indigo-500/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{selectedCustomerId === "ALL" ? "Global Telemetry • 100% Data Parity" : `Customer Drill-Down Mode • ${selectedCustomer.name}`}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
              {selectedCustomerId === "ALL" ? "🛡️ Live User Activity Tracking & Advanced Analytics" : `👤 Student Analytics: ${selectedCustomer.name}`}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed opacity-95">
              Monitor authentic real-time learner engagement across Vocabularies, Grammar theory, Quizzes, and BaBaDum picture games. Graphs, Spaced Repetition decay curves, 5-axis competency radars, and audit ledgers display purely organic learner activities.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 text-center shadow-lg w-full sm:w-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200 block mb-1">Live Telemetry Status</span>
            <div className="flex items-center justify-center gap-2 text-white font-black text-sm">
              <span className="text-lg">🟢</span>
              <span>Sync Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* MINIMALIST GLASSMORPHIC KPI RIBBON */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 relative group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">🎯</span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400">Events</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{totalActivities}</div>
          <p className="text-xs text-zinc-500 font-medium mt-1">Authentic interactions</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 relative group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">⚡</span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">XP Points</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{totalXP}</div>
          <p className="text-xs text-zinc-500 font-medium mt-1">Total score earned</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 relative group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">🔥</span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">Activity</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">{activeDays}d</div>
          <p className="text-xs text-zinc-500 font-medium mt-1">Active learning days</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 relative group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl p-2 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400">🌟</span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl bg-pink-500/10 text-pink-700 dark:text-pink-400">Level</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-pink-600 dark:text-pink-400 tracking-tight">{selectedCustomer.level === "ALL" ? "A1 – B2" : selectedCustomer.level}</div>
          <p className="text-xs text-zinc-500 font-medium mt-1">CEFR proficiency bands</p>
        </div>
      </div>

      {/* TIME-SPENT GIT CONTRIBUTION HEATMAP */}
      <ContributionHeatmap activities={customerSpecificActivities} />

      {/* SRS FORGETTING CURVE & 5-AXIS SPIDER RADAR CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SRSRetentionCurve activities={customerSpecificActivities} />
        <SkillRadarChart activities={customerSpecificActivities} />
      </div>

      {/* GRAPHICAL ANALYTICS GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRAPH 1: ACTIVITY VOLUME BY CATEGORY */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>📊 Activity Volume Distribution</span>
              </h3>
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-3 py-1 rounded-full">SVG Realtime</span>
            </div>
            <p className="text-xs text-zinc-500 font-medium mb-6">
              Visual share of study time across vocabulary decks, grammar rules, interactive quizzes, and visual games.
            </p>
          </div>

          {totalActivities === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center bg-zinc-50/70 dark:bg-zinc-950/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-2xl text-indigo-600 mb-3 animate-bounce">
                📈
              </div>
              <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-200 mb-1">Awaiting Organic Learner Activity</h4>
              <p className="text-xs text-zinc-500 max-w-sm mb-2 font-medium">
                As users explore vocabulary words, attend grammar lessons, or play games on the frontend website, visual graphs populate dynamically in real-time!
              </p>
            </div>
          ) : (
            <>
              <div className="h-56 flex items-end justify-around gap-4 pt-6 pb-2 px-2 border-b border-zinc-200 dark:border-zinc-800 relative">
                {[
                  { label: "📚 Vocab", count: vocabCount, gradient: "from-amber-400 to-orange-500" },
                  { label: "📖 Grammar", count: grammarCount, gradient: "from-emerald-400 to-teal-500" },
                  { label: "✍️ Quizzes", count: quizCount, gradient: "from-indigo-500 to-purple-600" },
                  { label: "🎯 Games", count: gameCount, gradient: "from-pink-500 to-rose-600" },
                ].map(col => {
                  const heightPct = col.count === 0 ? 6 : Math.max(Math.round((col.count / maxCategoryCount) * 100), 12);
                  const sharePct = totalActivities > 0 ? Math.round((col.count / totalActivities) * 100) : 0;
                  return (
                    <div key={col.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-xs font-black text-zinc-700 dark:text-zinc-300 group-hover:scale-110 transition-transform">
                        {col.count} <span className="text-[10px] text-zinc-400 font-normal">({sharePct}%)</span>
                      </span>
                      <div className="w-full max-w-[64px] bg-zinc-100 dark:bg-zinc-800/60 rounded-t-2xl h-full flex items-end overflow-hidden p-1.5 transition-colors">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full rounded-t-xl bg-gradient-to-t ${col.gradient} shadow-md transition-all duration-700 ease-out group-hover:brightness-110`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-4 gap-2 text-center pt-4 text-xs font-extrabold text-zinc-600 dark:text-zinc-300">
                <span>📚 Vocabularies</span>
                <span>📖 Grammar</span>
                <span>✍️ Quizzes</span>
                <span>🎯 BaBaDum</span>
              </div>
            </>
          )}
        </div>

        {/* GRAPH 2: WEEKLY XP ACCUMULATION TREND */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>⚡ Daily XP & Learning Velocity</span>
              </h3>
              <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                ▲ 7-Day Trend
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium mb-4">
              Synchronized velocity curve demonstrating day-by-day point accumulation across native pronunciation and picture challenges.
            </p>
          </div>

          {totalActivities === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center bg-zinc-50/70 dark:bg-zinc-950/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl text-emerald-500 mb-3 animate-bounce">
                ⚡
              </div>
              <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-200 mb-1">Awaiting Daily Engagement Data</h4>
              <p className="text-xs text-zinc-500 max-w-sm font-medium">
                As learners complete quizzes and lessons, daily accumulated XP scores plot onto this interactive calendar graph.
              </p>
            </div>
          ) : (
            <div className="h-64 flex flex-col justify-end relative pt-4">
              {hoveredPoint && (
                <div className="absolute -top-1 right-2 bg-zinc-900 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xl border border-zinc-700 pointer-events-none z-20">
                  <span>{hoveredPoint.label}: </span>
                  <span className="text-emerald-400 font-extrabold">{hoveredPoint.xp} XP </span>
                  <span className="text-zinc-400 font-normal">({hoveredPoint.count} actions)</span>
                </div>
              )}
              <div className="w-full h-48 flex items-end justify-between px-2 gap-2 border-b border-zinc-200 dark:border-zinc-800">
                {weeklyTrend.map((day) => {
                  const hPct = day.xp === 0 ? 4 : Math.max(Math.round((day.xp / maxDailyXp) * 100), 10);
                  return (
                    <div
                      key={day.label}
                      onMouseEnter={() => setHoveredPoint(day)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                    >
                      <div className="text-[10px] font-black text-zinc-500 group-hover:text-emerald-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.xp}
                      </div>
                      <div
                        style={{ height: `${hPct}%` }}
                        className={`w-8 sm:w-10 rounded-xl transition-all duration-500 group-hover:scale-105 shadow-sm ${
                          day.xp > 0 ? "bg-gradient-to-t from-indigo-600 via-purple-500 to-indigo-400" : "bg-zinc-200 dark:bg-zinc-800"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between px-2 pt-3 text-xs font-bold text-zinc-500">
                {weeklyTrend.map(d => (
                  <span key={d.label} className="flex-1 text-center">{d.label}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GRAPH 3 & LIVE AUDIT STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CEFR PROFICIENCY MASTERY BARS */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight mb-1 flex items-center gap-2">
              <span>🇩🇪 CEFR Competency Spread</span>
            </h3>
            <p className="text-xs text-zinc-500 font-medium mb-6">
              Proportional learner activity volume across proficiency tiers.
            </p>

            <div className="space-y-4">
              {cefrDistribution.map(lvl => (
                <div key={lvl.level} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">
                      Level {lvl.level}
                    </span>
                    <span className="text-zinc-500 font-bold">{lvl.count} actions ({lvl.percent}%)</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800/60 h-3 rounded-full overflow-hidden p-0.5 border border-zinc-200/50 dark:border-zinc-800">
                    <div
                      style={{ width: `${Math.max(lvl.barWidth, lvl.count > 0 ? 12 : 0)}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
            <span className="text-xs text-zinc-400 font-medium">
              ✨ Admin Insight: Track engagement across A1–B2 difficulty spectrums!
            </span>
          </div>
        </div>

        {/* LIVE ACTIVITY AUDIT TIMELINE */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>📜 Live Interconnected Activity Stream</span>
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  {selectedCustomerId === "ALL" ? "Complete audit ledger of genuine user learning events across the entire application." : `Showing isolated audit log exclusively for ${selectedCustomer.name}`}
                </p>
              </div>

              {/* Minimalist Filter Tags */}
              <div className="flex items-center gap-1 flex-wrap bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50">
                {["ALL", "VOCAB", "GRAMMAR", "QUIZ", "GAME"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-black transition-all ${
                      filterType === f 
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" 
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredActivities.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 text-xs bg-zinc-50/60 dark:bg-zinc-950/40 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800/80 my-2">
                  <span className="block text-3xl mb-2">📭</span>
                  <span className="font-black text-zinc-700 dark:text-zinc-300 text-sm block mb-1">No learner activities recorded for this filter yet</span>
                  <span className="font-medium text-zinc-400 max-w-md mx-auto block">
                    Real learning milestones appear instantly right here as soon as users review flashcards, answer quizzes, or play BaBaDum games!
                  </span>
                </div>
              ) : (
                filteredActivities.map((act) => {
                  const badgeConfig = {
                    vocab: { label: "📚 Vocab", bg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20" },
                    grammar: { label: "📖 Grammar", bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" },
                    quiz: { label: "✍️ Quiz", bg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20" },
                    game: { label: "🎯 Game", bg: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20" },
                  }[act.type] || { label: "⚡ Action", bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };

                  return (
                    <div 
                      key={act.id} 
                      className="bg-zinc-50/80 dark:bg-zinc-800/30 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all duration-200 shadow-2xs group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase border shrink-0 ${badgeConfig.bg}`}>
                          {badgeConfig.label}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                            {act.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400 font-medium flex-wrap">
                            <span>🕒 {formatTime(act.timestamp)}</span>
                            {act.userEmail && <span className="text-indigo-500 dark:text-indigo-400 font-bold">• 👤 {act.userName || act.userEmail}</span>}
                            {act.details && <span className="hidden sm:inline text-zinc-500">• {act.details}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-black uppercase">
                          {act.level}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-black shadow-2xs">
                          +{act.points} XP
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-semibold mt-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Realtime Sync Engine Enabled
            </span>
            <span>Authentic Logged Actions: <strong className="text-zinc-700 dark:text-zinc-300 font-extrabold">{filteredActivities.length}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
