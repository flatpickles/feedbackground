precision highp float;

varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uTexelSize;
uniform float uRadius;

void main() {
  vec2 off = uTexelSize * uRadius;
  vec4 sum = vec4(0.0);
  sum += texture2D(uTexture, vUv + off * vec2(-1.0, -1.0)) * 1.0;
  sum += texture2D(uTexture, vUv + off * vec2(0.0, -1.0)) * 2.0;
  sum += texture2D(uTexture, vUv + off * vec2(1.0, -1.0)) * 1.0;
  sum += texture2D(uTexture, vUv + off * vec2(-1.0, 0.0)) * 2.0;
  sum += texture2D(uTexture, vUv) * 4.0;
  sum += texture2D(uTexture, vUv + off * vec2(1.0, 0.0)) * 2.0;
  sum += texture2D(uTexture, vUv + off * vec2(-1.0, 1.0)) * 1.0;
  sum += texture2D(uTexture, vUv + off * vec2(0.0, 1.0)) * 2.0;
  sum += texture2D(uTexture, vUv + off * vec2(1.0, 1.0)) * 1.0;
  gl_FragColor = sum / 16.0;
}
