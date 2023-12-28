/**
 *
 * Ported from examples/jsm/shaders/TriangleBlurShader.js
 *
 */
 
 
import { Vector2 } from 'three';


const TriangleBlurShader = {

	uniforms: {
		
		amount: { value: new Vector2( 0, 0 ) },
		
	},

	fragmentShaderHead: /* glsl */`
	
		#include <common>
		
	`,

	fragmentShader: /* glsl */`
		#define ITERATIONS_$ 7.0
	
		vec4 $( vec2 vUv ) {
			
			vec4 color = vec4( 0.0 );

			float total = 0.0;

			// randomize the lookup values to hide the fixed number of samples
			float offset = rand( vUv );

			for ( float t = -ITERATIONS_$; t <= ITERATIONS_$; t ++ )
			{
				float percent = ( t + offset - 0.5 ) / ITERATIONS_$;
				float weight = 1.0 - abs( percent );

				color += $$( vUv + amount_$ * percent ) * weight;
				
				total += weight;
			}

			return color / total;
			
		}`
		
};


export { TriangleBlurShader };