import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import type { DragSpringPose } from './useDragAndSpring'
import type { PassDescriptor } from '../effects'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

export default function useFeedbackFBO(
  passes: readonly PassDescriptor[],
  decay = 0.975,
  active = true,
  sessionId = 0,
  interpQueue?: MutableRefObject<DragSpringPose[]>,
  externalRef?: MutableRefObject<THREE.Group | null>,
  passParams: Record<string, Record<string, number | boolean>> = {},
  paintWhileStill = false
) {
  const { gl, size, camera, viewport } = useThree()
  const dpr = gl.getPixelRatio()

  const internalRef = useRef<THREE.Group | null>(null)
  const snapshotGroup = externalRef ?? internalRef

  const sessionRandom = useRef(
    new THREE.Vector3(Math.random() / 2, Math.random() / 2, Math.random() / 2)
  )

  const timeRef = useRef(0)

  const snapshotRT = useRef(
    new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr, {
      type: THREE.HalfFloatType,
    })
  )

  const passTargets = useRef(
    passes.map(
      () =>
        ({
          read: new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr, {
            type: THREE.HalfFloatType,
          }),
          write: new THREE.WebGLRenderTarget(
            size.width * dpr,
            size.height * dpr,
            { type: THREE.HalfFloatType }
          ),
        })
    )
  )

  const baseUniforms = useMemo(
    () => ({
      uDecay: { value: decay },
      uSessionRandom: { value: sessionRandom.current.clone() },
      uTime: { value: 0 },
      uSpeed: { value: (passParams.rippleFade?.speed as number) ?? 0.05 },
      uDisplacement: {
        value: (passParams.rippleFade?.displacement as number) ?? 0.0015,
      },
      uDetail: { value: (passParams.rippleFade?.detail as number) ?? 1 },
      uZoom: { value: (passParams.rippleFade?.zoom as number) ?? 0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [decay, passParams]
  )

  const passData = useMemo(() => {
    return passes.map((p, idx) => {
      if (p.type !== 'shader') return null
      const uniforms: Record<string, THREE.IUniform> = {
        ...baseUniforms,
        uThisPassPreviousFrame: {
          value: passTargets.current[idx].read.texture,
        },
        uPreviousPassThisFrame: { value: snapshotRT.current.texture },
        uPreviousFrameLastPass: {
          value: passTargets.current[passes.length - 1].read.texture,
        },
      }
      const extra = passParams[p.name ?? ''] ?? {}
      for (const [k, v] of Object.entries(extra)) {
        if (uniforms[k]) uniforms[k].value = v
        else uniforms[k] = { value: v }
      }
      if (p.name === 'blur') {
        uniforms.uTexture = { value: snapshotRT.current.texture }
        uniforms.uTexelSize = {
          value: new THREE.Vector2(1 / (size.width * dpr), 1 / (size.height * dpr)),
        }
      }
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: p.fragment,
        uniforms,
        blending: THREE.NoBlending,
      })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
      const scene = new THREE.Scene()
      scene.add(mesh)
      return { scene, uniforms }
    })
  }, [passes, baseUniforms, passParams, size, dpr])

  const orthoCam = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    []
  )

  useEffect(() => {
    sessionRandom.current.set(
      Math.random() / 2,
      Math.random() / 2,
      Math.random() / 2
    )
    passData.forEach((p) => {
      if (p) (p.uniforms.uSessionRandom.value as THREE.Vector3).copy(
        sessionRandom.current
      )
    })
  }, [sessionId, passData])

  useEffect(() => {
    const ratio = gl.getPixelRatio()
    snapshotRT.current.setSize(size.width * ratio, size.height * ratio)
    passTargets.current.forEach((t) => {
      t.read.setSize(size.width * ratio, size.height * ratio)
      t.write.setSize(size.width * ratio, size.height * ratio)
    })
    passData.forEach((p) => {
      if (!p) return
      if (p.uniforms.uTexelSize)
        p.uniforms.uTexelSize.value.set(
          1 / (size.width * ratio),
          1 / (size.height * ratio)
        )
    })
  }, [size, gl, passData])

  useEffect(() => {
    const snap = snapshotRT.current
    const targets = passTargets.current
    return () => {
      snap.dispose()
      targets.forEach((t) => {
        t.read.dispose()
        t.write.dispose()
      })
    }
  }, [passes])

  const lastSnapshotPos = useRef(new THREE.Vector2(Infinity, Infinity))

  useFrame((state) => {
    timeRef.current = state.clock.getElapsedTime()
    passData.forEach((p) => {
      if (p) p.uniforms.uTime.value = timeRef.current
    })

    const centerZoom = Boolean(passParams.rippleFade?.centerZoom)
    if (centerZoom || !snapshotGroup.current) {
      passData.forEach((p) => {
        if (p && p.uniforms.uCenter)
          (p.uniforms.uCenter.value as THREE.Vector2).set(0.5, 0.5)
      })
    } else {
      const cx = snapshotGroup.current.position.x / viewport.width + 0.5
      const cy = snapshotGroup.current.position.y / viewport.height + 0.5
      passData.forEach((p) => {
        if (p && p.uniforms.uCenter)
          (p.uniforms.uCenter.value as THREE.Vector2).set(cx, cy)
      })
    }

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
        if (
          paintWhileStill ||
          p.x !== lastSnapshotPos.current.x ||
          p.y !== lastSnapshotPos.current.y
        ) {
          group.position.x = p.x
          group.position.y = p.y
          group.updateMatrixWorld()
          gl.render(group, camera)
          lastSnapshotPos.current.set(p.x, p.y)
        }
      }
      gl.autoClear = prevAuto
      group.position.set(originalPos.x, originalPos.y, group.position.z)
      group.updateMatrixWorld()
    }
    gl.setRenderTarget(null)

    let prevTexture = snapshotRT.current.texture
    const lastIndex = passes.length - 1
    passes.forEach((pass, idx) => {
      const data = passData[idx]
      if (!data) return
      data.uniforms.uPreviousPassThisFrame.value = prevTexture
      data.uniforms.uThisPassPreviousFrame.value = passTargets.current[idx].read.texture
      data.uniforms.uPreviousFrameLastPass.value = passTargets.current[lastIndex].read.texture
      if (pass.name === 'blur') {
        data.uniforms.uTexture.value = prevTexture
      }
      gl.setRenderTarget(passTargets.current[idx].write)
      gl.render(data.scene, orthoCam)
      gl.setRenderTarget(null)
      ;[passTargets.current[idx].read, passTargets.current[idx].write] = [
        passTargets.current[idx].write,
        passTargets.current[idx].read,
      ]
      prevTexture = passTargets.current[idx].read.texture
    })
  })

  const outputTex = passes.length
    ? passTargets.current[passes.length - 1].read.texture
    : snapshotRT.current.texture

  return { snapshotRef: snapshotGroup, texture: outputTex }
}
