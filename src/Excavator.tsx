import { OrbitControls, Grid } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import { MathUtils } from 'three'
import { sampleAt } from './data'
import { useReplayStore } from './store'

const yellow = '#f3a719', dark = '#18222b', steel = '#465563'

function ExcavatorModel() {
  const time = useReplayStore((s) => s.currentTime)
  const sample = useMemo(() => sampleAt(time), [time])
  const alarm = Boolean(sample.alarm)
  return <group position={[0, .15, 0]} rotation={[0, MathUtils.degToRad(sample.swingAngle), 0]}>
    <group position={[0, .35, 0]}>
      <mesh position={[0, 0, .72]}><boxGeometry args={[2.75, .42, .42]} /><meshStandardMaterial color={dark} /></mesh>
      <mesh position={[0, 0, -.72]}><boxGeometry args={[2.75, .42, .42]} /><meshStandardMaterial color={dark} /></mesh>
      <mesh position={[0, .35, 0]}><cylinderGeometry args={[.75, .75, .25, 32]} /><meshStandardMaterial color={steel} /></mesh>
      <mesh position={[-.25, .88, 0]}><boxGeometry args={[1.8, .9, 1.45]} /><meshStandardMaterial color={yellow} /></mesh>
      <mesh position={[-.38, 1.4, .28]}><boxGeometry args={[.8, .65, .82]} /><meshStandardMaterial color="#263846" metalness={.4} roughness={.2} /></mesh>
      <group position={[.65, 1.15, 0]} rotation={[0, 0, MathUtils.degToRad(sample.boomAngle)]}>
        <mesh position={[1.2, 0, 0]}><boxGeometry args={[2.55, .28, .34]} /><meshStandardMaterial color={alarm ? '#ff514d' : yellow} emissive={alarm ? '#8e0909' : '#000'} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.22, .22, .48, 24]} /><meshStandardMaterial color={steel} /></mesh>
        <group position={[2.42, 0, 0]} rotation={[0, 0, MathUtils.degToRad(sample.armAngle)]}>
          <mesh position={[.92, 0, 0]}><boxGeometry args={[1.95, .24, .3]} /><meshStandardMaterial color={alarm ? '#ff514d' : yellow} /></mesh>
          <group position={[1.82, 0, 0]} rotation={[0, 0, MathUtils.degToRad(sample.bucketAngle)]}>
            <mesh position={[.35, -.18, 0]} rotation={[0, 0, -.45]}><boxGeometry args={[.72, .65, .72]} /><meshStandardMaterial color={alarm ? '#ff514d' : '#d98d10'} /></mesh>
          </group>
        </group>
      </group>
    </group>
  </group>
}

export default function Scene() {
  return <Canvas camera={{ position: [6.8, 4.7, 7.5], fov: 38 }} shadows>
    <color attach="background" args={['#0c1924']} /><ambientLight intensity={1.35} /><directionalLight position={[4, 8, 5]} intensity={2.2} castShadow />
    <ExcavatorModel /><Grid position={[0, .13, 0]} args={[20, 20]} cellColor="#243849" sectionColor="#36546b" fadeDistance={18} infiniteGrid />
    <OrbitControls makeDefault target={[.8, 1.1, 0]} minDistance={4} maxDistance={15} />
  </Canvas>
}
