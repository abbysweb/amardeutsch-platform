"use client";

import React, { useState, useEffect } from 'react';

const CEFR_LEVELS = ["a1", "a2", "b1", "b2", "c1", "c2"];
const QUIZ_CATEGORIES = [
  "Word Types", "Articles", "Verb Conjugation", "Sentence Fill-in", 
  "Question Words", "Prepositions", "Adjectives", "General Grammar",
  "Master Exam", "Reading Comprehension", "Verbs & Tenses",
  "Adjectives & Adverbs", "Numbers & Time", "Cases (Nominativ/Akkusativ/Dativ)",
  "Sentence Structure", "Vocabulary & Meaning"
];

export default function QuizzesTab() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null as number | null,
    title: "",
    description: "",
    category: "Word Types",
    levelId: "a1",
    quizType: "multiple_choice" as "multiple_choice" | "fill_blank",
    questions: [] as any[]
  });

  useEffect(() => {
    fetchQuizzes();
  }, [selectedLevel, searchQuery]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const url = new URL(window.location.origin + '/backend/api/admin/quizzes');
      if (selectedLevel !== 'all') url.searchParams.append('level', selectedLevel);
      if (searchQuery) url.searchParams.append('search', searchQuery);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      title: "",
      description: "",
      category: "Word Types",
      levelId: "a1",
      quizType: "multiple_choice",
      questions: [
        {
          question: "",
          english: "",
          options: ["", "", "", ""],
          correctIndex: 0,
          explanation: "",
          sentenceBefore: "",
          blankWord: "",
          sentenceAfter: "",
          hint: ""
        }
      ]
    });
    setShowModal(true);
  };

  const handleOpenEdit = (quiz: any) => {
    setIsEditing(true);
    setFormData({
      id: quiz.id,
      title: quiz.title || "",
      description: quiz.description || "",
      category: quiz.category || "Word Types",
      levelId: (quiz.levelId || "a1").toLowerCase(),
      quizType: quiz.quizType || "multiple_choice",
      questions: (quiz.questions || []).map((q: any) => ({
        question: q.question || "",
        english: q.english || "",
        options: q.options ? (typeof q.options === "string" ? JSON.parse(q.options) : q.options) : ["", "", "", ""],
        correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
        explanation: q.explanation || "",
        sentenceBefore: q.sentenceBefore || "",
        blankWord: q.blankWord || "",
        sentenceAfter: q.sentenceAfter || "",
        hint: q.hint || ""
      }))
    });
    setShowModal(true);
  };

  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          english: "",
          options: ["", "", "", ""],
          correctIndex: 0,
          explanation: "",
          sentenceBefore: "",
          blankWord: "",
          sentenceAfter: "",
          hint: ""
        }
      ]
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const copy = [...prev.questions];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, questions: copy };
    });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    setFormData((prev) => {
      const copy = [...prev.questions];
      const opts = [...(copy[qIndex].options || ["", "", "", ""])];
      opts[optIndex] = value;
      copy[qIndex] = { ...copy[qIndex], options: opts };
      return { ...prev, questions: copy };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("Please enter a quiz title.");
    if (formData.questions.length === 0) return alert("Please add at least one question.");

    const method = isEditing ? 'PUT' : 'POST';
    const body = {
      id: formData.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      levelId: formData.levelId,
      quizType: formData.quizType,
      questions: formData.questions
    };

    try {
      const res = await fetch('/backend/api/admin/quizzes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setShowModal(false);
        fetchQuizzes();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save quiz.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving quiz.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this quiz and its questions?")) return;
    try {
      const res = await fetch(`/backend/api/admin/quizzes?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchQuizzes();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="card-title mb-0">CEFR Grammar Quizzes Management</h3>
        <button onClick={handleOpenCreate} className="btn btn-primary">
          <i className="bi bi-plus-circle me-1"></i> Add New Quiz
        </button>
      </div>

      <div className="card-body">
        {/* Filters and Search Bar */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search quiz title, topic or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-center justify-content-md-end gap-2">
              <label className="fw-bold mb-0">CEFR Level:</label>
              <select
                className="form-select w-auto"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="all">All Levels</option>
                {CEFR_LEVELS.map(level => (
                  <option key={level} value={level}>{level.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quizzes Table */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading grammar quizzes from DB...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="alert alert-info text-center my-4">
            No quizzes found for this filter. Click "Add New Quiz" above to create an interactive challenge!
          </div>
        ) : (
          <div className="table-responsive custom-scrollbar" style={{ maxHeight: 'calc(100vh - 240px)', overflowY: 'auto', overflowX: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <table className="table table-bordered table-hover align-middle mb-0">
              <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th style={{ width: '80px' }}>Level</th>
                  <th style={{ width: '150px' }}>Type</th>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th style={{ width: '100px' }}>Questions</th>
                  <th style={{ width: '140px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>
                      <span className="badge bg-success font-monospace fs-6">
                        {(quiz.levelId || "A1").toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${quiz.quizType === 'fill_blank' ? 'bg-info' : 'bg-warning text-dark'} fs-6`}>
                        {quiz.quizType === 'fill_blank' ? '✍️ Missing Word' : '🔘 Multiple Choice'}
                      </span>
                    </td>
                    <td>
                      <strong>{quiz.title}</strong>
                      <div className="text-muted small">{quiz.description}</div>
                    </td>
                    <td><span className="badge bg-secondary">{quiz.category}</span></td>
                    <td><strong>{quiz.questions?.length || 0}</strong> items</td>
                    <td className="text-center">
                      <button onClick={() => handleOpenEdit(quiz)} className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button onClick={() => handleDelete(quiz.id)} className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit Quiz */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">
                  {isEditing ? `Edit Quiz (#${formData.id})` : 'Create New Interactive Quiz'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  {/* Basic Quiz Settings */}
                  <div className="row g-3 mb-4 p-3 bg-light rounded border">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Quiz Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Welches Wort ist ein Nomen? / Articles Test"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">CEFR Level *</label>
                      <select
                        className="form-select font-monospace fw-bold"
                        value={formData.levelId}
                        onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
                      >
                        {CEFR_LEVELS.map(l => (
                          <option key={l} value={l}>{l.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">Quiz Type *</label>
                      <select
                        className="form-select fw-bold"
                        value={formData.quizType}
                        onChange={(e) => setFormData({ ...formData, quizType: e.target.value as any })}
                      >
                        <option value="multiple_choice">🔘 Multiple Choice (A, B, C, D)</option>
                        <option value="fill_blank">✍️ Sentence Missing Word Fill-Up</option>
                      </select>
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Description / Instructions</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Brief summary displayed to the learner..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Grammar Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {QUIZ_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-bold">Questions ({formData.questions.length})</h5>
                    <button type="button" onClick={handleAddQuestion} className="btn btn-outline-success btn-sm">
                      <i className="bi bi-plus-circle me-1"></i> + Add Another Question
                    </button>
                  </div>

                  {formData.questions.map((q, qIndex) => (
                    <div key={qIndex} className="card mb-4 border-2 shadow-sm">
                      <div className="card-header bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Question #{qIndex + 1}</span>
                        {formData.questions.length > 1 && (
                          <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i> Remove
                          </button>
                        )}
                      </div>
                      <div className="card-body">
                        {formData.quizType === 'multiple_choice' ? (
                          <>
                            <div className="row g-3 mb-3">
                              <div className="col-md-6">
                                <label className="form-label fw-bold">Question Text (German) *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="e.g., Welches Wort ist ein Nomen?"
                                  value={q.question}
                                  onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">English Translation (optional)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="e.g., Which word is a noun?"
                                  value={q.english}
                                  onChange={(e) => handleQuestionChange(qIndex, "english", e.target.value)}
                                />
                              </div>
                            </div>

                            <label className="form-label fw-bold mb-2">Options (A, B, C, D) & Correct Answer</label>
                            <div className="row g-2 mb-3">
                              {(q.options || ["", "", "", ""]).map((opt: string, oIdx: number) => {
                                const letter = String.fromCharCode(65 + oIdx);
                                const isCorrect = Number(q.correctIndex) === oIdx;
                                return (
                                  <div key={oIdx} className="col-md-6">
                                    <div className={`input-group ${isCorrect ? 'border border-success rounded' : ''}`}>
                                      <span className={`input-group-text fw-bold ${isCorrect ? 'bg-success text-white' : ''}`}>
                                        Option {letter}
                                      </span>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder={`Answer option ${letter}...`}
                                        value={opt}
                                        onChange={(e) => handleOptionChange(qIndex, oIdx, e.target.value)}
                                        required
                                      />
                                      <div className="input-group-text">
                                        <input
                                          className="form-check-input mt-0 me-2"
                                          type="radio"
                                          name={`correct-${qIndex}`}
                                          checked={isCorrect}
                                          onChange={() => handleQuestionChange(qIndex, "correctIndex", oIdx)}
                                        />
                                        <small className="fw-bold text-success">Correct</small>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Fill in blank fields */}
                            <div className="row g-3 mb-3">
                              <div className="col-md-4">
                                <label className="form-label">Sentence Before Blank</label>
                                <input
                                  type="text"
                                  className="form-control font-monospace"
                                  placeholder="e.g., Ich"
                                  value={q.sentenceBefore}
                                  onChange={(e) => handleQuestionChange(qIndex, "sentenceBefore", e.target.value)}
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label fw-bold text-primary">Target Blank Word *</label>
                                <input
                                  type="text"
                                  className="form-control font-monospace border-primary fw-bold text-center"
                                  placeholder="e.g., komme"
                                  value={q.blankWord}
                                  onChange={(e) => handleQuestionChange(qIndex, "blankWord", e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label">Sentence After Blank</label>
                                <input
                                  type="text"
                                  className="form-control font-monospace"
                                  placeholder="e.g., aus Frankfurt."
                                  value={q.sentenceAfter}
                                  onChange={(e) => handleQuestionChange(qIndex, "sentenceAfter", e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="row g-3 mb-3">
                              <div className="col-md-6">
                                <label className="form-label">Grammar Hint (optional)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="e.g., Infinitive: kommen (1st person singular)"
                                  value={q.hint}
                                  onChange={(e) => handleQuestionChange(qIndex, "hint", e.target.value)}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">English Translation (optional)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="e.g., I come from Frankfurt."
                                  value={q.english}
                                  onChange={(e) => handleQuestionChange(qIndex, "english", e.target.value)}
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="mt-2">
                          <label className="form-label text-muted small fw-bold">Grammar Explanation / Rule Note (shown after answering)</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Why is this answer correct? Explain noun gender, conjugation rules or word types..."
                            value={q.explanation}
                            onChange={(e) => handleQuestionChange(qIndex, "explanation", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold px-4">
                    <i className="bi bi-save me-1"></i> Save Quiz to CEFR Database
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
