import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import useSceneStore from '../hooks/useSceneStore'

const BASE_POSITION = [-2.25, -0.72, 0.85]

/**
 * Primitive Ranger shuttle with floating motion, rolling drift, and flickering thrusters.
 * Clicking it surges the craft forward and opens the Projects panel.
 */
export default function Ranger() {
  const groupRef = useRef(null)
  const thrusterLightRef = useRef(null)
  const glowRef = useRef(null)
  const setActivePanel = useSceneStore((state) => state.setActivePanel)
  const setCameraTarget = useSceneStore((state) => state.setCameraTarget)

  const materials = useMemo(
    () => ({
      hull: new THREE.MeshStandardMaterial({
        color: '#dfe7ee',
        emissive: '#9ecfff',
        emissiveIntensity: 0.12,
        metalness: 0.62,
        roughness: 0.38,
      }),
      wing: new THREE.MeshStandardMaterial({
        color: '#aeb8c2',
        emissive: '#00f5c4',
        emissiveIntensity: 0.08,
        metalness: 0.58,
        roughness: 0.44,
      }),
      glass: new THREE.MeshStandardMaterial({
        color: '#0d223a',
        emissive: '#4fe6ff',
        emissiveIntensity: 0.32,
        metalness: 0.12,
        roughness: 0.16,
      }),
      thruster: new THREE.MeshStandardMaterial({
        color: '#ff8d45',
        emissive: '#ff6b35',
        emissiveIntensity: 1.6,
        roughness: 0.25,
      }),
      engine: new THREE.MeshStandardMaterial({
        color: '#282f39',
        emissive: '#ff6b35',
        emissiveIntensity: 0.32,
        metalness: 0.75,
        roughness: 0.32,
      }),
    }),
    [],
  )

  const orange = useMemo(() => new THREE.Color('#ff6b35'), [])
  const blue = useMemo(() => new THREE.Color('#37a5ff'), [])
  const thrusterColor = useMemo(() => new THREE.Color('#ff6b35'), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const t = clock.getElapsedTime()
    groupRef.current.position.y = BASE_POSITION[1] + Math.sin(t * 0.8) * 0.15
    groupRef.current.rotation.z = -0.08 + Math.sin(t * 0.4) * 0.04

    const flicker = 0.5 + Math.sin(t * 4) * 0.5
    thrusterColor.copy(orange).lerp(blue, flicker)
    materials.thruster.color.copy(thrusterColor)
    materials.thruster.emissive.copy(thrusterColor)
    materials.thruster.emissiveIntensity = 1.25 + flicker * 1.1

    if (thrusterLightRef.current) {
      thrusterLightRef.current.intensity = 1.5 + Math.sin(t * 4) * 0.5
      thrusterLightRef.current.color.copy(thrusterColor)
    }

    if (glowRef.current) {
      const scale = 0.9 + flicker * 0.35
      glowRef.current.scale.setScalar(scale)
    }
  })

  const handleClick = (event) => {
    event.stopPropagation()
    setActivePanel('projects')
    setCameraTarget('ranger')

    gsap.killTweensOf(groupRef.current.position)
    gsap
      .timeline()
      .to(groupRef.current.position, { z: BASE_POSITION[2] + 0.92, duration: 0.34, ease: 'power2.out' })
      .to(groupRef.current.position, { z: BASE_POSITION[2], duration: 0.95, ease: 'power3.out' })
  }

  return (
    <group
      ref={groupRef}
      position={BASE_POSITION}
      rotation={[0.08, -0.45, -0.08]}
      scale={0.9}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh castShadow receiveShadow material={materials.hull}>
        <boxGeometry args={[0.34, 0.22, 1.08]} />
      </mesh>
      <mesh castShadow receiveShadow material={materials.glass} position={[0, 0.08, -0.18]}>
        <boxGeometry args={[0.22, 0.08, 0.28]} />
      </mesh>
      <mesh castShadow receiveShadow material={materials.hull} position={[0, 0, -0.66]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.34, 24]} />
      </mesh>

      <mesh castShadow receiveShadow material={materials.wing} position={[-0.36, -0.02, 0.02]}>
        <boxGeometry args={[0.58, 0.045, 0.32]} />
      </mesh>
      <mesh castShadow receiveShadow material={materials.wing} position={[0.36, -0.02, 0.02]}>
        <boxGeometry args={[0.58, 0.045, 0.32]} />
      </mesh>

      <mesh castShadow receiveShadow material={materials.engine} position={[-0.11, -0.02, 0.63]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 0.2, 18]} />
      </mesh>
      <mesh castShadow receiveShadow material={materials.engine} position={[0.11, -0.02, 0.63]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 0.2, 18]} />
      </mesh>
      <mesh ref={glowRef} material={materials.thruster} position={[0, -0.02, 0.78]}>
        <sphereGeometry args={[0.085, 20, 20]} />
      </mesh>
      <pointLight ref={thrusterLightRef} color="#ff6b35" intensity={1.5} distance={4} position={[0, -0.02, 0.82]} />
    </group>
  )
}
