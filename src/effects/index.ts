import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import rippleFadeFrag from '../shaders/rippleFade.frag'
import gaussianBlurFrag from '../shaders/gaussianBlur.frag'

export type PassParamDef = {
  id: string
  uniform?: string
  type: 'number' | 'boolean'
  label: string
  default: number | boolean
  min?: number
  max?: number
  step?: number
}

export type PassDescriptor = {
  type: 'shader'
  fragment: string
  params?: readonly PassParamDef[]
}

export const passRegistry = {
  motionBlur: { type: 'shader', fragment: motionBlurFrag },
  randomPaint: { type: 'shader', fragment: randomPaintFrag },
  rippleFade: {
    type: 'shader',
    fragment: rippleFadeFrag,
    params: [
      {
        id: 'speed',
        uniform: 'uSpeed',
        type: 'number',
        label: 'speed',
        default: 0.05,
        min: 0,
        max: 0.3,
        step: 0.001,
      },
      {
        id: 'displacement',
        uniform: 'uDisplacement',
        type: 'number',
        label: 'displacement',
        default: 0.0015,
        min: 0,
        max: 0.003,
        step: 0.0001,
      },
      {
        id: 'detail',
        uniform: 'uDetail',
        type: 'number',
        label: 'detail',
        default: 2,
        min: 0.1,
        max: 5,
        step: 0.01,
      },
      {
        id: 'zoom',
        uniform: 'uZoom',
        type: 'number',
        label: 'zoom',
        default: 0,
        min: -0.02,
        max: 0.02,
        step: 0.0001,
      },
      {
        id: 'centerZoom',
        type: 'boolean',
        label: 'center zoom',
        default: false,
      },
    ],
  },
  gaussianBlur: {
    type: 'shader',
    fragment: gaussianBlurFrag,
    params: [
      {
        id: 'blurRadius',
        uniform: 'uRadius',
        type: 'number',
        label: 'blur radius',
        default: 1,
        min: 0,
        max: 10,
        step: 1,
      },
    ],
  },
} as const satisfies Record<string, PassDescriptor>

export const effectIndex = {
  motionBlur: {
    label: 'Motion Blur',
    passes: [passRegistry.motionBlur],
  },
  randomPaint: {
    label: 'Random Paint',
    passes: [passRegistry.randomPaint],
  },
  rippleFade: {
    label: 'Ripple Fade',
    passes: [passRegistry.rippleFade],
  },
  blurredRipple: {
    label: 'Blurred Ripple',
    passes: [passRegistry.gaussianBlur, passRegistry.rippleFade],
  },
} as const satisfies Record<string, { label: string; passes: readonly PassDescriptor[] }>

export type EffectName = keyof typeof effectIndex
export type EffectPass = PassDescriptor

export type EffectParamDef = PassParamDef & { passIndex: number }

export function getEffectParamDefs(effect: EffectName): EffectParamDef[] {
  const { passes } = effectIndex[effect]
  const result: EffectParamDef[] = []
  passes.forEach((p, idx) => {
    const pass = p as PassDescriptor
    pass.params?.forEach((param: PassParamDef) => {
      result.push({ ...param, passIndex: idx })
    })
  })
  return result
}
