import { create } from 'zustand'

interface OrbState {
  color: string
  scale: number
  emissiveIntensity: number
}

interface AppStore {
  // Render loop control
  frameloop: 'always' | 'demand' | 'never'
  setFrameloop: (loop: 'always' | 'demand' | 'never') => void

  // Active section for nav highlights
  activeSection: string
  setActiveSection: (section: string) => void

  // Orb 3D state shared between canvas and HTML
  orb: OrbState
  setOrb: (partial: Partial<OrbState>) => void
  pulseOrb: () => void

  // Mouse position (normalized -1 to 1)
  mouse: [number, number]
  setMouse: (mouse: [number, number]) => void

  // Form state for contact section
  formStatus: 'idle' | 'sending' | 'success' | 'error'
  setFormStatus: (status: 'idle' | 'sending' | 'success' | 'error') => void

  // Loading state
  isLoaded: boolean
  setIsLoaded: (loaded: boolean) => void

  // Menu open
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void

  // Scroll progress (0–1)
  scrollProgress: number
  setScrollProgress: (progress: number) => void
}

export const useStore = create<AppStore>((set, get) => ({
  // ── Render loop ─────────────────────────────────────────
  frameloop: 'always',
  setFrameloop: (loop) => set({ frameloop: loop }),

  // ── Active section ───────────────────────────────────────
  activeSection: 'hero',
  setActiveSection: (section) => set({ activeSection: section }),

  // ── Orb state ────────────────────────────────────────────
  orb: {
    color: '#00FFB2',
    scale: 1,
    emissiveIntensity: 0.1,
  },
  setOrb: (partial) =>
    set((state) => ({ orb: { ...state.orb, ...partial } })),
  pulseOrb: () => {
    const store = get()
    store.setOrb({ scale: 1.3, emissiveIntensity: 0.8 })
    setTimeout(() => store.setOrb({ scale: 1, emissiveIntensity: 0.1 }), 600)
  },

  // ── Mouse ────────────────────────────────────────────────
  mouse: [0, 0],
  setMouse: (mouse) => set({ mouse }),

  // ── Form ─────────────────────────────────────────────────
  formStatus: 'idle',
  setFormStatus: (status) => {
    set({ formStatus: status })
    const store = get()
    if (status === 'sending') {
      store.setOrb({ color: '#7B61FF', emissiveIntensity: 0.4 })
    } else if (status === 'success') {
      store.pulseOrb()
      store.setOrb({ color: '#00FFB2' })
    } else if (status === 'error') {
      store.setOrb({ color: '#FF4444', emissiveIntensity: 0.5 })
      setTimeout(() => store.setOrb({ color: '#00FFB2', emissiveIntensity: 0.1 }), 2000)
    }
  },

  // ── Loading ───────────────────────────────────────────────
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),

  // ── Menu ─────────────────────────────────────────────────
  menuOpen: false,
  setMenuOpen: (open) => set({ menuOpen: open }),

  // ── Scroll ───────────────────────────────────────────────
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}))