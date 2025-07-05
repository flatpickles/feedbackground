import { a } from '@react-spring/three'
import { useRef } from 'react'
import * as THREE from 'three'
import useDragAndSpring from '../hooks/useDragAndSpring'
import useFrameInterpolator from '../hooks/useFrameInterpolator'
import useFeedbackFBO from '../hooks/useFeedbackFBO'
import FeedbackPlane from './FeedbackPlane'
import SoftMesh from './SoftMesh'
import type { SvgSize } from '../types/svg'
import type { ForegroundContent } from '../types/foreground'

export type DraggableForegroundProps = {
  content: ForegroundContent
  shader: string
  decay: number
  stepSize: number
  preprocessShader: string | null
  svgSize: SvgSize
  rigidity: number
  density: number
}

export default function DraggableForeground({
  content,
  shader,
  decay,
  stepSize,
  preprocessShader,
  svgSize,
  rigidity,
  density,
}: DraggableForegroundProps) {
  const dragRef = useRef<THREE.Group | null>(null)
  const { bind, pose, active, interactionSession, isDragging, grabPoint, delta } =
    useDragAndSpring(dragRef)
  const interpQueue = useFrameInterpolator(pose, isDragging, stepSize)
  const { snapshotRef, texture } = useFeedbackFBO(
    shader,
    decay,
    active,
    interactionSession,
    interpQueue,
    dragRef,
    preprocessShader,
    stepSize
  )

  return (
    <>
      <FeedbackPlane texture={texture} />
      <a.group
        ref={snapshotRef}
        position-x={pose.x}
        position-y={pose.y}
        {...bind}
      >
        <SoftMesh
          content={content}
          size={svgSize}
          color="#000000"
          grabPoint={grabPoint}
          delta={delta}
          rigidity={rigidity}
          density={density}
        />
      </a.group>
    </>
  )
}
