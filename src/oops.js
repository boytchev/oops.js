import { Vector2, Vector3, Color } from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
			
import { OOPSShader } from './oops.shader.js';


console.log( `

     :
 '.  _  .'
-=  (~)  =-     OOPS.JS
 .'  #  '.
 
` )


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
		this.needsUpdate = false;
		
		var oopsShaderPass = new ShaderPass( this.oopsShader );
		this.insertPass( oopsShaderPass, 1 );
		this._parameters = oopsShaderPass.uniforms;
	} // OOPSEffects.update
	
} // OOPSEffects




export { OOPSShader, OOPSEffects };
