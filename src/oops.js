import { Vector2, Vector3, Color } from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
			
import { SHADERS } from './oops.shaders.js';


console.log( `

     :
 '.  _  .'
-=  (~)  =-     OOPS.JS
 .'  #  '.
 
` )

// a THREE.ShaderPass-compatible shader, that merges other shaders
//
// class OOPSShader( )
//	.fragmentShader
//	.vertexShader
//	.uniforms = {...}
//	.shaders = [ shader, ... ]
//	.addShader( shaderName, bakedValues )
//	.addUniform( name, param1, param2 )
//		ex: addUniform( name )
//		ex: addUniform( name, publicName )
//		ex:	addUniform( name, publicName, initialValue )
//		ex: addUniform( name, initialValue )




class OOPSShader
{

	constructor( )
	{
		this.name = 'OnlyOnePassShader';

		this._uniforms = {};
		this._fragmentShader = '';
		this._vertexShader = '';

		this.shaders = [
			{...SHADERS.HeaderShader},
			{...SHADERS.FooterShader},
		];
		
		this.addUniform( 'tDiffuse' );
		
		this.needsCompile = true;
		
		//this.compileShaders( );
		
	} // OOPSShader.constructor
	
	

	addShader( shaderName, bakedValues={} )
	{
		var shader = SHADERS[shaderName];

		// shader exists?
		if( shader === undefined )
		{
			throw new Error( `Shader named "${shaderName}" is unknown or unsupported.\n\nKnown and supported shaders are: \n · ${Object.keys(SHADERS).sort().join('\n · ')}.\n` );
			return null;
		}

		// deep copy
		var shaderClone = {
				name: shader.name || 'AnonymousShader',
				vertexShader: shader.vertexShader || '',
				vertexShaderHead: shader.vertexShaderHead || '',
				fragmentShader: shader.fragmentShader || '',
				fragmentShaderHead: shader.fragmentShaderHead || '',
				uniforms: {},
			};
		
		if( shader.uniforms )
		for( var name of Object.keys(shader.uniforms) )
		{
			var value = bakedValues[name] || shader.uniforms[name].value;
			if( value.clone )
				value = value.clone();
			else
			{
				if ( Array.isArray( value ) )
					value = value.slice();
				else
					value = value;
			}

			shaderClone.uniforms[name] = {
					value: value,
					type: shader.uniforms[name].type,
					size: shader.uniforms[name].size,
					glsl: this.bakedUniformGLSL( name, shader.uniforms[name].type, value )
				};
		}

		
		if( shader.onLoad )
		{
			shader.onLoad( shaderClone );
		}
		
		// insert the shader before the last shader (i.e. FooterShader)
		this.shaders.splice( this.shaders.length-1, 0, shaderClone );


		this.needsCompile = true;
		//this.compileShaders( );
		
		return this;
		
	} // OOPSShader.addShader



	addUniform( name, param1, param2 )
	{
		var shadersCount = this.shaders.length;
		
		// check entry data 
		
		// if( shadersCount<=2 )
		// {
			// throw new Error( `Uniforms can be added only after adding a shader. First add a shader, then add a uniform.\n` );
			// return;
		// }
		
		var shader = this.shaders[ shadersCount-2 ];
		
		if( !name )
		{
			throw new Error( `Missing name of a uniform for ${shader.name}. Use a valid and existing name. Available names are: "${Object.keys(shader.uniforms).sort().join('", "')}".\n` );
				
			return null;
		}

		var uniform = shader.uniforms[name];
		
		if( !uniform )
		{
			throw new Error( `There is no uniform named "${name}" for ${shader.name}. Use a valid and existing name. Available names are: "${Object.keys(shader.uniforms).sort().join('", "')}".\n` );
				
			return null;
		}

		// addUniform(...) can be used in four styles:
		//
		// (1) addUniform( name )								string
		// (2) addUniform( name, publicName )					string string
		// (3) addUniform( name, publicName, customValue )		string string !string
		// (4) addUniform( name, customValue )					string !string

		// case (1) -> (2)
		if( typeof param1 === 'undefined' )
		{
			param1 = name;
		}
		
		// case (4) -> (3)
		if( typeof param1 !== 'string' )
		{
			param2 = param1;
			param1 = name;
		}
						
		// cases (2) and (3)
		uniform.publicName = param1;
		if( typeof param2 !== 'undefined' ) uniform.value = param2;
		uniform.glsl = this.uniformGLSL( name, uniform );

		this.needsCompile = true;
		//this.compileShaders( );
		
		return this;		
		
	} // OOPSShader.addUniform



