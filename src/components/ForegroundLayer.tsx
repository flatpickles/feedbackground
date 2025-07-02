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

export default function ForegroundLayer({
  url,
  color = '#ffffff',
  size = { type: 'scaled', factor: 1 },
}: Props) {
  const { viewport, size: viewportSize } = useThree()
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
    const factorX = viewport.width / viewportSize.width
    const factorY = viewport.height / viewportSize.height
    return Math.min(factorX, factorY)
  }, [viewport.width, viewport.height, viewportSize.width, viewportSize.height])

  const scale = useMemo(() => {
    switch (size.type) {
      case 'natural':
        return pixelScale
      case 'scaled':
        return pixelScale * size.factor
      case 'relative': {
        const base = Math.min(viewport.width, viewport.height)
        const largest = Math.max(nativeWidth, nativeHeight)
        return (size.fraction * base) / largest
      }
    }
  }, [size, viewport.width, viewport.height, pixelScale, nativeWidth, nativeHeight])

  const center = useMemo(() => bounds.getCenter(new THREE.Vector3()), [bounds])

  const position: [number, number, number] = useMemo(
    () => [-center.x * scale, -center.y * scale, 0.1],
    [center, scale]
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
