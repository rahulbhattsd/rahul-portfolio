import { useMemo, useRef, useState } from 'react'
import { Edges, Html, useCursor } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const CUBE_SIZE = 2.24
const FACE_OFFSET = CUBE_SIZE / 2 + 0.006

const FACE_LAYOUT = {
  front: { position: [0, 0, FACE_OFFSET], rotation: [0, 0, 0] },
  back: { position: [0, 0, -FACE_OFFSET], rotation: [0, Math.PI, 0] },
  right: { position: [FACE_OFFSET, 0, 0], rotation: [0, Math.PI / 2, 0] },
  left: { position: [-FACE_OFFSET, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  top: { position: [0, FACE_OFFSET, 0], rotation: [-Math.PI / 2, 0, 0] },
  bottom: { position: [0, -FACE_OFFSET, 0], rotation: [Math.PI / 2, 0, 0] },
}

function FacePortal({ section, isActive, onSelect }) {
  const groupRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [faceVisible, setFaceVisible] = useState(true)
  const visibleRef = useRef(true)
  const layout = FACE_LAYOUT[section.face]
  const { camera } = useThree()
  const worldPosition = useMemo(() => new THREE.Vector3(), [])
  const worldNormal = useMemo(() => new THREE.Vector3(), [])
  const worldQuaternion = useMemo(() => new THREE.Quaternion(), [])
  const toCamera = useMemo(() => new THREE.Vector3(), [])
  useCursor(hovered)

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.getWorldPosition(worldPosition)
    groupRef.current.getWorldQuaternion(worldQuaternion)
    worldNormal.set(0, 0, 1).applyQuaternion(worldQuaternion).normalize()
    toCamera.copy(camera.position).sub(worldPosition).normalize()

    const nextVisible = worldNormal.dot(toCamera) > 0.04
    if (nextVisible !== visibleRef.current) {
      visibleRef.current = nextVisible
      setFaceVisible(nextVisible)
    }
  })

  return (
    <group ref={groupRef} position={layout.position} rotation={layout.rotation}>
      <mesh
        onClick={(event) => {
          event.stopPropagation()
          onSelect(section.id)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[CUBE_SIZE, CUBE_SIZE]} />
        <meshStandardMaterial
          color="#061325"
          emissive={section.accent}
          emissiveIntensity={hovered ? 0.62 : isActive ? 0.48 : 0.18}
          metalness={0.22}
          roughness={0.28}
          transparent
          opacity={hovered || isActive ? 0.64 : 0.36}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
        <Edges color={hovered || isActive ? section.accent : '#6ca6ff'} threshold={10} />
      </mesh>

      {faceVisible && (
        <Html
          transform
          center
          occlude={false}
          distanceFactor={1.15}
          position={[0, 0, 0.035]}
          className="cube-face-html"
          zIndexRange={[20, 0]}
        >
          <article className={`cube-face-card ${isActive ? 'is-active' : ''}`} style={{ '--accent': section.accent }}>
            <span>{section.number}</span>
            <h2>{section.label}</h2>
            <p>{section.faceCopy}</p>
            <div>
              {section.stats.map((stat) => (
                <small key={stat}>{stat}</small>
              ))}
            </div>
          </article>
        </Html>
      )}
    </group>
  )
}

function CoreObject({ activeSection }) {
  const coreRef = useRef(null)
  const ringARef = useRef(null)
  const ringBRef = useRef(null)
  const ringCRef = useRef(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.32
      coreRef.current.rotation.y += delta * 0.44
      coreRef.current.scale.setScalar(1 + Math.sin(t * 1.8) * 0.035)
    }
    if (ringARef.current) ringARef.current.rotation.z = t * 0.26
    if (ringBRef.current) ringBRef.current.rotation.x = t * 0.18
    if (ringCRef.current) ringCRef.current.rotation.y = -t * 0.22
  })

  const accent = activeSection?.accent ?? '#5efcff'

  return (
    <group>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.34, 2]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.25}
          metalness={0.48}
          roughness={0.18}
          transparent
          opacity={0.86}
        />
      </mesh>
      <mesh ref={ringARef} rotation={[1.18, 0.18, 0]}>
        <torusGeometry args={[0.68, 0.006, 8, 128]} />
        <meshBasicMaterial color="#5efcff" transparent opacity={0.72} />
      </mesh>
      <mesh ref={ringBRef} rotation={[0, 1.05, 0.7]}>
        <torusGeometry args={[0.92, 0.005, 8, 128]} />
        <meshBasicMaterial color="#8b7cff" transparent opacity={0.48} />
      </mesh>
      <mesh ref={ringCRef} rotation={[0.72, 0, 1.2]}>
        <torusGeometry args={[1.16, 0.004, 8, 128]} />
        <meshBasicMaterial color="#ff6fb5" transparent opacity={0.34} />
      </mesh>
    </group>
  )
}

export default function FloatingCube({ sections, activeSection, onSelect }) {
  const groupRef = useRef(null)
  const shellMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#071527',
        emissive: '#102a4b',
        emissiveIntensity: 0.2,
        metalness: 0.34,
        roughness: 0.2,
        transparent: true,
        opacity: 0.18,
        transmission: 0.28,
        thickness: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  )

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const targetY = activeSection ? 0 : Math.sin(t * 0.9) * 0.045
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * delta * 2.2
    if (!activeSection) {
      groupRef.current.rotation.y += delta * 0.08
    } else {
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * delta * 1.8
    }
    groupRef.current.rotation.x = Math.sin(t * 0.28) * 0.018
    groupRef.current.rotation.z = Math.cos(t * 0.22) * 0.014
  })

  return (
    <group ref={groupRef}>
      <mesh material={shellMaterial}>
        <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
        <Edges color="#5efcff" threshold={18} />
      </mesh>

      {sections.map((section) => (
        <FacePortal
          key={section.id}
          section={section}
          isActive={activeSection?.id === section.id}
          onSelect={onSelect}
        />
      ))}

      <CoreObject activeSection={activeSection} />
    </group>
  )
}
