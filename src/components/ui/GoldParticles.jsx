import { useMemo } from 'react';

export default function GoldParticles({ count = 30 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      bottom: `${Math.random() * 55}%`,
      size: Math.random() * 2.5 + 1,
      delay: `${Math.random() * 10}s`,
      duration: `${8 + Math.random() * 7}s`,
      dx: `${(Math.random() - 0.5) * 50}px`,
    })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            background: '#D4AF37',
            boxShadow: `0 0 ${p.size * 3}px rgba(212,175,55,0.9)`,
            '--dx': p.dx,
            animation: `particle-up ${p.duration} ${p.delay} ease-in-out infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
