import ForegroundLayer from './ForegroundLayer'
import defaultSvgUrl from '../assets/diamond.svg?url'
import useDragAndSpring from '../hooks/useDragAndSpring'
import useFeedbackFBO from '../hooks/useFeedbackFBO'
import FeedbackPlane from './FeedbackPlane'
import motionBlurFrag from '../shaders/motionBlur.frag'
import { a } from '@react-spring/three'

function useSvgUrl(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('svg') || defaultSvgUrl
}

export default function ForegroundLayerDemo() {
  const svgUrl = useSvgUrl()
  const { bind, pose, active } = useDragAndSpring()
  const { snapshotRef, texture } = useFeedbackFBO(motionBlurFrag, 0.9, active)
  return (
    <>
      <FeedbackPlane texture={texture} />
      <a.group ref={snapshotRef} position-x={pose.x} position-y={pose.y} {...bind}>
        <ForegroundLayer
          url={svgUrl}
          color="#000000"
          size={{ type: 'scaled', factor: 0.01 }}
        />
      </a.group>
    </>
  )
}
