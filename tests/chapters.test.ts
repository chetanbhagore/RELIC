import { describe, it, expect } from 'vitest';
import { buildChapters } from '../src/lib/engine/chapters';
import type { Relic, Chapter } from '../src/types/relic';

const mockRelics: Relic[] = [
  {
    id: 'rel_1',
    category: 'music',
    title: 'Track A',
    subtitle: 'Spotify',
    timestamp: '2023-01-01T00:00:00Z',
    chapterId: 'ch_1',
    energy: 0.9,
    details: { sentiment: 'euphoric', tags: [] },
    connectedRelicIds: [],
  },
  {
    id: 'rel_2',
    category: 'purchase',
    title: 'Purchase A',
    subtitle: 'Store',
    timestamp: '2023-01-02T00:00:00Z',
    chapterId: 'ch_1',
    energy: 0.5,
    details: { amount: 500, sentiment: 'euphoric', tags: [] },
    connectedRelicIds: [],
  },
  {
    id: 'rel_3',
    category: 'place',
    title: 'City B',
    subtitle: 'Location',
    timestamp: '2023-06-01T00:00:00Z',
    chapterId: 'ch_2',
    energy: 0.6,
    details: { sentiment: 'focused', tags: [] },
    connectedRelicIds: [],
  },
];

const mockDefs: Partial<Chapter>[] = [
  { id: 'ch_1', title: 'Chapter I: The Genesis', dateRange: 'Jan 2023' },
  { id: 'ch_2', title: 'Chapter II: The Shift', dateRange: 'Jun 2023' },
];

describe('Chapter Detection & Narrative Engine', () => {
  it('should build chapters with correct relic counts and dominant moods', () => {
    const chapters = buildChapters(mockRelics, mockDefs);
    expect(chapters).toHaveLength(2);

    const ch1 = chapters.find((c) => c.id === 'ch_1');
    expect(ch1).toBeDefined();
    expect(ch1?.relicCount).toBe(2);
    expect(ch1?.dominantMood).toBe('euphoric');

    const ch2 = chapters.find((c) => c.id === 'ch_2');
    expect(ch2?.relicCount).toBe(1);
    expect(ch2?.dominantMood).toBe('focused');
  });

  it('should synthesize intelligent data-driven insight line for each chapter', () => {
    const chapters = buildChapters(mockRelics, mockDefs);
    chapters.forEach((ch) => {
      expect(ch.insightLine).toBeDefined();
      expect(typeof ch.insightLine).toBe('string');
      expect(ch.insightLine!.length).toBeGreaterThan(5);
    });
  });
});
