import defaultSvgUrl from '../assets/diamond.svg?url'
import gaussianBlurFrag from '../shaders/gaussianBlur.frag'
import { effectIndex, type EffectName } from '../effects'
import type { ForegroundContent } from '../types/foreground'
import type { SvgSize } from '../types/svg'
import DraggableForeground from './DraggableForeground'

function useSvgUrl(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('svg') || defaultSvgUrl
}

export type ForegroundLayerDemoProps = {
  shaderName: EffectName
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

export default function ForegroundLayerDemo({
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
}: ForegroundLayerDemoProps) {
  const svgUrl = useSvgUrl()
  const preprocessMap = {
    none: null,
    blur: gaussianBlurFrag,
  }

  const content: ForegroundContent =
    sourceName === 'text'
      ? { kind: 'text', text: textValue }
      : { kind: 'svg', url: svgUrl }

  return (
    <>
      <DraggableForeground
        content={content}
        shader={effectIndex[shaderName].shader}
        decay={decay}
        stepSize={stepSize}
        preprocessShader={preprocessMap[preprocessName]}
        svgSize={svgSize}
        paintWhileStill={paintWhileStill}
        speed={speed}
        displacement={displacement}
        detail={detail}
        zoom={zoom}
        centerZoom={centerZoom}
        onGrab={onInteract}
      />
    </>
  )
}
