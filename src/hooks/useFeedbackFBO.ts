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
  interpQueue?: MutableRefObject<DragSpringPose[]>,
  externalRef?: MutableRefObject<THREE.Group | null>,
  preprocessShader: string | null = null,
  preprocessRadius = 1
) {
  const { gl, size, camera } = useThree()
  const dpr = gl.getPixelRatio()

  const internalRef = useRef<THREE.Group | null>(null)
  const snapshotGroup = externalRef ?? internalRef

  const activeRef = useRef(active)
  useEffect(() => {
    activeRef.current = active
  }, [active])

  const sessionRandom = useRef(
    new THREE.Vector3(Math.random(), Math.random(), Math.random())
  )

  const timeRef = useRef(0)

  const readRT = useRef(
    new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr, {
      type: THREE.HalfFloatType,
    })
  )
  const writeRT = useRef(
    new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr, {
      type: THREE.HalfFloatType,
    })
  )
  const snapshotRT = useRef(
    new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr, {
      type: THREE.HalfFloatType,
    })
  )
  const preprocessRT = useRef(
    new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr, {
      type: THREE.HalfFloatType,
    })
  )

  const preprocessUniforms = useMemo(
    () => ({
      uTexture: { value: snapshotRT.current.texture },
      uTexelSize: {
        value: new THREE.Vector2(
          1 / (size.width * dpr),
          1 / (size.height * dpr)
        ),
      },
      uRadius: { value: preprocessRadius },
    }),
    [size, dpr, preprocessRadius]
  )

  const lastSnapshotPos = useRef(new THREE.Vector2(Infinity, Infinity))

  const preprocessScene = useMemo<THREE.Scene | null>(() => {
    if (!preprocessShader) return null
    const scene = new THREE.Scene()
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: preprocessShader,
      uniforms: preprocessUniforms,
      blending: THREE.NoBlending,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)
    return scene
  }, [preprocessUniforms, preprocessShader])

  const uniforms = useMemo(
    () => ({
      uPrevFrame: { value: readRT.current.texture },
      uSnapshot: { value: snapshotRT.current.texture },
      uDecay: { value: decay },
      uSessionRandom: { value: sessionRandom.current.clone() },
      uTime: { value: 0 },
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
    const ratio = gl.getPixelRatio()
    readRT.current.setSize(size.width * ratio, size.height * ratio)
    writeRT.current.setSize(size.width * ratio, size.height * ratio)
    snapshotRT.current.setSize(size.width * ratio, size.height * ratio)
    preprocessRT.current.setSize(size.width * ratio, size.height * ratio)
    preprocessUniforms.uTexelSize.value.set(
      1 / (size.width * ratio),
      1 / (size.height * ratio)
    )
  }, [size, gl, preprocessUniforms])

  useEffect(() => {
    const read = readRT.current
    const write = writeRT.current
    const snap = snapshotRT.current
    const preprocessT = preprocessRT.current
    return () => {
      read.dispose()
      write.dispose()
      snap.dispose()
      preprocessT.dispose()
    }
  }, [])

  useFrame((state) => {
    timeRef.current = state.clock.getElapsedTime()
    uniforms.uTime.value = timeRef.current
    // Prepare snapshot texture
    gl.setRenderTarget(snapshotRT.current)
    gl.setClearColor(0x000000, 0)
    gl.clear(true, true, true)
    let moved = false
    if (
      snapshotGroup.current &&
      (activeRef.current || (interpQueue && interpQueue.current.length > 0))
    ) {
      const group = snapshotGroup.current
      const poses = interpQueue
        ? interpQueue.current.splice(0, interpQueue.current.length)
        : []
      if (poses.length === 0) {
        poses.push({ x: group.position.x, y: group.position.y })
      }
      const originalPos = { x: group.position.x, y: group.position.y }
      const prevAuto = gl.autoClear
      gl.autoClear = false
      for (const p of poses) {
        group.position.x = p.x
        group.position.y = p.y
        group.updateMatrixWorld()
        gl.render(group, camera)
        if (
          p.x !== lastSnapshotPos.current.x ||
          p.y !== lastSnapshotPos.current.y
        ) {
          moved = true
          lastSnapshotPos.current.set(p.x, p.y)
        }
      }
      gl.autoClear = prevAuto
      group.position.set(originalPos.x, originalPos.y, group.position.z)
      group.updateMatrixWorld()
    }

    if (moved && preprocessShader && preprocessScene) {
      preprocessUniforms.uTexture.value = snapshotRT.current.texture
      preprocessUniforms.uRadius.value = preprocessRadius
      gl.setRenderTarget(preprocessRT.current)
      gl.render(preprocessScene, orthoCam)
      gl.setRenderTarget(null)
      uniforms.uSnapshot.value = preprocessRT.current.texture
    } else if (moved) {
      uniforms.uSnapshot.value = snapshotRT.current.texture
    } else {
      // No movement: use empty snapshot
      uniforms.uSnapshot.value = snapshotRT.current.texture
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
