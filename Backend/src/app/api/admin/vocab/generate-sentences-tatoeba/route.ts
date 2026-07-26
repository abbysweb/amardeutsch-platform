import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
const TATOEBA_API = 'https://api.tatoeba.org/v1/sentences';

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function isCompleteSentence(text: string): boolean {
  if (!text || text.length < 15) return false;
  const t = text.trim();
  if (!t.endsWith('.') && !t.endsWith('!') && !t.endsWith('?')) return false;
  if (t.includes('…') || t.includes('...')) return false;
  if (t.includes('/')) return false;
  if (t.includes('(') || t.includes(')')) return false;
  if (t.startsWith('-') || t.startsWith(',')) return false;
  return true;
}

function containsWord(text: string, word: string): boolean {
  const t = text.toLowerCase();
  const w = word.toLowerCase();
  if (!t.includes(w)) return false;
  const idx = t.indexOf(w);
  if (idx > 0 && /[a-zäöüß]/.test(t[idx - 1])) return false;
  const end = idx + w.length;
  if (end < t.length && /[a-zäöüß]/.test(t[end])) return false;
  return true;
}

async function fetchTatoebaSentence(
  word: string,
  article: string | null
): Promise<{ german: string; english: string } | null> {
  try {
    const url = `${TATOEBA_API}?lang=deu&q=${encodeURIComponent(word)}&trans:lang=eng&showtrans=all&sort=relevance&limit=10`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const json = await res.json();
    const data: any[] = json.data || [];

    for (const item of data) {
      const germanText: string = item.text;
      if (!isCompleteSentence(germanText)) continue;
      if (!containsWord(germanText, word)) continue;

      const translations: any[] = item.translations || [];
      const englishTrans = translations.find(t => t.lang === 'eng');
      if (!englishTrans) continue;
      const englishText: string = englishTrans.text;
      if (!isCompleteSentence(englishText)) continue;

      return { german: germanText, english: englishText };
    }

    return null;
  } catch {
    return null;
  }
}

function generateTemplateSentence(german: string, english: string, article: string | null): { german: string; english: string } {
  const capGerman = german.charAt(0).toUpperCase() + german.slice(1);
  const capEnglish = english.charAt(0).toUpperCase() + english.slice(1);
  const a = article?.toLowerCase() || '';
  const akk = a === 'der' ? 'den' : a;
  const hasArticle = ['der', 'die', 'das'].includes(a);
  const isVerb = !hasArticle && german.endsWith('en');

  if (hasArticle) {
    const nounPatterns: { german: string; english: string }[] = [
      { german: `Das ist ${a} ${german}.`, english: `This is the ${capEnglish}.` },
      { german: `Ich sehe ${akk} ${german}.`, english: `I see the ${capEnglish}.` },
      { german: `Hier ist ${a} ${german}.`, english: `Here is the ${capEnglish}.` },
      { german: `Ich mag ${akk} ${german}.`, english: `I like the ${capEnglish}.` },
      { german: `Kannst du ${akk} ${german} sehen?`, english: `Can you see the ${capEnglish}?` },
      { german: `${a.charAt(0).toUpperCase() + a.slice(1)} ${german} ist praktisch.`, english: `The ${capEnglish} is practical.` },
    ];
    const idx = Math.floor(Math.random() * nounPatterns.length);
    return nounPatterns[idx];
  }

  if (isVerb) {
    const verbPatterns: { german: string; english: string }[] = [
      { german: `${capGerman} ist eine wichtige Tätigkeit.`, english: `${capEnglish} is an important activity.` },
      { german: `Heute lerne ich: ${capGerman}.`, english: `Today I learn: ${capEnglish}.` },
      { german: `Ich möchte ${german.toLowerCase()} lernen.`, english: `I want to learn ${capEnglish.toLowerCase()}.` },
      { german: `${capGerman} kann jeder lernen.`, english: `Anyone can learn ${capEnglish.toLowerCase()}.` },
    ];
    const idx = Math.floor(Math.random() * verbPatterns.length);
    return verbPatterns[idx];
  }

  const genericPatterns: { german: string; english: string }[] = [
    { german: `${capGerman} ist wichtig.`, english: `${capEnglish} is important.` },
    { german: `Heute lerne ich: ${capGerman}.`, english: `Today I learn: ${capEnglish}.` },
    { german: `${capGerman} gefällt mir.`, english: `I like ${capEnglish}.` },
    { german: `Jeder kennt ${capGerman}.`, english: `Everyone knows ${capEnglish}.` },
    { german: `Ich denke an ${capGerman}.`, english: `I think about ${capEnglish}.` },
  ];
  const idx = Math.floor(Math.random() * genericPatterns.length);
  return genericPatterns[idx];
}

export async function POST() {
  try {
    const words = await prisma.vocabulary.findMany({
      orderBy: [{ levelId: 'asc' }, { id: 'asc' }],
    });

    let updated = 0;
    let fromTatoeba = 0;
    let fromTemplate = 0;
    let failed = 0;

    for (const word of words) {
      if (word.germanSentence) {
        updated++;
        continue;
      }
      let result: { german: string; english: string } | null = null;

      const tatoeba = await fetchTatoebaSentence(word.german, word.article);
      if (tatoeba) {
        result = tatoeba;
        fromTatoeba++;
      } else {
        result = generateTemplateSentence(word.german, word.english || '', word.article);
        fromTemplate++;
      }

      await prisma.vocabulary.update({
        where: { id: word.id },
        data: { germanSentence: result.german, englishSentence: result.english },
      });

      updated++;

      if (updated % 50 === 0) {
        console.log(`[Tatoeba] ${updated}/${words.length} words processed`);
      }

      await sleep(100);
    }

    return NextResponse.json({
      success: true,
      total: words.length,
      updated,
      fromTatoeba,
      fromTemplate,
      failed,
      message: `Generated sentences for ${updated} words. ${fromTatoeba} from Tatoeba, ${fromTemplate} from templates.`,
    });
  } catch (error: any) {
    console.error('Tatoeba Generate Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
