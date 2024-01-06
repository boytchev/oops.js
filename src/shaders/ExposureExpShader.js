/**
 *
 * Ported from examples/jsm/shaders/ExposureExpShader.js
 *
 */
 
 
const ExposureExpShader = {
	
	type: 'O',
	
	weight: 1,

	uniforms: {
		
		exposure: { value: 0.0 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 color = $$( vUv );
			
			color.rgb *= exp(exposure_$);
			
			return color;
			
		}`
		
};


export { ExposureExpShader };