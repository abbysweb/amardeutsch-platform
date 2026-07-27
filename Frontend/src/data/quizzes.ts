/**
 * @file quizzes.ts
 * @description Central unified source of truth for ALL grammar and vocabulary quiz data across all CEFR levels.
 * Both http://localhost:3000/quizzes (all levels) and http://localhost:3000/a1/quizzes (level specific) pulling from this single file.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import type { Quiz } from "@/domain/entities/types";

import { a1Quizzes as rawA1 } from "@/levels/a1";
import { a2Quizzes as rawA2 } from "@/levels/a2";
import { b1Quizzes as rawB1 } from "@/levels/b1";
import { b2Quizzes as rawB2 } from "@/levels/b2";

export { a1Quizzes } from "@/levels/a1";
export { a2Quizzes } from "@/levels/a2";
export { b1Quizzes } from "@/levels/b1";
export { b2Quizzes } from "@/levels/b2";

/**
 * Removes parenthetical question numbering patterns such as (Q12–Q20), (Q1-Q10), 
 * (Questions 1–10), (Questions 601–700), and (1000 Questions) from quiz titles.
 */
export const cleanQuizTitle = (rawTitle: string): string => {
  if (!rawTitle) return "Grammar Challenge";
  return rawTitle
    // Remove ranges like (Q1–Q10), (Q12–Q20), (Questions 1–20), (Questions 601–620)
    .replace(/\s*\(\s*(?:Q|Qs|Question|Questions|Frage|Fragen)?\s*\.?\s*\d+\s*[–\-—to]+\s*(?:Q|Qs|Question|Questions|Frage|Fragen)?\s*\.?\s*\d+\s*\)/gi, "")
    // Remove standalone question counts inside parentheses like (1000 Questions) or (20 Qs)
    .replace(/\s*\(\s*\d+\s*(?:Q|Qs|Question|Questions|Frage|Fragen)\s*\)/gi, "")
    // Remove trailing dash patterns like " - Q1-Q10" or " - Questions 1-20" without parentheses
    .replace(/\s*[–\-—]\s*(?:Q|Qs|Question|Questions)\s*\d+\s*[–\-—to]+\s*(?:Q|Qs|Question|Questions)?\s*\d+\s*$/gi, "")
    // Trim any residual trailing hyphens, en-dashes, em-dashes, colons, or whitespace
    .replace(/\s*[–\-—:]+\s*$/g, "")
    .trim();
};

// Helper to normalize quiz schema across all curated datasets
const normalizeQuiz = (quiz: any, defaultLevel: string): any => ({
  id: quiz.id,
  title: cleanQuizTitle(quiz.title || "Grammar Challenge"),
  description: quiz.description || "",
  category: quiz.category || "General Grammar",
  level: (quiz.level || defaultLevel).toUpperCase(),
  quizType: quiz.quizType || "multiple_choice",
  questions: (quiz.questions || []).map((q: any, i: number) => ({
    id: q.id || i + 1,
    question: q.question || "",
    english: q.english || "",
    options: q.options || [],
    correctIndex: q.correctIndex ?? 0,
    explanation: q.explanation || "",
    sentenceBefore: q.sentenceBefore || "",
    blankWord: q.blankWord || "",
    sentenceAfter: q.sentenceAfter || "",
    hint: q.hint || ""
  }))
});

/** Centralized static dataset merging all CEFR levels into a single source of truth */
export const allQuizzes: any[] = [
  ...((rawA1 || []).map(q => normalizeQuiz(q, "A1"))),
  ...((rawA2 || []).map(q => normalizeQuiz(q, "A2"))),
  ...((rawB1 || []).map(q => normalizeQuiz(q, "B1"))),
  ...((rawB2 || []).map(q => normalizeQuiz(q, "B2"))),
];

/** @deprecated Use allQuizzes or useCentralQuizzes */
export const quizzes = allQuizzes;

/**
 * Custom React hook that acts as the centralized data feed for all Quiz pages.
 * Seamlessly combines static local quizzes with dynamic Admin CRUD backend quizzes.
 * 
 * @param targetLevel Optional CEFR level filter (e.g. 'A1', 'A2', 'B1', 'B2', or 'all')
 * @returns Unified array of quizzes and loading state.
 */
export function useCentralQuizzes(targetLevel: string = "all") {
  const [mergedQuizzes, setMergedQuizzes] = useState<any[]>(allQuizzes);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchBackendQuizzes = async () => {
      try {
        const queryParam = (targetLevel && targetLevel !== "all") ? `?level=${targetLevel.toUpperCase()}` : "";
        let res;
        try {
          res = await fetch(`/backend/api/admin/quizzes${queryParam}`);
        } catch {
          res = await fetch(`https://amardeutsch-platform-backend.vercel.app/backend/api/admin/quizzes${queryParam}`);
        }

        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map((q: any) => ({
              id: q.id, // Ensure exact database ID is preserved for synchronized Admin CRUD
              title: cleanQuizTitle(q.title),
              description: q.description,
              category: q.category || "General Grammar",
              level: (q.levelId || q.level?.id || "A1").toUpperCase(),
              quizType: q.quizType || "multiple_choice",
              questions: (q.questions || []).map((qst: any, idx: number) => ({
                id: qst.id || idx + 1,
                question: qst.question || "",
                english: qst.english || "",
                options: qst.options ? (typeof qst.options === "string" ? JSON.parse(qst.options) : qst.options) : [],
                correctIndex: qst.correctIndex ?? 0,
                explanation: qst.explanation || "",
                sentenceBefore: qst.sentenceBefore || "",
                blankWord: qst.blankWord || "",
                sentenceAfter: qst.sentenceAfter || "",
                hint: qst.hint || ""
              }))
            })).filter((q: any) => q.questions && q.questions.length > 0);

            // Replace initial static dataset with the live Admin CRUD database feed
            setMergedQuizzes(formatted);
          }
        }
      } catch (err) {
        // Fallback gracefully to central static dataset if backend is unreachable
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBackendQuizzes();
    return () => { isMounted = false; };
  }, [targetLevel]);

  const quizzesForLevel = useMemo(() => {
    if (targetLevel === "all" || !targetLevel) return mergedQuizzes;
    return mergedQuizzes.filter((q) => q.level.toUpperCase() === targetLevel.toUpperCase());
  }, [mergedQuizzes, targetLevel]);

  return { quizzes: quizzesForLevel, loading };
}