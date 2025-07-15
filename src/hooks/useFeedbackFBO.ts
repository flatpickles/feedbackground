import { useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import type { DragSpringPose } from './useDragAndSpring'
import type { AnyPass, ScenePass, ShaderPassData, ScenePassData } from '../effects/pass'
import { setupShaderPass, renderShaderPass } from '../effects/pass'


export default function useFeedbackFBO(
  passes: readonly AnyPass[],
  decay = 0.975,
  active = true,
  sessionId = 0,
  interpQueue?: MutableRefObject<DragSpringPose[]>,
  externalRef?: MutableRefObject<THREE.Group | null>,
  passParams: Array<Record<string, number | boolean>> = [],
  centerZoom = false,
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
      depthBuffer: false,
    })
  )

  const createTarget = useCallback(() => {
    return {
      read: new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr, {
        type: THREE.HalfFloatType,
        depthBuffer: false,
      }),
      write: new THREE.WebGLRenderTarget(size.width * dpr, size.height * dpr, {
        type: THREE.HalfFloatType,
        depthBuffer: false,
      }),
    }
  }, [size, dpr])

  const passTargets = useRef<{
    read: THREE.WebGLRenderTarget
    write: THREE.WebGLRenderTarget
  }[]>(passes.map(() => createTarget()))

  const lastPassData = useRef<Array<ShaderPassData | ScenePassData | null>>([])
  const lastPasses = useRef<AnyPass[]>([])

  const ensureTargets = useCallback(() => {
    const ratio = gl.getPixelRatio()
    while (passTargets.current.length < passes.length) {
      passTargets.current.push(createTarget())
    }
    while (passTargets.current.length > passes.length) {
      const t = passTargets.current.pop()
      if (t) {
        t.read.dispose()
        t.write.dispose()
      }
    }
    passTargets.current.forEach((t) => {
      t.read.setSize(size.width * ratio, size.height * ratio)
      t.write.setSize(size.width * ratio, size.height * ratio)
    })
  }, [gl, size, passes, createTarget])

  useEffect(() => {
    ensureTargets()
  }, [ensureTargets])

  const { width, height } = size
  const baseUniforms = useMemo(
    () => ({
      uDecay: { value: decay },
      uSessionRandom: { value: sessionRandom.current.clone() },
      uTime: { value: 0 },
      uTexelSize: {
        value: new THREE.Vector2(1 / (width * dpr), 1 / (height * dpr)),
      },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [decay, width, height, dpr]
  )

  const passData = useMemo(() => {
    ensureTargets()
    return passes.map((p, idx) => {
      if (p.type === 'shader') {
        setupShaderPass(p, {
          passIndex: idx,
          gl,
          size: new THREE.Vector2(size.width * dpr, size.height * dpr),
          baseUniforms: {
            ...baseUniforms,
            uThisPassPreviousFrame: { value: passTargets.current[idx].read.texture },
            uPreviousPassThisFrame: { value: snapshotRT.current.texture },
          },
          extraParams: passParams[idx] ?? {},
        })
        return p.data ?? null
      }
      p.setup?.({
        passIndex: idx,
        gl,
        size: new THREE.Vector2(size.width * dpr, size.height * dpr),
        baseUniforms,
        extraParams: passParams[idx] ?? {},
      })
      return (p as ScenePass).data ?? null
    })
  }, [passes, baseUniforms, passParams, ensureTargets, gl, size, dpr])

  useEffect(() => {
    const previousData = lastPassData.current
    const previousPasses = lastPasses.current
    lastPassData.current = passData
    lastPasses.current = Array.from(passes)
    return () => {
      previousData.forEach((p, idx) => {
        if (!p) return
        const pass = previousPasses[idx]
        if (pass && pass.type === 'shader') {
          (p as ShaderPassData).material.dispose()
        }
        pass?.cleanup?.()
        p.scene.clear()
      })
    }
  }, [passes, passData])


  useEffect(() => {
    sessionRandom.current.set(
      Math.random() / 2,
      Math.random() / 2,
      Math.random() / 2
    )
    passes.forEach((pass, idx) => {
      const p = passData[idx] as ShaderPassData | ScenePassData | null
      if (!p) return
      if (pass.type === 'shader') {
        ;(p as ShaderPassData).uniforms.uSessionRandom.value
          .copy(sessionRandom.current)
      }
    })
  }, [sessionId, passData, passes])

  useEffect(() => {
    const ratio = gl.getPixelRatio()
    snapshotRT.current.setSize(size.width * ratio, size.height * ratio)
    passTargets.current.forEach((t) => {
      t.read.setSize(size.width * ratio, size.height * ratio)
      t.write.setSize(size.width * ratio, size.height * ratio)
    })
    passes.forEach((pass, idx) => {
      const p = passData[idx] as ShaderPassData | ScenePassData | null
      if (!p || pass.type !== 'shader') return
      const sp = p as ShaderPassData
      sp.uniforms.uTexelSize.value.set(
        1 / (size.width * ratio),
        1 / (size.height * ratio)
      )
    })
  }, [size, gl, passData, passes])

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
    passes.forEach((pass, idx) => {
      const p = passData[idx] as ShaderPassData | ScenePassData | null
      if (pass.type === 'shader' && p) {
        (p as ShaderPassData).uniforms.uTime.value = timeRef.current
      }
    })

    if (centerZoom || !snapshotGroup.current) {
      passes.forEach((pass, idx) => {
        const p = passData[idx]
        if (pass.type === 'shader' && p) {
          ((p as ShaderPassData).uniforms.uCenter.value as THREE.Vector2).set(
            0.5,
            0.5
          )
        }
      })
    } else {
      const cx = snapshotGroup.current.position.x / viewport.width + 0.5
      const cy = snapshotGroup.current.position.y / viewport.height + 0.5
      passes.forEach((pass, idx) => {
        const p = passData[idx]
        if (pass.type === 'shader' && p) {
          ((p as ShaderPassData).uniforms.uCenter.value as THREE.Vector2).set(
            cx,
            cy
          )
        }
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
    } else {
      lastSnapshotPos.current.set(Infinity, Infinity)
    }
    gl.setRenderTarget(null)

    let prevTexture = snapshotRT.current.texture
    passes.forEach((p, idx) => {
      const data = passData[idx]
      if (!data) return
      if (p.type === 'shader') {
        renderShaderPass(p, {
          gl,
          input: prevTexture,
          history: passTargets.current[idx].read.texture,
          output: passTargets.current[idx].write,
          time: timeRef.current,
        })
      } else if (p.type === 'scene') {
        p.render?.({
          gl,
          input: prevTexture,
          history: passTargets.current[idx].read.texture,
          output: passTargets.current[idx].write,
          time: timeRef.current,
        })
      }
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
