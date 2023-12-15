import * as THREE from 'three';





const HeaderShader = {
	name: 'HeaderShader',
	uniforms: {
		tDiffuse:  { value: null },
	},
	vertexShader: /* glsl */`
		vec3 $( vec3 position )
		{
			return position;
		}`,
	fragmentShader: /* glsl */`
//..//		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		vec4 $( vec2 vUv )
		{
			return texture2D( tDiffuse_$, vUv );
		}`
};




const FooterShader = {
	name: 'FooterShader',
	uniforms: {
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( $$(position), 1.0 );
		}`,
	fragmentShader: /* glsl */`
		void main() {
			gl_FragColor = $$( vUv );
		}`
};




const RGBShiftShader = {
	name: 'RGBShiftShader',
	uniforms: {
		amount: { value: 0.005 },
		angle:  { value: 0.0 },
		opacity:  { value: 1.0 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec2 offset = amount_$ * vec2( cos(angle_$), sin(angle_$));
			vec4 cr  = $$( vUv + offset );
			vec4 cga = $$( vUv );
			vec4 cb  = $$( vUv - offset );
			return mix( cga, vec4( cr.r, cga.g, cb.b, cga.a ), opacity_$ );
		}`
};




const DotScreenShader = {
	name: 'DotScreenShader',
	uniforms: {
		angle:  { value: 0.0 },
		scale:  { value: 1.5 },
		center: { value: new THREE.Vector2( 0, 0 ) },
		resolution: { value: new THREE.Vector2(innerWidth,innerHeight) },
		opacity:  { value: 1.0 },
	},
	fragmentShader: /* glsl */`
		float pattern_$( vec2 vUv )
		{
			float s = sin( angle_$ ), c = cos( angle_$ );
			vec2 tex = vUv * resolution_$ - center_$;
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) / scale_$;
			return ( sin( point.x ) * sin( point.y ) ) * 4.0;
		}

		vec4 $( vec2 vUv )
		{

			vec4 color = $$( vUv );
			float average = ( color.r + color.g + color.b ) / 3.0;
			return mix( color, vec4( vec3( average * 10.0 - 5.0 + pattern_$(vUv) ), color.a ), pow(opacity_$,2.0) );
		}`
};




