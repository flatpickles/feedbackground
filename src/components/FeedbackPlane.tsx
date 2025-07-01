import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

type Props = { texture: THREE.Texture }

export default function FeedbackPlane({ texture }: Props) {
  const { viewport } = useThree()
  return (
    <mesh scale={[viewport.width, viewport.height, 1]} position-z={0}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
      />
    </mesh>
  )
}
