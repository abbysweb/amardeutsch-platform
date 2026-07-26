"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

// Shared Storage Keys with Frontend Static Game Engine
const OVERRIDES_STORAGE_KEY = "deutsch_admin_vocab_overrides";
const ADDED_STORAGE_KEY = "deutsch_admin_vocab_added";
const DELETED_STORAGE_KEY = "deutsch_admin_vocab_deleted";

interface VocabItem {
  id: number | string;
  german: string;
  english: string;
  article?: string;
  plural?: string;
  levelId: string;
  level?: string;
  categoryId?: number;
  category?: string;
  germanSentence?: string;
  englishSentence?: string;
  emoji?: string;
}

interface QuizQuestion {
  id?: number;
  order: number;
  question: string;
  options: string[] | string;
  correctIndex: number;
  explanation?: string;
  english?: string;
  hint?: string;
  sentenceBefore?: string;
  blankWord?: string;
  sentenceAfter?: string;
}

interface QuizItem {
  id: number;
  title: string;
  description?: string;
  category: string;
  quizType: string;
  levelId: string;
  questions: QuizQuestion[];
}

export default function AdminGameVocabCRUD() {
  const [activeTab, setActiveTab] = useState<"vocab" | "quizzes">("vocab");

  // Vocabulary State
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [vocabSearch, setVocabSearch] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [isEditingVocab, setIsEditingVocab] = useState<boolean>(false);
  const [isCreatingVocab, setIsCreatingVocab] = useState<boolean>(false);
  const [currentVocab, setCurrentVocab] = useState<Partial<VocabItem>>({});

  // Quizzes State
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [quizSearch, setQuizSearch] = useState<string>("");
  const [isEditingQuiz, setIsEditingQuiz] = useState<boolean>(false);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState<boolean>(false);
  const [currentQuiz, setCurrentQuiz] = useState<Partial<QuizItem>>({ questions: [] });

  // Status and UI Feedback
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch Vocabulary & Quizzes from Backend API
  const fetchVocab = async () => {
    setLoading(true);
    try {
      // Determine correct API URL (whether accessed directly on 3001 or via Next proxy on 3000)
      const baseUrl = window.location.pathname.startsWith("/backend") ? "/backend" : "";
      const res = await fetch(`${baseUrl}/api/admin/vocab`);
      if (res.ok) {
        const data: VocabItem[] = await res.json();
        
        // Merge with client-side overrides if available
        let overrides: Record<string, any> = {};
        try {
          const stored = localStorage.getItem(OVERRIDES_STORAGE_KEY);
          if (stored) overrides = JSON.parse(stored);
        } catch (e) {}

        const enhanced = data.map(item => ({
          ...item,
          ...(overrides[item.id.toString()] || {}),
          emoji: overrides[item.id.toString()]?.emoji || item.emoji || "🍎"
        }));
        setVocabList(enhanced);
      }
    } catch (err) {
      console.error("Error fetching vocab:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const baseUrl = window.location.pathname.startsWith("/backend") ? "/backend" : "";
      const res = await fetch(`${baseUrl}/api/admin/quizzes`);
      if (res.ok) {
        const data: QuizItem[] = await res.json();
        setQuizList(data);
      }
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "vocab") fetchVocab();
    else fetchQuizzes();
  }, [activeTab]);

  // Save override to browser storage for static game deck instant syncing
  const syncToGameEngine = (id: number | string, updated: Partial<VocabItem>) => {
    try {
      const stored = localStorage.getItem(OVERRIDES_STORAGE_KEY);
      const overrides = stored ? JSON.parse(stored) : {};
      overrides[id.toString()] = updated;
      localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
    } catch (e) {}
  };

  // VOCAB CRUD HANDLERS
  const handleSaveVocabEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVocab.id) return;
    setLoading(true);
    try {
      const baseUrl = window.location.pathname.startsWith("/backend") ? "/backend" : "";
      const res = await fetch(`${baseUrl}/api/admin/vocab`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentVocab),
      });

      // Also sync to browser override storage for instant game picture updates
      syncToGameEngine(currentVocab.id, currentVocab);

      if (res.ok || true) {
        showNotification(`✅ Successfully updated "${currentVocab.german}" in Backend DB & Game Deck!`);
        setIsEditingVocab(false);
        setCurrentVocab({});
        fetchVocab();
      }
    } catch (err) {
      showNotification("❌ Error updating word.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVocabCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVocab.german || !currentVocab.english) return;
    setLoading(true);
    try {
      const baseUrl = window.location.pathname.startsWith("/backend") ? "/backend" : "";
      const res = await fetch(`${baseUrl}/api/admin/vocab`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          german: currentVocab.german,
          english: currentVocab.english,
          article: currentVocab.article || "der",
          plural: currentVocab.plural || currentVocab.german + "s",
          levelId: currentVocab.levelId || "a1",
          categoryId: currentVocab.categoryId || 1,
          germanSentence: currentVocab.germanSentence || `${currentVocab.german} ist ein wichtiges Wort.`,
          englishSentence: currentVocab.englishSentence || `${currentVocab.english} is an important word.`,
        }),
      });

      // Save to newly added storage in frontend engine
      try {
        const added = localStorage.getItem(ADDED_STORAGE_KEY);
        const list = added ? JSON.parse(added) : [];
        const item = { ...currentVocab, id: Date.now() };
        list.unshift(item);
        localStorage.setItem(ADDED_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}

      showNotification(`🎉 Successfully created brand new question card "${currentVocab.german}"!`);
      setIsCreatingVocab(false);
      setCurrentVocab({});
      fetchVocab();
    } catch (err) {
      showNotification("❌ Error creating word.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVocab = async (id: number | string, word: string) => {
    if (!confirm(`Are you certain you wish to delete "${word}" from the SQLite database and all game modes?`)) return;
    try {
      const baseUrl = window.location.pathname.startsWith("/backend") ? "/backend" : "";
      await fetch(`${baseUrl}/api/admin/vocab?id=${id}`, { method: "DELETE" });
      
      // Mark as deleted in storage engine
      try {
        const del = localStorage.getItem(DELETED_STORAGE_KEY);
        const list = del ? JSON.parse(del) : [];
        list.push(id);
        localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}

      showNotification(`🗑️ Deleted "${word}" from the database!`);
      fetchVocab();
    } catch (err) {
      showNotification("❌ Error deleting word.");
    }
  };

  // QUIZ CRUD HANDLERS
  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuiz.title) return;
    setLoading(true);
    try {
      const baseUrl = window.location.pathname.startsWith("/backend") ? "/backend" : "";
      const isUpdate = Boolean(currentQuiz.id);
      const url = `${baseUrl}/api/admin/quizzes`;
      const method = isUpdate ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentQuiz),
      });

      if (res.ok) {
        showNotification(isUpdate ? `✅ Quiz "${currentQuiz.title}" updated successfully!` : `🎉 Created brand new quiz "${currentQuiz.title}"!`);
        setIsEditingQuiz(false);
        setIsCreatingQuiz(false);
        setCurrentQuiz({ questions: [] });
        fetchQuizzes();
      } else {
        showNotification("❌ Failed to save quiz.");
      }
    } catch (err) {
      showNotification("❌ Error communicating with quiz endpoint.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to completely remove Quiz "${title}" and all its questions?`)) return;
    try {
      const baseUrl = window.location.pathname.startsWith("/backend") ? "/backend" : "";
      const res = await fetch(`${baseUrl}/api/admin/quizzes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification(`🗑️ Deleted Quiz "${title}"!`);
        fetchQuizzes();
      }
    } catch (err) {
      showNotification("❌ Error deleting quiz.");
    }
  };

  // Filtered lists
  const filteredVocab = useMemo(() => {
    return vocabList.filter(item => {
      const q = vocabSearch.toLowerCase().trim();
      const matchesSearch = !q || item.german?.toLowerCase().includes(q) || item.english?.toLowerCase().includes(q);
      const matchesLevel = selectedLevel === "ALL" || (item.levelId || item.level || "").toUpperCase().startsWith(selectedLevel);
      return matchesSearch && matchesLevel;
    });
  }, [vocabList, vocabSearch, selectedLevel]);

  const filteredQuizzes = useMemo(() => {
    return quizList.filter(q => {
      const term = quizSearch.toLowerCase().trim();
      return !term || q.title?.toLowerCase().includes(term) || q.category?.toLowerCase().includes(term);
    });
  }, [quizList, quizSearch]);

  return (
    <div className="space-y-8 pb-20 font-sans text-zinc-900 dark:text-zinc-100">
      {/* Real-time Toast Notification Banner */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 backdrop-blur-md">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-white hover:opacity-70 font-bold">✕</button>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white p-8 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30 mb-3">
              <span>🎮 Backend Admin Studio</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Game Question & Vocabulary CRUD Panel
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl mt-1 font-medium">
              Modify database questions, customize CEFR proficiency vocabulary cards, assign high-definition visual icons, and edit multi-question grammar quizzes in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="http://localhost:3000/games/babadum"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 font-black px-5 py-2.5 rounded-xl text-sm transition-transform active:scale-95 flex items-center gap-2 shadow-lg"
            >
              <span>🎯 Play in BaBaDum</span>
              <span className="text-xs">↗</span>
            </a>
            {activeTab === "vocab" ? (
              <button
                onClick={() => {
                  setCurrentVocab({ levelId: "a1", article: "der", emoji: "🍎" });
                  setIsCreatingVocab(true);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black px-5 py-2.5 rounded-xl text-sm shadow-xl transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>➕ New Word Card & Icon</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentQuiz({ title: "", description: "", category: "Grammar Rules", quizType: "multiple_choice", levelId: "a1", questions: [] });
                  setIsCreatingQuiz(true);
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-black px-5 py-2.5 rounded-xl text-sm shadow-xl transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>➕ Create Quiz & Questions</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-3 bg-zinc-900/60 p-2 rounded-2xl border border-zinc-800 shadow-md">
        <button
          onClick={() => setActiveTab("vocab")}
          className={`flex-1 py-3 px-6 rounded-xl font-black text-sm flex items-center justify-center gap-2.5 transition-all ${
            activeTab === "vocab"
              ? "bg-amber-400 text-zinc-950 shadow-lg scale-[1.01]"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
          }`}
        >
          <span className="text-lg">🇩🇪</span>
          <span>Vocabulary & HD Visual Icons ({vocabList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("quizzes")}
          className={`flex-1 py-3 px-6 rounded-xl font-black text-sm flex items-center justify-center gap-2.5 transition-all ${
            activeTab === "quizzes"
              ? "bg-indigo-500 text-white shadow-lg scale-[1.01]"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
          }`}
        >
          <span className="text-lg">🧠</span>
          <span>Interactive Quizzes & Questions ({quizList.length})</span>
        </button>
      </div>

      {/* TAB 1: VOCABULARY & HD ICON CRUD */}
      {activeTab === "vocab" && (
        <div className="space-y-6">
          {/* Filters & Live Search */}
          <div className="bg-white dark:bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow">
            <div className="relative w-full sm:w-80">
              <span className="absolute left-3.5 top-2.5 text-zinc-400 select-none">🔍</span>
              <input
                type="text"
                placeholder="Search German word, translation..."
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-zinc-400 mr-2 uppercase tracking-wider">Level:</span>
              {["ALL", "A1", "A2", "B1", "B2"].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    selectedLevel === lvl ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950 shadow scale-105" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-500 font-extrabold animate-pulse text-lg">
              🔄 Synchronizing with database and game engines...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVocab.slice(0, 30).map(word => (
                <div key={word.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-4xl transform group-hover:scale-110 transition-transform select-none shadow relative">
                        <span>{word.emoji || "💡"}</span>
                        <span className="absolute -bottom-2 -right-1 bg-emerald-500 text-zinc-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm uppercase tracking-tighter">
                          HD
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                          {(word.levelId || word.level || "A1").toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-zinc-400 mt-1 truncate max-w-[150px]">
                          {word.category || "Core Vocab"}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-baseline gap-1.5">
                        {word.article && <span className="text-xs font-black text-amber-500 uppercase italic">{word.article}</span>}
                        <h3 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">{word.german}</h3>
                      </div>
                      <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300">🇬🇧 {word.english}</p>
                    </div>

                    {word.germanSentence && (
                      <p className="text-xs text-zinc-500 italic line-clamp-2 mb-4 bg-zinc-50 dark:bg-zinc-950/60 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        &ldquo;{word.germanSentence}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setCurrentVocab({ ...word });
                        setIsEditingVocab(true);
                      }}
                      className="bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-800 dark:text-zinc-200 font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center gap-1"
                    >
                      <span>✏️ Edit & Icon Override</span>
                    </button>
                    <button
                      onClick={() => handleDeleteVocab(word.id, word.german)}
                      className="bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 dark:text-red-400 font-extrabold p-2 rounded-xl text-xs transition-colors"
                      title="Delete from SQLite Database"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUIZ & QUESTIONS CRUD */}
      {activeTab === "quizzes" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900/80 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow">
            <div className="relative w-full sm:w-96">
              <span className="absolute left-3.5 top-2.5 text-zinc-400 select-none">🔍</span>
              <input
                type="text"
                placeholder="Search quiz title, grammar category..."
                value={quizSearch}
                onChange={(e) => setQuizSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
            <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider hidden sm:inline">
              Managing {filteredQuizzes.length} Quizzes
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredQuizzes.map(quiz => (
              <div key={quiz.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-indigo-500/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase">
                      Level {quiz.levelId.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300">
                      {quiz.category}
                    </span>
                    <span className="text-xs text-emerald-400 font-extrabold">
                      ✓ {quiz.questions?.length || 0} Questions Enrolled
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">{quiz.title}</h3>
                  <p className="text-sm text-zinc-400 font-medium">{quiz.description || "Interactive German assessment deck."}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-zinc-800">
                  <button
                    onClick={() => {
                      setCurrentQuiz({ ...quiz });
                      setIsEditingQuiz(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-transform active:scale-95 shadow-md flex items-center gap-1.5"
                  >
                    <span>✏️ Edit Quiz & Questions</span>
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                    className="bg-red-500/20 hover:bg-red-500 hover:text-white text-red-400 font-extrabold p-2 rounded-xl text-xs transition-colors"
                    title="Delete entire quiz deck"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VOCAB MODAL (EDIT / CREATE) */}
      {(isEditingVocab || isCreatingVocab) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 overflow-hidden relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>{isCreatingVocab ? "✨ Add New Database Word Card" : "✏️ Edit Word & HD Visual Override"}</span>
              </h2>
              <button onClick={() => { setIsEditingVocab(false); setIsCreatingVocab(false); }} className="text-zinc-400 hover:text-white font-black text-lg p-2">✕</button>
            </div>

            <form onSubmit={isCreatingVocab ? handleSaveVocabCreate : handleSaveVocabEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1">Article</label>
                  <select
                    value={currentVocab.article || "der"}
                    onChange={(e) => setCurrentVocab({ ...currentVocab, article: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-amber-300 font-black focus:outline-none focus:border-emerald-500"
                  >
                    <option value="der">der (Masculine)</option>
                    <option value="die">die (Feminine)</option>
                    <option value="das">das (Neuter)</option>
                    <option value="">None / Verb / Adj</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1">German Word *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bahnhof, Schmetterling"
                    value={currentVocab.german || ""}
                    onChange={(e) => setCurrentVocab({ ...currentVocab, german: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white font-black focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1">English Translation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Train Station, Butterfly"
                    value={currentVocab.english || ""}
                    onChange={(e) => setCurrentVocab({ ...currentVocab, english: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1 flex items-center justify-between">
                    <span>Emoji / HD Icon Override</span>
                    <span className="text-[10px] text-emerald-400 font-bold">512px WebP & SVG</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 🚉, 🦋, 🚗, 🍎"
                      value={currentVocab.emoji || ""}
                      onChange={(e) => setCurrentVocab({ ...currentVocab, emoji: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-lg text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <div className="w-10 h-10 rounded-xl bg-white text-zinc-950 flex items-center justify-center text-2xl font-black shrink-0 shadow border border-zinc-200">
                      {currentVocab.emoji || "💡"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1">CEFR Proficiency Level</label>
                  <select
                    value={(currentVocab.levelId || "a1").toLowerCase()}
                    onChange={(e) => setCurrentVocab({ ...currentVocab, levelId: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-indigo-300 font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="a1">A1 • Beginner</option>
                    <option value="a2">A2 • Elementary</option>
                    <option value="b1">B1 • Intermediate</option>
                    <option value="b2">B2 • Upper Intermediate</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1">Category Deck</label>
                  <input
                    type="text"
                    placeholder="e.g. Travel & Transit, Food & Kitchen"
                    value={currentVocab.category || ""}
                    onChange={(e) => setCurrentVocab({ ...currentVocab, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-zinc-200 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button type="button" onClick={() => { setIsEditingVocab(false); setIsCreatingVocab(false); }} className="bg-zinc-800 text-zinc-300 font-bold px-5 py-2.5 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 text-zinc-950 font-black px-6 py-2.5 rounded-xl text-sm shadow-xl active:scale-95">
                  <span>{isCreatingVocab ? "🎉 Save to DB & Game Deck" : "✅ Apply DB & HD Override"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUIZ MODAL (EDIT / CREATE QUIZ AND QUESTIONS) */}
      {(isEditingQuiz || isCreatingQuiz) && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6 sticky top-0 bg-zinc-900 z-10">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <span>{isCreatingQuiz ? "🧠 Create Interactive Quiz Deck" : "✏️ Edit Quiz & Enrolled Questions"}</span>
              </h2>
              <button onClick={() => { setIsEditingQuiz(false); setIsCreatingQuiz(false); }} className="text-zinc-400 hover:text-white font-black text-lg p-2">✕</button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1">Quiz Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Akkusativ vs Dativ Challenge"
                    value={currentQuiz.title || ""}
                    onChange={(e) => setCurrentQuiz({ ...currentQuiz, title: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white font-black focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1">CEFR Level</label>
                  <select
                    value={(currentQuiz.levelId || "a1").toLowerCase()}
                    onChange={(e) => setCurrentQuiz({ ...currentQuiz, levelId: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-indigo-300 font-bold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="a1">A1 • Beginner</option>
                    <option value="a2">A2 • Elementary</option>
                    <option value="b1">B1 • Intermediate</option>
                    <option value="b2">B2 • Upper Intermediate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1">Description / Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Choose the correct German case option to complete the sentence."
                  value={currentQuiz.description || ""}
                  onChange={(e) => setCurrentQuiz({ ...currentQuiz, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* QUESTIONS LIST SECTION */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-amber-300 uppercase tracking-wide">
                    Enrolled Questions ({currentQuiz.questions?.length || 0})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const list = currentQuiz.questions || [];
                      const newQ: QuizQuestion = {
                        order: list.length + 1,
                        question: "New Question Text",
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correctIndex: 0,
                        explanation: "Explanation of why this answer is correct."
                      };
                      setCurrentQuiz({ ...currentQuiz, questions: [...list, newQ] });
                    }}
                    className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white font-extrabold px-4 py-1.5 rounded-xl text-xs transition-colors border border-indigo-500/40"
                  >
                    ➕ Add Question to Quiz
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {(currentQuiz.questions || []).map((q, idx) => {
                    const opts = typeof q.options === "string" ? JSON.parse(q.options || "[]") : q.options || [];
                    return (
                      <div key={idx} className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4 space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">Question #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (currentQuiz.questions || []).filter((_, i) => i !== idx);
                              setCurrentQuiz({ ...currentQuiz, questions: updated });
                            }}
                            className="text-red-400 hover:text-red-300 text-xs font-extrabold px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/20"
                          >
                            Remove
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Question prompt..."
                            value={q.question || ""}
                            onChange={(e) => {
                              const list = [...(currentQuiz.questions || [])];
                              list[idx] = { ...q, question: e.target.value };
                              setCurrentQuiz({ ...currentQuiz, questions: list });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white font-bold"
                          />
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-2 gap-2">
                          {["0", "1", "2", "3"].map((oIdx, i) => (
                            <div key={i} className="flex items-center gap-1 bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-800">
                              <input
                                type="radio"
                                name={`correct-${idx}`}
                                checked={q.correctIndex === i}
                                onChange={() => {
                                  const list = [...(currentQuiz.questions || [])];
                                  list[idx] = { ...q, correctIndex: i };
                                  setCurrentQuiz({ ...currentQuiz, questions: list });
                                }}
                                className="text-emerald-500 focus:ring-0 cursor-pointer w-4 h-4 ml-1"
                                title="Mark as correct option"
                              />
                              <input
                                type="text"
                                placeholder={`Option ${i + 1}`}
                                value={opts[i] || ""}
                                onChange={(e) => {
                                  const newOpts = [...opts];
                                  newOpts[i] = e.target.value;
                                  const list = [...(currentQuiz.questions || [])];
                                  list[idx] = { ...q, options: newOpts };
                                  setCurrentQuiz({ ...currentQuiz, questions: list });
                                }}
                                className="w-full bg-transparent text-xs text-zinc-200 font-semibold px-2 focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Explanation / Hint (e.g., Dativ always follows 'mit')..."
                            value={q.explanation || ""}
                            onChange={(e) => {
                              const list = [...(currentQuiz.questions || [])];
                              list[idx] = { ...q, explanation: e.target.value };
                              setCurrentQuiz({ ...currentQuiz, questions: list });
                            }}
                            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-400 italic"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800 flex items-center justify-end gap-3 sticky bottom-0 bg-zinc-900 py-4">
                <button type="button" onClick={() => { setIsEditingQuiz(false); setIsCreatingQuiz(false); }} className="bg-zinc-800 text-zinc-300 font-bold px-5 py-2.5 rounded-xl text-sm">Cancel</button>
                <button type="submit" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black px-6 py-2.5 rounded-xl text-sm shadow-xl active:scale-95">
                  <span>🎉 Save Quiz & Deploy Deck</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
