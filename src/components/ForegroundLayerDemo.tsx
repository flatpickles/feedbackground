import { useState } from 'react'
import defaultSvgUrl from '../assets/diamond.svg?url'
import boxBlurFrag from '../shaders/boxBlur.frag'
import gaussianBlurFrag from '../shaders/gaussianBlur.frag'
import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import type { ForegroundContent } from '../types/foreground'
import type { SvgSize } from '../types/svg'
import DemoControls from './DemoControls'
import DraggableForeground from './DraggableForeground'

function useSvgUrl(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('svg') || defaultSvgUrl
}

export default function ForegroundLayerDemo() {
  const svgUrl = useSvgUrl()
  const [stepSize, setStepSize] = useState(2)
  const preprocessMap = {
    none: null,
    box: boxBlurFrag,
    gaussian: gaussianBlurFrag,
  }
  const [preprocessName, setPreprocessName] =
    useState<keyof typeof preprocessMap>('gaussian')
  const [svgSize, setSvgSize] = useState<SvgSize>({
    type: 'scaled',
    factor: 1,
  })
  const [sourceName, setSourceName] = useState<'diamond' | 'text'>('diamond')
  const [textValue, setTextValue] = useState('Hello World')
  const shaderMap = {
    motionBlur: motionBlurFrag,
    randomPaint: randomPaintFrag,
  }
  const [shaderName, setShaderName] =
    useState<keyof typeof shaderMap>('randomPaint')
  const [decay, setDecay] = useState(0.95)

  const content: ForegroundContent =
    sourceName === 'text'
      ? { kind: 'text', text: textValue }
      : { kind: 'svg', url: svgUrl }

  return (
    <>
      <DemoControls
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
        sourceName={sourceName}
        setSourceName={(n) => setSourceName(n as 'diamond' | 'text')}
        textValue={textValue}
        setTextValue={setTextValue}
      />
      <DraggableForeground
        content={content}
        shader={shaderMap[shaderName]}
        decay={decay}
        stepSize={stepSize}
        preprocessShader={preprocessMap[preprocessName]}
        svgSize={svgSize}
      />
    </>
  )
}
