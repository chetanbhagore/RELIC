/**
 * RELIC - Accessibility & Keyboard Shortcuts Helper
 * ENHANCED: Shows 1-5 chapter jump shortcuts + improved layout.
 */

import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { useRelicStore } from '../../lib/store';

const SHORTCUTS = [
  { key: '/', label: 'Focus search' },
  { key: '← / →', label: 'Cycle chapters' },
  { key: '1 – 5', label: 'Jump to chapter' },
  { key: 'E', label: 'Toggle Echo Mode' },
  { key: 'Esc', label: 'Close / Deselect' },
];

export function AccessibilityBar() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const selectedRelicId = useRelicStore((s) => s.selectedRelicId);
  const activeChapterId = useRelicStore((s) => s.activeChapterId);
  const chapters = useRelicStore((s) => s.chapters);

  const activeChapterTitle = chapters.find((c) => c.id === activeChapterId)?.title;

  return (
    <>
      {/* Screen Reader Live Region for ARIA Compliance */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedRelicId
          ? `Relic selected: ${selectedRelicId}`
          : activeChapterTitle
          ? `Focused on ${activeChapterTitle}`
          : 'Viewing entire royal reliquary'}
      </div>

      {/* Floating Keyboard Shortcuts Trigger */}
      <div className="absolute bottom-[4.5rem] left-4 z-20 hidden sm:flex items-center gap-2">
        <button
          onClick={() => setShowShortcuts((v) => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F172A]/85 border border-slate-800 text-[11px] text-slate-400 hover:text-[#E8D5A3] hover:border-[#C9A227]/40 backdrop-blur-md transition-all cursor-pointer"
          aria-label="Toggle keyboard shortcuts guide"
          aria-expanded={showShortcuts}
        >
          <Keyboard className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Shortcuts</span>
        </button>
      </div>

      {/* Shortcuts Popover */}
      {showShortcuts && (
        <div
          className="fixed bottom-28 left-4 z-30 w-64 p-3.5 rounded-xl bg-[#0F172A]/97 border border-[#C9A227]/40 shadow-2xl backdrop-blur-xl text-slate-200 text-xs"
          style={{ animation: 'fadeIn 0.2s ease' }}
          role="region"
          aria-label="Keyboard Shortcuts"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
            <span className="font-serif font-bold text-[#E8D5A3] text-sm">Keyboard Nav</span>
            <button
              onClick={() => setShowShortcuts(false)}
              className="p-0.5 text-slate-400 hover:text-slate-100 cursor-pointer"
              aria-label="Close shortcuts popup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            {SHORTCUTS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <span className="text-slate-400">{label}</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[#E8D5A3] font-mono border border-slate-700 text-[10px] shrink-0">
                  {key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800">
            <p className="text-[9px] text-slate-600 font-mono">
              Click any relic in 3D to inspect · Drag to orbit · Scroll to zoom
            </p>
          </div>
        </div>
      )}
    </>
  );
}
