/*
	class Effects:EffectComposer( renderer, options={} )
	
	properties
		.oopsShader : OOPSShader 				-- the current (i.e. last) shader
		.oopsShaders = [OOPSShader,...] 		-- all shaders
		.width : int
		.height : int
		.parameters = []
		.shaders = []
	methods
		.split( )
		.addEffect( effectName, bakedParameters={} )
		.addParameter( paramName, value1, value2 )
		.render( scene, camera, deltaTime )
*/

import { Vector2, Vector3, Color } from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
			
import { OOPSShader } from './oops.shader.js';
import { OOPSPass } from './oops.pass.js';


console.log( `

     :
 '.  _  .'
-=  (~)  =-     OOPS.JS
 .'  #  '.
 
` )




class Effects extends EffectComposer
{
	constructor( renderer, options={} )
	{
		super( renderer );

		this.renderPass = new RenderPass( /*scene, camera*/ );
		
		this.addPass( this.renderPass );
		this.addPass( new OutputPass() );
		
		this.oopsShader = new OOPSShader( options ); // the current (i.e. last) shader
		this.oopsShaders = [this.oopsShader]; // all shaders
		
		this.width = renderer.domElement.clientWidth;
		this.height = renderer.domElement.clientHeight;

		this.needsRebuild = true;
		this._parameters = [];
		
	} // Effects.constructor
	
	

	split( )
	{
		this.oopsShader = new OOPSShader( );
		this.oopsShaders.push( this.oopsShader );
		
		return this; // for chaining
		
	} // Effects.split
	
	
	
	addEffect( effectName, bakedParameters={} )
	{
		if( this.oopsShader.shouldSplit( effectName+'Shader' ) ) this.split( );
		
		this.oopsShader.addShader( effectName+'Shader', bakedParameters/*, this*/ );
		//this.oopsShader.addAutoUniforms( );
	
		return this; // for chaining
		
	} // Effects.addEffect
	
	

	addParameter( paramName, value1, value2 )
	{
		this.oopsShader.addUniform( paramName, value1, value2 )
		
		var shader = this.oopsShader.shaders[ this.oopsShader.shaders.length-2 ];
		let publicName = shader.uniforms[paramName].publicName;

		if( shader.uniforms[paramName].auto )
		{
			throw new Error( `Parameter "${paramName}" is internaly set. It cannot be added as parameter with addParameter(...).\n` );
		}
	
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
	} // Effects.addParameter



	render( scene, camera, deltaTime )
	{
		if( this.needsRebuild ) this.#rebuild( );
		
		this.renderPass.scene = scene;
		this.renderPass.camera = camera;
		
		super.render( deltaTime );
	} // Effects.render
	
	
	
	get parameters( )
	{
		if( this.needsRebuild ) this.#rebuild( );
		return this._parameters;
	} // Effects.parameters
	
	
	
	get shaders( )
	{
		if( this.needsRebuild ) this.#rebuild( );
		return this.oopsShaders;
	} // Effects.shaders
	
	
	
	#rebuild( )
	{

//console.log('Effects.#rebuild()');

		this.needsRebuild = false;

		// remove all intermediate passes (keep the first
		// and the last ones, they are RenderPass and OutputPass)
		while( this.passes.length > 2 )
		{
			this.passes[1].dispose();
			this.remove( this.passes[1] );
		}
		
		// create and insert new passes between the
		// RenderPass and OutpotPass. Each new pass
		// corresponds to a shader in oopsShaders[]
		var index = 0;
		for( var shader of this.oopsShaders )
		{
			var shaderPass;
			var customPass = shader.shaders[1].onPass;

			if( customPass )
				shaderPass = new customPass( shader );
			else
				shaderPass = new OOPSPass( shader );
			
			index++;
			this.insertPass( shaderPass, index );
			this._parameters = {...this._parameters, ...shaderPass.uniforms};
		}
		
//console.log('Effects.passes =',this.passes);
	} // Effects.update
	
} // OEffects




export { OOPSShader, Effects };
