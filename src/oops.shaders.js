import * as THREE from 'three';

import {HeaderShader} from './shaders/HeaderShader.js';
import {FooterShader} from './shaders/FooterShader.js';
import {RGBShiftShader} from './shaders/RGBShiftShader.js';
import {DotScreenShader} from './shaders/DotScreenShader.js';
import {SepiaShader} from './shaders/SepiaShader.js';
import {BrightnessContrastShader} from './shaders/BrightnessContrastShader.js';
import {SobelOperatorShader} from './shaders/SobelOperatorShader.js';
import {GammaCorrectionShader} from './shaders/GammaCorrectionShader.js';
import {ColorCorrectionShader} from './shaders/ColorCorrectionShader.js';
import {ExposureShader} from './shaders/ExposureShader.js';
import {ExposureExpShader} from './shaders/ExposureExpShader.js';
import {FreiChenShader} from './shaders/FreiChenShader.js';
import {HorizontalBlurShader} from './shaders/HorizontalBlurShader.js';
import {VerticalBlurShader} from './shaders/VerticalBlurShader.js';
import {VignetteShader} from './shaders/VignetteShader.js';
import {BleachBypassShader} from './shaders/BleachBypassShader.js';
import {MirrorShader} from './shaders/MirrorShader.js';
import {KaleidoShader} from './shaders/KaleidoShader.js';
import {TechnicolorShader} from './shaders/TechnicolorShader.js';
import {ColorifyShader} from './shaders/ColorifyShader.js';
import {HueSaturationShader} from './shaders/HueSaturationShader.js';
import {LuminosityShader} from './shaders/LuminosityShader.js';
import {LuminosityHighPassShader} from './shaders/LuminosityHighPassShader.js';
import {HorizontalTiltShiftShader} from './shaders/HorizontalTiltShiftShader.js';
import {VerticalTiltShiftShader} from './shaders/VerticalTiltShiftShader.js';
import {TriangleBlurShader} from './shaders/TriangleBlurShader.js';

//1226-610 50%
const BasicShader = {
	name: 'BasicShader',
	uniforms: {
		color: { value: new THREE.Color(1,0,0) },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			return vec4( color_$, vUv.y );
		}`
};




const FilmShader = {
	name: 'FilmShader',
	uniforms: {
		time: { value: 0.0 },
		intensity: { value: 0.5 },
		grayscale: { value: false },
	},
	fragmentShaderHead: /* glsl */`
		#include <common>
	`,
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec4 base = $$( vUv );

			float noise = rand( vUv + fract(time_$) ) + 1.0;

			vec3 color = base.rgb * noise * (1.0 - intensity_$/10.0);

			color = mix( base.rgb, color, 5.0*intensity_$ );

			if ( grayscale_$ ) 
			{
				color = vec3( luminance( color ) ); // assuming linear-srgb
			}

			return vec4( color, base.a );
		}`
};





