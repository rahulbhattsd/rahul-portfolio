import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

const NAV_ITEMS = [
  { id: 'hero', label: '01 / Home', href: '#hero' },
  { id: 'work', label: '02 / Work', href: '#work' },
  { id: 'contact', label: '03 / Contact', href: '#contact' },
]

export default function Navigation() {
  const { activeSection, menuOpen, setMenuOpen } = useStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      {/* ── Desktop Nav ─────────────────────────────────────── */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 px-8 py-6
          flex items-center justify-between
          transition-all duration-500
          ${scrolled ? 'py-4' : ''}
        `}
        style={{
          background: scrolled ? 'rgba(8,8,8,0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        {/* Logo mark */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollTo('#hero') }}
          className="relative flex items-center gap-3 group"
          data-cursor-hover
        >
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 border border-neon/40 rotate-45 group-hover:rotate-90 transition-transform duration-700" />
            <div className="absolute inset-[5px] bg-neon/20 rotate-45 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <span
            className="font-display text-sm font-bold tracking-widest text-white/80 group-hover:text-neon transition-colors duration-300"
            style={{ letterSpacing: '0.25em' }}
          >
            FOLIO
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.href)}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                data-cursor-hover
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <span className="font-mono text-xs text-white/30 tracking-widest">
            AVAILABLE FOR WORK
          </span>
          <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          data-cursor-hover
        >
          <span
            className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}
          />
          <span
            className={`block w-4 h-px bg-white/60 transition-all duration-300 ${menuOpen ? 'opacity-0 w-0' : ''}`}
          />
          <span
            className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}
          />
        </button>
      </nav>

      {/* ── Mobile Menu ──────────────────────────────────────── */}
      <div
        className={`
          fixed inset-0 z-40 flex flex-col items-center justify-center
          transition-all duration-500
          ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <ul className="flex flex-col items-center gap-8">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id} style={{ animationDelay: `${i * 0.1}s` }}>
              <button
                onClick={() => scrollTo(item.href)}
                className={`font-display text-4xl font-bold tracking-wide transition-colors duration-300
                  ${activeSection === item.id ? 'text-neon' : 'text-white/60 hover:text-white'}`}
                data-cursor-hover
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-12 flex items-center gap-3">
          <span className="font-mono text-xs text-white/30">LET'S BUILD SOMETHING</span>
          <div className="w-1.5 h-1.5 rounded-full bg-neon" />
        </div>
      </div>
    </>
  )
}
