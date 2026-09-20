/**
 * RELIC - Selected Relic Detail Drawer
 * High-end sliding panel presenting the physical receipt card,
 * Moment fusion reasoning, chapter story, and discoverable connected relics.
 *
 * ENHANCED:
 * - Sibling relics within same Moment (clickable chips)
 * - Energy / sentiment bar
 * - Mobile bottom sheet (slides up on small screens)
 * - Share-to-clipboard button
 * - Smooth slide-in animation
 */

import { useMemo, useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Sparkles,
  Link2,
  Music2,
  Share2,
  ExternalLink,
  Zap,
  Hash,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';
import { useRelicStore } from '../../lib/store';
import type { Relic } from '../../types/relic';

const CATEGORY_ICONS: Record<string, string> = {
  music: '🎵',
  purchase: '🪙',
  place: '📍',
  photo: '🖼️',
  entertainment: '🎬',
  message: '💬',
  search: '🔍',
  event: '⚡',
  note: '📝',
};

const SENTIMENT_COLORS: Record<string, string> = {
  euphoric: '#F59E0B',
  nostalgic: '#A78BFA',
  serene: '#38BDF8',
  focused: '#4ADE80',
  restless: '#FB923C',
  melancholic: '#94A3B8',
};

function EnergyBar({ energy, sentiment }: { energy: number; sentiment?: string }) {
  const color = sentiment ? (SENTIMENT_COLORS[sentiment] || '#C9A227') : '#C9A227';
  const pct = Math.round((energy ?? 0.5) * 100);
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-[10px] font-mono text-slate-500 w-14 shrink-0">ENERGY</span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
      <span className="text-[10px] font-mono shrink-0" style={{ color }}>{pct}%</span>
    </div>
  );
}

