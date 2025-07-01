precision highp float;

varying vec2 vUv;
uniform sampler2D uPrevFrame;
uniform sampler2D uSnapshot;
uniform float uDecay;
uniform vec3 uSessionRandom;

void main() {
  vec4 history = texture2D(uPrevFrame, vUv);
  vec4 snap = texture2D(uSnapshot, vUv);
  vec4 newColor = vec4(uSessionRandom, 1.0);
  
  // If there's new paint, use it. Otherwise decay the history
  if (snap.a > 0.0) {
    gl_FragColor = newColor;
  } else {
    gl_FragColor = vec4(history.rgb, history.a * uDecay);
  }
}
