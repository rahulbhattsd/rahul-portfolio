import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind'], color: '#00FFB2' },
  { category: '3D & Creative', items: ['Three.js', 'R3F', 'Blender', 'GLSL', 'WebGL'], color: '#7B61FF' },
  { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'GraphQL'], color: '#00FFB2' },
  { category: 'Tools', items: ['Figma', 'GSAP', 'Docker', 'AWS'], color: '#7B61FF' },
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-item',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      )

      gsap.fromTo(
        '.skill-card',
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.skills-grid',
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
      id="about"
      ref={sectionRef}
      className="relative py-32 px-[5vw] md:px-[8vw] overflow-hidden"
      style={{ background: '#080808' }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,255,178,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,178,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <div className="flex items-center gap-4 mb-6 about-item">
            <div className="w-8 h-px bg-violet/50" />
            <span className="font-mono text-[10px] text-violet/60 tracking-[0.25em] uppercase">
              About Me
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-8 about-item">
            I craft digital
            <br />
            experiences that
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #7B61FF, #00FFB2)' }}
            >
              feel alive.
            </span>
          </h2>

          <div className="space-y-4 text-white/40 font-ui leading-relaxed">
            <p className="about-item">
              I'm a creative technologist and frontend engineer with 5+ years building
              products at the intersection of design, performance, and immersive technology.
            </p>
            <p className="about-item">
              My work spans AI-driven interfaces, spatial computing experiments, and
              high-performance web applications that push what's possible in the browser.
            </p>
            <p className="about-item">
              When I'm not building, I'm exploring the boundaries of generative art,
              WebGL shaders, and the future of human-computer interaction.
            </p>
          </div>

          <div
            className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-full about-item"
            style={{
              background: 'rgba(0,255,178,0.05)',
              border: '1px solid rgba(0,255,178,0.15)',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span className="font-mono text-xs text-neon/70 tracking-wider">
              Open to new opportunities
            </span>
          </div>
        </div>

        <div className="skills-grid grid grid-cols-2 gap-4">
          {SKILLS.map((group) => (
            <div
              key={group.category}
              className="skill-card rounded-2xl p-6"
              style={{
                background: `${group.color}04`,
                border: `1px solid ${group.color}12`,
                opacity: 0,
              }}
            >
              <div
                className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4"
                style={{ color: `${group.color}60` }}
              >
                {group.category}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="font-ui text-sm text-white/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div
            className="skill-card col-span-2 rounded-2xl p-6 flex justify-around"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              opacity: 0,
            }}
          >
            {[
              { n: '5+', label: 'Years' },
              { n: '40+', label: 'Projects' },
              { n: '12+', label: 'Clients' },
              { n: 'âˆž', label: 'Ideas' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-display text-3xl font-bold text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #00FFB2, #7B61FF)' }}
                >
                  {s.n}
                </div>
                <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
