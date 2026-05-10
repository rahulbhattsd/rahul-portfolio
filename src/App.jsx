import { useState } from 'react'
import SpaceScene from './components/SpaceScene'
import { profile, projects } from './data/portfolio'

const appStyles = `
html,
body,
#root {
  width: 100%;
  height: 100%;
  min-width: 320px;
  min-height: 100%;
  margin: 0;
}

body {
  overflow: hidden;
  background: #04050d;
}

* {
  box-sizing: border-box;
}

.black-hole-app,
.space-scene-shell,
.space-scene-canvas {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  min-height: 100vh;
  overflow: hidden;
  background: #04050d;
}

.black-hole-app {
  color: #f4f8ff;
  isolation: isolate;
}

.black-hole-app::after {
  content: '';
  position: fixed;
  inset: -30%;
  z-index: 4;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: cinematic-grain 7s steps(10) infinite;
}

@keyframes cinematic-grain {
  0%, 100% { transform: translate(0, 0); }
  20% { transform: translate(-2.5%, 1.5%); }
  40% { transform: translate(2%, -2.5%); }
  60% { transform: translate(2.6%, 1%); }
  80% { transform: translate(-1%, 2.2%); }
}

.portfolio-identity-layer {
  position: fixed;
  inset: 0;
  z-index: 12;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 0 6rem 4.8rem;
  pointer-events: none;
}

.portfolio-identity {
  position: relative;
  width: min(650px, calc(100vw - 48px));
  padding: 0 0 0 1.35rem;
  color: rgba(246, 250, 255, 0.96);
  animation: identity-rise 920ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.portfolio-identity::before {
  content: '';
  position: absolute;
  inset: -1.35rem -2.25rem -1.2rem -1.2rem;
  z-index: -1;
  border-left: 1px solid rgba(222, 246, 255, 0.36);
  background:
    linear-gradient(90deg, rgba(3, 5, 12, 0.68), rgba(3, 5, 12, 0.28) 58%, transparent);
  box-shadow: -1.8rem 0 4.5rem rgba(110, 214, 255, 0.08);
  mask-image: linear-gradient(90deg, black 0 72%, transparent);
  pointer-events: none;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.portfolio-identity h1 {
  margin: 0;
  color: #ffffff;
  font-size: 5.6rem;
  font-weight: 760;
  line-height: 0.9;
  letter-spacing: 0;
  text-shadow:
    0 0 1.5rem rgba(210, 241, 255, 0.12),
    0 1rem 3.4rem rgba(0, 0, 0, 0.52);
}

.portfolio-role {
  margin: 1.05rem 0 0;
  color: rgba(245, 250, 255, 0.86);
  max-width: 42rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: 0;
}

.portfolio-tagline {
  max-width: 38rem;
  margin: 0.7rem 0 0;
  color: rgba(231, 241, 250, 0.66);
  font-size: 1rem;
  line-height: 1.72;
  letter-spacing: 0;
}

.portfolio-contact-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.85rem;
  max-width: 38rem;
  margin: 0.95rem 0 0;
  color: rgba(225, 241, 250, 0.58);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.72rem;
  line-height: 1.6;
}

.portfolio-contact-copy {
  appearance: none;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.portfolio-contact-copy {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  gap: 0.42rem;
  color: rgba(237, 248, 255, 0.72);
  pointer-events: auto;
  transition:
    color 180ms ease,
    text-shadow 180ms ease,
    transform 180ms ease;
}

.portfolio-contact-copy::before {
  content: attr(data-label);
  color: rgba(181, 218, 235, 0.46);
  text-transform: uppercase;
}

.portfolio-contact-copy__value {
  overflow-wrap: anywhere;
}

.portfolio-contact-copy:hover,
.portfolio-contact-copy:focus-visible {
  color: #ffffff;
  text-shadow: 0 0 1rem rgba(178, 236, 255, 0.24);
}

.portfolio-contact-copy:active {
  transform: translateY(1px);
}

.portfolio-contact-copy:focus-visible {
  outline: 2px solid rgba(223, 247, 255, 0.7);
  outline-offset: 4px;
}

.portfolio-contact-copy__status {
  display: inline-flex;
  align-items: center;
  min-height: 1.35rem;
  min-width: 3.3rem;
  justify-content: center;
  padding: 0 0.45rem;
  border: 1px solid rgba(178, 236, 255, 0.18);
  border-radius: 999px;
  background: rgba(178, 236, 255, 0.075);
  color: rgba(223, 247, 255, 0.9);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0 1.1rem rgba(137, 218, 255, 0.12);
  opacity: 0;
  transform: translateY(0.15rem);
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.portfolio-contact-copy__status[data-visible='true'] {
  opacity: 1;
  transform: translateY(0);
}

.portfolio-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.55rem 0 0;
}

.portfolio-action {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.9rem;
  padding: 0 1.15rem;
  border: 1px solid rgba(232, 247, 255, 0.24);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.045);
  color: rgba(248, 252, 255, 0.92);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0;
  pointer-events: auto;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease;
}

.portfolio-action::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition:
    opacity 180ms ease,
    transform 420ms ease;
}

.portfolio-action:hover,
.portfolio-action:focus-visible {
  border-color: rgba(221, 246, 255, 0.54);
  background: rgba(255, 255, 255, 0.085);
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 0 2rem rgba(178, 236, 255, 0.16);
}

.portfolio-action:hover::after,
.portfolio-action:focus-visible::after {
  opacity: 1;
  transform: translateX(100%);
}

.portfolio-action:focus-visible,
.portfolio-social-link:focus-visible {
  outline: 2px solid rgba(223, 247, 255, 0.7);
  outline-offset: 4px;
}

.portfolio-action--primary {
  border-color: rgba(228, 247, 255, 0.48);
  background: rgba(237, 249, 255, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.portfolio-social {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: 1.1rem 0 0;
}

.portfolio-social-link {
  display: grid;
  width: 2.55rem;
  height: 2.55rem;
  place-items: center;
  border: 1px solid rgba(234, 247, 255, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
  color: rgba(241, 249, 255, 0.74);
  pointer-events: auto;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease;
}

.portfolio-social-link:hover,
.portfolio-social-link:focus-visible {
  border-color: rgba(224, 247, 255, 0.48);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 0 1.55rem rgba(178, 236, 255, 0.14);
}

.portfolio-social-link svg {
  width: 1.12rem;
  height: 1.12rem;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.portfolio-social-link svg[data-fill-icon='true'] {
  fill: currentColor;
  stroke: none;
}

.portfolio-mobile-live {
  display: block;
  margin: 1.15rem 0 0;
  pointer-events: auto;
}

.portfolio-mobile-live p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.58rem;
  color: rgba(223, 244, 255, 0.6);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.62rem;
  line-height: 1;
  text-transform: uppercase;
}

.portfolio-mobile-live p::before {
  content: '';
  width: 1.35rem;
  height: 1px;
  background: rgba(223, 244, 255, 0.34);
}

.portfolio-mobile-live__links {
  display: flex;
  gap: 0.55rem;
  overflow-x: auto;
  padding-bottom: 0.35rem;
  scroll-padding-inline: 0.1rem;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.portfolio-mobile-live__links::-webkit-scrollbar {
  display: none;
}

.portfolio-mobile-live a {
  display: grid;
  flex: 0 0 min(12rem, 72vw);
  min-height: 4.1rem;
  gap: 0.18rem;
  padding: 0.64rem 0.72rem;
  border: 1px solid rgba(226, 245, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.045);
  color: rgba(246, 251, 255, 0.88);
  scroll-snap-align: start;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    color 180ms ease;
}

.portfolio-mobile-live a:hover,
.portfolio-mobile-live a:focus-visible {
  border-color: rgba(226, 245, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.portfolio-mobile-live strong {
  font-size: 0.86rem;
  line-height: 1.15;
}

.portfolio-mobile-live span {
  color: rgba(225, 241, 250, 0.5);
  font-size: 0.66rem;
  line-height: 1.35;
}

.portfolio-project-rail {
  position: fixed;
  top: 4.7rem;
  right: clamp(2rem, 5vw, 5.6rem);
  z-index: 13;
  width: min(18rem, calc(100vw - 3rem));
  color: rgba(241, 249, 255, 0.82);
  pointer-events: none;
  animation: rail-drift 1.05s 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.portfolio-project-rail p {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0 0 0.75rem;
  color: rgba(223, 244, 255, 0.58);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.68rem;
  line-height: 1;
  text-transform: uppercase;
}

.portfolio-project-rail p::before {
  content: '';
  width: 1.7rem;
  height: 1px;
  background: rgba(223, 244, 255, 0.34);
}

.portfolio-project-rail a {
  display: grid;
  gap: 0.2rem;
  padding: 0.78rem 0;
  border-top: 1px solid rgba(226, 245, 255, 0.12);
  color: rgba(246, 251, 255, 0.86);
  pointer-events: auto;
  transition:
    color 180ms ease,
    transform 180ms ease,
    border-color 180ms ease,
    text-shadow 180ms ease;
}

.portfolio-project-rail a:last-child {
  border-bottom: 1px solid rgba(226, 245, 255, 0.12);
}

.portfolio-project-rail a:hover,
.portfolio-project-rail a:focus-visible {
  border-color: rgba(226, 245, 255, 0.28);
  color: #ffffff;
  transform: translateX(-4px);
  text-shadow: 0 0 1.2rem rgba(178, 236, 255, 0.18);
}

.portfolio-project-rail strong {
  font-size: 0.94rem;
  line-height: 1.1;
}

.portfolio-project-rail span {
  color: rgba(225, 241, 250, 0.48);
  font-size: 0.74rem;
  line-height: 1.35;
}

.portfolio-project-rail__links {
  display: grid;
}

@media (min-width: 1181px) {
  .portfolio-mobile-live {
    display: none;
  }
}

@keyframes identity-rise {
  from {
    opacity: 0;
    transform: translate3d(-0.8rem, 1.25rem, 0);
    filter: blur(12px);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    filter: blur(0);
  }
}

@keyframes rail-drift {
  from {
    opacity: 0;
    transform: translate3d(0.8rem, -0.65rem, 0);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    filter: blur(0);
  }
}

@media (max-width: 1180px) {
  .portfolio-project-rail {
    display: none;
  }
}

@media (max-width: 1180px) and (min-width: 921px) {
  .portfolio-identity-layer {
    padding: 0 4rem 4rem;
  }

  .portfolio-identity {
    width: min(620px, calc(100vw - 5rem));
  }

  .portfolio-identity h1 {
    font-size: clamp(4.2rem, 8vw, 5.2rem);
  }
}

@media (max-width: 920px) {
  .black-hole-app::after {
    opacity: 0.045;
  }

  .portfolio-identity-layer {
    align-items: flex-end;
    padding:
      calc(5.4rem + env(safe-area-inset-top, 0px))
      calc(2rem + env(safe-area-inset-right, 0px))
      calc(2.75rem + env(safe-area-inset-bottom, 0px))
      calc(2rem + env(safe-area-inset-left, 0px));
  }

  .portfolio-identity {
    width: min(36rem, 100%);
    max-height: calc(100vh - 8.15rem);
    overflow-y: auto;
    padding-left: 1.15rem;
    padding-right: 0.35rem;
    pointer-events: auto;
    scrollbar-width: none;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
  }

  .portfolio-identity::-webkit-scrollbar {
    display: none;
  }

  .portfolio-identity::before {
    inset: -1.2rem -1.5rem -1.15rem -1rem;
    background:
      linear-gradient(90deg, rgba(3, 5, 12, 0.72), rgba(3, 5, 12, 0.28) 64%, transparent);
  }

  .portfolio-identity h1 {
    font-size: clamp(3.6rem, 9vw, 4.35rem);
  }

  .portfolio-tagline {
    max-width: 28rem;
  }

  .portfolio-contact-strip {
    max-width: 28rem;
  }

  .portfolio-contact-copy {
    min-height: 1.9rem;
  }
}

@media (max-width: 560px) {
  .portfolio-identity-layer {
    align-items: flex-end;
    padding:
      calc(3rem + env(safe-area-inset-top, 0px))
      calc(1.15rem + env(safe-area-inset-right, 0px))
      calc(1.35rem + env(safe-area-inset-bottom, 0px))
      calc(1.15rem + env(safe-area-inset-left, 0px));
  }

  .portfolio-identity {
    width: 100%;
    max-height: calc(100vh - 4.35rem);
    padding-left: 1rem;
    padding-right: 0.15rem;
  }

  .portfolio-identity::before {
    inset: -1rem -0.9rem -1rem -0.9rem;
    background: linear-gradient(90deg, rgba(3, 5, 12, 0.62), rgba(3, 5, 12, 0.2));
  }

  .portfolio-identity h1 {
    font-size: clamp(2.68rem, 14vw, 3.2rem);
  }

  .portfolio-role {
    margin-top: 0.8rem;
    max-width: 20rem;
    font-size: 0.78rem;
    line-height: 1.48;
  }

  .portfolio-tagline {
    max-width: 21rem;
    font-size: 0.88rem;
    line-height: 1.58;
  }

  .portfolio-contact-strip {
    max-width: 100%;
    gap: 0.35rem 0.65rem;
    font-size: 0.64rem;
  }

  .portfolio-contact-copy {
    width: 100%;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.28rem 0.55rem;
  }

  .portfolio-contact-copy::before {
    flex: 0 0 3rem;
  }

  .portfolio-contact-copy__value {
    flex: 1 1 min(12rem, calc(100% - 7.2rem));
    min-width: 0;
  }

  .portfolio-contact-copy__status {
    min-height: 1.25rem;
    min-width: 3.05rem;
    padding: 0 0.38rem;
  }

  .portfolio-actions {
    gap: 0.6rem;
    margin-top: 1.15rem;
  }

  .portfolio-action {
    min-height: 2.6rem;
    padding: 0 0.86rem;
    font-size: 0.82rem;
  }

  .portfolio-social {
    gap: 0.55rem;
    margin-top: 0.85rem;
  }

  .portfolio-social-link {
    width: 2.35rem;
    height: 2.35rem;
  }
}

@media (max-width: 390px) {
  .portfolio-identity h1 {
    font-size: clamp(2.35rem, 13vw, 2.75rem);
  }

  .portfolio-role {
    font-size: 0.72rem;
  }

  .portfolio-tagline {
    font-size: 0.8rem;
  }

  .portfolio-actions {
    align-items: stretch;
    width: 100%;
  }

  .portfolio-action {
    flex: 1 1 9rem;
  }
}

@media (max-height: 640px) and (max-width: 920px) {
  .portfolio-identity-layer {
    align-items: center;
    padding-top: calc(1.25rem + env(safe-area-inset-top, 0px));
    padding-bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
  }

  .portfolio-identity {
    max-height: calc(100vh - 2.5rem);
  }

  .portfolio-social {
    margin-top: 0.75rem;
  }
}
`

