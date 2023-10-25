import * as THREE from 'three';


const DEFAULT_VERTEX_SHADER = /* glsl */`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
		`;


const DEFAULT_FRAGMENT_SHADER_HEADER = /* glsl */`
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		vec4 OOPS_PASS_1( vec2 vUv )
		{
			return texture2D( tDiffuse, vUv );
		}
		`;


const DEFAULT_FRAGMENT_SHADER_TAIL = (n) => /* glsl */`
		void main() {
			gl_FragColor = OOPS_PASS_${n}( vUv );
		}
		`;


/*
const RGBShiftShader = {
	name: 'oops_rgb_shift',
	uniforms: {
		'amount': { value: 0.005, type: 'float' },
		'angle': { value: 0.0, type: 'float' },
	},
	fragmentShader: /* glsl * /`
		vec4 oops_rgb_shift( vUv )
		{
			vec2 offset = amount * vec2( cos(angle), sin(angle));
			vec4 cr = texture2D(tDiffuse, vUv + offset);
			vec4 cga = texture2D(tDiffuse, vUv);
			vec4 cb = texture2D(tDiffuse, vUv - offset);
			return vec4(cr.r, cga.g, cb.b, cga.a);
		}`
};
*/

class OOPSShader
{
	constructor( )
	{
		this.name = 'OnlyOnePassShader';

		this.updateShaders( );
/*		

		this.vertexShader = /* glsl * /`
			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`;

		this.fragmentShader = /* glsl * /`
			uniform sampler2D tDiffuse;
			varying vec2 vUv;

//-----------------------
			#define oops_pass_1 oops_initial
			vec4 oops_initial( vec2 vUv )
			{
				return texture2D( tDiffuse, vUv );
			}
			
//-----------------------
			#define dot_screen_center vec2(0.5, 0.5)
			#define dot_screen_angle 1.57
			#define dot_screen_scale 4.0
			#define dot_screen_tSize vec2( 256.0, 256.0 )

			#define oops_pass_2 oops_dot_screen
			float dot_screen_pattern( vec2 vUv )
			{
				float s = sin( dot_screen_angle ), c = cos( dot_screen_angle );
				vec2 tex = vUv * dot_screen_tSize - dot_screen_center;
				vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * dot_screen_scale;
				return ( sin( point.x ) * sin( point.y ) ) * 4.0;
			}

			vec4 oops_dot_screen( vec2 vUv )
			{

				vec4 color = oops_pass_1( vUv );
				float average = ( color.r + color.g + color.b ) / 3.0;
				return vec4( vec3( average * 10.0 - 5.0 + dot_screen_pattern(vUv) ), color.a );
			}
		
//-----------------------
			#define rgb_shift_amount 0.0015
			#define rgb_shift_angle 0.0
			
		
			#define oops_pass_3 oops_rgb_shift
			vec4 oops_rgb_shift( vec2 vUv )
			{
				vec2 offset = rgb_shift_amount * vec2( cos(rgb_shift_angle), sin(rgb_shift_angle));
				vec4 cr = oops_pass_2(vUv + offset);
				vec4 cga = oops_pass_2(vUv);
				vec4 cb = oops_pass_2(vUv - offset);
				return vec4(cr.r, cga.g, cb.b, cga.a);
			}

//-----------------------
			void main() {
				gl_FragColor = oops_pass_3( vUv );
			}`;
		*/
	} // OOPSShader.constructor
	
	
	updateShaders( )
	{
		this.updateUniforms( );
		this.updateVertexShader( );
		this.updateFragmentShader( );
	} // OOPSShader.updateShaders

	
	updateUniforms( )
	{
		
		// default uniform (always exists)
		this.uniforms = {
			'tDiffuse': { value: null, type: 'sampler2D' },
		};
		
	} // OOPSShader.updateUniforms

	
	updateVertexShader( )
	{
		this.vertexShader = DEFAULT_VERTEX_SHADER;
	} // OOPSShader.updateVertexShader

	
	updateFragmentShader( )
	{
		this.fragmentShader = DEFAULT_FRAGMENT_SHADER_HEADER;
		this.fragmentShader += DEFAULT_FRAGMENT_SHADER_TAIL(1);
	} // OOPSShader.updateFragmentShader
	
} // OOPSShader
			

export {OOPSShader};
