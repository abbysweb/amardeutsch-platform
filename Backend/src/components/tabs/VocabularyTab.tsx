"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Papa from 'papaparse';

const VOCAB_CATEGORIES = [
  "Basics","Greetings","Verbs","Transport","Food","Objects","Education","Travel","Health",
  "Pronouns","People","Family","Home","Numbers","Body","Adjectives","Time","Animals",
  "Nature","Prepositions","Questions","Professions","Places","Shopping","Feelings",
  "Directions","Conjunctions","Months","Seasons","Kitchen","Hobbies","Positions",
  "Clothes","Work","Weather","General","Daily Life","Technology","Work & Career",
  "Environment & Climate","Media & Technology","Politics & Society","Health & Medicine"
];

export default function VocabularyTab() {
  const [vocab, setVocab] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 35;

  const [formData, setFormData] = useState({
    id: '', german: '', english: '', article: '', plural: '',
    levelId: 'a1', categoryName: 'Basics',
    germanSentence: '', englishSentence: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVocab();
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLevel, searchQuery]);

  const fetchVocab = async () => {
    setLoading(true);
    try {
      const url = new URL(window.location.origin + '/backend/api/admin/vocab');
      if (searchQuery) url.searchParams.append('search', searchQuery);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setVocab(data);
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

  // Real Database Metrics Computations (100% Original Data)
  const kpiStats = useMemo(() => {
    const total = vocab.length;
    const withSentences = vocab.filter(v => v.germanSentence && v.germanSentence.trim() !== "").length;
    const advanced = vocab.filter(v => ['b1', 'b2', 'c1', 'c2'].includes((v.levelId || '').toLowerCase())).length;
    const uniqueCategories = new Set(vocab.map(v => v.category || v.categoryId || 'General')).size;
    return { total, withSentences, advanced, uniqueCategories };
  }, [vocab]);

  const getCategoryId = (name: string): number => {
    const idx = VOCAB_CATEGORIES.indexOf(name);
    return idx >= 0 ? idx + 1 : 1;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        categoryId: getCategoryId(formData.categoryName).toString()
      };
      const url = '/backend/api/admin/vocab';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        notify(isEditing ? `✅ Updated vocabulary entry: "${formData.german}"` : `✅ Added new vocabulary word: "${formData.german}"`);
        fetchVocab();
      } else {
        alert("Failed to save vocabulary. It might be a duplicate!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number, word: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${word}" from the database?`)) return;
    try {
      const res = await fetch(`/backend/api/admin/vocab?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify(`🗑️ Deleted "${word}" from system repository.`);
        fetchVocab();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const payload = results.data.map((row: any) => ({
          german: row['German'] || row['german'],
          english: row['English'] || row['english'],
          article: row['Article'] || row['article'] || '',
          plural: row['Plural'] || row['plural'] || '',
          levelId: (row['Level'] || row['level'] || 'a1').toLowerCase(),
          categoryId: row['Category'] || row['category'] || 1,
          germanSentence: row['German Sentence'] || row['germanSentence'] || null,
          englishSentence: row['English Sentence'] || row['englishSentence'] || null,
        }));

        setLoading(true);
        try {
          const res = await fetch('/backend/api/admin/vocab/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const json = await res.json();
          notify(json.message || `✅ Successfully bulk imported ${payload.length} items.`);
          fetchVocab();
        } catch (e) {
          console.error(e);
          alert("Error processing bulk upload");
        }
        setLoading(false);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateSentences = async () => {
    if (!confirm("This will trigger the automatic engine to generate authentic example sentences for all vocabulary items lacking sentence examples. Continue?")) return;
    setGenerating(true);
    try {
      const res = await fetch('/backend/api/admin/vocab/generate-sentences', { method: 'POST' });
      const json = await res.json();
      notify(`🌟 Auto-generation finished: ${json.updated} words supplemented with authentic example sentences!`);
      fetchVocab();
    } catch (e) {
      console.error(e);
      alert("Failed to generate sentences.");
    }
    setGenerating(false);
  };

  const openAddModal = () => {
    setFormData({
      id: '', german: '', english: '', article: '', plural: '',
      levelId: 'a1', categoryName: 'Basics',
      germanSentence: '', englishSentence: ''
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (word: any) => {
    setFormData({
      id: word.id,
      german: word.german,
      english: word.english,
      article: word.article || '',
      plural: word.plural || '',
      levelId: word.levelId,
      categoryName: word.category || 'Basics',
      germanSentence: word.germanSentence || '',
      englishSentence: word.englishSentence || ''
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const filteredVocab = useMemo(() => {
    return vocab.filter(v => (selectedLevel === 'all' || (v.levelId || '').toLowerCase() === selectedLevel));
  }, [vocab, selectedLevel]);

  const totalPages = Math.ceil(filteredVocab.length / itemsPerPage) || 1;
  const currentData = useMemo(() => {
    return filteredVocab.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredVocab, currentPage, itemsPerPage]);

  const getArticleBadge = (art: string) => {
    if (!art) return null;
    const lower = art.toLowerCase().trim();
    if (lower === 'der') return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-0.5 small fw-black">der</span>;
    if (lower === 'die') return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-0.5 small fw-black">die</span>;
    if (lower === 'das') return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-0.5 small fw-black">das</span>;
    return <span className="badge bg-secondary px-2 py-0.5">{art}</span>;
  };

  const getLevelBadge = (lvl: string) => {
    const l = (lvl || 'A1').toUpperCase();
    if (l === 'A1') return <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 fw-black px-2.5 py-1">Level A1</span>;
    if (l === 'A2') return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fw-black px-2.5 py-1">Level A2</span>;
    if (l === 'B1') return <span className="badge bg-warning bg-opacity-10 text-dark border border-warning border-opacity-50 fw-black px-2.5 py-1">Level B1</span>;
    if (l === 'B2') return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 fw-black px-2.5 py-1">Level B2</span>;
    return <span className="badge bg-secondary px-2.5 py-1">{l}</span>;
  };

  return (
    <div className="vocabulary-database-studio pb-5 font-sans">
      
      {/* ===== ALERT FEEDBACK TOAST ===== */}
      {actionNotice && (
        <div className="alert alert-success bg-white border border-success border-2 shadow-sm rounded-3 d-flex align-items-center justify-content-between mb-4 py-3 px-4 animate-fade-in">
          <div className="d-flex align-items-center gap-2 fw-bold text-success">
            <i className="bi bi-check-circle-fill fs-4"></i>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="btn-close btn-close-sm"></button>
        </div>
      )}

      {/* ===== EXECUTIVE KPI SUMMARY CARDS ===== */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-warning rounded-4 p-3.5 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-warning bg-warning bg-opacity-10 rounded-3 m-1 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-book-half"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase small fw-bold">Total SQLite Vocabulary</span>
              <span className="info-box-number fs-3 fw-black text-dark mb-0">{kpiStats.total.toLocaleString()}</span>
              <span className="text-muted small">Verified vocabulary entries</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-success rounded-4 p-3.5 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-success bg-success bg-opacity-10 rounded-3 m-1 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-chat-quote-fill"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase small fw-bold">Example Sentences</span>
              <span className="info-box-number fs-3 fw-black text-success mb-0">{kpiStats.withSentences.toLocaleString()}</span>
              <span className="text-muted small">Synchronized flashcard backs</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-primary rounded-4 p-3.5 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-primary bg-primary bg-opacity-10 rounded-3 m-1 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-bar-chart-steps"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase small fw-bold">B1 & B2 Advanced Words</span>
              <span className="info-box-number fs-3 fw-black text-primary mb-0">{kpiStats.advanced.toLocaleString()}</span>
              <span className="text-muted small">Higher fluency difficulty</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-info rounded-4 p-3.5 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-info bg-info bg-opacity-10 rounded-3 m-1 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-folder2-open"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase small fw-bold">Lexical Categories</span>
              <span className="info-box-number fs-3 fw-black text-dark mb-0">{kpiStats.uniqueCategories}</span>
              <span className="text-muted small">Thematic vocabulary fields</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN DATABASE MANAGEMENT CARD ===== */}
      <div className="card card-outline card-warning shadow-sm border-0 rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white py-4 px-4 d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom">
          <div className="d-flex align-items-center gap-2.5">
            <span className="p-2.5 rounded-3 bg-warning bg-opacity-10 text-warning fs-5 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
              <i className="bi bi-journal-album text-dark"></i>
            </span>
            <div>
              <h4 className="card-title mb-0 fw-black text-dark tracking-tight">Vocabulary & Flashcard Studio</h4>
              <p className="text-muted small mb-0 mt-0.5">Manage genuine CEFR dictionary words, plural forms, genders (der, die, das), and sentence contextual examples.</p>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            <input type="file" accept=".csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
            <button 
              className="btn btn-outline-dark btn-sm fw-bold d-flex align-items-center gap-1.5 px-3 py-2.5 rounded-3 shadow-2xs bg-white" 
              onClick={() => fileInputRef.current?.click()}
              title="Upload CSV Vocabulary Catalog"
            >
              <i className="bi bi-cloud-upload-fill text-primary"></i>
              <span>Bulk Import CSV</span>
            </button>
            <button 
              className="btn btn-outline-primary btn-sm fw-bold d-flex align-items-center gap-1.5 px-3 py-2.5 rounded-3 shadow-2xs bg-white" 
              onClick={handleGenerateSentences} 
              disabled={generating}
            >
              <i className={`bi ${generating ? 'bi-arrow-repeat spin text-primary' : 'bi-magic text-warning'}`}></i>
              <span>{generating ? 'Generating Examples...' : 'Auto-Generate Sentences'}</span>
            </button>
            <button 
              className="btn btn-warning btn-sm fw-black d-flex align-items-center gap-2 px-4 py-2.5 rounded-3 shadow-sm text-dark hover-warning" 
              onClick={openAddModal}
            >
              <i className="bi bi-plus-lg fs-6"></i>
              <span>Add New Vocabulary</span>
            </button>
          </div>
        </div>

        <div className="card-body p-4">
          
          {/* SLEEK FILTER & SEARCH TOOLBAR */}
          <div className="p-3 bg-light rounded-4 mb-4 border border-secondary-subtle d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3">
            
            {/* Level Filter Pills */}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="text-muted small fw-black text-uppercase tracking-wider me-1">
                <i className="bi bi-funnel-fill text-warning me-1"></i>CEFR Filter:
              </span>
              
              <div className="btn-group btn-group-sm shadow-2xs rounded-3 overflow-hidden" role="group">
                <button 
                  type="button" 
                  className={`btn px-3.5 py-1.5 fw-bold ${selectedLevel === 'all' ? 'btn-dark text-white' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => setSelectedLevel('all')}
                >
                  All Levels ({vocab.length})
                </button>
                <button 
                  type="button" 
                  className={`btn px-3.5 py-1.5 fw-bold ${selectedLevel === 'a1' ? 'btn-info text-white' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => setSelectedLevel('a1')}
                >
                  A1 ({vocab.filter(v => (v.levelId||'').toLowerCase()==='a1').length})
                </button>
                <button 
                  type="button" 
                  className={`btn px-3.5 py-1.5 fw-bold ${selectedLevel === 'a2' ? 'btn-primary' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => setSelectedLevel('a2')}
                >
                  A2 ({vocab.filter(v => (v.levelId||'').toLowerCase()==='a2').length})
                </button>
                <button 
                  type="button" 
                  className={`btn px-3.5 py-1.5 fw-bold ${selectedLevel === 'b1' ? 'btn-warning text-dark' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => setSelectedLevel('b1')}
                >
                  B1 ({vocab.filter(v => (v.levelId||'').toLowerCase()==='b1').length})
                </button>
                <button 
                  type="button" 
                  className={`btn px-3.5 py-1.5 fw-bold ${selectedLevel === 'b2' ? 'btn-success' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => setSelectedLevel('b2')}
                >
                  B2 ({vocab.filter(v => (v.levelId||'').toLowerCase()==='b2').length})
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
                placeholder="Search German, English, or sentences..." 
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
               <div className="spinner-border text-warning mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
               <h6 className="fw-bold text-dark">Synchronizing Vocabulary Catalog...</h6>
               <p className="text-muted small">Retrieving uncorrupted words directly from the SQLite database.</p>
             </div>
          ) : (
            <div className="table-responsive rounded-4 border border-secondary-subtle">
              <table className="table table-hover align-middle mb-0 bg-white">
                <thead className="bg-light border-bottom border-secondary-subtle">
                  <tr className="text-secondary small fw-extrabold text-uppercase tracking-wider">
                    <th style={{ width: '45px' }} className="ps-3 py-3 text-center">Preview</th>
                    <th style={{ minWidth: '180px' }} className="py-3">German Vocabulary</th>
                    <th style={{ minWidth: '180px' }} className="py-3">English Translation</th>
                    <th className="py-3 text-center">Plural Form</th>
                    <th className="py-3">CEFR Band</th>
                    <th className="py-3">Thematic Category</th>
                    <th style={{ width: '130px' }} className="text-center py-3">Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5 my-4 text-muted">
                        <i className="bi bi-folder2-open fs-1 d-block mb-2 text-secondary opacity-50"></i>
                        <span className="fw-bold text-dark fs-6 d-block mb-1">No vocabulary entries match your search criteria</span>
                        <small className="text-muted">Try clearing search inputs or switching CEFR level tabs above.</small>
                      </td>
                    </tr>
                  ) : (
                    currentData.map(v => (
                      <React.Fragment key={v.id}>
                        <tr className="transition-colors">
                          <td className="text-center ps-3">
                            <button
                              className={`btn btn-sm ${expandedRow === v.id ? 'btn-warning text-dark' : 'btn-light border text-secondary'} rounded-circle p-0 d-inline-flex align-items-center justify-content-center shadow-2xs`}
                              style={{ width: '28px', height: '28px' }}
                              onClick={() => setExpandedRow(expandedRow === v.id ? null : v.id)}
                              title="Toggle Flashcard Sentence Example"
                            >
                              <i className={`bi ${expandedRow === v.id ? 'bi-chevron-up' : 'bi-chevron-down'} small`}></i>
                            </button>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {getArticleBadge(v.article)}
                              <span className="fw-black text-dark fs-6">{v.german}</span>
                            </div>
                          </td>
                          <td className="fw-bold text-secondary">{v.english}</td>
                          <td className="text-center text-muted small fw-bold">
                            {v.plural ? `Die ${v.plural}` : <span className="opacity-25">—</span>}
                          </td>
                          <td>{getLevelBadge(v.levelId)}</td>
                          <td>
                            <span className="badge bg-light text-dark border border-secondary-subtle px-2.5 py-1 fw-bold">
                              <i className="bi bi-folder-fill text-warning me-1.5"></i>
                              {v.category || v.categoryId || "General"}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="d-flex align-items-center justify-content-center gap-1.5">
                              <button 
                                className="btn btn-sm btn-light border text-secondary rounded-3 p-1.5 px-2.5 shadow-2xs hover-dark" 
                                title="Edit Word & Example Sentences" 
                                onClick={() => openEditModal(v)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-light border text-danger rounded-3 p-1.5 px-2.5 shadow-2xs hover-danger" 
                                title="Delete Vocabulary Word" 
                                onClick={() => handleDelete(v.id, v.german)}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Example Sentences Preview Row */}
                        {expandedRow === v.id && (
                          <tr className="bg-light bg-opacity-50">
                            <td colSpan={7} className="p-4 border-start border-end border-warning border-3 bg-light">
                              <div className="d-flex align-items-start gap-3">
                                <span className="p-2.5 rounded-3 bg-warning bg-opacity-25 text-dark fw-bold shrink-0 mt-1">
                                  <i className="bi bi-card-text fs-5"></i>
                                </span>
                                <div className="flex-grow-1">
                                  <h6 className="text-dark fw-black mb-1 text-uppercase small tracking-wider">Flashcard Back Example Sentences</h6>
                                  {v.germanSentence || v.englishSentence ? (
                                    <div className="p-3 bg-white rounded-3 border shadow-2xs mt-2">
                                      <div className="fw-black text-dark fs-6 d-flex align-items-center gap-2 mb-1">
                                        <span className="badge bg-primary px-2 py-0.5 text-xs">DE</span>
                                        <span>{v.germanSentence || "Kein Beispielsatz vorhanden."}</span>
                                      </div>
                                      <div className="text-secondary small fw-medium d-flex align-items-center gap-2">
                                        <span className="badge bg-secondary px-2 py-0.5 text-xs">EN</span>
                                        <span>{v.englishSentence || "No English sentence translation provided yet."}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-3 bg-white rounded-3 border text-muted small mt-2 d-flex justify-content-between align-items-center">
                                      <span>No example sentences assigned to this flashcard word yet.</span>
                                      <button className="btn btn-sm btn-outline-warning text-dark fw-bold px-3 py-1" onClick={() => openEditModal(v)}>
                                        <i className="bi bi-plus-circle me-1"></i> Add Sentence Now
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* CLEAN PAGINATION RIBBON */}
          {!loading && filteredVocab.length > 0 && (
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 pt-4 mt-2">
              <span className="text-secondary small fw-medium">
                Showing <strong className="text-dark">{(currentPage - 1) * itemsPerPage + 1}</strong> – <strong className="text-dark">{Math.min(currentPage * itemsPerPage, filteredVocab.length)}</strong> of <strong className="text-dark">{filteredVocab.length}</strong> words
              </span>

              <nav aria-label="Table navigation">
                <ul className="pagination pagination-sm mb-0 gap-1">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link rounded-3 px-3 fw-bold shadow-2xs border-secondary-subtle" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>
                      <i className="bi bi-chevron-left me-1"></i> Prev
                    </button>
                  </li>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
                    if (pageNum > totalPages) return null;
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button 
                          className={`page-link rounded-3 px-3 fw-black shadow-2xs ${currentPage === pageNum ? 'bg-warning text-dark border-warning' : 'border-secondary-subtle'}`} 
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link rounded-3 px-3 fw-bold shadow-2xs border-secondary-subtle" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>
                      Next <i className="bi bi-chevron-right ms-1"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* ===== ADD / EDIT VOCABULARY MODAL ===== */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-warning text-dark p-4 d-flex align-items-center justify-content-between border-0">
                <div className="d-flex align-items-center gap-2.5">
                  <span className="p-2 bg-white bg-opacity-50 rounded-3 text-dark fs-4 d-flex align-items-center justify-content-center" style={{ width: "46px", height: "46px" }}>
                    <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-circle-fill'}`}></i>
                  </span>
                  <div>
                    <h5 className="modal-title fw-black mb-0">{isEditing ? "Edit Flashcard Entry" : "Register New German Word"}</h5>
                    <span className="text-dark small opacity-75 d-block">Specify noun articles, plural variants, and contextual sentence flashcards.</span>
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <form id="vocabForm" onSubmit={handleSave}>
                  
                  <h6 className="fw-black mb-3 text-dark d-flex align-items-center gap-2 text-uppercase text-xs tracking-wider">
                    <i className="bi bi-book-half text-warning fs-5"></i>
                    <span>Core Lexical Definition</span>
                  </h6>

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold small text-secondary">German Word / Phrase <span className="text-danger">*</span></label>
                      <input required type="text" className="form-control rounded-3 py-2.5 border-2 fw-bold text-dark" placeholder="e.g. Bahnhof" value={formData.german} onChange={e => setFormData({...formData, german: e.target.value})} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold small text-secondary">English Translation <span className="text-danger">*</span></label>
                      <input required type="text" className="form-control rounded-3 py-2.5 border-2 fw-semibold" placeholder="e.g. Train Station" value={formData.english} onChange={e => setFormData({...formData, english: e.target.value})} />
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-3">
                      <label className="form-label fw-bold small text-secondary">Article (Gender)</label>
                      <select className="form-select rounded-3 py-2.5 fw-bold border-2" value={formData.article} onChange={e => setFormData({...formData, article: e.target.value})}>
                        <option value="">None / Phrase</option>
                        <option value="der">der (Masculine)</option>
                        <option value="die">die (Feminine)</option>
                        <option value="das">das (Neuter)</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label fw-bold small text-secondary">Plural Suffix</label>
                      <input type="text" className="form-control rounded-3 py-2.5 border-2" placeholder="-e, -en, -er" value={formData.plural} onChange={e => setFormData({...formData, plural: e.target.value})} />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label fw-bold small text-secondary">CEFR Level <span className="text-danger">*</span></label>
                      <select className="form-select rounded-3 py-2.5 fw-black border-2" value={formData.levelId} onChange={e => setFormData({...formData, levelId: e.target.value})}>
                        <option value="a1">Level A1 (Beginner)</option>
                        <option value="a2">Level A2 (Elementary)</option>
                        <option value="b1">Level B1 (Intermediate)</option>
                        <option value="b2">Level B2 (Upper Inter.)</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label fw-bold small text-secondary">Category</label>
                      <select className="form-select rounded-3 py-2.5 fw-semibold border-2" value={formData.categoryName} onChange={e => setFormData({...formData, categoryName: e.target.value})}>
                        {VOCAB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <hr className="my-4 border-secondary-subtle opacity-50"/>

                  <h6 className="fw-black mb-2 text-dark d-flex align-items-center gap-2 text-uppercase text-xs tracking-wider">
                    <i className="bi bi-card-text text-primary fs-5"></i>
                    <span>Flashcard Back (Example Sentences)</span>
                  </h6>
                  
                  <div className="alert alert-light border rounded-3 py-2 px-3 small text-muted mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-info-circle-fill text-primary fs-5"></i>
                    <span>Example sentences display on the back of interactive study flashcards during learner study rounds.</span>
                  </div>

                  <div className="row g-3 p-3.5 bg-light rounded-4 border border-secondary-subtle">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold small text-secondary">German Example Sentence</label>
                      <textarea
                        className="form-control rounded-3 border-2 bg-white"
                        rows={2}
                        placeholder="e.g., Wo ist der Bahnhof?"
                        value={formData.germanSentence}
                        onChange={e => setFormData({...formData, germanSentence: e.target.value})}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold small text-secondary">English Sentence Translation</label>
                      <textarea
                        className="form-control rounded-3 border-2 bg-white"
                        rows={2}
                        placeholder="e.g., Where is the train station?"
                        value={formData.englishSentence}
                        onChange={e => setFormData({...formData, englishSentence: e.target.value})}
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer bg-light px-4 py-3.5 border-top d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary px-4 py-2.5 fw-bold rounded-3 bg-white" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" form="vocabForm" className="btn btn-warning text-dark px-5 py-2.5 fw-black shadow-sm rounded-3 hover-warning">
                  <i className="bi bi-check2-circle me-1.5 fs-6"></i>
                  <span>{isEditing ? "Update Vocabulary Record" : "Save Word to Database"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
