import { useState } from 'react'
import defaultSvgUrl from '../assets/diamond.svg?url'
import DraggableForeground from './DraggableForeground'
import DemoControls from './DemoControls'
import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import boxBlurFrag from '../shaders/boxBlur.frag'
import gaussianBlurFrag from '../shaders/gaussianBlur.frag'
import type { SvgSize } from '../types/svg'
import type { ForegroundContent } from '../types/foreground'

function useSvgUrl(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('svg') || defaultSvgUrl
}

export default function ForegroundLayerDemo() {
  const svgUrl = useSvgUrl()
  const [stepSize, setStepSize] = useState(20)
  const preprocessMap = {
    none: null,
    box: boxBlurFrag,
    gaussian: gaussianBlurFrag,
  }
  const [preprocessName, setPreprocessName] =
    useState<keyof typeof preprocessMap>('none')
  const [svgSize, setSvgSize] = useState<SvgSize>({
    type: 'scaled',
    factor: 1,
  })
  const [sourceName, setSourceName] = useState<'diamond' | 'text'>('diamond')
  const [textValue, setTextValue] = useState('Hello World')
  const [textFont, setTextFont] = useState('Arial, sans-serif')
  const shaderMap = {
    motionBlur: motionBlurFrag,
    randomPaint: randomPaintFrag,
  }
  const [shaderName, setShaderName] =
    useState<keyof typeof shaderMap>('motionBlur')
  const [decay, setDecay] = useState(0.9)

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
        textFont={textFont}
        setTextFont={setTextFont}
      />
      <DraggableForeground
        content={content}
        shader={shaderMap[shaderName]}
        decay={decay}
        stepSize={stepSize}
        preprocessShader={preprocessMap[preprocessName]}
        svgSize={svgSize}
        textFont={textFont}
      />
    </>
  )
}
