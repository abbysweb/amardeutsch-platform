import type { Metadata } from "next"
import Navbar from "@/shared/components/Navbar"
import { Providers } from "@/presentation/Providers"
import "./globals.css"
import "animate.css"

export const metadata: Metadata = {
  title: "AmarDeutsch | amardeutsch.com - Master German Online",
  description: "Official amardeutsch.com learning engine with interactive CEFR A1-B2 vocabulary, grammar, and real-time retention tracking",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          
          {/* Discreet Footer */}
          <footer className="border-t border-zinc-200 py-6 text-center">
            <p className="text-xs text-zinc-500 font-medium">
              © 2026 <strong className="text-amber-700">AmarDeutsch</strong> (amardeutsch.com). All rights reserved. 
              <span className="mx-2">|</span>
              <a href="/backend/login" className="hover:text-amber-700 transition-colors font-bold text-amber-600">Admin Portal (amardeutsch.com/backend)</a>
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
