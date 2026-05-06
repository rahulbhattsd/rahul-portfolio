import useSceneStore from '../hooks/useSceneStore'
import { profile, projects } from '../data/portfolio'

/**
 * Glassmorphism Projects overlay triggered by the Ranger craft.
 * Shows selected work cards and project links outside the WebGL canvas.
 */
export default function ProjectsPanel() {
  const activePanel = useSceneStore((state) => state.activePanel)
  const closePanels = useSceneStore((state) => state.closePanels)
  const isVisible = activePanel === 'projects'

  return (
    <section
      className={`space-panel projects-panel ${isVisible ? 'is-visible' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isVisible}
      aria-labelledby="projects-panel-title"
    >
      <button className="space-panel__close" type="button" onClick={closePanels} aria-label="Close projects panel">
        X
      </button>

      <p className="space-panel__eyebrow">Ranger manifest opened</p>
      <h2 id="projects-panel-title">Selected Work</h2>

      <div className="project-stack">
        {projects.map((project) => (
          <article className="project-card project-card--cyan" key={project.name}>
            <div>
              <h3>{project.name}</h3>
              <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} live project`}>
                Live
              </a>
            </div>
            <p>{project.description}</p>
            <div className="project-tags">
              {project.tech.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <a className="github-link" href={profile.github} target="_blank" rel="noreferrer">
        More on GitHub
      </a>
    </section>
  )
}
