'use client';

import { useState, useEffect, useCallback } from 'react';
import { progressPersistence, quizScorePersistence, type PersistenceEntry } from '../../infrastructure/persistence/LocalStoragePersistence';
import { ProgressObserver } from '../../domain/observers/ProgressObserver';

export interface ProgressItem {
  id: number | string;
  level: string;
  completed: boolean;
  score?: number;
  maxScore?: number;
}

export function useProgressV2(prefix: string) {
  const [items, setItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const progress: Record<string, boolean> = {};
    const keys = progressPersistence.keys();
    for (const key of keys) {
      if (key.startsWith(`${prefix}:`)) {
        progress[key] = !!progressPersistence.get(key);
      }
    }
    setItems(progress);
  }, [prefix]);

  const toggle = useCallback((id: number | string) => {
    const key = `${prefix}:${id}`;
    const current = !!progressPersistence.get(key);
    progressPersistence.set(key, !current);
    setItems(prev => ({ ...prev, [`${prefix}:${id}`]: !current }));
  }, [prefix]);

  const markCompleted = useCallback((id: number | string) => {
    const key = `${prefix}:${id}`;
    progressPersistence.set(key, true);
    setItems(prev => ({ ...prev, [`${prefix}:${id}`]: true }));
  }, [prefix]);

  const isCompleted = useCallback((id: number | string): boolean => {
    return !!progressPersistence.get(`${prefix}:${id}`);
  }, [prefix]);

  const getScore = useCallback((id: number | string): { score: number; maxScore: number } | undefined => {
    return quizScorePersistence.get(`${prefix}:${id}`);
  }, [prefix]);

  const completedCount = Object.values(items).filter(Boolean).length;
  const totalCount = Object.keys(items).length;

  return { items, toggle, markCompleted, isCompleted, getScore, completedCount, totalCount };
}

export function useQuizScoreV2(level: string, quizId: number | string) {
  const [score, setScore] = useState<{ score: number; maxScore: number } | undefined>(undefined);

  useEffect(() => {
    setScore(quizScorePersistence.get(`${level}:${quizId}`));
  }, [level, quizId]);

  const saveScore = useCallback((s: number, max: number) => {
    quizScorePersistence.set(`${level}:${quizId}`, { score: s, maxScore: max });
    setScore({ score: s, maxScore: max });
    ProgressObserver.onQuizFinished(level, quizId, s, max);
  }, [level, quizId]);

  return { score, saveScore };
}

export function useVocabularyProgress() {
  return useProgressV2('vocab');
}

export function useGrammarProgress() {
  return useProgressV2('grammar');
}

export function useQuizProgress() {
  return useProgressV2('quiz');
}

export function useExamProgress() {
  return useProgressV2('exam');
}

export function useAllProgress() {
  const vocab = useVocabularyProgress();
  const grammar = useGrammarProgress();
  const quiz = useQuizProgress();
  const exam = useExamProgress();

  const resetAll = useCallback(() => {
    progressPersistence.clearPrefix('vocab');
    progressPersistence.clearPrefix('grammar');
    progressPersistence.clearPrefix('quiz');
    progressPersistence.clearPrefix('exam');
    quizScorePersistence.clear();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  return { vocab, grammar, quiz, exam, resetAll };
}
