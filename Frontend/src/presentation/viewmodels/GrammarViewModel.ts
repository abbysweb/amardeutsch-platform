/**
 * ViewModel for grammar — manages expanded lesson state and filtering.
 */

import { useState, useCallback, useMemo } from 'react';
import type { Grammar } from '../../domain/entities/Grammar';
import type { CEFRLevel } from '../../levels/cefr';
import { registry } from '../../infrastructure/registry/DataRegistry';

export function useGrammarViewModel(level?: CEFRLevel) {
  const [expandedId, setExpandedId] = useState<number | string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const lessons = useMemo(() => {
    if (!registry.isReady) return [];
    return registry.grammar(level);
  }, [level]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return lessons;
    const q = searchQuery.toLowerCase();
    return lessons.filter((l: Grammar) =>
      l.getTitle().toLowerCase().includes(q) ||
      l.getDescription().toLowerCase().includes(q) ||
      l.getContent().toLowerCase().includes(q)
    );
  }, [lessons, searchQuery]);

  const toggleExpand = useCallback((id: number | string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedId(null);
  }, []);

  return {
    lessons: filtered,
    expandedId,
    searchQuery,
    setSearchQuery,
    toggleExpand,
    collapseAll,
    isExpanded: (id: number | string) => expandedId === id,
  };
}
