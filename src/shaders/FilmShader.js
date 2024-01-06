/**
 *
 * Ported from examples/jsm/shaders/FilmShader.js
 *
 */
 
 
import { Color } from 'three';


const FilmShader = {
	
	type: 'O',
	
	weight: 1,

	uniforms: {
		
		time: { value: 0.0 },
		intensity: { value: 0.5 },
		grayscale: { value: false },
		
	},

	fragmentShaderHead: /* glsl */`
	
		#include <common>
		
	`,

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 base = $$( vUv );

			float noise = rand( vUv + fract(time_$) ) + 1.0;

			vec3 color = base.rgb * noise * (1.0 - intensity_$/10.0);

			color = mix( base.rgb, color, 5.0*intensity_$ );

			if ( grayscale_$ ) 
			{
				color = vec3( luminance( color ) ); // assuming linear-srgb
			}

			return vec4( color, base.a );
			
		}`
		
};


export { FilmShader };