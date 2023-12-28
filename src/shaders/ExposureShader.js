﻿/**
 *
 * Ported from examples/jsm/shaders/ExposureShader.js
 *
 */
 
 
const ExposureShader = {

	uniforms: {
		
		exposure: { value: 1.0 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 color = $$( vUv );
			
			color.rgb *= exposure_$;
			
			return color;
			
		}`
		
};


export { ExposureShader };