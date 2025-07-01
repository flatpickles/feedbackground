precision highp float;

varying vec2 vUv;
uniform sampler2D uPrevFrame;
uniform sampler2D uSnapshot;
uniform float uDecay;
uniform vec3 uSessionRandom;

void main() {
  vec4 history = texture2D(uPrevFrame, vUv) * uDecay;
  float mask = texture2D(uSnapshot, vUv).a;
  vec3 color = uSessionRandom;
  gl_FragColor = history + vec4(color * mask, mask);
}
