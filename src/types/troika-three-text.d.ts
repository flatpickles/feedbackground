declare module 'troika-three-text' {
  import * as THREE from 'three'
  export class Text extends THREE.Mesh {
    text: string
    font: string | ArrayBuffer | null
    anchorX: string | number
    anchorY: string | number
    color: THREE.Color | string | number
    fontSize: number
    sync(callback?: () => void): void
  }
}
