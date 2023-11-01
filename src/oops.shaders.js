import * as THREE from 'three';


// User shaders:
//		RGBShiftShader( amount:0.005, angle:0.0 )
//		DotScreenShader( scale:1.0, angle:1.57, tSize=Vector2(256,256), center:Vector2(0.5,0.5) )
//		SepiaShader( amount:1.0 )
//		SobelOperatorShader( resolution:Vector2 )
//
// System shaders:
//
//		DefaultShader
//		HeaderShader




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
}


export {SHADERS};
