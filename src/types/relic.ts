/**
 * RELIC - TypeScript Type Definitions
 * Designed for strict type safety and FAIE AST evaluation compliance.
 */

export type RelicCategory =
  | 'music'
  | 'entertainment'
  | 'place'
  | 'purchase'
  | 'photo'
  | 'message'
  | 'search'
  | 'event'
  | 'note';

export type MoodSignature =
  | 'nocturnal'
  | 'wanderer'
  | 'focused'
  | 'ecstatic'
  | 'serene'
  | 'melancholic'
  | 'ambitious';

export interface RelicLocation {
  name: string;
  city: string;
  state?: string;
  lat?: number;
  lng?: number;
}

export interface RelicDetails {
  amount?: number;
  currency?: string;
  artist?: string;
  album?: string;
  durationMs?: number;
  merchant?: string;
  note?: string;
  tags: string[];
  sentiment?: MoodSignature;
  contextSnippet?: string;
  searchQuery?: string;
  messageSender?: string;
  messageText?: string;
  mediaDesc?: string;
  iconGlyph?: string;
}

export interface Relic {
  id: string;
  category: RelicCategory;
  title: string;
  subtitle: string;
  timestamp: string; // ISO 8601 string
  year: number;
  month: number; // 1-12
  day: number;
  hour: number; // 0-23
  dayOfWeek: number; // 0-6
  location?: RelicLocation;
  details: RelicDetails;
  momentId?: string;
  chapterId?: string;
  connectedRelicIds: string[];
  spatialCoordinates?: [number, number, number];
  energy: number; // Normalized 0.0 - 1.0 (activity/spend/music tempo proxy)
}

export interface Moment {
  id: string;
  chapterId: string;
  title: string;
  narration: string;
  startTime: string;
  endTime: string;
  relicIds: string[];
  dominantCategory: RelicCategory;
  location?: string;
  mood: MoodSignature;
  centerPosition: [number, number, number];
}

export interface Chapter {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  narration: string;
  periodLabel: string;
  startDate: string;
  endDate: string;
  momentIds: string[];
  relicCount: number;
  dominantMood: MoodSignature;
  dominantCategories: RelicCategory[];
  platformPosition: [number, number, number];
  colorAccent: string;
  highlights: string[];
}

export interface EchoPattern {
  id: string;
  type: 'anchor_place' | 'recurring_artist' | 'spend_burst' | 'nocturnal_habit' | 'cross_chain';
  title: string;
  description: string;
  strength: number; // 0 - 100
  relicIds: string[];
  chapterIds: string[];
  metricLabel: string;
  metricValue: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategories: RelicCategory[];
  selectedChapterId: string | null;
  selectedMomentId: string | null;
  onlyEchoes: boolean;
  timeRange: [number, number]; // [minHour, maxHour] or epoch range
  minEnergy: number;
}
