/**
 * RELIC - Glowing 3D Connection Threads
 * Visualizes active relational threads between fused moments and relics.
 * Pulses gently with cyan-sapphire luminescence.
 */

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useRelicStore } from '../../lib/store';
import { getActiveConnections } from '../../lib/engine/connections';

export function ConnectionThreads() {
  const selectedRelicId = useRelicStore((s) => s.selectedRelicId);
  const allRelics = useRelicStore((s) => s.allRelics);
  const moments = useRelicStore((s) => s.moments);
  const isEchoModeActive = useRelicStore((s) => s.isEchoModeActive);
  const echoes = useRelicStore((s) => s.echoes);

  // Active connections for the selected relic
  const selectedRelic = useMemo(
    () => allRelics.find((r) => r.id === selectedRelicId) || null,
    [allRelics, selectedRelicId]
  );

  const directConnections = useMemo(() => {
    return getActiveConnections(selectedRelic, allRelics, moments);
  }, [selectedRelic, allRelics, moments]);

  // Echo connections when Echo Mode is activated
  const echoConnections = useMemo(() => {
    if (!isEchoModeActive) return [];
    const relicMap = new Map(allRelics.map((r) => [r.id, r]));
    const links: { id: string; points: [number, number, number][]; color: string }[] = [];

    echoes.forEach((echo) => {
      for (let i = 0; i < Math.min(echo.relicIds.length - 1, 6); i++) {
        const r1 = relicMap.get(echo.relicIds[i]);
        const r2 = relicMap.get(echo.relicIds[i + 1]);
        if (r1?.spatialCoordinates && r2?.spatialCoordinates) {
          const midY = Math.max(r1.spatialCoordinates[1], r2.spatialCoordinates[1]) + 1.2;
          const midX = (r1.spatialCoordinates[0] + r2.spatialCoordinates[0]) / 2;
          const midZ = (r1.spatialCoordinates[2] + r2.spatialCoordinates[2]) / 2;

          links.push({
            id: `echo_link_${r1.id}_${r2.id}`,
            points: [
              r1.spatialCoordinates,
              [midX, midY, midZ],
              r2.spatialCoordinates,
            ],
            color: '#F59E0B', // Gold for Echoes
          });
        }
      }
    });

    return links;
  }, [isEchoModeActive, allRelics, echoes]);

  return (
    <group>
      {/* Direct Relic Connections (Cyan / Sapphire) */}
      {directConnections.map((conn) => (
        <Line
          key={conn.id}
          points={conn.curvePoints}
          color="#38BDF8"
          lineWidth={2.2}
          transparent
          opacity={0.85}
        />
      ))}

      {/* Global Echo Threads (Royal Gold) */}
      {echoConnections.map((conn) => (
        <Line
          key={conn.id}
          points={conn.points}
          color={conn.color}
          lineWidth={1.6}
          transparent
          opacity={0.65}
          dashed
          dashScale={2}
          dashSize={0.4}
          gapSize={0.2}
        />
      ))}
    </group>
  );
}
