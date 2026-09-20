/**
 * RELIC - Ethereal Vault Dust Particles
 * Floating golden dust specks suspended in dark space.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DustParticles({ count = 140 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const pha = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = Math.random() * 14 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
      pha[i] = Math.random() * Math.PI * 2;
    }

    return [pos, pha];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const posAttr = geo.attributes.position;
      const t = state.clock.getElapsedTime();

      for (let i = 0; i < count; i++) {
        const y = posAttr.getY(i);
        // Slow vertical drift
        posAttr.setY(i, y + Math.sin(t * 0.5 + phases[i]) * 0.006);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#E8D5A3"
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
