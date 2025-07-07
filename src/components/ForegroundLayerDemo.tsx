import defaultSvgUrl from '../assets/diamond.svg?url'
import gaussianBlurFrag from '../shaders/gaussianBlur.frag'
import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import rippleFadeFrag from '../shaders/rippleFade.frag'
import type { ForegroundContent } from '../types/foreground'
import type { SvgSize } from '../types/svg'
import DraggableForeground from './DraggableForeground'

function useSvgUrl(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('svg') || defaultSvgUrl
}


export type ForegroundLayerDemoProps = {
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
  zoom,
  centerZoom,
  onInteract,
}: ForegroundLayerDemoProps) {
  const svgUrl = useSvgUrl()
  const preprocessMap = {
    none: null,
    blur: gaussianBlurFrag,
  }
  const shaderMap = {
    motionBlur: motionBlurFrag,
    randomPaint: randomPaintFrag,
    rippleFade: rippleFadeFrag,
  }

  const content: ForegroundContent =
    sourceName === 'text'
      ? { kind: 'text', text: textValue }
      : { kind: 'svg', url: svgUrl }

  return (
    <>
      <DraggableForeground
        content={content}
        shader={shaderMap[shaderName]}
        decay={decay}
        stepSize={stepSize}
        preprocessShader={preprocessMap[preprocessName]}
        svgSize={svgSize}
        paintWhileStill={paintWhileStill}
        speed={speed}
        displacement={displacement}
        zoom={zoom}
        centerZoom={centerZoom}
        onGrab={onInteract}
      />
    </>
  )
}
