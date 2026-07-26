import { useMemo } from 'react';

/**
 * A custom React hook that dynamically assigns an example sentence to each vocabulary word.
 * It randomly selects a sentence that contains the target word (or matches its category) 
 * from the provided pool of sentences. To prevent repetition, it ensures each sentence 
 * is used only once until all sentences are exhausted.
 * 
 * @param words - An array of vocabulary word objects to be enriched.
 * @param sentences - An array of available example sentence objects.
 * @returns A new array of word objects, each augmented with `dynamicSentenceGerman` and `dynamicSentenceEnglish`.
 */
export function useDynamicSentences(words: any[], sentences: any[]) {
  return useMemo(() => {
    const usedSentenceIds = new Set<number>();
    
    return words.map((word: any) => {
      let bestSentence: any = null;
      const wordGerman = word.german ? word.german.toLowerCase() : '';
      const wordEnglish = word.english ? word.english.toLowerCase() : '';
      const wordCategory = word.category;
      
      let candidates = [...sentences];
      
      while (candidates.length > 0 && !bestSentence) {
        const idx = Math.floor(Math.random() * candidates.length);
        const candidate = candidates[idx];
        candidates.splice(idx, 1);
        
        if (usedSentenceIds.has(candidate.id)) continue;
        
        const candidateGerman = candidate.german ? candidate.german.toLowerCase() : '';
        const candidateEnglish = candidate.english ? candidate.english.toLowerCase() : '';
        const candidateCategory = candidate.category;
        
        const isGoodMatch = (
          wordGerman && candidateGerman.includes(wordGerman) ||
          wordEnglish && candidateEnglish.includes(wordEnglish) ||
          wordCategory && candidateCategory === wordCategory ||
          !wordGerman && !wordEnglish && !wordCategory
        );
        
        if (isGoodMatch) {
          bestSentence = candidate;
          usedSentenceIds.add(candidate.id);
        }
      }
      
      if (!bestSentence) {
        const remainingSentences = sentences.filter(s => !usedSentenceIds.has(s.id));
        if (remainingSentences.length > 0) {
          bestSentence = remainingSentences[Math.floor(Math.random() * remainingSentences.length)];
          usedSentenceIds.add(bestSentence.id);
        }
      }
      
      return { ...word, dynamicSentenceGerman: bestSentence?.german, dynamicSentenceEnglish: bestSentence?.english };
    });
  }, [words, sentences]);
}
