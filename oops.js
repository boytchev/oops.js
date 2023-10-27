import * as THREE from 'three';


const DEFAULT_VERTEX_SHADER = /* glsl */`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`;
		

const DEFAULT_FRAGMENT_SHADER = {
	uniforms: {
	},
	fragmentShader: /* glsl */`
		void main() {
			gl_FragColor = $$( vUv );
		}`
};





const HeaderShader = {
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
	uniforms: {
		'amount': { value: 0.005 },
		'angle':  { value: 0.0 }
	},
	fragmentShader: /* glsl */`
		vec4 $( vec2 vUv )
		{
			vec2 offset = amount_$ * vec2( cos(angle_$), sin(angle_$));
			vec4 cr  = $$( vUv + offset );
			vec4 cga = $$( vUv);
			vec4 cb  = $$( vUv - offset );
			return vec4( cr.r, cga.g, cb.b, cga.a );
		}`
};


const DotScreenShader = {
	uniforms: {
		'tSize':  { value: new THREE.Vector2( 256, 256 ) },
		'center': { value: new THREE.Vector2( 0.5, 0.5 ) },
		'angle':  { value: 1.57 },
		'scale':  { value: 1.0 }
	},
	fragmentShader: /* glsl */`
		float pattern_$( vec2 vUv )
		{
			float s = sin( angle_$ ), c = cos( angle_$ );
			vec2 tex = vUv * tSize_$ - center_$;
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale_$;
			return ( sin( point.x ) * sin( point.y ) ) * 4.0;
		}

		vec4 $( vec2 vUv )
		{

			vec4 color = $$( vUv );
			float average = ( color.r + color.g + color.b ) / 3.0;
			return vec4( vec3( average * 10.0 - 5.0 + pattern_$(vUv) ), color.a );
		}`
};



function processUniform( name, value, n )
{
	var value = value.value;
	
	if( value instanceof THREE.Vector2 )
		return `#define ${name}_${n+1} vec2(${value.x},${value.y})\n`;
		
	if( Number.isInteger(value) )
		return `#define ${name}_${n+1} ${value.toFixed(1)}\n`;
		
	return `#define ${name}_${n+1} ${value}\n`;
}


function processShader( shader, n )
{
	var glsl = shader.fragmentShader;
	
	// process shader code
	
	// $$ -> main_|n|
	glsl = glsl.replaceAll( '$$', `main_${n}` );
	
	// _$ -> _|n+1|
	glsl = glsl.replaceAll( '_$', `_${n+1}` );
	
	// $( -> main_|n+1|
	glsl = glsl.replaceAll( '$', `main_${n+1}` );

	glsl += `\n`;

	// process uniforms
	if( shader.uniforms )
	for( var name of Object.keys(shader.uniforms) )
	{
		glsl = processUniform( name, shader.uniforms[name], n ) + glsl;
	}
	
	glsl += `\n`;
	
	return glsl;
}




const SHADERS = {
		HeaderShader: HeaderShader,
		RGBShiftShader: RGBShiftShader,
		DotScreenShader: DotScreenShader,
}


class OOPSShader
{
	constructor( )
	{
		this.name = 'OnlyOnePassShader';
		this.passes = [];
		this.addShader( 'HeaderShader' );
		
		this.updateShaders( );
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
		this.fragmentShader = '';
		
		for( var i=0; i<this.passes.length; i++ )
		{
			this.fragmentShader += processShader( this.passes[i], i );
		}
			
		this.fragmentShader += processShader( DEFAULT_FRAGMENT_SHADER, i );
		
		console.log('----------------------------');
		console.log(this.fragmentShader);
		
	} // OOPSShader.updateFragmentShader


	addShader( name )
	{
		this.passes.push( SHADERS[name] );
		this.updateShaders( );
	} // OOPSShader.addShader
	
} // OOPSShader
			

export {OOPSShader};
