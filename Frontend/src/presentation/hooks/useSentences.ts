'use client';

import { useMemo } from 'react';
import { registry } from '../../infrastructure/registry/DataRegistry';
import type { CEFRLevel } from '../../levels/cefr';

export function useSentences(level?: CEFRLevel) {
  return useMemo(() => {
    if (!registry.isReady) return [];
    return registry.sentences(level);
  }, [level]);
}

export function useSentenceSearch(rawQuery: string) {
  return useMemo(() => {
    if (!registry.isReady) return [];
    return registry.searchSentences(rawQuery);
  }, [rawQuery]);
}
