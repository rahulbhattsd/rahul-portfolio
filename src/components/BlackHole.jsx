import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const G = 6.674e-11
const C = 3e8
const SOLAR_MASS_KG = 1.98847e30
const BLACK_HOLE_MASS_KG = 5 * SOLAR_MASS_KG

const schwarzschildRadiusMeters = (2 * G * BLACK_HOLE_MASS_KG) / (C * C)
const EVENT_HORIZON_RADIUS = 1.08
const METERS_PER_SCENE_UNIT = schwarzschildRadiusMeters / EVENT_HORIZON_RADIUS
const PHOTON_SPHERE_RADIUS = 1.5 * EVENT_HORIZON_RADIUS
const DISK_INNER_RADIUS = 2.05 * EVENT_HORIZON_RADIUS
const DISK_OUTER_RADIUS = 5.05 * EVENT_HORIZON_RADIUS
const DISK_MAJOR_RADIUS = (DISK_INNER_RADIUS + DISK_OUTER_RADIUS) * 0.5
const DISK_TUBE_RADIUS = (DISK_OUTER_RADIUS - DISK_INNER_RADIUS) * 0.5
const LENS_SHELL_RADIUS = 3.9
const LENS_SHADER_RS = EVENT_HORIZON_RADIUS / LENS_SHELL_RADIUS

function timeDilationFactor(radius, rs) {
  if (radius <= rs) return 0
  return Math.sqrt(1 - rs / radius)
}

function createGeodesicSpiral(rs, phase = 0, steps = 260) {
  const points = []

  for (let i = 0; i < steps; i += 1) {
    const t = i / (steps - 1)
    const radius = rs * (6.3 - 5.12 * Math.pow(t, 0.72))
    const phi = phase + t * Math.PI * 13 * (1 + 1.7 * t * t)
    const verticalFlutter = Math.sin(phi * 0.7 + phase) * 0.025 * (1 - t)

    points.push(
      new THREE.Vector3(
        radius * Math.cos(phi),
        radius * Math.sin(phi),
        verticalFlutter,
      ),
    )
  }

  return new THREE.CatmullRomCurve3(points)
}

const diskVertexShader = `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vLocalPosition;

  void main() {
    vUv = uv;
    vLocalPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const diskFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uRS;
  uniform float uGlow;
  uniform float uHover;

  varying vec2 vUv;
  varying vec3 vLocalPosition;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  vec3 diskTemperatureColor(float temperatureKelvin) {
    vec3 red = vec3(0.9, 0.055, 0.018);
    vec3 orange = vec3(1.0, 0.42, 0.055);
    vec3 yellowWhite = vec3(1.0, 0.96, 0.68);
    vec3 blueWhite = vec3(0.66, 0.84, 1.0);

    vec3 color = mix(red, orange, smoothstep(2600.0, 4200.0, temperatureKelvin));
    color = mix(color, yellowWhite, smoothstep(4800.0, 7200.0, temperatureKelvin));
    color = mix(color, blueWhite, smoothstep(9000.0, 18000.0, temperatureKelvin));
    return color;
  }

  void main() {
    float radius = length(vLocalPosition.xy);
    float rs = uRS;
    float diskInner = 2.05 * rs;
    float diskOuter = 5.05 * rs;
    float angle = atan(vLocalPosition.y, vLocalPosition.x);
    float time = uTime * 0.86;

    float inRadialDisk = smoothstep(diskInner, diskInner + 0.12 * rs, radius)
      * (1.0 - smoothstep(diskOuter - 0.4 * rs, diskOuter, radius));
    float tubeFade = 1.0 - smoothstep(0.1 * rs, 1.38 * rs, abs(vLocalPosition.z));
    float diskMask = inRadialDisk * tubeFade;

    float normalizedRadius = clamp((radius - diskInner) / (diskOuter - diskInner), 0.0, 1.0);
    float ratio = clamp(rs / max(radius, rs + 0.0001), 0.0001, 0.999);

    // Eq.4: T(r) = Tmax * (rs/r)^(3/4) * (1 - sqrt(rs/r))^(1/4)
    float temperatureProfile = pow(ratio, 0.75) * pow(max(0.0001, 1.0 - sqrt(ratio)), 0.25);
    float visualTemperature = mix(2400.0, 12800.0, smoothstep(0.24, 0.42, temperatureProfile));
    vec3 thermalColor = diskTemperatureColor(visualTemperature);
    thermalColor = mix(vec3(1.0, 0.92, 0.55), thermalColor, smoothstep(0.08, 0.65, normalizedRadius));

    float spiral = angle * 5.0 - time * 4.3 + (1.0 - normalizedRadius) * 12.0;
    float lanes = sin(spiral * 2.8 + normalizedRadius * 24.0);
    float fineLanes = sin(spiral * 8.0 - normalizedRadius * 52.0 + time * 1.4);
    float turbulence = noise(vec2(angle * 2.7 + time * 0.62, normalizedRadius * 14.0 - time));
    float density = mix(0.56, 1.42, lanes * 0.5 + 0.5)
      * mix(0.86, 1.2, fineLanes * 0.5 + 0.5)
      * mix(0.78, 1.28, turbulence);

    // Eq.5: beta from v_orbital = sqrt(GM / (2r - rs)), with GM/c^2 = rs/2.
    float beta = sqrt(rs / max(0.001, 2.0 * (2.0 * radius - rs)));
    beta = clamp(beta, 0.03, 0.62);
    float gamma = 1.0 / sqrt(max(0.001, 1.0 - beta * beta));
    float cosTheta = cos(angle - time * 0.5);
    float dopplerFactor = pow(1.0 / max(0.08, gamma * (1.0 - beta * cosTheta)), 4.0);
    dopplerFactor = clamp(dopplerFactor, 0.12, 3.6);

    float hotInnerFalloff = pow(1.0 - normalizedRadius, 2.2) * 1.08;
    float glowFalloff = mix(1.22, 0.38, normalizedRadius) + hotInnerFalloff;
    float hoverBoost = 1.0 + uHover * 0.72;
    float luminosity = (uGlow + 0.14) * density * glowFalloff * dopplerFactor * hoverBoost;

    float alpha = diskMask * (0.3 + density * 0.33 + hotInnerFalloff * 0.14);
    alpha *= 1.0 - smoothstep(0.88, 1.0, normalizedRadius);

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(thermalColor * luminosity, clamp(alpha, 0.0, 0.8));
  }
`

