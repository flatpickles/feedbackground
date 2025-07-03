import { useEffect } from 'react'
import { Pane } from 'tweakpane'
import type { SvgSize } from '../types/svg'

export type DemoControlsProps = {
  shaderName: string
  setShaderName: (name: string) => void
  decay: number
  setDecay: (val: number) => void
  stepSize: number
  setStepSize: (val: number) => void
  preprocessName: string
  setPreprocessName: (name: string) => void
  svgSize: SvgSize
  setSvgSize: (size: SvgSize) => void
}

export default function DemoControls({
  shaderName,
  setShaderName,
  decay,
  setDecay,
  stepSize,
  setStepSize,
  preprocessName,
  setPreprocessName,
  svgSize,
  setSvgSize,
}: DemoControlsProps) {
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
    shaderInput.on('change', (ev: any) => setShaderName(ev.value))

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
    const preprocessInput = (effectFolder as any).addBlade({
      view: 'list',
      label: 'preprocess',
      options: [
        { text: 'None', value: 'none' },
        { text: 'Box Blur', value: 'box' },
        { text: 'Gaussian Blur', value: 'gaussian' },
      ],
      value: preprocessName,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preprocessInput.on('change', (ev: any) => setPreprocessName(ev.value))

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
  }, [])

  return null
}
