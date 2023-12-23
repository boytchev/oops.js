/**
 *
 * Ported from examples/jsm/shaders/RGBShiftShader.js
 *
 */
 
 
const RGBShiftShader = {

	name: 'RGBShiftShader',

	uniforms: {
		
		amount: { value: 0.005 },
		angle:  { value: 0.0 },
		opacity:  { value: 1.0 },
		
	},

	fragmentShader: /* glsl */`
	
		vec4 $( vec2 vUv ) {
			
			vec2 offset = amount_$ * vec2( cos(angle_$), sin(angle_$));
			
			vec4 cr  = $$( vUv + offset );
			vec4 cga = $$( vUv );
			vec4 cb  = $$( vUv - offset );
			
			return mix( cga, vec4( cr.r, cga.g, cb.b, cga.a ), opacity_$ );
			
		}`
		
};


export { RGBShiftShader };