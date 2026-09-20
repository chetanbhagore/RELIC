/**
 * RELIC - Accessibility & Keyboard Shortcuts Helper
 * Provides ARIA live region announcements, keyboard navigation hints,
 * and high-contrast / visual clarity settings for FAIE accessibility audits.
 */

import React, { useState } from 'react';
import { Keyboard, Eye, HelpCircle, X } from 'lucide-react';
import { useRelicStore } from '../../lib/store';

export function AccessibilityBar() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const selectedRelicId = useRelicStore((s) => s.selectedRelicId);
  const activeChapterId = useRelicStore((s) => s.activeChapterId);

  return (
    <>
      {/* Screen Reader Live Region for ARIA Compliance */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {selectedRelicId
          ? `Relic selected: ${selectedRelicId}`
          : activeChapterId
          ? `Focused on ${activeChapterId}`
          : 'Viewing entire royal reliquary'}
      </div>

      {/* Floating Accessibility Trigger */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2">
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

      {/* Shortcuts Modal / Popover */}
      {showShortcuts && (
        <div
          className="fixed bottom-14 left-4 z-30 w-72 p-3.5 rounded-xl bg-[#0F172A]/95 border border-[#C9A227]/40 shadow-2xl backdrop-blur-xl text-slate-200 text-xs space-y-2.5"
          role="region"
          aria-label="Keyboard Shortcuts"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-serif font-bold text-[#E8D5A3]">
              Keyboard Navigation
            </span>
            <button
              onClick={() => setShowShortcuts(false)}
              className="p-0.5 text-slate-400 hover:text-slate-100 cursor-pointer"
              aria-label="Close shortcuts popup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Search Relics</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                /
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Cycle Chapters</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                ← / →
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Close / Deselect</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                Esc
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Toggle Echo Mode</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                E
              </kbd>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
