/**
 * RELIC - Guided Cinematic Camera Controller
 * Smoothly interpolates the camera lookAt target and position
 * towards focused chapters, moments, and relics.
 */

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useRelicStore } from '../../lib/store';

interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export function CameraController({ controlsRef }: CameraControllerProps) {
  const camera = useThree((s) => s.camera);
  const cameraTarget = useRelicStore((s) => s.cameraTarget);
  const selectedRelicId = useRelicStore((s) => s.selectedRelicId);
  const targetVec = useRef(new THREE.Vector3(...cameraTarget));

  useFrame(() => {
    targetVec.current.set(...cameraTarget);

    if (controlsRef.current) {
      // Smoothly lerp OrbitControls focus target
      controlsRef.current.target.lerp(targetVec.current, 0.06);
      controlsRef.current.update();

      // If a relic is actively selected, perform subtle cinematic dolly-in
      if (selectedRelicId) {
        const desiredCamPos = new THREE.Vector3(
          targetVec.current.x + 1.8,
          targetVec.current.y + 1.2,
          targetVec.current.z + 4.5
        );
        camera.position.lerp(desiredCamPos, 0.04);
      }
    }
  });

  return null;
}
