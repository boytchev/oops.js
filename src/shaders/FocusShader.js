/**
 *
 * Ported from examples/jsm/shaders/FocusShader.js
 *
 */
 
 
import { Vector2 } from 'three';


const FocusShader = {
	
	type: 'O',
	
	weight: 8,

	uniforms: {
		
		resolution: { value: new Vector2(innerWidth,innerHeight), auto: true },
		sampleDistance:  { value: 0.94 },
		waveFactor:  { value: 0.125 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec4 color, org, tmp, add;
			float sample_dist, f;
			vec2 vin;
			vec2 uv = vUv;

			add = color = org = $$( uv );

			vin = ( uv - vec2( 0.5 ) ) * vec2( 1.4 );
			sample_dist = dot( vin, vin ) * 2.0;

			f = ( waveFactor_$ + sample_dist ) * sampleDistance_$ * 4.0;

			vec2 sampleSize = vec2(  1.0 / resolution_$.x, 1.0 / resolution_$.y ) * vec2( f );

			add += tmp = $$( uv + vec2( 0.111964, 0.993712 ) * sampleSize );
			if( tmp.b < color.b ) color = tmp;

			add += tmp = $$( uv + vec2( 0.846724, 0.532032 ) * sampleSize );
			if( tmp.b < color.b ) color = tmp;

			add += tmp = $$( uv + vec2( 0.943883, -0.330279 ) * sampleSize );
			if( tmp.b < color.b ) color = tmp;

			add += tmp = $$( uv + vec2( 0.330279, -0.943883 ) * sampleSize );
			if( tmp.b < color.b ) color = tmp;

			add += tmp = $$( uv + vec2( -0.532032, -0.846724 ) * sampleSize );
			if( tmp.b < color.b ) color = tmp;

			add += tmp = $$( uv + vec2( -0.993712, -0.111964 ) * sampleSize );
			if( tmp.b < color.b ) color = tmp;

			add += tmp = $$( uv + vec2( -0.707107, 0.707107 ) * sampleSize );
			if( tmp.b < color.b ) color = tmp;

			color = color * vec4( 2.0 ) - ( add / vec4( 8.0 ) );
			color = color + ( add / vec4( 8.0 ) - color ) * ( vec4( 1.0 ) - vec4( sample_dist * 0.5 ) );

			return vec4( color.rgb * color.rgb * vec3( 0.95 ) + color.rgb, 1.0 );
			
		}`,
		
	onLoad: /* js */ function( shader, oopsShader )
		{
			oopsShader.addUniform( 'resolution' );
		},
		
	onRender: /* js */ function( renderer, writeBuffer, readBuffer, deltaTime, maskActive, pass )
		{
			pass.uniforms.resolution.value.set( readBuffer.width/renderer.getPixelRatio(), readBuffer.height/renderer.getPixelRatio() );
		},
		
};


export { FocusShader };