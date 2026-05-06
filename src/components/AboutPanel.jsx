import useSceneStore from '../hooks/useSceneStore'
import { profile, skillGroups } from '../data/portfolio'

const skills = skillGroups.flatMap((group) => group.items).slice(0, 12)

/**
 * Glassmorphism About overlay triggered by the Endurance station.
 * Presents Rahul's identity, placement status, skills, and primary CTAs.
 */
export default function AboutPanel() {
  const activePanel = useSceneStore((state) => state.activePanel)
  const setActivePanel = useSceneStore((state) => state.setActivePanel)
  const setCameraTarget = useSceneStore((state) => state.setCameraTarget)
  const closePanels = useSceneStore((state) => state.closePanels)
  const isVisible = activePanel === 'about'

  const openProjects = () => {
    setActivePanel('projects')
    setCameraTarget('ranger')
  }

  return (
    <section
      className={`space-panel about-panel ${isVisible ? 'is-visible' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isVisible}
      aria-labelledby="about-panel-title"
    >
      <button className="space-panel__close" type="button" onClick={closePanels} aria-label="Close about panel">
        X
      </button>

      <p className="space-panel__eyebrow">Endurance telemetry linked</p>
      <h1 id="about-panel-title" className="about-panel__name">
        {profile.name}
      </h1>
      <p className="about-panel__role">{profile.role}</p>
      <p className="about-panel__tagline">{profile.tagline}</p>

      <div className="status-badge" aria-label="Open to Opportunities">
        <span />
        {profile.availability}
      </div>

      <div className="skills-grid" aria-label="Technical skills">
        {skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <div className="panel-actions">
        <button type="button" onClick={openProjects}>
          View Projects
        </button>
        <a href={`mailto:${profile.email}`}>Contact Rahul</a>
      </div>
    </section>
  )
}
