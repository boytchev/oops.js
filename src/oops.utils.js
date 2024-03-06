/*
	OOPS Effects Utils
	
	function isShader( something )
	function bakeUniform( pass, shaderName, uniformName, uniformValue )

*/

import { Vector2, Vector3, Color } from 'three';



// convert a number to string with decimal point

function toFloat( x )
{
	if( Number.isInteger(x) )
		return x.toFixed( 1 );
	else
		return x+'';
}



// return true is something looks like a Three.jsshader

function isShader( something )
{
	
	if( !something ) return false;
	if( !something.vertexShader ) return false;
	if( !something.fragmentShader ) return false;
	if( !something.uniforms ) return false;
	
	return true;
	
} // isShader



// bakes uniform value into a shader of a THREE.ShaderPass
// by replacing "uniform..." with "#define..."
//
// returns true if baking is successful

function bakeUniform( pass, shaderName, uniformName, uniformValue )
{
	var glsl = pass.material[shaderName];

	// if from exists in glsl, replace it with to and
	// remove the corresponding uniform declaration
	function replaced( from, to )
	{
		// replace spaces by "any-white-space-characters"
		from = '(?<=^[\\s]*)' + from.replaceAll( ' ', '[\\s]+' );
		
		var regex = new RegExp( from, 'gim' );
		
		if( regex.test(glsl) )
		{
			pass.material[shaderName] = glsl.replace( regex, to );
			delete pass.uniforms[uniformName];
			return true;
		}
		return false;
	}
	
	if( uniformValue instanceof Color )
	{
		if( replaced(
			`uniform vec3 ${uniformName};`,
			`#define ${uniformName} vec3(${uniformValue.r},${uniformValue.g},${uniformValue.b})`
		)) return true;
	}
		
	if( uniformValue instanceof Vector3 )
		if( replaced(
			`uniform vec3 ${uniformName};`,
			`#define ${uniformName} vec3(${uniformValue.x},${uniformValue.y},${uniformValue.z})`
		)) return true;
		
	if( uniformValue instanceof Vector2 )
		if( replaced(
			`uniform vec2 ${uniformName};`,
			`#define ${uniformName} vec2(${uniformValue.x},${uniformValue.y})`
		)) return true;
		
	if( replaced(
		`uniform float ${uniformName};`,
		`#define ${uniformName} ${toFloat(uniformValue)}`
	)) return true;
		
	if( replaced(
		`uniform int ${uniformName};`,
		`#define ${uniformName} ${Math.round(uniformValue)}`
	)) return true;
	
	return false;
	
} // bakeUniform



// renames a word in shader source

function renameWord( pass, shaderName, word, newWord )
{
	var glsl = pass.material[shaderName];

	var regex = new RegExp( `\\b${word}\\b`, 'gi' );
		
	pass.material[shaderName] = glsl.replace( regex, newWord );
	
} // renameWord



// shows information about shaders

function showShaders( effects )
{
	console.group( 'Shaders' );
	
	for( var pass of effects.passes )
	{
		if( pass.material?.name )
			console.groupCollapsed( 'Pass '+pass.constructor.name+' ('+pass.material.name+')' );
		else
			console.groupCollapsed( 'Pass '+pass.constructor.name );
		
		if( effects.options.shaders && pass.material?.vertexShader )
		{
			console.log( pass.material.vertexShader );
			console.log( pass.material.fragmentShader );
		}
		else
		if( effects.options.uniforms )
		{
			console.log( 'uniforms', pass.uniforms );
		}
		else
		{
			console.log( '(no info)' );
		}
		console.groupEnd( );
	} // for pass
	
	console.groupEnd( );
	
} // showShaders


export { isShader, bakeUniform, renameWord, showShaders };
