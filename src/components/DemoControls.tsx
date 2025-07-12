import { useEffect, useRef } from 'react'
import { Pane } from 'tweakpane'
import type { SvgSize } from '../types/svg'
import { effectIndex, type EffectName } from '../effects'

export type DemoControlsProps = {
  backgroundName: 'wildflowers' | 'white'
  setBackgroundName: (name: 'wildflowers' | 'white') => void
  shaderName: EffectName
  setShaderName: (name: EffectName) => void
  decay: number
  setDecay: (val: number) => void
  blurRadius: number
  setBlurRadius: (val: number) => void
  speed: number
  setSpeed: (val: number) => void
  displacement: number
  setDisplacement: (val: number) => void
  detail: number
  setDetail: (val: number) => void
  zoom: number
  setZoom: (val: number) => void
  centerZoom: boolean
  setCenterZoom: (val: boolean) => void
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
  blurRadius,
  setBlurRadius,
  speed,
  setSpeed,
  displacement,
  setDisplacement,
  detail,
  setDetail,
  zoom,
  setZoom,
  centerZoom,
  setCenterZoom,
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
  const speedRef = useRef(speed)
  const displacementRef = useRef(displacement)
  const detailRef = useRef(detail)
  const zoomRef = useRef(zoom)
  const centerZoomRef = useRef(centerZoom)
  const blurRadiusRef = useRef(blurRadius)
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    sizeRef.current = svgSize
  }, [svgSize])
  useEffect(() => {
    speedRef.current = speed
  }, [speed])
  useEffect(() => {
    displacementRef.current = displacement
  }, [displacement])
  useEffect(() => {
    detailRef.current = detail
  }, [detail])
  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])
  useEffect(() => {
    centerZoomRef.current = centerZoom
  }, [centerZoom])
  useEffect(() => {
    blurRadiusRef.current = blurRadius
  }, [blurRadius])
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const pane = new Pane({ container: containerRef.current ?? undefined })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fgFolder = (pane as any).addFolder({ title: 'Foreground' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bgFolder = (pane as any).addFolder({ title: 'Background' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const effectFolder = (pane as any).addFolder({ title: 'Effect' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let effectParamsFolder: any

    const createEffectParamsFolder = (shader: EffectName) => {
      if (effectParamsFolder) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(pane as any).remove(effectParamsFolder)
        effectParamsFolder = null
      }
      if (shader === 'rippleFade' || shader === 'blurredRipple') {
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
          value: speedRef.current,
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
          value: displacementRef.current,
          step: 0.0001,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sizeInputNoise.on('change', (ev: any) => setDisplacement(ev.value))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detailInput = (effectParamsFolder as any).addBlade({
          view: 'slider',
          label: 'detail',
          min: 0.1,
          max: 5,
          value: detailRef.current,
          step: 0.01,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        detailInput.on('change', (ev: any) => setDetail(ev.value))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const zoomInput = (effectParamsFolder as any).addBlade({
          view: 'slider',
          label: 'zoom',
          min: -0.02,
          max: 0.02,
          value: zoomRef.current,
          step: 0.0001,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        zoomInput.on('change', (ev: any) => setZoom(ev.value))

        const centerParams = { center: centerZoomRef.current }
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
        if (shader === 'blurredRipple') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const blurInput = (effectParamsFolder as any).addBlade({
            view: 'slider',
            label: 'blur radius',
            min: 0,
            max: 10,
            value: blurRadiusRef.current,
            step: 1,
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          blurInput.on('change', (ev: any) => setBlurRadius(ev.value))
        }
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


    const shaderOptions = Object.entries(effectIndex).map(([key, val]) => ({
      text: val.label,
      value: key,
    }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shaderInput = (effectFolder as any).addBlade({
      view: 'list',
      label: 'shader',
      options: shaderOptions,
      value: shaderName,
      index: 1,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shaderInput.on('change', (ev: any) => {
      const val = ev.value as EffectName
      setShaderName(val)
      createEffectParamsFolder(val)
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

  return (
    <div
      ref={containerRef}
      className="hidden md:block fixed top-0 right-0 z-10 p-2"
    />
  )
}
