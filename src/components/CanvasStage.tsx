import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import ForegroundLayerDemo from './ForegroundLayerDemo'

export type CanvasStageProps = {
  backgroundName: 'wildflowers' | 'white'
  setBackgroundName: (name: 'wildflowers' | 'white') => void
}

export default function CanvasStage({
  backgroundName,
  setBackgroundName,
}: CanvasStageProps) {
  return (
    <Canvas className="w-full h-full">
      <Suspense fallback={null}>
        <ForegroundLayerDemo
          backgroundName={backgroundName}
          setBackgroundName={setBackgroundName}
        />
      </Suspense>
    </Canvas>
  )
}
