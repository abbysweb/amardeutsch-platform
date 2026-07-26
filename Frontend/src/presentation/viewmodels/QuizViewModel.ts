/**
 * ViewModel for quiz — manages quiz state, scoring, and progress.
 */

import { useState, useCallback, useMemo } from 'react';
import type { Quiz } from '../../domain/entities/Quiz';
import type { CEFRLevel } from '../../levels/cefr';
import { registry } from '../../infrastructure/registry/DataRegistry';

export type QuizPhase = 'list' | 'playing' | 'finished';

export function useQuizViewModel(level?: CEFRLevel) {
  const [phase, setPhase] = useState<QuizPhase>('list');
  const [activeQuizId, setActiveQuizId] = useState<number | string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const quizzes = useMemo(() => {
    if (!registry.isReady) return [];
    return registry.quizzes(level);
  }, [level]);

  const activeQuiz = useMemo(() => {
    if (activeQuizId === null) return undefined;
    return quizzes.find((q: { getId: () => number | string }) => q.getId() === activeQuizId);
  }, [quizzes, activeQuizId]);

  const currentQuestion = useMemo(() => {
    if (!activeQuiz) return undefined;
    return activeQuiz.getQuestions()[currentIndex];
  }, [activeQuiz, currentIndex]);

  const totalQuestions = activeQuiz?.getQuestionCount() ?? 0;
  const progress = totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const startQuiz = useCallback((quizId: number | string) => {
    setActiveQuizId(quizId);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setFinished(false);
    setPhase('playing');
  }, []);

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) {
      setScore(s => s + 1);
    }
    setAnswers(a => [...a, correct]);
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setFinished(true);
      setPhase('finished');
    }
  }, [currentIndex, totalQuestions]);

  const reset = useCallback(() => {
    setPhase('list');
    setActiveQuizId(null);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setFinished(false);
  }, []);

  return {
    phase,
    quizzes,
    activeQuiz,
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    answers,
    finished,
    progress,
    percentage,
    startQuiz,
    handleAnswer,
    nextQuestion,
    reset,
  };
}
