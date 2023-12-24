/**
 *
 * Ported from examples/jsm/shaders/UnpackDepthRGBAShader.js
 *
 */
 
 
const UnpackDepthRGBAShader = {

	name: 'UnpackDepthRGBAShader',

	uniforms: {
		
		opacity: { value: 1.0 },
		
	},

	fragmentShaderHead: /* glsl */`
	
		#include <packing>
		
	`,
	
	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			float depth = 1.0 - unpackRGBAToDepth( $$( vUv ) );
			
			return vec4( vec3( depth ), opacity_$ );
			
		}`
		
};


export { UnpackDepthRGBAShader };