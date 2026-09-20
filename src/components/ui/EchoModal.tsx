/**
 * RELIC - Echo Intelligence Inspector Modal
 * Displays discovered long-range recurring patterns across life chapters.
 */

import React from 'react';
import { X, Sparkles, Compass, CheckCircle2, ChevronRight } from 'lucide-react';
import { useRelicStore } from '../../lib/store';
import type { EchoPattern } from '../../types/relic';

export function EchoModal() {
  const isEchoModalOpen = useRelicStore((s) => s.isEchoModalOpen);
  const setEchoModalOpen = useRelicStore((s) => s.setEchoModalOpen);
  const echoes = useRelicStore((s) => s.echoes);
  const isEchoModeActive = useRelicStore((s) => s.isEchoModeActive);
  const toggleEchoMode = useRelicStore((s) => s.toggleEchoMode);
  const selectRelic = useRelicStore((s) => s.selectRelic);

  if (!isEchoModalOpen) return null;

  const handleInspectPattern = (pattern: EchoPattern) => {
    if (!isEchoModeActive) {
      toggleEchoMode();
    }
    if (pattern.relicIds.length > 0) {
      selectRelic(pattern.relicIds[0]);
    }
    setEchoModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B14]/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="echo-modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#0F172A] border border-[#C9A227]/40 shadow-2xl text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070B14]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#C9A227]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="echo-modal-title"
                className="font-serif text-lg font-bold text-[#E8D5A3]"
              >
                Echo Intelligence Inspector
              </h2>
              <p className="text-xs text-slate-400">
                Discovered recurring cross-chapter frequencies & long-range habits
              </p>
            </div>
          </div>

          <button
            onClick={() => setEchoModalOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Echo Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Patterns */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#C9A227]/10 to-transparent border border-[#C9A227]/30">
            <div>
              <p className="text-xs font-semibold text-[#E8D5A3]">
                Global Echo Visualization
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Illuminate all cross-chapter repeating threads in gold 3D arcs
              </p>
            </div>
            <button
              onClick={toggleEchoMode}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isEchoModeActive
                  ? 'bg-[#C9A227] text-[#070B14]'
                  : 'bg-[#1E293B] border border-slate-700 text-slate-200 hover:border-[#C9A227]'
              }`}
            >
              {isEchoModeActive ? 'Echoes Active ✓' : 'Activate All Threads'}
            </button>
          </div>

          <div className="grid gap-3">
            {echoes.map((pattern) => (
              <div
                key={pattern.id}
                className="p-4 rounded-xl bg-[#070B14]/80 border border-slate-800 hover:border-[#C9A227]/50 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    <h3 className="text-sm font-semibold text-[#F1F5F9] group-hover:text-[#E8D5A3] transition-colors">
                      {pattern.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-[#38BDF8] border border-slate-700">
                    {pattern.metricLabel}: {pattern.metricValue}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {pattern.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 font-mono">
                    Pattern Strength: {pattern.strength}%
                  </span>
                  <button
                    onClick={() => handleInspectPattern(pattern)}
                    className="flex items-center gap-1 text-[#C9A227] hover:text-[#E8D5A3] font-medium cursor-pointer"
                  >
                    <span>Focus Relics in 3D</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