function SocialIcon({ type }) {
  if (type === 'github') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" data-fill-icon="true">
        <path d="M12 2.25c-5.39 0-9.75 4.43-9.75 9.9 0 4.37 2.79 8.08 6.66 9.39.49.09.67-.21.67-.48v-1.82c-2.71.6-3.28-1.18-3.28-1.18-.44-1.15-1.08-1.45-1.08-1.45-.89-.62.07-.61.07-.61.98.07 1.5 1.04 1.5 1.04.87 1.51 2.28 1.07 2.84.82.09-.64.34-1.07.62-1.32-2.16-.25-4.43-1.09-4.43-4.88 0-1.08.38-1.96 1.01-2.65-.1-.25-.44-1.25.1-2.61 0 0 .83-.27 2.69 1.01.78-.22 1.62-.33 2.46-.33s1.68.11 2.46.33c1.86-1.28 2.68-1.01 2.68-1.01.54 1.36.2 2.36.1 2.61.63.69 1.01 1.57 1.01 2.65 0 3.8-2.28 4.62-4.45 4.87.35.31.66.91.66 1.84v2.73c0 .27.18.58.67.48 3.87-1.31 6.65-5.02 6.65-9.39 0-5.47-4.36-9.9-9.75-9.9Z" />
      </svg>
    )
  }

  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" data-fill-icon="true">
        <path d="M5.2 8.72h3.1v10.03H5.2V8.72Zm1.55-4.98c.99 0 1.79.8 1.79 1.79s-.8 1.78-1.79 1.78-1.79-.79-1.79-1.78.8-1.79 1.79-1.79Zm3.62 4.98h2.97v1.37h.04c.41-.79 1.43-1.62 2.94-1.62 3.15 0 3.73 2.07 3.73 4.77v5.51h-3.09v-4.88c0-1.16-.02-2.66-1.62-2.66-1.63 0-1.88 1.27-1.88 2.58v4.96h-3.09V8.72Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.75 6.75h14.5v10.5H4.75z" />
      <path d="m5.25 7.25 6.75 5.5 6.75-5.5" />
    </svg>
  )
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.top = '-9999px'
  document.body.appendChild(textArea)
  textArea.select()

  try {
    document.execCommand('copy')
  } finally {
    document.body.removeChild(textArea)
  }
}

