/**
 *
 * Ported from examples/jsm/shaders/BrightnessContrastShader.js
 *
 */
 
 
const BrightnessContrastShader = {

	name: 'BrightnessContrastShader',

	uniforms: {
		
		brightness: { value: 0.0 },
		contrast: { value: 0.0 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 color = $$( vUv );

			color.rgb += brightness_$;

			if (contrast_$ > 0.0) {
				color.rgb = (color.rgb - 0.5) / (1.0001 - contrast_$) + 0.5;
			} else {
				color.rgb = (color.rgb - 0.5) * (1.0001 + contrast_$) + 0.5;
			}
			
			return color;
			
		}`
		
};


export { BrightnessContrastShader };