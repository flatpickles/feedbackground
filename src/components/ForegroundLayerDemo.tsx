import defaultSvgUrl from '../assets/diamond.svg?url'
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

export default function ForegroundLayerDemo({
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
}: ForegroundLayerDemoProps) {
  const svgUrl = useSvgUrl()

  const content: ForegroundContent =
    sourceName === 'text'
      ? { kind: 'text', text: textValue }
      : { kind: 'svg', url: svgUrl }

  return (
    <>
      <DraggableForeground
        content={content}
        passes={effectIndex[shaderName].passes}
        decay={decay}
        blurRadius={blurRadius}
        svgSize={svgSize}
        paintWhileStill={paintWhileStill}
        speed={speed}
        displacement={displacement}
        detail={detail}
        zoom={zoom}
        centerZoom={centerZoom}
        maxDpr={maxDpr}
        onGrab={onInteract}
      />
    </>
  )
}
