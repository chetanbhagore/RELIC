/**
 * RELIC - Persona Excavation Analytics Modal
 * Comprehensive breakdown of digital life residues, spending, music,
 * temporal density, and geographic footprints.
 */

import { useMemo } from 'react';
import {
  X,
  BarChart3,
  Clock,
  MapPin,
  Music,
  Wallet,
  Calendar,
  Layers,
} from 'lucide-react';
import { useRelicStore } from '../../lib/store';
import { computePersonaStats } from '../../lib/engine/normalize';

export function StatsModal() {
  const isStatsModalOpen = useRelicStore((s) => s.isStatsModalOpen);
  const setStatsModalOpen = useRelicStore((s) => s.setStatsModalOpen);
  const allRelics = useRelicStore((s) => s.allRelics);

  const stats = useMemo(() => computePersonaStats(allRelics), [allRelics]);

  if (!isStatsModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B14]/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#0F172A] border border-[#C9A227]/40 shadow-2xl text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070B14]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#C9A227]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="stats-modal-title"
                className="font-serif text-lg font-bold text-[#E8D5A3]"
              >
                Excavation Analytics & Persona Synthesis
              </h2>
              <p className="text-xs text-slate-400">
                Quantitative profile synthesized from 410 raw digital residues
              </p>
            </div>
          </div>

          <button
            onClick={() => setStatsModalOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Analytics Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Total Relics</span>
              </div>
              <p className="mt-1 text-xl font-bold font-mono text-[#F1F5F9]">
                {stats.totalRelics}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Wallet className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Tracked Spend</span>
              </div>
              <p className="mt-1 text-xl font-bold font-mono text-[#F59E0B]">
                ₹{stats.totalSpendINR.toLocaleString()}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Music className="w-3.5 h-3.5 text-[#818CF8]" />
                <span>Music Hours</span>
              </div>
              <p className="mt-1 text-xl font-bold font-mono text-[#818CF8]">
                {stats.totalMusicHours}h
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Unique Cities</span>
              </div>
              <p className="mt-1 text-xl font-bold font-mono text-[#4ADE80]">
                {stats.uniqueCities.length}
              </p>
            </div>
          </div>

          {/* Persona Behavioral Synthesis */}
          <div className="p-4 rounded-xl bg-[#070B14]/80 border border-[#C9A227]/30 space-y-1.5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#E8D5A3]">
              Persona Profile: The Nocturnal Architect
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The excavated records characterize an individual driven by intense creative cycles. High concentration of late-night digital residues (2 AM – 4 AM) paired with ambient audio listening indicates periods of deep focus and solitary technical creation, followed by distinct phases of coastal transit, book hunting, and celebratory milestone events.
            </p>
          </div>

          {/* Category Distribution Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300">
              Category Residue Breakdown
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {Object.entries(stats.categoryDistribution).map(([cat, count]) => (
                <div
                  key={cat}
                  className="p-2.5 rounded-lg bg-[#070B14] border border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="capitalize text-slate-400">{cat}</span>
                  <span className="font-mono font-bold text-slate-200">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Artists & Active Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#818CF8]">
                <Music className="w-3.5 h-3.5" />
                <span>Top Soundtrack Artists</span>
              </div>
              <div className="space-y-1">
                {stats.topArtists.map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center justify-between text-xs text-slate-300 py-0.5 border-b border-slate-800/60 last:border-none"
                  >
                    <span className="truncate pr-2">{a.name}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {a.count} plays
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B]">
                <Clock className="w-3.5 h-3.5" />
                <span>Peak Activity Windows</span>
              </div>
              <div className="space-y-1">
                {stats.mostActiveHours.map((h) => (
                  <div
                    key={h.hour}
                    className="flex items-center justify-between text-xs text-slate-300 py-0.5 border-b border-slate-800/60 last:border-none"
                  >
                    <span>{h.label}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {h.count} residues
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
