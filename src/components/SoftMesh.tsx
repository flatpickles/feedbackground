import { useEffect, useMemo } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import deformVert from '../shaders/deform.vert'
import type { ForegroundContent } from '../types/foreground'
import type { SvgSize } from '../types/svg'

type Props = {
  content: ForegroundContent
  size: SvgSize
  color?: string
  grabPoint: THREE.Vector3
  delta: THREE.Vector3
  rigidity: number
  density?: number
}

const frag = `
precision highp float;
uniform vec3 uColor;
uniform sampler2D uMap;
varying vec2 vUv;
void main() {
  float a = texture2D(uMap, vUv).a;
  gl_FragColor = vec4(uColor, a);
}
`

export default function SoftMesh({
  content,
  size,
  color = '#ffffff',
  grabPoint,
  delta,
  rigidity,
  density = 32,
}: Props) {
  // 1×1 transparent PNG for loader placeholder
  const BLANK =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+qCKEAAAAASUVORK5CYII='
  const svgTex = useLoader(TextureLoader, content.kind === 'svg' ? content.url : BLANK)

  const textTexture = useMemo(() => {
    if (content.kind !== 'text') return null
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const fontSize = 256
    ctx.font = `${fontSize}px sans-serif`
    const metrics = ctx.measureText(content.text)
    canvas.width = metrics.width + fontSize
    canvas.height = fontSize * 1.5
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(content.text, canvas.width / 2, canvas.height / 2)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [content])

  const map = content.kind === 'svg' ? svgTex : (textTexture as THREE.Texture)

  const { viewport, camera, size: viewportSize } = useThree()
  const depth = 0.1
  const current = viewport.getCurrentViewport(camera, [0, 0, depth])

  const pixelScale = useMemo(() => {
    const factorX = current.width / viewportSize.width
    const factorY = current.height / viewportSize.height
    return Math.min(factorX, factorY)
  }, [current.width, current.height, viewportSize.width, viewportSize.height])

  const [nativeWidth, nativeHeight] = useMemo(() => {
    const w = (map.image && (map.image as HTMLImageElement).width) || 1
    const h = (map.image && (map.image as HTMLImageElement).height) || 1
    return [w, h]
  }, [map])

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

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(nativeWidth, nativeHeight, density, density)
  }, [nativeWidth, nativeHeight, density])

  const extent = useMemo(() => Math.max(nativeWidth, nativeHeight), [nativeWidth, nativeHeight])

  /* eslint-disable react-hooks/exhaustive-deps */
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: deformVert,
      fragmentShader: frag,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uMap: { value: map },
        uGrabPoint: { value: grabPoint.clone() },
        uDelta: { value: delta.clone() },
        uRigidity: { value: rigidity },
        uExtent: { value: extent },
      },
      transparent: true,
      toneMapped: false,
    })
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    material.uniforms.uColor.value.set(color)
  }, [color, material])

  useEffect(() => {
    material.uniforms.uMap.value = map
  }, [map, material])

  useEffect(() => {
    material.uniforms.uRigidity.value = rigidity
  }, [rigidity, material])

  useEffect(() => {
    material.uniforms.uExtent.value = extent
  }, [extent, material])

  useFrame(() => {
    material.uniforms.uGrabPoint.value.copy(grabPoint).divideScalar(scale)
    material.uniforms.uDelta.value.copy(delta).divideScalar(scale)
  })

  return (
    <mesh geometry={geometry} material={material} scale={scale} position={[0, 0, depth]} />
  )
}
