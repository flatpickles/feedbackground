import { useEffect, useRef } from 'react'
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
  sourceName: 'diamond' | 'text'
  setSourceName: (name: 'diamond' | 'text') => void
  textValue: string
  setTextValue: (val: string) => void
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
  sourceName,
  setSourceName,
  textValue,
  setTextValue,
}: DemoControlsProps) {
  const sizeRef = useRef(svgSize)
  useEffect(() => {
    sizeRef.current = svgSize
  }, [svgSize])
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const pane = new Pane()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fgFolder = (pane as any).addFolder({ title: 'Foreground' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sizeFolder = (pane as any).addFolder({ title: 'Foreground Sizing' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const effectFolder = (pane as any).addFolder({ title: 'Effect' })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preprocessInput = (fgFolder as any).addBlade({
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
    const sourceInput = (fgFolder as any).addBlade({
      view: 'list',
      label: 'source',
      options: [
        { text: 'Diamond', value: 'diamond' },
        { text: 'Text', value: 'text' },
      ],
      value: sourceName,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let textBlade: any
    const updateTextBlade = (type: 'diamond' | 'text') => {
      if (textBlade) fgFolder.remove(textBlade)
      if (type === 'text') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textBlade = (fgFolder as any).addBlade({
          view: 'text',
          label: 'text',
          parse: (v: unknown) => String(v),
          value: textValue,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textBlade.on('change', (ev: any) => setTextValue(ev.value))
      } else {
        textBlade = undefined
      }
    }

    updateTextBlade(sourceName)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sourceInput.on('change', (ev: any) => {
      const val = ev.value as 'diamond' | 'text'
      setSourceName(val)
      updateTextBlade(val)
      createSizeInput(val)
    })

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
      step: 0.01,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decayInput.on('change', (ev: any) => setDecay(ev.value))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interpInput = (effectFolder as any).addBlade({
      view: 'slider',
      label: 'step(px)',
      min: 1,
      max: 10,
      value: stepSize,
      step: 1,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interpInput.on('change', (ev: any) => setStepSize(ev.value))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sizeInput: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let paramBlade: any
    const updateParamBlade = (type: SvgSize['type']) => {
      if (paramBlade) sizeFolder.remove(paramBlade)
      if (type === 'scaled') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paramBlade = (sizeFolder as any).addBlade({
          view: 'slider',
          label: 'factor',
          min: 0,
          max: 5,
          value: sizeRef.current.type === 'scaled' ? sizeRef.current.factor : 1,
          step: 0.01
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paramBlade.on('change', (ev: any) =>
          setSvgSize({ type: 'scaled', factor: ev.value })
        )
      } else if (type === 'relative') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paramBlade = (sizeFolder as any).addBlade({
          view: 'slider',
          label: 'fraction',
          min: 0,
          max: 1,
          value:
            sizeRef.current.type === 'relative'
              ? sizeRef.current.fraction
              : 0.5,
          step: 0.01
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paramBlade.on('change', (ev: any) =>
          setSvgSize({ type: 'relative', fraction: ev.value })
        )
      } else {
        paramBlade = undefined
      }
    }

    const createSizeInput = (src: 'diamond' | 'text') => {
      if (sizeInput) sizeFolder.remove(sizeInput)
      const options = [
        { text: 'Natural', value: 'natural' },
        { text: 'Scaled', value: 'scaled' },
      ]
      if (src === 'diamond') {
        options.push({ text: 'Relative', value: 'relative' })
      }

      let value: SvgSize['type'] = sizeRef.current.type
      if (src === 'text' && value === 'relative') {
        value = 'scaled'
        setSvgSize({ type: 'scaled', factor: 1 })
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sizeInput = (sizeFolder as any).addBlade({
        view: 'list',
        label: 'size',
        options,
        value,
      })

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

      updateParamBlade(value)
    }

    createSizeInput(sourceName)

    return () => pane.dispose()
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  return null
}
