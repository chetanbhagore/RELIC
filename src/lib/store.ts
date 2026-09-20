/**
 * RELIC - Global Application State (Zustand)
 * Single source of truth driving 3D camera animations,
 * spotlight tracking, filters, narrative panel, and audio.
 */

import { create } from 'zustand';
import confetti from 'canvas-confetti';
import type { Relic, Chapter, Moment, EchoPattern, RelicCategory } from '../types/relic';
import { sound } from './sound';
import curatedData from '../data/curated_relics.json';
import { clusterMoments } from './engine/moments';
import { buildChapters } from './engine/chapters';
import { detectEchoes } from './engine/echoes';

interface RelicStore {
  allRelics: Relic[];
  chapters: Chapter[];
  moments: Moment[];
  echoes: EchoPattern[];

  // Selected State
  selectedRelicId: string | null;
  selectedRelicPosition: [number, number, number] | null;
  activeChapterId: string | null;
  selectedMomentId: string | null;

  // Camera Target (for smooth flight interpolation)
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];

  // Filtering & View Modes
  isEchoModeActive: boolean;
  searchQuery: string;
  selectedCategories: RelicCategory[];
  isDetailPanelOpen: boolean;
  isEchoModalOpen: boolean;
  isStatsModalOpen: boolean;
  isAudioMuted: boolean;

  isReceiptLedgerOpen: boolean;
  isExcavateModalOpen: boolean;

  // Actions
  selectRelic: (id: string | null) => void;
  selectChapter: (id: string | null) => void;
  selectMoment: (id: string | null) => void;
  toggleEchoMode: () => void;
  setSearchQuery: (query: string) => void;
  toggleCategory: (cat: RelicCategory) => void;
  clearFilters: () => void;
  setDetailPanelOpen: (open: boolean) => void;
  setEchoModalOpen: (open: boolean) => void;
  setStatsModalOpen: (open: boolean) => void;
  setReceiptLedgerOpen: (open: boolean) => void;
  setExcavateModalOpen: (open: boolean) => void;
  toggleAudioMuted: () => void;
  resetView: () => void;
  addRelic: (data: Partial<Relic> & { title: string; category: RelicCategory }) => void;
}

// Pre-initialize intelligence layer on load
const rawRelics = (curatedData.relics as unknown as Relic[]) || [];
const initialMoments = clusterMoments(rawRelics);
const initialChapters = buildChapters(rawRelics, curatedData.meta.chapters as Partial<Chapter>[]);
const initialEchoes = detectEchoes(rawRelics, initialChapters);

const DEFAULT_CAMERA_POS: [number, number, number] = [0, 6, 16];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 3, 0];

