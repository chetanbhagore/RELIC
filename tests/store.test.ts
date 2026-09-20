import { describe, it, expect, beforeEach } from 'vitest';
import { useRelicStore } from '../src/lib/store';

describe('RelicStore (Zustand Global State)', () => {
  beforeEach(() => {
    useRelicStore.getState().resetView();
  });

  it('should initialize with loaded relics, chapters, and moments', () => {
    const state = useRelicStore.getState();
    expect(state.allRelics.length).toBeGreaterThan(0);
    expect(state.chapters.length).toBe(5);
    expect(state.moments.length).toBeGreaterThan(0);
  });

  it('should update selectedRelicId and open detail panel on selectRelic', () => {
    const firstRelic = useRelicStore.getState().allRelics[0];
    useRelicStore.getState().selectRelic(firstRelic.id);

    const state = useRelicStore.getState();
    expect(state.selectedRelicId).toBe(firstRelic.id);
    expect(state.isDetailPanelOpen).toBe(true);
    expect(state.activeChapterId).toBe(firstRelic.chapterId);
  });

  it('should toggle categories accurately', () => {
    useRelicStore.getState().toggleCategory('music');
    expect(useRelicStore.getState().selectedCategories).toContain('music');

    useRelicStore.getState().toggleCategory('music');
    expect(useRelicStore.getState().selectedCategories).not.toContain('music');
  });

  it('should reset all views and clear selections on resetView()', () => {
    const firstRelic = useRelicStore.getState().allRelics[0];
    useRelicStore.getState().selectRelic(firstRelic.id);
    useRelicStore.getState().toggleCategory('purchase');
    useRelicStore.getState().setSearchQuery('espresso');

    useRelicStore.getState().resetView();

    const state = useRelicStore.getState();
    expect(state.selectedRelicId).toBeNull();
    expect(state.activeChapterId).toBeNull();
    expect(state.isDetailPanelOpen).toBe(false);
    expect(state.selectedCategories).toHaveLength(0);
    expect(state.searchQuery).toBe('');
  });
});
