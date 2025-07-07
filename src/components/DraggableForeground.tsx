import { a } from '@react-spring/three'
import { useRef } from 'react'
import * as THREE from 'three'
import useDragAndSpring from '../hooks/useDragAndSpring'
import useFrameInterpolator from '../hooks/useFrameInterpolator'
import useFeedbackFBO from '../hooks/useFeedbackFBO'
import FeedbackPlane from './FeedbackPlane'
import SvgMesh from './SvgMesh'
import TextMesh from './TextMesh'
import type { SvgSize } from '../types/svg'
import type { ForegroundContent } from '../types/foreground'

export type DraggableForegroundProps = {
  content: ForegroundContent
  shader: string
  decay: number
  stepSize: number
  preprocessShader: string | null
  svgSize: SvgSize
  paintWhileStill: boolean
  speed: number
  displacement: number
  zoom: number
  centerZoom: boolean
  onGrab?: () => void
}

export default function DraggableForeground({
  content,
  shader,
  decay,
  stepSize,
  preprocessShader,
  svgSize,
  paintWhileStill,
  speed,
  displacement,
  zoom,
  centerZoom,
  onGrab,
}: DraggableForegroundProps) {
  const dragRef = useRef<THREE.Group | null>(null)
  const { bind, pose, active, interactionSession, isDragging } =
    useDragAndSpring(dragRef)
  const { onPointerDown, ...restBind } = bind
  const handlePointerDown = (e: PointerEvent) => {
    onPointerDown(e)
    onGrab?.()
  }
  const interpQueue = useFrameInterpolator(pose, isDragging, stepSize)
  const { snapshotRef, texture } = useFeedbackFBO(
    shader,
    decay,
    paintWhileStill || active,
    interactionSession,
    interpQueue,
    dragRef,
    preprocessShader,
    stepSize,
    speed,
    displacement,
    zoom,
    centerZoom,
    paintWhileStill
  )

  return (
    <>
      <FeedbackPlane texture={texture} />
      <a.group
        ref={snapshotRef}
        position-x={pose.x}
        position-y={pose.y}
        {...restBind}
        onPointerDown={handlePointerDown}
      >
        {content.kind === 'svg' ? (
          <SvgMesh url={content.url} color="#000000" size={svgSize} />
        ) : (
          <TextMesh text={content.text} color="#000000" size={svgSize} />
        )}
      </a.group>
    </>
  )
}
