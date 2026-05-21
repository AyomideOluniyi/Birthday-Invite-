import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

export default function Knife({ dragY = 0, sliced = false, visible = true }) {
  const groupRef = useRef();
  const glowRef = useRef();

  // Float animation before drag
  useFrame((state) => {
    if (!groupRef.current || sliced) return;
    if (dragY === 0) {
      groupRef.current.position.y = 2.2 + Math.sin(state.clock.elapsedTime * 1.8) * 0.06;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });

  // Map dragY (pixels) to scene units
  const knifeY = 2.2 - (dragY / 100) * 1.5;

  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.position, {
      y: knifeY,
      duration: 0.05,
      ease: 'none',
      overwrite: true,
    });
  }, [dragY, knifeY]);

  useEffect(() => {
    if (sliced && groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: -6,
        duration: 0.8,
        ease: 'power2.in',
        delay: 0.3,
      });
    }
  }, [sliced]);

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 2.2, 0.1]} rotation={[0, 0, 0]}>
      {/* Blade */}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.06, 0.7, 0.008]} />
        <meshStandardMaterial
          color="#E8E8F0"
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={1}
        />
      </mesh>
      {/* Blade edge bevel */}
      <mesh position={[0, -0.35, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.02, 0.7, 0.004]} />
        <meshStandardMaterial color="#FFFFFF" metalness={1} roughness={0} />
      </mesh>
      {/* Guard */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.18, 0.04, 0.02]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.03, 0.025, 0.44, 8]} />
        <meshStandardMaterial color="#1a0a05" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Handle gold rings */}
      {[-0.05, 0.05, 0.15].map((y, i) => (
        <mesh key={i} position={[0, 0.28 + y, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.018, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Tip indicator glow */}
      <pointLight
        ref={glowRef}
        color="#D4AF37"
        intensity={0.8}
        distance={1.2}
        decay={2}
        position={[0, -0.7, 0]}
      />
    </group>
  );
}
