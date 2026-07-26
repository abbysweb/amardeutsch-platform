"use client";

import { useState, useCallback, useEffect } from "react";
import { a1Exam as a1ExamRaw } from "@/levels/a1";
import { ProgressObserver } from "@/domain/observers/ProgressObserver";
import type { Exam, ExamSection } from "@/domain/entities/types";

const examData = a1ExamRaw as Exam;

export function Exam() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sectionScores, setSectionScores] = useState<Record<string, number>>({});
  const [forceResults, setForceResults] = useState(false);

  const section = examData.sections[currentSection];
  const totalSections = examData.sections.length;
  const isLastSection = currentSection === totalSections - 1;

  const calculateSectionScore = useCallback((sec: ExamSection) => {
    let score = 0;
    sec.questions?.forEach((q) => {
      const userAnswer = answers[q.id];
      if (userAnswer !== undefined) {
        if (q.type === "speaking") {
          if (userAnswer === "completed") score += q.points;
        } else if (typeof q.correctAnswer === "number") {
          if (userAnswer === q.correctAnswer) score += q.points;
        } else if (typeof q.correctAnswer === "string") {
          if (String(userAnswer).toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
            score += q.points;
          }
        }
      }
    });
    return score;
  }, [answers]);

  const handleAnswer = (questionId: number, answer: string | number) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    }
  };

  const submitSection = () => {
    if (!section) return;
    const score = calculateSectionScore(section);
    setSectionScores((prev) => ({ ...prev, [section.id]: score }));
    setSubmitted(true);
  };

  const goToNextSection = () => {
    if (!isLastSection && section) {
      setCurrentSection((prev) => prev + 1);
      setSubmitted(false);
    }
  };

  const getTotalScore = () => {
    return Object.values(sectionScores).reduce((sum, score) => sum + score, 0);
  };

  const getMaxTotalScore = () => {
    return examData.sections.reduce((sum, s) => sum + (s.questions?.reduce((s, q) => s + q.points, 0) ?? 0), 0);
  };

  const showResults = forceResults || (totalSections > 0 && Object.keys(sectionScores).length === totalSections);

  useEffect(() => {
    if (showResults) {
      const total = Object.values(sectionScores).reduce((sum, s) => sum + s, 0);
      const max = examData.sections.reduce((sum, s) => sum + (s.questions?.reduce((ss, q) => ss + q.points, 0) ?? 0), 0);
      ProgressObserver.onExamPassed(examData.level, examData.id, total, max);
    }
  }, [showResults, sectionScores, examData]);

  if (!section) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8 text-center">
          <p className="text-zinc-500">Exam data not available.</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const totalScore = getTotalScore();
    const maxScore = getMaxTotalScore();
    const pct = Math.round((totalScore / maxScore) * 100);
    const passed = pct >= examData.passingScore;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Exam Complete!</h1>
          <p className="text-zinc-500 mb-6">{examData.title}</p>

          <div className={`text-6xl font-bold mb-4 ${passed ? "text-green-500" : "text-red-500"}`}>
            {pct}%
          </div>
          <p className="text-lg text-zinc-700 mb-2">
            You scored {totalScore} out of {maxScore} points.
          </p>
          <p className={`text-lg font-medium ${passed ? "text-green-600" : "text-red-600"}`}>
            {passed ? "✅ PASSED - You're ready for A1!" : "❌ Not passed - Keep practicing"}
          </p>

          <div className="mt-8 space-y-4">
            {examData.sections.map((s) => {
              const secScore = sectionScores[s.id] || 0;
              const secMax = s.questions?.reduce((sum, q) => sum + q.points, 0) ?? 0;
              const secPct = secMax > 0 ? Math.round((secScore / secMax) * 100) : 0;
              return (
                <div key={s.id} className="bg-zinc-50 rounded-lg p-4 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{s.title}</span>
                    <span>{secScore}/{secMax} ({secPct}%)</span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        secPct >= s.passingScore ? "bg-green-400" : "bg-red-400"
                      }`}
                      style={{ width: `${secPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setCurrentSection(0);
              setAnswers({});
              setSubmitted(false);
              setSectionScores({});
              setForceResults(false);
            }}
            className="mt-8 px-6 py-3 bg-yellow-400 text-zinc-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Retake Exam
          </button>
        </div>
      </div>
    );
  }

  const maxSectionScore = section.questions?.reduce((sum, q) => sum + q.points, 0) ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{examData.title}</h1>
            <p className="text-zinc-500">{examData.description}</p>
          </div>
          <div className="text-right text-sm text-zinc-500">
            Section {currentSection + 1} of {totalSections}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-zinc-800">{section.title}</h2>
              <p className="text-sm text-zinc-500">{section.description}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-400">Time Limit</div>
              <div className="font-semibold text-yellow-600">{section.timeLimitMinutes} min</div>
            </div>
          </div>

          <div className="w-full bg-zinc-200 rounded-full h-2 mb-6">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
            />
          </div>

          {!submitted ? (
            <div className="space-y-6">
              {section.questions.map((question, idx) => (
                <div key={question.id} className="bg-zinc-50 rounded-lg p-5 border border-zinc-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-zinc-700">
                      Question {idx + 1} / {section.questions.length}
                    </span>
                    <span className="text-xs text-zinc-400 bg-white px-2 py-0.5 rounded">
                      {question.points} pts
                    </span>
                  </div>

                  <p className="text-zinc-900 font-medium mb-4">{question.question}</p>

                  {question.type === "multiple-choice" && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option: string, optIdx: number) => (
                        <button
                          key={optIdx}
                          onClick={() => !submitted && handleAnswer(question.id, optIdx)}
                          disabled={submitted}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                            answers[question.id] === optIdx
                              ? "bg-yellow-50 border-yellow-400 text-yellow-800"
                              : "bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
                          }`}
                        >
                          <span className="text-sm font-medium">{option}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {question.type === "fill-blank" && (
                    <input
                      type="text"
                      value={String(answers[question.id] || "")}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      disabled={submitted}
                      className="w-full px-4 py-3 rounded-lg border bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Type your answer..."
                    />
                  )}

                  {question.type === "translation" && (
                    <textarea
                      value={String(answers[question.id] || "")}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      disabled={submitted}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                      placeholder="Write your translation in German..."
                    />
                  )}

                  {question.type === "speaking" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                      <p className="text-green-800 text-sm mb-2">🎤 Speaking Exercise</p>
                      <p className="text-green-700 text-sm">
                        Practice saying this aloud. Record yourself and compare with native pronunciation.
                      </p>
                      <p className="text-green-600 text-sm mt-2 font-medium">
                        Expected answer: {typeof question.correctAnswer === "string" ? question.correctAnswer : "See explanation"}
                      </p>
                      <button
                        onClick={() => handleAnswer(question.id, "completed")}
                        disabled={submitted}
                        className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                      >
                        Mark as Practiced
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {section.questions.map((question, idx) => {
                const userAnswer = answers[question.id];
                let isCorrect = false;

                if (userAnswer !== undefined) {
                  if (question.type === "speaking") {
                    isCorrect = userAnswer === "completed";
                  } else if (typeof question.correctAnswer === "number") {
                    isCorrect = userAnswer === question.correctAnswer;
                  } else if (typeof question.correctAnswer === "string") {
                    isCorrect = String(userAnswer).toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
                  } else {
                    isCorrect = userAnswer === "completed";
                  }
                }

                return (
                  <div
                    key={question.id}
                    className={`rounded-lg p-5 border ${
                      isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-zinc-700">
                        Question {idx + 1}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>
                    <p className="text-zinc-900 font-medium mb-3">{question.question}</p>

                  {question.type === "multiple-choice" && "options" in question && question.options && (
                      <div className="space-y-2">
                      {(question as any).options.map((option: string, optIdx: number) => (
                          <div
                            key={optIdx}
                            className={`px-3 py-2 rounded border text-sm ${
                              optIdx === question.correctAnswer
                                ? "bg-green-50 border-green-300 text-green-800"
                                : optIdx === userAnswer && !isCorrect
                                ? "bg-red-50 border-red-300 text-red-800"
                                : "bg-white border-zinc-200 text-zinc-600"
                            }`}
                          >
                            {optIdx === question.correctAnswer && "✓ "}{option}
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === "fill-blank" && (
                      <div className="space-y-2">
                        <div className={`px-3 py-2 rounded border text-sm ${
                          isCorrect ? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-300 text-red-800"
                        }`}>
                          Your answer: {String(userAnswer) || "(empty)"}
                        </div>
                        <div className="px-3 py-2 rounded border border-green-300 bg-green-50 text-green-800 text-sm">
                          Correct: {question.correctAnswer}
                        </div>
                      </div>
                    )}

                    {question.type === "translation" && (
                      <div className="space-y-2">
                        <div className={`px-3 py-2 rounded border text-sm ${
                          isCorrect ? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-300 text-red-800"
                        }`}>
                          Your answer: {String(userAnswer) || "(empty)"}
                        </div>
                        <div className="px-3 py-2 rounded border border-green-300 bg-green-50 text-green-800 text-sm">
                          Suggested: {question.correctAnswer}
                        </div>
                      </div>
                    )}

                    {question.explanation && (
                      <p className="mt-3 text-sm text-zinc-500 italic bg-zinc-100 p-3 rounded">
                        {question.explanation}
                      </p>
                    )}
                  </div>
                );
              })}

              <div className="flex gap-3 justify-end">
                {isLastSection ? (
                  <button
                    onClick={() => {
                      if (section && !sectionScores[section.id]) {
                        setSectionScores((prev) => ({ ...prev, [section.id]: calculateSectionScore(section) }));
                      }
                      setForceResults(true);
                    }}
                    className="px-6 py-2.5 bg-yellow-400 text-zinc-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    See Final Results
                  </button>
                ) : (
                  <button
                    onClick={goToNextSection}
                    className="px-6 py-2.5 bg-yellow-400 text-zinc-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Next Section →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {!submitted && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={submitSection}
            className="px-6 py-3 bg-yellow-400 text-zinc-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Submit Section
          </button>
        </div>
      )}
    </div>
  );
}
