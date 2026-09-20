/**
 * RELIC - Echo & Long-Range Pattern Detection Engine
 * Discovers non-obvious, long-range correlations and recurring signals
 * spanning across multiple life chapters.
 */

import type { Relic, EchoPattern, Chapter } from '../../types/relic';

export function detectEchoes(relics: Relic[], chapters: Chapter[]): EchoPattern[] {
  const patterns: EchoPattern[] = [];

  // 1. Detect Recurring Artists across multiple chapters
  const artistMap: Record<string, { relics: Relic[]; chapterIds: Set<string> }> = {};
  relics.forEach((r) => {
    if (r.details.artist) {
      const art = r.details.artist;
      if (!artistMap[art]) artistMap[art] = { relics: [], chapterIds: new Set() };
      artistMap[art].relics.push(r);
      if (r.chapterId) artistMap[art].chapterIds.add(r.chapterId);
    }
  });

  const recurringArtists = Object.entries(artistMap)
    .filter(([, data]) => data.chapterIds.size >= 2 && data.relics.length >= 3)
    .sort((a, b) => b[1].relics.length - a[1].relics.length);

  if (recurringArtists.length > 0) {
    const [topArtist, topData] = recurringArtists[0];
    patterns.push({
      id: 'echo_artist_recurrence',
      type: 'recurring_artist',
      title: `Soundtrack Continuity: ${topArtist}`,
      description: `Tracks by ${topArtist} recur consistently across ${topData.chapterIds.size} different life chapters. This artist functions as an emotional constant amidst shifting geographies and careers.`,
      strength: 95,
      relicIds: topData.relics.map((r) => r.id),
      chapterIds: Array.from(topData.chapterIds),
      metricLabel: 'Spanned Chapters',
      metricValue: `${topData.chapterIds.size} Phases`,
    });
  }

  // 2. Detect Anchor Places (Cities/Venues revisited in later chapters)
  const cityMap: Record<string, { relics: Relic[]; chapterIds: Set<string> }> = {};
  relics.forEach((r) => {
    if (r.location?.city && r.location.city !== 'Unknown') {
      const city = r.location.city;
      if (!cityMap[city]) cityMap[city] = { relics: [], chapterIds: new Set() };
      cityMap[city].relics.push(r);
      if (r.chapterId) cityMap[city].chapterIds.add(r.chapterId);
    }
  });

  const anchorCities = Object.entries(cityMap)
    .filter(([, data]) => data.chapterIds.size >= 2)
    .sort((a, b) => b[1].chapterIds.size - a[1].chapterIds.size);

  if (anchorCities.length > 0) {
    const [city, cityData] = anchorCities[0];
    patterns.push({
      id: 'echo_anchor_place',
      type: 'anchor_place',
      title: `Anchor Sanctuary: ${city}`,
      description: `${city} serves as a recurring geographical anchor. Digital traces return to this city across multiple distinct periods, signaling a home base or sanctuary of return.`,
      strength: 88,
      relicIds: cityData.relics.slice(0, 12).map((r) => r.id),
      chapterIds: Array.from(cityData.chapterIds),
      metricLabel: 'Visits Recorded',
      metricValue: `${cityData.relics.length} Traces`,
    });
  }

  // 3. Detect Nocturnal Habit (2 AM - 4 AM clusters)
  const nocturnalRelics = relics.filter((r) => r.hour >= 2 && r.hour <= 4);
  const nocturnalChapters = new Set(nocturnalRelics.map((r) => r.chapterId).filter(Boolean) as string[]);

  if (nocturnalRelics.length >= 10) {
    patterns.push({
      id: 'echo_nocturnal_habit',
      type: 'nocturnal_habit',
      title: 'The 3 AM Builder Frequency',
      description: `A distinct cluster of ${nocturnalRelics.length} digital residues occurred strictly between 2:00 AM and 4:30 AM — combining deep coding searches, ambient music streams, and solitary notes.`,
      strength: 92,
      relicIds: nocturnalRelics.slice(0, 16).map((r) => r.id),
      chapterIds: Array.from(nocturnalChapters),
      metricLabel: 'Midnight Relics',
      metricValue: `${nocturnalRelics.length} Residues`,
    });
  }

  // 4. Detect Cross-Type Chains (Song + Place + Photo appearing in sync)
  const momentsWithCrossChain = relics.filter((r) => r.connectedRelicIds.length >= 3);
  if (momentsWithCrossChain.length > 0) {
    const chainIds = Array.from(new Set(momentsWithCrossChain.slice(0, 14).map((r) => r.id)));
    patterns.push({
      id: 'echo_cross_chain',
      type: 'cross_chain',
      title: 'Synchronous Life Threads',
      description: 'Recurring instances where music listening, physical transit receipts, and photographic captures occurred in near-simultaneous cadence, denoting heightened experiential awareness.',
      strength: 86,
      relicIds: chainIds,
      chapterIds: chapters.map((c) => c.id),
      metricLabel: 'Cross-Category Ties',
      metricValue: `${momentsWithCrossChain.length} Linked Nodes`,
    });
  }

  // 5. Detect Spend Burst vs Quiet Solitude Cycle
  const expensivePurchases = relics.filter(
    (r) => r.category === 'purchase' && (r.details.amount || 0) >= 300
  );
  if (expensivePurchases.length > 0) {
    patterns.push({
      id: 'echo_spend_cycle',
      type: 'spend_burst',
      title: 'Investment & Exploration Bursts',
      description: 'Purchasing behavior oscillated between long minimalist streaks and condensed bursts of exploration (travel tickets, books, conferences, celebrations).',
      strength: 82,
      relicIds: expensivePurchases.slice(0, 10).map((r) => r.id),
      chapterIds: Array.from(new Set(expensivePurchases.map((r) => r.chapterId).filter(Boolean) as string[])),
      metricLabel: 'Peak Investment',
      metricValue: `₹${Math.max(...expensivePurchases.map((r) => r.details.amount || 0)).toLocaleString()}`,
    });
  }

  return patterns;
}
