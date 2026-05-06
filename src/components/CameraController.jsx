import { useEffect, useMemo, useRef, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'

const HOME_CAMERA = {
  position: [0, 0.78, 7.55],
  target: [0, 0.02, 0],
}

export default function CameraController({ activeSection }) {
  const controlsRef = useRef(null)
  const [controlsEnabled, setControlsEnabled] = useState(true)
  const { camera, pointer, size } = useThree()
  const isCompact = size.width < 720

  const homeCamera = useMemo(
    () => ({
      position: isCompact ? [0, 0.72, 10.2] : HOME_CAMERA.position,
      target: HOME_CAMERA.target,
    }),
    [isCompact],
  )

  const activeCamera = useMemo(() => {
    if (!activeSection) return homeCamera
    if (!isCompact) return activeSection.camera

    return {
      position: activeSection.camera.position.map((value) => value * 1.48),
      target: activeSection.camera.target,
    }
  }, [activeSection, homeCamera, isCompact])

  useEffect(() => {
    const destination = activeCamera
    const duration = activeSection ? 1.25 : 1.05
    const controls = controlsRef.current

    setControlsEnabled(false)
    gsap.killTweensOf(camera.position)
    if (controls) gsap.killTweensOf(controls.target)

    const cameraTween = gsap.to(camera.position, {
      x: destination.position[0],
      y: destination.position[1],
      z: destination.position[2],
      duration,
      ease: 'power3.inOut',
      onUpdate: () => camera.updateProjectionMatrix(),
    })

    const targetTween = controls
      ? gsap.to(controls.target, {
          x: destination.target[0],
          y: destination.target[1],
          z: destination.target[2],
          duration,
          ease: 'power3.inOut',
          onUpdate: () => controls.update(),
          onComplete: () => setControlsEnabled(!activeSection),
        })
      : null

    return () => {
      cameraTween.kill()
      targetTween?.kill()
    }
  }, [activeCamera, activeSection, camera])

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    if (!activeSection && controlsEnabled) {
      controls.target.x += (pointer.x * 0.14 - controls.target.x) * delta * 0.8
      controls.target.y += (pointer.y * 0.08 - controls.target.y) * delta * 0.8
    }

    controls.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={controlsEnabled}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.42}
      zoomSpeed={0.42}
      minDistance={4.6}
      maxDistance={10.8}
      minPolarAngle={Math.PI * 0.24}
      maxPolarAngle={Math.PI * 0.78}
      minAzimuthAngle={-Math.PI * 0.42}
      maxAzimuthAngle={Math.PI * 0.42}
    />
  )
}
