import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import rippleFadeFrag from '../shaders/rippleFade.frag'

export type PassDescriptor =
  | { type: 'snapshot' }
  | { type: 'shader'; fragment: string }

export const effectIndex = {
  motionBlur: {
    label: 'Motion Blur',
    passes: [
      { type: 'snapshot' },
      { type: 'shader', fragment: motionBlurFrag },
    ],
  },
  randomPaint: {
    label: 'Random Paint',
    passes: [
      { type: 'snapshot' },
      { type: 'shader', fragment: randomPaintFrag },
    ],
  },
  rippleFade: {
    label: 'Ripple Fade',
    passes: [
      { type: 'snapshot' },
      { type: 'shader', fragment: rippleFadeFrag },
    ],
  },
} as const

export type EffectName = keyof typeof effectIndex
export type EffectPass = PassDescriptor
