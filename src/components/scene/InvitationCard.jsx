import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

export default function InvitationCard({ visible = false, onReady }) {
  const groupRef = useRef();
  const frontRef = useRef();
  const backRef = useRef();
  const [shimmerT, setShimmerT] = useState(0);

  useEffect(() => {
    if (!visible || !groupRef.current) return;

    groupRef.current.scale.set(0, 0, 0);
    groupRef.current.position.y = 0;

    gsap.to(groupRef.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)',
      delay: 0.2,
    });

    gsap.to(groupRef.current.rotation, {
      y: Math.PI * 2,
      duration: 1.4,
      ease: 'power2.out',
      delay: 0.2,
      onComplete: () => onReady?.(),
    });

    gsap.to(groupRef.current.position, {
      y: 1.8,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.2,
    });
  }, [visible]);

  useFrame((state) => {
    if (!groupRef.current || !visible) return;
    setShimmerT(state.clock.elapsedTime);
    // Gentle float
    groupRef.current.position.y = 1.8 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    groupRef.current.rotation.y += 0.001;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0, 0, 0]}>
      {/* Card body */}
      <mesh ref={frontRef} castShadow>
        <boxGeometry args={[2.2, 3.0, 0.04]} />
        <meshStandardMaterial
          color="#FFF8E7"
          roughness={0.1}
          metalness={0.05}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Gold border frame */}
      {[
        [0, 1.46, 0.025, 2.2, 0.06],
        [0, -1.46, 0.025, 2.2, 0.06],
        [-1.06, 0, 0.025, 0.06, 2.88],
        [1.06, 0, 0.025, 0.06, 2.88],
      ].map(([x, y, z, w, h], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, 0.01]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} emissive="#D4AF37" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* Corner ornaments */}
      {[[-0.9, 1.3], [0.9, 1.3], [-0.9, -1.3], [0.9, -1.3]].map(([x, y], i) => (
        <mesh key={`corner-${i}`} position={[x, y, 0.03]}>
          <circleGeometry args={[0.07, 6]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} emissive="#D4AF37" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Shimmer overlay */}
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[2.1, 2.88]} />
        <meshStandardMaterial
          color="#D4AF37"
          transparent
          opacity={0.04 + Math.abs(Math.sin(shimmerT * 0.5)) * 0.04}
          metalness={1}
          roughness={0}
        />
      </mesh>
    </group>
  );
}
