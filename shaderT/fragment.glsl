varying vec2 vUv;
varying vec3 vPosition;

void main(){
    gl_FragColor = vec4(1.,0.,0.,1.);
    gl_FragColor = vec4(vUv,0.,1.);
    gl_FragColor = vec4(vPosition,1.);
}