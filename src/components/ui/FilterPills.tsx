/**
 * RELIC - Category Filter Pills
 * Floating multi-select category filter with real-time relic counts.
 */

import React from 'react';
import {
  Music,
  ShoppingBag,
  MapPin,
  Camera,
  Film,
  MessageSquare,
  Search,
  Calendar,
  FileText,
  X,
} from 'lucide-react';
import { useRelicStore } from '../../lib/store';
import type { RelicCategory } from '../../types/relic';

interface CategoryConfig {
  key: RelicCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const CATEGORIES: CategoryConfig[] = [
  { key: 'music', label: 'Music', icon: Music, accent: '#818CF8' },
  { key: 'purchase', label: 'Purchases', icon: ShoppingBag, accent: '#F59E0B' },
  { key: 'place', label: 'Places', icon: MapPin, accent: '#38BDF8' },
  { key: 'photo', label: 'Photos', icon: Camera, accent: '#4ADE80' },
  { key: 'entertainment', label: 'Cinema', icon: Film, accent: '#F43F5E' },
  { key: 'message', label: 'Messages', icon: MessageSquare, accent: '#FB923C' },
  { key: 'search', label: 'Searches', icon: Search, accent: '#22D3EE' },
  { key: 'event', label: 'Events', icon: Calendar, accent: '#FBBF24' },
  { key: 'note', label: 'Notes', icon: FileText, accent: '#E2E8F0' },
];

export function FilterPills() {
  const allRelics = useRelicStore((s) => s.allRelics);
  const selectedCategories = useRelicStore((s) => s.selectedCategories);
  const toggleCategory = useRelicStore((s) => s.toggleCategory);
  const clearFilters = useRelicStore((s) => s.clearFilters);
  const activeChapterId = useRelicStore((s) => s.activeChapterId);

  // Compute relic count per category
  const counts = React.useMemo(() => {
    const map: Record<string, number> = {};
    allRelics.forEach((r) => {
      if (!activeChapterId || r.chapterId === activeChapterId) {
        map[r.category] = (map[r.category] || 0) + 1;
      }
    });
    return map;
  }, [allRelics, activeChapterId]);

  return (
    <nav
      className="absolute top-16 left-0 right-0 z-10 flex items-center justify-start sm:justify-center gap-1.5 px-4 py-2 overflow-x-auto no-scrollbar pointer-events-auto"
      aria-label="Filter relics by category"
    >
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#070B14]/90 border border-[#1E293B] shadow-2xl backdrop-blur-md">
        {selectedCategories.length > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-rose-900/80 to-amber-900/80 border border-rose-600/80 text-[11px] font-bold text-rose-200 hover:border-rose-400 transition-all cursor-pointer shadow-sm animate-pulse"
            aria-label={`Clear ${selectedCategories.length} active category filters`}
          >
            <X className="w-3 h-3" />
            <span>Clear All ({selectedCategories.length})</span>
          </button>
        )}

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat.key);
          const Icon = cat.icon;
          const count = counts[cat.key] || 0;

          return (
            <button
              key={cat.key}
              onClick={() => toggleCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-gradient-to-r from-[#C9A227]/30 to-[#F59E0B]/30 text-[#F1F5F9] border-2 border-[#C9A227] shadow-[0_0_14px_rgba(201,162,39,0.4)] ring-1 ring-[#E8D5A3] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-transparent font-medium'
              }`}
              aria-pressed={isSelected}
              aria-label={`Filter by ${cat.label} (${count} relics)`}
            >
              <Icon
                className="w-3.5 h-3.5"
                style={{ color: isSelected ? '#F59E0B' : cat.accent }}
              />
              <span>{cat.label}</span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-[#C9A227] text-[#070B14] font-bold shadow-xs'
                    : 'bg-slate-800/90 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
