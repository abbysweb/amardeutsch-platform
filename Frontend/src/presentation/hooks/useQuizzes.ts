'use client';

import { useMemo } from 'react';
import { registry } from '../../infrastructure/registry/DataRegistry';
import type { CEFRLevel } from '../../levels/cefr';

export function useQuizzes(level?: CEFRLevel) {
  return useMemo(() => {
    if (!registry.isReady) return [];
    return registry.quizzes(level);
  }, [level]);
}

export function useQuiz(level: CEFRLevel, id: number | string) {
  return useMemo(() => {
    if (!registry.isReady) return undefined;
    return registry.quizzes(level).find((q: { getId: () => number | string }) => q.getId() === id);
  }, [level, id]);
}
