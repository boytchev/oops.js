/**
 *
 */
 
 
import { Color } from 'three';


const VignetteShader = {

	name: 'VignetteShader',

	uniforms: {
		
		radius: { value: 1 },
		blur: { value: 1 },
		color: { value: new Color(0,0,0) },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 texel = $$( vUv );
			
			float dist = 1.0 - length( 2.0*vUv - vec2(1) );
			float k = smoothstep( 1.0-radius_$, 1.0-radius_$+blur_$, dist);
			
			return vec4( mix( color_$, texel.rgb, k) , texel.a );
			
		}`
		
};


export { VignetteShader };