import { Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { profile, projects, skillGroups } from '../data/portfolio'

function StatStrip({ items }) {
  return (
    <div className="panel-stats">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  )
}

function SkillsBody() {
  return (
    <div className="skill-matrix">
      {skillGroups.map((group) => (
        <article key={group.label}>
          <h3>{group.label}</h3>
          <div>
            {group.items.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

function ProjectsBody() {
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <article key={project.name} className="project-card">
          <div className="project-card__topline">
            <span>{project.type}</span>
            <strong>{project.metric}</strong>
          </div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <div className="project-card__tech">
            {project.tech.map((tech) => (
              <small key={tech}>{tech}</small>
            ))}
          </div>
          <div className="project-card__links">
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              Live
            </a>
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              Code
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}

function ContactBody() {
  return (
    <div className="contact-grid">
      <a href={`mailto:${profile.email}`}>
        <span>Email</span>
        {profile.email}
      </a>
      <a href={`tel:${profile.phone.replaceAll(' ', '')}`}>
        <span>Phone</span>
        {profile.phone}
      </a>
      <a href={profile.github} target="_blank" rel="noreferrer">
        <span>GitHub</span>
        {profile.github.replace(/^https?:\/\//, '')}
      </a>
      <a href={profile.linkedin} target="_blank" rel="noreferrer">
        <span>LinkedIn</span>
        {profile.linkedin.replace(/^https?:\/\//, '')}
      </a>
    </div>
  )
}

function DetailBody({ section }) {
  return (
    <div className="detail-list">
      {section.details.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  )
}

function PanelBody({ section }) {
  if (section.id === 'skills') return <SkillsBody />
  if (section.id === 'projects') return <ProjectsBody />
  if (section.id === 'contact') return <ContactBody />
  return <DetailBody section={section} />
}

export default function SectionPanel({ activeSection, onBack }) {
  if (!activeSection) return null

  return (
    <group position={activeSection.panel.position} rotation={activeSection.panel.rotation}>
      <mesh position={[0, 0, -0.045]}>
        <planeGeometry args={[2.7, 1.72]} />
        <meshBasicMaterial
          color={activeSection.accent}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, 0, -0.052]}>
        <planeGeometry args={[2.86, 1.88]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.035} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Html
        transform
        sprite
        center
        occlude={false}
        distanceFactor={activeSection.id === 'contact' ? 1.1 : 1.02}
        className="section-panel-html"
        zIndexRange={[80, 0]}
      >
        <motion.section
          key={activeSection.id}
          className="section-panel"
          style={{ '--accent': activeSection.accent }}
          initial={{ opacity: 0, y: 18, scale: 0.92, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <button type="button" className="panel-back" onClick={onBack} aria-label="Return to universe">
            Back
          </button>
          <p className="panel-eyebrow">
            {activeSection.number} / {activeSection.eyebrow}
          </p>
          <h2>{activeSection.title}</h2>
          <p className="panel-subtitle">{activeSection.subtitle}</p>
          <p className="panel-summary">{activeSection.summary}</p>
          <StatStrip items={activeSection.stats} />
          <PanelBody section={activeSection} />
        </motion.section>
      </Html>
    </group>
  )
}
