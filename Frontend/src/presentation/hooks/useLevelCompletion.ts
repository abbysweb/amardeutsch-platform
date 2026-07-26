'use client';

import { useState, useEffect } from 'react';
import { LearningProgressService } from '../../domain/services/LearningProgressService';
import { ProgressObserver } from '../../domain/observers/ProgressObserver';
import type { CEFRLevel } from '../../levels/cefr';

export function useLevelCompletion(level?: CEFRLevel) {
  const [service] = useState(() => LearningProgressService.getInstance());

  useEffect(() => {
    const observer = ProgressObserver.getInstance();
    const handler = () => {
      // Force re-render by toggling state
      setTick(t => t + 1);
    };
    observer.subscribe('quiz_finished', handler);
    observer.subscribe('vocab_learned', handler);
    observer.subscribe('lesson_completed', handler);
    observer.subscribe('exam_passed', handler);
    return () => {
      observer.unsubscribe('quiz_finished', handler);
      observer.unsubscribe('vocab_learned', handler);
      observer.unsubscribe('lesson_completed', handler);
      observer.unsubscribe('exam_passed', handler);
    };
  }, []);

  const [, setTick] = useState(0);

  const vocabCount = level ? service.getCompletionCount('vocab', level) : 0;
  const grammarCount = level ? service.getCompletionCount('grammar', level) : 0;
  const quizCount = level ? service.getCompletionCount('quiz', level) : 0;
  const examCount = level ? service.getCompletionCount('exam', level) : 0;

  const isVocabLearned = (id: number | string): boolean => {
    if (!level) return false;
    return service.isCompleted('vocab', level, id);
  };

  const isLessonCompleted = (id: number | string): boolean => {
    if (!level) return false;
    return service.isCompleted('grammar', level, id);
  };

  const isQuizFinished = (id: number | string): boolean => {
    if (!level) return false;
    return service.isCompleted('quiz', level, id);
  };

  const isExamPassed = (id: number | string): boolean => {
    if (!level) return false;
    return service.isCompleted('exam', level, id);
  };

  return {
    vocabCount,
    grammarCount,
    quizCount,
    examCount,
    isVocabLearned,
    isLessonCompleted,
    isQuizFinished,
    isExamPassed,
  };
}
