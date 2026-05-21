import { useEffect, useRef } from 'react';
import GlassCard from '../ui/GlassCard';

const COLORS = ['#D4AF37', '#FFF8E7', '#B76E79', '#F0D060', '#ffffff', '#D4AF37'];

function Confetti() {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pieces = [];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -10px;
        width: ${Math.random() * 8 + 5}px;
        height: ${Math.random() * 8 + 5}px;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${Math.random() * 2.5 + 1.8}s;
        animation-delay: ${Math.random() * 1.2}s;
        opacity: 0;
      `;
      container.appendChild(el);
      pieces.push(el);
    }
    return () => pieces.forEach((el) => el.remove());
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50" />;
}

export default function SuccessScreen({ name }) {
  return (
    <>
      <Confetti />
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fadeIn">
        <div className="text-6xl mb-6" style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.8))' }}>
          🎉
        </div>

        <GlassCard className="p-8 max-w-md mx-auto">
          <div
            className="text-4xl font-serif mb-3 text-gold-shimmer"
            style={{ fontFamily: 'Cormorant Garamond, serif', background: 'linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmer 3s linear infinite' }}
          >
            We'll see you there!
          </div>

          <p className="text-cream/80 text-base mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Thank you, <span className="text-gold font-semibold">{name}</span>.
          </p>
          <p className="text-cream/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            Your RSVP has been received. We look forward to celebrating with you on{' '}
            <span className="text-gold">13th June 2026</span>.
          </p>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(212,175,55,0.2)' }}>
            <p className="text-cream/40 text-xs tracking-widest uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
              Pastor Joseph & Olukemi Oluniyi
            </p>
            <p className="text-gold/60 text-xs mt-1 tracking-widest uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
              60th Birthday Celebration
            </p>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
