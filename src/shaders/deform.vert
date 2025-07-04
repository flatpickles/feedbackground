precision highp float;

uniform vec3 uGrabPoint;
uniform vec3 uDelta;
uniform float uRigidity;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
  vUv = uv;
  float dist = distance(position.xy, uGrabPoint.xy);
  float influence = exp(-uRigidity * dist);
  vec3 displaced = position + uDelta * influence;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
