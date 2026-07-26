"use client";

import { useEffect, useState, memo } from "react";

type ProgressData = Record<string, boolean>;

function loadProgress(key: string): ProgressData {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveProgress(key: string, data: ProgressData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function useProgress(storageKey: string) {
  const [progress, setProgress] = useState<ProgressData>({});

  useEffect(() => {
    setProgress(loadProgress(storageKey));
  }, [storageKey]);

  const toggle = (id: string | number) => {
    const idStr = String(id);
    setProgress((prev) => {
      const next = { ...prev, [idStr]: !prev[idStr] };
      saveProgress(storageKey, next);
      return next;
    });
  };

  const isCompleted = (id: string | number): boolean => {
    return !!progress[String(id)];
  };

  const completedCount = Object.values(progress).filter(Boolean).length;

  return { progress, toggle, isCompleted, completedCount };
}

interface ProgressBarProps {
  title: string;
  completed: number;
  total: number;
}

const ProgressBar = memo(function ProgressBar({ title, completed, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-zinc-700">{title}</span>
        <span className="text-sm text-zinc-500">
          {completed} / {total}
        </span>
      </div>
      <div className="w-full bg-zinc-100 rounded-full h-2.5">
        <div
          className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-zinc-400 mt-1 block text-right">{pct}% complete</span>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export { useProgress, ProgressBar };