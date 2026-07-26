"use client";

import { useState, useEffect, useCallback } from 'react';

export interface LevelStats {
  vocabularyCount: number;
  grammarCount: number;
  quizCount: number;
  totalQuestions: number;
  sentenceCount: number;
  examCount: number;
  isLive: boolean;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

interface DefaultStats {
  vocabularyCount: number;
  grammarCount: number;
  quizCount: number;
  totalQuestions?: number;
  sentenceCount: number;
  examCount?: number;
}

/**
 * A custom real-time synchronization hook for CEFR level dashboards (A1-B2).
 * Continuously monitors the centralized SQLite database via REST API endpoints to display
 * accurate, live vocabulary, grammar, sentence, quiz, and practice exam counts.
 */
export function useRealtimeStats(levelId: string, defaultStats: DefaultStats): LevelStats {
  const [stats, setStats] = useState({
    vocabularyCount: defaultStats.vocabularyCount,
    grammarCount: defaultStats.grammarCount,
    quizCount: defaultStats.quizCount,
    totalQuestions: defaultStats.totalQuestions || defaultStats.quizCount * 10,
    sentenceCount: defaultStats.sentenceCount,
    examCount: defaultStats.examCount || 1,
    isLive: false,
    lastUpdated: null as Date | null,
  });

  const fetchLiveStats = useCallback(async () => {
    const cleanLevel = levelId.toLowerCase();
    const upperLevel = cleanLevel.toUpperCase();

    let newVocab = defaultStats.vocabularyCount;
    let newQuizzes = defaultStats.quizCount;
    let newQuestions = defaultStats.totalQuestions || 0;
    let newGrammar = defaultStats.grammarCount;
    let newSentences = defaultStats.sentenceCount;
    let newExams = defaultStats.examCount || 1;
    let gotData = false;

    // 1. Fetch live vocabulary count
    try {
      const res = await fetch(`/backend/api/admin/vocab?level=${cleanLevel}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          newVocab = data.length;
          // Every vocabulary word with an example sentence increases available sentences
          const vocabSentences = data.filter((item: any) => item.germanSentence || item.englishSentence).length;
          if (vocabSentences > 0) {
            newSentences = Math.max(defaultStats.sentenceCount, vocabSentences);
          }
          gotData = true;
        }
      }
    } catch (e) {
      console.error('Real-time Vocab Sync Error:', e);
    }

    // 2. Fetch live interactive quizzes count
    try {
      const res = await fetch(`/backend/api/admin/quizzes?level=${upperLevel}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          newQuizzes = data.length;
          newQuestions = data.reduce((sum: number, q: any) => sum + (q.questions?.length || 0), 0);
          
          // Identify comprehensive practice exam simulators within quizzes
          const examSims = data.filter((q: any) => 
            (q.title || "").toLowerCase().includes("exam") || 
            (q.category || "").toLowerCase().includes("exam") ||
            (q.title || "").toLowerCase().includes("simulator")
          ).length;
          if (examSims > 0) {
            newExams = Math.max(newExams, examSims);
          }
          gotData = true;
        }
      }
    } catch (e) {
      console.error('Real-time Quizzes Sync Error:', e);
    }

    // 3. Fetch live grammar rules count
    try {
      const res = await fetch(`/backend/api/admin/grammar`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const levelGrammar = data.filter((g: any) => 
            (g.levelId || g.level || "").toLowerCase() === cleanLevel ||
            (g.levelId || g.level || "").toLowerCase() === 'all'
          );
          if (levelGrammar.length > 0) {
            newGrammar = levelGrammar.length;
            gotData = true;
          }
        }
      }
    } catch (e) {
      console.error('Real-time Grammar Sync Error:', e);
    }

    if (gotData) {
      setStats((prev) => ({
        ...prev,
        vocabularyCount: newVocab,
        grammarCount: newGrammar,
        quizCount: newQuizzes,
        totalQuestions: newQuestions,
        sentenceCount: newSentences,
        examCount: newExams,
        isLive: true,
        lastUpdated: new Date()
      }));
    }
  }, [levelId, defaultStats.vocabularyCount, defaultStats.grammarCount, defaultStats.quizCount, defaultStats.totalQuestions, defaultStats.sentenceCount, defaultStats.examCount]);

  useEffect(() => {
    // Initial fetch on mount
    fetchLiveStats();

    // Re-fetch automatically whenever browser window regains focus (e.g. returning from Admin CRUD tab)
    const handleFocus = () => {
      fetchLiveStats();
    };
    window.addEventListener('focus', handleFocus);

    // Set up periodic 15-second polling for real-time dashboard updates
    const interval = setInterval(() => {
      fetchLiveStats();
    }, 15000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [fetchLiveStats]);

  return {
    ...stats,
    refresh: fetchLiveStats,
  };
}
