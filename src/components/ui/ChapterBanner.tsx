/**
 * RELIC - Chapter Insight HUD Banner
 * Floating cinematic banner that renders whenever a chapter is active.
 * Displays Roman numeral, Playfair Display title, intelligent 1-2 line insight,
 * financial/event telemetry, and quick reset/navigation buttons.
 */

import React, { useMemo } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { useRelicStore } from '../../lib/store';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

export function ChapterBanner() {
  const activeChapterId = useRelicStore((s) => s.activeChapterId);
  const chapters = useRelicStore((s) => s.chapters);
  const selectChapter = useRelicStore((s) => s.selectChapter);
  const resetView = useRelicStore((s) => s.resetView);

  const currentIdx = useMemo(
    () => chapters.findIndex((c) => c.id === activeChapterId),
    [chapters, activeChapterId]
  );

  const chapter = useMemo(() => {
    if (currentIdx === -1) return null;
    return chapters[currentIdx];
  }, [chapters, currentIdx]);

  if (!chapter) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentIdx - 1 + chapters.length) % chapters.length;
    selectChapter(chapters[prevIdx].id);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentIdx + 1) % chapters.length;
    selectChapter(chapters[nextIdx].id);
  };

  return (
    <aside
      className="absolute top-28 sm:top-24 left-1/2 -translate-x-1/2 z-20 w-[92vw] max-w-2xl px-4 py-3 rounded-2xl bg-[#070B14]/92 border border-[#C9A227]/50 shadow-[0_4px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(201,162,39,0.15)] backdrop-blur-xl text-slate-100 transition-all pointer-events-auto"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
      role="region"
      aria-label={`Active Chapter: ${chapter.title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex flex-col items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#78350F] text-[#070B14] font-serif font-black text-sm shadow-md shrink-0 mt-0.5">
            {ROMAN_NUMERALS[currentIdx] || currentIdx + 1}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif font-black text-base sm:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#FDE68A] to-[#F59E0B] truncate drop-shadow-sm">
                {chapter.title.replace(/^Chapter\s+[IVX]+:\s*/, '')}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#FDE68A] font-semibold">
                {chapter.relicCount} Relics
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
                {chapter.dominantMood}
              </span>
            </div>

            {/* 1-2 line intelligent synthesis insight */}
            <p className="text-xs text-[#FDE68A] mt-1 font-sans font-medium italic leading-relaxed">
              ✦ {chapter.insightLine || chapter.narration.split('.')[0] + '.'}
            </p>
          </div>
        </div>

        {/* Right side navigation & reset */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-[#0F172A] border border-slate-800 text-slate-300 hover:text-[#C9A227] hover:border-[#C9A227]/50 transition-colors cursor-pointer"
            title="Previous Chapter (Left Arrow)"
            aria-label="Previous Chapter"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-[#0F172A] border border-slate-800 text-slate-300 hover:text-[#C9A227] hover:border-[#C9A227]/50 transition-colors cursor-pointer"
            title="Next Chapter (Right Arrow)"
            aria-label="Next Chapter"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100 text-xs transition-colors cursor-pointer ml-1"
            title="Reset View / All Chapters (Esc)"
            aria-label="Reset View to all chapters"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline font-mono text-[10px]">Reset</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
