precision highp float;

varying vec2 vUv;
uniform sampler2D uPrevFrame;
uniform sampler2D uSnapshot;
uniform float uDecay;
uniform vec3 uSessionRandom;

void main() {
  vec4 history = texture2D(uPrevFrame, vUv);
  float oldAlpha = history.a * uDecay;
  vec3 oldColor = history.rgb;

  float newAlpha = texture2D(uSnapshot, vUv).a;
  vec3 newColor = uSessionRandom;

  float outAlpha = newAlpha + oldAlpha * (1.0 - newAlpha);
  vec3 outColor = (newColor * newAlpha + oldColor * oldAlpha * (1.0 - newAlpha)) /
                  max(outAlpha, 1e-5);

  if (outAlpha < 1e-3) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  } else {
    gl_FragColor = vec4(outColor, outAlpha);
  }
}
