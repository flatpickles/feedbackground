import * as THREE from 'three'
import { Text } from 'troika-three-text'
import type { ScenePass, PassSetupContext, PassRenderContext } from './pass'

const asciiChars = [
  '█','▓','▒','░','@','#','M','W','&','8','B','%','Q','D','O','0','G','H','K','X','N','U','Z','Y','C','V','J','L','I','!',';',',','.','`',' '
]

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

  let cols = 0
  let rows = 0
  let texts: Text[] = []
  let sampleTarget: THREE.WebGLRenderTarget
  let sampleMaterial: THREE.ShaderMaterial
  let sampleScene: THREE.Scene
  let sampleCamera: THREE.Camera
  let data: Uint8Array
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  function setup(ctx: PassSetupContext) {
    const { size, extraParams } = ctx
    const charWidth = (extraParams.charWidth as number) ?? 12
    cols = Math.max(1, Math.floor(size.x / charWidth))
    rows = Math.max(1, Math.floor(size.y / charWidth))
    const cellW = 2 / cols
    const cellH = 2 / rows
    texts = []
    scene.clear()
    const group = new THREE.Group()
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const t = new Text()
        t.font = 'GeneralSans-Bold.woff'
        t.text = ' '
        t.color = '#000000'
        t.anchorX = 'center'
        t.anchorY = 'middle'
        t.fontSize = cellH
        t.position.set(-1 + (x + 0.5) * cellW, 1 - (y + 0.5) * cellH, 0)
        group.add(t)
        texts.push(t)
      }
    }
    scene.add(group)
    sampleTarget = new THREE.WebGLRenderTarget(cols, rows, {
      type: THREE.UnsignedByteType,
      depthBuffer: false,
    })
    sampleMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}`,
      fragmentShader: `varying vec2 vUv;uniform sampler2D uInput;void main(){vec4 c=texture2D(uInput,vUv);float l=dot(c.rgb,vec3(0.299,0.587,0.114))*c.a;gl_FragColor=vec4(vec3(l),1.0);}`,
      uniforms: { uInput: { value: null as unknown as THREE.Texture } },
      blending: THREE.NoBlending,
    })
    const quad = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(quad, sampleMaterial)
    sampleScene = new THREE.Scene()
    sampleScene.add(mesh)
    sampleCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    data = new Uint8Array(cols * rows * 4)
  }

  function render(ctx: PassRenderContext) {
    const { gl, input, output } = ctx
    sampleMaterial.uniforms.uInput.value = input
    gl.setRenderTarget(sampleTarget)
    gl.render(sampleScene, sampleCamera)
    gl.readRenderTargetPixels(sampleTarget, 0, 0, cols, rows, data)
    gl.setRenderTarget(null)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = (y * cols + x) * 4
        const lum = data[idx] / 255
        const charIdx = Math.floor((1 - lum) * (asciiChars.length - 1))
        const char = asciiChars[charIdx]
        const t = texts[y * cols + x]
        if (t.text !== char) {
          t.text = char
          t.sync()
        }
      }
    }

    gl.setRenderTarget(output)
    gl.setClearColor(0x000000, 0)
    gl.clear(true, true, true)
    gl.render(scene, camera)
    gl.setRenderTarget(null)
  }

  function cleanup() {
    sampleTarget.dispose()
    sampleMaterial.dispose()
    sampleScene.clear()
    scene.clear()
  }

  pass.data = { scene, camera }
  return pass
}
