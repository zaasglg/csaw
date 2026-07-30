"use client"

import { Sparkles, useTexture } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import * as THREE from "three"

type ProgramGlobeProps = {
  activeIndex: number
  reduceMotion: boolean
}

function Earth({
  activeIndex,
  reduceMotion,
}: ProgramGlobeProps) {
  const system = useRef<THREE.Group>(null)
  const globe = useRef<THREE.Group>(null)
  const earthTexture = useTexture("/images/earth-atmosphere.jpg")
  const configuredTexture = useMemo(() => {
    const texture = earthTexture.clone()
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    texture.needsUpdate = true
    return texture
  }, [earthTexture])
  useEffect(() => () => configuredTexture.dispose(), [configuredTexture])

  useFrame(({ pointer }, delta) => {
    if (!system.current || !globe.current) return

    const targetY = -2.52 + pointer.x * 0.04
    const targetX = 0.16 + pointer.y * 0.035
    const targetScale = 0.95 + activeIndex * 0.006

    system.current.rotation.y = THREE.MathUtils.damp(
      system.current.rotation.y,
      targetY,
      2.4,
      delta
    )
    system.current.rotation.x = THREE.MathUtils.damp(
      system.current.rotation.x,
      targetX,
      2.4,
      delta
    )
    system.current.scale.x = THREE.MathUtils.damp(
      system.current.scale.x,
      targetScale,
      2.4,
      delta
    )
    system.current.scale.y = system.current.scale.x
    system.current.scale.z = system.current.scale.x

    if (!reduceMotion) {
      globe.current.rotation.y += delta * 0.004
    }
  })

  return (
    <group ref={system} rotation={[0.16, -2.52, -0.08]}>
      <group ref={globe}>
        <mesh>
          <sphereGeometry args={[2, 96, 96]} />
          <meshStandardMaterial
            map={configuredTexture}
            color="#C9D7E8"
            emissive="#102A49"
            emissiveIntensity={0.22}
            metalness={0.02}
            roughness={0.72}
          />
        </mesh>
      </group>
    </group>
  )
}

function ProgramGlobeComponent(props: ProgramGlobeProps) {
  const canvasElement = useRef<HTMLCanvasElement | null>(null)
  const [webglAvailable] = useState(() => {
    if (typeof document === "undefined") return false
    const probe = document.createElement("canvas")
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"))
  })
  const [contextLost, setContextLost] = useState(false)

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault()
    setContextLost(true)
  }, [])

  const handleContextRestored = useCallback(() => {
    setContextLost(false)
  }, [])

  const connectCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      canvasElement.current = canvas
      canvas.addEventListener("webglcontextlost", handleContextLost)
      canvas.addEventListener("webglcontextrestored", handleContextRestored)
    },
    [handleContextLost, handleContextRestored]
  )

  useEffect(() => {
    return () => {
      const canvas = canvasElement.current
      canvas?.removeEventListener("webglcontextlost", handleContextLost)
      canvas?.removeEventListener("webglcontextrestored", handleContextRestored)
    }
  }, [handleContextLost, handleContextRestored])

  return (
    <div className="relative size-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2 bg-[url('/images/earth-spherical-fallback.webp')] bg-contain bg-center bg-no-repeat"
      />
      {webglAvailable ? (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.05, 5.15], fov: 40 }}
          gl={{ antialias: true, alpha: true, powerPreference: "default" }}
          onCreated={({ gl }) => connectCanvas(gl.domElement)}
          style={{
            opacity: contextLost ? 0 : 1,
            visibility: contextLost ? "hidden" : "visible",
          }}
          className="relative z-10 h-full w-full touch-pan-y"
        >
          <fog attach="fog" args={["#0B1D33", 7.2, 12]} />
          <ambientLight intensity={0.52} color="#C9D7E8" />
          <directionalLight
            position={[-3.5, 3, 5]}
            intensity={2.8}
            color="#F4F7FB"
          />
          <pointLight
            position={[4, -2.5, 3]}
            intensity={10}
            distance={11}
            color="#A8C0D8"
          />
          <Earth {...props} />
          <Sparkles
            count={props.reduceMotion ? 18 : 42}
            scale={[8, 5, 4]}
            size={0.85}
            speed={props.reduceMotion ? 0 : 0.08}
            opacity={0.2}
            color="#E7CC65"
          />
        </Canvas>
      ) : null}
    </div>
  )
}

export default memo(ProgramGlobeComponent)
