'use client';

import { useMemo } from 'react';
import { registry } from '../../infrastructure/registry/DataRegistry';
import type { CEFRLevel } from '../../levels/cefr';

export function useExam(level: CEFRLevel) {
  return useMemo(() => {
    if (!registry.isReady) return undefined;
    return registry.exam(level);
  }, [level]);
}

export function useAllExams() {
  return useMemo(() => {
    if (!registry.isReady) return [];
    return [];
  }, []);
}
