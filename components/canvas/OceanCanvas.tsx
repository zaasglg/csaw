"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec3 displaced = position;

    float swell =
      sin(displaced.x * 0.62 + uTime * 0.62) * 0.19 +
      sin(displaced.y * 0.78 - uTime * 0.46) * 0.14 +
      sin((displaced.x + displaced.y) * 1.35 + uTime * 0.38) * 0.055;

    float detail =
      sin(displaced.x * 2.6 - uTime * 0.9) *
      cos(displaced.y * 2.1 + uTime * 0.72) * 0.026;

    vec2 pointerSpace = vec2(displaced.x / 7.5, displaced.y / 6.0);
    float pointerDistance = distance(pointerSpace, uPointer * 0.52);
    float pointerMask = 1.0 - smoothstep(0.0, 1.2, pointerDistance);
    float interaction =
      sin(pointerDistance * 15.0 - uTime * 2.15) *
      pointerMask * 0.075;

    displaced.z += swell + detail + interaction;
    vElevation = swell + detail + interaction;

    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;

  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
    if (!gl_FrontFacing) normal *= -1.0;

    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 lightDirection = normalize(vec3(-0.45, 0.9, 0.6));

    float diffuse = max(dot(normal, lightDirection), 0.0);
    float fresnel = pow(1.0 - abs(dot(normal, viewDirection)), 3.0);
    float specular = pow(
      max(dot(reflect(-lightDirection, normal), viewDirection), 0.0),
      42.0
    );

    float current =
      sin(vUv.x * 52.0 + uTime * 0.45) *
      sin(vUv.y * 31.0 - uTime * 0.34);
    float shimmer = smoothstep(0.72, 1.0, current) * 0.08;
    float crest = smoothstep(0.14, 0.34, vElevation);

    vec3 deepWater = vec3(0.02, 0.04, 0.12);
    vec3 marineBlue = vec3(0.08, 0.18, 0.42);
    vec3 sunlitBlue = vec3(0.31, 0.55, 1.0);

    vec3 color = mix(deepWater, marineBlue, diffuse * 0.78 + 0.15);
    color = mix(color, sunlitBlue, fresnel * 0.34 + crest * 0.2);
    color += sunlitBlue * (specular * 0.7 + shimmer);

    float farEdge = smoothstep(0.02, 0.3, 1.0 - vUv.y);
    float sideFade =
      smoothstep(0.0, 0.08, vUv.x) *
      smoothstep(0.0, 0.08, 1.0 - vUv.x);
    float alpha = mix(0.42, 0.98, farEdge) * sideFade;

    gl_FragColor = vec4(color, alpha);
  }
`

function OceanSurface() {
  const material = useRef<THREE.ShaderMaterial>(null)
  const pointer = useRef(new THREE.Vector2())
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
    }),
    []
  )

  useFrame(({ pointer: scenePointer }, delta) => {
    if (!material.current) return

    material.current.uniforms.uTime.value += Math.min(delta, 0.05)
    pointer.current.lerp(scenePointer, 0.04)
    material.current.uniforms.uPointer.value.copy(pointer.current)
  })

  return (
    <mesh
      rotation={[-Math.PI / 2.18, 0, -0.025]}
      position={[0.7, -1.15, -0.7]}
    >
      <planeGeometry args={[18, 15, 144, 104]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
        transparent
        depthWrite
      />
    </mesh>
  )
}

export default function OceanCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 2.15, 6.2], fov: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="touch-none"
    >
      <color attach="background" args={["#0B1D33"]} />
      <fog attach="fog" args={["#0B1D33", 5.8, 15]} />
      <OceanSurface />
    </Canvas>
  )
}
