/**
 *
 * Ported from examples/jsm/shaders/ColorifyShader.js
 *
 */
 
 
import { Vector3 } from 'three';


const ColorifyShader = {

	uniforms: {
		
		color: { value: new Vector3(1,1,1) },
		opacity: { value: 1 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 texel = $$( vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );
			float v = dot( texel.xyz, luma );

			return mix( texel, vec4( v * color_$, texel.w ), opacity_$ );
			
		}`
		
};


export { ColorifyShader };