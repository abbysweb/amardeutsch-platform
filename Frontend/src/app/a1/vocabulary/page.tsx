"use client";

import Link from "next/link";
import { Vocabulary } from "@/levels/a1/modules/Vocabulary";

export default function VocabPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-amber-50 to-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-yellow-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-zinc-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/a1" className="hover:text-amber-600 transition-colors">A1</Link>
            <span>/</span>
            <span className="text-amber-700 font-medium">Vocabulary</span>
          </div>
        </div>
      </div>
      <Vocabulary />
    </div>
  );
}
