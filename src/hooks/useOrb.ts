import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store/useStore'
import * as THREE from 'three'

export function useOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { mouse, orb } = useStore()

  // Smooth lerp targets
  const smoothMouse = useRef(new THREE.Vector2(0, 0))
  const smoothScale = useRef(1)

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return

    // ── Smooth mouse tracking ──────────────────────────
    smoothMouse.current.lerp(
      new THREE.Vector2(mouse[0], mouse[1]),
      delta * 2.5
    )

    // Rotate group to follow mouse
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      smoothMouse.current.y * 0.3,
      delta * 3
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      smoothMouse.current.x * 0.4,
      delta * 3
    )

    // ── Idle float animation ────────────────────────────
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.08

    // Subtle organic morphing via scale (non-uniform)
    const breathe = Math.sin(t * 0.8) * 0.015
    meshRef.current.scale.set(
      1 + breathe,
      1 - breathe * 0.5,
      1 + breathe * 0.3
    )

    // ── Smooth scale from store ─────────────────────────
    smoothScale.current = THREE.MathUtils.lerp(
      smoothScale.current,
      orb.scale,
      delta * 6
    )
    groupRef.current.scale.setScalar(smoothScale.current)

    // ── Slow self-rotation ──────────────────────────────
    meshRef.current.rotation.y += delta * 0.12
    meshRef.current.rotation.z += delta * 0.04
  })

  return { meshRef, groupRef }
}
