/**
 * Birthday invite — interactive 3D section.
 * Placed between the "60" chapter and the event details.
 * Replace the scene URL with any Spline scene you publish.
 */
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'

const SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

export function SplineSection() {
  return (
    <section
      aria-label="Interactive 3D experience"
      style={{
        padding: 'clamp(1rem, 4vw, 2rem)',
        background: 'linear-gradient(180deg, #0c0c1e 0%, #0a0a18 100%)',
      }}
    >
      <Card className="w-full h-[520px] md:h-[580px] bg-black/[0.96] relative overflow-hidden border-[rgba(212,175,55,0.18)]">
        {/* Aceternity spotlight beam */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="rgba(212,175,55,0.6)"
        />

        <div className="flex flex-col md:flex-row h-full">
          {/* ── Left: invite copy ───────────────────────── */}
          <div className="flex-1 p-8 md:p-10 relative z-10 flex flex-col justify-center">
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                color: 'rgba(212,175,55,0.6)',
                marginBottom: '1rem',
              }}
            >
              13th June 2026
            </p>

            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: 300,
                fontSize: 'clamp(2.4rem, 6vw, 3.6rem)',
                lineHeight: 1.05,
                background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #B8962E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
              }}
            >
              Join the<br />Celebration
            </h2>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(0.82rem, 2vw, 0.95rem)',
                color: 'rgba(255,248,231,0.5)',
                lineHeight: 1.7,
                maxWidth: '30ch',
              }}
            >
              An evening of joy, gratitude, and togetherness as we mark six remarkable decades.
            </p>

            {/* Gold rule */}
            <div
              style={{
                marginTop: '1.8rem',
                height: 1,
                width: 80,
                background: 'linear-gradient(90deg, #D4AF37, transparent)',
              }}
            />
            <p
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontSize: '0.9rem',
                color: 'rgba(255,248,231,0.35)',
                marginTop: '0.9rem',
              }}
            >
              Pastor Joseph &amp; Olukemi Oluniyi
            </p>
          </div>

          {/* ── Right: 3D Spline scene ──────────────────── */}
          <div className="flex-1 relative min-h-[240px]">
            <SplineScene
              scene={SCENE_URL}
              className="absolute inset-0 w-full h-full"
            />
            {/* Subtle fade at left edge to blend with text panel */}
            <div
              className="absolute inset-y-0 left-0 w-16 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
              }}
            />
          </div>
        </div>
      </Card>
    </section>
  )
}
