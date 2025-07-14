import { useEffect, useRef } from 'react'
import type React from 'react'
import {
  Pane,
  SliderBladeApi,
  ListBladeApi,
  TextBladeApi,
  type InputBindingApi,
  FolderApi,
  TpChangeEvent,
} from 'tweakpane'
import { addBladeTyped, addBindingTyped, addFolderTyped, removeBladeTyped } from '../utils/tweakpane'
import type { SvgSize } from '../types/svg'
import {
  effectIndex,
  type EffectName,
  getEffectParamDefs,
} from '../effects'

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
  charWidth: number
  setCharWidth: (val: number) => void
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
  charWidth,
  setCharWidth,
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
  const charWidthRef = useRef(charWidth)
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
  useEffect(() => {
    charWidthRef.current = charWidth
  }, [charWidth])
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const pane = new Pane({ container: containerRef.current ?? undefined })
    const fgFolder = addFolderTyped(pane, { title: 'Foreground' })
    const bgFolder = addFolderTyped(pane, { title: 'Background' })
    const effectFolder = addFolderTyped(pane, { title: 'Effect' })
    let effectParamsFolder: FolderApi | null

    const paramMap: Record<
      string,
      {
        ref: React.MutableRefObject<number | boolean>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setter: (v: any) => void
      }
    > = {
      blurRadius: { ref: blurRadiusRef, setter: setBlurRadius },
      speed: { ref: speedRef, setter: setSpeed },
      displacement: { ref: displacementRef, setter: setDisplacement },
      detail: { ref: detailRef, setter: setDetail },
      zoom: { ref: zoomRef, setter: setZoom },
      centerZoom: { ref: centerZoomRef, setter: setCenterZoom },
      charWidth: { ref: charWidthRef, setter: setCharWidth },
    }

    const createEffectParamsFolder = (shader: EffectName) => {
      if (effectParamsFolder) {
        removeBladeTyped(pane, effectParamsFolder)
        effectParamsFolder = null
      }
      const defs = getEffectParamDefs(shader)
      if (defs.length === 0) return
      effectParamsFolder = addFolderTyped(pane, {
        title: 'Effect Params',
        index: 3,
      })
      defs.forEach((def) => {
        const info = paramMap[def.id as keyof typeof paramMap]
        if (!info) return
        if (def.type === 'number') {
          const blade = addBladeTyped<SliderBladeApi>(effectParamsFolder, {
            view: 'slider',
            label: def.label,
            min: def.min,
            max: def.max,
            value: info.ref.current,
            step: def.step,
          })
          blade.on('change', (ev: TpChangeEvent<number>) => info.setter(ev.value))
        } else {
          const params = { val: info.ref.current as boolean }
          const blade = addBindingTyped(effectParamsFolder, params, 'val', {
            label: def.label,
          })
          blade.on('change', (ev: TpChangeEvent<boolean>) => {
            params.val = ev.value
            info.setter(ev.value)
          })
        }
      })
    }
    const bgInput = addBladeTyped<ListBladeApi<'wildflowers' | 'white'>>(bgFolder, {
      view: 'list',
      label: 'image',
      options: [
        { text: 'Wildflowers', value: 'wildflowers' },
        { text: 'White', value: 'white' },
      ],
      value: backgroundName,
    })
    bgInput.on('change', (ev: TpChangeEvent<'wildflowers' | 'white'>) => setBackgroundName(ev.value))

    const sourceInput = addBladeTyped<ListBladeApi<'diamond' | 'text'>>(fgFolder, {
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
    let paintInput: InputBindingApi<boolean> | undefined
    const addPaintInput = () => {
      if (paintInput) fgFolder.remove(paintInput)
      paintInput = addBindingTyped(fgFolder, paintParams, 'paint', {
        label: 'paint while still',
        index: 4,
      })
      paintInput.on('change', (ev: TpChangeEvent<boolean>) => {
        paintParams.paint = ev.value
        setPaintWhileStill(ev.value)
      })
    }

    let textBlade: TextBladeApi<string> | undefined
    const updateTextBlade = (type: 'diamond' | 'text') => {
      if (textBlade) fgFolder.remove(textBlade)
      if (type === 'text') {
        textBlade = addBladeTyped<TextBladeApi<string>>(fgFolder, {
          view: 'text',
          label: 'text',
          parse: (v: unknown) => String(v),
          value: textValue,
          index: 1,
        })
        textBlade.on('change', (ev: TpChangeEvent<string>) => setTextValue(ev.value))
      } else {
        textBlade = undefined
      }
    }

    updateTextBlade(sourceName)

    sourceInput.on('change', (ev: TpChangeEvent<'diamond' | 'text'>) => {
      const val = ev.value as 'diamond' | 'text'
      setSourceName(val)
      updateTextBlade(val)
      createSizeInput(val)
    })

    const decayInput = addBladeTyped<SliderBladeApi>(effectFolder, {
      view: 'slider',
      label: 'decay',
      min: 0.95,
      max: 1,
      value: decay,
      step: 0.001,
      index: 0,
    })
    decayInput.on('change', (ev: TpChangeEvent<number>) => setDecay(ev.value))


    const shaderOptions = Object.entries(effectIndex).map(([key, val]) => ({
      text: val.label,
      value: key,
    }))
    const shaderInput = addBladeTyped<ListBladeApi<EffectName>>(effectFolder, {
      view: 'list',
      label: 'shader',
      options: shaderOptions,
      value: shaderName,
      index: 1,
    })
    shaderInput.on('change', (ev: TpChangeEvent<string>) => {
      const val = ev.value as EffectName
      setShaderName(val)
      createEffectParamsFolder(val)
    })

    createEffectParamsFolder(shaderName)

    let sizeInput: ListBladeApi<SvgSize['type']> | undefined
    let paramBlade: SliderBladeApi | undefined
    const updateParamBlade = (type: SvgSize['type']) => {
      if (paintInput) fgFolder.remove(paintInput)
      if (paramBlade) fgFolder.remove(paramBlade)
      if (type === 'scaled') {
        paramBlade = addBladeTyped<SliderBladeApi>(fgFolder, {
          view: 'slider',
          label: 'factor',
          min: 0,
          max: 5,
          value: sizeRef.current.type === 'scaled' ? sizeRef.current.factor : 1,
          step: 0.01,
          index: 3,
        })
        paramBlade.on('change', (ev: TpChangeEvent<number>) =>
          setSvgSize({ type: 'scaled', factor: ev.value })
        )
      } else if (type === 'relative') {
        paramBlade = addBladeTyped<SliderBladeApi>(fgFolder, {
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
        paramBlade.on('change', (ev: TpChangeEvent<number>) =>
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

      sizeInput = addBladeTyped<ListBladeApi<SvgSize['type']>>(fgFolder, {
        view: 'list',
        label: 'size',
        options,
        value,
        index: 2,
      })

      sizeInput.on('change', (ev: TpChangeEvent<SvgSize['type']>) => {
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
