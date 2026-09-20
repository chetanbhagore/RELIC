import { describe, it, expect } from 'vitest';
import { clusterMoments } from '../src/lib/engine/moments';
import type { Relic } from '../src/types/relic';

const mockRelics: Relic[] = [
  {
    id: 'rel_1',
    category: 'music',
    title: 'Say It, Just Say It',
    subtitle: 'Spotify stream',
    timestamp: '2023-05-10T02:15:00Z',
    spatialCoordinates: [0, 1, 0],
    chapterId: 'ch_1',
    energy: 0.8,
    details: {
      artist: "The Mowgli's",
      sentiment: 'euphoric',
      tags: ['indie', 'night'],
    },
    connectedRelicIds: ['rel_2'],
  },
  {
    id: 'rel_2',
    category: 'purchase',
    title: 'Midnight Espresso',
    subtitle: 'Blue Tokai Cafe',
    timestamp: '2023-05-10T02:30:00Z',
    spatialCoordinates: [0.5, 1, 0.2],
    chapterId: 'ch_1',
    energy: 0.7,
    details: {
      amount: 240,
      sentiment: 'focused',
      tags: ['caffeine', 'night'],
    },
    connectedRelicIds: ['rel_1'],
  },
  {
    id: 'rel_3',
    category: 'photo',
    title: 'Sunset over Marine Drive',
    subtitle: 'Camera Roll',
    timestamp: '2023-05-12T18:45:00Z',
    spatialCoordinates: [2, 1, 2],
    chapterId: 'ch_1',
    energy: 0.6,
    details: {
      sentiment: 'serene',
      tags: ['sunset', 'mumbai'],
    },
    connectedRelicIds: [],
  },
];

describe('Moment Formation Engine', () => {
  it('should cluster relics within the 150-minute temporal window into a cohesive Moment', () => {
    const moments = clusterMoments(mockRelics);
    expect(moments.length).toBeGreaterThanOrEqual(1);

    // rel_1 and rel_2 are 15 minutes apart, so they should be fused into the same moment
    const firstMoment = moments.find((m) => m.relicIds.includes('rel_1'));
    expect(firstMoment).toBeDefined();
    expect(firstMoment?.relicIds).toContain('rel_2');
    expect(firstMoment?.chapterId).toBe('ch_1');
  });

  it('should separate relics that occur days apart into distinct moments', () => {
    const moments = clusterMoments(mockRelics);
    const nightMoment = moments.find((m) => m.relicIds.includes('rel_1'));
    const sunsetMoment = moments.find((m) => m.relicIds.includes('rel_3'));

    expect(nightMoment?.id).not.toBe(sunsetMoment?.id);
  });

  it('should compute appropriate spatial center position for fused moments', () => {
    const moments = clusterMoments(mockRelics);
    const moment = moments[0];
    expect(moment.centerPosition).toHaveLength(3);
    expect(typeof moment.centerPosition[0]).toBe('number');
  });
});
