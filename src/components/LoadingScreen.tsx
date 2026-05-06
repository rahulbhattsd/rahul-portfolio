import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useStore } from '../store/useStore'

export default function LoadingScreen() {
  const screenRef = useRef<HTMLDivElement>(null)
  const { isLoaded, setIsLoaded } = useStore()

  useEffect(() => {
    // Simulate asset loading (replace with actual asset loading progress)
    const timer = setTimeout(() => setIsLoaded(true), 2400)
    return () => clearTimeout(timer)
  }, [setIsLoaded])

  useEffect(() => {
    if (!isLoaded || !screenRef.current) return

    gsap.to(screenRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        if (screenRef.current) screenRef.current.style.display = 'none'
      },
    })
  }, [isLoaded])

  return (
    <div ref={screenRef} className="loading-screen">
      {/* Logo mark */}
      <div className="relative w-16 h-16 mb-8">
        <div
          className="absolute inset-0 border border-neon/30 rotate-45"
          style={{ animation: 'spin 3s linear infinite' }}
        />
        <div
          className="absolute inset-[4px] border border-violet/30 -rotate-45"
          style={{ animation: 'spin 2s linear infinite reverse' }}
        />
        <div className="absolute inset-[8px] bg-neon/10 rotate-45" />
      </div>

      {/* Brand name */}
      <div className="font-display text-lg font-bold tracking-[0.4em] text-white/80 mb-8 uppercase">
        Portfolio
      </div>

      {/* Loading bar */}
      <div className="loading-bar" />

      {/* Status text */}
      <div className="font-mono text-[10px] text-white/25 tracking-[0.2em] mt-4 uppercase">
        Initializing 3D Environment...
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(45deg); }
          to { transform: rotate(405deg); }
        }
      `}</style>
    </div>
  )
}