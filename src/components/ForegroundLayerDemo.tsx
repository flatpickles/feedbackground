import { useState } from 'react'
import defaultSvgUrl from '../assets/diamond.svg?url'
import gaussianBlurFrag from '../shaders/gaussianBlur.frag'
import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import rippleFadeFrag from '../shaders/rippleFade.frag'
import type { ForegroundContent } from '../types/foreground'
import type { SvgSize } from '../types/svg'
import DemoControls from './DemoControls'
import DraggableForeground from './DraggableForeground'

function useSvgUrl(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('svg') || defaultSvgUrl
}

function useInitialText(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('text') || 'Hello'
}

export type ForegroundLayerDemoProps = {
  backgroundName: 'wildflowers' | 'white'
  setBackgroundName: (name: 'wildflowers' | 'white') => void
}

export default function ForegroundLayerDemo({
  backgroundName,
  setBackgroundName,
}: ForegroundLayerDemoProps) {
  const svgUrl = useSvgUrl()
  const [stepSize, setStepSize] = useState(1)
  const preprocessMap = {
    none: null,
    blur: gaussianBlurFrag,
  }
  const [preprocessName, setPreprocessName] =
    useState<keyof typeof preprocessMap>('blur')
  const [svgSize, setSvgSize] = useState<SvgSize>({
    type: 'scaled',
    factor: 2,
  })
  const [sourceName, setSourceName] = useState<'diamond' | 'text'>('text')
  const [textValue, setTextValue] = useState(useInitialText())
  const shaderMap = {
    motionBlur: motionBlurFrag,
    randomPaint: randomPaintFrag,
    rippleFade: rippleFadeFrag,
  }
  const [shaderName, setShaderName] =
    useState<keyof typeof shaderMap>('rippleFade')
  const [decay, setDecay] = useState(0.975)
  const [paintWhileStill, setPaintWhileStill] = useState(false)
  const [speed, setSpeed] = useState(0.05)
  const [displacement, setDisplacement] = useState(0.0015)
  const [zoom, setZoom] = useState(0)

  const content: ForegroundContent =
    sourceName === 'text'
      ? { kind: 'text', text: textValue }
      : { kind: 'svg', url: svgUrl }

  return (
    <>
      <DemoControls
        backgroundName={backgroundName}
        setBackgroundName={setBackgroundName}
        shaderName={shaderName}
        setShaderName={(n) => setShaderName(n as keyof typeof shaderMap)}
        decay={decay}
        setDecay={setDecay}
        stepSize={stepSize}
        setStepSize={setStepSize}
        preprocessName={preprocessName}
        setPreprocessName={(n) =>
          setPreprocessName(n as keyof typeof preprocessMap)
        }
        svgSize={svgSize}
        setSvgSize={setSvgSize}
        paintWhileStill={paintWhileStill}
        setPaintWhileStill={setPaintWhileStill}
        sourceName={sourceName}
        setSourceName={(n) => setSourceName(n as 'diamond' | 'text')}
        textValue={textValue}
        setTextValue={setTextValue}
        speed={speed}
        setSpeed={setSpeed}
        displacement={displacement}
        setDisplacement={setDisplacement}
        zoom={zoom}
        setZoom={setZoom}
      />
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
      />
    </>
  )
}
