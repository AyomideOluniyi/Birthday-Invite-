/**
 * Lazy-loaded Spline 3D scene wrapper.
 * Uses React.Suspense so the heavy @splinetool/react-spline bundle only loads
 * when this component is actually rendered.
 *
 * Usage:
 *   <SplineScene scene="https://prod.spline.design/xxx/scene.splinecode" />
 */
import { Suspense, lazy } from 'react'
import { cn } from '@/lib/utils'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

function SplineLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        className="animate-spin h-8 w-8 text-primary opacity-70"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading 3D scene"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense fallback={<SplineLoader />}>
      <Spline scene={scene} className={cn('w-full h-full', className)} />
    </Suspense>
  )
}
