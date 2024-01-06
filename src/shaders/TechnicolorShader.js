/**
 *
 * Ported from examples/jsm/shaders/TechnicolorShader.js
 *
 */
 
 
import { Vector2 } from 'three';


const TechnicolorShader = {
	
	type: 'O',
	
	weight: 1,

	uniforms: {
		
		opacity: { value: 1 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 tex = $$( vUv );

			return mix( tex, vec4(tex.r, (tex.g + tex.b) * 0.5, (tex.g + tex.b)*.5, 1.0), opacity_$ );
			
		}`
		
};


export { TechnicolorShader };