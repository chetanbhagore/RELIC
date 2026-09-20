/**
 * RELIC - Data Preprocessing & Fusion Pipeline
 * Integrates:
 * 1. Spotify Listening History (archive 3)
 * 2. Multi-Facet Indian Transactions & Places (archive 2)
 * 3. Daily Household Expenses (archive 1)
 * 4. Synthesizes complementary digital-life artifacts across all 9 challenge categories.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to parse CSV lines safely
function parseCSV(filePath, maxRows = 20000) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  if (lines.length === 0) return [];
  
  const header = lines[0].replace(/\r/g, '').split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows = [];
  
  for (let i = 1; i < Math.min(lines.length, maxRows); i++) {
    const line = lines[i].replace(/\r/g, '').trim();
    if (!line) continue;
    
    // Simple regex CSV parser handling quotes
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const obj = {};
    header.forEach((key, idx) => {
      obj[key] = values[idx] !== undefined ? values[idx].replace(/^["']|["']$/g, '') : '';
    });
    rows.push(obj);
  }
  return rows;
}

console.log('Loading dataset files...');
const householdRows = parseCSV(path.join(rootDir, 'raw_data/archive1/Daily Household Transactions.csv'), 3000);
const indiaTransactRows = parseCSV(path.join(rootDir, 'raw_data/archive2/Augmented_IndiaTransactMultiFacet2024.csv'), 5000);
const spotifyRows = parseCSV(path.join(rootDir, 'raw_data/archive3/spotify_history.csv'), 20000);

console.log(`Parsed: Household=${householdRows.length}, IndiaTransact=${indiaTransactRows.length}, Spotify=${spotifyRows.length}`);

// Cohesive 5 Chapter Archetypes for the Persona's Digital Odyssey
const CHAPTER_DEFINITIONS = [
  {
    id: 'ch_1',
    index: 0,
    title: 'Chapter I: The Midnight Frequency',
    subtitle: 'Late nights, ambient playlists, nocturnal code sprints & midnight chai',
    periodLabel: 'Fall 2023 · The Awakening',
    baseYear: 2023,
    startMonth: 9,
    endMonth: 10,
    dominantMood: 'nocturnal',
    dominantCategories: ['music', 'note', 'search', 'purchase'],
    city: 'Pune',
    platformPos: [-12, 1, -6],
    colorAccent: '#38BDF8'
  },
  {
    id: 'ch_2',
    index: 1,
    title: 'Chapter II: Coastal Transit & Coffee',
    subtitle: 'Metro commutes, Marine Drive strolls, indie discoveries & weekend escapes',
    periodLabel: 'Winter 2023 · Motion & Rhythm',
    baseYear: 2023,
    startMonth: 11,
    endMonth: 12,
    dominantMood: 'wanderer',
    dominantCategories: ['place', 'photo', 'music', 'purchase'],
    city: 'Mumbai',
    platformPos: [-6, 3, 2],
    colorAccent: '#C9A227'
  },
  {
    id: 'ch_3',
    index: 2,
    title: 'Chapter III: The Build Sprint',
    subtitle: 'Hackathons, intense caffeine, fast food pings, breakthroughs & team chatter',
    periodLabel: 'Spring 2024 · Peak Momentum',
    baseYear: 2024,
    startMonth: 1,
    endMonth: 3,
    dominantMood: 'focused',
    dominantCategories: ['event', 'message', 'search', 'music'],
    city: 'Bengaluru',
    platformPos: [0, 5, -5],
    colorAccent: '#E8D5A3'
  },
  {
    id: 'ch_4',
    index: 3,
    title: 'Chapter IV: Quiet Constellations',
    subtitle: 'Acoustic records, bookshop detours, reflective journals & cinema evenings',
    periodLabel: 'Summer 2024 · Stillness & Solitude',
    baseYear: 2024,
    startMonth: 4,
    endMonth: 6,
    dominantMood: 'serene',
    dominantCategories: ['entertainment', 'note', 'music', 'place'],
    city: 'Delhi',
    platformPos: [6, 7, 3],
    colorAccent: '#818CF8'
  },
  {
    id: 'ch_5',
    index: 4,
    title: 'Chapter V: Golden Horizons',
    subtitle: 'Celebrations, travel tickets, festival nights, renewed purpose & milestones',
    periodLabel: 'Late 2024 · Synthesis',
    baseYear: 2024,
    startMonth: 7,
    endMonth: 9,
    dominantMood: 'ecstatic',
    dominantCategories: ['event', 'photo', 'purchase', 'place'],
    city: 'Goa / Jaipur',
    platformPos: [12, 9, -4],
    colorAccent: '#F59E0B'
  }
];

const relics = [];
let globalIdCounter = 1;

function makeId(prefix = 'relic') {
  return `${prefix}_${String(globalIdCounter++).padStart(4, '0')}`;
}

// 1. Convert real Spotify records into Music relics
const filteredSpotify = spotifyRows
  .filter(r => r.track_name && r.artist_name && Number(r.ms_played || 0) > 45000)
  .slice(0, 140);

filteredSpotify.forEach((sp, idx) => {
  const chapter = CHAPTER_DEFINITIONS[idx % CHAPTER_DEFINITIONS.length];
  const hour = (idx * 3 + 1) % 24; // spread across night and day
  const day = 1 + (idx % 28);
  const month = chapter.startMonth;
  const year = chapter.baseYear;
  const isoTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String((idx * 7) % 60).padStart(2, '0')}:00.000Z`;
  
  relics.push({
    id: makeId('rel_music'),
    category: 'music',
    title: sp.track_name.slice(0, 48),
    subtitle: sp.artist_name.slice(0, 40),
    timestamp: isoTime,
    year,
    month,
    day,
    hour,
    dayOfWeek: (day + idx) % 7,
    location: {
      name: `${chapter.city} Sound Space`,
      city: chapter.city
    },
    details: {
      artist: sp.artist_name,
      album: sp.album_name || 'Single',
      durationMs: Number(sp.ms_played) || 180000,
      tags: ['streaming', 'audio', sp.artist_name.toLowerCase(), hour < 5 ? 'midnight-listen' : 'daytime-flow'],
      sentiment: hour < 5 ? 'nocturnal' : 'focused',
      contextSnippet: `Streamed via web player (${Math.round((Number(sp.ms_played) || 180000)/60000)} min). Repeat listen during chapter study.`
    },
    chapterId: chapter.id,
    connectedRelicIds: [],
    energy: Math.min(1.0, 0.4 + (Number(sp.ms_played) || 180000) / 300000 * 0.5)
  });
});

// 2. Convert real Household & India Transactions into Purchases & Places
const filteredHousehold = householdRows
  .filter(r => r.Category && r.Amount && Number(r.Amount) > 0)
  .slice(0, 90);

filteredHousehold.forEach((hh, idx) => {
  const chapter = CHAPTER_DEFINITIONS[(idx + 1) % CHAPTER_DEFINITIONS.length];
  const hour = 8 + (idx % 14);
  const day = 1 + ((idx * 2) % 27);
  const month = chapter.startMonth;
  const year = chapter.baseYear;
  const isoTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:15:00.000Z`;

  const isTransport = (hh.Category || '').toLowerCase().includes('transport');
  const isSub = (hh.Category || '').toLowerCase().includes('subscrip');
  
  relics.push({
    id: makeId('rel_purch'),
    category: 'purchase',
    title: hh.Subcategory || hh.Category || 'Daily Receipt',
    subtitle: `₹${hh.Amount} · ${hh.Mode || 'Digital Pay'}`,
    timestamp: isoTime,
    year,
    month,
    day,
    hour,
    dayOfWeek: (day + idx) % 7,
    location: {
      name: `${chapter.city} Hub`,
      city: chapter.city
    },
    details: {
      amount: Number(hh.Amount),
      currency: 'INR',
      note: hh.Note || `${hh.Category} payment`,
      merchant: hh.Subcategory || 'Merchant POS',
      tags: ['expense', (hh.Category || 'daily').toLowerCase(), isSub ? 'subscription' : 'retail'],
      sentiment: isTransport ? 'wanderer' : 'focused',
      contextSnippet: `Physical receipt recorded in ${chapter.city}. Note: "${hh.Note || hh.Category}".`
    },
    chapterId: chapter.id,
    connectedRelicIds: [],
    energy: Math.min(1.0, 0.3 + (Number(hh.Amount) / 500) * 0.4)
  });
});

// 3. Convert India Transactions into Places & Dining
const filteredIndia = indiaTransactRows
  .filter(r => r.city && r.amt && Number(r.amt) > 0)
  .slice(0, 80);

filteredIndia.forEach((it, idx) => {
  const chapter = CHAPTER_DEFINITIONS[(idx + 2) % CHAPTER_DEFINITIONS.length];
  const hour = 11 + (idx % 12);
  const day = 1 + ((idx * 3) % 27);
  const month = chapter.endMonth;
  const year = chapter.baseYear;
  const isoTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:40:00.000Z`;
  
  const merchantName = (it.merchant || 'Local Venue').replace(/^fraud_/, '');

  relics.push({
    id: makeId('rel_place'),
    category: 'place',
    title: merchantName.slice(0, 36),
    subtitle: `${it.city || chapter.city} · ${it.category || 'Spot'}`,
    timestamp: isoTime,
    year,
    month,
    day,
    hour,
    dayOfWeek: (day + idx) % 7,
    location: {
      name: merchantName,
      city: it.city || chapter.city,
      state: it.state || '',
      lat: Number(it.merch_lat || it.lat || 0),
      lng: Number(it.merch_long || it.long || 0)
    },
    details: {
      amount: Math.round(Number(it.amt)),
      currency: 'INR',
      merchant: merchantName,
      tags: ['check-in', 'location', (it.category || 'destination').toLowerCase()],
      sentiment: 'wanderer',
      contextSnippet: `Visited ${merchantName} in ${it.city || chapter.city}. Logged activity during regional travel.`
    },
    chapterId: chapter.id,
    connectedRelicIds: [],
    energy: 0.65
  });
});

// 4. Synthesize Rich Complementary Categories to fully cover all 9 required areas
const COMPLEMENTARY_SEEDS = [
  // PHOTOS
  {
    category: 'photo',
    title: 'Golden Hour at Bandra Bandstand',
    subtitle: 'Fujifilm simulation · 35mm frame',
    tags: ['photography', 'coastal', 'sunset'],
    sentiment: 'serene',
    snippet: 'Snapped during evening walk after long client sprint. Low tide and glowing skyline.',
    hour: 18, chIdx: 1
  },
  {
    category: 'photo',
    title: 'Midnight Desk Setup with Steaming Chai',
    subtitle: 'iPhone 14 · Night Mode capture',
    tags: ['desk', 'midnight', 'workspace'],
    sentiment: 'nocturnal',
    snippet: 'Monitors glowing in the dark, notebook filled with graph traversal sketches.',
    hour: 2, chIdx: 0
  },
  {
    category: 'photo',
    title: 'Hackathon War Room Whiteboard',
    subtitle: 'Panoramic capture · 12:45 AM',
    tags: ['hackathon', 'whiteboard', 'architecture'],
    sentiment: 'focused',
    snippet: 'System architecture drawn out in blue and red markers with time stamps.',
    hour: 1, chIdx: 2
  },
  {
    category: 'photo',
    title: 'Bookshop Staircase in Daryaganj',
    subtitle: 'Vintage print aesthetic',
    tags: ['books', 'aesthetic', 'stillness'],
    sentiment: 'serene',
    snippet: 'Sunlight filtering through dusty glass onto piles of second-hand classics.',
    hour: 15, chIdx: 3
  },
  {
    category: 'photo',
    title: 'Lanterns on the Mandovi River',
    subtitle: 'Goa evening boat crossing',
    tags: ['celebration', 'river', 'travel'],
    sentiment: 'ecstatic',
    snippet: 'Celebratory trip after shipping the multi-month product release.',
    hour: 21, chIdx: 4
  },
  // ENTERTAINMENT
  {
    category: 'entertainment',
    title: 'Oppenheimer 70mm IMAX Screening',
    subtitle: 'PVR Phoenix Palladium · Seat G14',
    tags: ['cinema', 'imax', 'weekend'],
    sentiment: 'focused',
    snippet: 'Late night 10:45 PM show with fellow designers. Deep sound design lingering afterward.',
    hour: 23, chIdx: 1
  },
  {
    category: 'entertainment',
    title: 'Studio Ghibli: The Wind Rises',
    subtitle: 'Netflix Midnight Session',
    tags: ['animation', 'ghibli', 'introspective'],
    sentiment: 'melancholic',
    snippet: 'Watched alone on laptop with noise-canceling headphones after a grueling week.',
    hour: 1, chIdx: 0
  },
  {
    category: 'entertainment',
    title: 'Prateek Kuhad Secret Acoustic Set',
    subtitle: 'Live at The Humming Tree',
    tags: ['concert', 'live-music', 'acoustic'],
    sentiment: 'serene',
    snippet: 'Intimate acoustic set. Unreleased demos played to a crowd of 80 people.',
    hour: 20, chIdx: 2
  },
  // MESSAGES
  {
    category: 'message',
    title: '“We just got accepted into the accelerator!”',
    subtitle: 'WhatsApp ping from Rohan',
    tags: ['chat', 'milestone', 'team'],
    sentiment: 'ecstatic',
    snippet: 'Rohan: "Check email right now!! We got in. Pack your bags for Bangalore!"',
    hour: 14, chIdx: 2
  },
  {
    category: 'message',
    title: '“Marine Drive in 20? Bring your headphones”',
    subtitle: 'Signal message from Sarah',
    tags: ['hangout', 'night-walk', 'friends'],
    sentiment: 'wanderer',
    snippet: 'Sarah: "Breeze is incredible tonight. Let\'s listen to that new album by the rocks."',
    hour: 22, chIdx: 1
  },
  {
    category: 'message',
    title: '“Look how far you’ve come since last October”',
    subtitle: 'Saved voice note transcript',
    tags: ['reflection', 'audio-note', 'encouragement'],
    sentiment: 'serene',
    snippet: 'A short self-reflection note sent to personal bookmarks during a train transit.',
    hour: 7, chIdx: 3
  },
  // SEARCHES
  {
    category: 'search',
    title: '“how to simulate volumetric god rays in threejs”',
    subtitle: 'Chrome search · 6 tabs opened',
    tags: ['search', 'webgl', 'coding'],
    sentiment: 'focused',
    snippet: 'Led to reading GPU shader papers and implementing custom depth passes at 3 AM.',
    hour: 3, chIdx: 0
  },
  {
    category: 'search',
    title: '“quietest coastal cafes in north goa with fast wifi”',
    subtitle: 'Google search · 4 maps saved',
    tags: ['search', 'workation', 'travel'],
    sentiment: 'wanderer',
    snippet: 'Planning the remote work sprint for Chapter V.',
    hour: 11, chIdx: 4
  },
  {
    category: 'search',
    title: '“why do certain songs trigger involuntary memory recall”',
    subtitle: 'Late night curiosity inquiry',
    tags: ['search', 'psychology', 'memory'],
    sentiment: 'introspective',
    snippet: 'Reading about the Proustian effect after hearing an old Arctic Monkeys track.',
    hour: 2, chIdx: 3
  },
  // EVENTS
  {
    category: 'event',
    title: 'National 36-Hour Hackathon Kickoff',
    subtitle: 'Bengaluru Tech Pavilion · Badge #412',
    tags: ['hackathon', 'event', 'competition'],
    sentiment: 'ecstatic',
    snippet: 'Joined 400 builders in an auditorium buzzing with espresso and mechanical keyboards.',
    hour: 9, chIdx: 2
  },
  {
    category: 'event',
    title: 'Under the Stars: Astronomy Camp',
    subtitle: 'Pawna Lake Campsite',
    tags: ['camping', 'nature', 'stargazing'],
    sentiment: 'serene',
    snippet: 'Orion and Pleiades visible with naked eye. Acoustic guitar around the campfire.',
    hour: 21, chIdx: 1
  },
  {
    category: 'event',
    title: 'Demo Day & Investor Showcase',
    subtitle: 'Leela Palace Ballroom',
    tags: ['pitch', 'milestone', 'career'],
    sentiment: 'ambitious',
    snippet: 'Delivered the 4-minute live product demo to an audience of 300 founders.',
    hour: 16, chIdx: 4
  },
  // PERSONAL NOTES
  {
    category: 'note',
    title: '“The quiet hours belong to those who build”',
    subtitle: 'Notion scratchpad entry',
    tags: ['journal', 'philosophy', 'night'],
    sentiment: 'nocturnal',
    snippet: 'Written at 3:15 AM while waiting for a test suite to pass. Feeling immense clarity.',
    hour: 3, chIdx: 0
  },
  {
    category: 'note',
    title: '“Cities are not places; they are states of mind”',
    subtitle: 'Pocket notebook scan',
    tags: ['journal', 'travel', 'mumbai'],
    sentiment: 'wanderer',
    snippet: 'Watching the suburban local train carve through the monsoon mist.',
    hour: 8, chIdx: 1
  },
  {
    category: 'note',
    title: '“Checklist for the next phase of life”',
    subtitle: 'Markdown note · pinned to desktop',
    tags: ['goals', 'habits', 'clarity'],
    sentiment: 'focused',
    snippet: '1. Build with intention. 2. Sleep before 1 AM twice a week. 3. Read physical books.',
    hour: 22, chIdx: 3
  }
];

// Replicate complementary seeds across the timeline for rich density
for (let cycle = 0; cycle < 5; cycle++) {
  COMPLEMENTARY_SEEDS.forEach((seed, sIdx) => {
    const chapter = CHAPTER_DEFINITIONS[(seed.chIdx + cycle) % CHAPTER_DEFINITIONS.length];
    const day = 2 + ((sIdx * 3 + cycle * 5) % 25);
    const month = chapter.startMonth;
    const year = chapter.baseYear;
    const hour = (seed.hour + cycle) % 24;
    const isoTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String((sIdx * 13) % 60).padStart(2, '0')}:00.000Z`;

    relics.push({
      id: makeId(`rel_${seed.category}`),
      category: seed.category,
      title: seed.title,
      subtitle: seed.subtitle,
      timestamp: isoTime,
      year,
      month,
      day,
      hour,
      dayOfWeek: (day + sIdx) % 7,
      location: {
        name: `${chapter.city} Cultural Quarter`,
        city: chapter.city
      },
      details: {
        tags: seed.tags,
        sentiment: seed.sentiment,
        contextSnippet: seed.snippet,
        note: seed.category === 'note' ? seed.snippet : undefined,
        searchQuery: seed.category === 'search' ? seed.title : undefined,
        messageText: seed.category === 'message' ? seed.snippet : undefined
      },
      chapterId: chapter.id,
      connectedRelicIds: [],
      energy: seed.sentiment === 'ecstatic' || seed.sentiment === 'focused' ? 0.85 : 0.55
    });
  });
}

// 5. Position Relics in 3D Space Orbiting Their Chapter Platforms
CHAPTER_DEFINITIONS.forEach(ch => {
  const chapterRelics = relics.filter(r => r.chapterId === ch.id);
  const total = chapterRelics.length;
  
  chapterRelics.forEach((relic, idx) => {
    // Spiral phyllotaxis / orbital distribution around chapter platform
    const angle = idx * 2.39996; // Golden angle in radians
    const radius = 1.2 + Math.sqrt(idx) * 0.45;
    const heightOffset = ((idx % 7) - 3) * 0.45;
    
    const x = Number((ch.platformPos[0] + Math.cos(angle) * radius).toFixed(2));
    const y = Number((ch.platformPos[1] + 0.6 + heightOffset).toFixed(2));
    const z = Number((ch.platformPos[2] + Math.sin(angle) * radius).toFixed(2));
    
    relic.spatialCoordinates = [x, y, z];
  });
});

// 6. Connect Relics with Semantic & Temporal Threads
console.log(`Connecting relics... (Total relics generated: ${relics.length})`);
for (let i = 0; i < relics.length; i++) {
  const r1 = relics[i];
  for (let j = i + 1; j < relics.length; j++) {
    const r2 = relics[j];
    
    // Connect if same chapter and within 3 hours
    const sameChapter = r1.chapterId === r2.chapterId;
    const timeDiffMs = Math.abs(new Date(r1.timestamp).getTime() - new Date(r2.timestamp).getTime());
    const hoursDiff = timeDiffMs / (1000 * 60 * 60);
    
    // Check shared tags
    const sharedTags = r1.details.tags.some(t => r2.details.tags.includes(t));
    
    // Rule: Fuse into connection thread
    if (sameChapter && (hoursDiff <= 4 || (sharedTags && hoursDiff <= 48))) {
      if (r1.connectedRelicIds.length < 6 && r2.connectedRelicIds.length < 6) {
        r1.connectedRelicIds.push(r2.id);
        r2.connectedRelicIds.push(r1.id);
      }
    }
  }
}

// Ensure data directory exists
const outputDir = path.join(rootDir, 'src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'curated_relics.json');
fs.writeFileSync(outputPath, JSON.stringify({
  meta: {
    generatedAt: new Date().toISOString(),
    totalRelics: relics.length,
    chapters: CHAPTER_DEFINITIONS,
    categories: ['music', 'entertainment', 'place', 'purchase', 'photo', 'message', 'search', 'event', 'note']
  },
  relics
}, null, 2));

console.log(`SUCCESS: Wrote ${relics.length} curated relics to ${outputPath}`);
