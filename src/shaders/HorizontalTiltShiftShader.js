/**
 *
 * Ported from examples/jsm/shaders/HorizontalTiltShiftShader.js
 *
 */
 
 
const HorizontalTiltShiftShader = {

	name: 'HorizontalTiltShiftShader',

	uniforms: {
		
		position: { value: 0.5 },
		span: { value: 0.1 },
		amount: { value: 4.0 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 color = $$( vUv );
			vec4 sum = vec4( 0.0 );

			float hh = abs( vUv.y - position_$ );
			hh = 0.003 * smoothstep( 0.0, 1.0, amount_$*(hh-span_$) );
			
			sum += $$( vec2( vUv.x - 4.0 * hh, vUv.y ) ) * 0.051;
			sum += $$( vec2( vUv.x - 3.0 * hh, vUv.y ) ) * 0.0918;
			sum += $$( vec2( vUv.x - 2.0 * hh, vUv.y ) ) * 0.12245;
			sum += $$( vec2( vUv.x - 1.0 * hh, vUv.y ) ) * 0.1531;
			sum += color * 0.1633;
			sum += $$( vec2( vUv.x + 1.0 * hh, vUv.y ) ) * 0.1531;
			sum += $$( vec2( vUv.x + 2.0 * hh, vUv.y ) ) * 0.12245;
			sum += $$( vec2( vUv.x + 3.0 * hh, vUv.y ) ) * 0.0918;
			sum += $$( vec2( vUv.x + 4.0 * hh, vUv.y ) ) * 0.051;

			return sum;
			
		}`
		
};


export { HorizontalTiltShiftShader };