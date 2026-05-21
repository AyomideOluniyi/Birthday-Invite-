import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import CandleFlame from './CandleFlame';

const CANDLE_COUNT = 12; // visible candles (60 is too dense, 12 arranged in rings looks elegant)

function generateCandlePositions() {
  const positions = [];
  // Outer ring on top tier
  const outerRing = 8;
  for (let i = 0; i < outerRing; i++) {
    const angle = (i / outerRing) * Math.PI * 2;
    positions.push([Math.cos(angle) * 0.38, 0, Math.sin(angle) * 0.38]);
  }
  // Inner ring
  const innerRing = 4;
  for (let i = 0; i < innerRing; i++) {
    const angle = (i / innerRing) * Math.PI * 2 + Math.PI / innerRing;
    positions.push([Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2]);
  }
  return positions;
}

const CANDLE_POSITIONS = generateCandlePositions();

export default function Cake({ sliced = false, sliceProgress = 0 }) {
  const groupRef = useRef();
  const leftHalfRef = useRef();
  const rightHalfRef = useRef();
  const wholeRef = useRef();

  // Rise animation on mount
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y = -6;
    gsap.to(groupRef.current.position, {
      y: -1.2,
      duration: 1.8,
      ease: 'elastic.out(1, 0.6)',
      delay: 0.3,
    });
  }, []);

  // Slice animation
  useEffect(() => {
    if (!sliced || !leftHalfRef.current || !rightHalfRef.current || !wholeRef.current) return;

    gsap.to(wholeRef.current.position, { y: -8, duration: 0.1, delay: 0.05 });

    gsap.to(leftHalfRef.current.position, {
      x: -2.2,
      y: -2,
      duration: 1.2,
      ease: 'power3.in',
      delay: 0.1,
    });
    gsap.to(leftHalfRef.current.rotation, {
      z: -0.4,
      duration: 1.2,
      ease: 'power3.in',
      delay: 0.1,
    });
    gsap.to(rightHalfRef.current.position, {
      x: 2.2,
      y: -2,
      duration: 1.2,
      ease: 'power3.in',
      delay: 0.1,
    });
    gsap.to(rightHalfRef.current.rotation, {
      z: 0.4,
      duration: 1.2,
      ease: 'power3.in',
      delay: 0.1,
    });
  }, [sliced]);

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Whole cake — hidden after slice */}
      <group ref={wholeRef}>
        {/* Bottom tier */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.85, 0.9, 0.55, 32]} />
          <meshStandardMaterial color="#FFF8E7" roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Bottom tier gold band */}
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.86, 0.86, 0.04, 32]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.6} />
        </mesh>

        {/* Middle tier */}
        <mesh position={[0, 0.72, 0]} castShadow>
          <cylinderGeometry args={[0.62, 0.66, 0.5, 32]} />
          <meshStandardMaterial color="#FFF8E7" roughness={0.3} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.97, 0]}>
          <cylinderGeometry args={[0.63, 0.63, 0.04, 32]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.6} />
        </mesh>

        {/* Top tier */}
        <mesh position={[0, 1.32, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.46, 0.42, 32]} />
          <meshStandardMaterial color="#FFF8E7" roughness={0.3} metalness={0.05} />
        </mesh>
        <mesh position={[0, 1.53, 0]}>
          <cylinderGeometry args={[0.43, 0.43, 0.04, 32]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.6} />
        </mesh>

        {/* Gold topper disc */}
        <mesh position={[0, 1.56, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Candles on top tier */}
        {CANDLE_POSITIONS.map((pos, i) => (
          <group key={i} position={[pos[0], 1.56, pos[2]]}>
            {/* Candle stick */}
            <mesh>
              <cylinderGeometry args={[0.018, 0.018, 0.14, 8]} />
              <meshStandardMaterial color="#FFF8E7" roughness={0.4} />
            </mesh>
            <CandleFlame position={[0, 0.1, 0]} />
          </group>
        ))}

        {/* "60" decoration */}
        <mesh position={[0, 1.0, 0.64]}>
          <boxGeometry args={[0.22, 0.14, 0.01]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.8} emissive="#D4AF37" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Left half (after slice) */}
      <group ref={leftHalfRef} position={[-10, -10, 0]} visible={sliced}>
        <mesh>
          <cylinderGeometry args={[0.85, 0.9, 1.65, 32, 1, false, Math.PI, Math.PI]} />
          <meshStandardMaterial color="#FFF8E7" roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Cut interior — golden glow */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.7, 1.65]} />
          <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={1.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Right half (after slice) */}
      <group ref={rightHalfRef} position={[10, -10, 0]} visible={sliced}>
        <mesh>
          <cylinderGeometry args={[0.85, 0.9, 1.65, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#FFF8E7" roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.7, 1.65]} />
          <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={1.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Plate */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.06, 32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.15} metalness={0.7} />
      </mesh>
    </group>
  );
}
