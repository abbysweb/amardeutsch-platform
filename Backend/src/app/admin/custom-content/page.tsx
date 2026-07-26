"use client";

import { useState, useEffect } from "react";

type CustomEntry = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function CustomContentAdmin() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState<CustomEntry[]>([]);
  const [statusMsg, setStatusMsg] = useState("");

  // Fetch existing entries on load
  useEffect(() => {
    fetch("/backend/api/admin/content")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => console.error("Failed to load content", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setStatusMsg("");

    try {
      const res = await fetch("/backend/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        const { entry } = await res.json();
        setEntries([entry, ...entries]);
        setTitle("");
        setContent("");
        setStatusMsg("✅ Content published successfully!");
        setTimeout(() => setStatusMsg(""), 3000);
      } else {
        setStatusMsg("❌ Failed to publish content.");
      }
    } catch (error) {
      setStatusMsg("❌ Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Upload Custom Content</h2>
        <p className="text-zinc-500 mt-1">Publish plain text or markdown directly to the student portal.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Upload Form */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-zinc-700 mb-2">Lesson / Article Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 50 Essential Business German Phrases"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <label htmlFor="content" className="block text-sm font-semibold text-zinc-700">Plain Text Content</label>
                <span className="text-xs text-zinc-400">Markdown is supported</span>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write or paste your text here..."
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-mono text-sm"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-emerald-600">{statusMsg}</span>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="px-6 py-2.5 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? "Publishing..." : "Publish Content"}
                {!isSubmitting && <span>🚀</span>}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Content Sidebar */}
        <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 h-fit max-h-[800px] overflow-y-auto">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Recently Published</h3>
          {entries.length === 0 ? (
            <p className="text-sm text-zinc-400 italic">No content uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                  <h4 className="font-semibold text-zinc-900 line-clamp-1">{entry.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{new Date(entry.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
