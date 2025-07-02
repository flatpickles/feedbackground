precision highp float;

varying vec2 vUv;
uniform sampler2D uPrevFrame;
uniform sampler2D uSnapshot;
uniform float uDecay;
uniform vec3 uSessionRandom;

void main() {
  vec4 history = texture2D(uPrevFrame, vUv);
  float mask = texture2D(uSnapshot, vUv).a;

  // Accumulate using premultiplied alpha to avoid dark fringes
  vec3 historyPremul = history.rgb * history.a * uDecay;
  vec3 newPremul = uSessionRandom * mask;

  float alpha = clamp(history.a * uDecay + mask, 0.0, 1.0);
  vec3 accum = historyPremul + newPremul;
  vec3 color = alpha > 0.0 ? accum / alpha : vec3(0.0);

  gl_FragColor = vec4(color, alpha);
}
