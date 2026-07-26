'use client';

import { useMemo } from 'react';
import { registry } from '../../infrastructure/registry/DataRegistry';
import type { CEFRLevel } from '../../levels/cefr';

export function useGrammar(level?: CEFRLevel) {
  return useMemo(() => {
    if (!registry.isReady) return [];
    return registry.grammar(level);
  }, [level]);
}

export function useGrammarSearch(rawQuery: string, level?: CEFRLevel) {
  return useMemo(() => {
    if (!registry.isReady) return [];
    return registry.searchGrammar(rawQuery, level);
  }, [rawQuery, level]);
}

export function useTestableGrammar(level?: CEFRLevel) {
  return useMemo(() => {
    if (!registry.isReady) return [];
    return registry.testableGrammar(level);
  }, [level]);
}
