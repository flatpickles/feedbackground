import { useState } from 'react'
import defaultSvgUrl from '../assets/diamond.svg?url'
import DraggableSvg from './DraggableSvg'
import DemoControls from './DemoControls'
import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import boxBlurFrag from '../shaders/boxBlur.frag'
import gaussianBlurFrag from '../shaders/gaussianBlur.frag'
import type { SvgSize } from '../types/svg'

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
  const shaderMap = {
    motionBlur: motionBlurFrag,
    randomPaint: randomPaintFrag,
  }
  const [shaderName, setShaderName] =
    useState<keyof typeof shaderMap>('motionBlur')
  const [decay, setDecay] = useState(0.9)

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
      />
      <DraggableSvg
        svgUrl={svgUrl}
        shader={shaderMap[shaderName]}
        decay={decay}
        stepSize={stepSize}
        preprocessShader={preprocessMap[preprocessName]}
        svgSize={svgSize}
      />
    </>
  )
}
