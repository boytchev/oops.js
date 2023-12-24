/**
 *
 * Ported from examples/jsm/shaders/ConvolutionShader.js
 *
 */
 
 
import { Vector2 } from 'three';


const ConvolutionShader = {

	name: 'ConvolutionShader',

	uniforms: {
		
		uImageIncrement: { value: new Vector2( 0, 0 ) },
		cKernel: { value: [], type: 'floatarray', size: 'KERNEL_SIZE_INT_$' },
		
	},

	vertexShaderHead: /* glsl */`

		#define KERNEL_SIZE_INT_$ 25

	`,
	
	vertexShader: /* glsl */`

		varying vec2 vImageCoord_$;

		vec3 $(vec3 position) {
			
			vImageCoord_$ = uv - ( ( float(KERNEL_SIZE_INT_$) - 1.0 ) / 2.0 ) * uImageIncrement_$;
			return position;
			
		}`,
	
	fragmentShaderHead: /* glsl */`
	
		#define KERNEL_SIZE_INT_$ 25
		
	`,

	fragmentShader: /* glsl */`
	
		varying vec2 vImageCoord_$;
		
		vec4 $( vec2 vUv ) {
			
			vec2 imageCoord = vImageCoord_$;
			vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );

			for( int i = 0; i < KERNEL_SIZE_INT_$; i ++ )
			{
				sum += $$( imageCoord ) * cKernel_$[ i ];
				imageCoord += uImageIncrement_$;
			}

			return sum;
			
		}`,

	onLoad: function ( shader )	{
		
		function gauss( x, sigma ) {
			
			return Math.exp( - ( x * x ) / ( 2.0 * sigma * sigma ) );
			
		}


		var sigma = 4;
		const kMaxKernelSize = 25;
		var kernelSize = 2 * Math.ceil( sigma * 3.0 ) + 1;

		if ( kernelSize > kMaxKernelSize ) kernelSize = kMaxKernelSize;

		var halfWidth = ( kernelSize - 1 ) * 0.5;

		var values = shader.uniforms.cKernel.value,
			sum = 0.0;
			
		for( var i = 0; i < kernelSize; ++ i )
		{
			var x = i - halfWidth;
			values[i] = gauss( x, sigma );
			sum += values[i];
		}

		for( var i = 0; i < kernelSize; ++ i ) values[i] /= sum;
	},
		
};


export { ConvolutionShader };