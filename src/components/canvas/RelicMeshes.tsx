/**
 * RELIC - Individual 3D Relic Objects
 * Distinct geometric manifestations for each digital-life category:
 * Music (vinyl disc), Purchase (gold coin), Place (sapphire crystal),
 * Photo (golden frame), Event (beacon), Search (cyan lens), Note (scroll).
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

function RelicItem({ relic, isSelected, isDimmed, onSelect }: RelicItemProps) {
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
      const targetY = isSelected ? coords[1] + 0.65 : coords[1] + Math.sin(t * 1.5 + phase) * 0.08;
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);

      // Rotation
      if (isSelected) {
        meshRef.current.rotation.y += 0.02;
      } else {
        meshRef.current.rotation.y = t * 0.4 + phase;
      }

      // Scale
      const targetScale = isSelected ? 1.35 : hovered ? 1.15 : isDimmed ? 0.65 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
  });

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
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow receiveShadow>
        <RelicGeometry category={relic.category} />
        <meshStandardMaterial
          color={isSelected ? '#C9A227' : style.color}
          emissive={isSelected ? '#F59E0B' : hovered ? '#E8D5A3' : style.emissive}
          emissiveIntensity={isSelected ? 1.2 : hovered ? 0.7 : isDimmed ? 0.1 : 0.4}
          metalness={style.metalness}
          roughness={style.roughness}
          transparent
          opacity={isDimmed ? 0.22 : 1.0}
        />
      </mesh>

      {/* Hover / Selected minimal tooltip */}
      {(hovered || isSelected) && (
        <Html position={[0, 0.55, 0]} center distanceFactor={14} className="pointer-events-none select-none">
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

  return (
    <group>
      {allRelics.map((relic) => {
        const isSelected = selectedRelicId === relic.id;

        // Check dimming rules
        let isDimmed = false;

        // 1. Chapter filter
        if (activeChapterId && relic.chapterId !== activeChapterId) {
          isDimmed = true;
        }

        // 2. Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(relic.category)) {
          isDimmed = true;
        }

        // 3. Echo mode filter
        if (isEchoModeActive && !echoRelicIdSet.has(relic.id)) {
          isDimmed = true;
        }

        // 4. Search query filter
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
            onSelect={() => selectRelic(relic.id)}
          />
        );
      })}
    </group>
  );
}
