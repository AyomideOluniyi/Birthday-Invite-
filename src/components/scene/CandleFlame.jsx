import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CandleFlame({ position = [0, 0, 0] }) {
  const meshRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const flicker = 0.85 + Math.sin(t * 12 + position[0] * 5) * 0.08 + Math.random() * 0.07;
    meshRef.current.scale.y = flicker;
    meshRef.current.scale.x = 0.9 + Math.sin(t * 8 + position[2] * 3) * 0.1;
    if (lightRef.current) {
      lightRef.current.intensity = 0.4 + Math.sin(t * 15 + position[0]) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Flame body */}
      <mesh ref={meshRef} position={[0, 0.06, 0]}>
        <coneGeometry args={[0.025, 0.1, 6]} />
        <meshStandardMaterial
          color="#FFB347"
          emissive="#FF6600"
          emissiveIntensity={2.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Flame tip */}
      <mesh position={[0, 0.13, 0]}>
        <coneGeometry args={[0.01, 0.06, 6]} />
        <meshStandardMaterial
          color="#FFFF88"
          emissive="#FFDD00"
          emissiveIntensity={3}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Point light */}
      <pointLight
        ref={lightRef}
        color="#FF8800"
        intensity={0.4}
        distance={0.8}
        decay={2}
      />
    </group>
  );
}
