"use client";

import { useState, useMemo } from "react";

const FILES = [
  "../data/customContent.json", // The custom content database
  "a1/grammar/data.json",
  "a1/vocab/data.json",
  "a1/quizzes/data.json",
  "a1/sentences/data.json",
  "a2/grammar/data.json",
  "a2/vocab/data.json",
  "b1/grammar/data.json",
  "b1/vocab/data.json",
];

const ITEMS_PER_PAGE = 20;

export default function ModernUnifiedCMS() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileData, setFileData] = useState<any[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  
  // Editor State
  const [editingItem, setEditingItem] = useState<{ index: number, data: any } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const loadFile = async (path: string) => {
    setIsLoading(true);
    setSelectedFile(path);
    setSearchTerm("");
    setCurrentPage(1);
    setSelectedItems(new Set());
    setEditingItem(null);
    setFileData(null);
    setStatusMsg("");
    try {
      const res = await fetch(`/api/admin/fs?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setFileData(data);
      } else {
        setStatusMsg("❌ File does not contain a JSON array.");
      }
    } catch (err) {
      setStatusMsg("❌ Failed to load file.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveFile = async (dataToSave: any[] = fileData || []) => {
    if (!selectedFile) return;
    setIsSaving(true);
    setStatusMsg("");
    try {
      const res = await fetch(`/api/admin/fs?path=${encodeURIComponent(selectedFile)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      if (res.ok) {
        setStatusMsg("✅ Saved successfully!");
        setFileData(dataToSave);
        setTimeout(() => setStatusMsg(""), 3000);
      } else {
        setStatusMsg("❌ Failed to save.");
      }
    } catch (err) {
      setStatusMsg("❌ Error saving file.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Bulk Actions & Selection ---
  const toggleSelection = (idx: number) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(idx)) newSet.delete(idx);
    else newSet.add(idx);
    setSelectedItems(newSet);
  };

  const toggleAll = (visibleIndices: number[]) => {
    if (selectedItems.size === visibleIndices.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(visibleIndices));
    }
  };

  const deleteSelected = async () => {
    if (!fileData || selectedItems.size === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedItems.size} items?`)) return;
    
    const newData = fileData.filter((_, idx) => !selectedItems.has(idx));
    setSelectedItems(new Set());
    await saveFile(newData);
  };

  // --- Editor Logic ---
  const openEditor = (idx: number) => {
    if (!fileData) return;
    // Deep clone the object for safe editing
    setEditingItem({ index: idx, data: JSON.parse(JSON.stringify(fileData[idx])) });
  };

  const createNewEntry = () => {
    if (!fileData) return;
    const blankObj: any = {};
    if (fileData.length > 0) {
      Object.keys(fileData[0]).forEach(key => {
        const val = fileData[0][key];
        if (Array.isArray(val)) blankObj[key] = [];
        else if (typeof val === "number") blankObj[key] = 0;
        else if (typeof val === "boolean") blankObj[key] = false;
        else blankObj[key] = "";
      });
      if ('id' in blankObj) blankObj.id = Date.now().toString();
    } else {
      blankObj.id = Date.now().toString();
      blankObj.title = "New Title";
    }

    const newData = [blankObj, ...fileData];
    setFileData(newData);
    setEditingItem({ index: 0, data: blankObj });
  };

  const saveEditor = () => {
    if (!fileData || !editingItem) return;
    const newData = [...fileData];
    newData[editingItem.index] = editingItem.data;
    setEditingItem(null);
    saveFile(newData);
  };

  const insertRichText = (field: string, before: string, after: string = "") => {
    if (!editingItem) return;
    const currentVal = editingItem.data[field] || "";
    // Extremely simplified rich text injection for demo
    const newVal = currentVal + " " + before + "text" + after + " ";
    setEditingItem({ ...editingItem, data: { ...editingItem.data, [field]: newVal } });
  };

  // --- Filtering & Pagination Logic ---
  const processedData = useMemo(() => {
    if (!fileData) return [];
    let result = fileData.map((item, idx) => ({ item, originalIdx: idx }));
    
    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(({ item }) => {
        const str = (item.title || item.german || item.question || item.english || "").toString().toLowerCase();
        return str.includes(term);
      });
    }

    // Sort
    result.sort((a, b) => {
      const valA = (a.item.title || a.item.german || "").toString().toLowerCase();
      const valB = (b.item.title || b.item.german || "").toString().toLowerCase();
      if (sortOrder === "asc") return valA.localeCompare(valB);
      return valB.localeCompare(valA);
    });

    return result;
  }, [fileData, searchTerm, sortOrder]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const visibleData = processedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const visibleIndices = visibleData.map(d => d.originalIdx);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Modern Unified CMS</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage global curriculum and custom articles with data tables.</p>
        </div>
        
        {/* File Selector Dropdown */}
        <select 
          onChange={(e) => loadFile(e.target.value)}
          value={selectedFile || ""}
          className="px-4 py-2.5 bg-white border border-zinc-300 rounded-xl shadow-sm text-sm font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="" disabled>Select a database to manage...</option>
          {FILES.map(f => <option key={f} value={f}>{f.replace('../data/', 'Global: ')}</option>)}
        </select>
      </div>

      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Main Data Table */}
      {!isLoading && fileData && (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <div className="relative w-full max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search entries..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-emerald-600 mr-2">{statusMsg}</span>
              {selectedItems.size > 0 && (
                <button 
                  onClick={deleteSelected}
                  className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors shadow-sm"
                >
                  Delete ({selectedItems.size})
                </button>
              )}
              <button 
                onClick={createNewEntry}
                className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-all hover:-translate-y-0.5"
              >
                + Add New Entry
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="p-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      checked={visibleIndices.length > 0 && selectedItems.size === visibleIndices.length}
                      onChange={() => toggleAll(visibleIndices)}
                      className="w-4 h-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                    />
                  </th>
                  <th 
                    className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100 transition-colors"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    Primary Field {sortOrder === "asc" ? "↑" : "↓"}
                  </th>
                  <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Preview</th>
                  <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-zinc-500 text-sm">
                      No entries found.
                    </td>
                  </tr>
                ) : (
                  visibleData.map(({ item, originalIdx }) => {
                    const isSelected = selectedItems.has(originalIdx);
                    const primary = item.title || item.german || item.question || `Entry #${originalIdx}`;
                    const preview = item.description || item.english || item.content || JSON.stringify(item).substring(0, 50) + "...";
                    return (
                      <tr key={originalIdx} className={`border-b border-zinc-100 transition-colors hover:bg-zinc-50 ${isSelected ? "bg-amber-50" : ""}`}>
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => toggleSelection(originalIdx)}
                            className="w-4 h-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                          />
                        </td>
                        <td className="p-4 font-semibold text-zinc-800">{primary}</td>
                        <td className="p-4 text-sm text-zinc-500 truncate max-w-xs hidden md:table-cell">{preview}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => openEditor(originalIdx)}
                            className="px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 shadow-sm transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-sm">
              <span className="text-zinc-500 font-medium">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(c => c - 1)}
                  className="px-3 py-1.5 bg-white border border-zinc-300 rounded-lg disabled:opacity-50 hover:bg-zinc-50 font-medium text-zinc-700"
                >
                  Previous
                </button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(c => c + 1)}
                  className="px-3 py-1.5 bg-white border border-zinc-300 rounded-lg disabled:opacity-50 hover:bg-zinc-50 font-medium text-zinc-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WYSIWYG Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate__animated animate__zoomIn animate__faster">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
              <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                <span className="text-amber-500">✏️</span> Edit Entry
              </h2>
              <button 
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-200 text-zinc-500 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {Object.keys(editingItem.data).map((key) => {
                const val = editingItem.data[key];
                
                if (key === "id") return null;

                if (typeof val === "string" && val.length > 50 || key === "content" || key === "description") {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-bold text-zinc-700 mb-2 capitalize">{key}</label>
                      {/* Rich Text Toolbar Mock */}
                      <div className="flex items-center gap-1 mb-2 bg-zinc-100 p-1.5 rounded-lg border border-zinc-200 w-max">
                        <button onClick={() => insertRichText(key, "**", "**")} className="w-8 h-8 font-bold rounded hover:bg-white text-zinc-700 transition-colors">B</button>
                        <button onClick={() => insertRichText(key, "*", "*")} className="w-8 h-8 italic rounded hover:bg-white text-zinc-700 transition-colors">I</button>
                        <div className="w-px h-5 bg-zinc-300 mx-1" />
                        <button onClick={() => insertRichText(key, "## ")} className="w-8 h-8 font-bold font-serif rounded hover:bg-white text-zinc-700 transition-colors">H2</button>
                        <button onClick={() => insertRichText(key, "- ")} className="w-8 h-8 rounded hover:bg-white text-zinc-700 transition-colors">•</button>
                      </div>
                      <textarea
                        value={val}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, [key]: e.target.value } })}
                        rows={8}
                        className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono text-sm"
                      />
                    </div>
                  );
                }

                if (typeof val === "string" || typeof val === "number") {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-bold text-zinc-700 mb-1 capitalize">{key}</label>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, [key]: e.target.value } })}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      />
                    </div>
                  );
                }

                if (Array.isArray(val)) {
                  return (
                    <div key={key} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                      <label className="block text-sm font-bold text-zinc-700 mb-3 capitalize">{key} (Array)</label>
                      <div className="text-xs text-zinc-500 italic mb-2">Arrays must currently be edited via raw JSON or Universal CMS.</div>
                      <pre className="p-3 bg-zinc-900 text-zinc-300 rounded-lg text-xs overflow-x-auto shadow-inner">
                        {JSON.stringify(val, null, 2)}
                      </pre>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            <div className="p-5 border-t border-zinc-100 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setEditingItem(null)}
                className="px-6 py-2.5 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveEditor}
                className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