const FocusShader = {
	name: 'FocusShader',
	uniforms: {
		resolution: { value: new THREE.Vector2(innerWidth,innerHeight) },
		sampleDistance:  { value: 0.94 },
		waveFactor:  { value: 0.125 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
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
		}`
};





const ACESFilmicToneMappingShader = {
	name: 'ACESFilmicToneMappingShader',
	uniforms: {
		exposure:  { value: 1.0 },
	},
	fragmentShader: /* glsl */`
		#define saturate_$(a) clamp( a, 0.0, 1.0 )
		
		vec3 RRTAndODTFit_$( vec3 v )
		{
			vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
			vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
			return a / b;
		}

		vec3 ACESFilmicToneMapping_$( vec3 color )
		{
			// sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT
			const mat3 ACESInputMat = mat3(
				vec3( 0.59719, 0.07600, 0.02840 ), // transposed from source
				vec3( 0.35458, 0.90834, 0.13383 ),
				vec3( 0.04823, 0.01566, 0.83777 )
			);

			// ODT_SAT => XYZ => D60_2_D65 => sRGB
			const mat3 ACESOutputMat = mat3(
				vec3(  1.60475, -0.10208, -0.00327 ), // transposed from source
				vec3( -0.53108,  1.10813, -0.07276 ),
				vec3( -0.07367, -0.00605,  1.07602 )
			);

			color = ACESInputMat * color;

			// Apply RRT and ODT
			color = RRTAndODTFit_$( color );

			color = ACESOutputMat * color;

			// Clamp to [0, 1]
			return saturate_$( color );

		}

		vec4 $( vec2 vUv )
		{
			vec4 tex = $$( vUv );

			tex.rgb *= exposure_$ / 0.6; // pre-exposed, outside of the tone mapping function

			return vec4( ACESFilmicToneMapping_$( tex.rgb ), tex.a );
		}`
};




const CopyShader = {
	name: 'CopyShader',
	uniforms: {
		opacity:  { value: 1.0 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			return opacity_$ * $$( vUv );
		}`
};




const UnpackDepthRGBAShader = {
	name: 'UnpackDepthRGBAShader',
	uniforms: {
		opacity: { value: 1.0 },
	},
	fragmentShaderHead: /* glsl */`
		#include <packing>
	`,
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			float depth = 1.0 - unpackRGBAToDepth( $$( vUv ) );
			return vec4( vec3( depth ), opacity_$ );
		}`
};




const HalftoneShader = {
	name: 'HalftoneShader',
	uniforms: {
		shape: { value: 1, type: 'int' },
		radius: { value: 4 },
		rotate: { value: new THREE.Vector3(1*Math.PI/12,2*Math.PI/12,3*Math.PI/12) },
		scatter: { value: 0 },
		resolution: { value: new THREE.Vector2(innerWidth,innerHeight) },
		blending: { value: 1 },
		blendingMode: { value: 1, type: 'int' },
		grayscale: { value: false },
		disable: { value: false }
	},
	fragmentShaderHead: /* glsl */`
		#define SQRT2_MINUS_ONE 0.41421356
		#define SQRT2_HALF_MINUS_ONE 0.20710678
		#define PI2 6.28318531
		#define SHAPE_DOT 1
		#define SHAPE_ELLIPSE 2
		#define SHAPE_LINE 3
		#define SHAPE_SQUARE 4
		#define BLENDING_LINEAR 1
		#define BLENDING_MULTIPLY 2
		#define BLENDING_ADD 3
		#define BLENDING_LIGHTER 4
		#define BLENDING_DARKER 5
	`,
	fragmentShader: /* glsl */`

		const int samples_$ = 1; //8

		float blend_$( float a, float b, float t ) {

		// linear blend
			return a * ( 1.0 - t ) + b * t;

		}

		float hypot_$( float x, float y ) {

		// vector magnitude
			return sqrt( x * x + y * y );

		}

		float rand_$( vec2 seed ){

		// get pseudo-random number
			return fract( sin( dot( seed.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );

		}

		float distanceToDotRadius_$( float channel, vec2 coord, vec2 normal, vec2 p, float angle, float rad_max ) {

		// apply shape-specific transforms
			float dist = hypot_$( coord.x - p.x, coord.y - p.y );
			float rad = channel;

			if ( shape_$ == SHAPE_DOT ) {

				rad = pow( abs( rad ), 1.125 ) * rad_max;

			} else if ( shape_$ == SHAPE_ELLIPSE ) {

				rad = pow( abs( rad ), 1.125 ) * rad_max;

				if ( dist != 0.0 ) {
					float dot_p = abs( ( p.x - coord.x ) / dist * normal.x + ( p.y - coord.y ) / dist * normal.y );
					dist = ( dist * ( 1.0 - SQRT2_HALF_MINUS_ONE ) ) + dot_p * dist * SQRT2_MINUS_ONE;
				}

			} else if ( shape_$ == SHAPE_LINE ) {

				rad = pow( abs( rad ), 1.5) * rad_max;
				float dot_p = ( p.x - coord.x ) * normal.x + ( p.y - coord.y ) * normal.y;
				dist = hypot_$( normal.x * dot_p, normal.y * dot_p );

			} else if ( shape_$ == SHAPE_SQUARE ) {

				float theta = atan( p.y - coord.y, p.x - coord.x ) - angle;
				float sin_t = abs( sin( theta ) );
				float cos_t = abs( cos( theta ) );
				rad = pow( abs( rad ), 1.4 );
				rad = rad_max * ( rad + ( ( sin_t > cos_t ) ? rad - sin_t * rad : rad - cos_t * rad ) );

			}

			return rad - dist;

		}

		struct Cell_$ {

		// grid sample positions
			vec2 normal;
			vec2 p1;
			vec2 p2;
			vec2 p3;
			vec2 p4;
			float samp2;
			float samp1;
			float samp3;
			float samp4;

		};

		vec4 getSample_$( vec2 point ) {

		// multi-sampled point
			vec4 tex = $$( vec2( point.x / resolution_$.x, point.y / resolution_$.y ) );
			float base = rand_$( vec2( floor( point.x ), floor( point.y ) ) ) * PI2;
			float step = PI2 / float( samples_$ );
			float dist = radius_$ * 0.66;

			for ( int i = 0; i < samples_$; ++i ) {

				float r = base + step * float( i );
				vec2 coord = point + vec2( cos( r ) * dist, sin( r ) * dist );
				tex += $$( vec2( coord.x / resolution_$.x, coord.y / resolution_$.y ) );

			}

			tex /= float( samples_$ ) + 1.0;
			return tex;

		}

		float getDotColour_$( Cell_$ c, vec2 p, int channel, float angle, float aa ) {

		// get colour for given point
			float dist_c_1, dist_c_2, dist_c_3, dist_c_4, res;

			if ( channel == 0 ) {

				c.samp1 = getSample_$( c.p1 ).r;
				c.samp2 = getSample_$( c.p2 ).r;
				c.samp3 = getSample_$( c.p3 ).r;
				c.samp4 = getSample_$( c.p4 ).r;

			} else if (channel == 1) {

				c.samp1 = getSample_$( c.p1 ).g;
				c.samp2 = getSample_$( c.p2 ).g;
				c.samp3 = getSample_$( c.p3 ).g;
				c.samp4 = getSample_$( c.p4 ).g;

			} else {

				c.samp1 = getSample_$( c.p1 ).b;
				c.samp3 = getSample_$( c.p3 ).b;
				c.samp2 = getSample_$( c.p2 ).b;
				c.samp4 = getSample_$( c.p4 ).b;

			}

			dist_c_1 = distanceToDotRadius_$( c.samp1, c.p1, c.normal, p, angle, radius_$ );
			dist_c_2 = distanceToDotRadius_$( c.samp2, c.p2, c.normal, p, angle, radius_$ );
			dist_c_3 = distanceToDotRadius_$( c.samp3, c.p3, c.normal, p, angle, radius_$ );
			dist_c_4 = distanceToDotRadius_$( c.samp4, c.p4, c.normal, p, angle, radius_$ );
			res = ( dist_c_1 > 0.0 ) ? clamp( dist_c_1 / aa, 0.0, 1.0 ) : 0.0;
			res += ( dist_c_2 > 0.0 ) ? clamp( dist_c_2 / aa, 0.0, 1.0 ) : 0.0;
			res += ( dist_c_3 > 0.0 ) ? clamp( dist_c_3 / aa, 0.0, 1.0 ) : 0.0;
			res += ( dist_c_4 > 0.0 ) ? clamp( dist_c_4 / aa, 0.0, 1.0 ) : 0.0;
			res = clamp( res, 0.0, 1.0 );

			return res;

		}

		Cell_$ getReferenceCell_$( vec2 p, vec2 origin, float grid_angle, float step ) {

		// get containing cell
			Cell_$ c;

		// calc grid
			vec2 n = vec2( cos( grid_angle ), sin( grid_angle ) );
			float threshold = step * 0.5;
			float dot_normal = n.x * ( p.x - origin.x ) + n.y * ( p.y - origin.y );
			float dot_line = -n.y * ( p.x - origin.x ) + n.x * ( p.y - origin.y );
			vec2 offset = vec2( n.x * dot_normal, n.y * dot_normal );
			float offset_normal = mod( hypot_$( offset.x, offset.y ), step );
			float normal_dir = ( dot_normal < 0.0 ) ? 1.0 : -1.0;
			float normal_scale = ( ( offset_normal < threshold ) ? -offset_normal : step - offset_normal ) * normal_dir;
			float offset_line = mod( hypot_$( ( p.x - offset.x ) - origin.x, ( p.y - offset.y ) - origin.y ), step );
			float line_dir = ( dot_line < 0.0 ) ? 1.0 : -1.0;
			float line_scale = ( ( offset_line < threshold ) ? -offset_line : step - offset_line ) * line_dir;

		// get closest corner
			c.normal = n;
			c.p1.x = p.x - n.x * normal_scale + n.y * line_scale;
			c.p1.y = p.y - n.y * normal_scale - n.x * line_scale;

		// scatter
			if ( scatter_$ != 0.0 ) {

				float off_mag = scatter_$ * threshold * 0.5;
				float off_angle = rand_$( vec2( floor( c.p1.x ), floor( c.p1.y ) ) ) * PI2;
				c.p1.x += cos( off_angle ) * off_mag;
				c.p1.y += sin( off_angle ) * off_mag;

			}

		// find corners
			float normal_step = normal_dir * ( ( offset_normal < threshold ) ? step : -step );
			float line_step = line_dir * ( ( offset_line < threshold ) ? step : -step );
			c.p2.x = c.p1.x - n.x * normal_step;
			c.p2.y = c.p1.y - n.y * normal_step;
			c.p3.x = c.p1.x + n.y * line_step;
			c.p3.y = c.p1.y - n.x * line_step;
			c.p4.x = c.p1.x - n.x * normal_step + n.y * line_step;
			c.p4.y = c.p1.y - n.y * normal_step - n.x * line_step;

			return c;

		}

		float blendColour_$( float a, float b, float t ) {

		// blend colours
			if ( blendingMode_$ == BLENDING_LINEAR ) {
				return blend_$( a, b, 1.0 - t );
			} else if ( blendingMode_$ == BLENDING_ADD ) {
				return blend_$( a, min( 1.0, a + b ), t );
			} else if ( blendingMode_$ == BLENDING_MULTIPLY ) {
				return blend_$( a, max( 0.0, a * b ), t );
			} else if ( blendingMode_$ == BLENDING_LIGHTER ) {
				return blend_$( a, max( a, b ), t );
			} else if ( blendingMode_$ == BLENDING_DARKER ) {
				return blend_$( a, min( a, b ), t );
			} else {
				return blend_$( a, b, 1.0 - t );
			}

		}

		vec4 $( vec2 vUv ) {

			if ( ! disable_$ ) {

		// setup
				vec2 p = vec2( vUv.x * resolution_$.x, vUv.y * resolution_$.y );
				vec2 origin = vec2( 0, 0 );
				float aa = ( radius_$ < 2.5 ) ? radius_$ * 0.5 : 1.25;

		// get channel samples
				Cell_$ cell_r = getReferenceCell_$( p, origin, rotate_$.r, radius_$ );
				Cell_$ cell_g = getReferenceCell_$( p, origin, rotate_$.g, radius_$ );
				Cell_$ cell_b = getReferenceCell_$( p, origin, rotate_$.b, radius_$ );
				float r = getDotColour_$( cell_r, p, 0, rotate_$.r, aa );
				float g = getDotColour_$( cell_g, p, 1, rotate_$.g, aa );
				float b = getDotColour_$( cell_b, p, 2, rotate_$.b, aa );

		// blend with original
				vec4 colour = $$( vUv );
				r = blendColour_$( r, colour.r, blending_$ );
				g = blendColour_$( g, colour.g, blending_$ );
				b = blendColour_$( b, colour.b, blending_$ );

				if ( grayscale_$ ) {
					r = g = b = (r + b + g) / 3.0;
				}

				return vec4( r, g, b, 1.0 );

			} else {

				return $$( vUv );

			}

		}`
};



const ConvolutionShader = {
	name: 'ConvolutionShader',
	uniforms: {
		uImageIncrement: { value: new THREE.Vector2( 0, 0 ) },
		cKernel: { value: [], type: 'floatarray', size: 'KERNEL_SIZE_INT_$' },
	},
	onLoad: function ( shader )
	{
		function gauss( x, sigma )
		{
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
	vertexShaderHead: /* glsl */`
		#define KERNEL_SIZE_INT_$ 25
	`,
	vertexShader: /* glsl */`
		varying vec2 vImageCoord_$;

		vec3 $(vec3 position)
		{
			vImageCoord_$ = uv - ( ( float(KERNEL_SIZE_INT_$) - 1.0 ) / 2.0 ) * uImageIncrement_$;
			return position;
		}
	`,
	fragmentShaderHead: /* glsl */`
		#define KERNEL_SIZE_INT_$ 25
	`,
	fragmentShader: /* glsl */`
		varying vec2 vImageCoord_$;
		
		vec4 $( vec2 vUv )
		{
			vec2 imageCoord = vImageCoord_$;
			vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );

			for( int i = 0; i < KERNEL_SIZE_INT_$; i ++ )
			{
				sum += $$( imageCoord ) * cKernel_$[ i ];
				imageCoord += uImageIncrement_$;
			}

			return sum;
		}`
};




const SHADERS = {
		FooterShader: 				FooterShader,
		HeaderShader: 				HeaderShader,
		RGBShiftShader:			 	RGBShiftShader,
		DotScreenShader: 			DotScreenShader,
		SepiaShader:				SepiaShader,
		SobelOperatorShader:		SobelOperatorShader,
		GammaCorrectionShader:		GammaCorrectionShader,
		BrightnessContrastShader: 	BrightnessContrastShader,
		ColorCorrectionShader:		ColorCorrectionShader,
		ExposureShader:				ExposureShader,
		ExposureExpShader:			ExposureExpShader,
		FreiChenShader:				FreiChenShader,
		HorizontalBlurShader:		HorizontalBlurShader,
		VerticalBlurShader:			VerticalBlurShader,
		VignetteShader:				VignetteShader,
		BleachBypassShader:			BleachBypassShader,
		MirrorShader:				MirrorShader,
		KaleidoShader:				KaleidoShader,
		ColorifyShader:				ColorifyShader,
		TechnicolorShader:			TechnicolorShader,
		HueSaturationShader:		HueSaturationShader,
		LuminosityShader:			LuminosityShader,
		LuminosityHighPassShader:	LuminosityHighPassShader,
		HorizontalTiltShiftShader:	HorizontalTiltShiftShader,
		VerticalTiltShiftShader:	VerticalTiltShiftShader,
		TriangleBlurShader:			TriangleBlurShader,
		BasicShader:				BasicShader,
		FilmShader:					FilmShader,
		FocusShader:				FocusShader,
		ACESFilmicToneMappingShader:ACESFilmicToneMappingShader,
		CopyShader:					CopyShader,
		UnpackDepthRGBAShader:		UnpackDepthRGBAShader,
		HalftoneShader:				HalftoneShader,
		ConvolutionShader:			ConvolutionShader,
}


export {SHADERS};
