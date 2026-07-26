"use client";

import Link from "next/link";
import { Quizzes } from "@/levels/a1/modules/Quizzes";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

export default function QuizzesPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-zinc-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/a1" className="hover:text-zinc-600 transition-colors">A1</Link>
            <span>/</span>
            <span className="text-zinc-700 font-medium">Quizzes</span>
          </div>
        </div>
      </div>
      <ErrorBoundary><Quizzes /></ErrorBoundary>
    </div>
  );
}
