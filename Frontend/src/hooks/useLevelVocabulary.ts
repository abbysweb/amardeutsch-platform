"use client";

import { useState, useEffect } from 'react';

type VocabularyItem = {
  id: number;
  german: string;
  english: string;
  article: string | null;
  plural: string | null;
  levelId: string;
  categoryId: number;
  germanSentence: string | null;
  englishSentence: string | null;
  category?: string;
};

export function useLevelVocabulary(levelId: string) {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchVocab() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/backend/api/admin/vocab?level=${levelId}`);
        if (!res.ok) throw new Error('Failed to fetch vocabulary');
        const data = await res.json();
        if (!cancelled) {
          const formatted = Array.isArray(data) ? data.map((item: any) => ({
            ...item,
            level: (item.level || item.levelId || "").toUpperCase()
          })) : [];
          setVocabulary(formatted);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchVocab();
    return () => { cancelled = true; };
  }, [levelId]);

  return { vocabulary, loading, error };
}
