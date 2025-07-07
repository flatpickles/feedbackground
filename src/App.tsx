import { useState } from 'react'
import './App.css'
import wildflowersUrl from './assets/wildflowers.png'
import CanvasStage from './components/CanvasStage'
import Overview from './components/Overview'

function useInitialBgName(): 'wildflowers' | 'white' {
  const params = new URLSearchParams(window.location.search)
  return (params.get('bg') as 'wildflowers' | 'white') || 'white'
}

export default function App() {
  const [bgName, setBgName] = useState<'wildflowers' | 'white'>(useInitialBgName)
  const [overviewHidden, setOverviewHidden] = useState(false)
  const style =
    bgName === 'wildflowers'
      ? { backgroundImage: `url(${wildflowersUrl})` }
      : { backgroundColor: '#ffffff' }
  return (
    <>
      <Overview hidden={overviewHidden} />
      <div
        className="w-screen h-screen overflow-hidden bg-cover bg-center"
        style={style}
      >
        <CanvasStage
          backgroundName={bgName}
          setBackgroundName={setBgName}
          onInteract={() => setOverviewHidden(true)}
        />
      </div>
    </>
  )
}
