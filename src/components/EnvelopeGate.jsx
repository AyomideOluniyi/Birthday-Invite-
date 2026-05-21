import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const GOLD  = '#D4AF37';
const CREAM = '#FFF8E7';

/* ── Wax seal ───────────────────────────────────────────────── */
function WaxSeal() {
  return (
    <svg viewBox="0 0 72 72" fill="none" width="72" height="72" aria-hidden="true">
      <circle cx="36" cy="36" r="34" fill="#5a0f0f" stroke={GOLD} strokeWidth="1.4" />
      <circle cx="36" cy="36" r="27" fill="none" stroke="rgba(212,175,55,0.35)" strokeWidth="0.7" strokeDasharray="2.5 2.5" />
      <circle cx="36" cy="36" r="20" fill="#6e1212" />
      <text
        x="36" y="43"
        textAnchor="middle"
        fontFamily="Playfair Display, serif"
        fontSize="20" fontWeight="700"
        fill="#F0D060"
      >
        JO
      </text>
    </svg>
  );
}

/* ── Corner accent ──────────────────────────────────────────── */
function Corner({ top, right, bottom, left }) {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute',
      top, right, bottom, left,
      width: 16, height: 16,
      borderTop:    top    != null ? '1px solid rgba(212,175,55,0.38)' : 'none',
      borderBottom: bottom != null ? '1px solid rgba(212,175,55,0.38)' : 'none',
      borderLeft:   left   != null ? '1px solid rgba(212,175,55,0.38)' : 'none',
      borderRight:  right  != null ? '1px solid rgba(212,175,55,0.38)' : 'none',
    }} />
  );
}