	compileShaders( )
	{
//		console.log('Compiling shaders');
		this.needsCompile = false;
		this.compileShader( 'vertexShader',   'vertexShaderHead'   );
		this.compileShader( 'fragmentShader', 'fragmentShaderHead' );	
		this.updateUniforms( );
	} // OOPSShader.compileShaders



	bakedUniformGLSL( name, type, value )
	{
		// if( value === null )
			// return `#define ${name}_$ ${uniform.publicName}\n` +
				   // `uniform sampler2D ${name}_$;\n`;

		if( value instanceof Vector2 )
			return `#define ${name}_$ vec2(${value.x},${value.y})\n`;
			
		if( value instanceof Vector3 )
			return `#define ${name}_$ vec3(${value.x},${value.y},${value.z})\n`;
			
		if( value instanceof Color )
			return `#define ${name}_$ vec3(${value.r},${value.g},${value.b})\n`;
			
		if( value === true )
			return `#define ${name}_$ true\n`;
			
		if( value === false )
			return `#define ${name}_$ false\n`;
			
		if( type == 'int' )
			return `#define ${name}_$ ${Math.round(value)}\n`;
			
		if( Number.isInteger(value) )
			return `#define ${name}_$ ${value.toFixed(1)}\n`;
			
		return `#define ${name}_$ ${value}\n`;
		
	} // OOPSShader.bakedUniformGLSL



	uniformGLSL( name, uniform )
	{
		var value = uniform.value,
			type = uniform.type;

		var define = `#define ${name}_$ ${uniform.publicName}\n`;

// why is this?
		// if( this.uniforms[publicName] )
		// {
			// return str;
		// }

		if( value === null )
			return define +	`uniform sampler2D ${name}_$;\n`;
		
		if( value instanceof Vector2 )
			return define +	`uniform vec2 ${name}_$;\n`;
		
		if( value instanceof Vector3 )
			return define + `uniform vec3 ${name}_$;\n`;
		
		if( value instanceof Color )
			return define + `uniform vec3 ${name}_$;\n`;

		if( type == 'bool' || type == 'boolean' || typeof value == 'boolean' )
			return define + `uniform bool ${name}_$;\n`;

		if( type == 'int' )
			return define + `uniform int ${name}_$;\n`;

		if( type == 'floatarray' )
			return define + `uniform float ${name}_$[${uniform.size}];\n`;
		
		return define + `uniform float ${name}_$;\n`;
		
	} // OOPSShader.uniformGLSL




	compileShader( shaderName, shaderHeadName )
	{
		var glsl = '',
			prevIndex = 0;
		
		// process user-added shaders
		for( var index=0; index<this.shaders.length; index++ )
		{
			var shader = this.shaders[index],
				head = shader[shaderHeadName] || '',
				body = shader[shaderName] || '';
			
			if( head )
			{
				head = head.replaceAll( '$', (index+1) );
				head = head.split('\n').map(e=>e.trim()).filter(e=>e).join('\n')+'\n';
					
				if( glsl.indexOf(head) == -1 )
				{
					glsl = head + glsl;
				}
			}
			
			if( body )
			{	
				glsl = glsl + this.processShader( shader, body, (prevIndex+1), (index+1) );	
				prevIndex = index;
			}
		}
		
		this['_'+shaderName] = glsl;
		
	} // OOPSShader.compileShader


