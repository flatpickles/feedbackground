import { useFrame } from '@react-three/fiber'
import { SpringValue } from '@react-spring/three'
import { useRef, useState } from 'react'
import type { DragSpringPose } from './useDragAndSpring'

export default function useFrameInterpolator(
  pose: { x: SpringValue<number>; y: SpringValue<number> },
  steps = 4
): DragSpringPose {
  const lastBase = useRef<DragSpringPose>({
    x: pose.x.get(),
    y: pose.y.get(),
  })
  const lastOutput = useRef<DragSpringPose>(lastBase.current)
  const queue = useRef<DragSpringPose[]>([])
  const [interp, setInterp] = useState<DragSpringPose>(lastBase.current)

  useFrame(() => {
    const current = { x: pose.x.get(), y: pose.y.get() }

    if (current.x !== lastBase.current.x || current.y !== lastBase.current.y) {
      queue.current = []
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        queue.current.push({
          x: lastOutput.current.x + (current.x - lastOutput.current.x) * t,
          y: lastOutput.current.y + (current.y - lastOutput.current.y) * t,
        })
      }
      lastBase.current = current
    }

    const next = queue.current.shift() || current
    lastOutput.current = next
    setInterp(next)
  })

  return interp
}