/* ── EnvelopeGate ───────────────────────────────────────────── */
export default function EnvelopeGate({ onOpen }) {
  const overlayRef = useRef(null);
  const envRef     = useRef(null);
  const flapRef    = useRef(null);
  const cardRef    = useRef(null);
  const sealRef    = useRef(null);
  const hintRef    = useRef(null);
  const floatTl    = useRef(null);

  // Use a ref (not state) so the mouse handler reads the latest value instantly
  const openingRef = useRef(false);
  const [, forceUpdate] = useState(0); // only used to hide hint text visually

  /* ── idle float + mouse parallax tilt ── */
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      floatTl.current = gsap.timeline({ repeat: -1, yoyo: true });
      floatTl.current.to(envRef.current, {
        y: -18, rotateZ: 0.7, duration: 3.2, ease: 'sine.inOut',
      });

      const onMove = (e) => {
        // Guard with ref — immediately true when opening starts
        if (openingRef.current) return;
        const x = e.clientX / window.innerWidth  - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        gsap.to(envRef.current, {
          rotateY: x * 22,
          rotateX: y * -14,
          duration: 1.1,
          ease: 'power2.out',
          // No overwrite:'auto' — don't risk killing animation timeline tweens
        });
      };

      window.addEventListener('mousemove', onMove);

      return () => {
        floatTl.current?.kill();
        window.removeEventListener('mousemove', onMove);
      };
    });

    return () => mm.revert();
  }, []); // empty deps — openingRef.current handles the guard

  /* ── open sequence ── */
  const handleOpen = () => {
    if (openingRef.current) return;
    openingRef.current = true;   // immediate — prevents mouse handler re-entry
    forceUpdate(n => n + 1);     // trigger re-render to hide pointer cursor

    floatTl.current?.kill();
    gsap.killTweensOf(envRef.current);

    const tl = gsap.timeline();

    /* 1 — settle the envelope flat */
    tl.to(envRef.current, {
      y: 0, rotateZ: 0, rotateY: 0, rotateX: 8,
      duration: 0.45, ease: 'power3.out',
    });

    /* 2 — seal pops */
    tl.to(sealRef.current, {
      scale: 1.4, opacity: 0,
      duration: 0.32, ease: 'expo.in',
    }, '+=0.06');

    /* 3 — flap lifts open */
    tl.to(flapRef.current, {
      rotateX: -168,
      duration: 0.92, ease: 'power3.inOut',
    }, '-=0.08');

    /* 4 — hint fades (starts immediately) */
    tl.to(hintRef.current, {
      opacity: 0, y: 8, duration: 0.3,
    }, 0.1);

    /* 5 — card rises from inside the envelope */
    tl.to(cardRef.current, {
      y: '-118%', opacity: 1,
      duration: 0.72, ease: 'expo.out',
    }, '-=0.52');

    /* 6 — card expands into a portal (0.35s pause via offset) */
    tl.to(cardRef.current, {
      scale: 16, opacity: 0,
      duration: 0.62, ease: 'power3.in',
    }, '+=0.35');

    /* 7 — envelope dissolves */
    tl.to(envRef.current, {
      opacity: 0, scale: 0.88,
      duration: 0.4, ease: 'power2.in',
    }, '-=0.52');

    /* 8 — full overlay fades out → invitation revealed */
    tl.to(overlayRef.current, {
      opacity: 0, duration: 0.4,
      onComplete: onOpen,
    }, '-=0.28');
  };

  /* deterministic particle positions */
  const particles = Array.from({ length: 22 }, (_, i) => ({
    size:  1.5 + (i % 3) * 0.8,
    left:  `${4  + (i * 43) % 92}%`,
    top:   `${8  + (i * 57) % 84}%`,
    op:    0.12 + (i % 5) * 0.05,
    dur:   2.8  + (i % 4) * 0.9,
    delay: (i * 0.38) % 2.8,
  }));

  return (
    <div
      ref={overlayRef}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label="Open your invitation"
      onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'radial-gradient(ellipse at 50% 38%, #10102e 0%, #070712 65%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        cursor: openingRef.current ? 'default' : 'pointer',
        userSelect: 'none',
        perspective: '1400px',
      }}
    >
      {/* Gold dust particles */}
      {particles.map((p, i) => (
        <div key={i} aria-hidden="true" style={{
          position: 'absolute',
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: GOLD,
          opacity: p.op,
          left: p.left, top: p.top,
          animation: `particle-up ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        width: '65vw', height: '45vh',
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ════ ENVELOPE ════ */}
      <div
        ref={envRef}
        style={{
          position: 'relative',
          width:  'clamp(280px, 84vw, 520px)',
          height: 'clamp(196px, 59vw, 364px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Interior (revealed once flap lifts) */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 6, overflow: 'hidden',
          background: 'linear-gradient(155deg, #0e0e2a 0%, #0a0a1c 100%)',
          boxShadow: '0 36px 90px rgba(0,0,0,0.78), 0 0 0 1px rgba(212,175,55,0.18)',
        }}>
          {/* Left fold */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(220deg, #14143c 0%, #0c0c20 100%)',
            clipPath: 'polygon(0 0, 0 100%, 52% 50%)',
          }} />
          {/* Right fold */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(320deg, #14143c 0%, #0c0c20 100%)',
            clipPath: 'polygon(100% 0, 100% 100%, 48% 50%)',
          }} />
          {/* Bottom fold */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(0deg, #17174a 0%, #0e0e30 100%)',
            clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)',
          }} />
          {/* Crease lines */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `
              linear-gradient(to bottom right, transparent 49.4%, rgba(212,175,55,0.1) 50%, transparent 50.6%),
              linear-gradient(to bottom left,  transparent 49.4%, rgba(212,175,55,0.1) 50%, transparent 50.6%)
            `,
          }} />

          {/* Card that slides up */}
          <div ref={cardRef} style={{
            position: 'absolute',
            bottom: '-3%', left: '7%', right: '7%',
            height: '85%',
            background: 'linear-gradient(175deg, #0d0d26 0%, #080819 100%)',
            borderRadius: '5px 5px 0 0',
            border: '1px solid rgba(212,175,55,0.24)',
            borderBottom: 'none',
            boxShadow: '0 -8px 28px rgba(212,175,55,0.12)',
            opacity: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '0.55rem',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(0.4rem, 1.1vw, 0.5rem)',
              letterSpacing: '0.32em', textTransform: 'uppercase',
              color: 'rgba(212,175,55,0.72)', margin: 0,
            }}>
              13 · June · 2026
            </p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(0.78rem, 2.2vw, 1.05rem)',
              color: CREAM, margin: 0,
            }}>
              You're Invited
            </p>
            <div style={{
              width: 52, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)',
            }} />
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(0.36rem, 1vw, 0.44rem)',
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'rgba(255,248,231,0.36)', margin: 0,
            }}>
              Pastor Joseph &amp; Olukemi Oluniyi
            </p>
          </div>
        </div>

        {/* Front face */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, borderRadius: 6,
          background: 'linear-gradient(158deg, #10102e 0%, #0b0b1f 55%, #0a0a1c 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.2)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <Corner top={10}    left={12}  />
          <Corner top={10}    right={12} />
          <Corner bottom={10} left={12}  />
          <Corner bottom={10} right={12} />

          <div style={{ textAlign: 'center', marginTop: '1.8rem' }}>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
              fontSize: 'clamp(0.72rem, 2.1vw, 0.95rem)',
              color: 'rgba(255,248,231,0.55)',
              letterSpacing: '0.03em', marginBottom: '0.35rem',
            }}>
              To: Our Special Guest
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(0.4rem, 1.1vw, 0.5rem)',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(212,175,55,0.36)',
            }}>
              13 June 2026 · Broadstairs, Kent
            </p>
          </div>

          <div style={{
            position: 'absolute', bottom: 14, left: 20, right: 20,
            borderTop: '1px solid rgba(212,175,55,0.08)',
            paddingTop: 8, textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(0.34rem, 0.9vw, 0.42rem)',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(212,175,55,0.26)', margin: 0,
            }}>
              By Invitation Only
            </p>
          </div>
        </div>

        {/* Wax seal */}
        <div ref={sealRef} style={{
          position: 'absolute', bottom: '20%', left: '50%', zIndex: 2,
          transform: 'translateX(-50%)',
          filter: 'drop-shadow(0 5px 18px rgba(212,175,55,0.28))',
        }}>
          <WaxSeal />
        </div>

        {/* Top flap */}
        <div ref={flapRef} style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '54%',
          background: 'linear-gradient(175deg, #10102e 0%, #0d0d26 100%)',
          clipPath: 'polygon(0 0, 100% 0, 50% 72%)',
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
          zIndex: 3,
          boxShadow: 'inset 0 -1px 0 rgba(212,175,55,0.18)',
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(212,175,55,0.06) 0%, transparent 55%)',
          }} />
        </div>
      </div>

      {/* Tap hint */}
      <div ref={hintRef} style={{
        marginTop: 'clamp(1.8rem, 5vw, 2.6rem)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
      }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.65rem', letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(212,175,55,0.65)', margin: 0,
        }}>
          Tap to open
        </p>
      </div>
    </div>
  );
}
