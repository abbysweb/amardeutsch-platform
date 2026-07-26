/**
 * ViewModel for vocabulary — wraps useVocabulary hook with UI-specific state.
 */

import { useState, useCallback, useMemo } from 'react';
import type { Vocabulary } from '../../domain/entities/Vocabulary';
import type { CEFRLevel } from '../../levels/cefr';
import { registry } from '../../infrastructure/registry/DataRegistry';

export interface VocabularyViewState {
  words: ReadonlyArray<Vocabulary>;
  searchQuery: string;
  activeCategory: string;
  isFlipped: Record<number | string, boolean>;
}

export function useVocabularyViewModel(level?: CEFRLevel) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [flipped, setFlipped] = useState<Record<number | string, boolean>>({});

  const words = useMemo(() => {
    if (!registry.isReady) return [];
    return registry.vocabulary(level);
  }, [level]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    words.forEach(w => set.add(w.getCategory()));
    return [...set].sort();
  }, [words]);

  const filtered = useMemo(() => {
    let result = words;
    if (activeCategory !== 'all') {
      result = result.filter(w => w.getCategory() === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(w =>
        w.getGerman().toLowerCase().includes(q) ||
        w.getEnglish().toLowerCase().includes(q)
      );
    }
    return result;
  }, [words, activeCategory, searchQuery]);

  const toggleFlip = useCallback((id: number | string) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const resetFlipped = useCallback(() => {
    setFlipped({});
  }, []);

  return {
    words: filtered,
    categories,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    isFlipped: flipped,
    toggleFlip,
    resetFlipped,
  };
}
