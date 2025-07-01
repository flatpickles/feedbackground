import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import ForegroundLayerDemo from './ForegroundLayerDemo'

export default function CanvasStage() {
  return (
    <Canvas className="w-full h-full">
      <Suspense fallback={null}>
        <ForegroundLayerDemo />
      </Suspense>
    </Canvas>
  )
}