const lensVertexShader = `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vViewNormal;

  void main() {
    vUv = uv;
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const lensFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uRS;

  varying vec2 vUv;
  varying vec3 vViewNormal;

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float radius = length(uv);
    vec2 direction = radius > 0.001 ? uv / radius : vec2(0.0);

    // Eq.2: alpha = 4GM/(b*c^2), normalized visually to deflection ~ rs/r^2.
    float deflection = (2.0 * uRS) / max(radius * radius, 0.012);
    vec2 bentUv = uv - direction * deflection * 0.072;

    float bentRadius = length(bentUv);
    float bentAngle = atan(bentUv.y, bentUv.x);

    // Eq.3: photon sphere at 1.5 * rs.
    float photonSphere = 1.5 * uRS;
    float einsteinRing = exp(-abs(bentRadius - photonSphere) / (uRS * 0.22));
    float secondaryRing = exp(-abs(bentRadius - photonSphere * 1.55) / (uRS * 0.28));
    float ripple = sin(bentRadius * 48.0 - uTime * 2.2 + bentAngle * 4.0) * 0.5 + 0.5;
    float arcBreakup = smoothstep(0.12, 0.92, sin(bentAngle * 9.0 + uTime * 0.35) * 0.5 + 0.5);

    float fresnel = pow(1.0 - abs(vViewNormal.z), 2.6);
    float coreClear = smoothstep(uRS * 1.1, uRS * 1.9, bentRadius);
    float edgeFade = 1.0 - smoothstep(0.86, 1.18, radius);
    float alpha = fresnel * 0.035 + einsteinRing * 0.09 * arcBreakup + secondaryRing * 0.026 + ripple * 0.012;
    alpha *= coreClear * edgeFade;

    vec3 color = mix(vec3(0.18, 0.44, 1.0), vec3(0.9, 0.98, 1.0), einsteinRing + fresnel);
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.26));
  }
`

