/**
 *
 * Ported from examples/jsm/shaders/VerticalBlurShader.js
 *
 */
 
 
const VerticalBlurShader = {
	
	type: 'O',
	
	weight: 9,

	uniforms: {
		
		resolution: { value: innerHeight },
		amount: { value: 1 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
				
			vec4 sum = vec4( 0.0 );

			vec4 color = $$( vUv );
			
			sum += $$( vec2( vUv.x, vUv.y - 4.0 * amount_$ / resolution_$ ) ) * 0.051;
			sum += $$( vec2( vUv.x, vUv.y - 3.0 * amount_$ / resolution_$ ) ) * 0.0918;
			sum += $$( vec2( vUv.x, vUv.y - 2.0 * amount_$ / resolution_$ ) ) * 0.12245;
			sum += $$( vec2( vUv.x, vUv.y - 1.0 * amount_$ / resolution_$ ) ) * 0.1531;
			sum += color * 0.1633;
			sum += $$( vec2( vUv.x, vUv.y + 1.0 * amount_$ / resolution_$ ) ) * 0.1531;
			sum += $$( vec2( vUv.x, vUv.y + 2.0 * amount_$ / resolution_$ ) ) * 0.12245;
			sum += $$( vec2( vUv.x, vUv.y + 3.0 * amount_$ / resolution_$ ) ) * 0.0918;
			sum += $$( vec2( vUv.x, vUv.y + 4.0 * amount_$ / resolution_$ ) ) * 0.051;

			return sum;
			
		}`
		
};


export { VerticalBlurShader };