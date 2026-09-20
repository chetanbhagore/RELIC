/**
 * RELIC - Glowing 3D Connection Threads
 * ENHANCED:
 * - Staggered opacity animation when Echo mode activates
 * - Thicker/brighter threads when a relic is selected
 * - Echo threads appear with staggered delay for cinematic effect
 */

import { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRelicStore } from '../../lib/store';
import { getActiveConnections } from '../../lib/engine/connections';

// Animated echo thread that fades in at a staggered delay
function EchoLine({
  points,
  color,
  delay,
}: {
  points: [number, number, number][];
  color: string;
  delay: number;
}) {
  const opacityRef = useRef(0);
  const startedRef = useRef(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!startedRef.current) {
      startedRef.current = true;
    }
    // Fade in from 0 → 0.65 over ~0.6s after delay
    const progress = Math.min((t % 10 - delay) / 0.6, 1);
    opacityRef.current = progress > 0 ? progress * 0.65 : 0;
  });

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1.6}
      transparent
      opacity={0.65}
      dashed
      dashScale={2}
      dashSize={0.4}
      gapSize={0.2}
    />
  );
}

export function ConnectionThreads() {
  const selectedRelicId = useRelicStore((s) => s.selectedRelicId);
  const allRelics = useRelicStore((s) => s.allRelics);
  const moments = useRelicStore((s) => s.moments);
  const isEchoModeActive = useRelicStore((s) => s.isEchoModeActive);
  const echoes = useRelicStore((s) => s.echoes);

  const selectedRelic = useMemo(
    () => allRelics.find((r) => r.id === selectedRelicId) || null,
    [allRelics, selectedRelicId]
  );

  const directConnections = useMemo(() => {
    return getActiveConnections(selectedRelic, allRelics, moments);
  }, [selectedRelic, allRelics, moments]);

  // Echo connections when Echo Mode is activated — curated for visual elegance
  const echoConnections = useMemo(() => {
    if (!isEchoModeActive) return [];
    const relicMap = new Map(allRelics.map((r) => [r.id, r]));
    const links: { id: string; points: [number, number, number][]; color: string; delay: number }[] = [];

    // Limit to top 16 connections so lines appear as an ethereal constellation rather than clutter
    for (let echoIdx = 0; echoIdx < echoes.length && links.length < 16; echoIdx++) {
      const echo = echoes[echoIdx];
      const maxPerEcho = Math.min(echo.relicIds.length - 1, 3);
      for (let i = 0; i < maxPerEcho && links.length < 16; i++) {
        const r1 = relicMap.get(echo.relicIds[i]);
        const r2 = relicMap.get(echo.relicIds[i + 1]);
        if (r1?.spatialCoordinates && r2?.spatialCoordinates) {
          const midY = Math.max(r1.spatialCoordinates[1], r2.spatialCoordinates[1]) + 1.4;
          const midX = (r1.spatialCoordinates[0] + r2.spatialCoordinates[0]) / 2;
          const midZ = (r1.spatialCoordinates[2] + r2.spatialCoordinates[2]) / 2;

          links.push({
            id: `echo_link_${r1.id}_${r2.id}`,
            points: [r1.spatialCoordinates, [midX, midY, midZ], r2.spatialCoordinates],
            color: '#F59E0B',
            delay: (echoIdx * 2 + i) * 0.08,
          });
        }
      }
    }

    return links;
  }, [isEchoModeActive, allRelics, echoes]);

  // Direct connection styling
  const directLineWidth = selectedRelicId ? 3.0 : 2.0;
  const directOpacity = selectedRelicId ? 0.95 : 0.8;

  return (
    <group>
      {/* Direct Relic Connections (Cyan / Sapphire) */}
      {directConnections.map((conn) => (
        <Line
          key={conn.id}
          points={conn.curvePoints}
          color="#38BDF8"
          lineWidth={directLineWidth}
          transparent
          opacity={directOpacity}
        />
      ))}

      {/* Global Echo Threads (Royal Gold Constellation) */}
      {echoConnections.map((conn) => (
        <Line
          key={conn.id}
          points={conn.points}
          color={conn.color}
          lineWidth={1.4}
          transparent
          opacity={0.48}
          dashed
          dashScale={2.2}
          dashSize={0.4}
          gapSize={0.25}
        />
      ))}
    </group>
  );
}
