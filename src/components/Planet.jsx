import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Background Saturn-like planet with layered equatorial bands and a tilted golden ring.
 * It rotates slowly for cinematic depth and remains non-interactive.
 */
export default function Planet() {
  const planetRef = useRef(null)
  const ringRef = useRef(null)
  const bandOffsets = useMemo(() => [-0.46, -0.28, -0.1, 0.14, 0.34, 0.52], [])

  useFrame((_, delta) => {
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.045
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.015
  })

  return (
    <group position={[4.35, 2.65, -6.8]} rotation={[0.25, -0.22, -0.22]} scale={1.08}>
      <mesh ref={planetRef} receiveShadow>
        <sphereGeometry args={[1.38, 64, 64]} />
        <meshStandardMaterial color="#b8753f" roughness={0.8} metalness={0.02} emissive="#201007" emissiveIntensity={0.12} />
      </mesh>

      {bandOffsets.map((offset, index) => (
        <mesh
          key={offset}
          position={[0, offset, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1, 1, 0.02]}
        >
          <torusGeometry args={[1.22 - Math.abs(offset) * 0.35, 0.012 + index * 0.0015, 96, 8]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? '#f2b46d' : '#7b482a'}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      ))}

      <mesh ref={ringRef} rotation={[Math.PI / 2 + 0.47, 0, 0]}>
        <ringGeometry args={[1.84, 2.68, 160]} />
        <meshStandardMaterial
          color="#d7a84a"
          emissive="#8d5e17"
          emissiveIntensity={0.12}
          roughness={0.72}
          metalness={0.18}
          side={THREE.DoubleSide}
          transparent
          opacity={0.46}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
