/**
 * RELIC - Individual 3D Relic Objects
 * Distinct geometric manifestations for each digital-life category:
 * Music (vinyl disc), Purchase (gold coin), Place (sapphire crystal),
 * Photo (golden frame), Event (beacon), Search (cyan lens), Note (scroll).
 *
 * ENHANCED: Stronger selection glow, heavy dimming of unconnected relics,
 * per-relic point light on selection, distance-based LOD.
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRelicStore } from '../../lib/store';
import type { Relic, RelicCategory } from '../../types/relic';

interface RelicItemProps {
  relic: Relic;
  isSelected: boolean;
  isDimmed: boolean;
  isConnected: boolean;
  onSelect: () => void;
}

// Category palette & glowing emissive colors
const CATEGORY_STYLES: Record<
  RelicCategory,
  { color: string; emissive: string; metalness: number; roughness: number }
> = {
  music: { color: '#1E1B4B', emissive: '#818CF8', metalness: 0.8, roughness: 0.2 },
  purchase: { color: '#78350F', emissive: '#F59E0B', metalness: 0.9, roughness: 0.15 },
  place: { color: '#0C4A6E', emissive: '#38BDF8', metalness: 0.7, roughness: 0.25 },
  photo: { color: '#14532D', emissive: '#4ADE80', metalness: 0.6, roughness: 0.3 },
  entertainment: { color: '#831843', emissive: '#F43F5E', metalness: 0.7, roughness: 0.2 },
  message: { color: '#431407', emissive: '#FB923C', metalness: 0.5, roughness: 0.4 },
  search: { color: '#083344', emissive: '#22D3EE', metalness: 0.85, roughness: 0.15 },
  event: { color: '#451A03', emissive: '#FBBF24', metalness: 0.75, roughness: 0.2 },
  note: { color: '#262626', emissive: '#E2E8F0', metalness: 0.4, roughness: 0.6 },
};

function RelicGeometry({ category }: { category: RelicCategory }) {
  switch (category) {
    case 'music':
      return <cylinderGeometry args={[0.36, 0.36, 0.03, 32]} />;
    case 'purchase':
      return <cylinderGeometry args={[0.3, 0.3, 0.06, 8]} />;
    case 'place':
      return <octahedronGeometry args={[0.32, 0]} />;
    case 'photo':
      return <boxGeometry args={[0.42, 0.32, 0.05]} />;
    case 'entertainment':
      return <torusGeometry args={[0.26, 0.08, 12, 24]} />;
    case 'message':
      return <capsuleGeometry args={[0.14, 0.3, 8, 16]} />;
    case 'search':
      return <icosahedronGeometry args={[0.28, 0]} />;
    case 'event':
      return <coneGeometry args={[0.3, 0.5, 6]} />;
    case 'note':
    default:
      return <boxGeometry args={[0.34, 0.44, 0.04]} />;
  }
}

function RelicItem({ relic, isSelected, isDimmed, isConnected, onSelect }: RelicItemProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const coords = relic.spatialCoordinates || [0, 0, 0];
  const style = CATEGORY_STYLES[relic.category] || CATEGORY_STYLES.note;

  // Stable random phase offset for gentle floating
  const phase = useMemo(() => Math.sin(relic.id.charCodeAt(relic.id.length - 1)) * 5, [relic.id]);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();

      // Selection elevation & scale interpolation
      const targetY = isSelected
        ? coords[1] + 0.75
        : coords[1] + Math.sin(t * 1.5 + phase) * 0.08;
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);

      // Rotation
      if (isSelected) {
        meshRef.current.rotation.y += 0.025;
      } else {
        meshRef.current.rotation.y = t * 0.4 + phase;
      }

      // Scale — selected is bigger, connected slightly up, dimmed shrinks more
      const targetScale = isSelected ? 1.5 : hovered ? 1.18 : isConnected ? 1.08 : isDimmed ? 0.55 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
  });

  // Dynamic emissive intensity
  const emissiveIntensity = isSelected
    ? 2.8
    : hovered
    ? 0.9
    : isConnected
    ? 0.75
    : isDimmed
    ? 0.05
    : 0.4;

  const opacity = isDimmed ? 0.1 : 1.0;

  return (
    <group
      ref={meshRef}
      position={[coords[0], coords[1], coords[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = '';
      }}
    >
      <mesh castShadow receiveShadow>
        <RelicGeometry category={relic.category} />
        <meshStandardMaterial
          color={isSelected ? '#D4A843' : isConnected ? '#C8E6FF' : style.color}
          emissive={
            isSelected
              ? '#F59E0B'
              : isConnected
              ? '#60B8F8'
              : hovered
              ? '#E8D5A3'
              : style.emissive
          }
          emissiveIntensity={emissiveIntensity}
          metalness={style.metalness}
          roughness={style.roughness}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Strong selection glow light — only when selected */}
      {isSelected && (
        <pointLight
          color="#F59E0B"
          intensity={3.5}
          distance={2.8}
          decay={2}
        />
      )}

      {/* Connected relic subtle glow */}
      {isConnected && !isSelected && (
        <pointLight
          color="#38BDF8"
          intensity={0.8}
          distance={1.4}
          decay={2}
        />
      )}

      {/* Hover / Selected minimal tooltip */}
      {(hovered || isSelected) && (
        <Html position={[0, 0.62, 0]} center distanceFactor={14} className="pointer-events-none select-none">
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-md bg-[#0F172A]/95 border border-[#C9A227]/50 shadow-md backdrop-blur-sm whitespace-nowrap">
              <span className="text-[10px] font-semibold text-[#F1F5F9]">{relic.title}</span>
              <span className="ml-1 text-[9px] text-[#C9A227] font-medium">({relic.category})</span>
            </div>
            <div className="w-1 h-1 bg-[#C9A227] rotate-45 -mt-0.5" />
          </div>
        </Html>
      )}
    </group>
  );
}

