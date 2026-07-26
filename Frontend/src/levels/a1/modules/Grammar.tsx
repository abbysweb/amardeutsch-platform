"use client";

import { useState, useRef, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { a1Grammar } from "@/levels/a1";
import lectures, { cognates, highFrequencyNouns, pronounFlowchart, dialogues4, cheatSheet4, commonMistakes4, practiceExercises4, summary4 } from "@/levels/a1/grammar/lectures";
import Link from "next/link";
import SimpleMarkdown from "./SimpleMarkdown";
import { GermanClock } from "./GermanClock";
import { playGermanAudio } from "@/shared/utils/naturalTTS";

function SpeakButton({ text }: { text: string }) {
  const speak = () => {
    playGermanAudio(text, 0.92);
  };
  return (
    <button onClick={speak} className="inline-flex items-center justify-center w-5 h-5 rounded hover:bg-zinc-200/60 transition-colors shrink-0 align-middle" title="Hear natural pronunciation">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" style={{ color: "#8b5e3c" }}>
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
    </button>
  );
}

const ARTICLE_COLORS: Record<string, string> = {
  der: "text-blue-600 font-medium",
  die: "text-red-500 font-medium",
  das: "text-emerald-600 font-medium",
};

function colorText(text: string): (string | ReactNode)[] {
  const parts: (string | ReactNode)[] = [];
  const re = /\b(der|die|das)\b/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const word = m[1].toLowerCase();
    const cls = ARTICLE_COLORS[word] ?? "";
    parts.push(<span key={k++} className={cls}>{m[1]}</span>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : [text];
}

const SECTION_THEMES = [
  { border: "border-amber-300", headerBg: "#f5ead0", headerText: "#5c3d2e", bg: "#fdf8f0", rowEven: "transparent", rowOdd: "rgba(245, 234, 208, 0.3)", text: "#3d2b1f", accent: "#8b5e3c" },
  { border: "border-green-300", headerBg: "#d1fae5", headerText: "#065f46", bg: "#f0fdf4", rowEven: "transparent", rowOdd: "rgba(209, 250, 229, 0.3)", text: "#1f3a2e", accent: "#059669" },
  { border: "border-blue-300", headerBg: "#dbeafe", headerText: "#1e40af", bg: "#f0f7ff", rowEven: "transparent", rowOdd: "rgba(219, 234, 254, 0.3)", text: "#1e2d4a", accent: "#2563eb" },
  { border: "border-purple-300", headerBg: "#e9d5ff", headerText: "#6b21a8", bg: "#faf5ff", rowEven: "transparent", rowOdd: "rgba(233, 213, 255, 0.3)", text: "#2e1a47", accent: "#7c3aed" },
  { border: "border-rose-300", headerBg: "#ffe4e6", headerText: "#9f1239", bg: "#fff5f6", rowEven: "transparent", rowOdd: "rgba(255, 228, 230, 0.3)", text: "#4a1a2e", accent: "#e11d48" },
  { border: "border-teal-300", headerBg: "#ccfbf1", headerText: "#115e59", bg: "#f0fdfa", rowEven: "transparent", rowOdd: "rgba(204, 251, 241, 0.3)", text: "#1a3d36", accent: "#0d9488" },
  { border: "border-orange-300", headerBg: "#fed7aa", headerText: "#9a3412", bg: "#fff7ed", rowEven: "transparent", rowOdd: "rgba(254, 215, 170, 0.3)", text: "#3d261a", accent: "#ea580c" },
  { border: "border-indigo-300", headerBg: "#c7d2fe", headerText: "#3730a3", bg: "#f5f3ff", rowEven: "transparent", rowOdd: "rgba(199, 210, 254, 0.3)", text: "#1e1b4b", accent: "#4f46e5" },
];

const ENGLISH_SECTIONS = new Set(["Why Learn German?:"]);

function SectionedTable({ lines, showSpeaker = true }: { lines: string[]; showSpeaker?: boolean }) {
  const sections: { title: string; rows: string[]; hasSpeaker: boolean }[] = [];
  let current: string[] = [];
  let currentTitle = "Conjugation / Structure";

  const flush = () => {
    if (current.length > 0) {
      sections.push({ title: currentTitle, rows: current, hasSpeaker: showSpeaker && !ENGLISH_SECTIONS.has(currentTitle) });
      current = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed === "") { flush(); return; }
    if (trimmed.endsWith(":") || /^[A-ZÄÖÜ][A-Za-zäöüß\s]+$/.test(trimmed)) {
      flush();
      currentTitle = trimmed;
      return;
    }
    current.push(line);
  });
  flush();

  if (sections.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {sections.map((section, si) => {
        const theme = SECTION_THEMES[si % SECTION_THEMES.length];
        return (
          <div key={si} className={`rounded-2xl border ${theme.border} shadow-sm overflow-hidden`} style={{ backgroundColor: theme.bg }}>
            <div className="px-5 py-3 border-b" style={{ backgroundColor: theme.headerBg, borderColor: theme.border.replace("border-", "") }}>
              <h3 className="text-sm font-bold tracking-wide flex items-center gap-2" style={{ color: theme.headerText }}>
                {section.hasSpeaker && <SpeakButton text={section.title.replace(/:$/, "")} />}
                <span>{section.title}</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                <tbody>
                  {section.rows.map((line, i) => {
                    const trimmed = line.trim();
                    if (trimmed === "") return <tr key={i}><td colSpan={4} className="h-2" /></tr>;
                    if (line.includes("|")) {
                      const cells = line.split("|").map(c => c.trim());
                      return (
                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? theme.rowEven : theme.rowOdd }}>
                          {cells.map((cell, j) => {
                            const isLabel = cell.match(/^[A-ZÄÖÜ][a-zäöü]+\s*:/);
                            const [label, ...restArr] = isLabel ? [cell.split(":")[0] + ":", cell.split(":").slice(1).join(":").trim()] : [null, cell];
                            const rest = restArr[0] ?? "";
                            const speakText = (rest || cell).replace(/\(.*?\)/g, "").replace(/=.*/, "").trim();
                            return (
                              <td key={j} className="px-4 py-1.5 border-b align-top" style={{ color: theme.text, borderColor: theme.border.replace("border-", "").replace("-300", "-100") }}>
                                <div className="flex items-start gap-1">
                                  {section.hasSpeaker && speakText && <SpeakButton text={speakText} />}
                                  <span>
                                    {label && <span className="font-semibold text-xs" style={{ color: theme.accent }}>{label} </span>}
                                    <span>{colorText(rest)}</span>
                                  </span>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    }
                    const indent = line.search(/\S/);
                    const text = trimmed;
                    const parts = text.split(/(—|–|-)\s*/).filter(Boolean);
                    const speakText = parts.length > 1 ? parts[0] : text.replace(/\(.*?\)/g, "").trim();
                    return (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? theme.rowEven : theme.rowOdd }}>
                        <td colSpan={4} className="px-4 py-1.5 border-b" style={{ color: theme.text, borderColor: theme.border.replace("border-", "").replace("-300", "-100"), paddingLeft: `${12 + indent * 2}px` }}>
                          <div className="flex items-start gap-1">
                            {section.hasSpeaker && speakText && <SpeakButton text={speakText} />}
                            <span>
                              {parts.length > 1 ? (
                                <>
                                  <span className="font-medium">{colorText(parts[0])}</span>
                                  <span className="mx-1" style={{ color: theme.accent }}>{parts[1]}</span>
                                  <span>{colorText(parts.slice(2).join(" "))}</span>
                                </>
                              ) : colorText(text)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const UNIT_ICONS: Record<number, string> = {
  1: "🔤", 2: "🗣️", 3: "📦", 4: "📋", 5: "👤",
  6: "⭐", 7: "⏪", 8: "✋", 9: "⚡", 10: "🔧",
  11: "🔄", 12: "🎨", 13: "📚", 14: "🔢", 15: "🎯",
  16: "👥", 17: "🔗", 18: "❓", 19: "✅",
};

export function Grammar() {
  const searchParams = useSearchParams();
  const unitParam = searchParams.get("unit");
  const selectedUnit = unitParam ? parseInt(unitParam, 10) : 1;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const unit = a1Grammar.find((u) => u.id === selectedUnit) ?? a1Grammar[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50">
      {/* Mobile hamburger */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-4 py-3 flex items-center gap-3">
        <Link href="/a1" className="p-2 -ml-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors" aria-label="Back to A1 Menu">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <span className="text-sm font-semibold text-zinc-700 truncate">
          Unit {unit.id}: {unit.title}
        </span>
      </div>

      <div className="flex relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 z-40 lg:z-10
            w-80 lg:w-72 xl:w-80
            bg-white border-r border-zinc-200
            h-[calc(100vh-4rem)] overflow-y-auto
            transition-transform duration-300 ease-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Sidebar header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-4 border-b border-zinc-200">
            <Link href="/a1" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-3 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to A1 Menu
            </Link>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">A1</span>
              <h2 className="text-lg font-bold text-zinc-900">Grammar Units</h2>
            </div>
            <p className="text-xs text-zinc-400">{a1Grammar.length} units · Click to explore</p>
          </div>

          {/* Unit list */}
          <nav className="p-2 space-y-0.5 pb-8">
            {a1Grammar.map((u) => {
              const isActive = selectedUnit === u.id;
              return (
                <Link
                  key={u.id}
                  href={`?unit=${u.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-start gap-3 group block
                    ${isActive
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm"
                      : "hover:bg-zinc-50 border border-transparent"
                    }
                  `}
                >
                  {/* Unit number badge */}
                  <span
                    className={`
                      shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors
                      ${isActive
                        ? "bg-green-500 text-white shadow-sm"
                        : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"
                      }
                    `}
                  >
                    {u.id}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium leading-snug ${
                        isActive ? "text-green-800" : "text-zinc-700 group-hover:text-zinc-900"
                      }`}
                    >
                      {u.title}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                      <span>{UNIT_ICONS[u.id] ?? "📖"}</span>
                      <span>{u.category}</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main ref={contentRef} className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Unit header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-green-200">
                  {unit.id}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">A1</span>
                    <span className="text-xs text-zinc-400">{unit.category}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                    Unit {unit.id}: {unit.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 sm:p-6 mb-6">
              <p className="text-zinc-700 leading-relaxed">{colorText(unit.description)}</p>
            </div>

            {/* Grammar Info Table */}
            <div className="bg-white rounded-2xl border border-zinc-200 mb-6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr className="border-b border-zinc-100">
                      <td className="px-5 py-3 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wide w-36 align-top">Category</td>
                      <td className="px-5 py-3 text-zinc-700">
                        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">{unit.category}</span>
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="px-5 py-3 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wide align-top">Level</td>
                      <td className="px-5 py-3 text-zinc-700">A1</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="px-5 py-3 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wide align-top">Description</td>
                      <td className="px-5 py-3 text-zinc-700 leading-relaxed">{colorText(unit.content)}</td>
                    </tr>
                    {unit.subtopics.length > 0 && (
                      <tr className="border-b border-zinc-100">
                        <td className="px-5 py-3 bg-zinc-50 text-zinc-500 font-semibold text-xs uppercase tracking-wide align-top">Subtopics</td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {unit.subtopics.map((s, i) => (
                              <span key={i} className="inline-block text-xs px-2 py-1 rounded-md bg-zinc-100 text-zinc-600">{colorText(s)}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Clock for unit 1 */}
            {selectedUnit === 1 && <GermanClock />}

            {/* Conjugation / Structure Table */}
            {unit.conjugationTable && unit.conjugationTable.length > 0 && (
              <SectionedTable lines={unit.conjugationTable} showSpeaker={selectedUnit !== 2 && selectedUnit !== 3 && selectedUnit !== 4} />
            )}

            {/* Lecture Content (collapsible) */}
            <details className="bg-white rounded-2xl border border-zinc-200 mb-6 overflow-hidden group">
              <summary className="px-5 py-3.5 border-b border-zinc-200 cursor-pointer flex items-center justify-between transition-all duration-200 hover:shadow-lg" style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", boxShadow: "0 0 20px rgba(34, 197, 94, 0.25)" }}>
                <h3 className="text-sm font-bold tracking-wide" style={{ color: "#166534" }}>Full Lecture Notes</h3>
                <svg className="w-5 h-5 transition-transform duration-200 group-open:rotate-180" style={{ color: "#16a34a" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
                  <div className="p-5 sm:p-6">
                    {(() => {
                      if (selectedUnit === 1) {
                        const unitContent = `## Unit ${unit.id}: ${unit.title}

**Category:** ${unit.category} | **Level:** ${unit.level}

**Description:** ${unit.description}

**Overview:** 
${unit.content}

### Subtopics
${unit.subtopics.map(s => `- ${s}`).join('\n')}

### Conjugation / Structure
${unit.conjugationTable ? unit.conjugationTable.join('\n') : '*None*'}

### Examples
${unit.examples.map(ex => `- **${ex.german}** = ${ex.english}`).join('\n')}`;

                        return <SimpleMarkdown content={unitContent} />;
                      }
                      if (!lectures[unit.id]) return <p className="text-zinc-500 italic">Lecture content for this unit is currently being written...</p>;
                      if (selectedUnit === 3) {
                        const full = lectures[unit.id] ?? "";
                        const splitter = "### 3.4";
                        const idx = full.indexOf(splitter);
                        if (idx === -1) return <SimpleMarkdown content={full} />;
                        return (
                          <>
                            <SimpleMarkdown content={full.slice(0, idx)} />
                            <details className="my-6 rounded-xl border border-sky-200 overflow-hidden group" style={{ borderColor: "#a8d5e2" }}>
                              <summary className="px-4 py-2.5 border-b cursor-pointer hover:bg-sky-50 transition-colors flex items-center justify-between" style={{ backgroundColor: "#e0f2fe", borderColor: "#a8d5e2" }}>
                                <span className="text-lg font-bold" style={{ color: "#075985" }}>3.3 200 Real-World High-Frequency Nouns by Gender</span>
                                <svg className="w-4 h-4 text-sky-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </summary>
                              <div className="p-4" style={{ backgroundColor: "#f0f9ff" }}>
                                <SimpleMarkdown content={highFrequencyNouns} />
                              </div>
                            </details>
                            <SimpleMarkdown content={full.slice(idx)} />
                          </>
                        );
                      }
                      return (
                        <>
                          <SimpleMarkdown content={lectures[unit.id] ?? ""} />
                      <details className="my-6 rounded-xl border border-amber-200 overflow-hidden group" style={{ borderColor: "#fcd34d" }}>
                        <summary className="px-4 py-2.5 border-b cursor-pointer hover:bg-amber-50 transition-colors flex items-center justify-between" style={{ backgroundColor: "#fef3c7", borderColor: "#fcd34d" }}>
                          <span className="text-lg font-bold" style={{ color: "#92400e" }}>Real-Life Dialogues</span>
                          <svg className="w-4 h-4 text-amber-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="p-4" style={{ backgroundColor: "#fffbeb" }}>
                          <SimpleMarkdown content={dialogues4} />
                        </div>
                      </details>
                      <details className="my-6 rounded-xl border border-purple-200 overflow-hidden group" style={{ borderColor: "#d8b4fe" }}>
                        <summary className="px-4 py-2.5 border-b cursor-pointer hover:bg-purple-50 transition-colors flex items-center justify-between" style={{ backgroundColor: "#f3e8ff", borderColor: "#d8b4fe" }}>
                          <span className="text-lg font-bold" style={{ color: "#6b21a8" }}>Pronoun Flowchart</span>
                          <svg className="w-4 h-4 text-purple-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="p-4" style={{ backgroundColor: "#faf5ff" }}>
                          <SimpleMarkdown content={pronounFlowchart} />
                        </div>
                      </details>
                      <details className="my-6 rounded-xl border border-teal-200 overflow-hidden group" style={{ borderColor: "#99f6e4" }}>
                        <summary className="px-4 py-2.5 border-b cursor-pointer hover:bg-teal-50 transition-colors flex items-center justify-between" style={{ backgroundColor: "#ccfbf1", borderColor: "#99f6e4" }}>
                          <span className="text-lg font-bold" style={{ color: "#115e59" }}>4.8 Cheat Sheet</span>
                          <svg className="w-4 h-4 text-teal-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="p-4" style={{ backgroundColor: "#f0fdfa" }}>
                          <SimpleMarkdown content={cheatSheet4} />
                        </div>
                      </details>
                      <details className="my-6 rounded-xl border border-red-200 overflow-hidden group" style={{ borderColor: "#fecaca" }}>
                        <summary className="px-4 py-2.5 border-b cursor-pointer hover:bg-red-50 transition-colors flex items-center justify-between" style={{ backgroundColor: "#fee2e2", borderColor: "#fecaca" }}>
                          <span className="text-lg font-bold" style={{ color: "#991b1b" }}>4.9 Common Mistakes</span>
                          <svg className="w-4 h-4 text-red-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="p-4" style={{ backgroundColor: "#fef2f2" }}>
                          <SimpleMarkdown content={commonMistakes4} />
                        </div>
                      </details>
                      <details className="my-6 rounded-xl border border-indigo-200 overflow-hidden group" style={{ borderColor: "#a5b4fc" }}>
                        <summary className="px-4 py-2.5 border-b cursor-pointer hover:bg-indigo-50 transition-colors flex items-center justify-between" style={{ backgroundColor: "#e0e7ff", borderColor: "#a5b4fc" }}>
                          <span className="text-lg font-bold" style={{ color: "#3730a3" }}>Practice Exercises</span>
                          <svg className="w-4 h-4 text-indigo-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="p-4" style={{ backgroundColor: "#eef2ff" }}>
                          <SimpleMarkdown content={practiceExercises4} />
                        </div>
                      </details>
                      <details className="my-6 rounded-xl border border-emerald-200 overflow-hidden group" style={{ borderColor: "#a7f3d0" }}>
                        <summary className="px-4 py-2.5 border-b cursor-pointer hover:bg-emerald-50 transition-colors flex items-center justify-between" style={{ backgroundColor: "#d1fae5", borderColor: "#a7f3d0" }}>
                          <span className="text-lg font-bold" style={{ color: "#065f46" }}>Summary</span>
                          <svg className="w-4 h-4 text-emerald-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="p-4" style={{ backgroundColor: "#ecfdf5" }}>
                          <SimpleMarkdown content={summary4} />
                        </div>
                      </details>
                    </>
                  );
                })()}

                {lectures[unit.id] && unit.examples.length > 0 && (() => {
                  const lectureText = lectures[unit.id] ?? "";
                  const missing = unit.examples.filter(ex => !lectureText.includes(ex.german));
                  if (missing.length === 0) return null;
                  return (
                    <>
                      <hr className="my-6 border-zinc-200" />
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">Examples</h4>
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr>
                            <th className="text-left px-0 py-2 border-b border-zinc-100 text-zinc-500 font-medium text-xs">German</th>
                            <th className="text-left px-0 py-2 border-b border-zinc-100 text-zinc-500 font-medium text-xs pl-4">English</th>
                          </tr>
                        </thead>
                        <tbody>
                          {missing.map((ex, i) => (
                            <tr key={i}>
                              <td className="py-2 border-b border-zinc-100 text-zinc-800 font-medium">{colorText(ex.german)}</td>
                              <td className="py-2 border-b border-zinc-100 text-zinc-500 pl-4">{colorText(ex.english)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  );
                })()}

                {unit.errorTraps && unit.errorTraps.length > 0 && (
                  <>
                    <hr className="my-6 border-zinc-200" />
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-red-500 mb-3">Common Mistakes</h4>
                    <div className="space-y-2">
                      {unit.errorTraps.map((trap, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold mt-0.5">!</span>
                          <p className="text-sm text-zinc-700 leading-relaxed">{colorText(trap)}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

              </div>
            </details>

            {/* English-German Similar Words Card */}
            {selectedUnit === 1 && cognates && (
              <details className="bg-white rounded-2xl border border-amber-200 mb-6 shadow-sm overflow-hidden group" style={{ borderColor: "#f5d7a0" }}>
                <summary className="px-5 py-3 border-b cursor-pointer hover:bg-amber-50 transition-colors flex items-center justify-between" style={{ backgroundColor: "#fdf4e0", borderColor: "#f5d7a0" }}>
                  <h3 className="text-sm font-bold tracking-wide" style={{ color: "#7c4a2e" }}>English-German Similar Words</h3>
                  <svg className="w-4 h-4 text-amber-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-5 sm:p-6" style={{ backgroundColor: "#fffcf5" }}>
                  <SimpleMarkdown content={cognates} />
                </div>
              </details>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 pb-12">
              <Link
                href={selectedUnit > 1 ? `?unit=${selectedUnit - 1}` : "#"}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-all ${selectedUnit <= 1 ? "opacity-30 pointer-events-none" : "hover:bg-zinc-50 hover:shadow-sm"}`}
              >
                ← Previous Unit
              </Link>
              <span className="text-xs text-zinc-400 hidden sm:block">
                Unit {selectedUnit} of {a1Grammar.length}
              </span>
              <Link
                href={selectedUnit < a1Grammar.length ? `?unit=${selectedUnit + 1}` : "#"}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-green-500 text-white transition-all ${selectedUnit >= a1Grammar.length ? "opacity-30 pointer-events-none" : "hover:bg-green-600 hover:shadow-sm"}`}
              >
                Next Unit →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
