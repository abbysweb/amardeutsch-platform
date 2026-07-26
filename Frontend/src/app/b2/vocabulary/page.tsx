"use client";

import Link from "next/link";
import { Vocabulary } from "@/levels/b2/modules/Vocabulary";

export default function B2VocabPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-rose-50 to-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-red-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-zinc-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/b2" className="hover:text-red-600 transition-colors">B2</Link>
            <span>/</span>
            <span className="text-red-700 font-medium">Vocabulary</span>
          </div>
        </div>
      </div>
      <Vocabulary />
    </div>
  );
}
