import { useEffect, useRef } from 'react'
import { Pane } from 'tweakpane'
import type { SvgSize } from '../types/svg'

export type DemoControlsProps = {
  backgroundName: 'wildflowers' | 'white'
  setBackgroundName: (name: 'wildflowers' | 'white') => void
  shaderName: string
  setShaderName: (name: string) => void
  decay: number
  setDecay: (val: number) => void
  stepSize: number
  setStepSize: (val: number) => void
  speed: number
  setSpeed: (val: number) => void
  displacement: number
  setDisplacement: (val: number) => void
  zoom: number
  setZoom: (val: number) => void
  centerZoom: boolean
  setCenterZoom: (val: boolean) => void
  preprocessName: string
  setPreprocessName: (name: string) => void
  svgSize: SvgSize
  setSvgSize: (size: SvgSize) => void
  paintWhileStill: boolean
  setPaintWhileStill: (val: boolean) => void
  sourceName: 'diamond' | 'text'
  setSourceName: (name: 'diamond' | 'text') => void
  textValue: string
  setTextValue: (val: string) => void
}

export default function DemoControls({
  backgroundName,
  setBackgroundName,
  shaderName,
  setShaderName,
  decay,
  setDecay,
  stepSize,
  setStepSize,
  speed,
  setSpeed,
  displacement,
  setDisplacement,
  zoom,
  setZoom,
  centerZoom,
  setCenterZoom,
  preprocessName,
  setPreprocessName,
  svgSize,
  setSvgSize,
  paintWhileStill,
  setPaintWhileStill,
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
    const bgFolder = (pane as any).addFolder({ title: 'Background' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const effectFolder = (pane as any).addFolder({ title: 'Effect' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let effectParamsFolder: any

    const createEffectParamsFolder = (shader: string) => {
      if (effectParamsFolder) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(pane as any).remove(effectParamsFolder)
        effectParamsFolder = null
      }
      if (shader === 'rippleFade') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        effectParamsFolder = (pane as any).addFolder({
          title: 'Effect Params',
          index: 3,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const speedInput = (effectParamsFolder as any).addBlade({
          view: 'slider',
          label: 'speed',
          min: 0,
          max: 0.3,
          value: speed,
          step: 0.001,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        speedInput.on('change', (ev: any) => setSpeed(ev.value))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sizeInputNoise = (effectParamsFolder as any).addBlade({
          view: 'slider',
          label: 'displacement',
          min: 0,
          max: 0.003,
          value: displacement,
          step: 0.0001,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sizeInputNoise.on('change', (ev: any) => setDisplacement(ev.value))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const zoomInput = (effectParamsFolder as any).addBlade({
          view: 'slider',
          label: 'zoom',
          min: -0.02,
          max: 0.02,
          value: zoom,
          step: 0.0001,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        zoomInput.on('change', (ev: any) => setZoom(ev.value))

        const centerParams = { center: centerZoom }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const centerInput = (effectParamsFolder as any).addBinding(
          centerParams,
          'center',
          { label: 'center zoom' }
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        centerInput.on('change', (ev: any) => {
          centerParams.center = ev.value
          setCenterZoom(ev.value)
        })
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bgInput = (bgFolder as any).addBlade({
      view: 'list',
      label: 'image',
      options: [
        { text: 'Wildflowers', value: 'wildflowers' },
        { text: 'White', value: 'white' },
      ],
      value: backgroundName,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bgInput.on('change', (ev: any) => setBackgroundName(ev.value))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sourceInput = (fgFolder as any).addBlade({
      view: 'list',
      label: 'source',
      options: [
        { text: 'Diamond', value: 'diamond' },
        { text: 'Text', value: 'text' },
      ],
      value: sourceName,
      index: 0,
    })

    const paintParams = { paint: paintWhileStill }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let paintInput: any
    const addPaintInput = () => {
      if (paintInput) fgFolder.remove(paintInput)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paintInput = (fgFolder as any).addBinding(paintParams, 'paint', {
        label: 'paint while still',
        index: 4,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paintInput.on('change', (ev: any) => {
        paintParams.paint = ev.value
        setPaintWhileStill(ev.value)
      })
    }

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
          index: 1,
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
    const decayInput = (effectFolder as any).addBlade({
      view: 'slider',
      label: 'decay',
      min: 0.95,
      max: 1,
      value: decay,
      step: 0.001,
      index: 0,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decayInput.on('change', (ev: any) => setDecay(ev.value))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interpInput = (effectFolder as any).addBlade({
      view: 'slider',
      label: 'interp (px)',
      min: 1,
      max: 10,
      value: stepSize,
      step: 1,
      index: 1,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interpInput.on('change', (ev: any) => setStepSize(ev.value))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preprocessInput = (effectFolder as any).addBlade({
      view: 'list',
      label: 'preprocess',
      options: [
        { text: 'None', value: 'none' },
        { text: 'Blur', value: 'blur' },
      ],
      value: preprocessName,
      index: 2,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preprocessInput.on('change', (ev: any) => setPreprocessName(ev.value))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shaderInput = (effectFolder as any).addBlade({
      view: 'list',
      label: 'shader',
      options: [
        { text: 'Motion Blur', value: 'motionBlur' },
        { text: 'Random Paint', value: 'randomPaint' },
        { text: 'Ripple Fade', value: 'rippleFade' },
      ],
      value: shaderName,
      index: 3,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shaderInput.on('change', (ev: any) => {
      setShaderName(ev.value)
      createEffectParamsFolder(ev.value)
    })

    createEffectParamsFolder(shaderName)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sizeInput: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let paramBlade: any
    const updateParamBlade = (type: SvgSize['type']) => {
      if (paintInput) fgFolder.remove(paintInput)
      if (paramBlade) fgFolder.remove(paramBlade)
      if (type === 'scaled') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paramBlade = (fgFolder as any).addBlade({
          view: 'slider',
          label: 'factor',
          min: 0,
          max: 5,
          value: sizeRef.current.type === 'scaled' ? sizeRef.current.factor : 1,
          step: 0.01,
          index: 3,
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
          value:
            sizeRef.current.type === 'relative'
              ? sizeRef.current.fraction
              : 0.5,
          step: 0.01,
          index: 3,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paramBlade.on('change', (ev: any) =>
          setSvgSize({ type: 'relative', fraction: ev.value })
        )
      } else {
        paramBlade = undefined
      }
      addPaintInput()
    }

    const createSizeInput = (src: 'diamond' | 'text') => {
      if (sizeInput) fgFolder.remove(sizeInput)
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
      sizeInput = (fgFolder as any).addBlade({
        view: 'list',
        label: 'size',
        options,
        value,
        index: 2,
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
      addPaintInput()
    }

    createSizeInput(sourceName)

    return () => pane.dispose()
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  return null
}
