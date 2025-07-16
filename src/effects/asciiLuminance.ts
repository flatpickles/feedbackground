import * as THREE from 'three'
import type { ScenePass, PassSetupContext, PassRenderContext } from './pass'

const asciiChars = [
  '█','▓','▒','░','@','#','M','W','&','8','B','%','Q','D','O','0','G','H','K','X',
  'N','U','Z','Y','C','V','J','L','I','!',';',',','.','`',' '
]

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uInput;
  uniform sampler2D uAtlas;
  uniform float uCols;
  uniform float uRows;
  uniform float uCharCount;
  void main() {
    vec2 uv = vUv;
    vec2 cell = floor(uv * vec2(uCols, uRows));
    vec2 sampleUV = (cell + 0.5) / vec2(uCols, uRows);
    vec4 color = texture2D(uInput, sampleUV);
    float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114)) * color.a;
    float index = floor((1.0 - lum) * (uCharCount - 1.0) + 0.5);
    vec2 local = fract(uv * vec2(uCols, uRows));
    local = vec2(1.0 - local.x, 1.0 - local.y);
    vec2 atlasUV = vec2((index + local.x) / uCharCount, local.y);
    vec4 glyph = texture2D(uAtlas, atlasUV);
    gl_FragColor = vec4(0.0, 0.0, 0.0, glyph.a * lum);
  }
`

export default function asciiLuminancePass(): ScenePass {
  const pass: ScenePass = {
    type: 'scene',
    params: [
      {
        id: 'charWidth',
        type: 'number',
        label: 'char width',
        default: 12,
        min: 4,
        max: 64,
        step: 1,
      },
    ],
    setup,
    render,
    cleanup,
  }

  let scene: THREE.Scene | null = null
  let camera: THREE.OrthographicCamera | null = null
  let material: THREE.ShaderMaterial | null = null
  let geometry: THREE.PlaneGeometry | null = null
  let atlas: THREE.Texture | null = null

  function makeAtlas(size: number) {
    const canvas = document.createElement('canvas')
    canvas.width = size * asciiChars.length
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000'
    ctx.font = `${size}px monospace`
    ctx.textBaseline = 'top'
    asciiChars.forEach((ch, i) => {
      ctx.fillText(ch, i * size, 0)
    })
    const tex = new THREE.CanvasTexture(canvas)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.NearestFilter
    tex.flipY = false
    return tex
  }

  function setup(ctx: PassSetupContext) {
    cleanup()
    const { size, extraParams } = ctx
    const charWidth = (extraParams.charWidth as number) ?? 12
    const cols = Math.max(1, Math.floor(size.x / charWidth))
    const rows = Math.max(1, Math.floor(size.y / charWidth))

    atlas = makeAtlas(64)
    geometry = new THREE.PlaneGeometry(2, 2)
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uInput: { value: null as unknown as THREE.Texture },
        uAtlas: { value: atlas },
        uCols: { value: cols },
        uRows: { value: rows },
        uCharCount: { value: asciiChars.length },
      },
      transparent: true,
      blending: THREE.NoBlending,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene = new THREE.Scene()
    scene.add(mesh)
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    pass.data = { scene, camera }
  }

  function render(ctx: PassRenderContext) {
    if (!scene || !camera || !material) return
    material.uniforms.uInput.value = ctx.input
    ctx.gl.setRenderTarget(ctx.output)
    ctx.gl.setClearColor(0x000000, 0)
    ctx.gl.clear(true, true, true)
    ctx.gl.render(scene, camera)
    ctx.gl.setRenderTarget(null)
  }

  function cleanup() {
    geometry?.dispose()
    material?.dispose()
    atlas?.dispose()
    scene?.clear()
    scene = null
    camera = null
    material = null
    geometry = null
    atlas = null
  }

  return pass
}
