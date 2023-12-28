/**
 *
 * Ported from examples/jsm/shaders/OutputShader.js
 *
 */
 
 
const OutputShader = {

	name: 'OutputShader',

	uniforms: {
		
		toneMappingExposure: { value: 1 },
		
	},

	fragmentShaderHeader: /* glsl */`
		precision highp float;
	
		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>
	`,
	
	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 color = $$( vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				color.rgb = LinearToneMapping( color.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				color.rgb = ReinhardToneMapping( color.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				color.rgb = OptimizedCineonToneMapping( color.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				color.rgb = ACESFilmicToneMapping( color.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				color = sRGBTransferOETF( color );

			#endif
	
			return vec4(1,1,0,1);
			return mix(color,$$(vUv),toneMappingExposure_$);
		}`
		
};


export { OutputShader };