export const useRelicStore = create<RelicStore>((set, get) => ({
  allRelics: rawRelics,
  chapters: initialChapters,
  moments: initialMoments,
  echoes: initialEchoes,

  selectedRelicId: null,
  selectedRelicPosition: null,
  activeChapterId: null,
  selectedMomentId: null,

  cameraTarget: DEFAULT_CAMERA_TARGET,
  cameraPosition: DEFAULT_CAMERA_POS,

  isEchoModeActive: false,
  searchQuery: '',
  selectedCategories: [],
  isDetailPanelOpen: false,
  isEchoModalOpen: false,
  isStatsModalOpen: false,
  isAudioMuted: false,

  isReceiptLedgerOpen: false,
  isExcavateModalOpen: false,

  selectRelic: (id) => {
    if (!id) {
      set({
        selectedRelicId: null,
        selectedRelicPosition: null,
        isDetailPanelOpen: false,
      });
      return;
    }

    const relic = get().allRelics.find((r) => r.id === id);
    if (!relic) return;

    sound.playRelicSelect();

    const targetPos = relic.spatialCoordinates || [0, 0, 0];
    set({
      selectedRelicId: id,
      selectedRelicPosition: targetPos,
      activeChapterId: relic.chapterId || null,
      selectedMomentId: relic.momentId || null,
      isDetailPanelOpen: true,
      cameraTarget: [targetPos[0], targetPos[1], targetPos[2]],
    });
  },

  selectChapter: (id) => {
    if (!id) {
      set({
        activeChapterId: null,
        cameraTarget: DEFAULT_CAMERA_TARGET,
      });
      return;
    }

    const chapter = get().chapters.find((c) => c.id === id);
    if (!chapter) return;

    sound.playChapterShift();

    const [px, py, pz] = chapter.platformPosition;
    set({
      activeChapterId: id,
      selectedRelicId: null,
      selectedRelicPosition: null,
      selectedMomentId: null,
      cameraTarget: [px, py + 1.2, pz],
    });
  },

  selectMoment: (id) => {
    if (!id) {
      set({ selectedMomentId: null });
      return;
    }
    const moment = get().moments.find((m) => m.id === id);
    if (!moment) return;

    sound.playRelicSelect();
    const [cx, cy, cz] = moment.centerPosition;
    set({
      selectedMomentId: id,
      activeChapterId: moment.chapterId,
      cameraTarget: [cx, cy + 0.8, cz],
    });
  },

  toggleEchoMode: () => {
    const nextState = !get().isEchoModeActive;
    if (nextState) {
      sound.playEchoReveal();
    }
    set({ isEchoModeActive: nextState });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });

    // If query matches a relic, fly camera to first result AND open detail panel
    if (query.trim().length >= 3) {
      const q = query.toLowerCase();
      const match = get().allRelics.find(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          (r.details.artist && r.details.artist.toLowerCase().includes(q)) ||
          (r.location?.city && r.location.city.toLowerCase().includes(q))
      );
      if (match && match.spatialCoordinates) {
        // Select the relic — this moves camera + opens detail panel
        get().selectRelic(match.id);
      }
    }
  },

  toggleCategory: (cat) => {
    const current = get().selectedCategories;
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    set({ selectedCategories: next });
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      selectedCategories: [],
      activeChapterId: null,
      selectedMomentId: null,
      selectedRelicId: null,
      selectedRelicPosition: null,
      isEchoModeActive: false,
      cameraTarget: DEFAULT_CAMERA_TARGET,
    });
  },

  setDetailPanelOpen: (open) => set({ isDetailPanelOpen: open }),
  setEchoModalOpen: (open) => set({ isEchoModalOpen: open }),
  setStatsModalOpen: (open) => set({ isStatsModalOpen: open }),

  toggleAudioMuted: () => {
    const next = !get().isAudioMuted;
    sound.setMuted(next);
    set({ isAudioMuted: next });
  },

  setReceiptLedgerOpen: (open) => set({ isReceiptLedgerOpen: open }),
  setExcavateModalOpen: (open) => set({ isExcavateModalOpen: open }),

  addRelic: (data) => {
    const id = `relic_${Date.now()}`;
    const chapterId = data.chapterId || 'ch_5';
    const targetChapter = get().chapters.find((c) => c.id === chapterId) || get().chapters[4];
    const [px, py, pz] = targetChapter.platformPosition;

    const angle = Math.random() * Math.PI * 2;
    const radius = 0.5 + Math.random() * 2.0;
    const coords: [number, number, number] = [
      px + Math.cos(angle) * radius,
      py + 0.45,
      pz + Math.sin(angle) * radius,
    ];

    const newRelic: Relic = {
      id,
      category: data.category,
      title: data.title,
      subtitle: data.subtitle || 'Custom Excavated Artifact',
      timestamp: data.timestamp || new Date().toISOString(),
      spatialCoordinates: coords,
      chapterId: targetChapter.id,
      energy: data.energy ?? 0.85,
      details: {
        amount: data.details?.amount,
        artist: data.details?.artist,
        album: data.details?.album,
        sentiment: data.details?.sentiment || 'focused',
        contextSnippet: data.details?.contextSnippet || 'Artifact personally excavated by user during live vault inspection.',
        tags: data.details?.tags || ['excavated', 'custom', data.category],
      },
      location: data.location || {
        city: 'Personal Vault',
        name: 'Excavation Site Alpha',
        coordinates: [19.076, 72.8777],
      },
      connectedRelicIds: [],
    };

    const updatedRelics = [newRelic, ...get().allRelics];
    const updatedChapters = get().chapters.map((ch) =>
      ch.id === targetChapter.id ? { ...ch, relicCount: ch.relicCount + 1 } : ch
    );

    set({
      allRelics: updatedRelics,
      chapters: updatedChapters,
      isExcavateModalOpen: false,
    });

    sound.playRelicSelect();
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C9A227', '#E8D5A3', '#38BDF8', '#F59E0B'],
      });
    } catch {
      // ignore
    }

    get().selectRelic(id);
  },

  resetView: () => {
    set({
      cameraTarget: DEFAULT_CAMERA_TARGET,
      selectedRelicId: null,
      selectedRelicPosition: null,
      activeChapterId: null,
      selectedMomentId: null,
      isDetailPanelOpen: false,
      isEchoModeActive: false,
      isReceiptLedgerOpen: false,
      isExcavateModalOpen: false,
      searchQuery: '',
      selectedCategories: [],
    });
  },
}));
