/**
 * RELIC - Floating Chapter Platforms
 * ENHANCED: Platform radius scales with real relic count (organic, not uniform).
 * Larger chapters = physically bigger slabs. Instantly readable at a glance.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRelicStore } from '../../lib/store';
import type { Chapter } from '../../types/relic';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

interface PlatformProps {
  chapter: Chapter;
  isActive: boolean;
  onSelect: () => void;
  maxRelicCount: number;
}

function Platform({ chapter, isActive, onSelect, maxRelicCount }: PlatformProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [x, y, z] = chapter.platformPosition;

  // Scale platform radius 2.2–4.0 based on relic count relative to max
  const sizeFraction = chapter.relicCount / Math.max(maxRelicCount, 1);
  const platformRadius = 2.2 + sizeFraction * 1.8; // 2.2 (min) → 4.0 (max)
  const rimRadius = platformRadius + 0.02;

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = y + Math.sin(t * 0.8 + chapter.index) * 0.12;
    }
  });

  return (
    <group ref={meshRef} position={[x, y, z]}>
      {/* Stone / Marble Platform Base — radius reflects relic count */}
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <cylinderGeometry args={[platformRadius, platformRadius * 1.08, 0.45, 8]} />
        <meshStandardMaterial
          color={isActive ? '#1E293B' : '#0B1120'}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>

      {/* Brushed Gold Rim */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[rimRadius, rimRadius, 0.06, 8]} />
        <meshStandardMaterial
          color={isActive ? '#F59E0B' : '#C9A227'}
          emissive={isActive ? '#C9A227' : '#78350F'}
          emissiveIntensity={isActive ? 0.9 : 0.2}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Inner Glowing Core Ring — scales with platform */}
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[platformRadius * 0.55, platformRadius * 0.62, 32]} />
        <meshBasicMaterial
          color={chapter.colorAccent}
          transparent
          opacity={isActive ? 0.9 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Active platform glow light */}
      {isActive && (
        <pointLight
          color={chapter.colorAccent}
          intensity={1.2}
          distance={platformRadius * 2.5}
          decay={2}
          position={[0, 1.5, 0]}
        />
      )}

      {/* Spatial Chapter Label Billboard */}
      <Html
        position={[0, -0.65, platformRadius - 0.4]}
        center
        distanceFactor={18}
        className="pointer-events-none select-none"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`pointer-events-auto cursor-pointer text-center transition-all duration-300 ${
            isActive
              ? 'scale-110 opacity-100'
              : 'opacity-70 hover:opacity-100 hover:scale-105'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#0F172A]/90 border border-[#C9A227]/40 shadow-lg backdrop-blur-md">
            <span className="font-serif text-[11px] font-bold text-[#E8D5A3]">
              {ROMAN_NUMERALS[chapter.index] || chapter.index + 1}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-200">
              {chapter.title.split(':')[1]?.trim() || chapter.title}
            </span>
          </div>
          <p className="mt-0.5 text-[9px] text-[#94A3B8] font-medium tracking-wide">
            {chapter.relicCount} relics{chapter.insightLine ? ` · ${chapter.insightLine}` : ''}
          </p>
        </div>
      </Html>
    </group>
  );
}

export function ChapterPlatforms() {
  const chapters = useRelicStore((s) => s.chapters);
  const activeChapterId = useRelicStore((s) => s.activeChapterId);
  const selectChapter = useRelicStore((s) => s.selectChapter);

  const maxRelicCount = Math.max(...chapters.map((c) => c.relicCount), 1);

  return (
    <group>
      {chapters.map((chapter) => (
        <Platform
          key={chapter.id}
          chapter={chapter}
          isActive={activeChapterId === chapter.id}
          onSelect={() => selectChapter(chapter.id)}
          maxRelicCount={maxRelicCount}
        />
      ))}
    </group>
  );
}
