/**
 *
 * Ported from examples/jsm/shaders/LuminosityShader.js
 *
 */
 
 
const LuminosityShader = {
	
	type: 'O',
	
	weight: 1,

	uniforms: {
		
		opacity: { value: 1 },
		
	},

	fragmentShaderHead: /* glsl */`
	
		#include <common>
		
	`,

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 texel = $$( vUv );

			float l = luminance( texel.rgb );

			return mix( texel, vec4( l, l, l, texel.w ), opacity_$ );
			
		}`
		
};


export { LuminosityShader };