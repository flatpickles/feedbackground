import { a } from '@react-spring/three'
import { useRef } from 'react'
import * as THREE from 'three'
import useDragAndSpring from '../hooks/useDragAndSpring'
import useFrameInterpolator from '../hooks/useFrameInterpolator'
import useFeedbackFBO from '../hooks/useFeedbackFBO'
import FeedbackPlane from './FeedbackPlane'
import SvgMesh from './SvgMesh'
import type { SvgSize } from '../types/svg'

export type DraggableSvgProps = {
  svgUrl: string
  shader: string
  decay: number
  stepSize: number
  preprocessShader: string | null
  svgSize: SvgSize
}

export default function DraggableSvg({
  svgUrl,
  shader,
  decay,
  stepSize,
  preprocessShader,
  svgSize,
}: DraggableSvgProps) {
  const dragRef = useRef<THREE.Group | null>(null)
  const { bind, pose, active, interactionSession, isDragging } =
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
        <SvgMesh url={svgUrl} color="#000000" size={svgSize} />
      </a.group>
    </>
  )
}
