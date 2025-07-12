precision highp float;

varying vec2 vUv;
uniform sampler2D uThisPassPreviousFrame;
uniform sampler2D uPreviousPassThisFrame;
uniform sampler2D uPreviousFrameLastPass;
uniform float uDecay;

void main() {
  vec4 history = texture2D(uThisPassPreviousFrame, vUv);
  vec4 snap = texture2D(uPreviousPassThisFrame, vUv);
  gl_FragColor = history * uDecay + snap;
}
