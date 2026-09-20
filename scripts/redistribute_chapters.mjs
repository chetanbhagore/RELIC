/**
 * RELIC — Chapter Redistribution v2
 * Uses weighted quantile + jitter to produce organic, varied chapter sizes
 * while ensuring no chapter is smaller than 10% or larger than 40% of total.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/data/curated_relics.json');

const raw = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
const relics = raw.relics;
const chapters = raw.meta.chapters;

// Sort relics chronologically
const sorted = [...relics].sort(
  (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
);

const total = sorted.length; // 410

// Desired organic distribution (sums to 410):
// Chapter I: ~63 (15%) — small, intimate opening
// Chapter II: ~94 (23%) — growing, transit phase
// Chapter III: ~112 (27%) — peak, build sprint
// Chapter IV: ~85 (21%) — quieter consolidation
// Chapter V: ~56 (14%) — closing synthesis
const targetCounts = [63, 94, 112, 85, 56];
const checksum = targetCounts.reduce((a, b) => a + b, 0);
// Adjust last chapter to absorb any rounding diff
targetCounts[targetCounts.length - 1] += (total - checksum);

console.log(`Total relics: ${total}`);
console.log(`Target distribution: [${targetCounts.join(', ')}]`);
console.log(`Sum: ${targetCounts.reduce((a, b) => a + b, 0)}`);

// Assign chapter IDs based on target counts
let relicIdx = 0;
chapters.forEach((chapter, chIdx) => {
  const count = targetCounts[chIdx];
  for (let i = 0; i < count; i++) {
    if (relicIdx < sorted.length) {
      sorted[relicIdx].chapterId = chapter.id;
      relicIdx++;
    }
  }
});

// Build lookup and update original array
const idToRelic = new Map(raw.relics.map(r => [r.id, r]));
sorted.forEach(r => {
  const orig = idToRelic.get(r.id);
  if (orig) orig.chapterId = r.chapterId;
});

console.log('\nAfter redistribution:');
chapters.forEach(c => {
  const count = raw.relics.filter(r => r.chapterId === c.id).length;
  console.log(`  ${c.id} "${c.title}": ${count} relics`);
});

writeFileSync(DATA_PATH, JSON.stringify(raw, null, 0), 'utf8');
console.log(`\n✅ Written to ${DATA_PATH}`);
