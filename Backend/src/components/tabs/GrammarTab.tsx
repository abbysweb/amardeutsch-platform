"use client";

import React, { useState, useEffect, useMemo } from 'react';

export default function GrammarTab() {
  const [grammar, setGrammar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ id: '', title: '', description: '', content: '', testable: false, levelId: 'a1', categoryId: '2' });
  const [isEditing, setIsEditing] = useState(false);
  const [previewingRule, setPreviewingRule] = useState<any | null>(null);

  useEffect(() => {
    fetchGrammar();
  }, [searchQuery]);

  const fetchGrammar = async () => {
    setLoading(true);
    try {
      const url = new URL(window.location.origin + '/backend/api/admin/grammar');
      if (searchQuery) url.searchParams.append('search', searchQuery);
      
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setGrammar(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const kpiStats = useMemo(() => {
    const total = grammar.length;
    const beginner = grammar.filter(g => ['a1', 'a2'].includes((g.levelId || '').toLowerCase())).length;
    const intermediate = grammar.filter(g => ['b1', 'b2', 'c1', 'c2'].includes((g.levelId || '').toLowerCase())).length;
    const withDetails = grammar.filter(g => g.content && g.content.length > 50).length;
    return { total, beginner, intermediate, withDetails };
  }, [grammar]);

  const filteredGrammar = useMemo(() => {
    return grammar.filter(g => (selectedLevel === 'all' || (g.levelId || '').toLowerCase() === selectedLevel));
  }, [grammar, selectedLevel]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/backend/api/admin/grammar';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowModal(false);
        notify(isEditing ? `✅ Successfully updated rule: "${formData.title}"` : `✅ Created grammar theory rule: "${formData.title}"`);
        fetchGrammar();
      } else {
        alert("Failed to save grammar rule.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete the grammar rule "${title}"?`)) return;
    try {
      const res = await fetch(`/backend/api/admin/grammar?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify(`🗑️ Deleted grammar rule "${title}".`);
        fetchGrammar();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openAddModal = () => {
    setFormData({ id: '', title: '', description: '', content: '', testable: false, levelId: 'a1', categoryId: '2' });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setFormData({ 
      id: item.id, 
      title: item.title, 
      description: item.description, 
      content: item.content || '', 
      testable: item.testable, 
      levelId: item.levelId, 
      categoryId: item.categoryId ? item.categoryId.toString() : '2'
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const getLevelBadge = (lvl: string) => {
    const l = (lvl || 'A1').toUpperCase();
    if (l === 'A1') return <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 fw-black px-3 py-1.5">Level A1</span>;
    if (l === 'A2') return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fw-black px-3 py-1.5">Level A2</span>;
    if (l === 'B1') return <span className="badge bg-warning bg-opacity-10 text-dark border border-warning border-opacity-50 fw-black px-3 py-1.5">Level B1</span>;
    if (l === 'B2') return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 fw-black px-3 py-1.5">Level B2</span>;
    return <span className="badge bg-secondary px-3 py-1.5">{l}</span>;
  };

  return (
    <div className="grammar-rules-studio pb-5 font-sans">
      
      {/* ===== ALERT FEEDBACK TOAST ===== */}
      {actionNotice && (
        <div className="alert alert-success bg-white border border-success border-2 shadow-sm rounded-3 d-flex align-items-center justify-content-between mb-4 py-3 px-4 animate-fade-in">
          <div className="d-flex align-items-center gap-2 fw-bold text-success">
            <i className="bi bi-shield-check fs-4"></i>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="btn-close btn-close-sm"></button>
        </div>
      )}

      {/* ===== EXECUTIVE KPI SUMMARY CARDS ===== */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-success rounded-4 p-3.5 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-success bg-success bg-opacity-10 rounded-3 m-1 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-journal-check"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase small fw-bold">Total Grammar Rules</span>
              <span className="info-box-number fs-3 fw-black text-dark mb-0">{kpiStats.total}</span>
              <span className="text-muted small">Active German rules</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-info rounded-4 p-3.5 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-info bg-info bg-opacity-10 rounded-3 m-1 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-bookmark-star-fill"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase small fw-bold">A1 & A2 Core Rules</span>
              <span className="info-box-number fs-3 fw-black text-info mb-0">{kpiStats.beginner}</span>
              <span className="text-muted small">Beginner foundations</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-warning rounded-4 p-3.5 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-warning bg-warning bg-opacity-10 rounded-3 m-1 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-mortarboard-fill"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase small fw-bold">B1 & B2 Advanced</span>
              <span className="info-box-number fs-3 fw-black text-dark mb-0">{kpiStats.intermediate}</span>
              <span className="text-muted small">Higher syntax rules</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-primary rounded-4 p-3.5 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-primary bg-primary bg-opacity-10 rounded-3 m-1 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-file-earmark-richtext-fill"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase small fw-bold">Theory Markdown</span>
              <span className="info-box-number fs-3 fw-black text-primary mb-0">{kpiStats.withDetails}</span>
              <span className="text-muted small">Full explanatory guides</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN DATABASE MANAGEMENT CARD ===== */}
      <div className="card card-outline card-success shadow-sm border-0 rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white py-4 px-4 d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom">
          <div className="d-flex align-items-center gap-2.5">
            <span className="p-2.5 rounded-3 bg-success bg-opacity-10 text-success fs-5 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-journal-text"></i>
            </span>
            <div>
              <h4 className="card-title mb-0 fw-black text-dark tracking-tight">Grammar Rules & Syntax Database</h4>
              <p className="text-muted small mb-0 mt-0.5">Manage German cases, word order, verb conjugation tables, and markdown theoretical guides.</p>
            </div>
          </div>
          <button 
            className="btn btn-success btn-sm fw-black d-flex align-items-center gap-2 px-4 py-2.5 rounded-3 shadow-sm ms-auto hover-success-dark" 
            onClick={openAddModal}
          >
            <i className="bi bi-plus-lg fs-6"></i>
            <span>Add New Grammar Rule</span>
          </button>
        </div>

        <div className="card-body p-4">
          
          {/* SLEEK FILTER & SEARCH TOOLBAR */}
          <div className="p-3 bg-light rounded-4 mb-4 border border-secondary-subtle d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3">
            
            {/* Level Filter Pills */}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="text-muted small fw-black text-uppercase tracking-wider me-1">
                <i className="bi bi-funnel-fill text-success me-1"></i>CEFR Band:
              </span>
              
              <div className="btn-group btn-group-sm shadow-2xs rounded-3 overflow-hidden" role="group">
                <button 
                  type="button" 
                  className={`btn px-3.5 py-1.5 fw-bold ${selectedLevel === 'all' ? 'btn-dark text-white' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => setSelectedLevel('all')}
                >
                  All Levels ({grammar.length})
                </button>
                <button 
                  type="button" 
                  className={`btn px-3.5 py-1.5 fw-bold ${selectedLevel === 'a1' ? 'btn-info text-white' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => setSelectedLevel('a1')}
                >
                  A1 ({grammar.filter(g => (g.levelId||'').toLowerCase()==='a1').length})
                </button>
                <button 
                  type="button" 
                  className={`btn px-3.5 py-1.5 fw-bold ${selectedLevel === 'a2' ? 'btn-primary' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => setSelectedLevel('a2')}
                >
                  A2 ({grammar.filter(g => (g.levelId||'').toLowerCase()==='a2').length})
                </button>
                <button 
                  type="button" 
                  className={`btn px-3.5 py-1.5 fw-bold ${selectedLevel === 'b1' ? 'btn-warning text-dark' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => setSelectedLevel('b1')}
                >
                  B1 ({grammar.filter(g => (g.levelId||'').toLowerCase()==='b1').length})
                </button>
                <button 
                  type="button" 
                  className={`btn px-3.5 py-1.5 fw-bold ${selectedLevel === 'b2' ? 'btn-success' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => setSelectedLevel('b2')}
                >
                  B2 ({grammar.filter(g => (g.levelId||'').toLowerCase()==='b2').length})
                </button>
              </div>
            </div>

            {/* Live Search Input */}
            <div className="input-group shadow-2xs rounded-3 overflow-hidden" style={{ maxWidth: "380px" }}>
              <span className="input-group-text bg-white border-end-0 text-secondary pe-2">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-1 py-2 text-sm fw-medium"
                placeholder="Search rule title or keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="btn btn-white bg-white text-muted border-start-0 border px-3" onClick={() => setSearchQuery("")} title="Clear search">
                  <i className="bi bi-x-circle-fill text-secondary"></i>
                </button>
              )}
            </div>
          </div>

          {/* ULTRA-CLEAN DATA TABLE */}
          {loading ? (
             <div className="text-center py-5 my-4">
               <div className="spinner-border text-success mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
               <h6 className="fw-bold text-dark">Synchronizing Grammar Rules...</h6>
               <p className="text-muted small">Querying SQLite syntax repository.</p>
             </div>
          ) : (
            <div className="table-responsive rounded-4 border border-secondary-subtle">
              <table className="table table-hover align-middle mb-0 bg-white">
                <thead className="bg-light border-bottom border-secondary-subtle">
                  <tr className="text-secondary small fw-extrabold text-uppercase tracking-wider">
                    <th style={{ minWidth: '220px' }} className="ps-4 py-3">Rule Title & Topic</th>
                    <th style={{ minWidth: '260px' }} className="py-3">Description & Summary</th>
                    <th className="py-3 text-center">Theory Guide</th>
                    <th className="py-3">CEFR Level</th>
                    <th style={{ width: '150px' }} className="text-center py-3">Quick Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrammar.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5 my-4 text-muted">
                        <i className="bi bi-journal-x fs-1 d-block mb-2 text-secondary opacity-50"></i>
                        <span className="fw-bold text-dark fs-6 d-block mb-1">No grammar rules match your specified parameters</span>
                        <small className="text-muted">Try switching CEFR level buttons above to view active grammar lessons.</small>
                      </td>
                    </tr>
                  ) : (
                    filteredGrammar.map(g => (
                      <tr key={g.id} className="transition-colors">
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-2.5">
                            <i className="bi bi-bookmark-fill text-success fs-5"></i>
                            <span className="fw-black text-dark fs-6">{g.title}</span>
                          </div>
                        </td>
                        <td className="text-secondary fw-medium small">{g.description}</td>
                        <td className="text-center">
                          {g.content && g.content.length > 20 ? (
                            <button 
                              onClick={() => setPreviewingRule(g)} 
                              className="btn btn-sm btn-light border text-primary fw-bold px-3 py-1 rounded-pill shadow-2xs d-inline-flex align-items-center gap-1.5"
                            >
                              <i className="bi bi-eye-fill"></i>
                              <span>View Markdown ({g.content.length} chars)</span>
                            </button>
                          ) : (
                            <span className="badge bg-light text-secondary border">Basic Outline</span>
                          )}
                        </td>
                        <td>{getLevelBadge(g.levelId)}</td>
                        <td className="text-center">
                          <div className="d-flex align-items-center justify-content-center gap-1.5">
                            <button 
                              className="btn btn-sm btn-light border text-secondary rounded-3 p-1.5 px-2.5 shadow-2xs hover-dark" 
                              title="Edit Grammar Theory" 
                              onClick={() => openEditModal(g)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-light border text-danger rounded-3 p-1.5 px-2.5 shadow-2xs hover-danger" 
                              title="Delete Rule" 
                              onClick={() => handleDelete(g.id, g.title)}
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredGrammar.length > 0 && (
            <div className="card-footer bg-light py-3 px-4 d-flex justify-content-between align-items-center text-muted small border-top border-secondary-subtle mt-2 rounded-bottom-4">
              <span className="d-flex align-items-center gap-1.5 fw-semibold text-secondary">
                <span className="badge bg-success rounded-circle p-1"></span>
                Syntax & Case Validation Engine Active
              </span>
              <span className="fw-semibold">Total Displayed Rules: <strong className="text-dark fw-black">{filteredGrammar.length}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* ===== THEORY PREVIEW DRAWER ===== */}
      {previewingRule && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-dark text-white p-4 d-flex align-items-center justify-content-between border-0">
                <div>
                  <span className="badge bg-success mb-1">Grammar Theory Dossier</span>
                  <h5 className="modal-title fw-black mb-0 text-white">{previewingRule.title}</h5>
                  <span className="text-white-50 small d-block">{previewingRule.description}</span>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setPreviewingRule(null)}></button>
              </div>
              
              <div className="modal-body p-4">
                <h6 className="text-uppercase text-secondary small fw-black mb-3 tracking-wider d-flex align-items-center gap-2">
                  <i className="bi bi-markdown-fill text-primary fs-5"></i>
                  <span>Theoretical Markdown Guide</span>
                </h6>
                <div className="p-4 bg-light rounded-4 border border-secondary-subtle shadow-inner font-monospace text-sm" style={{ whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
                  {previewingRule.content || "Keine erweiterte Erklärung für diese Grammatik-Regel verfügbar."}
                </div>
              </div>

              <div className="modal-footer bg-light px-4 py-3 border-top">
                <button type="button" className="btn btn-secondary fw-bold px-4 rounded-3" onClick={() => setPreviewingRule(null)}>Close Preview</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD / EDIT GRAMMAR RULE MODAL ===== */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-success text-white p-4 d-flex align-items-center justify-content-between border-0">
                <div className="d-flex align-items-center gap-2.5">
                  <span className="p-2.5 bg-white bg-opacity-25 rounded-3 text-white fs-4 d-flex align-items-center justify-content-center" style={{ width: "46px", height: "46px" }}>
                    <i className={`bi ${isEditing ? 'bi-journal-gear' : 'bi-journal-plus'}`}></i>
                  </span>
                  <div>
                    <h5 className="modal-title fw-black mb-0">{isEditing ? "Edit Grammar Rule" : "Register New Grammar Lesson"}</h5>
                    <span className="text-white-50 small d-block">Define syntax structures, case endings, and explanatory study content.</span>
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <form id="grammarForm" onSubmit={handleSave}>
                  
                  <h6 className="fw-black mb-3 text-dark d-flex align-items-center gap-2 text-uppercase text-xs tracking-wider">
                    <i className="bi bi-journal-check text-success fs-5"></i>
                    <span>Lesson Title & Classification</span>
                  </h6>

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-8">
                      <label className="form-label fw-bold small text-secondary">Rule Title <span className="text-danger">*</span></label>
                      <input required type="text" className="form-control rounded-3 py-2.5 border-2 fw-bold text-dark" placeholder="e.g. Definite Articles & Nominative Case" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-bold small text-secondary">CEFR Level <span className="text-danger">*</span></label>
                      <select className="form-select rounded-3 py-2.5 fw-black border-2" value={formData.levelId} onChange={e => setFormData({...formData, levelId: e.target.value})}>
                        <option value="a1">Level A1 (Beginner)</option>
                        <option value="a2">Level A2 (Elementary)</option>
                        <option value="b1">Level B1 (Intermediate)</option>
                        <option value="b2">Level B2 (Upper Inter.)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold small text-secondary">Short Summary Description <span className="text-danger">*</span></label>
                    <input required type="text" className="form-control rounded-3 py-2 border-2" placeholder="e.g. Understanding how der, die, das operate as grammatical subjects in German." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>

                  <hr className="my-4 border-secondary-subtle opacity-50"/>

                  <h6 className="fw-black mb-2 text-dark d-flex align-items-center gap-2 text-uppercase text-xs tracking-wider">
                    <i className="bi bi-file-earmark-markdown text-primary fs-5"></i>
                    <span>Theoretical Markdown Guide & Examples</span>
                  </h6>
                  
                  <div className="alert alert-light border rounded-3 py-2 px-3 small text-muted mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-lightbulb-fill text-warning fs-5"></i>
                    <span>Use bullet points, bold text, and German sentence examples to explain syntax clearly to learners.</span>
                  </div>

                  <div className="p-2 bg-light rounded-4 border border-secondary-subtle">
                    <textarea 
                      className="form-control rounded-3 border-0 bg-white p-3 font-monospace text-sm" 
                      rows={8} 
                      value={formData.content} 
                      onChange={e => setFormData({...formData, content: e.target.value})} 
                      placeholder="### Nominativ (Subject Case)&#10;&#10;The nominative case is used for the subject of a sentence—the person or thing performing the action.&#10;&#10;* **Der Mann** trinkt Kaffee. (The man drinks coffee)&#10;* **Die Frau** lernt Deutsch. (The woman learns German)"
                    ></textarea>
                  </div>
                </form>
              </div>

              <div className="modal-footer bg-light px-4 py-3.5 border-top d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary px-4 py-2.5 fw-bold rounded-3 bg-white" onClick={() => setShowModal(false)}>Cancel Operation</button>
                <button type="submit" form="grammarForm" className="btn btn-success px-5 py-2.5 fw-black shadow-sm rounded-3">
                  <i className="bi bi-check2-circle me-1.5 fs-6"></i>
                  <span>{isEditing ? "Update Grammar Rule" : "Publish to Database"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
