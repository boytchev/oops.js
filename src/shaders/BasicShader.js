/**
 *
 * Ported from examples/jsm/shaders/BasicShader.js
 *
 */
 
 
import { Color } from 'three';


const BasicShader = {

	uniforms: {
		
		color: { value: new Color(1,0,0) },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			return vec4( color_$, vUv.y );
			
		}`
		
};


export { BasicShader };