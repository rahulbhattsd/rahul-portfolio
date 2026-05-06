import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function seededRandom(seed) {
  const value = Math.sin(seed * 928.17) * 10000
  return value - Math.floor(value)
}

/**
 * Elliptical belt of tumbling primitive asteroids orbiting the central station.
 * Each rock receives deterministic random placement, scale, and rotation speed.
 */
export default function AsteroidBelt() {
  const rocksRef = useRef([])

  const rocks = useMemo(
    () =>
      Array.from({ length: 40 }, (_, index) => {
        const angle = (index / 40) * Math.PI * 2 + (seededRandom(index + 1) - 0.5) * 0.34
        const radiusX = 2.68 + seededRandom(index + 11) * 0.54
        const radiusY = 1.1 + seededRandom(index + 21) * 0.44
        const scale = 0.05 + seededRandom(index + 31) * 0.15

        return {
          key: `asteroid-${index}`,
          position: [
            Math.cos(angle) * radiusX,
            Math.sin(angle) * radiusY - 0.04,
            (seededRandom(index + 41) - 0.5) * 1.85,
          ],
          rotation: [
            seededRandom(index + 51) * Math.PI,
            seededRandom(index + 61) * Math.PI,
            seededRandom(index + 71) * Math.PI,
          ],
          scale,
          speed: [
            0.28 + seededRandom(index + 81) * 0.72,
            0.2 + seededRandom(index + 91) * 0.58,
            0.16 + seededRandom(index + 101) * 0.62,
          ],
        }
      }),
    [],
  )

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#888888',
        roughness: 1,
        metalness: 0.2,
      }),
    [],
  )

  useFrame((_, delta) => {
    rocksRef.current.forEach((rock, index) => {
      if (!rock) return
      const speed = rocks[index].speed
      rock.rotation.x += delta * speed[0]
      rock.rotation.y += delta * speed[1]
      rock.rotation.z += delta * speed[2]
    })
  })

  return (
    <group rotation={[0.18, 0, -0.08]}>
      {rocks.map((rock, index) => (
        <mesh
          key={rock.key}
          ref={(node) => {
            rocksRef.current[index] = node
          }}
          castShadow
          receiveShadow
          geometry={geometry}
          material={material}
          position={rock.position}
          rotation={rock.rotation}
          scale={rock.scale}
        />
      ))}
    </group>
  )
}
