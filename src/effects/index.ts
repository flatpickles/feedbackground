import motionBlurFrag from '../shaders/motionBlur.frag'
import randomPaintFrag from '../shaders/randomPaint.frag'
import rippleFadeFrag from '../shaders/rippleFade.frag'
import gaussianBlurFrag from '../shaders/gaussianBlur.frag'

export type PassDescriptor = {
  type: 'shader'
  fragment: string
  name?: string
}

export const effectIndex = {
  motionBlur: {
    label: 'Motion Blur',
    passes: [{ type: 'shader', fragment: motionBlurFrag, name: 'motionBlur' }],
  },
  randomPaint: {
    label: 'Random Paint',
    passes: [{ type: 'shader', fragment: randomPaintFrag, name: 'randomPaint' }],
  },
  rippleFade: {
    label: 'Ripple Fade',
    passes: [{ type: 'shader', fragment: rippleFadeFrag, name: 'rippleFade' }],
  },
  blurredRipple: {
    label: 'Blurred Ripple',
    passes: [
      { type: 'shader', fragment: gaussianBlurFrag, name: 'blur' },
      { type: 'shader', fragment: rippleFadeFrag, name: 'rippleFade' },
    ],
  },
} as const

export type EffectName = keyof typeof effectIndex
export type EffectPass = PassDescriptor
