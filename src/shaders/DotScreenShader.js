/**
 *
 * Ported from examples/jsm/shaders/DotScreenShader.js
 *
 */
 
 
import { Vector2 } from 'three';


const DotScreenShader = {
	
	type: 'O',
	
	weight: 1,

	uniforms: {
		
		angle:  { value: 0.0 },
		scale:  { value: 1.5 },
		center: { value: new Vector2( 0, 0 ) },
		resolution: { value: new Vector2(innerWidth,innerHeight) },
		opacity:  { value: 1.0 },
		
	},

	fragmentShader: /* glsl */`
	
		float pattern_$( vec2 vUv ) {
			
			float s = sin( angle_$ ),
			      c = cos( angle_$ );
				  
			vec2 tex = vUv * resolution_$ - center_$;
			
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) / scale_$;
			
			return ( sin( point.x ) * sin( point.y ) ) * 4.0;
			
		}

		vec4 $( vec2 vUv ) {

			vec4 color = $$( vUv );
			
			float average = ( color.r + color.g + color.b ) / 3.0;
			
			return mix( color, vec4( vec3( average * 10.0 - 5.0 + pattern_$(vUv) ), color.a ), pow(opacity_$,2.0) );
			
		}`
		
};


export { DotScreenShader };