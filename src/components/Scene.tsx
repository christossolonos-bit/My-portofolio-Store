import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type SceneProps = {
  accent: string
  progress: number
  phone?: boolean
}

/** Sparse dust lit by the sun — no floating yellow ball. */
function DriftField({ progress, count }: { progress: number; count: number }) {
  const points = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [count])

  useFrame((state) => {
    if (!points.current) return
    const t = state.clock.elapsedTime
    points.current.rotation.y = t * 0.008 + progress * 0.15
    points.current.rotation.x = progress * 0.05
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#9aa3b0"
        size={0.028}
        transparent
        opacity={0.28}
        depthWrite={false}
      />
    </points>
  )
}

/** Off-camera sun light that catches the dust — glare is CSS. */
function SunLight({ progress }: { progress: number }) {
  const light = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (!light.current) return
    light.current.position.set(
      THREE.MathUtils.lerp(6.5, 5.5, progress),
      THREE.MathUtils.lerp(3.8, 2.8, progress),
      -1.5,
    )
  })

  return (
    <pointLight
      ref={light}
      color="#ffc857"
      intensity={3.2}
      distance={40}
      decay={2}
    />
  )
}

function CameraRig({ progress }: { progress: number }) {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      Math.sin(progress * Math.PI) * 0.25,
      0.04,
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      0.05 - progress * 0.15,
      0.04,
    )
    state.camera.lookAt(0, 0.15, 0)
  })
  return null
}

export function Scene({ progress, phone = false }: SceneProps) {
  const particleCount = phone ? 120 : 320

  return (
    <div className="scene-root" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.08, 7.2], fov: phone ? 48 : 42 }}
        dpr={phone ? [1, 1.2] : [1, 1.5]}
        gl={{ antialias: !phone, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#090b0e']} />
        <ambientLight intensity={0.12} color="#8a9bb0" />
        <SunLight progress={progress} />
        <CameraRig progress={progress} />
        <DriftField progress={progress} count={particleCount} />
      </Canvas>
      <div className="scene-sun-glare" />
      <div className="scene-vignette" />
      <div className="scene-grain" />
    </div>
  )
}
