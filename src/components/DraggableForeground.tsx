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
  passes: readonly import('../effects').EffectPass[]
  decay: number
  stepSize: number
  svgSize: SvgSize
  paintWhileStill: boolean
  speed: number
  displacement: number
  detail: number
  zoom: number
  centerZoom: boolean
  onGrab?: () => void
}

export default function DraggableForeground({
  content,
  passes,
  decay,
  stepSize,
  svgSize,
  paintWhileStill,
  speed,
  displacement,
  detail,
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
  const passParams = {
    blur: { uRadius: stepSize },
    rippleFade: {
      uSpeed: speed,
      uDisplacement: displacement,
      uDetail: detail,
      uZoom: zoom,
      centerZoom,
    },
  }
  const { snapshotRef, texture } = useFeedbackFBO(
    passes,
    decay,
    paintWhileStill || active,
    interactionSession,
    interpQueue,
    dragRef,
    passParams,
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
