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

import type { MutableRefObject } from 'react'
import type { DragSpringPose } from './useDragAndSpring'

export default function useFeedbackFBO(
  fragmentShader: string,
  decay = 0.9,
  active = true,
  sessionId = 0,
  interpQueue?: MutableRefObject<DragSpringPose[]>
) {
  const { gl, size, camera } = useThree()

  const snapshotGroup = useRef<THREE.Group | null>(null)

  const sessionRandom = useRef(
    new THREE.Vector3(Math.random(), Math.random(), Math.random())
  )

  const readRT = useRef(new THREE.WebGLRenderTarget(size.width, size.height))
  const writeRT = useRef(new THREE.WebGLRenderTarget(size.width, size.height))
  const snapshotRT = useRef(
    new THREE.WebGLRenderTarget(size.width, size.height)
  )

  const uniforms = useMemo(
    () => ({
      uPrevFrame: { value: readRT.current.texture },
      uSnapshot: { value: snapshotRT.current.texture },
      uDecay: { value: decay },
      uSessionRandom: { value: sessionRandom.current.clone() },
    }),
    [decay]
  )

  const quadScene = useMemo(() => {
    const scene = new THREE.Scene()
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      blending: THREE.NoBlending,
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
    sessionRandom.current.set(Math.random(), Math.random(), Math.random())
    uniforms.uSessionRandom.value.copy(sessionRandom.current)
  }, [sessionId, uniforms])

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
    // Prepare snapshot texture
    gl.setRenderTarget(snapshotRT.current)
    gl.setClearColor(0x000000, 0)
    gl.clear(true, true, true)
    if (active && snapshotGroup.current) {
      const group = snapshotGroup.current
      const poses = interpQueue
        ? interpQueue.current.splice(0, interpQueue.current.length)
        : []
      if (poses.length === 0) {
        poses.push({ x: group.position.x, y: group.position.y })
      }
      for (const p of poses) {
        group.position.x = p.x
        group.position.y = p.y
        group.updateMatrixWorld()
        gl.render(group, camera)
      }
    }

    // Feedback pass
    gl.setRenderTarget(writeRT.current)
    gl.render(quadScene, orthoCam)
    gl.setRenderTarget(null)

    // Swap
    const tmp = readRT.current
    readRT.current = writeRT.current
    writeRT.current = tmp
    uniforms.uPrevFrame.value = readRT.current.texture
  })

  return { snapshotRef: snapshotGroup, texture: readRT.current.texture }
}
