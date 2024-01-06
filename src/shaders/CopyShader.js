/**
 *
 * Ported from examples/jsm/shaders/CopyShader.js
 *
 */
 
 
const CopyShader = {
	
	type: 'O',
	
	weight: 1,

	uniforms: {
		
		opacity:  { value: 1.0 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			return opacity_$ * $$( vUv );
			
		}`
		
};


export { CopyShader };