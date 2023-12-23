/**
 *
 * Ported from examples/jsm/shaders/ColorCorrectionShader.js
 *
 */
 
 
import {Vector3} from 'three';


const ColorCorrectionShader = {

	name: 'ColorCorrectionShader',

	uniforms: {
		
		powRGB:  { value: new Vector3( 2, 2, 2 ) },
		mulRGB:  { value: new Vector3( 1, 1, 1 ) },
		addRGB:  { value: new Vector3( 0, 0, 0 ) },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 color = $$( vUv );
			
			color.rgb = mulRGB_$ * pow( ( color.rgb + addRGB_$ ), powRGB_$ );
			
			return color;
			
		}`
		
};


export { ColorCorrectionShader };