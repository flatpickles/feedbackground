precision highp float;

varying vec2 vUv;
uniform sampler2D uPrevFrame;
uniform sampler2D uSnapshot;
uniform float uDecay;
uniform float uTime;

float random(vec2 st){
  return fract(sin(dot(st, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st){
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
             mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
             u.y);
}

void main(){
    vec2 uv=vUv;
    float n=noise(uv*4.0+uTime*0.5);
    uv+= (n-0.5)*0.05;
    vec4 history=texture2D(uPrevFrame,uv)*uDecay;
    vec4 snap=texture2D(uSnapshot,vUv);
    gl_FragColor=history+snap;
}
