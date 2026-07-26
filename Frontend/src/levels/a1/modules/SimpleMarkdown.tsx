"use client";

import { useMemo, type JSX } from "react";

/* ── Block types ─────────────────────────────────────────────────── */
type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

/* ── Article colours ─────────────────────────────────────────────── */
const ARTICLE_COLORS: Record<string, string> = {
  der: "text-blue-600 font-medium",
  die: "text-red-500 font-medium",
  das: "text-emerald-600 font-medium",
};

function colorArticles(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
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
  return parts;
}

/* ── Inline formatting: **bold**, *italic*, article colours ─────── */
function formatInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      const between = text.slice(last, m.index);
      parts.push(...colorArticles(between));
    }
    if (m[1]) parts.push(<strong key={k++} className="text-zinc-900 font-semibold">{m[1]}</strong>);
    else if (m[2]) parts.push(<em key={k++}>{m[2]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(...colorArticles(text.slice(last)));
  return parts.length > 0 ? parts : colorArticles(text);
}

/* ── Block parser ────────────────────────────────────────────────── */
function parseBlocks(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();

    if (t === "") { i++; continue; }

    // Heading (# through ######)
    const headingMatch = t.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: "heading", text: headingMatch[2] });
      i++; continue;
    }

    // Table (|...|)
    if (t.startsWith("|")) {
      const tl: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tl.push(lines[i].trim());
        i++;
      }
      const parsed = tl
        .filter((l) => !/^\|[\s:|-]+\|$/.test(l))
        .map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
      if (parsed.length > 0) {
        blocks.push({ type: "table", headers: parsed[0], rows: parsed.slice(1) });
      }
      continue;
    }

    // Blockquote (>)
    if (t.startsWith("> ")) {
      const ql: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        ql.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "quote", text: ql.join(" ") });
      continue;
    }

    // Unordered list (- )
    if (t.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // Paragraph — collect consecutive plain lines
    const pl: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().match(/^#{1,6}\s/) &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith("> ") &&
      !lines[i].trim().startsWith("- ")
    ) {
      pl.push(lines[i].trim());
      i++;
    }
    if (pl.length > 0) blocks.push({ type: "paragraph", text: pl.join(" ") });
  }

  return blocks;
}

/* ── Renderer ────────────────────────────────────────────────────── */
export default function SimpleMarkdown({ content }: { content: string }) {
  const blocks = useMemo(() => parseBlocks(content), [content]);

  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <h3
                key={i}
                className="text-lg font-bold text-zinc-900 mt-8 first:mt-0 mb-2 flex items-center gap-2 border-b border-zinc-100 pb-2"
              >
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-green-400 to-emerald-500" />
                {formatInline(b.text)}
              </h3>
            );
          case "paragraph":
            return (
              <p key={i} className="text-zinc-700 leading-relaxed">
                {formatInline(b.text)}
              </p>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto my-4 rounded-xl border border-zinc-200">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      {b.headers.map((h, j) => (
                        <th
                          key={j}
                          className="text-left px-3 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 text-blue-900 font-semibold text-xs uppercase tracking-wide"
                        >
                          {formatInline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}>
                        {row.map((cell, k) => (
                          <td key={k} className="px-3 py-2 border-b border-zinc-100 text-zinc-700">
                            {formatInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "list":
            return (
              <ul key={i} className="space-y-1.5 pl-1 my-2">
                {b.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-zinc-700">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-green-400 mt-[9px]" />
                    <span className="leading-relaxed">{formatInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 rounded-r-xl text-amber-900 text-sm leading-relaxed my-4"
              >
                💡 {formatInline(b.text)}
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
