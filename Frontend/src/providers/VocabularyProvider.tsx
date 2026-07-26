"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Represents a single vocabulary word or expression returned from the Backend API.
 * Maps directly to the Prisma `Vocabulary` schema model.
 */

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

/**
 * Defines the state and capabilities exposed by the global Vocabulary Context.
 */
type VocabularyContextType = {
  /** The complete, unfiltered list of vocabulary items fetched from the backend. */
  vocabulary: VocabularyItem[];
  loading: boolean;
  error: string | null;
};

const VocabularyContext = createContext<VocabularyContextType>({
  vocabulary: [],
  loading: true,
  error: null,
});


/**
 * A global provider component that fetches the entire vocabulary dataset from the backend API on mount.
 * It manages the loading and error states, ensuring the frontend is fully synced with the backend SQLite database.
 * 
 * @param props - React props containing the child elements to be wrapped by the provider.
 */
export function VocabularyProvider({ children }: { children: React.ReactNode }) {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVocab() {
      try {
        const res = await fetch('http://localhost:3001/backend/api/admin/vocab');
        if (!res.ok) throw new Error('Failed to fetch vocabulary');
        const data = await res.json();
        setVocabulary(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchVocab();
  }, []);

  return (
    <VocabularyContext.Provider value={{ vocabulary, loading, error }}>
      {children}
    </VocabularyContext.Provider>
  );
}


/**
 * A custom React hook that safely consumes the VocabularyContext.
 * 
 * @param levelId - Optional CEFR level identifier (e.g., 'a1', 'b2'). If provided, the returned vocabulary list will be pre-filtered to only include words matching that level.
 * @returns The context state containing the `vocabulary` array, a `loading` boolean, and an `error` string.
 * @throws {Error} If called outside of a `<VocabularyProvider>`.
 */
export function useVocabulary(levelId?: string) {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  
  if (levelId) {
    return {
      ...context,
      vocabulary: context.vocabulary.filter(v => v.levelId.toLowerCase() === levelId.toLowerCase())
    };
  }
  
  return context;
}
