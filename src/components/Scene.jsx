import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import CameraController from './CameraController'
import FloatingCube from './FloatingCube'
import SectionPanel from './SectionPanel'
import Universe from './Universe'

export default function Scene({ sections, activeSection, onSelect, onBack }) {
  return (
    <Canvas
      className="scene-canvas"
      dpr={[1, 1.7]}
      camera={{ position: [0, 0.72, 10.2], fov: 44, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.08
        gl.outputColorSpace = THREE.SRGBColorSpace
      }}
      onPointerMissed={() => {
        if (activeSection) onBack()
      }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#03040b']} />
        <fog attach="fog" args={['#03040b', 6, 18]} />

        <hemisphereLight args={['#9bdcff', '#06040f', 0.38]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[3.5, 3.2, 4.5]} color="#5efcff" intensity={9} distance={13} />
        <pointLight position={[-4.5, -1.6, 2.5]} color="#ff6fb5" intensity={5} distance={12} />
        <spotLight
          position={[0, 4.4, 2.2]}
          angle={0.5}
          penumbra={0.75}
          color="#8b7cff"
          intensity={4.8}
          distance={12}
        />

        <Universe />
        <FloatingCube sections={sections} activeSection={activeSection} onSelect={onSelect} />
        <SectionPanel activeSection={activeSection} onBack={onBack} />
        <CameraController activeSection={activeSection} />

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom intensity={0.52} luminanceThreshold={0.18} luminanceSmoothing={0.55} mipmapBlur />
          <Vignette eskil={false} offset={0.18} darkness={0.72} />
        </EffectComposer>
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
