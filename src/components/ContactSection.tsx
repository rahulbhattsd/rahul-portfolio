import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID' // Replace with your ID

const TERMINAL_BOOT = [
  '> Initializing contact protocol...',
  '> Establishing secure channel...',
  '> Connection established. Ready.',
]

type TerminalFieldProps = {
  label: string
  name: string
  type?: string
  multiline?: boolean
  value: string
  focused: string | null
  onFocusChange: (name: string | null) => void
  onChange: (v: string) => void
}

function TerminalField({
  label,
  name,
  type = 'text',
  multiline = false,
  value,
  focused,
  onFocusChange,
  onChange,
}: TerminalFieldProps) {
  const isFocused = focused === name

  return (
    <div
      className={`relative rounded-xl transition-all duration-300 ${
        isFocused ? 'shadow-neon' : ''
      }`}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${isFocused ? 'rgba(0,255,178,0.3)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <div className="px-5 pt-4 pb-1">
        <div className="terminal-label">
          <span className="text-neon/40">~/</span>
          {label}
          {isFocused && (
            <span className="ml-1 inline-block w-1.5 h-3 bg-neon animate-cursor-blink" />
          )}
        </div>
      </div>
      {multiline ? (
        <textarea
          className="terminal-input px-5 pb-4 resize-none"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => onFocusChange(name)}
          onBlur={() => onFocusChange(null)}
          required
        />
      ) : (
        <input
          className="terminal-input px-5 pb-4"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => onFocusChange(name)}
          onBlur={() => onFocusChange(null)}
          required
        />
      )}
    </div>
  )
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const { setFormStatus, formStatus, pulseOrb } = useStore()

  const [bootLines, setBootLines] = useState<string[]>([])
  const [booted, setBooted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          let i = 0
          const interval = setInterval(() => {
            setBootLines((prev) => [...prev, TERMINAL_BOOT[i]])
            i++
            if (i >= TERMINAL_BOOT.length) {
              clearInterval(interval)
              setTimeout(() => setBooted(true), 400)
            }
          }, 500)
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('sending')
    pulseOrb()

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setFormStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }

    setTimeout(() => setFormStatus('idle'), 4000)
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-[5vw] md:px-[8vw] flex flex-col justify-center"
      style={{
        background: 'linear-gradient(180deg, #080808 0%, #09090f 100%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 10% 80%, rgba(0,255,178,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="contact-heading" style={{ opacity: 0 }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-neon/50" />
            <span className="font-mono text-[10px] text-neon/60 tracking-[0.25em] uppercase">
              Get In Touch
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-none mb-8">
            Let's Build
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #00FFB2, #7B61FF)' }}
            >
              Something
            </span>
            <br />
            <span className="text-white/20">Together</span>
          </h2>

          <p className="font-ui text-white/40 text-lg leading-relaxed mb-10 max-w-sm">
            Whether it's a complex 3D interface, an AI-powered product, or a creative
            experiment â€” I'm always open to meaningful collaborations.
          </p>

          <div className="flex flex-col gap-4">
            {[
              {
                label: 'Email',
                value: 'rahulbhatt.tech@gmail.com',
                icon: (
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ),
              },
              {
                label: 'Location',
                value: 'India / Remote',
                icon: (
                  <path
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ),
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(0,255,178,0.06)',
                    border: '1px solid rgba(0,255,178,0.15)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" className="text-neon/60">
                    {item.icon}
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-white/25 tracking-wider uppercase">
                    {item.label}
                  </div>
                  <div className="font-ui text-sm text-white/60">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-10">
            {[
              { label: 'GitHub', href: 'https://github.com/rahulbhattsd' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/rahulbhatt-developer' },
              { label: 'Email', href: 'mailto:rahulbhatt.tech@gmail.com' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="font-mono text-[10px] text-white/30 hover:text-neon tracking-widest uppercase transition-colors duration-300"
                data-cursor-hover
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div ref={terminalRef} className="mb-6">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: 'rgba(0,255,178,0.02)',
                border: '1px solid rgba(0,255,178,0.1)',
              }}
            >
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: '1px solid rgba(0,255,178,0.08)' }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neon/30" />
                </div>
                <span className="font-mono text-[10px] text-white/20 ml-2 tracking-wider">
                  contact.sh
                </span>
              </div>

              <div className="px-4 py-3 min-h-[80px]">
                {bootLines.map((line, i) => (
                  <div key={i} className="font-mono text-xs text-neon/50 leading-relaxed">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {booted && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <TerminalField
                label="name"
                name="name"
                value={form.name}
                focused={focused}
                onFocusChange={setFocused}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              />
              <TerminalField
                label="email"
                name="email"
                type="email"
                value={form.email}
                focused={focused}
                onFocusChange={setFocused}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              />
              <TerminalField
                label="message"
                name="message"
                multiline
                value={form.message}
                focused={focused}
                onFocusChange={setFocused}
                onChange={(v) => setForm((f) => ({ ...f, message: v }))}
              />

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="relative group mt-2 w-full py-4 rounded-xl font-mono text-xs tracking-widest uppercase overflow-hidden transition-all duration-300"
                style={{
                  background:
                    formStatus === 'success'
                      ? 'rgba(0,255,178,0.15)'
                      : formStatus === 'error'
                      ? 'rgba(255,68,68,0.1)'
                      : 'rgba(0,255,178,0.08)',
                  border:
                    formStatus === 'success'
                      ? '1px solid rgba(0,255,178,0.4)'
                      : formStatus === 'error'
                      ? '1px solid rgba(255,68,68,0.3)'
                      : '1px solid rgba(0,255,178,0.2)',
                  color:
                    formStatus === 'error' ? '#FF4444' : '#00FFB2',
                }}
                data-cursor-hover
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <span className="relative z-10">
                  {formStatus === 'idle' && '> Send Message_'}
                  {formStatus === 'sending' && '> Transmitting...'}
                  {formStatus === 'success' && '> Message Received âœ“'}
                  {formStatus === 'error' && '> Transmission Failed. Retry?'}
                </span>
              </button>

              <p className="font-mono text-[10px] text-white/20 text-center tracking-wider">
                Encrypted & secure. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>

      <div
        className="mt-32 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="font-mono text-[10px] text-white/20 tracking-widest">
          Â© 2024 â€” FUTURE HUMANIST PORTFOLIO
        </span>
        <span className="font-mono text-[10px] text-white/15 tracking-widest">
          BUILT WITH REACT THREE FIBER & SOUL
        </span>
      </div>
    </section>
  )
}
