'use client';

import { type ReactNode } from 'react';
import { LevelDataProvider } from './providers/LevelDataProvider';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LevelDataProvider>{children}</LevelDataProvider>
    </AuthProvider>
  );
}
