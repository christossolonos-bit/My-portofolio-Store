import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type SceneProps = {
  accent: string
  progress: number
}

function ParticleField({ accent, progress }: SceneProps) {
  const points = useRef<THREE.Points>(null)
  const count = 900
  const accentColor = useMemo(() => new THREE.Color(accent), [accent])

  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16
      speeds[i] = 0.2 + Math.random() * 0.8
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return { geometry, speeds }
  }, [])

  useFrame((state) => {
    if (!points.current) return
    const pos = points.current.geometry.attributes.position.array as Float32Array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3 + 1] += Math.sin(t * speeds[i] + i) * 0.0015
      pos[i3] += Math.cos(t * speeds[i] * 0.4 + i) * 0.0008
    }
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.rotation.y = t * 0.02 + progress * 0.4
    points.current.rotation.x = progress * 0.15
    const mat = points.current.material as THREE.PointsMaterial
    mat.color.lerp(accentColor, 0.05)
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.035} transparent opacity={0.55} depthWrite={false} />
    </points>
  )
}

function OrbitRings({ accent, progress }: SceneProps) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.z = t * 0.08
    group.current.rotation.x = 0.55 + progress * 0.35
    group.current.rotation.y = t * 0.12 + progress * Math.PI * 0.6
    group.current.position.y = Math.sin(t * 0.4) * 0.15 - progress * 0.4
  })

  return (
    <group ref={group} scale={1.15}>
      {[1.6, 2.2, 2.9].map((radius, i) => (
        <mesh key={radius} rotation={[Math.PI / 2, 0, i * 0.4]}>
          <torusGeometry args={[radius, 0.012, 16, 128]} />
          <meshBasicMaterial color={accent} transparent opacity={0.35 - i * 0.08} />
        </mesh>
      ))}
    </group>
  )
}

function CoreOrb({ accent, progress }: SceneProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const glow = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mesh.current) {
      mesh.current.rotation.x = t * 0.25 + progress
      mesh.current.rotation.y = t * 0.35
      const scale = 1 + Math.sin(t * 1.5) * 0.04
      mesh.current.scale.setScalar(scale)
      const mat = mesh.current.material as THREE.MeshStandardMaterial
      mat.emissive.lerp(new THREE.Color(accent), 0.08)
      mat.color.lerp(new THREE.Color(accent), 0.08)
    }
    if (glow.current) {
      const pulse = 1.35 + Math.sin(t * 2) * 0.08
      glow.current.scale.setScalar(pulse)
      const mat = glow.current.material as THREE.MeshBasicMaterial
      mat.color.lerp(new THREE.Color(accent), 0.08)
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.55}
          metalness={0.7}
          roughness={0.25}
          wireframe
        />
      </mesh>
      <mesh ref={glow}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.08} />
      </mesh>
    </Float>
  )
}

function CameraRig({ progress }: { progress: number }) {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      Math.sin(progress * Math.PI * 2) * 0.6,
      0.05,
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      0.2 - progress * 0.3,
      0.05,
    )
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export function Scene({ accent, progress }: SceneProps) {
  return (
    <div className="scene-root" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.2, 6.5], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#070b12']} />
        <ambientLight intensity={0.35} />
        <pointLight position={[4, 3, 5]} intensity={1.2} color={accent} />
        <pointLight position={[-4, -2, -3]} intensity={0.5} color="#1a2a3a" />
        <Stars radius={60} depth={40} count={1800} factor={3} saturation={0} fade speed={0.6} />
        <CameraRig progress={progress} />
        <CoreOrb accent={accent} progress={progress} />
        <OrbitRings accent={accent} progress={progress} />
        <ParticleField accent={accent} progress={progress} />
      </Canvas>
      <div className="scene-vignette" />
      <div className="scene-grain" />
    </div>
  )
}
