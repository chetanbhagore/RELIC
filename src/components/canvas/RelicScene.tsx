/**
 * RELIC - Main 3D Reliquary Scene Canvas
 * High-performance React Three Fiber viewport rendering the royal vault.
 */

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Lighting } from './Lighting';
import { ChapterPlatforms } from './ChapterPlatforms';
import { RelicMeshes } from './RelicMeshes';
import { ConnectionThreads } from './ConnectionThreads';
import { DustParticles } from './DustParticles';
import { CameraController } from './CameraController';
import { useRelicStore } from '../../lib/store';

export function RelicScene() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const selectRelic = useRelicStore((s) => s.selectRelic);

  return (
    <div
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      id="relic-3d-viewport"
      role="region"
      aria-label="3D Royal Reliquary Viewport"
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 6, 18], fov: 45 }}
        onPointerDown={(e) => {
          // Deselect on clicking empty background
          if ((e.target as HTMLElement).tagName === 'CANVAS') {
            selectRelic(null);
          }
        }}
      >
        {/* Deep infinite void */}
        <color attach="background" args={['#070B14']} />
        <fog attach="fog" args={['#070B14', 10, 48]} />

        {/* Royal Vault Illumination */}
        <Lighting />

        {/* Dynamic Chapter Slabs & Orbiting Artifacts */}
        <ChapterPlatforms />
        <RelicMeshes />
        <ConnectionThreads />
        <DustParticles count={140} />

        {/* Camera Guidance & Interactive Controls */}
        <CameraController controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          panSpeed={0.8}
          rotateSpeed={0.7}
          zoomSpeed={0.9}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={4}
          maxDistance={38}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
