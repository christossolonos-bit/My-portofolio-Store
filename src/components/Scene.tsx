import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type SceneProps = {
  accent: string
  progress: number
  phone?: boolean
}

/** Quiet field of points — no orbs, stars, or glow. */
function DriftField({
  ink,
  progress,
  count,
}: {
  ink: string
  progress: number
  count: number
}) {
  const points = useRef<THREE.Points>(null)
  const inkColor = useMemo(() => new THREE.Color(ink), [ink])

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [count])

  useFrame((state) => {
    if (!points.current) return
    const t = state.clock.elapsedTime
    points.current.rotation.y = t * 0.012 + progress * 0.25
    points.current.rotation.x = progress * 0.08
    const mat = points.current.material as THREE.PointsMaterial
    mat.color.copy(inkColor)
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.028} transparent opacity={0.28} depthWrite={false} />
    </points>
  )
}

function HorizonLines({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.z = state.clock.elapsedTime * 0.03
    group.current.position.y = -0.4 - progress * 0.35
  })

  return (
    <group ref={group}>
      {[2.4, 3.2, 4.1].map((radius, i) => (
        <mesh key={radius} rotation={[Math.PI / 2.2, 0, i * 0.35]}>
          <torusGeometry args={[radius, 0.006, 8, 96]} />
          <meshBasicMaterial color="#12141a" transparent opacity={0.12 - i * 0.02} />
        </mesh>
      ))}
    </group>
  )
}

function CameraRig({ progress }: { progress: number }) {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      Math.sin(progress * Math.PI) * 0.35,
      0.04,
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      0.15 - progress * 0.2,
      0.04,
    )
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export function Scene({ progress, phone = false }: SceneProps) {
  const particleCount = phone ? 160 : 420

  return (
    <div className="scene-root" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.15, 7], fov: phone ? 48 : 42 }}
        dpr={phone ? [1, 1.2] : [1, 1.5]}
        gl={{ antialias: !phone, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#e9ebef']} />
        <ambientLight intensity={0.8} />
        <CameraRig progress={progress} />
        <HorizonLines progress={progress} />
        <DriftField ink="#12141a" progress={progress} count={particleCount} />
      </Canvas>
      <div className="scene-vignette" />
      <div className="scene-grain" />
    </div>
  )
}