export function RelicMeshes() {
  const allRelics = useRelicStore((s) => s.allRelics);
  const selectedRelicId = useRelicStore((s) => s.selectedRelicId);
  const activeChapterId = useRelicStore((s) => s.activeChapterId);
  const selectedCategories = useRelicStore((s) => s.selectedCategories);
  const searchQuery = useRelicStore((s) => s.searchQuery.trim().toLowerCase());
  const isEchoModeActive = useRelicStore((s) => s.isEchoModeActive);
  const echoes = useRelicStore((s) => s.echoes);
  const selectRelic = useRelicStore((s) => s.selectRelic);

  // Set of relic IDs that belong to discovered Echoes
  const echoRelicIdSet = useMemo(() => {
    const set = new Set<string>();
    echoes.forEach((e) => e.relicIds.forEach((id) => set.add(id)));
    return set;
  }, [echoes]);

  // Connected relic IDs from selected relic
  const connectedRelicIdSet = useMemo(() => {
    if (!selectedRelicId) return new Set<string>();
    const selected = allRelics.find((r) => r.id === selectedRelicId);
    if (!selected) return new Set<string>();
    return new Set<string>(selected.connectedRelicIds || []);
  }, [allRelics, selectedRelicId]);

  // Any relic is selected — triggers heavy dimming mode
  const hasSelection = Boolean(selectedRelicId);

  return (
    <group>
      {allRelics.map((relic) => {
        const isSelected = selectedRelicId === relic.id;
        const isConnected = !isSelected && connectedRelicIdSet.has(relic.id);

        // Check dimming rules
        let isDimmed = false;

        // 1. Selection mode: everything not selected/connected dims heavily
        if (hasSelection && !isSelected && !isConnected) {
          isDimmed = true;
        }

        // 2. Chapter filter (only applied when no relic selected)
        if (!hasSelection && activeChapterId && relic.chapterId !== activeChapterId) {
          isDimmed = true;
        }

        // 3. Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(relic.category)) {
          isDimmed = true;
        }

        // 4. Echo mode filter
        if (isEchoModeActive && !echoRelicIdSet.has(relic.id)) {
          isDimmed = true;
        }

        // 5. Search query filter
        if (searchQuery) {
          const matchTitle = relic.title.toLowerCase().includes(searchQuery);
          const matchSub = relic.subtitle.toLowerCase().includes(searchQuery);
          const matchArtist = (relic.details.artist || '').toLowerCase().includes(searchQuery);
          const matchCity = (relic.location?.city || '').toLowerCase().includes(searchQuery);
          if (!matchTitle && !matchSub && !matchArtist && !matchCity) {
            isDimmed = true;
          }
        }

        return (
          <RelicItem
            key={relic.id}
            relic={relic}
            isSelected={isSelected}
            isDimmed={isDimmed}
            isConnected={isConnected}
            onSelect={() => selectRelic(relic.id)}
          />
        );
      })}
    </group>
  );
}
