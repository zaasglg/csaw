"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef, useSyncExternalStore } from "react"
import * as THREE from "three"

const WIRE_COLOR = new THREE.Color("#b39ddb")
const DUST_COLOR = new THREE.Color("#c5a8ff")
const PLANE_SIZE_X = 36
const PLANE_SIZE_Z = 22
const PLANE_SEGMENTS_X = 150
const PLANE_SEGMENTS_Z = 100
const DUST_COUNT = 320

const waveVertexShader = /* glsl */ `
  uniform float uTime;
  varying float vElevation;
  varying vec2 vUv;

  float elevation(vec2 p) {
    // Speed factor keeps the swell lively without touching JS timing.
    float t = uTime * 2.2;
    float e = 0.0;
    // Broad primary swell — low spatial frequency, generous height.
    e += sin(p.x * 0.15 + t * 0.28) * cos(p.y * 0.15 + t * 0.22) * 1.45;
    e += sin(p.x * 0.10 - t * 0.16) * 0.9;
    // Secondary rhythm for organic motion.
    e += sin(p.y * 0.18 + t * 0.20) * 0.5;
    e += cos((p.x + p.y) * 0.22 - t * 0.14) * 0.35;
    return e;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float e = elevation(pos.xy);
    pos.z += e;
    vElevation = e;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const waveFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vElevation;
  varying vec2 vUv;

  void main() {
    float farFade = smoothstep(1.0, 0.7, vUv.y);
    float sideFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
    float crest = 0.7 + 0.5 * smoothstep(0.3, 2.2, vElevation);
    float alpha = uOpacity * farFade * sideFade * crest;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`

function WavePlane({ frozen }: { frozen: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: WIRE_COLOR },
      uOpacity: { value: 0.4 },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (!frozen && materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, -3]}>
      <planeGeometry
        args={[PLANE_SIZE_X, PLANE_SIZE_Z, PLANE_SEGMENTS_X, PLANE_SEGMENTS_Z]}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={waveVertexShader}
        fragmentShader={waveFragmentShader}
        uniforms={uniforms}
        wireframe
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

function ParticleDust({ frozen }: { frozen: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    // Deterministic mulberry32 PRNG keeps render pure and dust stable.
    let seed = 0x9e3779b9
    const random = () => {
      seed = (seed + 0x6d2b79f5) | 0
      let value = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296
    }

    const array = new Float32Array(DUST_COUNT * 3)
    for (let i = 0; i < DUST_COUNT; i += 1) {
      array[i * 3] = (random() - 0.5) * 24
      array[i * 3 + 1] = -0.6 + random() * 5.4
      array[i * 3 + 2] = -9 + random() * 12
    }
    return array
  }, [])

  useFrame(({ clock }) => {
    if (frozen || !pointsRef.current) return
    const time = clock.elapsedTime
    pointsRef.current.rotation.y = time * 0.008
    pointsRef.current.position.y = Math.sin(time * 0.12) * 0.12
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={DUST_COLOR}
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  )
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function useReducedMotionPreference() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  )
}

export function WaveBackground() {
  const reduceMotion = useReducedMotionPreference()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 2.3, 13], fov: 32 }}
        onCreated={({ camera }) => {
          camera.lookAt(0, -0.15, 0)
        }}
      >
        <WavePlane frozen={reduceMotion} />
        <ParticleDust frozen={reduceMotion} />
      </Canvas>
    </div>
  )
}
