"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useCentralQuizzes } from "@/data/quizzes";
import QuizCard from "@/shared/components/QuizCard";
import FillBlankQuizCard from "@/shared/components/FillBlankQuizCard";
import SearchFilter from "@/shared/components/SearchFilter";
import { useQuizScoreV2 } from "@/presentation/hooks/useProgressV2";
import { soundEngine } from "@/shared/utils/sound";

export function Quizzes() {
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [typeFilter, setTypeFilter] = useState<"all" | "multiple_choice" | "fill_blank">("all");

  // Pull directly from the centralized quiz data source of truth for level B1
  const { quizzes: dynamicQuizzes, loading } = useCentralQuizzes("B1");

  const quiz = activeQuiz !== null ? dynamicQuizzes.find((q) => q.id === activeQuiz) : null;
  const { saveScore: saveQuizScore } = useQuizScoreV2('B1', activeQuiz ?? 0);

  useEffect(() => {
    if (finished && quiz) {
      saveQuizScore(score, quiz.questions.length);
      soundEngine.playTrophy();
    }
  }, [finished, score, quiz, saveQuizScore]);

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, correct]);
  }, []);

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length ?? 0) - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setActiveQuiz(null);
    setCurrentQuestion(0);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  const displayedQuizzes = typeFilter === "all" 
    ? dynamicQuizzes 
    : dynamicQuizzes.filter((q) => q.quizType === typeFilter);

  // Results view
  if (finished && quiz) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-lg p-8 sm:p-12 text-center">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">Quiz Complete!</h1>
          <p className="text-md text-zinc-500 font-medium mb-8">{quiz.title}</p>

          <div className="bg-zinc-50 rounded-2xl p-6 mb-8 border border-zinc-200/60 inline-block px-12">
            <div className="text-7xl font-black text-amber-500 mb-2">{pct}%</div>
            <p className="text-lg text-zinc-700 font-bold">
              You scored {score} of {quiz.questions.length} correct!
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {answers.map((correct, i) => (
              <span
                key={i}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-xs ${
                  correct ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-rose-100 text-rose-700 border border-rose-300"
                }`}
              >
                {correct ? "✓" : "✗"}
              </span>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={reset}
              className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-md rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Try Another Quiz 🎯
            </button>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setFinished(false);
                setAnswers([]);
              }}
              className="px-6 py-3.5 bg-white border-2 border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold text-md rounded-xl transition-all"
            >
              Retry Quiz 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  if (quiz) {
    const currentQ = quiz.questions[currentQuestion];
    const isFillBlank = quiz.quizType === "fill_blank";

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={reset}
            className="px-4 py-2 bg-white hover:bg-zinc-50 text-zinc-700 font-bold rounded-xl border border-zinc-200/80 shadow-xs flex items-center gap-2 transition-colors"
          >
            <span>← Back to B1 quizzes</span>
          </button>
          <span className="text-xs font-black uppercase px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full tracking-wider">
            {isFillBlank ? "✍️ Sentence Missing Word" : "🔘 Multiple Choice (A, B, C, D)"}
          </span>
        </div>

        {isFillBlank ? (
          <FillBlankQuizCard
            key={`${currentQuestion}`}
            question={currentQ as any}
            onAnswer={handleAnswer}
            questionNumber={currentQuestion + 1}
            totalQuestions={quiz.questions.length}
          />
        ) : (
          <QuizCard
            key={`${currentQuestion}`}
            question={currentQ}
            onAnswer={handleAnswer}
            questionNumber={currentQuestion + 1}
            totalQuestions={quiz.questions.length}
          />
        )}

        <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-200/80 shadow-xs">
          <span className="text-md font-bold text-zinc-700 flex items-center gap-2">
            <span>🏆 Score:</span>
            <span className="text-emerald-600 font-black">{score} / {answers.length}</span>
          </span>
          {(currentQuestion < quiz.questions.length - 1 || answers.length === quiz.questions.length) && (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-yellow-400 text-zinc-900 font-extrabold rounded-xl hover:bg-yellow-500 transition-colors shadow-sm"
            >
              {currentQuestion < quiz.questions.length - 1 ? "Next Question →" : "See Results 🎉"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Quiz list
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight">
            ⚡ B1 Intermediate German Quizzes
          </h1>
          <p className="text-zinc-500 font-medium text-md">
            Master B1 grammar and expressions through instant sound-enabled interactive challenges powered by our central repository.
          </p>
        </div>
        <div className="shrink-0 flex items-center flex-wrap gap-1.5 bg-zinc-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              typeFilter === "all" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            All Types ({dynamicQuizzes.length})
          </button>
          <button
            onClick={() => setTypeFilter("multiple_choice")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              typeFilter === "multiple_choice" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            🔘 Multiple Choice
          </button>
          <button
            onClick={() => setTypeFilter("fill_blank")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              typeFilter === "fill_blank" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            ✍️ Missing Word
          </button>
          <Link
            href="/b1/exam"
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-1.5"
            title="Launch B1 Master Exam Simulator"
          >
            <span>👑 Master Exam</span>
            <span className="bg-white/90 px-1.5 py-0.5 rounded-full text-[10px] font-black uppercase text-indigo-950">Live</span>
          </Link>
        </div>
      </div>

      <SearchFilter
        items={displayedQuizzes}
        searchKeys={["title", "description"]}
        filterKey="category"
        filterLabel="Category"
        placeholder="Search B1 quizzes by topic or title..."
        render={(filtered) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((q) => {
              const isFillBlank = q.quizType === "fill_blank";
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuiz(q.id);
                    setCurrentQuestion(0);
                    setScore(0);
                    setFinished(false);
                    setAnswers([]);
                  }}
                  className="group bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-6 text-left hover:shadow-md hover:border-zinc-300 transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          {q.level}
                        </span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                          {isFillBlank ? "✍️ Missing Word" : "🔘 Multiple Choice (A/B/C/D)"}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-zinc-400">
                        {q.questions.length} Qs
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900 group-hover:text-amber-600 transition-colors mb-2">
                      {q.title}
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium line-clamp-2">
                      {q.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-sm font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                    <span>Start Challenge →</span>
                    <span className="text-xs text-zinc-400 font-normal">Sound Enabled 🔊</span>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center text-zinc-400 py-16 col-span-2 bg-white rounded-3xl border border-zinc-200/60 shadow-xs">
                <p className="text-4xl mb-2">🧐</p>
                <p className="text-lg font-bold text-zinc-700">No matching B1 quizzes found</p>
                <p className="text-sm text-zinc-400">Try adjusting your category filter or search keywords.</p>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
