import { useFrame, useThree } from '@react-three/fiber'
import { SpringValue } from '@react-spring/three'
import { useRef } from 'react'
import type { MutableRefObject } from 'react'
import type { DragSpringPose } from './useDragAndSpring'

export default function useFrameInterpolator(
  pose: { x: SpringValue<number>; y: SpringValue<number> },
  stepPx = 20
): MutableRefObject<DragSpringPose[]> {
  const { size, viewport, gl } = useThree()
  const lastPose = useRef<DragSpringPose>({
    x: pose.x.get(),
    y: pose.y.get(),
  })
  const queue = useRef<DragSpringPose[]>([])

  useFrame(() => {
    const current = { x: pose.x.get(), y: pose.y.get() }
    if (current.x !== lastPose.current.x || current.y !== lastPose.current.y) {
      const factorX = viewport.width / size.width
      const factorY = viewport.height / size.height
      const dpr = gl.getPixelRatio()

      const dx = current.x - lastPose.current.x
      const dy = current.y - lastPose.current.y
      const dxPx = (dx / factorX) * dpr
      const dyPx = (dy / factorY) * dpr
      const distPx = Math.sqrt(dxPx * dxPx + dyPx * dyPx)
      const steps = Math.max(1, Math.ceil(distPx / stepPx))

      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        queue.current.push({
          x: lastPose.current.x + dx * t,
          y: lastPose.current.y + dy * t,
        })
      }

      lastPose.current = current
    }
  })

  return queue
}
