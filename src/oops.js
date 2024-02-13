﻿import { Vector2, Vector3, Color } from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
//import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
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
		
		// TODO: some effects have their own render passes
		// TODO: maybe in some cases output pass is not used
		
		this.renderPass = new RenderPass( /*scene, camera*/ );
		
		this.addPass(  this.renderPass );
		this.addPass( new OutputPass() );
		
		this.oopsShader = new OOPSShader( options ); // the current (i.e. last) shader
		this.oopsShaders = [this.oopsShader]; // all shaders
		
		this._parameters = [];
		
		this.width = renderer.domElement.clientWidth;
		this.height = renderer.domElement.clientHeight;

		this.needsUpdate = true;
		
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
		
		this.oopsShader.addShader( effectName+'Shader', bakedParameters );
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
		if( this.needsUpdate ) this.update( );
		
		this.renderPass.scene = scene;
		this.renderPass.camera = camera;
		
		super.render( deltaTime );
	} // Effects.render
	
	
	get parameters( )
	{
		if( this.needsUpdate ) this.update( );
		return this._parameters;
	} // Effects.parameters
	
	
	get shaders( )
	{
		if( this.needsUpdate ) this.update( );
		return this.oopsShaders;
	} // Effects.shaders
	
	
	update( )
	{
		this.needsUpdate = false;
		
		var index = 0;
		for( var shader of this.oopsShaders )
		{
			var shaderPass = new OOPSPass( shader );
			
			index++;
			this.insertPass( shaderPass, index );
			this._parameters = {...this._parameters, ...shaderPass.uniforms};
		}
	} // Effects.update
	
} // OEffects




export { OOPSShader, Effects };
