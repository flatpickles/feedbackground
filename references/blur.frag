// Apply a motion blur effect on an orbiting circle.

precision mediump float;

varying vec2 vUv;
uniform float time;
uniform vec2 renderSize;

uniform sampler2D passBuffer0;
uniform sampler2D passBuffer1;

void main(){
    
    #if defined PASS_0// (output to passBuffer0)
    // scale uv to aspect ratio:
    vec2 xy=vUv*2.-1.;
    xy.y=xy.y*renderSize.y/renderSize.x;
    // draw a circle orbiting the center:
    vec2 center=vec2(sin(time)/2.,cos(time)/2.);
    float dist=distance(xy,center);
    vec4 current=vec4(vec3(step(dist,.1)),1.);
    // mix with the previous frame:
    vec4 previous=texture(passBuffer1,vUv);
    gl_FragColor=mix(current,previous,.9);
    
    #elif defined PASS_1// (output to passBuffer1)
    // preserve the first pass for use in the next frame:
    gl_FragColor=texture(passBuffer0,vUv);
    
    #else// (output to screen)
    // render the first pass directly to the screen:
    gl_FragColor=texture(passBuffer0,vUv);
    
    #endif
}
