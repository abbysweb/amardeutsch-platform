"use client";

import { useState } from "react";

const FILES = [
  "a1/grammar/data.json",
  "a1/vocab/data.json",
  "a1/quizzes/data.json",
  "a1/sentences/data.json",
  "a1/exam/data.json",
  "a2/grammar/data.json",
  "a2/vocab/data.json",
  "a2/quizzes/data.json",
  "a2/sentences/data.json",
  "a2/exam/data.json",
  "b1/grammar/data.json",
  "b1/vocab/data.json",
  "b1/quizzes/data.json",
  "b1/sentences/data.json",
  "b1/exam/data.json",
  "b2/grammar/data.json",
  "b2/vocab/data.json",
  "b2/quizzes/data.json",
  "b2/sentences/data.json",
  "b2/exam/data.json",
];

export default function UniversalCMS() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileData, setFileData] = useState<any[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const loadFile = async (path: string) => {
    setIsLoading(true);
    setSelectedFile(path);
    setSelectedIndex(null);
    setSearchTerm("");
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

  const saveFile = async () => {
    if (!selectedFile || !fileData) return;
    setIsSaving(true);
    setStatusMsg("");
    try {
      const res = await fetch(`/api/admin/fs?path=${encodeURIComponent(selectedFile)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileData),
      });
      if (res.ok) {
        setStatusMsg("✅ Saved successfully! (Backup created)");
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

  // CRUD Operations
  const addNewEntry = () => {
    if (!fileData) return;
    
    // Create a blank object based on the first item's schema
    const blankObj: any = {};
    if (fileData.length > 0) {
      Object.keys(fileData[0]).forEach(key => {
        const val = fileData[0][key];
        if (Array.isArray(val)) blankObj[key] = [];
        else if (typeof val === "number") blankObj[key] = 0;
        else if (typeof val === "boolean") blankObj[key] = false;
        else blankObj[key] = "";
      });
      // Ensure it has a unique ID if an ID field exists
      if ('id' in blankObj) blankObj.id = Date.now();
    } else {
      blankObj.id = Date.now();
      blankObj.title = "New Item";
    }

    const newData = [blankObj, ...fileData];
    setFileData(newData);
    setSelectedIndex(0); // Select the newly created item
    setSearchTerm(""); // Clear search to see the new item
  };

  const deleteEntry = (index: number) => {
    if (!fileData) return;
    if (!confirm("Are you sure you want to completely delete this entry? This action cannot be undone unless you restore from the server backup.")) return;
    
    const newData = [...fileData];
    newData.splice(index, 1);
    setFileData(newData);
    setSelectedIndex(null);
  };

  const moveEntry = (index: number, direction: 'up' | 'down') => {
    if (!fileData) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === fileData.length - 1) return;

    const newData = [...fileData];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newData[index], newData[targetIndex]] = [newData[targetIndex], newData[index]];
    
    setFileData(newData);
    setSelectedIndex(targetIndex);
  };

  // Field Updates
  const updateItem = (key: string, value: any) => {
    if (selectedIndex === null || !fileData) return;
    const newData = [...fileData];
    newData[selectedIndex] = { ...newData[selectedIndex], [key]: value };
    setFileData(newData);
  };

  const updateArrayItem = (key: string, index: number, value: any) => {
    if (selectedIndex === null || !fileData) return;
    const newData = [...fileData];
    const newArr = [...(newData[selectedIndex][key] || [])];
    newArr[index] = value;
    newData[selectedIndex] = { ...newData[selectedIndex], [key]: newArr };
    setFileData(newData);
  };

  const addArrayItem = (key: string, isObject: boolean = false) => {
    if (selectedIndex === null || !fileData) return;
    const newData = [...fileData];
    const newArr = [...(newData[selectedIndex][key] || [])];
    
    // Clone schema for object arrays
    if (isObject && newArr.length > 0) {
      const blankObj: any = {};
      Object.keys(newArr[0]).forEach(k => blankObj[k] = "");
      newArr.push(blankObj);
    } else {
      newArr.push(isObject ? {} : "");
    }

    newData[selectedIndex] = { ...newData[selectedIndex], [key]: newArr };
    setFileData(newData);
  };

  const removeArrayItem = (key: string, index: number) => {
    if (selectedIndex === null || !fileData) return;
    const newData = [...fileData];
    const newArr = [...(newData[selectedIndex][key] || [])];
    newArr.splice(index, 1);
    newData[selectedIndex] = { ...newData[selectedIndex], [key]: newArr };
    setFileData(newData);
  };

  // Filter Logic
  const filteredData = fileData ? fileData.map((item, idx) => ({ item, idx })).filter(({ item }) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    // Search within title, german word, question, or english translation
    const title = (item.title || item.german || item.question || item.english || "").toString().toLowerCase();
    return title.includes(term);
  }) : [];

  const selectedItem = selectedIndex !== null && fileData ? fileData[selectedIndex] : null;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* File Explorer */}
      <div className="w-64 bg-white border border-zinc-200 rounded-xl flex flex-col shadow-sm overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50">
          <h3 className="font-bold text-zinc-800 text-sm">🗂️ Data Files</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {FILES.map((file) => (
            <button
              key={file}
              onClick={() => loadFile(file)}
              className={`w-full text-left px-3 py-2 text-xs font-mono rounded-lg transition-colors ${
                selectedFile === file ? "bg-amber-100 text-amber-900 font-semibold" : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {file}
            </button>
          ))}
        </div>
      </div>

      {/* Item List */}
      <div className="w-80 bg-white border border-zinc-200 rounded-xl flex flex-col shadow-sm overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <h3 className="font-bold text-zinc-800 text-sm">📋 Entries</h3>
          {fileData && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full">{fileData.length}</span>
              <button onClick={addNewEntry} className="text-xs font-bold bg-amber-500 text-white px-2 py-1 rounded-md hover:bg-amber-600 transition-colors">
                + New
              </button>
            </div>
          )}
        </div>
        
        {fileData && (
          <div className="p-2 border-b border-zinc-100 bg-white">
            <input 
              type="text" 
              placeholder="🔍 Search entries..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoading && <p className="text-xs text-zinc-400 p-2 text-center mt-4">Loading data...</p>}
          {!isLoading && !fileData && <p className="text-xs text-zinc-400 p-2 text-center mt-4">Select a file</p>}
          
          {fileData && filteredData.map(({ item, idx }) => (
            <div key={item.id || idx} className={`group flex items-center gap-1 w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selectedIndex === idx ? "bg-amber-100" : "hover:bg-zinc-100"}`}>
              {/* Reorder Handles */}
              <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                <button onClick={() => moveEntry(idx, 'up')} disabled={idx === 0} className="text-[10px] text-zinc-400 hover:text-amber-600 disabled:opacity-20 leading-none">▲</button>
                <button onClick={() => moveEntry(idx, 'down')} disabled={idx === fileData.length - 1} className="text-[10px] text-zinc-400 hover:text-amber-600 disabled:opacity-20 leading-none">▼</button>
              </div>
              
              <button
                onClick={() => setSelectedIndex(idx)}
                className={`flex-1 truncate ${selectedIndex === idx ? "text-amber-900 font-semibold" : "text-zinc-700"}`}
              >
                {item.title || item.german || item.question || `Item ${idx + 1}`}
              </button>

              <button 
                onClick={() => deleteEntry(idx)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 px-1 transition-opacity"
                title="Delete Entry"
              >
                🗑️
              </button>
            </div>
          ))}
          {fileData && filteredData.length === 0 && <p className="text-xs text-zinc-400 text-center mt-4">No entries found.</p>}
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-xl flex flex-col shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <h3 className="font-bold text-zinc-800 text-sm">
            {selectedItem ? "✏️ Dynamic Editor" : "Select an entry to edit"}
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-emerald-600">{statusMsg}</span>
            <button
              onClick={saveFile}
              disabled={!fileData || isSaving}
              className="px-4 py-1.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? "Saving..." : "Save to File"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50">
          {!selectedItem ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 space-y-2">
              <span className="text-4xl">🛠️</span>
              <p>Select or Create an item to begin editing.</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl">
              {Object.keys(selectedItem).map((key) => {
                const value = selectedItem[key];
                
                // Do not edit IDs or read-only structural fields blindly
                if (key === "id") {
                  return (
                    <div key={key}>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{key} (Read-Only)</label>
                      <input type="text" value={value} disabled className="w-full px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-lg text-sm text-zinc-500" />
                    </div>
                  );
                }

                // If value is a simple string or number
                if (typeof value === "string" || typeof value === "number") {
                  // Use textarea for long text
                  if (typeof value === "string" && value.length > 60) {
                    return (
                      <div key={key}>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{key}</label>
                        <textarea
                          value={value}
                          onChange={(e) => updateItem(key, e.target.value)}
                          rows={6}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-mono"
                        />
                      </div>
                    );
                  }
                  
                  return (
                    <div key={key}>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{key}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateItem(key, e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                      />
                    </div>
                  );
                }

                // If value is an Array
                if (Array.isArray(value)) {
                  return (
                    <div key={key} className="p-4 bg-zinc-100/50 border border-zinc-200 rounded-xl space-y-3 shadow-inner">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">{key} (Array)</label>
                        <button 
                          onClick={() => addArrayItem(key, value.length > 0 ? typeof value[0] === 'object' : false)}
                          className="text-xs bg-white border border-zinc-300 shadow-sm px-3 py-1 rounded-md text-zinc-700 hover:bg-zinc-50 hover:border-amber-300 transition-all font-medium"
                        >
                          + Add Item
                        </button>
                      </div>
                      
                      {value.map((arrItem, arrIdx) => (
                        <div key={arrIdx} className="flex gap-2 relative group items-start">
                          <span className="mt-2 text-xs font-mono text-zinc-400 w-4">{arrIdx + 1}.</span>
                          
                          {typeof arrItem === 'object' ? (
                            <div className="flex-1 p-3 bg-white border border-zinc-300 rounded-lg text-xs space-y-3 relative group shadow-sm hover:border-amber-200 transition-colors">
                              {Object.keys(arrItem).map(objKey => (
                                <div key={objKey} className="flex flex-col">
                                  <span className="font-mono text-[10px] text-zinc-500 uppercase mb-1">{objKey}</span>
                                  {typeof arrItem[objKey] === 'string' && arrItem[objKey].length > 40 ? (
                                    <textarea 
                                      value={arrItem[objKey]} 
                                      onChange={(e) => {
                                        const newObj = {...arrItem, [objKey]: e.target.value};
                                        updateArrayItem(key, arrIdx, newObj);
                                      }}
                                      rows={2}
                                      className="border border-zinc-200 rounded px-2 py-1 focus:border-amber-500 outline-none w-full"
                                    />
                                  ) : (
                                    <input 
                                      type="text" 
                                      value={arrItem[objKey]} 
                                      onChange={(e) => {
                                        const newObj = {...arrItem, [objKey]: e.target.value};
                                        updateArrayItem(key, arrIdx, newObj);
                                      }}
                                      className="border border-zinc-200 rounded px-2 py-1 focus:border-amber-500 outline-none w-full"
                                    />
                                  )}
                                </div>
                              ))}
                              <button 
                                onClick={() => removeArrayItem(key, arrIdx)} 
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-red-100 hover:bg-red-100"
                                title="Remove Item"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={arrItem}
                                onChange={(e) => updateArrayItem(key, arrIdx, e.target.value)}
                                className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none shadow-sm"
                              />
                              <button 
                                onClick={() => removeArrayItem(key, arrIdx)}
                                className="px-3 text-red-500 bg-white border border-zinc-300 shadow-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-lg transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {value.length === 0 && <p className="text-xs text-zinc-400 italic">This array is empty.</p>}
                    </div>
                  );
                }

                // Fallback for deeply nested unknown objects (read-only raw JSON)
                return (
                  <div key={key}>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{key} (Complex Object)</label>
                    <pre className="p-3 bg-zinc-900 text-zinc-300 rounded-lg text-xs overflow-x-auto shadow-inner">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
