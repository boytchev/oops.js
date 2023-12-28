/**
 *
 * Ported from examples/jsm/shaders/GammaCorrectionShader.js
 *
 */
 
 
const GammaCorrectionShader = {

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			return sRGBTransferOETF( $$( vUv ) );
			
		}`
		
};


export { GammaCorrectionShader };