const SepiaShader = {
	name: 'SepiaShader',
	uniforms: {
		amount: { value: 1.0 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec4 color = $$( vUv );

			vec3 c = color.rgb;

			color.r = dot( c, vec3( 1.0 - 0.607 * amount_$, 0.769 * amount_$, 0.189 * amount_$ ) );
			color.g = dot( c, vec3( 0.349 * amount_$, 1.0 - 0.314 * amount_$, 0.168 * amount_$ ) );
			color.b = dot( c, vec3( 0.272 * amount_$, 0.534 * amount_$, 1.0 - 0.869 * amount_$ ) );

			return vec4( min( vec3( 1.0 ), color.rgb ), color.a );
		}`
};




const BrightnessContrastShader = {
	name: 'BrightnessContrastShader',
	uniforms: {
		brightness: { value: 0.0 },
		contrast: { value: 0.0 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
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




const SobelOperatorShader = {
	name: 'SobelOperatorShader',
	uniforms: {
		resolution: { value: new THREE.Vector2(innerWidth,innerHeight) },
		opacity:  { value: 1.0 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{

			vec2 texel = vec2( 1.0 / resolution_$.x, 1.0 / resolution_$.y );

		// kernel definition (in glsl matrices are filled in column-major order)

			const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 ); // x direction kernel
			const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 ); // y direction kernel

			vec4 color = $$( vUv );
			
		// fetch the 3x3 neighbourhood of a fragment

		// first column

			float tx0y0 = $$( vUv + texel * vec2( -1, -1 ) ).r;
			float tx0y1 = $$( vUv + texel * vec2( -1,  0 ) ).r;
			float tx0y2 = $$( vUv + texel * vec2( -1,  1 ) ).r;

		// second column

			float tx1y0 = $$( vUv + texel * vec2(  0, -1 ) ).r;
			float tx1y1 = color.r;
			float tx1y2 = $$( vUv + texel * vec2(  0,  1 ) ).r;

		// third column

			float tx2y0 = $$( vUv + texel * vec2(  1, -1 ) ).r;
			float tx2y1 = $$( vUv + texel * vec2(  1,  0 ) ).r;
			float tx2y2 = $$( vUv + texel * vec2(  1,  1 ) ).r;

		// gradient value in x direction

			float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
				Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
				Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

		// gradient value in y direction

			float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
				Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
				Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

		// magnitute of the total gradient

			float G = sqrt( ( valueGx * valueGx ) + ( valueGy * valueGy ) );

			return mix( color, vec4( vec3( G ), 1 ), opacity_$ );
		}`
};




const GammaCorrectionShader = {
	name: 'GammaCorrectionShader',
	uniforms: {
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			return sRGBTransferOETF( $$( vUv ) );
		}`
};





const ColorCorrectionShader = {
	name: 'ColorCorrectionShader',
	uniforms: {
		powRGB:  { value: new THREE.Vector3( 2, 2, 2 ) },
		mulRGB:  { value: new THREE.Vector3( 1, 1, 1 ) },
		addRGB:  { value: new THREE.Vector3( 0, 0, 0 ) },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv ) {

			vec4 color = $$( vUv );
			color.rgb = mulRGB_$ * pow( ( color.rgb + addRGB_$ ), powRGB_$ );
			return color;
		}`
};





const ExposureShader = {
	name: 'ExposureShader',
	uniforms: {
		exposure: { value: 1.0 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv ) {

			vec4 color = $$( vUv );
			color.rgb *= exposure_$;
			return color;
		}`
};





const ExposureExpShader = {
	name: 'ExposureExpShader',
	uniforms: {
		exposure: { value: 0.0 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv ) {

			vec4 color = $$( vUv );
			color.rgb *= exp(exposure_$);
			return color;
		}`
};




const FreiChenShader = {
	name: 'FreiChenShader',
	uniforms: {
		resolution: { value: new THREE.Vector2(innerWidth,innerHeight) },
		opacity:  { value: 1.0 },
	},
	fragmentShader: /* glsl */`
		mat3 G[9];

		// hard coded matrix values!!!! as suggested in https://github.com/neilmendoza/ofxPostProcessing/blob/master/src/EdgePass.cpp#L45

		const mat3 g0 = mat3( 0.3535533845424652, 0, -0.3535533845424652, 0.5, 0, -0.5, 0.3535533845424652, 0, -0.3535533845424652 );
		const mat3 g1 = mat3( 0.3535533845424652, 0.5, 0.3535533845424652, 0, 0, 0, -0.3535533845424652, -0.5, -0.3535533845424652 );
		const mat3 g2 = mat3( 0, 0.3535533845424652, -0.5, -0.3535533845424652, 0, 0.3535533845424652, 0.5, -0.3535533845424652, 0 );
		const mat3 g3 = mat3( 0.5, -0.3535533845424652, 0, -0.3535533845424652, 0, 0.3535533845424652, 0, 0.3535533845424652, -0.5 );
		const mat3 g4 = mat3( 0, -0.5, 0, 0.5, 0, 0.5, 0, -0.5, 0 );
		const mat3 g5 = mat3( -0.5, 0, 0.5, 0, 0, 0, 0.5, 0, -0.5 );
		const mat3 g6 = mat3( 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.6666666865348816, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204 );
		const mat3 g7 = mat3( -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, 0.6666666865348816, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408 );
		const mat3 g8 = mat3( 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408 );

		vec4 $( vec2 vUv )
		{
			vec2 texel = vec2( 1.0 / resolution_$.x, 1.0 / resolution_$.y );

			G[0] = g0,
			G[1] = g1,
			G[2] = g2,
			G[3] = g3,
			G[4] = g4,
			G[5] = g5,
			G[6] = g6,
			G[7] = g7,
			G[8] = g8;

			mat3 I;
			float cnv[9];
			vec3 sampleRGB;

		/* fetch the 3x3 neighbourhood and use the RGB vector's length as intensity value */
			for (float i=0.0; i<3.0; i++) {
				for (float j=0.0; j<3.0; j++) {
					sampleRGB = $$( vUv + texel * vec2(i-1.0,j-1.0) ).rgb;
					I[int(i)][int(j)] = length(sampleRGB);
				}
			}

		/* calculate the convolution values for all the masks */
			for (int i=0; i<9; i++) {
				float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
				cnv[i] = dp3 * dp3;
			}

			float M = (cnv[0] + cnv[1]) + (cnv[2] + cnv[3]);
			float S = (cnv[4] + cnv[5]) + (cnv[6] + cnv[7]) + (cnv[8] + M);

			return mix( $$(vUv), vec4(vec3(sqrt(M/S)), 1.0), opacity_$ );
		}`
};




const HorizontalBlurShader = {
	name: 'HorizontalBlurShader',
	uniforms: {
		resolution: { value: innerWidth },
		amount: { value: 1 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec4 sum = vec4( 0.0 );

			vec4 color = $$( vUv );
			
			sum += $$( vec2( vUv.x - 4.0 * amount_$ / resolution_$, vUv.y ) ) * 0.051;
			sum += $$( vec2( vUv.x - 3.0 * amount_$ / resolution_$, vUv.y ) ) * 0.0918;
			sum += $$( vec2( vUv.x - 2.0 * amount_$ / resolution_$, vUv.y ) ) * 0.12245;
			sum += $$( vec2( vUv.x - 1.0 * amount_$ / resolution_$, vUv.y ) ) * 0.1531;
			sum += color * 0.1633;
			sum += $$( vec2( vUv.x + 1.0 * amount_$ / resolution_$, vUv.y ) ) * 0.1531;
			sum += $$( vec2( vUv.x + 2.0 * amount_$ / resolution_$, vUv.y ) ) * 0.12245;
			sum += $$( vec2( vUv.x + 3.0 * amount_$ / resolution_$, vUv.y ) ) * 0.0918;
			sum += $$( vec2( vUv.x + 4.0 * amount_$ / resolution_$, vUv.y ) ) * 0.051;

			return sum;
		}`
};




const VerticalBlurShader = {
	name: 'VerticalBlurShader',
	uniforms: {
		resolution: { value: innerHeight },
		amount: { value: 1 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec4 sum = vec4( 0.0 );

			vec4 color = $$( vUv );
			
			sum += $$( vec2( vUv.x, vUv.y - 4.0 * amount_$ / resolution_$ ) ) * 0.051;
			sum += $$( vec2( vUv.x, vUv.y - 3.0 * amount_$ / resolution_$ ) ) * 0.0918;
			sum += $$( vec2( vUv.x, vUv.y - 2.0 * amount_$ / resolution_$ ) ) * 0.12245;
			sum += $$( vec2( vUv.x, vUv.y - 1.0 * amount_$ / resolution_$ ) ) * 0.1531;
			sum += color * 0.1633;
			sum += $$( vec2( vUv.x, vUv.y + 1.0 * amount_$ / resolution_$ ) ) * 0.1531;
			sum += $$( vec2( vUv.x, vUv.y + 2.0 * amount_$ / resolution_$ ) ) * 0.12245;
			sum += $$( vec2( vUv.x, vUv.y + 3.0 * amount_$ / resolution_$ ) ) * 0.0918;
			sum += $$( vec2( vUv.x, vUv.y + 4.0 * amount_$ / resolution_$ ) ) * 0.051;

			return sum;
		}`
};




const VignetteShader = {
	name: 'VignetteShader',
	uniforms: {
		radius: { value: 1 },
		blur: { value: 1 },
		color: { value: new THREE.Color(0,0,0) },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec4 texel = $$( vUv );
			float dist = 1.0 - length( 2.0*vUv - vec2(1) );
			float k = smoothstep( 1.0-radius_$, 1.0-radius_$+blur_$, dist);
			return vec4( mix( color_$, texel.rgb, k) , texel.a );
				
			//vec4 texel = $$( vUv );
			//vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset_$ );
			//return vec4( mix( texel.rgb, vec3( 1.0 - darkness_$ ), dot( uv, uv ) ), texel.a );
		}`
};




const BleachBypassShader = {
	name: 'BleachBypassShader',
	uniforms: {
		amount: { value: 3 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec4 base = $$( vUv );

			vec3 lumCoeff = vec3( 0.25, 0.65, 0.1 );
			float lum = dot( lumCoeff, base.rgb );
			vec3 blend = vec3( lum );

			float L = min( 1.0, max( 0.0, 10.0 * ( lum - 0.45 ) ) );

			vec3 result1 = 2.0 * base.rgb * blend;
			vec3 result2 = 1.0 - 2.0 * ( 1.0 - blend ) * ( 1.0 - base.rgb );

			vec3 newColor = mix( result1, result2, L );

			float A2 = amount_$ * base.a;
			vec3 mixRGB = A2 * newColor.rgb;
			mixRGB += ( ( 1.0 - A2 ) * base.rgb );

			return vec4( mixRGB, base.a );
		}`
};




const MirrorShader = {
	name: 'MirrorShader',
	uniforms: {
		side: { value: 1, type: 'int' },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec2 p = vUv;
			
			if (side_$ == 0){
				if (p.x > 0.5) p.x = 1.0 - p.x;
			}else if (side_$ == 1){
				if (p.x < 0.5) p.x = 1.0 - p.x;
			}else if (side_$ == 2){
				if (p.y < 0.5) p.y = 1.0 - p.y;
			}else if (side_$ == 3){
				if (p.y > 0.5) p.y = 1.0 - p.y;
			}
			
			return $$( p );
		}`
};




const KaleidoShader = {
	name: 'KaleidoShader',
	uniforms: {
		sides: { value: 6 },
		angle: { value: 0 },
		resolution: { value: new THREE.Vector2(innerWidth,innerHeight) },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec2 p = (vUv - 0.5);
			p.x *= resolution_$.x / resolution_$.y;
			float r = length(p);
			float a = atan(p.y, p.x) + angle;
			float tau = 2. * 3.1416 ;
			a = mod(a, tau/sides_$);
			a = abs(a - tau/sides_$/2.) ;
			p = r * vec2(cos(a), sin(a));
			return $$(p + 0.5);
		}`
};




const TechnicolorShader = {
	name: 'TechnicolorShader',
	uniforms: {
		opacity: { value: 1 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec4 tex = $$( vUv );

			return mix( tex, vec4(tex.r, (tex.g + tex.b) * 0.5, (tex.g + tex.b)*.5, 1.0), opacity_$ );
		}`
};




const ColorifyShader = {
	name: 'ColorifyShader',
	uniforms: {
		color: { value: new THREE.Vector3(1,1,1) },
		opacity: { value: 1 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec4 texel = $$( vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );
			float v = dot( texel.xyz, luma );

			return mix( texel, vec4( v * color_$, texel.w ), opacity_$ );
		}`
};




const HueSaturationShader = {
	name: 'HueSaturationShader',
	uniforms: {
		hue: { value: 0 },
		saturation: { value: 0 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
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




const LuminosityShader = {
	name: 'LuminosityShader',
	uniforms: {
		opacity: { value: 1 },
	},
	fragmentShader: /* glsl */`
		#include <common>

		vec4 $( vec2 vUv )
		{
			vec4 texel = $$( vUv );

			float l = luminance( texel.rgb );

			return mix( texel, vec4( l, l, l, texel.w ), opacity_$ );
		}`
};




const LuminosityHighPassShader = {
	name: 'LuminosityHighPassShader',
	uniforms: {
		'color': { value: new THREE.Color( 0, 0, 0 ) },
		'alpha': { value: 0.0 },
		'threshold': { value: 0.25 },
		'span': { value: 0.25 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec4 texel = $$( vUv );
			
			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( color_$.rgb, alpha_$ );

			float alpha = smoothstep( threshold_$ - span_$, threshold_$ + span_$, v );

			return mix( outputColor, texel, alpha );
		}`
};




const HorizontalTiltShiftShader = {
	name: 'HorizontalTiltShiftShader',
	uniforms: {
		position: { value: 0.5 },
		span: { value: 0.1 },
		amount: { value: 4.0 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec4 color = $$( vUv );
			vec4 sum = vec4( 0.0 );

			float hh = abs( vUv.y - position_$ ) ;//;
			hh = 0.003 * smoothstep( 0.0, 1.0, amount_$*(hh-span_$) );
			
			sum += $$( vec2( vUv.x - 4.0 * hh, vUv.y ) ) * 0.051;
			sum += $$( vec2( vUv.x - 3.0 * hh, vUv.y ) ) * 0.0918;
			sum += $$( vec2( vUv.x - 2.0 * hh, vUv.y ) ) * 0.12245;
			sum += $$( vec2( vUv.x - 1.0 * hh, vUv.y ) ) * 0.1531;
			sum += color * 0.1633;
			sum += $$( vec2( vUv.x + 1.0 * hh, vUv.y ) ) * 0.1531;
			sum += $$( vec2( vUv.x + 2.0 * hh, vUv.y ) ) * 0.12245;
			sum += $$( vec2( vUv.x + 3.0 * hh, vUv.y ) ) * 0.0918;
			sum += $$( vec2( vUv.x + 4.0 * hh, vUv.y ) ) * 0.051;

			return sum;
		}`
};




const VerticalTiltShiftShader = {
	name: 'VerticalTiltShiftShader',
	uniforms: {
		position: { value: 0.5 },
		span: { value: 0.1 },
		amount: { value: 4.0 },
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec4 color = $$( vUv );
			vec4 sum = vec4( 0.0 );

			float vv = abs( vUv.x - position_$ ) ;//;
			vv = 0.003 * smoothstep( 0.0, 1.0, amount_$*(vv-span_$) );
			
			sum += $$( vec2( vUv.x, vUv.y - 4.0 * vv ) ) * 0.051;
			sum += $$( vec2( vUv.x, vUv.y - 3.0 * vv ) ) * 0.0918;
			sum += $$( vec2( vUv.x, vUv.y - 2.0 * vv ) ) * 0.12245;
			sum += $$( vec2( vUv.x, vUv.y - 1.0 * vv ) ) * 0.1531;
			sum += color * 0.1633;
			sum += $$( vec2( vUv.x, vUv.y + 1.0 * vv ) ) * 0.1531;
			sum += $$( vec2( vUv.x, vUv.y + 2.0 * vv ) ) * 0.12245;
			sum += $$( vec2( vUv.x, vUv.y + 3.0 * vv ) ) * 0.0918;
			sum += $$( vec2( vUv.x, vUv.y + 4.0 * vv ) ) * 0.051;

			return sum;
		}`
};




const TriangleBlurShader = {
	name: 'TriangleBlurShader',
	uniforms: {
		amount: { value: new THREE.Vector2( 0, 0 ) },
	},
	fragmentShaderHead: /* glsl */`
		#include <common>
	`,
	fragmentShader: /* glsl */`
		#define ITERATIONS_$ 7.0
		
		vec4 $( vec2 vUv )
		{
			vec4 color = vec4( 0.0 );

			float total = 0.0;

			// randomize the lookup values to hide the fixed number of samples
			float offset = rand( vUv );

			for ( float t = -ITERATIONS_$; t <= ITERATIONS_$; t ++ )
			{
				float percent = ( t + offset - 0.5 ) / ITERATIONS_$;
				float weight = 1.0 - abs( percent );

				color += $$( vUv + amount_$ * percent ) * weight;
				
				total += weight;
			}

			return color / total;
		}`
};




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
			values[i] = gauss( i - halfWidth, sigma );
			sum += values[i];
		}

		for( var i = 0; i < kernelSize; ++ i ) values[i] /= sum;
	},
	vertexShaderHead: /* glsl */`
		#define KERNEL_SIZE_FLOAT_$ 25.0
		#define KERNEL_SIZE_INT_$ 25
	`,
	vertexShader: /* glsl */`
		varying vec2 vImageCoord_$;

		vec3 $(vec3 position)
		{
			vImageCoord_$ = uv - ( ( KERNEL_SIZE_FLOAT_$ - 1.0 ) / 2.0 ) * uImageIncrement_$;
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
