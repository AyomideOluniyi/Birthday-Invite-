import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Particles({ count = 200, burst = false }) {
  const mesh = useRef();

  const [positions, velocities, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      if (burst) {
        pos[i3] = (Math.random() - 0.5) * 2;
        pos[i3 + 1] = (Math.random() - 0.5) * 0.5;
        pos[i3 + 2] = (Math.random() - 0.5) * 2;
        vel[i3] = (Math.random() - 0.5) * 0.04;
        vel[i3 + 1] = Math.random() * 0.06 + 0.01;
        vel[i3 + 2] = (Math.random() - 0.5) * 0.04;
      } else {
        pos[i3] = (Math.random() - 0.5) * 10;
        pos[i3 + 1] = Math.random() * 8 - 2;
        pos[i3 + 2] = (Math.random() - 0.5) * 6 - 3;
        vel[i3] = (Math.random() - 0.5) * 0.005;
        vel[i3 + 1] = Math.random() * 0.003 + 0.001;
        vel[i3 + 2] = 0;
      }
      sz[i] = Math.random() * 0.025 + 0.005;
    }
    return [pos, vel, sz];
  }, [count, burst]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  useFrame(() => {
    if (!mesh.current) return;
    const posAttr = mesh.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posAttr.array[i3] += velocities[i3];
      posAttr.array[i3 + 1] += velocities[i3 + 1];
      posAttr.array[i3 + 2] += velocities[i3 + 2];
      if (posAttr.array[i3 + 1] > 6) {
        posAttr.array[i3 + 1] = -2;
        posAttr.array[i3] = (Math.random() - 0.5) * 10;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        color="#D4AF37"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
