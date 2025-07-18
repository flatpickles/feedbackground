import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import rippleFadeFrag from '../shaders/rippleFade.frag'
import gaussianBlurFrag from '../shaders/gaussianBlur.frag'

import { shaderPass, type ShaderPass, type ScenePass, type PassParamDef } from './pass'
import asciiLuminancePass from './asciiLuminance'

export const passRegistry = {
  motionBlur: shaderPass(motionBlurFrag),
  randomPaint: shaderPass(randomPaintFrag),
  rippleFade: shaderPass(rippleFadeFrag, [
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
    ]),
  gaussianBlur: shaderPass(gaussianBlurFrag, [
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
    ]),
  asciiLuminance: asciiLuminancePass(),
} as const satisfies Record<string, ShaderPass | ScenePass>

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
  asciiDecay: {
    label: 'Ascii Decay',
    passes: [passRegistry.rippleFade, passRegistry.asciiLuminance],
  },
} as const satisfies Record<string, { label: string; passes: readonly (ShaderPass | ScenePass)[] }>

export type EffectName = keyof typeof effectIndex
export type EffectPass = ShaderPass | ScenePass

export type EffectParamDef = PassParamDef & { passIndex: number }

export function getEffectParamDefs(effect: EffectName): EffectParamDef[] {
  const { passes } = effectIndex[effect]
  const result: EffectParamDef[] = []
  passes.forEach((p, idx) => {
    p.params?.forEach((param: PassParamDef) => {
      result.push({ ...param, passIndex: idx })
    })
  })
  return result
}
