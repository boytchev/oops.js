/**
 *
 * Ported from examples/jsm/shaders/HorizontalBlurShader.js
 *
 */
 
 
const HorizontalBlurShader = {

	name: 'HorizontalBlurShader',

	uniforms: {
		
		resolution: { value: innerWidth },
		amount: { value: 1 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
				
			vec4 sum = vec4( 0.0 );

			vec4 color = $$( vUv );
			
			sum += $$( vec2( vUv.x - 4.0 * amount_$ / resolution_$, vUv.y ) ) * 0.051;
			sum += $$( vec2( vUv.x - 3.0 * amount_$ / resolution_$, vUv.y ) ) * 0.0918;
			sum += $$( vec2( vUv.x - 2.0 * amount_$ / resolution_$, vUv.y ) ) * 0.12245;
			sum += $$( vec2( vUv.x - 1.0 * amount_$ / resolution_$, vUv.y ) ) * 0.1531;
			sum += color * 0.1633;
			sum += $$( vec2( vUv.x + 1.0 * amount_$ / resolution_$, vUv.y ) ) * 0.1531;
			sum += $$( vec2( vUv.x + 2.0 * amount_$ / resolution_$, vUv.y ) ) * 0.12245;
			sum += $$( vec2( vUv.x + 3.0 * amount_$ / resolution_$, vUv.y ) ) * 0.0918;
			sum += $$( vec2( vUv.x + 4.0 * amount_$ / resolution_$, vUv.y ) ) * 0.051;

			return sum;
			
		}`
		
};


export { HorizontalBlurShader };