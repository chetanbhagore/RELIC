/**
 * RELIC - First-Time User Onboarding Guide
 * Elegant, royal coachmark banner welcoming judges and users.
 * Automatically dismisses upon interaction or after a brief duration.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, MousePointerClick, Layers, X, HelpCircle } from 'lucide-react';
import { useRelicStore } from '../../lib/store';

export function OnboardingHint() {
  const [isVisible, setIsVisible] = useState(false);
  const selectedRelicId = useRelicStore((s) => s.selectedRelicId);
  const activeChapterId = useRelicStore((s) => s.activeChapterId);

  useEffect(() => {
    // Check if user has previously dismissed
    const hasSeen = localStorage.getItem('relic_onboarding_dismissed');
    if (!hasSeen) {
      // Delay display slightly for smooth entrance after loading screen
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-dismiss on interaction
  useEffect(() => {
    if (selectedRelicId || activeChapterId) {
      setIsVisible(false);
    }
  }, [selectedRelicId, activeChapterId]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('relic_onboarding_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <aside
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 w-[92vw] max-w-lg p-3 sm:p-4 rounded-2xl bg-[#070B14]/95 border border-[#C9A227]/60 shadow-[0_0_35px_rgba(201,162,39,0.22)] backdrop-blur-xl text-slate-200"
      style={{ animation: 'slideInUp 0.35s cubic-bezier(0.16,1,0.3,1)' }}
      role="region"
      aria-label="Welcome Guide and Instructions"
    >
      <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#E8D5A3]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm text-[#F1F5F9] tracking-wide">
              How to Excavate the Reliquary
            </h2>
            <p className="text-[11px] text-[#E8D5A3]">
              Every digital receipt is an artifact reconstructed in 3D space
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Dismiss guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2.5 text-[11px]">
        <div className="flex items-start gap-2 p-2 rounded-xl bg-[#0F172A]/80 border border-slate-800/80">
          <MousePointerClick className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-slate-200 font-semibold">Click Any Relic</strong>
            <span className="text-slate-400 text-[10px]">Open receipt drawer & emotional resonance</span>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-xl bg-[#0F172A]/80 border border-slate-800/80">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-slate-200 font-semibold">Reveal Echoes</strong>
            <span className="text-slate-400 text-[10px]">Trace long-range cross-chapter patterns</span>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-xl bg-[#0F172A]/80 border border-slate-800/80">
          <Layers className="w-3.5 h-3.5 text-[#A78BFA] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-slate-200 font-semibold">Chapters 1–5</strong>
            <span className="text-slate-400 text-[10px]">Fly to distinct reconstructed life eras</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 text-[10px] font-mono text-slate-400">
        <span>Tip: Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">/</kbd> to search · <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> to reset view</span>
        <button
          onClick={handleDismiss}
          className="px-2.5 py-1 rounded-full bg-[#C9A227] text-[#070B14] font-sans font-bold hover:bg-[#E8D5A3] transition-colors cursor-pointer"
        >
          Begin Excavation
        </button>
      </div>
    </aside>
  );
}
