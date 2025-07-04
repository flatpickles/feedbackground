import { useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import SvgMesh from './SvgMesh'
import TextMesh from './TextMesh'
import deformVert from '../shaders/deform.vert'
import type { ForegroundContent } from '../types/foreground'
import type { SvgSize } from '../types/svg'

type Props = {
  content: ForegroundContent
  size: SvgSize
  color?: string
  grabPoint: THREE.Vector3
  delta: THREE.Vector3
  rigidity: number
}

const frag = `
precision highp float;
uniform vec3 uColor;
void main() {
  gl_FragColor = vec4(uColor, 1.0);
}
`

export default function SoftMesh({
  content,
  size,
  color = '#ffffff',
  grabPoint,
  delta,
  rigidity,
}: Props) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: deformVert,
      fragmentShader: frag,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uGrabPoint: { value: grabPoint.clone() },
        uDelta: { value: delta.clone() },
        uRigidity: { value: rigidity },
      },
      toneMapped: false,
    })
  }, [])

  useEffect(() => {
    material.uniforms.uColor.value.set(color)
  }, [color, material])


  useEffect(() => {
    material.uniforms.uRigidity.value = rigidity
  }, [rigidity, material])

  useFrame(() => {
    material.uniforms.uGrabPoint.value.copy(grabPoint)
    material.uniforms.uDelta.value.copy(delta)
  })

  return content.kind === 'svg' ? (
    <SvgMesh url={content.url} size={size} material={material} />
  ) : (
    <TextMesh text={content.text} size={size} material={material} />
  )
}
