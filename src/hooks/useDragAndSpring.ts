import { useCallback, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSpring } from '@react-spring/three'

export type DragSpringPose = { x: number; y: number }

export default function useDragAndSpring(
  targetRef: RefObject<THREE.Object3D | null> | null = null
) {
  const { size, viewport, gl, camera, raycaster } = useThree()
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
  const pointerRef = useRef({ x: 0, y: 0 })
  const checkRaf = useRef<number | null>(null)
  const springingRef = useRef(false)
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
      pointerRef.current = { x: e.clientX, y: e.clientY }
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
      pointerRef.current = { x: e.clientX, y: e.clientY }
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

  const checkCursor = useCallback(() => {
    const { x, y } = pointerRef.current
    const ndc = new THREE.Vector2(
      (x / size.width) * 2 - 1,
      -(y / size.height) * 2 + 1
    )
    raycaster.setFromCamera(ndc, camera)
    const hit =
      !!targetRef?.current &&
      raycaster.intersectObject(targetRef.current, true).length > 0
    if (!hit) {
      setCursor('auto')
      checkRaf.current = null
    } else if (springingRef.current) {
      checkRaf.current = requestAnimationFrame(checkCursor)
    } else {
      setCursor('grab')
      checkRaf.current = null
    }
  }, [camera, raycaster, setCursor, size.height, size.width, targetRef])

  const release = useCallback(
    (e?: PointerEvent) => {
      if (!isDragging) return
      setDragging(false)
      if (e) pointerRef.current = { x: e.clientX, y: e.clientY }
      setSpringing(true)
      springingRef.current = true
      api.start({
        x: 0,
        y: 0,
        onRest: () => {
          setSpringing(false)
          springingRef.current = false
        },
      })
      if (checkRaf.current) cancelAnimationFrame(checkRaf.current)
      checkRaf.current = requestAnimationFrame(checkCursor)
    },
    [api, checkCursor, isDragging]
  )

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
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
    isDragging,
    interactionSession,
  }
}
