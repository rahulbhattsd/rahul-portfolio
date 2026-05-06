import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import OrbScene from './OrbScene'

const ROLE_WORDS = ['Designer', 'Developer', 'Creator', 'Engineer']

export default function HeroSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLSpanElement>(null)
  const roleIndexRef = useRef(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      tl.fromTo(
        '.hero-line',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: 'expo.out' }
      )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' },
          '-=0.7'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
          '-=0.6'
        )
        .fromTo(
          scrollHintRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.2'
        )
    }, headingRef)

    const interval = setInterval(() => {
      if (!roleRef.current) return
      gsap.to(roleRef.current, {
        opacity: 0,
        y: -8,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          roleIndexRef.current = (roleIndexRef.current + 1) % ROLE_WORDS.length
          if (roleRef.current) {
            roleRef.current.textContent = ROLE_WORDS[roleIndexRef.current]
          }
          gsap.fromTo(
            roleRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
          )
        },
      })
    }, 2500)

    return () => {
      ctx.revert()
      clearInterval(interval)
    }
  }, [])

  const scrollToWork = () => {
    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden"
      style={{ background: '#080808' }}
    >
      <div className="absolute inset-0 z-0">
        <OrbScene />
      </div>

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 30%, rgba(8,8,8,0.6) 80%, rgba(8,8,8,0.95) 100%)',
        }}
      />

      <div
        ref={headingRef}
        className="absolute inset-0 z-10 flex flex-col justify-center px-[5vw] md:px-[8vw] pointer-events-none"
      >
        <div className="flex items-center gap-3 mb-8 overflow-hidden">
          <div className="hero-line glass-panel px-4 py-2 rounded-full flex items-center gap-2 w-fit pointer-events-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
            <span className="font-mono text-[10px] text-neon/70 tracking-[0.2em] uppercase">
              Available for Projects
            </span>
          </div>
        </div>

        <div className="overflow-hidden mb-2">
          <h1 className="hero-line font-display text-hero font-bold leading-none text-white">
            Creative
          </h1>
        </div>
        <div className="overflow-hidden mb-2 flex items-baseline gap-4">
          <h1 className="hero-line font-display text-hero font-bold leading-none">
            <span className="text-transparent bg-clip-text" style={{
              backgroundImage: 'linear-gradient(135deg, #00FFB2 0%, #7B61FF 100%)'
            }}>
              <span ref={roleRef}>{ROLE_WORDS[0]}</span>
            </span>
          </h1>
        </div>
        <div className="overflow-hidden mb-8">
          <h1 className="hero-line font-display text-hero font-bold leading-none text-white/90">
            & Engineer
          </h1>
        </div>

        <p
          ref={subtextRef}
          className="font-ui text-subhero text-white/40 max-w-md leading-relaxed mb-10"
          style={{ opacity: 0 }}
        >
          Crafting immersive digital experiences at the intersection of design, technology,
          and spatial computing.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-wrap items-center gap-4"
          style={{ opacity: 0 }}
        >
          <button
            onClick={scrollToWork}
            className="
              pointer-events-auto relative group
              px-7 py-3.5 rounded-full
              font-mono text-xs tracking-widest uppercase
              text-void font-semibold
              overflow-hidden
              transition-all duration-300
            "
            style={{ background: 'linear-gradient(135deg, #00FFB2, #7B61FF)' }}
            data-cursor-hover
          >
            <span className="relative z-10">View Work</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>

          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="
              pointer-events-auto
              px-7 py-3.5 rounded-full
              glass-panel
              font-mono text-xs tracking-widest uppercase
              text-white/70 hover:text-neon
              border border-white/10 hover:border-neon/30
              transition-all duration-300
            "
            data-cursor-hover
          >
            Get In Touch
          </button>
        </div>

        <div className="mt-16 flex gap-10 overflow-hidden">
          {[
            { value: '5+', label: 'Years XP' },
            { value: '40+', label: 'Projects' },
            { value: 'âˆž', label: 'Coffee' },
          ].map((stat) => (
            <div key={stat.label} className="hero-line">
              <div className="font-display text-2xl font-bold text-neon">{stat.value}</div>
              <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 right-6 md:right-8 -translate-y-1/2 z-10 pointer-events-none hidden md:block">
        <div
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          className="font-mono text-[10px] text-white/20 tracking-[0.3em] uppercase"
        >
          Future Humanist Portfolio â€” 2024
        </div>
      </div>

      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <span className="font-mono text-[9px] text-white/25 tracking-[0.25em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-neon"
            style={{
              height: '40%',
              animation: 'scrollDrop 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollDrop {
          0% { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
