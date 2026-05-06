import { Suspense, useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import BlackHole from './BlackHole'
import CameraRig from './CameraRig'

export default function SpaceScene() {
  const [entrySignal, setEntrySignal] = useState(0)

  const handleEnterBlackHole = useCallback(() => {
    setEntrySignal((signal) => signal + 1)
  }, [])

  return (
    <div className="space-scene-shell" aria-hidden="true">
      <Canvas
        className="space-scene-canvas"
        style={{ display: 'block', width: '100vw', height: '100vh' }}
        camera={{ position: [0, 0.62, 8.4], fov: 46, near: 0.1, far: 160 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#04050d', 1)
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.2
        }}
      >
        <color attach="background" args={['#04050d']} />
        <fog attach="fog" args={['#04050d', 10, 80]} />
        <ambientLight intensity={0.025} />

        <Suspense fallback={null}>
          <Stars
            count={10000}
            radius={120}
            depth={100}
            factor={6}
            fade
            saturation={0}
            speed={0.22}
          />
          <BlackHole onEnter={handleEnterBlackHole} />
          <CameraRig entrySignal={entrySignal} />
        </Suspense>

        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.82} mipmapBlur />
          <Vignette offset={0.28} darkness={1.2} eskil={false} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
