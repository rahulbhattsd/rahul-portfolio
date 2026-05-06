import { useMemo, useRef } from 'react'
import { Sparkles, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleField() {
  const pointsRef = useRef(null)

  const geometry = useMemo(() => {
    const count = 1300
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const palette = ['#5efcff', '#8b7cff', '#ff6fb5', '#ffd166', '#7dffae'].map(
      (color) => new THREE.Color(color),
    )

    for (let i = 0; i < count; i += 1) {
      const radius = 3.8 + Math.random() * 13
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72
      positions[i * 3 + 2] = radius * Math.cos(phi)

      const color = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    const bufferGeometry = new THREE.BufferGeometry()
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    bufferGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return bufferGeometry
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime
    pointsRef.current.rotation.y = t * 0.018
    pointsRef.current.rotation.x = Math.sin(t * 0.14) * 0.06
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.72}
        size={0.018}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function NebulaRibbon({ color, offset = 0, rotation = [0, 0, 0], scale = 1 }) {
  const meshRef = useRef(null)
  const geometry = useMemo(() => {
    const points = Array.from({ length: 10 }, (_, index) => {
      const t = index / 9
      return new THREE.Vector3(
        (t - 0.5) * 12,
        Math.sin(t * Math.PI * 2 + offset) * 0.58,
        Math.cos(t * Math.PI * 1.45 + offset) * 1.2,
      )
    })

    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 120, 0.022, 8, false)
  }, [offset])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 0.12 + offset) * 0.04
  })

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={rotation} scale={scale}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.16}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function BlackHole() {
  const groupRef = useRef(null)
  const diskRef = useRef(null)
  const innerDiskRef = useRef(null)
  const photonRef = useRef(null)
  const upperLensRef = useRef(null)
  const lowerLensRef = useRef(null)
  const lensRef = useRef(null)

  const particleDisk = useMemo(() => {
    const count = 920
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const hot = new THREE.Color('#ffd166')
    const whiteHot = new THREE.Color('#fff4c9')
    const warm = new THREE.Color('#ff6fb5')
    const cold = new THREE.Color('#5efcff')

    for (let i = 0; i < count; i += 1) {
      const radius = 0.66 + Math.random() * 1.62
      const theta = Math.random() * Math.PI * 2
      const turbulence = Math.sin(theta * 4 + radius * 3.2) * 0.035
      const thickness = (Math.random() - 0.5) * (0.045 + radius * 0.025)
      positions[i * 3] = Math.cos(theta) * radius
      positions[i * 3 + 1] = thickness
      positions[i * 3 + 2] = Math.sin(theta) * radius * 0.31 + turbulence

      const color = radius < 0.9 ? whiteHot : i % 4 === 0 ? cold : i % 2 === 0 ? warm : hot
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      sizes[i] = radius < 0.9 ? 1 : 0.7
    }

    const bufferGeometry = new THREE.BufferGeometry()
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    bufferGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    bufferGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return bufferGeometry
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.12
      groupRef.current.rotation.z = -0.1 + Math.sin(t * 0.12) * 0.025
    }
    if (diskRef.current) diskRef.current.rotation.z += delta * 0.22
    if (innerDiskRef.current) innerDiskRef.current.rotation.z -= delta * 0.34
    if (photonRef.current) photonRef.current.rotation.z += delta * 0.46
    if (upperLensRef.current) upperLensRef.current.rotation.z = 0.18 + Math.sin(t * 0.22) * 0.025
    if (lowerLensRef.current) lowerLensRef.current.rotation.z = -0.18 - Math.sin(t * 0.2) * 0.02
    if (lensRef.current) lensRef.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.025)
  })

  return (
    <group ref={groupRef} position={[3.35, 1.08, -6.15]} rotation={[0.34, -0.46, -0.1]} scale={0.78}>
      <mesh ref={lensRef} scale={[1.58, 1.58, 1.58]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshBasicMaterial color="#05050a" transparent opacity={0.98} />
      </mesh>

      <mesh scale={[1.92, 1.92, 1.92]}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshBasicMaterial
          color="#5efcff"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]} scale={[1.46, 1.46, 0.28]}>
        <torusGeometry args={[0.96, 0.11, 18, 256]} />
        <meshBasicMaterial
          color="#ffd166"
          transparent
          opacity={0.62}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={innerDiskRef} rotation={[Math.PI / 2, 0, 0]} scale={[1.08, 1.08, 0.22]}>
        <torusGeometry args={[0.77, 0.052, 14, 256]} />
        <meshBasicMaterial
          color="#fff4c9"
          transparent
          opacity={0.58}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={photonRef} rotation={[Math.PI / 2, 0, 0]} scale={[0.92, 0.92, 0.18]}>
        <torusGeometry args={[0.6, 0.018, 12, 256]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.82}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.9, 1.9, 0.2]}>
        <torusGeometry args={[0.98, 0.009, 10, 256]} />
        <meshBasicMaterial
          color="#5efcff"
          transparent
          opacity={0.34}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={upperLensRef} position={[0, 0.22, 0]} rotation={[Math.PI / 2.7, 0, 0.18]} scale={[1.28, 0.32, 0.08]}>
        <torusGeometry args={[0.92, 0.026, 10, 192]} />
        <meshBasicMaterial
          color="#ffd166"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={lowerLensRef} position={[0, -0.25, 0]} rotation={[Math.PI / 2.45, 0, -0.18]} scale={[1.18, 0.24, 0.08]}>
        <torusGeometry args={[0.94, 0.02, 10, 192]} />
        <meshBasicMaterial
          color="#ff6fb5"
          transparent
          opacity={0.24}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <points geometry={particleDisk} rotation={[0, 0, 0]}>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.82}
          size={0.022}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}

export default function Universe() {
  const groupRef = useRef(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.position.x += (state.pointer.x * 0.22 - groupRef.current.position.x) * delta * 0.9
    groupRef.current.position.y += (state.pointer.y * 0.12 - groupRef.current.position.y) * delta * 0.9
  })

  return (
    <group ref={groupRef}>
      <Stars radius={88} depth={48} count={2200} factor={4.8} saturation={0.18} fade speed={0.35} />
      <Sparkles
        count={110}
        scale={[10, 5.5, 10]}
        size={2.4}
        speed={0.25}
        opacity={0.42}
        color="#bdfcff"
      />
      <ParticleField />
      <BlackHole />
      <group position={[0, 0, -5.8]}>
        <NebulaRibbon color="#5efcff" offset={0.2} rotation={[0.2, 0.1, -0.12]} scale={1.25} />
        <NebulaRibbon color="#8b7cff" offset={1.8} rotation={[-0.1, -0.22, 0.24]} scale={1.08} />
        <NebulaRibbon color="#ff6fb5" offset={3.2} rotation={[0.25, 0.18, 0.42]} scale={0.92} />
      </group>
    </group>
  )
}
