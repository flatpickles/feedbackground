import { useThree, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

type Props = { texture: React.MutableRefObject<THREE.Texture> }

export default function FeedbackPlane({ texture }: Props) {
  const { viewport } = useThree()
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(() => {
    if (matRef.current && matRef.current.map !== texture.current) {
      matRef.current.map = texture.current
      matRef.current.needsUpdate = true
    }
  })
  return (
    <mesh scale={[viewport.width, viewport.height, 1]} position-z={0}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial ref={matRef} transparent toneMapped={false} />
    </mesh>
  )
}
