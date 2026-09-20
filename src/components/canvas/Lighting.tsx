/**
 * RELIC - Royal Vault 3D Lighting System
 * Creates high-contrast, dramatic, museum-grade illumination.
 * Features a dynamic spotlight that smoothly lerps to follow the selected relic.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRelicStore } from '../../lib/store';

export function Lighting() {
  const selectedRelicPosition = useRelicStore((s) => s.selectedRelicPosition);
  const spotRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  useFrame(() => {
    if (spotRef.current) {
      if (selectedRelicPosition) {
        // Smoothly glide the dynamic spotlight above the selected relic
        spotRef.current.position.lerp(
          new THREE.Vector3(
            selectedRelicPosition[0],
            selectedRelicPosition[1] + 4.5,
            selectedRelicPosition[2] + 2.5
          ),
          0.08
        );
        targetRef.current.position.lerp(
          new THREE.Vector3(...selectedRelicPosition),
          0.08
        );
        targetRef.current.updateMatrixWorld();
        spotRef.current.target = targetRef.current;
        spotRef.current.intensity = THREE.MathUtils.lerp(spotRef.current.intensity, 2.8, 0.1);
      } else {
        spotRef.current.intensity = THREE.MathUtils.lerp(spotRef.current.intensity, 0, 0.1);
      }
    }
  });

  return (
    <>
      {/* Deep baseline ambient - prevents absolute darkness while maintaining depth */}
      <ambientLight intensity={0.12} color="#0F172A" />

      {/* Main Key Light: Warm Royal Gold from top-right */}
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.4}
        color="#E8D5A3"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Fill Light: Cool Sapphire from the lower left */}
      <directionalLight
        position={[-8, 4, -4]}
        intensity={0.45}
        color="#38BDF8"
      />

      {/* Rim Light: Cyan-Platinum from behind to carve silhouettes out of the void */}
      <directionalLight
        position={[0, 6, -10]}
        intensity={0.65}
        color="#93C5FD"
      />

      {/* Dynamic Relic Selection Spotlight */}
      <primitive object={targetRef.current} />
      <spotLight
        ref={spotRef}
        position={[0, 10, 5]}
        intensity={0}
        color="#C9A227"
        angle={0.4}
        penumbra={0.7}
        distance={25}
      />
    </>
  );
}
