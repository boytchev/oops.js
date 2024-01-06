/**
 *
 * Ported from examples/jsm/shaders/GammaCorrectionShader.js
 *
 */
 
 
const GammaCorrectionShader = {
	
	type: 'O',
	
	weight: 1,

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			return sRGBTransferOETF( $$( vUv ) );
			
		}`
		
};


export { GammaCorrectionShader };