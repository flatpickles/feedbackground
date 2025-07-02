import { a } from '@react-spring/three'
import { useEffect, useState } from 'react'
import { Pane } from 'tweakpane'
import defaultSvgUrl from '../assets/diamond.svg?url'
import useDragAndSpring from '../hooks/useDragAndSpring'
import useFeedbackFBO from '../hooks/useFeedbackFBO'
import useFrameInterpolator from '../hooks/useFrameInterpolator'
import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import FeedbackPlane from './FeedbackPlane'
import ForegroundLayer from './ForegroundLayer'
import type { SvgSize } from '../types/svg'

function useSvgUrl(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('svg') || defaultSvgUrl
}

export default function ForegroundLayerDemo() {
  const svgUrl = useSvgUrl()
  const { bind, pose, active, interactionSession } = useDragAndSpring()
  const [stepSize, setStepSize] = useState(20)
  const [svgSize, setSvgSize] = useState<SvgSize>({
    type: 'scaled',
    factor: 1,
  })
  const interpQueue = useFrameInterpolator(pose, stepSize)
  const shaderMap = {
    motionBlur: motionBlurFrag,
    randomPaint: randomPaintFrag,
  }
  const [shaderName, setShaderName] =
    useState<keyof typeof shaderMap>('motionBlur')
  const [decay, setDecay] = useState(0.9)

  useEffect(() => {
    const pane = new Pane()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const effectFolder = (pane as any).addFolder({ title: 'Effect' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fgFolder = (pane as any).addFolder({ title: 'Foreground' })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shaderInput = (effectFolder as any).addBlade({
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
    const decayInput = (effectFolder as any).addBlade({
      view: 'slider',
      label: 'decay',
      min: 0.8,
      max: 1,
      value: decay,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decayInput.on('change', (ev: any) => setDecay(ev.value))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interpInput = (effectFolder as any).addBlade({
      view: 'slider',
      label: 'step(px)',
      min: 1,
      max: 25,
      value: stepSize,
      step: 1,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interpInput.on('change', (ev: any) => setStepSize(ev.value))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sizeInput = (fgFolder as any).addBlade({
      view: 'list',
      label: 'size',
      options: [
        { text: 'Natural', value: 'natural' },
        { text: 'Scaled', value: 'scaled' },
        { text: 'Relative', value: 'relative' },
      ],
      value: svgSize.type,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let paramBlade: any
    const updateParamBlade = (type: SvgSize['type']) => {
      if (paramBlade) fgFolder.remove(paramBlade)
      if (type === 'scaled') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paramBlade = (fgFolder as any).addBlade({
          view: 'slider',
          label: 'factor',
          min: 0,
          max: 5,
          value: svgSize.type === 'scaled' ? svgSize.factor : 1,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paramBlade.on('change', (ev: any) =>
          setSvgSize({ type: 'scaled', factor: ev.value })
        )
      } else if (type === 'relative') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paramBlade = (fgFolder as any).addBlade({
          view: 'slider',
          label: 'fraction',
          min: 0,
          max: 1,
          value: svgSize.type === 'relative' ? svgSize.fraction : 0.5,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paramBlade.on('change', (ev: any) =>
          setSvgSize({ type: 'relative', fraction: ev.value })
        )
      } else {
        paramBlade = undefined
      }
    }

    updateParamBlade(svgSize.type)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sizeInput.on('change', (ev: any) => {
      const type = ev.value as SvgSize['type']
      if (type === 'natural') {
        setSvgSize({ type: 'natural' })
      } else if (type === 'scaled') {
        setSvgSize({ type: 'scaled', factor: 1 })
      } else if (type === 'relative') {
        setSvgSize({ type: 'relative', fraction: 0.5 })
      }
      updateParamBlade(type)
    })

    return () => pane.dispose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { snapshotRef, texture } = useFeedbackFBO(
    shaderMap[shaderName],
    decay,
    active,
    interactionSession,
    interpQueue
  )
  return (
    <>
      <FeedbackPlane texture={texture} />
      <a.group
        ref={snapshotRef}
        position-x={pose.x}
        position-y={pose.y}
        {...bind}
      >
        <ForegroundLayer url={svgUrl} color="#000000" size={svgSize} />
      </a.group>
    </>
  )
}
