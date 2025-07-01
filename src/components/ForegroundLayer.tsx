import { useLoader } from '@react-three/fiber'
import { SVGLoader } from 'three-stdlib'
import { useMemo } from 'react'
import * as THREE from 'three'

type Props = {
  url: string
  color?: string
}

export default function ForegroundLayer({ url, color = '#ffffff' }: Props) {
  const { paths } = useLoader(SVGLoader, url)
  const shapes = useMemo(() => paths.flatMap((p) => p.toShapes(true)), [paths])

  return (
    <group scale={0.01} position-z={0.1}>
      {shapes.map((shape, idx) => (
        <mesh key={idx} geometry={new THREE.ShapeGeometry(shape)}>
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
