import { Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { SvgSize } from '../types/svg'

export type TextMeshProps = {
  text: string
  color?: string
  size?: SvgSize
}

export default function TextMesh({
  text,
  color = '#ffffff',
  size = { type: 'scaled', factor: 1 },
}: TextMeshProps) {
  const depth = 0.1
  const { viewport, camera, size: viewportSize } = useThree()
  const current = viewport.getCurrentViewport(camera, [0, 0, depth])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textRef = useRef<any>(null)
  const [bounds, setBounds] = useState<THREE.Box3 | null>(null)

  useEffect(() => {
    const troika = textRef.current
    if (troika) {
      troika.sync(() => {
        const box = new THREE.Box3().setFromObject(troika)
        setBounds(box)
      })
    }
  }, [text])

  const pixelScale = useMemo(() => {
    const factorX = current.width / viewportSize.width
    const factorY = current.height / viewportSize.height
    return Math.min(factorX, factorY)
  }, [current.width, current.height, viewportSize.width, viewportSize.height])

  const nativeWidth = bounds ? bounds.max.x - bounds.min.x : 1
  const nativeHeight = bounds ? bounds.max.y - bounds.min.y : 1

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
  }, [size, pixelScale, current.width, current.height, nativeWidth, nativeHeight])

  const position: [number, number, number] = [0, 0, depth]

  return (
    <group scale={scale} position={position}>
      <Text ref={textRef} fontSize={48} font={'GeneralSans-Bold.woff'} color={color} anchorX="center" anchorY="middle">
        {text}
      </Text>
    </group>
  )
}
