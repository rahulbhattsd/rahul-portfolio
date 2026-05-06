import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export default function ScrollProgress() {
  const { scrollProgress, setScrollProgress, activeSection, setActiveSection } = useStore()

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? window.scrollY / total : 0
      setScrollProgress(progress)

      // Detect active section
      const sections = ['hero', 'work', 'contact']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
          setActiveSection(id)
          break
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [setScrollProgress, setActiveSection])

  return (
    <>
      {/* Top progress bar */}
      <div
        className="fixed top-0 left-0 z-[60] h-px origin-left transition-transform"
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, #00FFB2, #7B61FF)',
          transform: `scaleX(${scrollProgress})`,
          transformOrigin: 'left',
          boxShadow: '0 0 8px rgba(0,255,178,0.4)',
        }}
      />

      {/* Side indicator dots */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-3">
        {['hero', 'work', 'contact'].map((section) => (
          <button
            key={section}
            onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-2"
            data-cursor-hover
          >
            <span
              className="font-mono text-[8px] text-white/20 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {section}
            </span>
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: activeSection === section ? '20px' : '4px',
                height: activeSection === section ? '4px' : '4px',
                background: activeSection === section ? '#00FFB2' : 'rgba(255,255,255,0.2)',
                boxShadow: activeSection === section ? '0 0 8px rgba(0,255,178,0.5)' : 'none',
              }}
            />
          </button>
        ))}
      </div>
    </>
  )
}
