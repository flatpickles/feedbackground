import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

export default function useFeedbackFBO(fragmentShader: string, decay = 0.9) {
  const { gl, size, camera } = useThree()

  const snapshotGroup = useRef(new THREE.Group())
  const snapshotScene = useMemo(() => {
    const s = new THREE.Scene()
    s.add(snapshotGroup.current)
    return s
  }, [])

  const readRT = useRef(new THREE.WebGLRenderTarget(size.width, size.height))
  const writeRT = useRef(new THREE.WebGLRenderTarget(size.width, size.height))
  const snapshotRT = useRef(new THREE.WebGLRenderTarget(size.width, size.height))

  const uniforms = useMemo(
    () => ({
      uPrevFrame: { value: readRT.current.texture },
      uSnapshot: { value: snapshotRT.current.texture },
      uDecay: { value: decay },
    }),
    [decay]
  )

  const quadScene = useMemo(() => {
    const scene = new THREE.Scene()
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)
    return scene
  }, [fragmentShader, uniforms])

  const orthoCam = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    []
  )

  useEffect(() => {
    readRT.current.setSize(size.width, size.height)
    writeRT.current.setSize(size.width, size.height)
    snapshotRT.current.setSize(size.width, size.height)
  }, [size])

  useEffect(() => {
    const read = readRT.current
    const write = writeRT.current
    const snap = snapshotRT.current
    return () => {
      read.dispose()
      write.dispose()
      snap.dispose()
    }
  }, [])

  useFrame(() => {
    // Snapshot pass
    gl.setRenderTarget(snapshotRT.current)
    gl.clear()
    gl.render(snapshotScene, camera)

    // Feedback pass
    gl.setRenderTarget(writeRT.current)
    gl.render(quadScene, orthoCam)
    gl.setRenderTarget(null)

    // Swap
    const tmp = readRT.current
    readRT.current = writeRT.current
    writeRT.current = tmp
    uniforms.uPrevFrame.value = readRT.current.texture

    // Clear snapshot
    gl.setRenderTarget(snapshotRT.current)
    gl.setClearColor(0x000000, 0)
    gl.clear(true, true, true)
    gl.setRenderTarget(null)
  })

  return { snapshotRef: snapshotGroup, texture: readRT.current.texture }
}
