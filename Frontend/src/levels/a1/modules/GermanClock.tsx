"use client";

import { useState, useCallback } from "react";

const NUMBER_WORDS: Record<number, string> = {
  1: "eins", 2: "zwei", 3: "drei", 4: "vier", 5: "fünf", 6: "sechs",
  7: "sieben", 8: "acht", 9: "neun", 10: "zehn", 11: "elf", 12: "zwölf",
  13: "dreizehn", 14: "vierzehn", 15: "fünfzehn", 16: "sechzehn",
  17: "siebzehn", 18: "achtzehn", 19: "neunzehn", 20: "zwanzig",
  21: "einundzwanzig", 22: "zweiundzwanzig", 23: "dreiundzwanzig",
  24: "vierundzwanzig", 30: "dreißig", 35: "fünfunddreißig",
  40: "vierzig", 45: "fünfundvierzig", 50: "fünfzig", 55: "fünfundfünfzig",
};

const HOUR_WORDS: Record<number, string> = {
  1: "ein", 2: "zwei", 3: "drei", 4: "vier", 5: "fünf", 6: "sechs",
  7: "sieben", 8: "acht", 9: "neun", 10: "zehn", 11: "elf", 12: "zwölf",
  13: "dreizehn", 14: "vierzehn", 15: "fünfzehn", 16: "sechzehn",
  17: "siebzehn", 18: "achtzehn", 19: "neunzehn", 20: "zwanzig",
  21: "einundzwanzig", 22: "zweiundzwanzig", 23: "dreiundzwanzig",
  0: "null", 24: "vierundzwanzig",
};

function formalTime(h: number, m: number): string {
  if (m === 0) return `Es ist ${HOUR_WORDS[h]} Uhr.`;
  if (m < 10) return `Es ist ${HOUR_WORDS[h]} Uhr ${NUMBER_WORDS[m]}.`;
  return `Es ist ${HOUR_WORDS[h]} Uhr ${NUMBER_WORDS[m]}.`;
}

function informalTime(h: number, m: number): string {
  const nextH = h === 23 ? 0 : h + 1;
  const curr12 = h % 12 || 12;
  const next12 = nextH % 12 || 12;

  if (m === 0) return `Es ist ${HOUR_WORDS[curr12]} Uhr.`;
  if (m === 15) return `Es ist Viertel nach ${HOUR_WORDS[curr12]}.`;
  if (m === 30) return `Es ist halb ${HOUR_WORDS[next12]}.`;
  if (m === 45) return `Es ist Viertel vor ${HOUR_WORDS[next12]}.`;
  if (m < 30) return `Es ist ${NUMBER_WORDS[m]} nach ${HOUR_WORDS[curr12]}.`;
  return `Es ist ${NUMBER_WORDS[60 - m]} vor ${HOUR_WORDS[next12]}.`;
}

export function GermanClock() {
  const [hours, setHours] = useState(14);
  const [minutes, setMinutes] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  const hAngle = ((hours % 12) * 30) + minutes * 0.5;
  const mAngle = minutes * 6;

  const handleClockClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    let angle = Math.atan2(x, -y) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    const newMin = Math.round(angle / 6) % 60;
    const nearest5 = Math.round(newMin / 5) * 5;
    const finalMin = nearest5 === 60 ? 0 : nearest5;
    setMinutes(finalMin);
    if (finalMin === 0) {
      const newH = Math.round(angle / 30) % 12;
      setHours(newH === 0 ? 12 : newH);
    }
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setHours(Math.floor(val / 60));
    setMinutes(val % 60);
  };

  const currentVal = hours * 60 + minutes;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 mb-6 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          🕐 German Clock — Time Practice
        </h3>
        <button
          onClick={() => {
            const now = new Date();
            setHours(now.getHours());
            setMinutes(Math.round(now.getMinutes() / 5) * 5);
          }}
          className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-medium"
        >
          Current Time
        </button>
      </div>
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
        <svg
          viewBox="0 0 200 200"
          className="w-48 h-48 sm:w-56 sm:h-56 cursor-pointer shrink-0"
          onClick={handleClockClick}
        >
          <circle cx="100" cy="100" r="95" fill="none" stroke="#e4e4e7" strokeWidth="4" />
          <circle cx="100" cy="100" r="2" fill="#18181b" />
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => {
            const a = ((n - 3) * 30 * Math.PI) / 180;
            const x = 100 + 78 * Math.cos(a);
            const y = 100 + 78 * Math.sin(a);
            const isMain = n % 3 === 0;
            return (
              <text
                key={n}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className={isMain ? "text-sm font-bold fill-zinc-800" : "text-xs fill-zinc-500"}
              >
                {n}
              </text>
            );
          })}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => {
            const a = (n * 30 * Math.PI) / 180;
            const x1 = 100 + 82 * Math.cos(a);
            const y1 = 100 + 82 * Math.sin(a);
            const x2 = 100 + 90 * Math.cos(a);
            const y2 = 100 + 90 * Math.sin(a);
            return (
              <line key={n} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4d4d8" strokeWidth="1.5" />
            );
          })}
          <line
            x1="100" y1="100"
            x2={100 + 45 * Math.sin((hAngle * Math.PI) / 180)}
            y2={100 - 45 * Math.cos((hAngle * Math.PI) / 180)}
            stroke="#18181b" strokeWidth="4.5" strokeLinecap="round"
          />
          <line
            x1="100" y1="100"
            x2={100 + 65 * Math.sin((mAngle * Math.PI) / 180)}
            y2={100 - 65 * Math.cos((mAngle * Math.PI) / 180)}
            stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="4" fill="#22c55e" />
        </svg>

        <div className="flex-1 w-full max-w-sm space-y-4">
          <div className="text-center sm:text-left">
            <div className="text-3xl font-bold text-zinc-900 mb-1 font-mono tracking-wider">
              {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Drag to set time
            </label>
            <input
              type="range"
              min={0}
              max={1439}
              step={5}
              value={currentVal}
              onChange={handleSliderChange}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-zinc-200 accent-green-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:55</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setHours(8); setMinutes(0); }}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
            >
              8:00
            </button>
            <button
              onClick={() => { setHours(12); setMinutes(15); }}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
            >
              12:15
            </button>
            <button
              onClick={() => { setHours(15); setMinutes(30); }}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
            >
              15:30
            </button>
            <button
              onClick={() => { setHours(18); setMinutes(45); }}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
            >
              18:45
            </button>
            <button
              onClick={() => { setHours(23); setMinutes(55); }}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
            >
              23:55
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-green-200">
          <div className="p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1.5">Formal (24h)</p>
            <p className="text-base sm:text-lg font-semibold text-zinc-900 leading-relaxed">
              {formalTime(hours, minutes)}
            </p>
          </div>
          <div className="p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1.5">Informal (12h)</p>
            <p className="text-base sm:text-lg font-semibold text-zinc-900 leading-relaxed">
              {informalTime(hours, minutes)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
