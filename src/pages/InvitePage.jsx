import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RSVPForm from '../components/rsvp/RSVPForm';
import GoldParticles from '../components/ui/GoldParticles';

gsap.registerPlugin(ScrollTrigger);

/* ─── tiny helpers ──────────────────────────────────────────── */
const G = '#D4AF37';
const CREAM = '#FFF8E7';

function GoldLine({ className = '' }) {
  return (
    <svg viewBox="0 0 320 12" fill="none" className={className} aria-hidden="true">
      <line x1="0" y1="6" x2="138" y2="6" stroke={G} strokeWidth="0.8" strokeOpacity="0.5" />
      <circle cx="148" cy="6" r="2" fill={G} fillOpacity="0.65" />
      <circle cx="160" cy="6" r="5" fill="none" stroke={G} strokeWidth="1.2" strokeOpacity="0.8" />
      <circle cx="172" cy="6" r="2" fill={G} fillOpacity="0.65" />
      <line x1="182" y1="6" x2="320" y2="6" stroke={G} strokeWidth="0.8" strokeOpacity="0.5" />
    </svg>
  );
}

function Tag({ children }) {
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.68rem',
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      color: 'rgba(212,175,55,0.75)',
      fontWeight: 400,
    }}>
      {children}
    </p>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function InvitePage() {
  const rootRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let mouseMoveHandler = null;

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {

        /* ══ 0. MOUSE PARALLAX ══════════════════════════════════ */
        mouseMoveHandler = (e) => {
          const x = e.clientX / window.innerWidth - 0.5;   // -0.5 → 0.5
          const y = e.clientY / window.innerHeight - 0.5;

          // Photo drifts opposite to cursor → feels like depth
          gsap.to('#hero-photo', {
            x: x * -38, y: y * -22,
            duration: 1.6, ease: 'power2.out', overwrite: 'auto',
          });
          // Text floats gently with cursor
          gsap.to('#hero-text', {
            x: x * 14, y: y * 8,
            duration: 1.8, ease: 'power2.out', overwrite: 'auto',
          });
          // Big "60" has its own subtle drift
          gsap.to('#num-sixty', {
            x: x * 18, y: y * 10,
            duration: 1.5, ease: 'power2.out', overwrite: 'auto',
          });
          // Glow orb follows cursor loosely
          gsap.to('.glow-orb', {
            x: x * 60, y: y * 40,
            duration: 2.2, ease: 'power1.out', overwrite: 'auto',
          });
        };
        window.addEventListener('mousemove', mouseMoveHandler);

        /* ══ 1. HERO ════════════════════════════════════════════ */

        // Photo parallax — image drifts up slower than scroll
        gsap.to('#hero-photo', {
          yPercent: 22,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        // Hero overlay darkens as you scroll away
        gsap.to('#hero-overlay', {
          opacity: 0.96,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: '30% top',
            end: 'bottom top',
            scrub: true,
          },
        });

        // Hero text — entrance stagger
        gsap.fromTo('#hero-text > *',
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0,
            duration: 1.3,
            stagger: 0.18,
            ease: 'power3.out',
            delay: 0.3,
          }
        );

        // Hero text floats up + fades as scroll starts
        gsap.to('#hero-text', {
          y: -80,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: '25% top',
            end: '65% top',
            scrub: true,
          },
        });

        /* ══ 2. SIXTY CHAPTER ════════════════════════════════════ */

        const TA = 'play reverse play reverse';

        // "60" scales up from nothing
        gsap.fromTo('#num-sixty',
          { opacity: 0, scale: 0.6, filter: 'blur(12px)' },
          {
            opacity: 1, scale: 1, filter: 'blur(0px)',
            duration: 1.6, ease: 'expo.out',
            scrollTrigger: { trigger: '#chapter-sixty', start: 'top 65%', toggleActions: TA },
          }
        );

        // Tagline clips in left-to-right
        gsap.fromTo('#sixty-tagline',
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.4, ease: 'power4.inOut',
            scrollTrigger: { trigger: '#chapter-sixty', start: 'top 55%', toggleActions: TA },
          }
        );

        // Name wipe in
        gsap.fromTo('#sixty-name',
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.4, ease: 'power4.inOut',
            scrollTrigger: { trigger: '#chapter-sixty', start: 'top 50%', toggleActions: TA },
          }
        );

        // Gold line expands from center
        gsap.fromTo('.sixty-line',
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1, opacity: 1,
            duration: 1.1, ease: 'power2.inOut',
            transformOrigin: 'center',
            scrollTrigger: { trigger: '#chapter-sixty', start: 'top 55%', toggleActions: TA },
          }
        );

        /* ══ 3. DETAILS CHAPTER ═══════════════════════════════════ */

        // Section label slides in
        gsap.fromTo('#details-label',
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0,
            duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: '#chapter-details', start: 'top 70%', toggleActions: TA },
          }
        );

        // Gold dividers — each placed explicitly on the timeline
        (() => {
          const dividers = gsap.utils.toArray('.detail-divider');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: '#chapter-details', start: 'top 65%', toggleActions: TA },
          });
          dividers.forEach((el, i) => {
            tl.fromTo(el,
              { scaleX: 0 },
              { scaleX: 1, duration: 1.2, ease: 'power2.inOut', transformOrigin: 'left' },
              i * 0.15
            );
          });
        })();

        // Detail blocks — each placed explicitly so stagger reverses cleanly
        (() => {
          const blocks = gsap.utils.toArray('.detail-block');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: '#chapter-details', start: 'top 60%', toggleActions: TA },
          });
          blocks.forEach((el, i) => {
            tl.fromTo(el,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
              i * 0.14
            );
          });
        })();

        /* ══ 4. QUOTE CHAPTER ════════════════════════════════════ */
        // Target the real text children inside the wrapper, not #chapter-quote > *
        (() => {
          const quoteEls = gsap.utils.toArray('#chapter-quote > div:last-child > *');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: '#chapter-quote', start: 'top 68%', toggleActions: TA },
          });
          quoteEls.forEach((el, i) => {
            tl.fromTo(el,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' },
              i * 0.2
            );
          });
        })();

        /* ══ 5. RSVP ═════════════════════════════════════════════ */
        gsap.fromTo('#rsvp-header > *',
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0,
            duration: 1, ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: { trigger: '#chapter-rsvp', start: 'top 70%', toggleActions: TA },
          }
        );

        gsap.fromTo('#rsvp-card',
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: '#chapter-rsvp', start: 'top 65%', toggleActions: TA },
          }
        );

      }, rootRef);

      return () => {
        ctx.revert();
        if (mouseMoveHandler) window.removeEventListener('mousemove', mouseMoveHandler);
      };
    });

    return () => mm.revert();
  }, []);

  /* ─── JSX ────────────────────────────────────────────────── */
  return (
    <div ref={rootRef} style={{ background: '#070712', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════════════════════ */}
      <section
        id="hero"
        style={{
          position: 'relative',
          height: '100svh',
          minHeight: 620,
          overflow: 'hidden',
        }}
      >
        {/* Photo */}
        <img
          id="hero-photo"
          src="/couple.jpeg"
          alt="Pastor Joseph and Olukemi Oluniyi"
          className="will-change-transform"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '115%',          /* extra height for parallax travel */
            objectFit: 'cover',
            objectPosition: 'center 22%',
            top: '-8%',
          }}
        />

        {/* Film-grain texture overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.03,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />

        {/* Cinematic gradient overlay */}
        <div
          id="hero-overlay"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: [
              'linear-gradient(to bottom, rgba(7,7,18,0.3) 0%, transparent 22%)',
              'linear-gradient(to top, rgba(7,7,18,1) 0%, rgba(7,7,18,0.88) 28%, rgba(7,7,18,0.18) 58%, transparent 80%)',
              'radial-gradient(ellipse at center, transparent 40%, rgba(7,7,18,0.45) 100%)',
            ].join(', '),
            opacity: 0.92,
          }}
        />

        {/* Particles */}
        <GoldParticles count={26} />

        {/* Text block — bottom left */}
        <div
          id="hero-text"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 'clamp(2rem,6vw,4rem)',
            paddingBottom: 'clamp(4.5rem,10vw,6rem)',
            maxWidth: 860,
          }}
        >
          <Tag>A Joyful Invitation</Tag>

          <h1
            className="gold-shimmer"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: 'clamp(4.8rem,15vw,10rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              margin: '0.7rem 0 0.9rem',
              textShadow: '0 4px 48px rgba(0,0,0,0.55)',
            }}
          >
            You're<br />Invited
          </h1>

          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(1.2rem,3.5vw,1.7rem)',
            color: 'rgba(255,248,231,0.92)',
            marginBottom: '0.55rem',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}>
            Pastor Joseph &amp; Olukemi Oluniyi
          </p>

          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.78)',
            fontWeight: 400,
          }}>
            60th Birthday Celebration
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: 'clamp(1.5rem,5vw,3rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            animation: 'float-arrow 2.2s ease-in-out infinite',
          }}
        >
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.5rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.45)',
            writingMode: 'vertical-rl',
          }}>
            scroll
          </span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M6 1v14M1 11l5 7 5-7"
              stroke="#D4AF37" strokeWidth="1.4"
              strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 2  SIXTY CHAPTER
      ══════════════════════════════════════════════════════ */}
      <section
        id="chapter-sixty"
        style={{
          position: 'relative',
          padding: 'clamp(6rem,14vw,10rem) clamp(1.5rem,5vw,3rem)',
          background: 'linear-gradient(180deg, #070712 0%, #0c0c1e 100%)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow behind the number — follows cursor */}
        <div aria-hidden="true" className="glow-orb" style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '70vw', height: '60vh',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 68%)',
          pointerEvents: 'none',
          willChange: 'transform',
        }} />

        {/* Big "60" */}
        <div
          id="num-sixty"
          className="gold-shimmer will-change-transform"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 300,
            fontSize: 'clamp(9rem, 34vw, 22rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            marginBottom: '1.2rem',
            opacity: 0,
          }}
        >
          60
        </div>

        {/* Tagline */}
        <p
          id="sixty-tagline"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(0.68rem, 1.6vw, 0.82rem)',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.8)',
            marginBottom: '1.8rem',
            fontWeight: 400,
            clipPath: 'inset(0 100% 0 0)',
          }}
        >
          A Celebration of Life &amp; Gratitude
        </p>

        {/* Gold ornament */}
        <div className="sixty-line" style={{
          maxWidth: 320, margin: '0 auto 1.8rem',
          opacity: 0,
        }}>
          <GoldLine className="w-full" />
        </div>

        {/* Name */}
        <h2
          id="sixty-name"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: 'clamp(1.65rem, 5.5vw, 2.9rem)',
            color: CREAM,
            letterSpacing: '0.08em',
            clipPath: 'inset(0 100% 0 0)',
          }}
        >
          Pastor Joseph &amp; Olukemi Oluniyi
        </h2>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 3  DETAILS CHAPTER
      ══════════════════════════════════════════════════════ */}
      <section
        id="chapter-details"
        style={{
          position: 'relative',
          padding: 'clamp(5rem,12vw,8rem) clamp(1.5rem,6vw,5rem)',
          background: 'linear-gradient(180deg, #0c0c1e 0%, #0a0a18 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Vertical gold accent line — left side */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          left: 'clamp(1rem, 3vw, 2.5rem)',
          top: '10%', bottom: '10%',
          width: 1,
          background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.3), transparent)',
        }} />

        {/* Centred content wrapper */}
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Section label */}
        <p id="details-label" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.7rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(212,175,55,0.78)',
          fontWeight: 400,
          marginBottom: 'clamp(3rem,8vw,5rem)',
          opacity: 0,
        }}>
          The Celebration
        </p>

        {/* Detail grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'clamp(3rem,8vw,5rem) clamp(2rem,6vw,4rem)',
        }}>
          {[
            { label: 'Date', value: 'Saturday', sub: '13th June 2026' },
            { label: 'Time', value: '4:00 PM', sub: 'Prompt arrival appreciated' },
            { label: 'Venue', value: "St Peter's Church Hall", sub: 'Hopeville Avenue, Broadstairs CT10 2TR' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="detail-block" style={{ opacity: 0 }}>
              <Tag>{label}</Tag>
              <div className="detail-divider" style={{
                height: 1,
                background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)',
                margin: '0.55rem 0 0.75rem',
                transformOrigin: 'left',
              }} />
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 500,
                fontSize: 'clamp(1.65rem,4.5vw,2.2rem)',
                color: CREAM,
                lineHeight: 1.2,
                marginBottom: '0.5rem',
              }}>
                {value}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem',
                color: 'rgba(255,248,231,0.62)',
                lineHeight: 1.65,
                fontWeight: 300,
              }}>
                {sub}
              </p>
            </div>
          ))}
        </div>

        </div>{/* end centred wrapper */}
      </section>

      {/* ══════════════════════════════════════════════════════
          § 4  QUOTE CHAPTER
      ══════════════════════════════════════════════════════ */}
      <section
        id="chapter-quote"
        style={{
          position: 'relative',
          padding: 'clamp(5rem,12vw,8rem) clamp(1.5rem,8vw,8rem)',
          background: 'linear-gradient(180deg, #0a0a18 0%, #080814 100%)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(183,110,121,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
          {/* Opening quote mark */}
          <p aria-hidden="true" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(4rem,12vw,7rem)',
            color: 'rgba(212,175,55,0.15)',
            lineHeight: 0.8,
            marginBottom: '-1rem',
            fontWeight: 300,
          }}>
            "
          </p>

          <blockquote style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(1.45rem,4.5vw,2.1rem)',
            lineHeight: 1.7,
            color: 'rgba(255,248,231,0.9)',
            marginBottom: '2.4rem',
            letterSpacing: '0.01em',
          }}>
            Sixty years of grace, laughter, and love.
            <br />We invite you to celebrate with us.
          </blockquote>

          <div style={{ maxWidth: 220, margin: '0 auto 1.6rem' }}>
            <GoldLine className="w-full" />
          </div>

          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.68rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.7)',
            fontWeight: 400,
          }}>
            Pastor Joseph &amp; Olukemi Oluniyi
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          § 5  RSVP
      ══════════════════════════════════════════════════════ */}
      <section
        id="chapter-rsvp"
        style={{
          position: 'relative',
          padding: 'clamp(4rem,10vw,7rem) clamp(1rem,4vw,2rem) clamp(5rem,12vw,8rem)',
          background: 'linear-gradient(180deg, #080814 0%, #070712 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          bottom: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw', height: '60vh',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.055) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* RSVP card */}
        <div id="rsvp-card" style={{ maxWidth: 600, margin: '0 auto', opacity: 0 }}>
          <div className="glass" style={{
            borderRadius: 16,
            padding: 'clamp(1.8rem,5vw,2.8rem)',
          }}>
            {/* Header */}
            <div id="rsvp-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Tag>Kindly RSVP</Tag>
              <h2
                className="gold-shimmer"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: 'clamp(2.4rem,7.5vw,3.5rem)',
                  lineHeight: 1,
                  marginTop: '0.55rem',
                  letterSpacing: '-0.01em',
                  opacity: 0,
                }}
              >
                Reserve Your Place
              </h2>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.78rem',
                color: 'rgba(255,248,231,0.52)',
                marginTop: '0.6rem',
                letterSpacing: '0.04em',
                opacity: 0,
              }}>
                We look forward to celebrating with you
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(212,175,55,0.3)',
                  background: 'rgba(212,175,55,0.07)',
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <circle cx="6" cy="6" r="5.25" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.7"/>
                    <text x="6" y="8.5" textAnchor="middle" fill="#D4AF37" fontSize="5.5" fontFamily="Inter,sans-serif" fontWeight="600" opacity="0.9">!</text>
                  </svg>
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(212,175,55,0.8)',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}>
                    18+ only
                  </span>
                </div>
              </div>
            </div>

            <RSVPForm embedded />
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <div style={{
            height: 1, width: 80, margin: '0 auto 1.2rem',
            background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)',
          }} />
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,248,231,0.32)',
            fontWeight: 300,
          }}>
            St Peter's Church Hall · Hopeville Avenue · Broadstairs CT10 2TR
          </p>
        </div>
      </section>
    </div>
  );
}
