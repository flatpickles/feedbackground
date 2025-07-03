import { Html } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { SvgSize } from '../types/svg'

export type TextMeshProps = {
  text: string
  font?: string
  color?: string
  size?: SvgSize
}

export default function TextMesh({
  text,
  font = 'Arial, sans-serif',
  color = '#ffffff',
  size = { type: 'scaled', factor: 1 },
}: TextMeshProps) {
  const depth = 0.1
  const { viewport, camera, size: viewportSize } = useThree()
  const current = viewport.getCurrentViewport(camera, [0, 0, depth])
  const textRef = useRef<HTMLDivElement | null>(null)
  const [bounds, setBounds] = useState<{ width: number; height: number } | null>(
    null
  )

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const measure = () =>
      setBounds({ width: el.offsetWidth, height: el.offsetHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [text, font])

  const pixelScale = useMemo(() => {
    const factorX = current.width / viewportSize.width
    const factorY = current.height / viewportSize.height
    return Math.min(factorX, factorY)
  }, [current.width, current.height, viewportSize.width, viewportSize.height])

  const nativeWidth = bounds ? bounds.width : 1
  const nativeHeight = bounds ? bounds.height : 1

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
      <Html transform>
        <div
          ref={textRef}
          style={{
            fontFamily: font,
            fontSize: '48px',
            color,
            whiteSpace: 'pre',
            lineHeight: '1em',
          }}
        >
          {text}
        </div>
      </Html>
    </group>
  )
}
