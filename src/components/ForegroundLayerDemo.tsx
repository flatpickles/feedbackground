import ForegroundLayer from './ForegroundLayer'
import defaultSvgUrl from '../assets/diamond.svg?url'

function useSvgUrl(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('svg') || defaultSvgUrl
}

export default function ForegroundLayerDemo() {
  const svgUrl = useSvgUrl()
  return <ForegroundLayer url={svgUrl} color="#000000" />
}
