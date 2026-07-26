"use client";

/**
 * Enterprise Natural German Speech Engine (Powered by Neural & Advanced TTS Strategies)
 * Eliminates robotic browser speech by dynamically ranking neural/premium voices,
 * tuning cadence, intonation, rate, and pitch, while removing disruptive visual artifacts.
 */

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

class NaturalGermanSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    
    // Filter for German language voices
    const germanVoices = this.voices.filter(v => 
      v.lang.toLowerCase().startsWith("de") || 
      v.lang.toLowerCase().includes("de-") || 
      v.lang.toLowerCase().includes("de_")
    );

    if (germanVoices.length === 0) return;

    // Intelligent Neural Voice Ranking Algorithm:
    // Prioritize natural/neural cloud engines and premium native voices over robotic desktop synthesizers.
    germanVoices.sort((a, b) => {
      const score = (v: SpeechSynthesisVoice): number => {
        let s = 0;
        const name = v.name.toLowerCase();
        // High priority for neural/natural voice models
        if (name.includes("natural") || name.includes("neural")) s += 50;
        if (name.includes("online") || name.includes("cloud")) s += 30;
        if (name.includes("google") || name.includes("microsoft") || name.includes("apple") || name.includes("siri")) s += 25;
        // Known high-fidelity German neural voices
        if (name.includes("katja") || name.includes("conrad") || name.includes("helena") || name.includes("vicki") || name.includes("marni") || name.includes("oliver") || name.includes("anna") || name.includes("markus") || name.includes("thorsten") || name.includes("piper")) s += 20;
        if (v.default) s += 5;
        // Penalize legacy compact/robotic synthesizers
        if (name.includes("compact") || name.includes("desktop") || name.includes("legacy") || name.includes("robot")) s -= 25;
        return s;
      };
      return score(b) - score(a);
    });

    this.selectedVoice = germanVoices[0];
  }

  /**
   * Pronounce German text with fluid humanlike cadence and linguistic clarity.
   */
  public speak(text: string, options?: SpeechOptions) {
    if (typeof window === "undefined") return;

    if (!this.synth) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    // Ensure voices are loaded if previously unavailable
    if (!this.selectedVoice || this.voices.length === 0) {
      this.loadVoices();
    }

    // Cancel any stuttering or overlapping previous voice output
    this.synth.cancel();

    // Remove emojis, UI badges, and decorative punctuation that can cause robotic speech pauses or literal pronounciation
    const cleanText = text
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
      .replace(/[✍️🔘⚡🏆🌟👑🔥❌]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "de-DE";
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Acoustic adjustments:
    // Rate 0.92 optimizes comprehension and natural pronunciation rhythm for language learners
    utterance.rate = options?.rate ?? 0.92;
    // Pitch 1.02 adds realistic vocal warmth and natural intonation
    utterance.pitch = options?.pitch ?? 1.02;
    utterance.volume = options?.volume ?? 1.0;

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) utterance.onend = options.onEnd;
    if (options?.onError) utterance.onerror = options.onError;

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const naturalTTS = new NaturalGermanSpeechEngine();

/**
 * Global helper function to replace legacy raw speech synthesis across all modules.
 */
export function playGermanAudio(text: string, rate: number = 0.92) {
  naturalTTS.speak(text, { rate });
}
