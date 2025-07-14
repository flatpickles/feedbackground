import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import ForegroundLayerDemo from './ForegroundLayerDemo'
import type { SvgSize } from '../types/svg'
import type { EffectName } from '../effects'

export type CanvasStageProps = {
  shaderName: EffectName
  decay: number
  blurRadius: number
  svgSize: SvgSize
  paintWhileStill: boolean
  sourceName: 'diamond' | 'text'
  textValue: string
  speed: number
  displacement: number
  detail: number
  zoom: number
  centerZoom: boolean
  maxDpr?: number
  onInteract: () => void
}

export default function CanvasStage({
  shaderName,
  decay,
  blurRadius,
  svgSize,
  paintWhileStill,
  sourceName,
  textValue,
  speed,
  displacement,
  detail,
  zoom,
  centerZoom,
  maxDpr,
  onInteract,
}: CanvasStageProps) {
  return (
    <Canvas className="w-full h-full" style={{ touchAction: 'none' }}>
      <Suspense fallback={null}>
        <ForegroundLayerDemo
          shaderName={shaderName}
          decay={decay}
          blurRadius={blurRadius}
          svgSize={svgSize}
          paintWhileStill={paintWhileStill}
          sourceName={sourceName}
          textValue={textValue}
          speed={speed}
          displacement={displacement}
          detail={detail}
          zoom={zoom}
          centerZoom={centerZoom}
          maxDpr={maxDpr}
          onInteract={onInteract}
        />
      </Suspense>
    </Canvas>
  )
}
