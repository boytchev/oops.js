﻿/**
 *
 * Ported from examples/jsm/shaders/BleachBypassShader.js
 *
 */
 
 
const BleachBypassShader = {
	
	type: 'O',
	
	weight: 1,

	uniforms: {
		
		amount: { value: 3 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 base = $$( vUv );

			vec3 lumCoeff = vec3( 0.25, 0.65, 0.1 );
			float lum = dot( lumCoeff, base.rgb );
			vec3 blend = vec3( lum );

			float L = min( 1.0, max( 0.0, 10.0 * ( lum - 0.45 ) ) );

			vec3 result1 = 2.0 * base.rgb * blend;
			vec3 result2 = 1.0 - 2.0 * ( 1.0 - blend ) * ( 1.0 - base.rgb );

			vec3 newColor = mix( result1, result2, L );

			float A2 = amount_$ * base.a;
			vec3 mixRGB = A2 * newColor.rgb;
			mixRGB += ( ( 1.0 - A2 ) * base.rgb );

			return vec4( mixRGB, base.a );
			
		}`
		
};


export { BleachBypassShader };