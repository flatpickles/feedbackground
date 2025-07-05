precision highp float;

uniform vec3 uGrabPoint;
uniform vec3 uDelta;
uniform float uRigidity;
uniform float uExtent;


varying vec2 vUv;

void main() {
  vUv = uv;
  float dist = distance(position.xy / uExtent, uGrabPoint.xy / uExtent);
  float influence = exp(-uRigidity * dist);
  vec3 displaced = position + uDelta * influence;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
