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
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#070B14]/85 border border-[#1E293B]/90 shadow-xl backdrop-blur-md">
        {selectedCategories.length > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-800 text-[11px] font-medium text-rose-300 hover:bg-rose-900/80 transition-colors cursor-pointer"
            aria-label="Clear all category filters"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
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
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#1E293B] text-[#F1F5F9] border border-[#C9A227]/70 shadow-sm shadow-[#C9A227]/20 ring-1 ring-[#C9A227]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
              aria-pressed={isSelected}
              aria-label={`Filter by ${cat.label} (${count} relics)`}
            >
              <Icon
                className="w-3 h-3"
                style={{ color: isSelected ? '#C9A227' : cat.accent }}
              />
              <span>{cat.label}</span>
              <span
                className={`text-[9px] font-mono px-1 rounded-full ${
                  isSelected
                    ? 'bg-[#C9A227] text-[#070B14] font-bold'
                    : 'bg-slate-800 text-slate-400'
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
