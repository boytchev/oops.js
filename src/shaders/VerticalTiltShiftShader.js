/**
 *
 * Ported from examples/jsm/shaders/VerticalTiltShiftShader.js
 *
 */
 
 
const VerticalTiltShiftShader = {

	uniforms: {
		
		position: { value: 0.5 },
		span: { value: 0.1 },
		amount: { value: 4.0 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 color = $$( vUv );
			vec4 sum = vec4( 0.0 );

			float vv = abs( vUv.x - position_$ ) ;//;
			vv = 0.003 * smoothstep( 0.0, 1.0, amount_$*(vv-span_$) );
			
			sum += $$( vec2( vUv.x, vUv.y - 4.0 * vv ) ) * 0.051;
			sum += $$( vec2( vUv.x, vUv.y - 3.0 * vv ) ) * 0.0918;
			sum += $$( vec2( vUv.x, vUv.y - 2.0 * vv ) ) * 0.12245;
			sum += $$( vec2( vUv.x, vUv.y - 1.0 * vv ) ) * 0.1531;
			sum += color * 0.1633;
			sum += $$( vec2( vUv.x, vUv.y + 1.0 * vv ) ) * 0.1531;
			sum += $$( vec2( vUv.x, vUv.y + 2.0 * vv ) ) * 0.12245;
			sum += $$( vec2( vUv.x, vUv.y + 3.0 * vv ) ) * 0.0918;
			sum += $$( vec2( vUv.x, vUv.y + 4.0 * vv ) ) * 0.051;

			return sum;
			
		}`
		
};


export { VerticalTiltShiftShader };