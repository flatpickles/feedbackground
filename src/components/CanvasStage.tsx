import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import ForegroundLayerDemo from './ForegroundLayerDemo'
import type { SvgSize } from '../types/svg'

export type CanvasStageProps = {
  shaderName: 'motionBlur' | 'randomPaint' | 'rippleFade'
  decay: number
  stepSize: number
  preprocessName: 'none' | 'blur'
  svgSize: SvgSize
  paintWhileStill: boolean
  sourceName: 'diamond' | 'text'
  textValue: string
  speed: number
  displacement: number
  detail: number
  zoom: number
  centerZoom: boolean
  onInteract: () => void
}

export default function CanvasStage({
  shaderName,
  decay,
  stepSize,
  preprocessName,
  svgSize,
  paintWhileStill,
  sourceName,
  textValue,
  speed,
  displacement,
  detail,
  zoom,
  centerZoom,
  onInteract,
}: CanvasStageProps) {
  return (
    <Canvas className="w-full h-full">
      <Suspense fallback={null}>
        <ForegroundLayerDemo
          shaderName={shaderName}
          decay={decay}
          stepSize={stepSize}
          preprocessName={preprocessName}
          svgSize={svgSize}
          paintWhileStill={paintWhileStill}
          sourceName={sourceName}
          textValue={textValue}
          speed={speed}
          displacement={displacement}
          detail={detail}
          zoom={zoom}
          centerZoom={centerZoom}
          onInteract={onInteract}
        />
      </Suspense>
    </Canvas>
  )
}
