"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Unified CMS Dashboard", icon: "📊" },
    { href: "/admin/analytics", label: "Live User Analytics", icon: "📈" },
    { href: "/admin/game-vocab", label: "Admin CRUD", icon: "⚙️" },
    { href: "/admin/custom-content", label: "Custom Content Blog", icon: "📝" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-zinc-100 flex-shrink-0 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 text-sm font-medium">
            ← Back to Main Site
          </Link>
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">Admin Hub</h2>
          <p className="text-xs text-zinc-500 mt-1">Manage platform content</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive 
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm font-black" 
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-600 text-center">
          Admin CMS v1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-50">
        <header className="bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-8 shadow-sm flex-shrink-0">
          <h1 className="text-lg font-semibold text-zinc-800">Admin Dashboard</h1>
          <Link
            href="/admin/game-vocab"
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              pathname === "/admin/game-vocab"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow-md"
                : "bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-700"
            }`}
          >
            <span>⚙️ Admin CRUD</span>
          </Link>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
