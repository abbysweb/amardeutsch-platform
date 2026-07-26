'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CEFRLevel } from '../../levels/cefr';

interface LevelDataContextType {
  activeLevel: CEFRLevel | null;
  setActiveLevel: (level: CEFRLevel) => void;
}

const LevelDataContext = createContext<LevelDataContextType>({
  activeLevel: null,
  setActiveLevel: () => {},
});

export function LevelDataProvider({ children }: { children: ReactNode }) {
  const [activeLevel, setActiveLevel] = useState<CEFRLevel | null>(null);

  const handleSetLevel = useCallback((level: CEFRLevel) => {
    setActiveLevel(level);
  }, []);

  return (
    <LevelDataContext.Provider value={{ activeLevel, setActiveLevel: handleSetLevel }}>
      {children}
    </LevelDataContext.Provider>
  );
}

export function useLevelContext(): LevelDataContextType {
  return useContext(LevelDataContext);
}
