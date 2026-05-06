import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import useSceneStore from '../hooks/useSceneStore'

const MODULE_COUNT = 6
const RING_RADIUS = 1.36

/**
 * Primitive-built Endurance station with a spinning ring, modules, struts, and hub light.
 * Clicking it focuses the camera and opens Rahul's About panel.
 */
export default function Endurance() {
  const groupRef = useRef(null)
  const hubRef = useRef(null)
  const setActivePanel = useSceneStore((state) => state.setActivePanel)
  const setCameraTarget = useSceneStore((state) => state.setCameraTarget)

  const moduleAngles = useMemo(
    () => Array.from({ length: MODULE_COUNT }, (_, index) => (index / MODULE_COUNT) * Math.PI * 2),
    [],
  )

  const materials = useMemo(
    () => ({
      hull: new THREE.MeshStandardMaterial({
        color: '#d8e2ec',
        emissive: '#00f5c4',
        emissiveIntensity: 0.18,
        metalness: 0.72,
        roughness: 0.34,
      }),
      darkHull: new THREE.MeshStandardMaterial({
        color: '#58616d',
        emissive: '#9efbff',
        emissiveIntensity: 0.12,
        metalness: 0.65,
        roughness: 0.42,
      }),
      edgeGlow: new THREE.MeshBasicMaterial({
        color: '#bffcff',
        transparent: true,
        opacity: 0.3,
        wireframe: true,
      }),
      strut: new THREE.MeshStandardMaterial({
        color: '#c9d6e2',
        emissive: '#9efbff',
        emissiveIntensity: 0.08,
        metalness: 0.78,
        roughness: 0.3,
      }),
      hub: new THREE.MeshStandardMaterial({
        color: '#eef7ff',
        emissive: '#00f5c4',
        emissiveIntensity: 0.28,
        metalness: 0.68,
        roughness: 0.28,
      }),
    }),
    [],
  )

  useFrame((_, delta) => {
    if (!groupRef.current || !hubRef.current) return

    groupRef.current.rotation.z += delta * 0.4
    hubRef.current.rotation.y += delta * 0.2
  })

  const handleClick = (event) => {
    event.stopPropagation()
    setActivePanel('about')
    setCameraTarget('endurance')

    // A short response pulse makes the station feel selected without disrupting its spin.
    gsap.killTweensOf([groupRef.current?.scale, materials.hull, materials.hub])
    gsap
      .timeline()
      .to(groupRef.current.scale, { x: 1.06, y: 1.06, z: 1.06, duration: 0.16, ease: 'power2.out' })
      .to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' })

    gsap
      .timeline()
      .to([materials.hull, materials.hub], { emissiveIntensity: 1.25, duration: 0.18, ease: 'power2.out' })
      .to([materials.hull, materials.hub], { emissiveIntensity: 0.22, duration: 0.7, ease: 'power3.out' })
  }

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh castShadow receiveShadow material={materials.hull}>
        <torusGeometry args={[RING_RADIUS, 0.055, 18, 128]} />
      </mesh>
      <mesh material={materials.edgeGlow}>
        <torusGeometry args={[RING_RADIUS, 0.062, 12, 128]} />
      </mesh>

      {moduleAngles.map((angle) => {
        const x = Math.cos(angle) * RING_RADIUS
        const y = Math.sin(angle) * RING_RADIUS

        return (
          <group key={angle} position={[x, y, 0]} rotation={[0, 0, angle]}>
            <mesh castShadow receiveShadow material={materials.darkHull}>
              <boxGeometry args={[0.5, 0.18, 0.24]} />
            </mesh>
            <mesh material={materials.edgeGlow} scale={[1.03, 1.07, 1.07]}>
              <boxGeometry args={[0.5, 0.18, 0.24]} />
            </mesh>
          </group>
        )
      })}

      {moduleAngles.map((angle) => (
        <mesh
          key={`strut-${angle}`}
          castShadow
          receiveShadow
          material={materials.strut}
          position={[Math.cos(angle) * 0.58, Math.sin(angle) * 0.58, 0]}
          rotation={[0, 0, angle - Math.PI / 2]}
        >
          <cylinderGeometry args={[0.014, 0.014, 1.16, 10]} />
        </mesh>
      ))}

      <mesh ref={hubRef} castShadow receiveShadow material={materials.hub}>
        <sphereGeometry args={[0.22, 32, 32]} />
      </mesh>
      <pointLight color="#00f5c4" intensity={3} distance={8} position={[0, 0, 0.08]} />
    </group>
  )
}
