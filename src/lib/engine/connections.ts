/**
 * RELIC - Connection Graph & Thread Generation Engine
 * Computes direct and non-obvious relationships between relics,
 * moments, and chapters, and generates 3D cubic Bezier curves
 * for glowing thread visualization in WebGL.
 */

import * as THREE from 'three';
import type { Relic, Moment } from '../../types/relic';

export interface ConnectionLink {
  id: string;
  sourceId: string;
  targetId: string;
  reason: 'moment' | 'tag' | 'place' | 'artist' | 'echo';
  label: string;
  sourcePos: [number, number, number];
  targetPos: [number, number, number];
  curvePoints: THREE.Vector3[];
}

/**
 * Calculates a gentle upward arc between two 3D points
 */
function createArcCurve(
  start: [number, number, number],
  end: [number, number, number],
  arcHeight = 1.2
): THREE.Vector3[] {
  const p0 = new THREE.Vector3(...start);
  const p3 = new THREE.Vector3(...end);

  const mid = new THREE.Vector3().addVectors(p0, p3).multiplyScalar(0.5);
  const dist = p0.distanceTo(p3);
  mid.y += Math.min(3.5, Math.max(0.6, dist * 0.25 * arcHeight));

  const curve = new THREE.QuadraticBezierCurve3(p0, mid, p3);
  return curve.getPoints(24);
}

/**
 * Generates active glowing connection threads for the selected relic
 */
export function getActiveConnections(
  selectedRelic: Relic | null,
  allRelics: Relic[],
  moments: Moment[]
): ConnectionLink[] {
  if (!selectedRelic || !selectedRelic.spatialCoordinates) return [];

  const links: ConnectionLink[] = [];
  const relicMap = new Map<string, Relic>(allRelics.map((r) => [r.id, r]));
  const seenPairs = new Set<string>();

  // 1. Direct Moment Connections
  if (selectedRelic.momentId) {
    const moment = moments.find((m) => m.id === selectedRelic.momentId);
    if (moment) {
      moment.relicIds.forEach((otherId) => {
        if (otherId === selectedRelic.id) return;
        const other = relicMap.get(otherId);
        if (!other || !other.spatialCoordinates) return;

        const pairKey = [selectedRelic.id, other.id].sort().join('--');
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          links.push({
            id: `conn_${pairKey}`,
            sourceId: selectedRelic.id,
            targetId: other.id,
            reason: 'moment',
            label: `Fused in "${moment.title}"`,
            sourcePos: selectedRelic.spatialCoordinates!,
            targetPos: other.spatialCoordinates,
            curvePoints: createArcCurve(selectedRelic.spatialCoordinates!, other.spatialCoordinates, 1.0),
          });
        }
      });
    }
  }

  // 2. Explicit Connected Relic Ids
  selectedRelic.connectedRelicIds.forEach((otherId) => {
    const other = relicMap.get(otherId);
    if (!other || !other.spatialCoordinates) return;

    const pairKey = [selectedRelic.id, other.id].sort().join('--');
    if (!seenPairs.has(pairKey) && links.length < 12) {
      seenPairs.add(pairKey);
      links.push({
        id: `conn_${pairKey}`,
        sourceId: selectedRelic.id,
        targetId: other.id,
        reason: 'tag',
        label: 'Shared Resonance & Temporal Proximity',
        sourcePos: selectedRelic.spatialCoordinates!,
        targetPos: other.spatialCoordinates,
        curvePoints: createArcCurve(selectedRelic.spatialCoordinates!, other.spatialCoordinates, 1.4),
      });
    }
  });

  return links;
}
