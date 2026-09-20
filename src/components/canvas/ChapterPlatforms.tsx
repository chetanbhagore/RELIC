/**
 * RELIC - Floating Chapter Platforms
 * Massive, dark crystalline stone slabs marking distinct life phases.
 * Acts as spatial anchors for orbiting relic clusters.
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
}

function Platform({ chapter, isActive, onSelect }: PlatformProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [x, y, z] = chapter.platformPosition;

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle breathing idle float
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = y + Math.sin(t * 0.8 + chapter.index) * 0.12;
    }
  });

  return (
    <group ref={meshRef} position={[x, y, z]}>
      {/* Stone / Marble Platform Base */}
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <cylinderGeometry args={[3.2, 3.5, 0.45, 8]} />
        <meshStandardMaterial
          color={isActive ? '#1E293B' : '#0B1120'}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>

      {/* Brushed Gold Rim Chamfer */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[3.22, 3.22, 0.06, 8]} />
        <meshStandardMaterial
          color={isActive ? '#F59E0B' : '#C9A227'}
          emissive={isActive ? '#C9A227' : '#78350F'}
          emissiveIntensity={isActive ? 0.8 : 0.2}
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Inner Glowing Core Ring */}
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2.0, 32]} />
        <meshBasicMaterial
          color={chapter.colorAccent}
          transparent
          opacity={isActive ? 0.85 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Spatial Chapter Label Billboard */}
      <Html
        position={[0, -0.6, 2.6]}
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
              {chapter.title.split(':')[1] || chapter.title}
            </span>
          </div>
          <p className="mt-0.5 text-[9px] text-[#94A3B8] font-medium tracking-wide">
            {chapter.relicCount} relics · {chapter.periodLabel.split('·')[0]}
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

  return (
    <group>
      {chapters.map((chapter) => (
        <Platform
          key={chapter.id}
          chapter={chapter}
          isActive={activeChapterId === chapter.id}
          onSelect={() => selectChapter(chapter.id)}
        />
      ))}
    </group>
  );
}
