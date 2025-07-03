import { useLoader, useThree } from '@react-three/fiber'
import { SVGLoader } from 'three-stdlib'
import { useMemo } from 'react'
import * as THREE from 'three'
import type { SvgSize } from '../types/svg'

type Props = {
  url: string
  color?: string
  size?: SvgSize
}

export default function SvgMesh({
  url,
  color = '#ffffff',
  size = { type: 'scaled', factor: 1 },
}: Props) {
  const depth = 0.1
  const { viewport, camera, size: viewportSize } = useThree()
  const current = viewport.getCurrentViewport(camera, [0, 0, depth])
  const { paths } = useLoader(SVGLoader, url)
  const shapes = useMemo(() => paths.flatMap((p) => p.toShapes(true)), [paths])
  const geometries = useMemo(
    () => shapes.map((shape) => new THREE.ShapeGeometry(shape)),
    [shapes]
  )
  const bounds = useMemo(() => {
    const box = new THREE.Box3()
    geometries.forEach((g) => {
      g.computeBoundingBox()
      if (g.boundingBox) box.union(g.boundingBox)
    })
    return box
  }, [geometries])

  const nativeWidth = bounds.max.x - bounds.min.x
  const nativeHeight = bounds.max.y - bounds.min.y
  const pixelScale = useMemo(() => {
    const factorX = current.width / viewportSize.width
    const factorY = current.height / viewportSize.height
    return Math.min(factorX, factorY)
  }, [current.width, current.height, viewportSize.width, viewportSize.height])

  const scale = useMemo(() => {
    switch (size.type) {
      case 'natural':
        return pixelScale
      case 'scaled':
        return pixelScale * size.factor
      case 'relative': {
        const base = Math.min(current.width, current.height)
        const largest = Math.max(nativeWidth, nativeHeight)
        return (size.fraction * base) / largest
      }
    }
  }, [size, current.width, current.height, pixelScale, nativeWidth, nativeHeight])

  const center = useMemo(() => bounds.getCenter(new THREE.Vector3()), [bounds])

  const position: [number, number, number] = useMemo(
    () => [-center.x * scale, -center.y * scale, depth],
    [center, scale, depth]
  )

  return (
    <group scale={scale} position={position}>
      {geometries.map((geometry, idx) => (
        <mesh key={idx} geometry={geometry}>
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
