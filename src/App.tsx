import CanvasStage from './components/CanvasStage'
import IntroOverlay from './components/IntroOverlay'
import './App.css'
import wildflowersUrl from './assets/wildflowers.png'
import { useState } from 'react'

function useInitialBgName(): 'wildflowers' | 'white' {
  const params = new URLSearchParams(window.location.search)
  return (params.get('bg') as 'wildflowers' | 'white') || 'wildflowers'
}

export default function App() {
  const [bgName, setBgName] = useState<'wildflowers' | 'white'>(useInitialBgName)
  const [showIntro, setShowIntro] = useState(true)
  const style =
    bgName === 'wildflowers'
      ? { backgroundImage: `url(${wildflowersUrl})` }
      : { backgroundColor: '#ffffff' }
  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center"
      style={style}
    >
      <IntroOverlay visible={showIntro} />
      <CanvasStage
        backgroundName={bgName}
        setBackgroundName={setBgName}
        onInteract={() => setShowIntro(false)}
      />
    </div>
  )
}
