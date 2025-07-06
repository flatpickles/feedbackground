import CanvasStage from './components/CanvasStage'
import './App.css'
import wildflowersUrl from './assets/wildflowers.png'
import { useState } from 'react'

function useInitialBgName(): 'wildflowers' | 'white' {
  const params = new URLSearchParams(window.location.search)
  return (params.get('bg') as 'wildflowers' | 'white') || 'wildflowers'
}

export default function App() {
  const [bgName, setBgName] = useState<'wildflowers' | 'white'>(useInitialBgName)
  const style =
    bgName === 'wildflowers'
      ? { backgroundImage: `url(${wildflowersUrl})` }
      : { backgroundColor: '#ffffff' }
  return (
    <div
      className="w-screen h-screen overflow-hidden bg-cover bg-center"
      style={style}
    >
      <CanvasStage backgroundName={bgName} setBackgroundName={setBgName} />
    </div>
  )
}
