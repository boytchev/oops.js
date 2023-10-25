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

		vec4 OOPS_PASS_0( vec2 vUv )
		{
			return texture2D( tDiffuse, vUv );
		}
		`;


const DEFAULT_FRAGMENT_SHADER_TAIL = (n) => /* glsl */`
		void main() {
			gl_FragColor = OOPS_PASS_${n}( vUv );
		}
		`;


const RGBShiftShader = {
	//name: 'oops_rgb_shift',
	uniforms: {
		'amount': { value: 0.005, type: 'float' },
		'angle': { value: 0.0, type: 'float' },
	},
	fragmentShader: (n) => /* glsl */`
		#define amount_${n+1} 0.005
		#define angle_${n+1} 0.0
		#define OOPS_PASS_${n+1} rgb_shift_${n+1}
		vec4 rgb_shift_${n+1}( vec2 vUv )
		{
			vec2 offset = amount_${n+1} * vec2( cos(angle_${n+1}), sin(angle_${n+1}));
			vec4 cr = OOPS_PASS_${n}( vUv + offset );
			vec4 cga = OOPS_PASS_${n}( vUv);
			vec4 cb = OOPS_PASS_${n}( vUv - offset );
			return vec4( cr.r, cga.g, cb.b, cga.a );
		}`
};


const DotScreenShader = {
	//name: 'oops_rgb_shift',
	uniforms: {
	},
	fragmentShader: (n) => /* glsl */`
		#define center_${n+1} vec2(0.5, 0.5)
		#define angle_${n+1} 1.57
		#define scale_${n+1} 4.0
		#define tSize_${n+1} vec2( 256.0, 256.0 )

		#define OOPS_PASS_${n+1} dot_screen_${n+1}
		float pattern_${n+1}( vec2 vUv )
		{
			float s = sin( angle_${n+1} ), c = cos( angle_${n+1} );
			vec2 tex = vUv * tSize_${n+1} - center_${n+1};
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale_${n+1};
			return ( sin( point.x ) * sin( point.y ) ) * 4.0;
		}

		vec4 dot_screen_${n+1}( vec2 vUv )
		{

			vec4 color = OOPS_PASS_${n}( vUv );
			float average = ( color.r + color.g + color.b ) / 3.0;
			return vec4( vec3( average * 10.0 - 5.0 + pattern_${n+1}(vUv) ), color.a );
		}`
};

const SHADERS = {
		RGBShiftShader: RGBShiftShader,
		DotScreenShader: DotScreenShader,
}


class OOPSShader
{
	constructor( )
	{
		this.name = 'OnlyOnePassShader';
		this.passes = [];
		
		this.updateShaders( );
/*		


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
		
		for( var i=0; i<this.passes.length; i++ )
		{
			this.fragmentShader += this.passes[i].fragmentShader( i );
		}
			
		this.fragmentShader += DEFAULT_FRAGMENT_SHADER_TAIL( this.passes.length );
		
	} // OOPSShader.updateFragmentShader


	addShader( name )
	{
		this.passes.push( SHADERS[name] );
		this.updateShaders( );
	} // OOPSShader.addShader
	
} // OOPSShader
			

export {OOPSShader};
