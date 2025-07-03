import { useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const texRef = useRef<THREE.CanvasTexture | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const [bounds, setBounds] = useState<{ width: number; height: number } | null>(
    null
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const fontSpec = `48px ${font}`
    ctx.font = fontSpec
    const metrics = ctx.measureText(text)
    const width = Math.ceil(metrics.width)
    const height = 48
    canvas.width = width
    canvas.height = height
    ctx.font = fontSpec
    ctx.fillStyle = color
    ctx.textBaseline = 'top'
    ctx.fillText(text, 0, 0)
    if (!texRef.current) {
      texRef.current = new THREE.CanvasTexture(canvas)
      texRef.current.needsUpdate = true
    } else {
      texRef.current.needsUpdate = true
    }
    setBounds({ width, height })
    if (meshRef.current) {
      meshRef.current.geometry.dispose()
      meshRef.current.geometry = new THREE.PlaneGeometry(width, height)
    }
  }, [text, font, color])

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

  const position: [number, number, number] = useMemo(
    () =>
      bounds
        ? [-bounds.width * 0.5 * scale, -bounds.height * 0.5 * scale, depth]
        : [0, 0, depth],
    [bounds, scale, depth]
  )

  return (
    <group scale={scale} position={position}>
      <mesh ref={meshRef}>
        {/* geometry will be replaced when canvas draws */}
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texRef.current ?? undefined}
          transparent
          toneMapped={false}
        />
      </mesh>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </group>
  )
}
