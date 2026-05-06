import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  MeshTransmissionMaterial,
  Environment,
  Float,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'
import { useOrb } from '../hooks/useOrb'
import { useParticles } from '../hooks/useParticles'
import { useStore } from '../store/useStore'

// ── Particle Field ───────────────────────────────────────────
function ParticleField() {
  const { meshRef, geometry, material } = useParticles()
  return <points ref={meshRef} geometry={geometry} material={material} />
}

// ── Glass Rings (decorative) ─────────────────────────────────
function GlassRings() {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const ring3 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.15
      ring1.current.rotation.y = t * 0.2
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.12
      ring2.current.rotation.z = t * 0.18
    }
    if (ring3.current) {
      ring3.current.rotation.y = t * 0.1
      ring3.current.rotation.z = -t * 0.22
    }
  })

  const ringMat = (
    <meshBasicMaterial
      color="#00FFB2"
      transparent
      opacity={0.08}
      wireframe={false}
      side={THREE.DoubleSide}
    />
  )

  return (
    <group>
      <mesh ref={ring1}>
        <torusGeometry args={[1.4, 0.003, 2, 80]} />
        {ringMat}
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.7, 0.002, 2, 80]} />
        <meshBasicMaterial color="#7B61FF" transparent opacity={0.07} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring3} rotation={[0, Math.PI / 4, Math.PI / 5]}>
        <torusGeometry args={[1.9, 0.0015, 2, 80]} />
        {ringMat}
      </mesh>
    </group>
  )
}

// ── Core Glass Orb ───────────────────────────────────────────
function GlassOrb() {
  const { meshRef, groupRef } = useOrb()
  const { orb } = useStore()

  const emissiveColor = useRef(new THREE.Color(orb.color))
  const currentEmissive = useRef(new THREE.Color(orb.color))

  useFrame((_, delta) => {
    if (!meshRef.current) return
    // Smooth color transitions
    emissiveColor.current.set(orb.color)
    currentEmissive.current.lerp(emissiveColor.current, delta * 3)
  })

  return (
    <group ref={groupRef}>
      {/* Glass orb */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.85, 12]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.3}
          roughness={0.05}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.05}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#ffffff"
          attenuationColor="#00FFB2"
          attenuationDistance={0.8}
        />
      </mesh>

      {/* Inner glow core */}
      <mesh scale={0.45}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={orb.color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow halo */}
      <mesh scale={1.15}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={orb.color}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Decorative rings */}
      <GlassRings />
    </group>
  )
}

// ── Environment & Lighting ───────────────────────────────────
function SceneEnvironment() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#00FFB2" />
      <pointLight position={[-3, -2, -3]} intensity={0.8} color="#7B61FF" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
      <Environment preset="night" />
    </>
  )
}

// ── Sparkles (ambient floating lights) ───────────────────────
function AmbientSparkles() {
  return (
    <>
      <Sparkles
        count={60}
        scale={8}
        size={1.2}
        speed={0.3}
        color="#00FFB2"
        opacity={0.4}
      />
      <Sparkles
        count={30}
        scale={6}
        size={0.8}
        speed={0.2}
        color="#7B61FF"
        opacity={0.3}
      />
    </>
  )
}

// ── Camera rig (subtle drift) ─────────────────────────────────
function CameraRig() {
  const { camera } = useThree()
  const mouse = useStore((s) => s.mouse)
  const target = useRef(new THREE.Vector3(0, 0, 4))

  useFrame((_, delta) => {
    target.current.x = mouse[0] * 0.3
    target.current.y = mouse[1] * 0.2
    target.current.z = 4

    camera.position.lerp(target.current, delta * 1.5)
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ── Main Canvas Export ───────────────────────────────────────
export default function OrbScene() {
  const frameloop = useStore((s) => s.frameloop)

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4], fov: 50, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{ background: '#080808' }}
    >
      <Suspense fallback={null}>
        <SceneEnvironment />
        <CameraRig />
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
          <GlassOrb />
        </Float>
        <ParticleField />
        <AmbientSparkles />
      </Suspense>
    </Canvas>
  )
}
