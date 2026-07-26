import Link from "next/link";
import fs from "fs/promises";
import path from "path";
import SimpleMarkdown from "@/levels/a1/modules/SimpleMarkdown";

// Server Component: fetches data directly from the local JSON file
export default async function CustomContentUserView() {
  let entries: any[] = [];
  try {
    const filePath = path.join(process.cwd(), 'src/data/customContent.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    entries = JSON.parse(fileContents);
  } catch (e) {
    console.error("Failed to read custom content", e);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-4 transition-colors">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-orange-200">
              📝
            </span>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">Custom Content</h1>
              <p className="text-zinc-500 mt-1">Articles and plain text lessons uploaded by the admin.</p>
            </div>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center shadow-sm">
            <span className="text-4xl">📭</span>
            <h3 className="text-lg font-semibold text-zinc-900 mt-4">No content yet</h3>
            <p className="text-zinc-500 mt-1">Check back later when the admin uploads some new text.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {entries.map((entry) => (
              <article key={entry.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-zinc-800">{entry.title}</h2>
                  <time className="text-xs font-medium text-zinc-400 bg-white px-3 py-1 rounded-full border border-zinc-200">
                    {new Date(entry.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </time>
                </div>
                <div className="p-6">
                  <SimpleMarkdown content={entry.content} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
