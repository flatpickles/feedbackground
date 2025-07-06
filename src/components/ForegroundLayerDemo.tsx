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

export type ForegroundLayerDemoProps = {
  backgroundName: 'wildflowers' | 'white'
  setBackgroundName: (name: 'wildflowers' | 'white') => void
}

export default function ForegroundLayerDemo({
  backgroundName,
  setBackgroundName,
}: ForegroundLayerDemoProps) {
  const svgUrl = useSvgUrl()
  const [stepSize, setStepSize] = useState(2)
  const preprocessMap = {
    none: null,
    blur: gaussianBlurFrag,
  }
  const [preprocessName, setPreprocessName] =
    useState<keyof typeof preprocessMap>('blur')
  const [svgSize, setSvgSize] = useState<SvgSize>({
    type: 'scaled',
    factor: 1,
  })
  const [sourceName, setSourceName] = useState<'diamond' | 'text'>('diamond')
  const [textValue, setTextValue] = useState('Hello World')
  const shaderMap = {
    motionBlur: motionBlurFrag,
    randomPaint: randomPaintFrag,
    rippleFade: rippleFadeFrag,
  }
  const [shaderName, setShaderName] =
    useState<keyof typeof shaderMap>('rippleFade')
  const [decay, setDecay] = useState(0.95)
  const [paintWhileStill, setPaintWhileStill] = useState(false)
  const [noiseSpeed, setNoiseSpeed] = useState(0.2)
  const [noiseSize, setNoiseSize] = useState(0.005)

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
        noiseSpeed={noiseSpeed}
        setNoiseSpeed={setNoiseSpeed}
        noiseSize={noiseSize}
        setNoiseSize={setNoiseSize}
      />
      <DraggableForeground
        content={content}
        shader={shaderMap[shaderName]}
        decay={decay}
        stepSize={stepSize}
        preprocessShader={preprocessMap[preprocessName]}
        svgSize={svgSize}
        paintWhileStill={paintWhileStill}
        noiseSpeed={noiseSpeed}
        noiseSize={noiseSize}
      />
    </>
  )
}
