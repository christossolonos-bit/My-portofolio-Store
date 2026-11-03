import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type SceneProps = {
  accent: string
  progress: number
  phone?: boolean
}

function DriftField({
  color,
  progress,
  count,
}: {
  color: string
  progress: number
  count: number
}) {
  const points = useRef<THREE.Points>(null)
  const tint = useMemo(() => new THREE.Color(color), [color])

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34
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
    points.current.rotation.y = t * 0.01 + progress * 0.2
    points.current.rotation.x = progress * 0.06
    ;(points.current.material as THREE.PointsMaterial).color.copy(tint)
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.03} transparent opacity={0.22} depthWrite={false} />
    </points>
  )
}

function GlareSun({ progress, phone }: { progress: number; phone: boolean }) {
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.position.x = THREE.MathUtils.lerp(2.6, 2.2, progress)
      group.current.position.y = THREE.MathUtils.lerp(1.7, 1.25, progress)
      group.current.position.z = -2.2
    }
    if (core.current) {
      const pulse = 1 + Math.sin(t * 0.7) * 0.03
      core.current.scale.setScalar(pulse)
    }
    if (halo.current) {
      const pulse = 1.15 + Math.sin(t * 0.55) * 0.05
      halo.current.scale.setScalar(pulse)
    }
  })

  const coreSize = phone ? 0.55 : 0.72
  const haloSize = phone ? 1.35 : 1.7

  return (
    <group ref={group}>
      <pointLight color="#ffd27a" intensity={phone ? 1.4 : 2.1} distance={28} decay={2} />
      <mesh ref={core}>
        <sphereGeometry args={[coreSize, 32, 32]} />
        <meshBasicMaterial color="#fff1c8" />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[haloSize, 32, 32]} />
        <meshBasicMaterial color="#ffd27a" transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <mesh scale={phone ? 2.4 : 3.1}>
        <sphereGeometry args={[haloSize, 24, 24]} />
        <meshBasicMaterial color="#ffb84a" transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </group>
  )
}

function HorizonLines({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.z = state.clock.elapsedTime * 0.02
    group.current.position.y = -0.55 - progress * 0.3
  })

  return (
    <group ref={group}>
      {[2.6, 3.4, 4.3].map((radius, i) => (
        <mesh key={radius} rotation={[Math.PI / 2.15, 0, i * 0.3]}>
          <torusGeometry args={[radius, 0.005, 8, 96]} />
          <meshBasicMaterial
            color="#eceef2"
            transparent
            opacity={0.06 - i * 0.012}
          />
        </mesh>
      ))}
    </group>
  )
}

function CameraRig({ progress }: { progress: number }) {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      Math.sin(progress * Math.PI) * 0.3,
      0.04,
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      0.1 - progress * 0.18,
      0.04,
    )
    state.camera.lookAt(0, 0.2, 0)
  })
  return null
}

export function Scene({ progress, phone = false }: SceneProps) {
  const particleCount = phone ? 140 : 380

  return (
    <div className="scene-root" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.1, 7], fov: phone ? 48 : 42 }}
        dpr={phone ? [1, 1.2] : [1, 1.5]}
        gl={{ antialias: !phone, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0b0d10']} />
        <ambientLight intensity={0.18} />
        <CameraRig progress={progress} />
        <GlareSun progress={progress} phone={phone} />
        <HorizonLines progress={progress} />
        <DriftField color="#6a7380" progress={progress} count={particleCount} />
      </Canvas>
      <div className="scene-sun-glare" />
      <div className="scene-vignette" />
      <div className="scene-grain" />
    </div>
  )
}
