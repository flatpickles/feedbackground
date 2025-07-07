import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import ForegroundLayerDemo from './ForegroundLayerDemo'

export type CanvasStageProps = {
  backgroundName: 'wildflowers' | 'white'
  setBackgroundName: (name: 'wildflowers' | 'white') => void
  onInteract: () => void
}

export default function CanvasStage({
  backgroundName,
  setBackgroundName,
  onInteract,
}: CanvasStageProps) {
  return (
    <Canvas className="w-full h-full">
      <Suspense fallback={null}>
        <ForegroundLayerDemo
          backgroundName={backgroundName}
          setBackgroundName={setBackgroundName}
          onInteract={onInteract}
        />
      </Suspense>
    </Canvas>
  )
}
