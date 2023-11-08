import * as THREE from 'three';
import {SHADERS} from './oops.shaders.js';


console.log( `

     :
 '.  _  .'
-=  (~)  =-     OOPS.JS
 .'  #  '.
 
` )

// a THREE.ShaderPass-compatible shader, that merges other shaders

class OOPSShader
{

	constructor( )
	{
		this.name = 'OnlyOnePassShader';
		
		this.passes = [];
		this.addShader( 'HeaderShader' );
		
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
			tDiffuse: { value: null },
		};
		
	} // OOPSShader.updateUniforms

	
	
	updateVertexShader( )
	{
		this.vertexShader = SHADERS.DefaultShader.vertexShader;
		
	} // OOPSShader.updateVertexShader

	
	
	updateFragmentShader( )
	{
		var fragmentShaderHead = '';
		this.fragmentShader = '';
		
		for( var i=0; i<this.passes.length; i++ )
		{
			var head = this.passes[i].shader.fragmentShaderHead || '';
			if( fragmentShaderHead.indexOf(head) == -1 )
			{
				fragmentShaderHead += head;
			}
			this.fragmentShader += this.processShader( this.passes[i], i );
		}

		this.fragmentShader += this.processShader( {shader:SHADERS.DefaultShader}, i );
		
		this.fragmentShader = fragmentShaderHead + this.fragmentShader;
				
	} // OOPSShader.updateFragmentShader



	addShader( name, values={} )
	{
		var shader = SHADERS[name],
			shaderPass = {shader: shader, values: values, uniforms:{}};
		
		if( shader === undefined )
		{
			throw new Error( `Shader named "${name}" is unknown or unsupported.\n\nKnown and supported shaders are: \n · ${Object.keys(SHADERS).sort().join('\n · ')}.\n` );
			return null;
		}
		
/*
		for( var pass of this.passes )
		{
			var conflict = shader.conflicts[pass.shader.name];
			if( conflict != undefined )
			{
				throw new Error( conflict );
				return null;
			}
		}
*/
		
		this.passes.push( shaderPass );
		
		this.updateShaders( );
		
		return this;
		
	} // OOPSShader.addShader



	addUniform( name, alias, value )
	{
		// (1) addUniform( name )					string
		// (2) addUniform( name, alias )			string string
		// (3) addUniform( name, alias, value )		string string value
		// (4) addUniform( name, value )			string value
//console.log('addUniform', name, alias, value )

		if( typeof alias === 'undefined' )
		{	// (1) -> (2)
			alias = name;
//console.log('(1) -> (2)', name, alias, value )
		} else
		if( typeof alias !== 'string' )
		{
			// (4) -> (3)
			value = alias;
			alias = name;
//console.log('(4) -> (3)', name, alias, value )
		}
		
		// (2) -> (3)
		if( typeof value === 'undefined' )
		{
			value = this.passes[this.passes.length-1].shader.uniforms[name].value;
//console.log('(2) -> (3)', name, alias, value )
		}
		
		// (3)
		// searches backwards
//console.log('       (3)', name, alias, value )
		for( var i=this.passes.length-1; i>=0; i-- )
		{
			if( this.passes[i].shader.uniforms[name] )
			{
				this.passes[i].uniforms[name] = {alias:alias, value:value};
				break;
			}
		}
		
		this.updateShaders( );
		
		return this;		
	} // OOPSShader.addUniform
	
	
	
	processDefine( name, value, n, type )
	{
		if( value instanceof THREE.Vector2 )
			return `#define ${name}_${n+1} vec2(${value.x},${value.y})\n`;
			
		if( value instanceof THREE.Vector3 )
			return `#define ${name}_${n+1} vec3(${value.x},${value.y},${value.z})\n`;
			
		if( value instanceof THREE.Color )
			return `#define ${name}_${n+1} vec3(${value.r},${value.g},${value.b})\n`;
			
		if( type === true )
			return `#define ${name}_${n+1} true\n`;
			
		if( type === false )
			return `#define ${name}_${n+1} false\n`;
			
		if( type == 'int' )
			return `#define ${name}_${n+1} ${Math.round(value)}\n`;
			
		if( Number.isInteger(value) )
			return `#define ${name}_${n+1} ${value.toFixed(1)}\n`;
			
		return `#define ${name}_${n+1} ${value}\n`;
		
	} // OOPSShader.processDefine



	processUniform( name, alias, value, n, type )
	{
//console.log(name, alias, value, n, type )
		var str = `#define ${name}_${n+1} ${alias}\n`;
		
		if( value instanceof THREE.Vector2 )
			return str + `uniform vec2 ${name}_${n+1};\n`;
		
		if( value instanceof THREE.Vector3 )
			return str + `uniform vec3 ${name}_${n+1};\n`;
		
		if( value instanceof THREE.Color )
			return str + `uniform vec3 ${name}_${n+1};\n`;

		if( type == 'bool' || type == 'boolean' || typeof value == 'boolean' )
			return str + `uniform bool ${name}_${n+1};\n`;

		if( type == 'int' )
			return str + `uniform int ${name}_${n+1};\n`;
		
		return str + `uniform float ${name}_${n+1};\n`;
		
	} // OOPSShader.processUniform



	processShader( shaderPass, n )
	{
		var shader = shaderPass.shader,
			glsl = shader.fragmentShader;
		
		// process shader code
		
		// $$ -> main_|n|
		glsl = glsl.replaceAll( '$$', `main_${n}` );
		
		// _$ -> _|n+1|
		glsl = glsl.replaceAll( '_$', `_${n+1}` );
		
		// $( -> main_|n+1|
		glsl = glsl.replaceAll( '$', `main_${n+1}` );

		// shilft left two tabs
		glsl = glsl.replaceAll( '\n\t\t', '\n' );

		glsl += `\n`;

		// process uniforms
		if( shader.uniforms )
		{
			for( var name of Object.keys(shader.uniforms) )
			{
				var type = shader.uniforms[name].type;
				
				if( shaderPass.uniforms[name] )
				{
					var value = shaderPass.uniforms[name].value!==undefined ? shaderPass.uniforms[name].value : shader.uniforms[name].value,
						alias = shaderPass.uniforms[name].alias;

					glsl = this.processUniform( name, alias, value, n, type ) + glsl;
					this.uniforms[alias] = {value: value};
				}
				else
				{
					var value = shaderPass.values[name]!==undefined ? shaderPass.values[name] : shader.uniforms[name].value;
					
					glsl = this.processDefine( name, value, n, type ) + glsl;
					
				}
			} // for name
		} // if shader.uniforms
		
		glsl += `\n`;
		
		if( shader.name )
		{
			glsl = `\n// ${shader.name} \n\n` + glsl;
		}
			
		return glsl;
		
	} // OOPSShader.processShader
	
	
	
} // OOPSShader
			

export {OOPSShader};
