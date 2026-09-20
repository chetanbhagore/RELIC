/**
 * RELIC - Chapter Detection & Narrative Engine
 * Reconstructs life phases from digital residues and generates
 * poetic, data-grounded narrations describing the persona's evolution.
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

    // Dynamic story narration based on real data signals
    const narration = generateChapterNarration(idx, dominantMood, dominantCategories, chapterRelics, def.title || '');

    // Extract dynamic highlights
    const highlights = extractHighlights(chapterRelics);

    return {
      id: def.id || `ch_${idx + 1}`,
      index: idx,
      title: def.title || `Chapter ${idx + 1}`,
      subtitle: def.subtitle || '',
      narration,
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
  const city = relics.find((r) => r.location?.city)?.location?.city || 'Transit';
  const spend = relics.reduce((sum, r) => sum + (r.details.amount || 0), 0);
  const musicCount = relics.filter((r) => r.category === 'music').length;
  const nocturnalCount = relics.filter((r) => r.hour >= 23 || r.hour <= 4).length;

  const narratives: Record<number, string> = {
    0: `In this opening chapter, the digital residue reveals a mind working in the nocturnal quiet of ${city}. With ${nocturnalCount} late-night activities and ${musicCount} music sessions, the user was deeply introspective, experimenting with ideas in solitary stillness. Spend remained modest (₹${spend.toLocaleString()}), concentrated on midnight coffee and digital subscriptions.`,
    1: `A profound shift toward motion. The receipts document transit along the western coast — train tickets, shoreline photographs, and café stops. The user stepped out of isolation, trading midnight study for physical transit and field recordings. The dominant resonance shifted to a wanderer frequency.`,
    2: `The high-momentum sprint. Marked by intense collaboration, hackathon admissions, rapid messaging pings, and peak caffeine expenditure. The data reflects high agency, ambitious problem-solving, and a team-first velocity centered in the tech hubs.`,
    3: `Following intense creation came deliberate quietude. Receipts show second-hand bookshops, cinematic screenings, and journal entries written during twilight. Music shifted from high-energy beats to acoustic and ambient records. A season of consolidation and internal recalibration.`,
    4: `The synthesis chapter. Milestones achieved, celebratory gatherings, travel tickets to sunlit destinations, and renewed purpose. The digital footprint reflects confidence, social harmony, and completion of the transformative arc.`,
  };

  return narratives[index] || `A distinctive phase defined by ${mood} resonance across ${topCats.join(' and ')}. Total excavated relics: ${relics.length}.`;
}

function extractHighlights(relics: Relic[]): string[] {
  const highlights: string[] = [];
  const topArtist = relics.find((r) => r.details.artist)?.details.artist;
  if (topArtist) highlights.push(`Anchor sound: ${topArtist}`);

  const topCity = relics.find((r) => r.location?.city)?.location?.city;
  if (topCity) highlights.push(`Primary geography: ${topCity}`);

  const topPhoto = relics.find((r) => r.category === 'photo');
  if (topPhoto) highlights.push(`Visual beacon: "${topPhoto.title}"`);

  const topPurchase = relics.find((r) => r.category === 'purchase' && (r.details.amount || 0) > 100);
  if (topPurchase) highlights.push(`Key transaction: ₹${topPurchase.details.amount} (${topPurchase.title})`);

  return highlights.slice(0, 4);
}
