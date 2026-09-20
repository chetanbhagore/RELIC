/**
 * RELIC - Normalization & Data Integrity Engine
 * Handles ingestion, validation, searching, and statistical aggregation
 * across the 9 digital life receipt categories.
 */

import type { Relic, RelicCategory } from '../../types/relic';

export interface PersonaStats {
  totalRelics: number;
  totalSpendINR: number;
  totalMusicHours: number;
  uniqueCities: string[];
  topArtists: { name: string; count: number }[];
  categoryDistribution: Record<RelicCategory, number>;
  mostActiveHours: { hour: number; label: string; count: number }[];
  dateSpan: { start: string; end: string };
}

/**
 * Validates relic properties and ensures safe fallbacks
 */
export function sanitizeRelic(raw: Partial<Relic>): Relic {
  const fallbackDate = new Date().toISOString();
  const dateObj = raw.timestamp ? new Date(raw.timestamp) : new Date();

  return {
    id: raw.id || `relic_${Math.random().toString(36).substring(2, 9)}`,
    category: (raw.category as RelicCategory) || 'note',
    title: raw.title || 'Untitled Relic',
    subtitle: raw.subtitle || '',
    timestamp: raw.timestamp || fallbackDate,
    year: raw.year ?? dateObj.getFullYear(),
    month: raw.month ?? dateObj.getMonth() + 1,
    day: raw.day ?? dateObj.getDate(),
    hour: raw.hour ?? dateObj.getHours(),
    dayOfWeek: raw.dayOfWeek ?? dateObj.getDay(),
    location: raw.location || { name: 'Unknown Sanctuary', city: 'Unknown' },
    details: {
      tags: raw.details?.tags || [],
      sentiment: raw.details?.sentiment || 'serene',
      contextSnippet: raw.details?.contextSnippet || '',
      amount: raw.details?.amount,
      currency: raw.details?.currency || 'INR',
      artist: raw.details?.artist,
      album: raw.details?.album,
      durationMs: raw.details?.durationMs,
      merchant: raw.details?.merchant,
      note: raw.details?.note,
      searchQuery: raw.details?.searchQuery,
      messageSender: raw.details?.messageSender,
      messageText: raw.details?.messageText,
    },
    chapterId: raw.chapterId,
    momentId: raw.momentId,
    connectedRelicIds: raw.connectedRelicIds || [],
    spatialCoordinates: raw.spatialCoordinates || [0, 0, 0],
    energy: raw.energy ?? 0.5,
  };
}

/**
 * Filter relics by search term, category filters, and echo flags
 */
export function filterRelics(
  relics: Relic[],
  query: string,
  categories: RelicCategory[],
  chapterId: string | null,
  onlyEchoes: boolean,
  echoRelicIds: Set<string>
): Relic[] {
  const q = query.trim().toLowerCase();

  return relics.filter((relic) => {
    // 1. Chapter constraint
    if (chapterId && relic.chapterId !== chapterId) {
      return false;
    }

    // 2. Category selection
    if (categories.length > 0 && !categories.includes(relic.category)) {
      return false;
    }

    // 3. Echo mode constraint
    if (onlyEchoes && !echoRelicIds.has(relic.id)) {
      return false;
    }

    // 4. Query match across all fields
    if (q) {
      const inTitle = relic.title.toLowerCase().includes(q);
      const inSubtitle = relic.subtitle.toLowerCase().includes(q);
      const inSnippet = (relic.details.contextSnippet || '').toLowerCase().includes(q);
      const inArtist = (relic.details.artist || '').toLowerCase().includes(q);
      const inMerchant = (relic.details.merchant || '').toLowerCase().includes(q);
      const inCity = (relic.location?.city || '').toLowerCase().includes(q);
      const inTags = relic.details.tags.some((t) => t.toLowerCase().includes(q));

      if (!inTitle && !inSubtitle && !inSnippet && !inArtist && !inMerchant && !inCity && !inTags) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Aggregates high-signal personal statistics across the dataset
 */
export function computePersonaStats(relics: Relic[]): PersonaStats {
  let totalSpend = 0;
  let totalMusicMs = 0;
  const citiesSet = new Set<string>();
  const artistCounts: Record<string, number> = {};
  const catDist: Record<RelicCategory, number> = {
    music: 0,
    entertainment: 0,
    place: 0,
    purchase: 0,
    photo: 0,
    message: 0,
    search: 0,
    event: 0,
    note: 0,
  };
  const hourCounts: Record<number, number> = {};

  for (let h = 0; h < 24; h++) hourCounts[h] = 0;

  relics.forEach((r) => {
    // Category distribution
    catDist[r.category] = (catDist[r.category] || 0) + 1;

    // Spending
    if (r.details.amount && r.details.amount > 0) {
      totalSpend += r.details.amount;
    }

    // Music duration
    if (r.category === 'music' && r.details.durationMs) {
      totalMusicMs += r.details.durationMs;
    }

    // Cities
    if (r.location?.city && r.location.city !== 'Unknown') {
      citiesSet.add(r.location.city);
    }

    // Artists
    if (r.details.artist) {
      artistCounts[r.details.artist] = (artistCounts[r.details.artist] || 0) + 1;
    }

    // Hour distribution
    hourCounts[r.hour] = (hourCounts[r.hour] || 0) + 1;
  });

  const sortedArtists = Object.entries(artistCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const activeHours = Object.entries(hourCounts)
    .map(([h, count]) => {
      const hourNum = Number(h);
      const label = hourNum === 0 ? '12 AM' : hourNum < 12 ? `${hourNum} AM` : hourNum === 12 ? '12 PM' : `${hourNum - 12} PM`;
      return { hour: hourNum, label, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const sortedDates = [...relics].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return {
    totalRelics: relics.length,
    totalSpendINR: Math.round(totalSpend),
    totalMusicHours: Math.round((totalMusicMs / (1000 * 60 * 60)) * 10) / 10,
    uniqueCities: Array.from(citiesSet),
    topArtists: sortedArtists,
    categoryDistribution: catDist,
    mostActiveHours: activeHours,
    dateSpan: {
      start: sortedDates[0]?.timestamp || '',
      end: sortedDates[sortedDates.length - 1]?.timestamp || '',
    },
  };
}
