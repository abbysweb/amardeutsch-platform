export const VALID_CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type CEFRLevel = typeof VALID_CEFR_LEVELS[number];

export interface LevelMeta {
  readonly label: string;
  readonly description: string;
  readonly bgColor: string;
  readonly textColor: string;
  readonly borderColor: string;
  readonly accentColor: string;
  readonly order: number;
}

export const LEVEL_META: Readonly<Record<CEFRLevel, LevelMeta>> = Object.freeze({
  A1: {
    label: 'A1 Beginner',
    description: 'Absolute beginner - greetings, numbers, basic phrases',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    accentColor: 'bg-green-500',
    order: 1,
  },
  A2: {
    label: 'A2 Elementary',
    description: 'Elementary - past tense, dative, modal verbs',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    accentColor: 'bg-yellow-500',
    order: 2,
  },
  B1: {
    label: 'B1 Intermediate',
    description: 'Intermediate - subjunctive, complex grammar, professional topics',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300',
    accentColor: 'bg-orange-500',
    order: 3,
  },
  B2: {
    label: 'B2 Upper-Intermediate',
    description: 'Upper-Intermediate - nuanced grammar, academic and professional German',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    accentColor: 'bg-red-500',
    order: 4,
  },
  C1: {
    label: 'C1 Advanced',
    description: 'Advanced - complex structures, specialised vocabulary, fluent expression',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-300',
    accentColor: 'bg-purple-500',
    order: 5,
  },
  C2: {
    label: 'C2 Mastery',
    description: 'Mastery - near-native proficiency, subtle nuances, academic writing',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-800',
    borderColor: 'border-violet-300',
    accentColor: 'bg-violet-500',
    order: 6,
  },
});

export function isCEFRLevel(value: unknown): value is CEFRLevel {
  return typeof value === 'string' && VALID_CEFR_LEVELS.includes(value as CEFRLevel);
}

export function getLevelsAscending(): ReadonlyArray<CEFRLevel> {
  return [...VALID_CEFR_LEVELS].sort((a, b) => LEVEL_META[a].order - LEVEL_META[b].order);
}

export function getNextLevel(level: CEFRLevel): CEFRLevel | undefined {
  const levels = getLevelsAscending();
  const idx = levels.indexOf(level);
  return idx < levels.length - 1 ? levels[idx + 1] : undefined;
}

export interface LevelConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

export const LEVEL_CONFIGS: Record<CEFRLevel, LevelConfig> = {
  A1: { label: 'A1 Beginner', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  A2: { label: 'A2 Elementary', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  B1: { label: 'B1 Intermediate', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
  B2: { label: 'B2 Upper Intermediate', bgColor: 'bg-red-100', textColor: 'text-red-800' },
  C1: { label: 'C1 Advanced', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
  C2: { label: 'C2 Mastery', bgColor: 'bg-violet-100', textColor: 'text-violet-800' },
};

export function getLevelConfig(level: string): LevelConfig {
  return LEVEL_CONFIGS[level as CEFRLevel] ?? LEVEL_CONFIGS.A1;
}
