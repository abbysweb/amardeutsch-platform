'use client';

/**
 * @file useVocabulary.ts
 * Presentation hook — ViewModel bridge between UI and application use cases.
 * UI components import from here, NEVER from raw repositories or the registry.
 */

import { useMemo } from 'react';
import { registry } from '../../infrastructure/registry/DataRegistry';
import { Sanitizer } from '../../infrastructure/security/Sanitizer';
import type { CEFRLevel } from '../../levels/cefr';

export function useVocabulary(level?: CEFRLevel) {
  return useMemo(() => {
    if (!registry.isReady) return [];
    return registry.vocabulary(level);
  }, [level]);
}

export function useVocabSearch(rawQuery: string, level?: CEFRLevel) {
  return useMemo(() => {
    if (!registry.isReady) return [];
    const query = Sanitizer.sanitizeSearch(rawQuery);
    if (!query) return registry.vocabulary(level);
    return registry.searchVocab(query, level);
  }, [rawQuery, level]);
}

export function useRandomVocab(count: number, level?: CEFRLevel) {
  return useMemo(() => {
    if (!registry.isReady) return [];
    return registry.randomVocab(count, level);
  }, [count, level]);
}
