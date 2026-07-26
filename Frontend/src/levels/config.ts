/**
 * @fileoverview
 * Centralized configuration and styling constants for the Frontend.
 * Defines Tailwind CSS classes, color themes, and UI copy mappings for all CEFR levels (A1-B2).
 * Any design changes for specific levels should be made here.
 */
import { VALID_CEFR_LEVELS, type CEFRLevel, LEVEL_META } from "./cefr"

export type LevelId = "A1" | "A2" | "B1" | "B2"

export const VALID_LEVELS_SET = new Set<string>([...VALID_CEFR_LEVELS])

export const CEFR_ZOD_ENUM = ["A1", "A2", "B1", "B2", "C1", "C2"] as const

export const LEVEL_LABEL: Record<string, string> = {
  "0/A1": "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-Intermediate",
}

export const LEVEL_COLOR_VALUES: Record<string, string> = {
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  red: "#ef4444",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
}

/**
 * Represents the configuration for a level navigation link in the Navbar.
 */
export interface NavbarLevel {
  href: string
  label: string
  sublabel: string
  color: string
  bg: string
}

export const NAVBAR_LEVELS: NavbarLevel[] = [
  { href: "/a1", label: "A1", sublabel: "Beginner", color: "text-green-700", bg: "hover:bg-green-50" },
  { href: "/a2", label: "A2", sublabel: "Elementary", color: "text-yellow-700", bg: "hover:bg-yellow-50" },
  { href: "/b1", label: "B1", sublabel: "Intermediate", color: "text-orange-700", bg: "hover:bg-orange-50" },
  { href: "/b2", label: "B2", sublabel: "Upper-Intermediate", color: "text-red-700", bg: "hover:bg-red-50" },
]

/**
 * Defines the Tailwind CSS class tokens used to style the interactive Flashcards.
 * Supports customized gradients, borders, shadows, and hover effects per level.
 */
export interface FlashcardStyle {
  bar: string
  border: string
  glow: string
  badge: string
  badgeText: string
  tint: string
  listenHover: string
}

export const FLASHCARD_STYLES: Record<string, FlashcardStyle> = {
  A1: {
    bar: "from-green-400 to-emerald-500",
    border: "border-green-200 group-hover:border-green-300",
    glow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]",
    badge: "bg-green-100",
    badgeText: "text-green-700",
    tint: "from-green-50/50 to-transparent",
    listenHover: "hover:bg-green-100 hover:text-green-700",
  },
  A2: {
    bar: "from-yellow-400 to-amber-500",
    border: "border-yellow-200 group-hover:border-yellow-300",
    glow: "group-hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]",
    badge: "bg-yellow-100",
    badgeText: "text-yellow-700",
    tint: "from-yellow-50/50 to-transparent",
    listenHover: "hover:bg-yellow-100 hover:text-yellow-700",
  },
  B1: {
    bar: "from-orange-400 to-amber-500",
    border: "border-orange-200 group-hover:border-orange-300",
    glow: "group-hover:shadow-[0_0_30px_rgba(251,146,60,0.2)]",
    badge: "bg-orange-100",
    badgeText: "text-orange-700",
    tint: "from-orange-50/50 to-transparent",
    listenHover: "hover:bg-orange-100 hover:text-orange-700",
  },
  B2: {
    bar: "from-red-400 to-rose-500",
    border: "border-red-200 group-hover:border-red-300",
    glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]",
    badge: "bg-red-100",
    badgeText: "text-red-700",
    tint: "from-red-50/50 to-transparent",
    listenHover: "hover:bg-red-100 hover:text-red-700",
  },
}

export const DEFAULT_FLASHCARD_STYLE = FLASHCARD_STYLES.A1

/**
 * Represents the configuration for a level selection card shown on the Homepage.
 */
export interface HomeLevelCard {
  id: string
  name: string
  href: string
  emoji: string
  desc: string
  color: string
  border: string
  bg: string
  badge: string
  cta: string
  ring: string
  step: number
}

