import CanvasStage from './components/CanvasStage'
import './App.css'
import defaultBgUrl from './assets/wildflowers.png'

function useBackgroundUrl(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('bg') || defaultBgUrl
}

export default function App() {
  const bgUrl = useBackgroundUrl()
  return (
    <div
      className="w-screen h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <CanvasStage />
    </div>
  )
}
