import { useFrame, useThree } from '@react-three/fiber'
import { SpringValue } from '@react-spring/three'
import { useRef, useEffect } from 'react'
import type { MutableRefObject } from 'react'
import type { DragSpringPose } from './useDragAndSpring'

export default function useFrameInterpolator(
  pose: { x: SpringValue<number>; y: SpringValue<number> },
  isDragging: boolean,
  stepPx = 20
): MutableRefObject<DragSpringPose[]> {
  const { size, viewport, gl } = useThree()
  const lastPose = useRef<DragSpringPose>({
    x: pose.x.get(),
    y: pose.y.get(),
  })
  const prevPose = useRef<DragSpringPose | null>(null)
  const queue = useRef<DragSpringPose[]>([])

  useEffect(() => {
    if (!isDragging) {
      prevPose.current = null
    }
  }, [isDragging])

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

      if (prevPose.current) {
        const cp = {
          x: lastPose.current.x + 0.25 * (current.x - prevPose.current.x),
          y: lastPose.current.y + 0.25 * (current.y - prevPose.current.y),
        }
        for (let i = 1; i <= steps; i++) {
          const t = i / steps
          const omt = 1 - t
          queue.current.push({
            x:
              omt * omt * lastPose.current.x +
              2 * omt * t * cp.x +
              t * t * current.x,
            y:
              omt * omt * lastPose.current.y +
              2 * omt * t * cp.y +
              t * t * current.y,
          })
        }
      } else {
        for (let i = 1; i <= steps; i++) {
          const t = i / steps
          queue.current.push({
            x: lastPose.current.x + dx * t,
            y: lastPose.current.y + dy * t,
          })
        }
      }

      prevPose.current = { ...lastPose.current }
      lastPose.current = current
    }
  })

  return queue
}
