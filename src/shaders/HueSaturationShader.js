/**
 *
 * Ported from examples/jsm/shaders/HueSaturationShader.js
 *
 */
 
 
import { Vector2 } from 'three';


const HueSaturationShader = {

	uniforms: {
		
		hue: { value: 0 },
		saturation: { value: 0 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 color = $$( vUv );

			// hue
			float angle = hue_$ * 3.14159265;
			float s = sin(angle), c = cos(angle);
			vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
			float len = length(color.rgb);
			color.rgb = vec3(
				dot(color.rgb, weights.xyz),
				dot(color.rgb, weights.zxy),
				dot(color.rgb, weights.yzx)
			);

			// saturation
			float average = (color.r + color.g + color.b) / 3.0;
			if (saturation_$ > 0.0) {
				color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation_$));
			} else {
				color.rgb += (average - color.rgb) * (-saturation_$);
			}

			return color;
			
		}`
		
};


export { HueSaturationShader };