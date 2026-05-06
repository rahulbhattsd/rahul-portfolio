import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const defaultLookAt = new THREE.Vector3(0, 0, 0)

export default function CameraRig({ entrySignal = 0 }) {
  const { camera, size } = useThree()
  const zoomStateRef = useRef({ depth: 0, shake: 0 })
  const settledDepthRef = useRef(0)
  const targetPositionRef = useRef(new THREE.Vector3(0, 0.62, 8.4))
  const shakeOffsetRef = useRef(new THREE.Vector3())

  useEffect(() => {
    const portrait = size.width / Math.max(size.height, 1) < 0.75
    camera.position.set(0, portrait ? 0.45 : 0.62, portrait ? 30 : 12.2)
    camera.lookAt(defaultLookAt)
    camera.fov = portrait ? 43 : 46
    camera.near = 0.1
    camera.far = 160
    camera.updateProjectionMatrix()
  }, [camera, size.height, size.width])

  useEffect(() => {
    if (entrySignal === 0) return

    gsap.killTweensOf(zoomStateRef.current)
    settledDepthRef.current = 0.68

    gsap
      .timeline()
      .to(zoomStateRef.current, {
        depth: 1,
        shake: 1,
        duration: 1.35,
        ease: 'power3.in',
      })
      .to(zoomStateRef.current, {
        shake: 0.28,
        duration: 0.38,
        ease: 'power2.out',
      })
      .to(zoomStateRef.current, {
        depth: settledDepthRef.current,
        shake: 0,
        duration: 1.15,
        ease: 'power3.out',
      })
  }, [entrySignal])

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()

    const aspect = size.width / Math.max(size.height, 1)
    const portrait = aspect < 0.75
    const driftX = Math.sin(t * 0.1) * (portrait ? 0.24 : 0.5)
    const driftY = Math.cos(t * 0.08) * (portrait ? 0.16 : 0.3)
    const depth = zoomStateRef.current.depth

    const basePosition = new THREE.Vector3(driftX, (portrait ? 0.45 : 0.62) + driftY, portrait ? 30 : 12.2)
    const plungePosition = new THREE.Vector3(
      driftX * 0.16,
      (portrait ? 0.2 : 0.1) + driftY * 0.12,
      portrait ? 12.5 : 4.8,
    )

    targetPositionRef.current.lerpVectors(basePosition, plungePosition, depth)
    shakeOffsetRef.current.set(
      Math.sin(t * 78.0) * 0.08,
      Math.cos(t * 63.0) * 0.055,
      Math.sin(t * 91.0) * 0.04,
    )
    shakeOffsetRef.current.multiplyScalar(zoomStateRef.current.shake)

    camera.position.lerp(targetPositionRef.current.add(shakeOffsetRef.current), 1 - Math.exp(-delta * 4.8))
    camera.lookAt(defaultLookAt)
  })

  return null
}