export default function BlackHole({ onEnter }) {
  const diskRef = useRef()
  const diskMaterialRef = useRef()
  const lensMaterialRef = useRef()
  const photonRingRef = useRef()
  const photonMaterialRef = useRef()
  const geodesicRef = useRef()
  const [hovered, setHovered] = useState(false)

  const diskUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRS: { value: EVENT_HORIZON_RADIUS },
      uGlow: { value: 0.68 },
      uHover: { value: 0 },
    }),
    [],
  )

  const lensUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRS: { value: LENS_SHADER_RS },
    }),
    [],
  )

  const geodesicCurves = useMemo(
    () => [
      createGeodesicSpiral(EVENT_HORIZON_RADIUS, 0),
      createGeodesicSpiral(EVENT_HORIZON_RADIUS, Math.PI * 0.68),
      createGeodesicSpiral(EVENT_HORIZON_RADIUS, Math.PI * 1.34),
    ],
    [],
  )

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime()
    const diskTimeScale = timeDilationFactor(DISK_INNER_RADIUS, EVENT_HORIZON_RADIUS)
    const geodesicTimeScale = timeDilationFactor(PHOTON_SPHERE_RADIUS, EVENT_HORIZON_RADIUS)

    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 1.5 * diskTimeScale
    }

    if (diskMaterialRef.current) {
      diskMaterialRef.current.uniforms.uTime.value = elapsed * diskTimeScale
      diskMaterialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        diskMaterialRef.current.uniforms.uHover.value,
        hovered ? 1 : 0,
        1 - Math.exp(-delta * 8),
      )
      diskMaterialRef.current.uniforms.uGlow.value = 0.68 + Math.sin(elapsed * 1.2) * 0.045
    }

    if (lensMaterialRef.current) {
      lensMaterialRef.current.uniforms.uTime.value = elapsed
    }

    if (photonRingRef.current) {
      const pulse = 1 + Math.sin(elapsed * 2.7) * 0.018
      photonRingRef.current.scale.set(pulse, pulse, pulse)
      photonRingRef.current.rotation.z -= delta * 0.22 * geodesicTimeScale
    }

    if (photonMaterialRef.current) {
      photonMaterialRef.current.emissiveIntensity = 2.55 + Math.sin(elapsed * 3.2) * 0.55
      photonMaterialRef.current.opacity = 0.78 + Math.sin(elapsed * 2.4) * 0.1
    }

    if (geodesicRef.current) {
      geodesicRef.current.rotation.y += delta * 0.08 * geodesicTimeScale
      geodesicRef.current.rotation.z -= delta * 0.22 * geodesicTimeScale
    }
  })

  const handlePointerOver = (event) => {
    event.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (event) => {
    event.stopPropagation()
    setHovered(false)
    document.body.style.cursor = ''
  }

  const handleClick = (event) => {
    event.stopPropagation()
    console.log('Entering Black Hole')
    onEnter?.()
  }

  return (
    <group
      userData={{
        schwarzschildRadiusMeters,
        metersPerSceneUnit: METERS_PER_SCENE_UNIT,
        massKg: BLACK_HOLE_MASS_KG,
      }}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh renderOrder={4}>
        <sphereGeometry args={[EVENT_HORIZON_RADIUS, 96, 96]} />
        <meshStandardMaterial color="#000000" metalness={0} roughness={1} />
      </mesh>

      <mesh renderOrder={20}>
        <sphereGeometry args={[EVENT_HORIZON_RADIUS * 1.006, 96, 96]} />
        <meshBasicMaterial color="#000000" transparent opacity={1} depthWrite={false} />
      </mesh>

      <mesh ref={diskRef} rotation={[1.22, 0.08, -0.18]} scale={[1, 1, 0.08]} renderOrder={2}>
        <torusGeometry args={[DISK_MAJOR_RADIUS, DISK_TUBE_RADIUS, 128, 512]} />
        <shaderMaterial
          ref={diskMaterialRef}
          uniforms={diskUniforms}
          vertexShader={diskVertexShader}
          fragmentShader={diskFragmentShader}
          transparent
          depthWrite={false}
          depthTest
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={photonRingRef} rotation={[0.1, 0, 0]} renderOrder={21}>
        <torusGeometry args={[PHOTON_SPHERE_RADIUS, 0.018, 24, 256]} />
        <meshStandardMaterial
          ref={photonMaterialRef}
          color="#dff8ff"
          emissive="#9be8ff"
          emissiveIntensity={2.7}
          metalness={0}
          roughness={0.18}
          transparent
          opacity={0.82}
          depthWrite={false}
        />
      </mesh>

      <group ref={geodesicRef} rotation={[1.22, 0.08, -0.18]} renderOrder={1}>
        {geodesicCurves.map((curve, index) => (
          <mesh key={index} renderOrder={1}>
            <tubeGeometry args={[curve, 220, 0.004, 5, false]} />
            <meshBasicMaterial
              color={index === 1 ? '#fff0a8' : '#ff9648'}
              transparent
              opacity={0.038}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      <mesh renderOrder={3}>
        <sphereGeometry args={[LENS_SHELL_RADIUS, 160, 160]} />
        <shaderMaterial
          ref={lensMaterialRef}
          uniforms={lensUniforms}
          vertexShader={lensVertexShader}
          fragmentShader={lensFragmentShader}
          transparent
          depthWrite={false}
          depthTest
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
