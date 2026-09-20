/**
 * RELIC - Echo Legend Overlay
 * Shows when Echo Mode is active — explains what each thread type means.
 * Positioned as a small non-intrusive overlay in the bottom-left corner.
 */

import { useRelicStore } from '../../lib/store';

export function EchoLegend() {
  const isEchoModeActive = useRelicStore((s) => s.isEchoModeActive);

  if (!isEchoModeActive) return null;

  return (
    <div
      className="absolute bottom-20 left-4 z-20 p-3 rounded-xl bg-[#070B14]/90 border border-[#1E293B] backdrop-blur-md shadow-xl"
      style={{ animation: 'fadeIn 0.4s ease' }}
      role="note"
      aria-label="Echo thread legend"
    >
      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
        Connection Key
      </p>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          {/* Cyan solid line */}
          <div className="flex items-center gap-0.5 w-10 shrink-0">
            <div className="h-0.5 w-full rounded-full bg-[#38BDF8]" style={{ boxShadow: '0 0 4px #38BDF8' }} />
          </div>
          <span className="text-[10px] text-slate-300">Direct connection (same Moment)</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Gold dashed line */}
          <div className="flex items-center gap-0.5 w-10 shrink-0">
            <div
              className="h-0.5 w-2.5 rounded-full bg-[#F59E0B]"
              style={{ boxShadow: '0 0 4px #F59E0B' }}
            />
            <div className="h-0.5 w-1 rounded-full" />
            <div
              className="h-0.5 w-2.5 rounded-full bg-[#F59E0B]"
              style={{ boxShadow: '0 0 4px #F59E0B' }}
            />
            <div className="h-0.5 w-1 rounded-full" />
            <div
              className="h-0.5 w-1.5 rounded-full bg-[#F59E0B]"
              style={{ boxShadow: '0 0 4px #F59E0B' }}
            />
          </div>
          <span className="text-[10px] text-slate-300">Echo thread (recurring pattern)</span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800">
        <p className="text-[9px] text-slate-500 font-mono">
          Echoes = long-range patterns detected across chapters via temporal proximity, recurring artist, or place resonance.
        </p>
      </div>
    </div>
  );
}
