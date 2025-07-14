import * as THREE from 'three'

export type PassParamDef = {
  id: string
  uniform?: string
  type: 'number' | 'boolean'
  label: string
  default: number | boolean
  min?: number
  max?: number
  step?: number
}

export interface Pass {
  params?: readonly PassParamDef[]
  setup?: (ctx: PassSetupContext) => void
  render?: (ctx: PassRenderContext) => void
}

export interface PassSetupContext {
  passIndex: number
  baseUniforms: Record<string, THREE.IUniform>
  extraParams: Record<string, number | boolean>
}

export interface PassRenderContext {
  gl: THREE.WebGLRenderer
  input: THREE.Texture
  history: THREE.Texture
  output: THREE.WebGLRenderTarget
  time: number
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

export interface ShaderPassData {
  scene: THREE.Scene
  camera: THREE.Camera
  uniforms: Record<string, THREE.IUniform>
  material: THREE.ShaderMaterial
}

export interface ShaderPass extends Pass {
  type: 'shader'
  fragment: string
  data?: ShaderPassData
}

export function shaderPass(
  fragment: string,
  params?: readonly PassParamDef[]
): ShaderPass {
  return { type: 'shader', fragment, params }
}

export type ClearPass = Pass & { type: 'clear'; color?: THREE.ColorRepresentation }

export type CustomPass = Pass & { type: 'custom' }

export type AnyPass = ShaderPass | ClearPass | CustomPass

export function setupShaderPass(pass: ShaderPass, ctx: PassSetupContext) {
  const { baseUniforms, extraParams } = ctx
  const uniforms: Record<string, THREE.IUniform> = {
    ...baseUniforms,
    uThisPassPreviousFrame: { value: null as unknown as THREE.Texture },
    uPreviousPassThisFrame: { value: null as unknown as THREE.Texture },
  }
  for (const [k, v] of Object.entries(extraParams)) {
    if (uniforms[k]) uniforms[k].value = v
    else uniforms[k] = { value: v }
  }
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: pass.fragment,
    uniforms,
    blending: THREE.NoBlending,
  })
  const quad = new THREE.PlaneGeometry(2, 2)
  const mesh = new THREE.Mesh(quad, material)
  const scene = new THREE.Scene()
  scene.add(mesh)
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  pass.data = { scene, camera, uniforms, material }
}

export function renderShaderPass(
  pass: ShaderPass,
  ctx: PassRenderContext
) {
  if (!pass.data) return
  const { gl, input, history, output } = ctx
  pass.data.uniforms.uPreviousPassThisFrame.value = input
  pass.data.uniforms.uThisPassPreviousFrame.value = history
  gl.setRenderTarget(output)
  gl.render(pass.data.scene, pass.data.camera)
  gl.setRenderTarget(null)
}
