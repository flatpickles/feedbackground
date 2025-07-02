import { useCallback, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { useSpring } from '@react-spring/three'

export type DragSpringPose = { x: number; y: number }

export default function useDragAndSpring() {
  const { size, viewport, gl } = useThree()
  const factorX = viewport.width / size.width
  const factorY = viewport.height / size.height

  const overRef = useRef(false)

  const setCursor = useCallback(
    (c: string) => {
      gl.domElement.style.cursor = c
    },
    [gl.domElement]
  )

  const startRef = useRef<{ sx: number; sy: number; bx: number; by: number }>({
    sx: 0,
    sy: 0,
    bx: 0,
    by: 0,
  })
  const [isDragging, setDragging] = useState(false)
  const [isSpringing, setSpringing] = useState(false)
  const [spring, api] = useSpring(() => ({ x: 0, y: 0 }))
  const [interactionSession, setInteractionSession] = useState(0)

  const onPointerEnter = useCallback(() => {
    overRef.current = true
    if (!isDragging) setCursor('grab')
  }, [isDragging, setCursor])

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      setInteractionSession((s) => s + 1)
      setDragging(true)
      setCursor('grabbing')
      startRef.current = {
        sx: e.clientX,
        sy: e.clientY,
        bx: spring.x.get(),
        by: spring.y.get(),
      }
      ;(e.target as Element).setPointerCapture(e.pointerId)
    },
    [spring.x, spring.y, setCursor]
  )

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return
      const dx = (e.clientX - startRef.current.sx) * factorX
      const dy = -(e.clientY - startRef.current.sy) * factorY
      api.start({
        x: startRef.current.bx + dx,
        y: startRef.current.by + dy,
        immediate: true,
      })
    },
    [api, factorX, factorY, isDragging]
  )

  const release = useCallback(
    (e?: PointerEvent) => {
      if (!isDragging) return
      setDragging(false)
      api.start({
        x: 0,
        y: 0,
        onStart: () => setSpringing(true),
        onRest: () => setSpringing(false),
      })
      let isOver = overRef.current
      if (e) {
        const el = document.elementFromPoint(e.clientX, e.clientY)
        isOver = !!(el && gl.domElement.contains(el))
      }
      setCursor(isOver ? 'grab' : 'auto')
    },
    [api, gl.domElement, isDragging, setCursor]
  )

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      ;(e.target as Element).releasePointerCapture(e.pointerId)
      release(e)
    },
    [release]
  )

  const onPointerLeave = useCallback(() => {
    overRef.current = false
    if (!isDragging) {
      setCursor('auto')
      release()
    }
  }, [isDragging, release, setCursor])

  return {
    bind: {
      onPointerEnter,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave,
    },
    pose: spring,
    active: isDragging || isSpringing,
    interactionSession,
  }
}
