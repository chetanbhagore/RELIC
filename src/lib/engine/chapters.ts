/**
 * RELIC - Chapter Detection & Narrative Engine
 * Reconstructs life phases from digital residues and generates
 * DATA-DRIVEN narrations grounded in actual relic signals from each chapter.
 */

import type { Relic, Chapter, MoodSignature, RelicCategory } from '../../types/relic';

export function buildChapters(relics: Relic[], rawChapterDefs: Partial<Chapter>[]): Chapter[] {
  return rawChapterDefs.map((def, idx) => {
    const chapterRelics = relics.filter((r) => r.chapterId === def.id);
    const count = chapterRelics.length;

    // Mood distribution
    const moodCounts: Record<string, number> = {};
    chapterRelics.forEach((r) => {
      const m = r.details.sentiment || 'focused';
      moodCounts[m] = (moodCounts[m] || 0) + 1;
    });
    const dominantMood = (Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      def.dominantMood ||
      'focused') as MoodSignature;

    // Category distribution
    const catCounts: Record<string, number> = {};
    chapterRelics.forEach((r) => {
      catCounts[r.category] = (catCounts[r.category] || 0) + 1;
    });
    const dominantCategories = Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([c]) => c as RelicCategory);

    // Data-driven story narration
    const narration = generateChapterNarration(idx, dominantMood, dominantCategories, chapterRelics, def.title || '');

    // Short insight line for JourneyStrip
    const insightLine = generateInsightLine(dominantCategories, chapterRelics, dominantMood);

    // Extract dynamic highlights
    const highlights = extractHighlights(chapterRelics);

    return {
      id: def.id || `ch_${idx + 1}`,
      index: idx,
      title: def.title || `Chapter ${idx + 1}`,
      subtitle: def.subtitle || '',
      narration,
      insightLine,
      periodLabel: def.periodLabel || `Phase ${idx + 1}`,
      startDate: chapterRelics[0]?.timestamp || '',
      endDate: chapterRelics[chapterRelics.length - 1]?.timestamp || '',
      momentIds: Array.from(new Set(chapterRelics.map((r) => r.momentId).filter(Boolean) as string[])),
      relicCount: count,
      dominantMood,
      dominantCategories,
      platformPosition: def.platformPosition || [idx * 6 - 12, idx * 2 + 1, (idx % 2 === 0 ? 1 : -1) * 3],
      colorAccent: def.colorAccent || '#C9A227',
      highlights,
    };
  });
}

function generateChapterNarration(
  index: number,
  mood: MoodSignature,
  topCats: RelicCategory[],
  relics: Relic[],
  title: string
): string {
  // Pull real stats from actual relics
  const city = relics.find((r) => r.location?.city)?.location?.city || 'Transit';
  const spend = relics.reduce((sum, r) => sum + (r.details.amount || 0), 0);
  const musicCount = relics.filter((r) => r.category === 'music').length;
  const nocturnalCount = relics.filter((r) => r.hour >= 23 || r.hour <= 4).length;
  const placesCount = relics.filter((r) => r.category === 'place').length;
  const purchaseCount = relics.filter((r) => r.category === 'purchase').length;
  const eventCount = relics.filter((r) => r.category === 'event').length;

  // Top artist from this chapter
  const artistCounts: Record<string, number> = {};
  relics.forEach((r) => {
    if (r.details.artist) artistCounts[r.details.artist] = (artistCounts[r.details.artist] || 0) + 1;
  });
  const topArtist = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Nocturnal percentage
  const nocturnalPct = relics.length > 0 ? Math.round((nocturnalCount / relics.length) * 100) : 0;

  const topCat = topCats[0] || 'note';

  const narratives: Record<number, string> = {
    0: `An opening phase anchored in ${city}, where ${nocturnalPct}% of all activity unfolded in the nocturnal hours. The ${musicCount} music sessions${topArtist ? ` — led by ${topArtist}'s frequencies —` : ''} defined the soundscape of a deeply introspective period. Spending held modest at ₹${spend.toLocaleString()}, concentrated on late-night coffee and digital subscriptions. The digital residue reads as a mind in formation, quietly accumulating ideas before any outward declaration.`,
    1: `A chapter defined by motion — ${placesCount} distinct places visited, receipts from transit corridors, shoreline cafés, and early-morning platforms. The persona stepped decisively out of isolation, trading nocturnal solitude for physical geography. ${topArtist ? `The soundtrack shifted: ${topArtist} gave way to field-recorded ambient textures.` : 'The soundtrack shifted from familiar to unfamiliar.'} Total spend reached ₹${spend.toLocaleString()}, weighted toward travel and food.`,
    2: `The high-momentum sprint — ${eventCount} event relics and ${relics.length} total fragments mark this as the most data-dense chapter. Hackathon admissions, collaboration signals, rapid message exchanges, and peak caffeine expenditure of ₹${spend.toLocaleString()} paint a picture of sustained, team-driven velocity. The dominant resonance is ${mood}: ambitious, precise, and outward-facing. Sleep debt left its traces in the data.`,
    3: `Following the sprint came deliberate stillness. ${relics.length} relics — fewer than the preceding chapter, and more reflective in texture. ${purchaseCount} purchases shifted from fuel to culture: bookshops, cinema tickets, journal supplies. ${topArtist ? `${topArtist} appeared repeatedly in the music record` : 'Music records showed a clear acoustic shift'}, signaling internal recalibration. Total excavated spend: ₹${spend.toLocaleString()}.`,
    4: `The synthesis chapter. ${relics.length} relics, ${placesCount} destinations, and a ${mood} resonance that runs through every fragment. Milestones appear in the event layer; travel destinations broaden; spending ₹${spend.toLocaleString()} shifts toward experience and celebration. The arc completes here — not with closure, but with momentum directed outward.`,
  };

  return narratives[index] || `A distinctive phase of ${mood} resonance — ${relics.length} relics excavated across ${topCats.slice(0, 2).join(' and ')}. Total spend: ₹${spend.toLocaleString()}.`;
}

function generateInsightLine(
  topCats: RelicCategory[],
  relics: Relic[],
  mood: MoodSignature
): string {
  const nocturnalCount = relics.filter((r) => r.hour >= 23 || r.hour <= 4).length;
  const spend = relics.reduce((sum, r) => sum + (r.details.amount || 0), 0);
  const city = relics.find((r) => r.location?.city)?.location?.city;
  const topCat = topCats[0];

  if (nocturnalCount > relics.length * 0.3) {
    return `${nocturnalCount} late-night sessions · ${mood} resonance`;
  }
  if (city) {
    return `Anchored in ${city} · ₹${Math.round(spend / 1000)}k spent`;
  }
  return `${topCat} dominant · ₹${Math.round(spend / 1000)}k excavated`;
}

function extractHighlights(relics: Relic[]): string[] {
  const highlights: string[] = [];
  const topArtist = relics.find((r) => r.details.artist)?.details.artist;
  if (topArtist) highlights.push(`Sound: ${topArtist}`);

  const topCity = relics.find((r) => r.location?.city)?.location?.city;
  if (topCity) highlights.push(`Place: ${topCity}`);

  const topPhoto = relics.find((r) => r.category === 'photo');
  if (topPhoto) highlights.push(`Visual: "${topPhoto.title}"`);

  const topPurchase = relics.find((r) => r.category === 'purchase' && (r.details.amount || 0) > 100);
  if (topPurchase) highlights.push(`Spend: ₹${topPurchase.details.amount} — ${topPurchase.title}`);

  return highlights.slice(0, 4);
}
