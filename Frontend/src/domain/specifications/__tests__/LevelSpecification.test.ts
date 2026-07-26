import { describe, it, expect } from 'vitest';
import { LevelSpecification, CategorySpecification, SearchTextSpecification } from '../../specifications/LevelSpecification';
import { Vocabulary } from '../../entities/Vocabulary';

function makeVocab(level: string, german: string, category: string): Vocabulary {
  return new Vocabulary({
    id: Math.random(),
    level: level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
    category,
    german,
    english: german,
    article: undefined,
  });
}

describe('LevelSpecification', () => {
  const items = [
    makeVocab('A1', 'Hallo', 'Greetings'),
    makeVocab('A1', 'Tschüss', 'Greetings'),
    makeVocab('A2', 'Arbeit', 'Work'),
    makeVocab('B1', 'Bewerbung', 'Work'),
  ];

  it('filters by level', () => {
    const spec = new LevelSpecification('A1');
    const result = items.filter(i => spec.isSatisfiedBy(i));
    expect(result).toHaveLength(2);
    expect(result.every(r => r.getLevel() === 'A1')).toBe(true);
  });
});

describe('CategorySpecification', () => {
  const items = [
    makeVocab('A1', 'Hallo', 'Greetings'),
    makeVocab('A2', 'Arbeit', 'Work'),
  ];

  it('filters by category', () => {
    const spec = new CategorySpecification('Work');
    const result = items.filter(i => spec.isSatisfiedBy(i));
    expect(result).toHaveLength(1);
    expect(result[0].getGerman()).toBe('Arbeit');
  });
});

describe('Specification combinators', () => {
  const items = [
    makeVocab('A1', 'Hallo', 'Greetings'),
    makeVocab('A1', 'Guten Morgen', 'Greetings'),
    makeVocab('A2', 'Arbeit', 'Work'),
    makeVocab('B1', 'Bewerbung', 'Work'),
  ];

  it('supports AND combinator', () => {
    const spec = new LevelSpecification('A1').and(new CategorySpecification('Greetings'));
    const result = items.filter(i => spec.isSatisfiedBy(i));
    expect(result).toHaveLength(2);
  });

  it('supports OR combinator', () => {
    const spec = new LevelSpecification('A2').or(new CategorySpecification('Greetings'));
    const result = items.filter(i => spec.isSatisfiedBy(i));
    expect(result).toHaveLength(3);
  });

  it('supports NOT combinator', () => {
    const spec = new LevelSpecification('A1').not();
    const result = items.filter(i => spec.isSatisfiedBy(i));
    expect(result).toHaveLength(2);
    expect(result.every(r => r.getLevel() !== 'A1')).toBe(true);
  });
});

describe('SearchTextSpecification', () => {
  const items = [
    makeVocab('A1', 'Hallo', 'Greetings'),
    makeVocab('A2', 'Arbeit', 'Work'),
  ];

  it('matches search text against search tokens', () => {
    const spec = new SearchTextSpecification('hallo');
    const result = items.filter(i => spec.isSatisfiedBy(i));
    expect(result).toHaveLength(1);
    expect(result[0].getGerman()).toBe('Hallo');
  });
});
