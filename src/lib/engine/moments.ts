/**
 * RELIC - Moment Formation Engine
 * Performs unsupervised client-side temporal and semantic clustering.
 * Fuses disparate digital residues (song + receipt + photo + message)
 * that occurred in close temporal/spatial proximity into a cohesive "Moment".
 */

import type { Relic, Moment, RelicCategory, MoodSignature } from '../../types/relic';

/**
 * Clustering window: 150 minutes (2.5 hours)
 */
const TEMPORAL_WINDOW_MS = 150 * 60 * 1000;

/**
 * Evocative poetic templates for moments based on dominant category and hour
 */
function generateMomentTitle(dominantCat: RelicCategory, hour: number, city?: string): string {
  const isNight = hour >= 22 || hour <= 4;
  const isDawn = hour >= 5 && hour <= 7;
  const isEvening = hour >= 17 && hour <= 21;

  if (isNight) {
    switch (dominantCat) {
      case 'music': return 'The 2 AM Echo Session';
      case 'search': return 'Midnight Rabbit Hole';
      case 'note': return 'Solitary 3 AM Clarity';
      case 'purchase': return 'Late Night Bodega Run';
      case 'photo': return 'Shadows Under Streetlights';
      default: return 'Nocturnal Reverie';
    }
  }

  if (isDawn) {
    return `First Light in ${city || 'the City'}`;
  }

  if (isEvening) {
    switch (dominantCat) {
      case 'place': return `Sunset Transit at ${city || 'the Coast'}`;
      case 'entertainment': return 'Twilight Screen Ritual';
      case 'music': return 'Golden Hour Harmonics';
      case 'message': return 'Evening Ping Exchange';
      default: return 'Dusk Drift';
    }
  }

  // Daytime
  switch (dominantCat) {
    case 'event': return 'High-Frequency Build Sprint';
    case 'purchase': return 'Midday Coffee & Books';
    case 'place': return `Urban Exploration in ${city || 'Transit'}`;
    case 'photo': return 'Framed Street Vignettes';
    default: return 'Midday Orbit';
  }
}

function generateMomentNarration(relics: Relic[], dominantCat: RelicCategory, mood: MoodSignature): string {
  const types = Array.from(new Set(relics.map(r => r.category)));
  const count = relics.length;
  const city = relics.find(r => r.location?.city)?.location?.city || 'the city';

  return `Within a span of ${Math.max(1, Math.round(count * 0.8))} hours in ${city}, ${count} distinct digital traces converged across ${types.join(', ')}. The prevailing resonance was ${mood}, anchored by ${dominantCat} residues.`;
}

/**
 * Cluster relics into Moments
 */
export function clusterMoments(relics: Relic[]): Moment[] {
  if (relics.length === 0) return [];

  // Sort chronologically
  const sorted = [...relics].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const moments: Moment[] = [];
  let currentGroup: Relic[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const relic = sorted[i];

    if (currentGroup.length === 0) {
      currentGroup.push(relic);
      continue;
    }

    const firstTime = new Date(currentGroup[0].timestamp).getTime();
    const thisTime = new Date(relic.timestamp).getTime();
    const sameChapter = currentGroup[0].chapterId === relic.chapterId;

    // Check if within window and max 6 relics per moment for clean 3D density
    if (sameChapter && (thisTime - firstTime) <= TEMPORAL_WINDOW_MS && currentGroup.length < 5) {
      currentGroup.push(relic);
    } else {
      // Finalize previous moment
      moments.push(createMomentFromGroup(currentGroup, moments.length));
      currentGroup = [relic];
    }
  }

  if (currentGroup.length > 0) {
    moments.push(createMomentFromGroup(currentGroup, moments.length));
  }

  // Assign momentId back to relics
  moments.forEach(m => {
    m.relicIds.forEach(id => {
      const found = relics.find(r => r.id === id);
      if (found) found.momentId = m.id;
    });
  });

  return moments;
}

function createMomentFromGroup(group: Relic[], index: number): Moment {
  const relicIds = group.map(r => r.id);
  const startTime = group[0].timestamp;
  const endTime = group[group.length - 1].timestamp;
  const chapterId = group[0].chapterId || 'ch_1';

  // Category counts
  const catCount: Record<string, number> = {};
  group.forEach(r => {
    catCount[r.category] = (catCount[r.category] || 0) + 1;
  });
  const dominantCategory = (Object.entries(catCount).sort((a, b) => b[1] - a[1])[0][0]) as RelicCategory;

  // Mood
  const mood = (group[0].details.sentiment || 'focused') as MoodSignature;
  const city = group.find(r => r.location?.city)?.location?.city;
  const title = generateMomentTitle(dominantCategory, group[0].hour, city);
  const narration = generateMomentNarration(group, dominantCategory, mood);

  // Center 3D position
  let cx = 0, cy = 0, cz = 0;
  group.forEach(r => {
    const coords = r.spatialCoordinates || [0, 0, 0];
    cx += coords[0];
    cy += coords[1];
    cz += coords[2];
  });
  cx /= group.length;
  cy /= group.length;
  cz /= group.length;

  return {
    id: `moment_${String(index + 1).padStart(3, '0')}`,
    chapterId,
    title,
    narration,
    startTime,
    endTime,
    relicIds,
    dominantCategory,
    location: city,
    mood,
    centerPosition: [Number(cx.toFixed(2)), Number(cy.toFixed(2)), Number(cz.toFixed(2))]
  };
}
