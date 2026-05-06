import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    id: 1,
    title: 'Neural Commerce',
    category: 'Full-Stack / AI',
    year: '2024',
    description:
      'AI-powered e-commerce platform with real-time personalization engine and 3D product visualization.',
    tech: ['Next.js', 'Three.js', 'OpenAI', 'Stripe'],
    color: '#00FFB2',
    gradient: 'from-neon/20 to-violet/10',
    index: '01',
  },
  {
    id: 2,
    title: 'Spatial OS',
    category: 'Interface Design / WebXR',
    year: '2024',
    description:
      'Operating system interface concept for spatial computing â€” built for Apple Vision Pro browser environment.',
    tech: ['React', 'WebXR', 'GSAP', 'Zustand'],
    color: '#7B61FF',
    gradient: 'from-violet/20 to-neon/10',
    index: '02',
  },
  {
    id: 3,
    title: 'BioSync',
    category: 'Data Viz / Health Tech',
    year: '2023',
    description:
      'Real-time biometric data visualization dashboard with predictive health analytics and immersive 3D graphs.',
    tech: ['D3.js', 'R3F', 'Python', 'FastAPI'],
    color: '#00FFB2',
    gradient: 'from-neon/15 to-transparent',
    index: '03',
  },
  {
    id: 4,
    title: 'ArchMind',
    category: 'AI / Architecture',
    year: '2023',
    description:
      'Generative architecture tool using diffusion models to create 3D building concepts from text prompts.',
    tech: ['Python', 'Stable Diffusion', 'Blender API', 'React'],
    color: '#7B61FF',
    gradient: 'from-violet/20 to-transparent',
    index: '04',
  },
  {
    id: 5,
    title: 'SoundScape',
    category: 'Audio / Creative',
    year: '2023',
    description:
      'Web-based spatial audio experience â€” sound reacts to 3D scene with procedural music generation.',
    tech: ['Tone.js', 'Web Audio API', 'Three.js', 'GLSL'],
    color: '#00FFB2',
    gradient: 'from-neon/20 to-violet/5',
    index: '05',
  },
  {
    id: 6,
    title: 'ChainVault',
    category: 'Web3 / Finance',
    year: '2022',
    description:
      'Decentralized portfolio tracker with real-time on-chain analytics and predictive DeFi yield modeling.',
    tech: ['Ethers.js', 'The Graph', 'Next.js', 'Recharts'],
    color: '#7B61FF',
    gradient: 'from-violet/15 to-transparent',
    index: '06',
  },
]

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60, rotateX: 8 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          delay: (index % 3) * 0.1,
        }
      )
    })

    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={cardRef}
      className="project-card group relative rounded-2xl overflow-hidden"
      style={{ opacity: 0, transformStyle: 'preserve-3d' }}
    >
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${project.color}08 0%, transparent 60%)`,
          border: `1px solid ${project.color}15`,
        }}
      />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${project.color}10 0%, transparent 70%)`,
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${project.color}60, transparent)`,
        }}
      />

      <div className="relative z-10 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span
              className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2 block"
              style={{ color: `${project.color}80` }}
            >
              {project.index}
            </span>
            <span
              className="font-mono text-[10px] tracking-widest uppercase"
              style={{ color: `${project.color}60` }}
            >
              {project.category}
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/20">{project.year}</span>
        </div>

        <div
          className="w-full h-36 rounded-xl mb-6 overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, ${project.color}06 0%, rgba(123,97,255,0.05) 100%)`,
            border: `1px solid ${project.color}12`,
          }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(${project.color}15 1px, transparent 1px),
                linear-gradient(90deg, ${project.color}15 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                ${project.color}03 2px,
                ${project.color}03 4px
              )`,
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center
                group-hover:scale-110 transition-transform duration-500"
              style={{
                background: `${project.color}15`,
                border: `1px solid ${project.color}30`,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke={project.color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
          style={{
            backgroundImage: `linear-gradient(90deg, ${project.color}, #7B61FF)`,
            WebkitBackgroundClip: 'text',
          }}
        >
          {project.title}
        </h3>

        <p className="font-ui text-sm text-white/40 leading-relaxed mb-6">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] px-2.5 py-1 rounded-full tracking-wide"
              style={{
                background: `${project.color}0a`,
                border: `1px solid ${project.color}20`,
                color: `${project.color}80`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
          <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: project.color }}>
            View Project
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke={project.color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-[5vw] md:px-[8vw]"
      style={{
        background: 'linear-gradient(180deg, #080808 0%, #0a080f 50%, #080808 100%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 80% 30%, rgba(123,97,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div ref={headingRef} className="mb-20 max-w-3xl" style={{ opacity: 0 }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-px bg-neon/50" />
          <span className="font-mono text-[10px] text-neon/60 tracking-[0.25em] uppercase">
            Selected Work
          </span>
        </div>
        <h2 className="font-display text-5xl md:text-7xl font-bold text-white leading-none mb-6">
          Projects
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(90deg, #00FFB2, #7B61FF)' }}
          >
            That Matter
          </span>
        </h2>
        <p className="font-ui text-white/40 text-lg max-w-md leading-relaxed">
          A collection of work spanning AI interfaces, immersive 3D experiences,
          and spatial computing experiments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      <div className="mt-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-neon/30 to-transparent" />
          <span className="font-mono text-[10px] text-white/20 tracking-widest">
            {PROJECTS.length} Projects Total
          </span>
        </div>
        <button
          className="font-mono text-xs text-neon/60 hover:text-neon tracking-widest uppercase
            flex items-center gap-2 transition-colors duration-300"
          data-cursor-hover
        >
          Archive
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </section>
  )
}
