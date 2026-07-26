import { resolveWordVisualIcon } from "@/shared/utils/semanticIcons";

const OVERRIDES_STORAGE_KEY = "deutsch_admin_vocab_overrides";
const ADDED_STORAGE_KEY = "deutsch_admin_vocab_added";
const DELETED_STORAGE_KEY = "deutsch_admin_vocab_deleted";

export interface AdminWordItem {
  id: number;
  german: string;
  article: string;
  english: string;
  plural: string;
  level: string;
  category: string;
  example: string;
  exampleEn: string;
  tip: string;
  ipa: string;
  emoji: string;
}

export interface VocabOverride {
  id: number | string;
  german?: string;
  english?: string;
  article?: string;
  level?: string;
  category?: string;
  emoji?: string;
  example?: string;
  exampleEn?: string;
  tip?: string;
}

/**
 * Get all admin-edited overrides from local storage.
 */
export function getAdminOverrides(): Record<string, VocabOverride> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Get all newly added words created via the Admin Panel.
 */
export function getAdminAddedWords(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(ADDED_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Get all word IDs deleted via the Admin Panel.
 */
export function getAdminDeletedIds(): (number | string)[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(DELETED_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Apply admin CRUD overrides (Creations, Updates, Deletions) to any base word deck.
 */
export function applyAdminOverrides<T extends { id: number | string; emoji?: string; [key: string]: any }>(baseList: T[]): T[] {
  if (typeof window === "undefined") return baseList;

  const overrides = getAdminOverrides();
  const added = getAdminAddedWords() as unknown as T[];
  const deleted = new Set(getAdminDeletedIds());

  // 1. Filter out deleted words and apply edits/overrides to existing words
  const modifiedBase = baseList
    .filter(word => !deleted.has(word.id) && !deleted.has(word.id.toString()))
    .map(word => {
      const override = overrides[word.id.toString()] || overrides[word.id];
      if (!override) return word;

      const merged = {
        ...word,
        ...override,
        id: word.id, // preserve ID
        emoji: override.emoji || word.emoji
      };
      // Re-evaluate icon if needed
      if (!override.emoji || override.emoji === "📚") {
        merged.emoji = resolveWordVisualIcon(merged as any);
      }
      return merged;
    });

  // 2. Append newly added words
  const validAdded = added.filter(w => !deleted.has(w.id) && !deleted.has(w.id.toString()));
  
  return [...validAdded, ...modifiedBase];
}

/**
 * Save an edited word override in Admin panel.
 */
export function saveAdminOverride(updated: VocabOverride): void {
  if (typeof window === "undefined") return;
  const overrides = getAdminOverrides();
  overrides[updated.id.toString()] = updated;
  localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
}

/**
 * Create and save a brand new word/question in Admin panel.
 */
export function createAdminWord(newWord: any): void {
  if (typeof window === "undefined") return;
  const added = getAdminAddedWords();
  added.unshift(newWord);
  localStorage.setItem(ADDED_STORAGE_KEY, JSON.stringify(added));
}

/**
 * Delete a word/question in Admin panel.
 */
export function deleteAdminWord(id: number | string): void {
  if (typeof window === "undefined") return;
  
  // Add to deleted IDs
  const deleted = getAdminDeletedIds();
  if (!deleted.includes(id) && !deleted.includes(id.toString())) {
    deleted.push(id);
    localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(deleted));
  }

  // If it was in added words, remove it directly
  const added = getAdminAddedWords();
  const remainingAdded = added.filter(w => w.id !== id && w.id.toString() !== id.toString());
  localStorage.setItem(ADDED_STORAGE_KEY, JSON.stringify(remainingAdded));

  // Remove override if present
  const overrides = getAdminOverrides();
  delete overrides[id.toString()];
  localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
}

/**
 * Reset all Admin modifications to original 3NF factory baseline.
 */
export function resetAdminData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OVERRIDES_STORAGE_KEY);
  localStorage.removeItem(ADDED_STORAGE_KEY);
  localStorage.removeItem(DELETED_STORAGE_KEY);
}
