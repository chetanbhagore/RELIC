/**
 * RELIC - Selected Relic Detail Drawer
 * High-end sliding panel presenting the physical receipt card,
 * Moment fusion reasoning, chapter story, and discoverable connected relics.
 */

import { useMemo } from 'react';
import {
  X,
  MapPin,
  Clock,
  Sparkles,
  Link2,
  Coins,
  Music2,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { useRelicStore } from '../../lib/store';
import type { Relic } from '../../types/relic';

export function DetailPanel() {
  const selectedRelicId = useRelicStore((s) => s.selectedRelicId);
  const isDetailPanelOpen = useRelicStore((s) => s.isDetailPanelOpen);
  const setDetailPanelOpen = useRelicStore((s) => s.setDetailPanelOpen);
  const allRelics = useRelicStore((s) => s.allRelics);
  const moments = useRelicStore((s) => s.moments);
  const chapters = useRelicStore((s) => s.chapters);
  const selectRelic = useRelicStore((s) => s.selectRelic);

  const selectedRelic = useMemo(
    () => allRelics.find((r) => r.id === selectedRelicId) || null,
    [allRelics, selectedRelicId]
  );

  const currentMoment = useMemo(() => {
    if (!selectedRelic?.momentId) return null;
    return moments.find((m) => m.id === selectedRelic.momentId) || null;
  }, [selectedRelic, moments]);

  const currentChapter = useMemo(() => {
    if (!selectedRelic?.chapterId) return null;
    return chapters.find((c) => c.id === selectedRelic.chapterId) || null;
  }, [selectedRelic, chapters]);

  const connectedRelics = useMemo(() => {
    if (!selectedRelic) return [];
    return selectedRelic.connectedRelicIds
      .map((id) => allRelics.find((r) => r.id === id))
      .filter(Boolean) as Relic[];
  }, [selectedRelic, allRelics]);

  if (!isDetailPanelOpen || !selectedRelic) {
    return null;
  }

  const formattedDate = new Date(selectedRelic.timestamp).toLocaleDateString(
    'en-US',
    {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  const formattedTime = new Date(selectedRelic.timestamp).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <aside
      className="fixed top-14 bottom-0 right-0 z-30 w-full sm:w-[420px] bg-[#070B14]/95 border-l border-[#1E293B] shadow-2xl backdrop-blur-xl flex flex-col transition-transform duration-300 ease-out text-slate-200"
      role="complementary"
      aria-label="Relic Details Panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#0F172A]/70">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#E8D5A3]">
            {selectedRelic.category} RELIC
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            #{selectedRelic.id}
          </span>
        </div>

        <button
          onClick={() => setDetailPanelOpen(false)}
          className="p-1 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close detail panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Physical Receipt Card */}
        <div className="relative p-4 rounded-xl bg-gradient-to-b from-[#0F172A] to-[#070B14] border border-[#C9A227]/40 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#F1F5F9] leading-snug">
                {selectedRelic.title}
              </h2>
              <p className="text-xs text-[#E8D5A3] mt-0.5 font-medium">
                {selectedRelic.subtitle}
              </p>
            </div>
            {selectedRelic.details.amount && (
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-[#F59E0B]">
                  ₹{selectedRelic.details.amount.toLocaleString()}
                </span>
                <p className="text-[9px] text-slate-400">INR</p>
              </div>
            )}
          </div>

          {/* Time & Place Bar */}
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>
                {formattedDate} · {formattedTime}
              </span>
            </div>
            {selectedRelic.location?.city && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>
                  {selectedRelic.location.name || selectedRelic.location.city}
                </span>
              </div>
            )}
          </div>

          {/* Specific Details based on category */}
          {selectedRelic.details.artist && (
            <div className="mt-2.5 p-2 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Music2 className="w-3.5 h-3.5 text-[#818CF8]" />
                <span className="text-slate-300 font-medium">
                  {selectedRelic.details.artist}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {selectedRelic.details.album || 'Single'}
              </span>
            </div>
          )}

          {/* Context Snippet */}
          {selectedRelic.details.contextSnippet && (
            <p className="mt-3 text-xs text-slate-300 italic leading-relaxed bg-[#1E293B]/40 p-2.5 rounded-lg border-l-2 border-[#C9A227]">
              "{selectedRelic.details.contextSnippet}"
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {selectedRelic.details.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Fused Moment Section */}
        {currentMoment && (
          <div className="p-3.5 rounded-xl bg-[#0F172A]/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fused Moment: {currentMoment.title}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {currentMoment.narration}
            </p>
            <div className="text-[10px] text-slate-500 font-mono">
              Resonance: {currentMoment.mood} · {currentMoment.relicIds.length}{' '}
              intertwined relics
            </div>
          </div>
        )}

        {/* Chapter Story Context */}
        {currentChapter && (
          <div className="p-3.5 rounded-xl bg-[#0F172A]/80 border border-[#C9A227]/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-[#E8D5A3]">
                {currentChapter.title}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentChapter.periodLabel.split('·')[0]}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {currentChapter.narration}
            </p>
          </div>
        )}

        {/* Connected Relics Section (Key requirement) */}
        {connectedRelics.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-[#E8D5A3]">
              <div className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Connected Relics ({connectedRelics.length})</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Click to explore
              </span>
            </div>

            <div className="space-y-1.5">
              {connectedRelics.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => selectRelic(rel.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A] border border-slate-800/80 hover:border-[#38BDF8]/60 hover:bg-[#1E293B] text-left transition-all group cursor-pointer"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs font-medium text-slate-200 truncate group-hover:text-[#38BDF8]">
                      {rel.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {rel.category} · {rel.subtitle}
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#38BDF8] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
