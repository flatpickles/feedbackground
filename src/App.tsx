import { useState } from 'react'
import './App.css'
import wildflowersUrl from './assets/wildflowers.png'
import CanvasStage from './components/CanvasStage'
import DemoControls from './components/DemoControls'
import Overview from './components/Overview'
import type { SvgSize } from './types/svg'

function useInitialBgName(): 'wildflowers' | 'white' {
  const params = new URLSearchParams(window.location.search)
  return (params.get('bg') as 'wildflowers' | 'white') || 'white'
}

function useInitialText(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('text') || 'Hello'
}

export default function App() {
  const [bgName, setBgName] = useState<'wildflowers' | 'white'>(useInitialBgName)
  const [overviewHidden, setOverviewHidden] = useState(false)
  const [stepSize, setStepSize] = useState(1)
  const [preprocessName, setPreprocessName] = useState<'none' | 'blur'>('blur')
  const [svgSize, setSvgSize] = useState<SvgSize>({ type: 'scaled', factor: 2 })
  const [sourceName, setSourceName] = useState<'diamond' | 'text'>('text')
  const [textValue, setTextValue] = useState(useInitialText())
  const [shaderName, setShaderName] =
    useState<'motionBlur' | 'randomPaint' | 'rippleFade'>('rippleFade')
  const [decay, setDecay] = useState(0.975)
  const [paintWhileStill, setPaintWhileStill] = useState(false)
  const [speed, setSpeed] = useState(0.05)
  const [displacement, setDisplacement] = useState(0.0015)
  const [zoom, setZoom] = useState(0)
  const [centerZoom, setCenterZoom] = useState(false)
  const style =
    bgName === 'wildflowers'
      ? { backgroundImage: `url(${wildflowersUrl})` }
      : { backgroundColor: '#ffffff' }
  return (
    <>
      <Overview hidden={overviewHidden} />
      <DemoControls
        backgroundName={bgName}
        setBackgroundName={setBgName}
        shaderName={shaderName}
        setShaderName={setShaderName as (name: string) => void}
        decay={decay}
        setDecay={setDecay}
        stepSize={stepSize}
        setStepSize={setStepSize}
        preprocessName={preprocessName}
        setPreprocessName={setPreprocessName as (name: string) => void}
        svgSize={svgSize}
        setSvgSize={setSvgSize}
        paintWhileStill={paintWhileStill}
        setPaintWhileStill={setPaintWhileStill}
        sourceName={sourceName}
        setSourceName={setSourceName}
        textValue={textValue}
        setTextValue={setTextValue}
        speed={speed}
        setSpeed={setSpeed}
        displacement={displacement}
        setDisplacement={setDisplacement}
        zoom={zoom}
        setZoom={setZoom}
        centerZoom={centerZoom}
        setCenterZoom={setCenterZoom}
      />
      <div
        className="w-screen h-screen overflow-hidden bg-cover bg-center"
        style={style}
      >
        <CanvasStage
          shaderName={shaderName}
          decay={decay}
          stepSize={stepSize}
          preprocessName={preprocessName}
          svgSize={svgSize}
          paintWhileStill={paintWhileStill}
          sourceName={sourceName}
          textValue={textValue}
          speed={speed}
          displacement={displacement}
          zoom={zoom}
          centerZoom={centerZoom}
          onInteract={() => setOverviewHidden(true)}
        />
      </div>
    </>
  )
}
