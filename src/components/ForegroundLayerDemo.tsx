import ForegroundLayer from './ForegroundLayer'
import defaultSvgUrl from '../assets/diamond.svg?url'
import useDragAndSpring from '../hooks/useDragAndSpring'
import useFeedbackFBO from '../hooks/useFeedbackFBO'
import FeedbackPlane from './FeedbackPlane'
import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import { a } from '@react-spring/three'
import { Pane } from 'tweakpane'
import { useEffect, useState } from 'react'

function useSvgUrl(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('svg') || defaultSvgUrl
}

export default function ForegroundLayerDemo() {
  const svgUrl = useSvgUrl()
  const { bind, pose, active } = useDragAndSpring()
  const shaderMap = {
    motionBlur: motionBlurFrag,
    randomPaint: randomPaintFrag,
  }
  const [shaderName, setShaderName] = useState<keyof typeof shaderMap>('motionBlur')
  const [decay, setDecay] = useState(0.9)

  useEffect(() => {
    const pane = new Pane()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shaderInput = (pane as any).addBlade({
      view: 'list',
      label: 'shader',
      options: [
        { text: 'Motion Blur', value: 'motionBlur' },
        { text: 'Random Paint', value: 'randomPaint' },
      ],
      value: shaderName,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shaderInput.on('change', (ev: any) =>
      setShaderName(ev.value as keyof typeof shaderMap)
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decayInput = (pane as any).addBlade({
      view: 'slider',
      label: 'decay',
      min: 0,
      max: 1,
      value: decay,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decayInput.on('change', (ev: any) => setDecay(ev.value as number))

    return () => pane.dispose()
  }, [])

  const { snapshotRef, texture } = useFeedbackFBO(shaderMap[shaderName], decay, active)
  return (
    <>
      <FeedbackPlane texture={texture} />
      <a.group ref={snapshotRef} position-x={pose.x} position-y={pose.y} {...bind}>
        <ForegroundLayer
          url={svgUrl}
          color="#000000"
          size={{ type: 'scaled', factor: 0.01 }}
        />
      </a.group>
    </>
  )
}
