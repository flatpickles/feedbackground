precision highp float;

varying vec2 vUv;
uniform sampler2D uPrevFrame;
uniform sampler2D uSnapshot;
uniform float uDecay;

void main(){
    vec4 history=texture2D(uPrevFrame,vUv);
    vec4 snap=texture2D(uSnapshot,vUv);
    gl_FragColor=history*uDecay+snap;
}
