/**
 *
 * Ported from examples/jsm/shaders/LuminosityHighPassShader.js
 *
 */
 
 
import { Color } from 'three';


const LuminosityHighPassShader = {

	name: 'LuminosityHighPassShader',

	uniforms: {
		
		color: { value: new Color( 0, 0, 0 ) },
		alpha: { value: 0.0 },
		threshold: { value: 0.25 },
		span: { value: 0.25 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 texel = $$( vUv );
			
			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( color_$.rgb, alpha_$ );

			float alpha = smoothstep( threshold_$ - span_$, threshold_$ + span_$, v );

			return mix( outputColor, texel, alpha );
			
		}`
		
};


export { LuminosityHighPassShader };