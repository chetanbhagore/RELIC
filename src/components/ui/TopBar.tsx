/**
 * RELIC - Royal Vault Top Navigation Bar
 * Features brand seal, search input, Echo Mode toggle,
 * stats overview trigger, audio control, and reset view.
 */

import React, { useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Compass,
  BarChart3,
  RotateCcw,
  X,
} from 'lucide-react';
import { useRelicStore } from '../../lib/store';

export function TopBar() {
  const searchQuery = useRelicStore((s) => s.searchQuery);
  const setSearchQuery = useRelicStore((s) => s.setSearchQuery);
  const isEchoModeActive = useRelicStore((s) => s.isEchoModeActive);
  const toggleEchoMode = useRelicStore((s) => s.toggleEchoMode);
  const isAudioMuted = useRelicStore((s) => s.isAudioMuted);
  const toggleAudioMuted = useRelicStore((s) => s.toggleAudioMuted);
  const setEchoModalOpen = useRelicStore((s) => s.setEchoModalOpen);
  const setStatsModalOpen = useRelicStore((s) => s.setStatsModalOpen);
  const resetView = useRelicStore((s) => s.resetView);
  const echoes = useRelicStore((s) => s.echoes);
  const allRelics = useRelicStore((s) => s.allRelics);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className="absolute top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#070B14]/80 backdrop-blur-md border-b border-[#1E293B]/80 text-slate-100"
      role="banner"
    >
      {/* Brand Seal */}
      <div className="flex items-center gap-3">
        <button
          onClick={resetView}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#C9A227]/60 rounded-lg p-1"
          aria-label="RELIC Home - Reset View"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#78350F] text-[#070B14] font-serif font-black text-base shadow-md shadow-[#C9A227]/20 group-hover:scale-105 transition-transform">
            R
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm tracking-wider text-[#E8D5A3]">
                RELIC
              </span>
              <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.2 rounded bg-[#1E293B] text-[#94A3B8] font-mono border border-slate-700">
                VAULT
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8] hidden sm:block">
              Your Life, In Receipts
            </p>
          </div>
        </button>

        <div className="h-5 w-px bg-slate-800 hidden md:block" />

        {/* Quick Stats Pill */}
        <button
          onClick={() => setStatsModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F172A] border border-slate-800 text-[11px] text-[#E8D5A3] hover:border-[#C9A227]/40 hover:bg-[#1E293B] transition-colors cursor-pointer"
          aria-label="View excavated digital life stats"
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>{allRelics.length} Relics Excavated</span>
        </button>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-xs sm:max-w-sm order-3 sm:order-2 w-full sm:w-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search relics, songs, cities, receipts... (Press '/')"
            className="w-full h-8 pl-8 pr-7 text-xs rounded-full bg-[#0F172A]/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all font-sans"
            aria-label="Search relics by keyword, artist, or city"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-slate-400 hover:text-slate-100 p-0.5 cursor-pointer"
              aria-label="Clear search input"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 order-2 sm:order-3">
        {/* Reveal Echoes Button (Key Differentiator) */}
        <button
          onClick={toggleEchoMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-md ${
            isEchoModeActive
              ? 'bg-gradient-to-r from-[#C9A227] to-[#F59E0B] text-[#070B14] shadow-[#C9A227]/30 ring-2 ring-[#E8D5A3]'
              : 'bg-[#0F172A] border border-[#C9A227]/40 text-[#E8D5A3] hover:bg-[#C9A227]/15 hover:border-[#C9A227]'
          }`}
          aria-pressed={isEchoModeActive}
          aria-label="Reveal Echoes: Discover recurring long-range patterns across chapters"
        >
          <Sparkles
            className={`w-3.5 h-3.5 ${
              isEchoModeActive ? 'animate-spin text-[#070B14]' : 'text-[#C9A227]'
            }`}
          />
          <span>Reveal Echoes</span>
          <span
            className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
              isEchoModeActive
                ? 'bg-[#070B14] text-[#E8D5A3]'
                : 'bg-[#1E293B] text-[#94A3B8]'
            }`}
          >
            {echoes.length}
          </span>
        </button>

        {/* Patterns Deep Dive */}
        <button
          onClick={() => setEchoModalOpen(true)}
          className="p-1.5 rounded-full bg-[#0F172A] border border-slate-800 text-slate-300 hover:text-[#C9A227] hover:border-[#C9A227]/40 transition-colors cursor-pointer"
          title="Echo Intelligence Inspector"
          aria-label="Open Echo Intelligence Inspector"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleAudioMuted}
          className="p-1.5 rounded-full bg-[#0F172A] border border-slate-800 text-slate-300 hover:text-[#E8D5A3] hover:border-slate-700 transition-colors cursor-pointer"
          title={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
          aria-label={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isAudioMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#C9A227]" />
          )}
        </button>

        {/* Reset Camera View */}
        <button
          onClick={resetView}
          className="p-1.5 rounded-full bg-[#0F172A] border border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-colors cursor-pointer hidden sm:block"
          title="Reset Camera View"
          aria-label="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
