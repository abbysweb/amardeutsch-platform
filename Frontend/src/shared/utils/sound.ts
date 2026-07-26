"use client";

/**
 * Web Audio API sound synthesizer for zero-latency gamified sound effects
 * without relying on external audio assets or network requests.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * Plays a celebratory winning chime for correct answers.
   */
  public playCorrect() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Play ascending harmonic chord (C5 -> E5 -> G5)
      [523.25, 659.25, 783.99].forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        // Fade out smoothly
        gain.gain.setValueAtTime(0.15, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.35);
      });
    } catch (e) {
      // Ignore audio restriction errors on un-interacted tabs
    }
  }

  /**
   * Plays a gentle low tone for incorrect answers.
   */
  public playIncorrect() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      // Drop pitch down slightly for soft negative feedback
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      // Ignore audio errors
    }
  }

  /**
   * Plays a level up / trophy sound when finishing a quiz.
   */
  public playTrophy() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Fanfare: G4 -> C5 -> E5 -> G5
      [392.00, 523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "triangle";
        const start = now + index * 0.07;
        const dur = index === 4 ? 0.6 : 0.2;
        
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    } catch (e) {
      // Ignore audio errors
    }
  }
}

export const soundEngine = new SoundEngine();
