/**
 * RELIC - Bottom Journey Strip
 * Non-timeline spatial navigation bar showing the architecture of life phases.
 * ENHANCED: Shows data-driven insight line per chapter.
 */

import React from 'react';
import { useRelicStore } from '../../lib/store';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

export function JourneyStrip() {
  const chapters = useRelicStore((s) => s.chapters);
  const activeChapterId = useRelicStore((s) => s.activeChapterId);
  const selectChapter = useRelicStore((s) => s.selectChapter);

  return (
    <div
      className="absolute bottom-3 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none"
      role="navigation"
      aria-label="Chapter Journey Navigation Strip"
    >
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#070B14]/85 border border-[#1E293B] shadow-2xl backdrop-blur-md pointer-events-auto max-w-full overflow-x-auto no-scrollbar">
        {chapters.map((chapter, idx) => {
          const isActive = activeChapterId === chapter.id;

          return (
            <button
              key={chapter.id}
              onClick={() => selectChapter(isActive ? null : chapter.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-[#C9A227] shadow-lg shadow-[#C9A227]/15 ring-1 ring-[#C9A227]'
                  : 'bg-[#0B1120]/70 border border-slate-800/80 hover:bg-[#0F172A] hover:border-slate-700'
              }`}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Navigate to Chapter ${ROMAN_NUMERALS[idx]}: ${chapter.title}`}
            >
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-lg font-serif font-bold text-xs shrink-0 ${
                  isActive
                    ? 'bg-[#C9A227] text-[#070B14]'
                    : 'bg-slate-800 text-[#E8D5A3]'
                }`}
              >
                {ROMAN_NUMERALS[idx]}
              </div>

              <div className="hidden sm:block">
                <p className="text-[11px] font-semibold text-slate-200">
                  {chapter.title.replace(/^Chapter\s+[IVX]+:\s*/, '')}
                </p>
                <p className="text-[9px] text-slate-400 font-mono">
                  {chapter.relicCount} relics
                  {chapter.insightLine ? ` · ${chapter.insightLine}` : ` · ${chapter.dominantMood}`}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
