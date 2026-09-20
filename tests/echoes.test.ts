import { describe, it, expect } from 'vitest';
import { detectEchoes } from '../src/lib/engine/echoes';
import type { Relic, Chapter } from '../src/types/relic';

const mockRelics: Relic[] = [
  {
    id: 'rel_1',
    category: 'music',
    title: 'Song 1',
    subtitle: 'Spotify',
    timestamp: '2023-01-01T00:00:00Z',
    chapterId: 'ch_1',
    details: { artist: 'Arctic Monkeys', tags: [] },
    connectedRelicIds: [],
  },
  {
    id: 'rel_2',
    category: 'music',
    title: 'Song 2',
    subtitle: 'Spotify',
    timestamp: '2023-02-01T00:00:00Z',
    chapterId: 'ch_1',
    details: { artist: 'Arctic Monkeys', tags: [] },
    connectedRelicIds: [],
  },
  {
    id: 'rel_3',
    category: 'music',
    title: 'Song 3',
    subtitle: 'Spotify',
    timestamp: '2023-08-01T00:00:00Z',
    chapterId: 'ch_2',
    details: { artist: 'Arctic Monkeys', tags: [] },
    connectedRelicIds: [],
  },
  {
    id: 'rel_4',
    category: 'place',
    title: 'Cafe Mumbai',
    subtitle: 'Place',
    timestamp: '2023-01-15T00:00:00Z',
    chapterId: 'ch_1',
    location: { city: 'Mumbai', name: 'Bandra' },
    details: { tags: [] },
    connectedRelicIds: [],
  },
  {
    id: 'rel_5',
    category: 'place',
    title: 'Marine Drive',
    subtitle: 'Place',
    timestamp: '2023-09-15T00:00:00Z',
    chapterId: 'ch_2',
    location: { city: 'Mumbai', name: 'Marine Drive' },
    details: { tags: [] },
    connectedRelicIds: [],
  },
];

const mockChapters: Chapter[] = [
  {
    id: 'ch_1',
    index: 0,
    title: 'Chapter I',
    dateRange: 'Jan 2023',
    narration: '',
    dominantMood: 'focused',
    dominantCategories: ['music', 'place'],
    relicCount: 3,
    highlights: [],
    platformPosition: [0, 0, 0],
  },
  {
    id: 'ch_2',
    index: 1,
    title: 'Chapter II',
    dateRange: 'Aug 2023',
    narration: '',
    dominantMood: 'serene',
    dominantCategories: ['music', 'place'],
    relicCount: 2,
    highlights: [],
    platformPosition: [10, 0, 0],
  },
];

describe('Echo & Long-Range Pattern Engine', () => {
  it('should detect recurring artists spanning across multiple chapters', () => {
    const echoes = detectEchoes(mockRelics, mockChapters);
    expect(echoes.length).toBeGreaterThan(0);

    const artistEcho = echoes.find((e) => e.type === 'recurring_artist');
    expect(artistEcho).toBeDefined();
    expect(artistEcho?.title).toContain('Arctic Monkeys');
    expect(artistEcho?.chapterIds).toContain('ch_1');
    expect(artistEcho?.chapterIds).toContain('ch_2');
  });

  it('should detect anchor cities revisited across life chapters', () => {
    const echoes = detectEchoes(mockRelics, mockChapters);
    const anchorCityEcho = echoes.find((e) => e.type === 'anchor_place');
    expect(anchorCityEcho).toBeDefined();
    expect(anchorCityEcho?.title).toContain('Mumbai');
  });
});
