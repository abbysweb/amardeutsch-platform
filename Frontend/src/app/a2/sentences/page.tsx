"use client";

import Link from "next/link";
import { Sentences } from "@/levels/a2/modules/Sentences";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

export default function A2SentencesPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-zinc-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/a2" className="hover:text-zinc-600 transition-colors">A2</Link>
            <span>/</span>
            <span className="text-zinc-700 font-medium">Sentences</span>
          </div>
        </div>
      </div>
      <ErrorBoundary><Sentences /></ErrorBoundary>
    </div>
  );
}