export const HOME_LEVELS: HomeLevelCard[] = [
  {
    id: "A1", name: "Beginner", href: "/a1", emoji: "🌱",
    desc: "Start your German journey. Greetings, numbers, colours, everyday objects.",
    color: "from-green-400 to-emerald-500", border: "border-green-200", bg: "bg-green-50",
    badge: "bg-green-100 text-green-800", cta: "bg-green-500 hover:bg-green-600",
    ring: "ring-green-300", step: 1,
  },
  {
    id: "A2", name: "Elementary", href: "/a2", emoji: "🌿",
    desc: "Build confidence. Perfekt tense, dative case, modal verbs, daily conversations.",
    color: "from-yellow-400 to-amber-500", border: "border-yellow-200", bg: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-800", cta: "bg-yellow-500 hover:bg-yellow-600",
    ring: "ring-yellow-300", step: 2,
  },
  {
    id: "B1", name: "Intermediate", href: "/b1", emoji: "🌳",
    desc: "Go deeper. Subjunctive mood, complex sentences, work and travel topics.",
    color: "from-orange-400 to-amber-500", border: "border-orange-200", bg: "bg-orange-50",
    badge: "bg-orange-100 text-orange-800", cta: "bg-orange-500 hover:bg-orange-600",
    ring: "ring-orange-300", step: 3,
  },
  {
    id: "B2", name: "Upper-Intermediate", href: "/b2", emoji: "🌲",
    desc: "Reach fluency. Abstract topics, nuanced grammar, professional and academic German.",
    color: "from-red-400 to-rose-500", border: "border-red-200", bg: "bg-red-50",
    badge: "bg-red-100 text-red-800", cta: "bg-red-500 hover:bg-red-600",
    ring: "ring-red-300", step: 4,
  },
]

/**
 * Represents the configuration for a category selection card in the Vocabulary Hub dashboard.
 */
export interface VocabHubLevel {
  id: LevelId
  label: string
  icon: string
  count: number
  description: string
  glassBg: string
  glassBorder: string
  shadow: string
}

export const VOCAB_HUB_LEVELS: VocabHubLevel[] = [
  { id: "A1", label: "Beginner", icon: "🌱", count: 100, description: "Essential words for daily life", glassBg: "bg-green-500/10", glassBorder: "border-green-400/20", shadow: "shadow-green-500/20" },
  { id: "A2", label: "Elementary", icon: "🌿", count: 200, description: "Expanded vocabulary for common situations", glassBg: "bg-yellow-500/10", glassBorder: "border-yellow-400/20", shadow: "shadow-yellow-500/20" },
  { id: "B1", label: "Intermediate", icon: "🌳", count: 300, description: "Work, study, and abstract topics", glassBg: "bg-orange-500/10", glassBorder: "border-orange-400/20", shadow: "shadow-orange-500/20" },
  { id: "B2", label: "Upper Intermediate", icon: "🌲", count: 200, description: "Complex topics and professional contexts", glassBg: "bg-red-500/10", glassBorder: "border-red-400/20", shadow: "shadow-red-500/20" },
]

export interface ErrorFallback {
  bg: string
  border: string
  text: string
  btnBg: string
  btnText: string
}

export const ERROR_FALLBACK_CLASSES: Record<LevelId, ErrorFallback> = {
  A1: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", btnBg: "bg-green-100 hover:bg-green-200", btnText: "text-green-700" },
  A2: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", btnBg: "bg-yellow-100 hover:bg-yellow-200", btnText: "text-yellow-700" },
  B1: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", btnBg: "bg-orange-100 hover:bg-orange-200", btnText: "text-orange-700" },
  B2: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", btnBg: "bg-red-100 hover:bg-red-200", btnText: "text-red-700" },
}

export interface QuizLevelLink {
  href: string
  label: string
  sub: string
  bg: string
  badge: string
}

export const QUIZ_LEVEL_LINKS: QuizLevelLink[] = [
  { href: "/a1", label: "A1", sub: "Beginner", bg: "bg-green-50 border-green-200 hover:border-green-400", badge: "bg-green-100 text-green-800" },
  { href: "/a2", label: "A2", sub: "Elementary", bg: "bg-yellow-50 border-yellow-200 hover:border-yellow-400", badge: "bg-yellow-100 text-yellow-800" },
  { href: "/b1", label: "B1", sub: "Intermediate", bg: "bg-orange-50 border-orange-200 hover:border-orange-400", badge: "bg-orange-100 text-orange-800" },
  { href: "/b2", label: "B2", sub: "Upper-Int.", bg: "bg-red-50 border-red-200 hover:border-red-400", badge: "bg-red-100 text-red-800" },
]

export const CEFR_LEVEL_NAMES: Record<string, string> = {
  A1: "A1 – Beginner",
  A2: "A2 – Elementary",
  B1: "B1 – Intermediate",
}


/**
 * Helper function to retrieve the text-color Tailwind class for a given level.
 * 
 * @param level - The CEFR level string (e.g., "A1").
 * @returns A Tailwind text color utility class.
 */
export function getLevelColor(level: string): string {
  if (level.includes("A1")) return "text-green-500"
  if (level === "A2") return "text-yellow-500"
  if (level === "B1") return "text-orange-500"
  return "text-red-500"
}

export function getQuizLevelStyle(level: string, isActive: boolean): string {
  if (!isActive) return "bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
  if (level === "A1") return "bg-green-100 text-green-800 border border-green-300"
  if (level === "A2") return "bg-yellow-100 text-yellow-800 border border-yellow-300"
  return "bg-red-100 text-red-800 border border-red-300"
}
