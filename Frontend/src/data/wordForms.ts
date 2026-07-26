export { a1Exam } from '@/levels/a1';

import type { Exam } from '@/domain/entities/types';
import { a1Exam } from '@/levels/a1';

// Export word forms data for backwards compatibility
export interface FormField {
  label: string;
  value: string;
}

export interface WordForms {
  noun?: string;
  adjective?: string;
  adverb?: string;
  context?: string;
  forms: FormField[];
  sentences: { german: string; english: string }[];
}

export const wordForms: Record<number, WordForms> = {
  1: {
    noun: "der Mann",
    adjective: "männlich",
    adverb: "männlich",
    context: "People & Family",
    forms: [
      { label: "Nominativ", value: "der Mann" },
      { label: "Akkusativ", value: "den Mann" },
      { label: "Dativ", value: "dem Mann" },
      { label: "Genitiv", value: "des Mannes" },
      { label: "Plural Nominativ", value: "die Männer" },
    ],
    sentences: [
      { german: "Der Mann liest ein Buch.", english: "The man is reading a book." },
      { german: "Ich sehe den Mann.", english: "I see the man." },
      { german: "Ich gebe dem Mann das Buch.", english: "I give the man the book." },
    ],
  },
  // Add more as needed
};