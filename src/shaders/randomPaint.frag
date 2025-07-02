precision highp float;

varying vec2 vUv;
uniform sampler2D uPrevFrame;
uniform sampler2D uSnapshot;
uniform float uDecay;
uniform vec3 uSessionRandom;

void main() {
  vec4 history = texture2D(uPrevFrame, vUv);
  float mask = texture2D(uSnapshot, vUv).a;

  // Blend new color based on the snapshot alpha while fading history alpha
  vec3 color = mix(history.rgb, uSessionRandom, mask);
  float alpha = clamp(history.a * uDecay + mask, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}
