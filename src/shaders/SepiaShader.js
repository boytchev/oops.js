/**
 *
 * Ported from examples/jsm/shaders/SepiaShader.js
 *
 */
 
 
const SepiaShader = {

	name: 'SepiaShader',

	uniforms: {
		
		amount: { value: 1.0 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 color = $$( vUv );

			vec3 c = color.rgb;

			color.r = dot( c, vec3( 1.0 - 0.607 * amount_$, 0.769 * amount_$, 0.189 * amount_$ ) );
			color.g = dot( c, vec3( 0.349 * amount_$, 1.0 - 0.314 * amount_$, 0.168 * amount_$ ) );
			color.b = dot( c, vec3( 0.272 * amount_$, 0.534 * amount_$, 1.0 - 0.869 * amount_$ ) );

			return vec4( min( vec3( 1.0 ), color.rgb ), color.a );
			
		}`
		
};


export { SepiaShader };