export function DetailPanel() {
  const selectedRelicId = useRelicStore((s) => s.selectedRelicId);
  const isDetailPanelOpen = useRelicStore((s) => s.isDetailPanelOpen);
  const setDetailPanelOpen = useRelicStore((s) => s.setDetailPanelOpen);
  const allRelics = useRelicStore((s) => s.allRelics);
  const moments = useRelicStore((s) => s.moments);
  const chapters = useRelicStore((s) => s.chapters);
  const selectRelic = useRelicStore((s) => s.selectRelic);
  const [copied, setCopied] = useState(false);

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

  // Sibling relics in the same Moment (excluding selected)
  const momentSiblings = useMemo(() => {
    if (!currentMoment) return [];
    return currentMoment.relicIds
      .filter((id) => id !== selectedRelicId)
      .map((id) => allRelics.find((r) => r.id === id))
      .filter(Boolean) as Relic[];
  }, [currentMoment, allRelics, selectedRelicId]);

  const handleShare = () => {
    const url = `${window.location.origin}?relic=${selectedRelicId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isDetailPanelOpen || !selectedRelic) {
    return null;
  }

  const formattedDate = new Date(selectedRelic.timestamp).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date(selectedRelic.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const categoryIcon = CATEGORY_ICONS[selectedRelic.category] || '📦';

  return (
    <>
      {/* Desktop: right side panel */}
      <aside
        className="hidden sm:flex fixed top-14 bottom-0 right-0 z-30 w-[420px] bg-[#070B14]/97 border-l border-[#1E293B] shadow-2xl backdrop-blur-xl flex-col text-slate-200"
        style={{ animation: 'slideInRight 0.28s cubic-bezier(0.16,1,0.3,1)' }}
        role="complementary"
        aria-label="Relic Details Panel"
      >
        <PanelContent
          selectedRelic={selectedRelic}
          currentMoment={currentMoment}
          currentChapter={currentChapter}
          connectedRelics={connectedRelics}
          momentSiblings={momentSiblings}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          categoryIcon={categoryIcon}
          copied={copied}
          onClose={() => setDetailPanelOpen(false)}
          onShare={handleShare}
          onSelectRelic={selectRelic}
        />
      </aside>

      {/* Mobile: bottom sheet */}
      <div
        className="sm:hidden fixed inset-x-0 bottom-0 z-40 max-h-[75vh] bg-[#070B14]/98 border-t border-[#1E293B] shadow-2xl backdrop-blur-xl flex flex-col text-slate-200 rounded-t-2xl"
        style={{ animation: 'slideInUp 0.3s cubic-bezier(0.16,1,0.3,1)' }}
        role="complementary"
        aria-label="Relic Details Panel"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-8 h-1 rounded-full bg-slate-700" />
        </div>
        <PanelContent
          selectedRelic={selectedRelic}
          currentMoment={currentMoment}
          currentChapter={currentChapter}
          connectedRelics={connectedRelics}
          momentSiblings={momentSiblings}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          categoryIcon={categoryIcon}
          copied={copied}
          onClose={() => setDetailPanelOpen(false)}
          onShare={handleShare}
          onSelectRelic={selectRelic}
        />
      </div>
    </>
  );
}

interface PanelContentProps {
  selectedRelic: Relic;
  currentMoment: ReturnType<typeof useRelicStore.getState>['moments'][0] | null;
  currentChapter: ReturnType<typeof useRelicStore.getState>['chapters'][0] | null;
  connectedRelics: Relic[];
  momentSiblings: Relic[];
  formattedDate: string;
  formattedTime: string;
  categoryIcon: string;
  copied: boolean;
  onClose: () => void;
  onShare: () => void;
  onSelectRelic: (id: string) => void;
}

function PanelContent({
  selectedRelic,
  currentMoment,
  currentChapter,
  connectedRelics,
  momentSiblings,
  formattedDate,
  formattedTime,
  categoryIcon,
  copied,
  onClose,
  onShare,
  onSelectRelic,
}: PanelContentProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-[#0F172A]/70 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryIcon}</span>
          <span className="text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#E8D5A3]">
            {selectedRelic.category} RELIC
          </span>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            #{selectedRelic.id.slice(-6)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onShare}
            className="p-1.5 rounded-full text-slate-400 hover:text-[#C9A227] hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Copy link to relic"
            title="Copy relic link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close detail panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
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
              <div className="text-right shrink-0">
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
              <span>{formattedDate} · {formattedTime}</span>
            </div>
            {selectedRelic.location?.city && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{selectedRelic.location.name || selectedRelic.location.city}</span>
              </div>
            )}
          </div>

          {/* Energy Bar */}
          <EnergyBar
            energy={selectedRelic.energy ?? 0.5}
            sentiment={selectedRelic.details.sentiment}
          />

          {/* Music specific */}
          {selectedRelic.details.artist && (
            <div className="mt-2.5 p-2 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Music2 className="w-3.5 h-3.5 text-[#818CF8]" />
                <span className="text-slate-300 font-medium">{selectedRelic.details.artist}</span>
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
          {selectedRelic.details.tags.length > 0 && (
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
          )}
        </div>

        {/* Fused Moment Section + Siblings */}
        {currentMoment && (
          <div className="p-3.5 rounded-xl bg-[#0F172A]/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fused Moment: {currentMoment.title}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {currentMoment.narration}
            </p>
            <div className="text-[10px] text-slate-500 font-mono">
              Resonance: {currentMoment.mood} · {currentMoment.relicIds.length} intertwined relics
            </div>

            {/* Moment Siblings */}
            {momentSiblings.length > 0 && (
              <div className="pt-2 border-t border-slate-800">
                <p className="text-[10px] text-slate-500 font-mono mb-1.5">OTHERS IN THIS MOMENT</p>
                <div className="flex flex-wrap gap-1.5">
                  {momentSiblings.map((sib) => (
                    <button
                      key={sib.id}
                      onClick={() => onSelectRelic(sib.id)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0B1120] border border-slate-700 hover:border-[#38BDF8]/60 hover:bg-[#1E293B] text-[10px] text-slate-300 hover:text-[#38BDF8] transition-all cursor-pointer"
                      title={sib.title}
                    >
                      <span>{CATEGORY_ICONS[sib.category] || '📦'}</span>
                      <span className="truncate max-w-[80px]">{sib.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chapter Story Context */}
        {currentChapter && (
          <div className="p-3.5 rounded-xl bg-[#0F172A]/80 border border-[#C9A227]/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E8D5A3]">
              <BookOpen className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>{currentChapter.title}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {currentChapter.narration}
            </p>
            {currentChapter.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentChapter.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#E8D5A3] font-mono"
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Connected Relics Section */}
        {connectedRelics.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-[#E8D5A3]">
              <div className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Connected Relics ({connectedRelics.length})</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Click to explore</span>
            </div>

            <div className="space-y-1.5">
              {connectedRelics.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectRelic(rel.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A] border border-slate-800/80 hover:border-[#38BDF8]/60 hover:bg-[#1E293B] text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                    <span className="text-sm shrink-0">{CATEGORY_ICONS[rel.category] || '📦'}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate group-hover:text-[#38BDF8]">
                        {rel.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {rel.category} · {rel.subtitle}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#38BDF8] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom spacer for mobile */}
        <div className="h-4" />
      </div>
    </>
  );
}