function PortfolioIdentity() {
  const [copiedField, setCopiedField] = useState(null)

  const copyContactValue = async (field, value) => {
    try {
      await copyTextToClipboard(value)
      setCopiedField(field)
      window.setTimeout(() => {
        setCopiedField((currentField) => (currentField === field ? null : currentField))
      }, 1800)
    } catch (error) {
      console.error(`Could not copy ${field}`, error)
    }
  }

  return (
    <section className="portfolio-identity-layer" aria-label="Rahul Bhatt portfolio introduction">
      <div className="portfolio-identity">
        <h1>{profile.name}</h1>
        <p className="portfolio-role">{profile.role}</p>
        <p className="portfolio-tagline">{profile.tagline}</p>

        <section className="portfolio-mobile-live" aria-label="Live project links">
          <p>Live Systems</p>
          <div className="portfolio-mobile-live__links">
            {projects.map((project) => (
              <a key={project.name} href={project.liveUrl} target="_blank" rel="noreferrer">
                <strong>{project.name}</strong>
                <span>{project.type}</span>
              </a>
            ))}
          </div>
        </section>

        <div className="portfolio-contact-strip" aria-label="Contact details">
          <button
            type="button"
            className="portfolio-contact-copy"
            data-label="Email"
            aria-label={`Copy email address ${profile.email}`}
            onClick={() => copyContactValue('email', profile.email)}
          >
            <span className="portfolio-contact-copy__value">{profile.email}</span>
            <span
              className="portfolio-contact-copy__status"
              aria-live="polite"
              data-visible={copiedField === 'email'}
            >
              Copied
            </span>
          </button>
          <button
            type="button"
            className="portfolio-contact-copy"
            data-label="Phone"
            aria-label={`Copy phone number ${profile.phone}`}
            onClick={() => copyContactValue('phone', profile.phone)}
          >
            <span className="portfolio-contact-copy__value">{profile.phone}</span>
            <span
              className="portfolio-contact-copy__status"
              aria-live="polite"
              data-visible={copiedField === 'phone'}
            >
              Copied
            </span>
          </button>
        </div>

        <div className="portfolio-actions" aria-label="Primary portfolio actions">
          <a className="portfolio-action portfolio-action--primary" href={`mailto:${profile.email}`}>
            Contact
          </a>
          <a className="portfolio-action" href={profile.github} target="_blank" rel="noreferrer">
            View Projects
          </a>
        </div>

        <nav className="portfolio-social" aria-label="Social links">
          <a className="portfolio-social-link" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <SocialIcon type="github" />
          </a>
          <a className="portfolio-social-link" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <SocialIcon type="linkedin" />
          </a>
          <a className="portfolio-social-link" href={`mailto:${profile.email}`} aria-label="Email Rahul Bhatt">
            <SocialIcon type="email" />
          </a>
        </nav>
      </div>
    </section>
  )
}

function ProjectRail() {
  return (
    <aside className="portfolio-project-rail" aria-label="Live project links">
      <p>Live Systems</p>
      <div className="portfolio-project-rail__links">
        {projects.map((project) => (
          <a key={project.name} href={project.liveUrl} target="_blank" rel="noreferrer">
            <strong>{project.name}</strong>
            <span>{project.type}</span>
          </a>
        ))}
      </div>
    </aside>
  )
}

export default function App() {
  return (
    <main className="black-hole-app">
      <style>{appStyles}</style>
      <SpaceScene />
      <PortfolioIdentity />
      <ProjectRail />
    </main>
  )
}
