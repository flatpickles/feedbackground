import { useCallback, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { useSpring } from '@react-spring/three'

export type DragSpringPose = { x: number; y: number }

export default function useDragAndSpring() {
  const { size, viewport } = useThree()
  const factorX = viewport.width / size.width
  const factorY = viewport.height / size.height

  const startRef = useRef<{ sx: number; sy: number; bx: number; by: number }>({
    sx: 0,
    sy: 0,
    bx: 0,
    by: 0,
  })
  const [isDragging, setDragging] = useState(false)
  const [isSpringing, setSpringing] = useState(false)
  const [spring, api] = useSpring(() => ({ x: 0, y: 0 }))

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      setDragging(true)
      startRef.current = {
        sx: e.clientX,
        sy: e.clientY,
        bx: spring.x.get(),
        by: spring.y.get(),
      }
      ;(e.target as Element).setPointerCapture(e.pointerId)
    },
    [spring.x, spring.y]
  )

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return
      const dx = (e.clientX - startRef.current.sx) * factorX
      const dy = -(e.clientY - startRef.current.sy) * factorY
      api.start({ x: startRef.current.bx + dx, y: startRef.current.by + dy, immediate: true })
    },
    [api, factorX, factorY, isDragging]
  )

  const release = useCallback(() => {
    if (!isDragging) return
    setDragging(false)
    api.start({
      x: 0,
      y: 0,
      onStart: () => setSpringing(true),
      onRest: () => setSpringing(false),
    })
  }, [api, isDragging])

  const onPointerUp = useCallback(() => release(), [release])
  const onPointerLeave = useCallback(() => release(), [release])

  return {
    bind: { onPointerDown, onPointerMove, onPointerUp, onPointerLeave },
    pose: spring,
    active: isDragging || isSpringing,
  }
}
