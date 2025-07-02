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

const blurFragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uTexelSize;
  uniform float uRadius;

  void main() {
    vec2 off = uTexelSize * uRadius;
    vec4 sum = texture2D(uTexture, vUv + off * vec2(-1.0, -1.0));
    sum += texture2D(uTexture, vUv + off * vec2(0.0, -1.0));
    sum += texture2D(uTexture, vUv + off * vec2(1.0, -1.0));
    sum += texture2D(uTexture, vUv + off * vec2(-1.0, 0.0));
    sum += texture2D(uTexture, vUv);
    sum += texture2D(uTexture, vUv + off * vec2(1.0, 0.0));
    sum += texture2D(uTexture, vUv + off * vec2(-1.0, 1.0));
    sum += texture2D(uTexture, vUv + off * vec2(0.0, 1.0));
    sum += texture2D(uTexture, vUv + off * vec2(1.0, 1.0));
    gl_FragColor = sum / 9.0;
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
  blur = false,
  blurRadius = 1
) {
  const { gl, size, camera } = useThree()
  const dpr = gl.getPixelRatio()

  const internalRef = useRef<THREE.Group | null>(null)
  const snapshotGroup = externalRef ?? internalRef

  const sessionRandom = useRef(
    new THREE.Vector3(Math.random(), Math.random(), Math.random())
  )

  const readRT = useRef(
    new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr)
  )
  const writeRT = useRef(
    new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr)
  )
  const snapshotRT = useRef(
    new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr)
  )
  const blurRT = useRef(
    new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr)
  )

  const blurUniforms = useMemo(
    () => ({
      uTexture: { value: snapshotRT.current.texture },
      uTexelSize: {
        value: new THREE.Vector2(1 / (size.width * dpr), 1 / (size.height * dpr)),
      },
      uRadius: { value: blurRadius },
    }),
    [size, dpr, blurRadius]
  )

  const blurScene = useMemo(() => {
    const scene = new THREE.Scene()
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: blurFragmentShader,
      uniforms: blurUniforms,
      blending: THREE.NoBlending,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)
    return scene
  }, [blurUniforms])

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
    const ratio = gl.getPixelRatio()
    readRT.current.setSize(size.width * ratio, size.height * ratio)
    writeRT.current.setSize(size.width * ratio, size.height * ratio)
    snapshotRT.current.setSize(size.width * ratio, size.height * ratio)
    blurRT.current.setSize(size.width * ratio, size.height * ratio)
    blurUniforms.uTexelSize.value.set(
      1 / (size.width * ratio),
      1 / (size.height * ratio)
    )
  }, [size, gl, blurUniforms])

  useEffect(() => {
    const read = readRT.current
    const write = writeRT.current
    const snap = snapshotRT.current
    const blurT = blurRT.current
    return () => {
      read.dispose()
      write.dispose()
      snap.dispose()
      blurT.dispose()
    }
  }, [])

  useFrame(() => {
    // Prepare snapshot texture
    gl.setRenderTarget(snapshotRT.current)
    gl.setClearColor(0x000000, 0)
    gl.clear(true, true, true)
    if (
      snapshotGroup.current &&
      (active || (interpQueue && interpQueue.current.length > 0))
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
      }
      gl.autoClear = prevAuto
      group.position.set(originalPos.x, originalPos.y, group.position.z)
      group.updateMatrixWorld()
    }

    if (blur) {
      blurUniforms.uTexture.value = snapshotRT.current.texture
      blurUniforms.uRadius.value = blurRadius
      gl.setRenderTarget(blurRT.current)
      gl.render(blurScene, orthoCam)
      gl.setRenderTarget(null)
      uniforms.uSnapshot.value = blurRT.current.texture
    } else {
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