	get vertexShader( )
	{
		if( this.needsCompile ) this.compileShaders( );
		return this._vertexShader;
	}
	
	
	get fragmentShader( )
	{
		if( this.needsCompile ) this.compileShaders( );
		return this._fragmentShader;
	}
	
	
	get uniforms( )
	{
		if( this.needsCompile ) this.compileShaders( );
		return this._uniforms;
	}
	
	
	processShader( shader, glsl, prevIndex, index )
	{
		glsl = (glsl || '');
		
		// process shader uniforms
		if( shader.uniforms )
		for( var name of Object.keys(shader.uniforms) )
			glsl = shader.uniforms[name].glsl + `\n` + glsl;

		// process shader GLSL code
		glsl = glsl
				.replaceAll( '$$', `main_${prevIndex}` )	// $$ -> main_i
				.replaceAll( '_$', `_${index}` )		    // _$ -> _j
				.replaceAll( '$', `main_${index}` )			// $ -> main_j
				.replaceAll( '\n\t\t', '\n' )				// shilft left two tabs
				+ `\n`;
		
		// add comment with shader name
		glsl =  `\n\n// ====== ${shader.name||'shader'} ======\n` + glsl + `\n\n`;
			
		return glsl;
		
	} // OOPSShader.processShader
	


	updateUniforms( )
	{				
		this._uniforms = {
			tDiffuse: { value: null },
		};

		// scan user-added shaders
		for( var shader of this.shaders ) if( shader.uniforms )
			for( var name of Object.keys(shader.uniforms) )
			{
				var uniform = shader.uniforms[name],
					name = uniform.publicName;
				
				if( name )
				{
					if( typeof this.uniforms[name] === 'undefined' )
						this._uniforms[name] = {};
					
					this._uniforms[name].value = uniform.value;
				}
			} // for name
		// for shader

	} // OOPSShader.updateUniforms

	

} // OOPSShader
			



class OOPSEffects extends EffectComposer
{
	constructor( renderer, scene, camera )
	{
		super( renderer );
		
		// TODO: some effects have their own render passes
		// TODO: maybe in some cases output pass is not used
		this.addPass( new RenderPass( scene, camera ) );
		this.addPass( new OutputPass() );
		
		this.oopsShader = new OOPSShader();
		this._parameters = null;

		this.needsUpdate = true;
		
	} // OOPSEffects.constructor
	
	
	
	addEffect( effectName, bakedParameters={} )
	{
		this.oopsShader.addShader( effectName+'Shader', bakedParameters );
	
		return this; // for chaining
	} // OOPSEffects.addEffect
	

	addParameter( paramName, value1, value2 )
	{
		this.oopsShader.addUniform( paramName, value1, value2 )
		
		var shader = this.oopsShader.shaders[ this.oopsShader.shaders.length-2 ];
		let publicName = shader.uniforms[paramName].publicName;
	
		Object.defineProperty (this, publicName,
			{
				get: function( )
				{ 
					return this.parameters[publicName].value;
				},
				set: function( value )
				{
					this.parameters[publicName].value = value;
				}
			});
				
				
		
		return this; // for chaining
	} // OOPSEffects.addParameter


	render( deltaTime )
	{
		if( this.needsUpdate ) this.update( );
		
		super.render( deltaTime );
	} // OOPSEffects.render
	
	
	get parameters( )
	{
		if( this.needsUpdate ) this.update( );
		return this._parameters;
	} // OOPSEffects.render
	
	
	update( )
	{
//		console.log('Update');
		
		this.needsUpdate = false;
		
//		if( this.oopsShader.needsCompile ) this.oopsShader.compileShaders( );
		
		var oopsShaderPass = new ShaderPass( this.oopsShader );
		this.insertPass( oopsShaderPass, 1 );
		this._parameters = oopsShaderPass.uniforms;
	} // OOPSEffects.update
	
} // OOPSEffects




export { OOPSShader, OOPSEffects };
