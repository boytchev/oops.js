import * as THREE from 'three';





const DefaultShader = {
	name: 'DefaultShader',
	uniforms: {
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,
	fragmentShader: /* glsl */`
		void main() {
			gl_FragColor = $$( vUv );
		}`
};




const HeaderShader = {
	name: 'HeaderShader',
	uniforms: {
	},
	fragmentShader: /* glsl */`
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		vec4 $( vec2 vUv )
		{
			return texture2D( tDiffuse, vUv );
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
		color: { value: new THREE.Vector3(0,0,0) },
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





const SHADERS = {
		DefaultShader: 				DefaultShader,
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
}


export {SHADERS};
