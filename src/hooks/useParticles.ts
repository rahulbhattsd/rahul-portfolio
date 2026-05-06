import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 400 // ⚠ PERF: Use instanced geometry

function seededRandom(seed: number) {
  const value = Math.sin(seed * 928.17) * 10000
  return value - Math.floor(value)
}

export function useParticles() {
  const meshRef = useRef<THREE.Points>(null)

  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const speeds = new Float32Array(PARTICLE_COUNT)
    const phases = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread particles in a sphere volume
      const r = 2 + seededRandom(i + 1) * 6
      const theta = seededRandom(i + 2) * Math.PI * 2
      const phi = Math.acos(2 * seededRandom(i + 3) - 1)

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      speeds[i] = 0.2 + seededRandom(i + 4) * 0.8
      phases[i] = seededRandom(i + 5) * Math.PI * 2
    }

    return { positions, speeds, phases }
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))

    // Per-particle size attribute for variation
    const sizes = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      sizes[i] = seededRandom(i + 6) * 0.5 + 0.5
    }
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

    return geo
  }, [positions])

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.015,
      color: new THREE.Color('#00FFB2'),
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const posAttr = meshRef.current.geometry.attributes.position

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const original_x = positions[i * 3]
      const original_y = positions[i * 3 + 1]
      const original_z = positions[i * 3 + 2]

      // Gentle drift using sine waves per-particle
      const drift = Math.sin(t * speeds[i] * 0.3 + phases[i]) * 0.06
      posAttr.setXYZ(
        i,
        original_x + drift,
        original_y + Math.sin(t * speeds[i] * 0.2 + phases[i] * 1.3) * 0.08,
        original_z + drift * 0.5
      )
    }
    posAttr.needsUpdate = true

    // Slow global rotation
    meshRef.current.rotation.y = t * 0.015
    meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.1
  })

  return { meshRef, geometry, material }
}
