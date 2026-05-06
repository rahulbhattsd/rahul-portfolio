import { useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const WormholeMaterial = shaderMaterial(
  { uTime: 0 },
  `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float radius = length(uv);
      float angle = atan(uv.y, uv.x);
      float spiral = sin(angle * 6.0 - uTime * 2.6 + radius * 18.0);
      float ripple = sin(radius * 36.0 - uTime * 4.0) * 0.5 + 0.5;

      vec3 purple = vec3(0.3, 0.0, 0.6);
      vec3 blue = vec3(0.0, 0.3, 1.0);
      vec3 color = mix(purple, blue, smoothstep(-0.85, 0.95, spiral));
      color *= 0.55 + ripple * 0.5;

      float innerFade = smoothstep(0.16, 0.5, radius);
      float outerFade = 1.0 - smoothstep(0.86, 1.08, radius);
      float alpha = innerFade * outerFade * (0.62 + spiral * 0.18);

      gl_FragColor = vec4(color, alpha);
    }
  `,
)

extend({ WormholeMaterial })

/**
 * Animated shader torus that simulates a distant gravitational lensing wormhole.
 * The fragment shader uses polar coordinates to create a rotating purple-blue swirl.
 */
export default function Wormhole() {
  const groupRef = useRef(null)
  const materialRef = useRef(null)
  const lightRef = useRef(null)

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.07
      groupRef.current.rotation.y += delta * 0.025
    }

    if (materialRef.current) materialRef.current.uTime += delta

    if (lightRef.current) {
      lightRef.current.intensity = 0.75 + Math.sin(clock.getElapsedTime() * 0.8) * 0.25
    }
  })

  return (
    <group ref={groupRef} position={[0.55, 0.05, -15]} rotation={[0.24, -0.18, 0]} scale={1.42}>
      <mesh>
        <torusGeometry args={[2.05, 0.38, 96, 220]} />
        <wormholeMaterial ref={materialRef} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, -0.06]}>
        <circleGeometry args={[1.28, 96]} />
        <meshBasicMaterial color="#010105" transparent opacity={0.82} depthWrite={false} />
      </mesh>
      <pointLight ref={lightRef} color="#8a4cff" intensity={0.8} distance={12} position={[0, 0, 0.4]} />
    </group>
  )
}
