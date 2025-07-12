import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import rippleFadeFrag from '../shaders/rippleFade.frag'

export const effectIndex = {
  motionBlur: { label: 'Motion Blur', shader: motionBlurFrag },
  randomPaint: { label: 'Random Paint', shader: randomPaintFrag },
  rippleFade: { label: 'Ripple Fade', shader: rippleFadeFrag },
} as const

export type EffectName = keyof typeof effectIndex
