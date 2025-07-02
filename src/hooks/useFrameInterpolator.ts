import { useFrame } from '@react-three/fiber'
import { SpringValue } from '@react-spring/three'
import { useRef } from 'react'
import type { MutableRefObject } from 'react'
import type { DragSpringPose } from './useDragAndSpring'

export default function useFrameInterpolator(
  pose: { x: SpringValue<number>; y: SpringValue<number> },
  steps = 4
): MutableRefObject<DragSpringPose[]> {
  const lastPose = useRef<DragSpringPose>({
    x: pose.x.get(),
    y: pose.y.get(),
  })
  const queue = useRef<DragSpringPose[]>([])

  useFrame(() => {
    const current = { x: pose.x.get(), y: pose.y.get() }
    if (current.x !== lastPose.current.x || current.y !== lastPose.current.y) {
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        queue.current.push({
          x: lastPose.current.x + (current.x - lastPose.current.x) * t,
          y: lastPose.current.y + (current.y - lastPose.current.y) * t,
        })
      }
      lastPose.current = current
    }
  })

  return queue
}
